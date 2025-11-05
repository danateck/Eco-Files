import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Pool } from 'pg';
import admin from 'firebase-admin';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const allowed = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: function (origin, cb) {
    // allow no-origin (curl/Postman) and any of the allowed origins
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error('CORS blocked'), false);
  },
  credentials: true
}));

app.use(express.json());

// --- Optional: Firebase Admin (strongly recommended in prod) ---
let verifyIdToken = async () => null;
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  });
  verifyIdToken = async (token) => (await admin.auth().verifyIdToken(token))?.email?.toLowerCase();
}

// Ensure user exists
async function ensureUser(email) {
  await pool.query(
    `INSERT INTO app_users(email) VALUES($1)
     ON CONFLICT (email) DO NOTHING`,
    [email]
  );
}

// Auth middleware
async function auth(req, res, next) {
  try {
    let email = null;
    const m = (req.headers.authorization || '').match(/^Bearer (.+)$/i);
    if (m) {
      try { email = await verifyIdToken(m[1]); } catch {}
    }
    // DEV fallback (remove in production!)
    if (!email && req.headers['x-dev-email']) {
      email = String(req.headers['x-dev-email']).toLowerCase();
    }
    if (!email) return res.status(401).json({ error: 'Unauthenticated' });

    req.userEmail = email;
    await ensureUser(email);
    next();
  } catch (e) {
    console.error('auth error', e);
    res.status(401).json({ error: 'Unauthenticated' });
  }
}

// Routes
app.get('/api/docs', auth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, title, file_name, mime_type, file_size, category, year, org,
            recipient, shared_with, warranty_start, warranty_expires_at, auto_delete_after,
            uploaded_at, last_modified, (file_url IS NOT NULL) AS has_remote_url
     FROM documents
     WHERE owner_email = $1
     ORDER BY uploaded_at DESC`,
    [req.userEmail]
  );
  res.json(rows);
});

app.post('/api/docs', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File is required' });

    const {
      title, category, year, org, recipient,
      warrantyStart, warrantyExpiresAt, autoDeleteAfter
    } = req.body;

    const recipients = recipient ? JSON.parse(recipient) : [];

    const { rows } = await pool.query(
      `INSERT INTO documents(
         owner_email, title, file_name, mime_type, file_size, category, year, org,
         recipient, shared_with, warranty_start, warranty_expires_at, auto_delete_after, file_data
       )
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING id, uploaded_at`,
      [
        req.userEmail,
        title || req.file.originalname,
        req.file.originalname,
        req.file.mimetype,
        req.file.size || null,
        category || null, year || null, org || null,
        JSON.stringify(recipients), [],
        warrantyStart || null, warrantyExpiresAt || null, autoDeleteAfter || null,
        req.file.buffer
      ]
    );

    res.json({
      id: rows[0].id,
      title: title || req.file.originalname,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size || null,
      category: category || null,
      year: year || null,
      org: org || null,
      recipient: recipients,
      uploadedAt: rows[0].uploaded_at
    });
  } catch (e) {
    console.error('upload error', e);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/api/docs/:id/download', auth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT file_name, mime_type, file_data
       FROM documents
      WHERE id = $1
        AND owner_email = $2`,
    [req.params.id, req.userEmail]
  );
  if (!rows.length) return res.status(404).end();
  res.setHeader('Content-Type', rows[0].mime_type);
  res.setHeader('Content-Disposition', `attachment; filename="${rows[0].file_name}"`);
  res.send(rows[0].file_data);
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`EcoDocs API running on :${PORT}`));
