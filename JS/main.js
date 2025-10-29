// main.js - גרסה עם IndexedDB לשמירת קבצים גדולים בצורה יציבה

/*************************
 * 0. IndexedDB helpers  *
 *************************/

// נפתח/ניצור DB בשם "docArchiveDB" עם טבלה "files"
// בקי לכל קובץ: id (המזהה של הדוקומנט)
// value שמור זה ה-base64 (dataURL)

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("docArchiveDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" });
      }
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (e) => {
      reject(e.target.error);
    };
  });
}

// שמירת קובץ (base64) ב-IndexedDB
async function saveFileToDB(docId, dataUrl) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["files"], "readwrite");
    const store = tx.objectStore("files");
    store.put({ id: docId, dataUrl });
    tx.oncomplete = () => resolve(true);
    tx.onerror = (e) => reject(e.target.error);
  });
}

// שליפה של קובץ מה-DB לפי docId
async function loadFileFromDB(docId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["files"], "readonly");
    const store = tx.objectStore("files");
    const req = store.get(docId);
    req.onsuccess = () => {
      if (req.result) resolve(req.result.dataUrl);
      else resolve(null);
    };
    req.onerror = (e) => {
      reject(e.target.error);
    };
  });
}

// מחיקה של קובץ מה-DB (אם מוחקים לצמיתות)
async function deleteFileFromDB(docId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["files"], "readwrite");
    const store = tx.objectStore("files");
    store.delete(docId);
    tx.oncomplete = () => resolve(true);
    tx.onerror = (e) => reject(e.target.error);
  });
}


/*************************
 * 1. קטגוריות / מילות מפתח
 *************************/

const CATEGORY_KEYWORDS = {
  "כלכלה": [
    "חשבון","חשבונית","חשבונית מס","חשבוניתמס","חשבוניתמס קבלה","קבלה","קבלות",
    "ארנונה","ארנונה מגורים","ארנונה לבית","סכום לתשלום","סכום לתשלום מיידי",
    "בנק","בנק הפועלים","בנק לאומי","בנק דיסקונט","יתרה","מאזן","עובר ושב","עו\"ש",
    "אשראי","כרטיס אשראי","פירוט אשראי","פירוט כרטיס","חיוב אשראי",
    "תשלום","תשלומים","הוראת קבע","הוראתקבע","חיוב חודשי","חיוב חודשי לכרטיס",
    "משכנתא","הלוואה","הלוואות","יתרת הלוואה","פירעון","ריבית","ריביות",
    "משכורת","משכורת חודשית","משכורת נטו","שכר","שכר עבודה","שכר חודשי","שכר נטו",
    "תלוש","תלוש שכר","תלושי שכר","תלושמשכורת","תלושמשכורת חודשי",
    "ביטוח לאומי","ביטוחלאומי","ביטוח לאמי","ביטוח לאומי ישראל",
    "דמי אבטלה","אבטלה","מענק","גמלה","קצבה","קיצבה","קיצבה חודשית","פנסיה","קרן פנסיה","קרןפנסיה",
    "קופת גמל","קופתגמל","גמל","פנסיוני","פנסיונית",
    "מס הכנסה","מסהכנסה","מס הכנסה שנתי","דו\"ח שנתי","דו\"ח מס","דוח מס","מס שנתי",
    "החזר מס","החזרי מס","החזרמס","מע\"מ","מעמ","דיווח מע\"מ","דוח מע\"מ","דו\"ח מע\"מ",
    "ביטוח רכב","ביטוח רכב חובה","ביטוח חובה","ביטוח מקיף","ביטוחדירה","ביטוח דירה","פרמיה","פרמיית ביטוח",
    "פוליסה","פוליסת ביטוח","פרמיה לתשלום","חוב לתשלום","הודעת חיוב"
  ],
  "רפואה": [
    "רפואה","רפואי","רפואית","מסמך רפואי","מכתב רפואי","דוח רפואי",
    "מרפאה","מרפאה מומחה","מרפאת מומחים","מרפאת נשים","מרפאת ילדים",
    "קופת חולים","קופתחולים","קופה","קופת חולים כללית","כללית","מכבי","מאוחדת","לאומית",
    "רופא","רופאה","רופא משפחה","רופאת משפחה","רופא ילדים","רופאת ילדים",
    "סיכום ביקור","סיכוםביקור","סיכום מחלה","סיכום אשפוז","סיכום אשפוז ושחרור",
    "מכתב שחרור","שחרור מבית חולים","שחרור מביה\"ח","שחרור מבית חולים כללי",
    "בדיקת דם","בדיקות דם","בדיקות דמים","בדיקה דם","בדיקות מעבדה","מעבדה","בדיקות מעבדה",
    "אבחנה","אבחון","אבחנה רפואית","דיאגנוזה","דיאגניזה","דיאגנוזה רפואית",
    "הפניה","הפנייה","הפניה לבדיקות","הפנייה לרופא מומחה","הפניה לרופא מומחה",
    "תור לרופא","תור לרופאה","זימון תור","זימון בדיקה","זימון בדיקות",
    "מרשם","מרשם תרופות","רשימת תרופות","תרופות","תרופה","טיפול תרופתי",
    "טיפול","טיפול רגשי","טיפול פסיכולוגי","פסיכולוג","פסיכולוגית","טיפול נפשי",
    "חיסון","חיסונים","תעודת התחסנות","פנקס חיסונים","כרטיס חיסונים","תעודת חיסונים",
    "אשפוז","אשפוז יום","מחלקה","בית חולים","ביתחולים","בי\"ח","ביה\"ח",
    "אישור מחלה","אישור מחלה לעבודה","אישור מחלה לבית ספר",
    "אישור רפואי","אישור כשירות","אישור כשירות רפואית",
    "טופס התחייבות","טופס 17","טופס17","התחייבות","התחיבות","התחיבות קופה","התחייבות קופה",
    "בדיקת קורונה","קורונה חיובי","קורונה שלילי","PCR","covid","בדיקת הריון","US","אולטרסאונד",
    "נכות רפואית","ועדה רפואית","קביעת נכות"
  ],
  "עבודה": [
    "חוזה העסקה","חוזה העסקה אישי","חוזה עבודה","חוזה העסקה לעובד","חוזה העסקה לעובדת",
    "מכתב קבלה לעבודה","קבלה לעבודה","מכתב התחלת עבודה","ברוכים הבאים לחברה",
    "אישור העסקה","אישור העסקה רשמי","אישור העסקה לעובד","אישור ותק","אישור שנות ותק","אישור ניסיון תעסוקתי",
    "תלוש שכר","תלוששכר","תלוש משכורת","תלושי שכר","תלושי משכורת","שעות נוספות","שעותנוספות","רשימת משמרות","משמרות",
    "שכר עבודה","שכר לשעה","שכר חודשי","טופס שעות","אישור תשלום",
    "הצהרת מעסיק","טופס למעסיק","אישור מעסיק","אישור העסקה לצורך ביטוח לאומי",
    "מכתב פיטורים","מכתב סיום העסקה","הודעה מוקדמת","שימוע לפני פיטורים","פיטורים","פיטורין",
    "סיום העסקה","סיום יחסי עובד מעביד","יחסי עובד מעביד","עובד","מעסיק","מעסיקה",
    "הערכת עובד","הערכת ביצועים","דו\"ח ביצועים","חוות דעת מנהל","משוב עובד"
  ],
  "בית": [
    "חוזה שכירות","חוזהשכירות","הסכם שכירות","הסכםשכירות","שוכר","שוכרת","שוכרים","משכיר","משכירה","דירה",
    "נכס","נכס מגורים","כתובת מגורים","מגורים קבועים","עדכון כתובת","הצהרת מגורים",
    "ועד בית","ועדבית","ועד בית חודשי","תשלום ועד בית","גביית ועד בית","ועד בניין",
    "חברת חשמל","חברת החשמל","חשמל","חשבון חשמל","קריאת מונה","מונה חשמל",
    "גז","חברת גז","קריאת מונה גז","מים","תאגיד מים","חשבון מים","מים חודשי",
    "אינטרנט","ספק אינטרנט","ראוטר","נתב","חשבונית אינטרנט","הוט","יס","HOT","yes","סיבים","סיבים אופטיים",
    "ארנונה","ארנונה מגורים","חוב ארנונה","דרישת תשלום ארנונה","ארנונה עירייה","עירייה",
    "גירושין","הסכם גירושין","צו גירושין","משמורת","צו משמורת","משמורת ילדים",
    "הסדרי ראייה","הסדרי ראיה","מזונות","דמי מזונות","תשלום מזונות","משפחה","משפחתי","הורה משמורן","הורה משמורנית"
  ],
  "אחריות": [
    "אחריות","אחריות למוצר","אחריות מוצר","אחריות יצרן","אחריות יבואן","אחריות יבואן רשמי",
    "אחריות יבואן מורשה","אחריות לשנה","אחריות לשנתיים","אחריות ל12 חודשים","אחריות ל-12 חודשים",
    "אחריות ל24 חודשים","אחריות ל-24 חודשים","שנת אחריות","שנתיים אחריות","תום אחריות",
    "תאריך אחריות","תום תקופת האחריות","סיומה של האחריות","פג תוקף אחריות","פג תוקף האחריות",
    "תעודת אחריות","ת.אחריות","ת. אחריות","תעודת-אחריות","כרטיס אחריות",
    "הוכחת קנייה","הוכחת קניה","אישור רכישה","חשבונית קנייה","תעודת משלוח","תעודת מסירה",
    "מספר סידורי","serial number","imei","rma","repair ticket","repair order"
  ],
  "תעודות": [
    "תעודת זהות","ת.ז","תז","תעודת לידה","ספח","ספח תעודת זהות","ספח ת.ז",
    "רישיון נהיגה","רישיון רכב","דרכון","passport","דרכון ביומטרי",
    "תעודת התחסנות","כרטיס חיסונים","אישור לימודים","אישור סטודנט","אישור תלמיד",
    "אישור מגורים","אישור כתובת","אישור תושבות"
  ],
  "עסק": [
    "עוסק מורשה","עוסק פטור","תיק עוסק","חשבונית מס","דיווח מע\"מ","עוסק מורשה פעיל",
    "חברה בע\"מ","ח.פ","מספר עוסק","הצעת מחיר","חשבונית ללקוח","ספק"
  ],
  "אחר": []
};

const CATEGORIES = [
  "כלכלה",
  "רפואה",
  "עבודה",
  "בית",
  "אחריות",
  "תעודות",
  "עסק",
  "אחר"
];

/*********************
 * 2. LocalStorage   *
 *********************/

const STORAGE_KEY = "docArchiveUsers";
const CURRENT_USER_KEY = "docArchiveCurrentUser";

function loadAllUsersDataFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error("Couldn't parse storage", e);
    return {};
  }
}

function saveAllUsersDataToStorage(allUsersData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsersData));
}

function getCurrentUser() {
  return localStorage.getItem(CURRENT_USER_KEY);
}

function getUserDocs(username, allUsersData) {
  return allUsersData[username]?.docs || [];
}

function setUserDocs(username, docsArray, allUsersData) {
  if (!allUsersData[username]) {
    allUsersData[username] = { password: "", docs: [] };
  }
  allUsersData[username].docs = docsArray;
  saveAllUsersDataToStorage(allUsersData);
}

/*********************
 * 3. Utilities      *
 *********************/

function normalizeWord(word) {
  if (!word) return "";
  let w = word.trim().toLowerCase();
  if (w.startsWith("ו") && w.length > 1) {
    w = w.slice(1);
  }
  w = w.replace(/[",.():\[\]{}]/g, "");
  return w;
}

function guessCategoryForFileNameOnly(fileName) {
  const base = fileName.replace(/\.[^/.]+$/, "");
  const parts = base.split(/[\s_\-]+/g);
  const scores = {};

  for (const rawWord of parts) {
    const cleanWord = normalizeWord(rawWord);
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const kw of keywords) {
        const cleanKw = normalizeWord(kw);
        if (cleanWord.includes(cleanKw) || cleanKw.includes(cleanWord)) {
          if (!scores[cat]) scores[cat] = 0;
          scores[cat] += 1;
        }
      }
    }
  }

  let best = "אחר";
  let bestScore = 0;
  for (const [cat, sc] of Object.entries(scores)) {
    if (sc > bestScore) {
      best = cat;
      bestScore = sc;
    }
  }
  return best;
}

// OCR PDF
async function extractTextFromPdfWithOcr(file) {
  if (!window.pdfjsLib) return "";
  const arrayBuf = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuf }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: ctx, viewport }).promise;

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!window.Tesseract) return "";

  const { data } = await window.Tesseract.recognize(blob, "heb+eng", {
    tessedit_pageseg_mode: 6,
  });
  return data && data.text ? data.text : "";
}

// חילוץ אחריות אוטומטי
function extractWarrantyFromText(rawTextInput) {
  let rawText = "";
  if (typeof rawTextInput === "string") rawText = rawTextInput;
  else if (rawTextInput instanceof ArrayBuffer)
    rawText = new TextDecoder("utf-8").decode(rawTextInput);
  else rawText = String(rawTextInput || "");

  const rawLower = rawText.toLowerCase();
  const cleaned  = rawText.replace(/\s+/g, " ").trim();
  const lower    = cleaned.toLowerCase();

  function isValidYMD(ymd) {
    if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return false;
    const [Y, M, D] = ymd.split("-").map(n => parseInt(n, 10));
    if (M < 1 || M > 12) return false;
    if (D < 1 || D > 31) return false;
    const dt = new Date(`${Y}-${String(M).padStart(2,"0")}-${String(D).padStart(2,"0")}T00:00:00`);
    return !Number.isNaN(dt.getTime());
  }

  const monthMap = {
    jan:"01", january:"01", feb:"02", february:"02", mar:"03", march:"03",
    apr:"04", april:"04", may:"05", jun:"06", june:"06", jul:"07", july:"07",
    aug:"08", august:"08", sep:"09", sept:"09", september:"09",
    oct:"10", october:"10", nov:"11", november:"11", dec:"12", december:"12",
    ינואר:"01", פברואר:"02", מרץ:"03", מרס:"03", אפריל:"04", מאי:"05",
    יוני:"06", יולי:"07", אוגוסט:"08", ספטמבר:"09", אוקטובר:"10",
    נובמבר:"11", דצמבר:"12",
  };

  function normalizeDateGuess(str) {
    if (!str) return null;
    let s = str
      .trim()
      .replace(/[,]/g, " ")
      .replace(/[^0-9a-zA-Zא-ת]+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const tokens = s.split("-");
    if (tokens.some(t => monthMap[t])) {
      let day = null, mon = null, year = null;
      for (const t of tokens) {
        if (monthMap[t]) mon = monthMap[t];
        else if (/^\d{1,2}$/.test(t) && parseInt(t,10) <= 31 && day === null)
          day = t.padStart(2,"0");
        else if (/^\d{2,4}$/.test(t) && year === null) {
          if (t.length === 4) year = t;
          else {
            const yy = parseInt(t,10);
            year = (yy < 50 ? 2000+yy : 1900+yy).toString();
          }
        }
      }
      if (day && mon && year) {
        const ymd = `${year}-${mon}-${day}`;
        return isValidYMD(ymd) ? ymd : null;
      }
    }

    {
      const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (m) {
        const y  = m[1];
        const mo = m[2].padStart(2,"0");
        const d  = m[3].padStart(2,"0");
        const ymd = `${y}-${mo}-${d}`;
        if (isValidYMD(ymd)) return ymd;
      }
    }

    {
      const m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (m) {
        const d  = m[1].padStart(2,"0");
        const mo = m[2].padStart(2,"0");
        const y  = m[3];
        const ymd = `${y}-${mo}-${d}`;
        if (isValidYMD(ymd)) return ymd;
      }
    }

    {
      const m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{2})$/);
      if (m) {
        const d  = m[1].padStart(2,"0");
        const mo = m[2].padStart(2,"0");
        const yy = parseInt(m[3],10);
        const fullY = (yy < 50 ? 2000+yy : 1900+yy).toString();
        const ymd = `${fullY}-${mo}-${d}`;
        if (isValidYMD(ymd)) return ymd;
      }
    }

    return null;
  }

  function findDateAfterKeywords(keywords, textToSearch) {
    for (const kw of keywords) {
      const pattern =
        kw +
        "[ \\t:]*" +
        "(" +
          "\\d{1,2}[^0-9a-zA-Zא-ת]\\d{1,2}[^0-9a-zA-Zא-ת]\\d{2,4}" +
          "|" +
          "\\d{4}[^0-9a-zA-Zא-ת]\\d{1,2}[^0-9a-zA-Zא-ת]\\d{1,2}" +
          "|" +
          "\\d{1,2}\\s+[a-zא-ת]+\\s+\\d{2,4}" +
        ")";
      const re = new RegExp(pattern, "i");
      const m = textToSearch.match(re);
      if (m && m[1]) {
        const guess = normalizeDateGuess(m[1]);
        if (guess && isValidYMD(guess)) {
          return guess;
        }
      }
    }
    return null;
  }

  let warrantyStart = findDateAfterKeywords([
    "תאריך\\s*ק.?נ.?י.?ה",
    "תאריך\\s*רכישה",
    "תאריך\\s*קניה",
    "תאריך\\s*קנייה",
    "תאריך\\s*הקניה",
    "תאריך\\s*הקנייה",
    "תאריך\\s*חשבונית",
    "ת\\.?\\s*חשבונית",
    "תאריך\\s*תעודת\\s*משלוח",
    "תאריך\\s*משלוח",
    "תאריך\\s*אספקה",
    "תאריך\\s*מסירה",
    "נמסר\\s*בתאריך",
    "נרכש\\s*בתאריך",
    "purchase\\s*date",
    "date\\s*of\\s*purchase",
    "invoice\\s*date",
    "buy\\s*date"
  ], lower);

  let warrantyExpiresAt = findDateAfterKeywords([
    "תוקף\\s*אחריות",
    "תוקף\\s*האחריות",
    "האחריות\\s*בתוקף\\s*עד",
    "בתוקף\\s*עד",
    "אחריות\\s*עד",
    "warranty\\s*until",
    "warranty\\s*expiry",
    "warranty\\s*expires",
    "valid\\s*until",
    "expiry\\s*date",
    "expiration\\s*date"
  ], lower);

  if (!warrantyStart) {
    const headChunkRaw = rawLower.slice(0, 500);
    const headLines = headChunkRaw.split(/\r?\n/);
    for (const line of headLines) {
      const candidateMatch = line.match(/(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4})/);
      if (candidateMatch && candidateMatch[1]) {
        const guess = normalizeDateGuess(candidateMatch[1]);
        if (guess && isValidYMD(guess)) {
          warrantyStart = guess;
          break;
        }
      }
    }
  }

  if (!warrantyStart) {
    const anyDateRegex = /(\d{1,2}[^0-9a-zA-Zא-ת]\d{1,2}[^0-9a-zA-Zא-ת]\d{2,4}|\d{4}[^0-9a-zA-Zא-ת]\d{1,2}[^0-9a-zA-Zא-ת]\d{1,2}|\d{1,2}\s+[a-zא-ת]+\s+\d{2,4})/ig;
    const matches = [...rawLower.matchAll(anyDateRegex)].map(m => m[1]);
    const normalized = [];
    for (const candidate of matches) {
      const ymd = normalizeDateGuess(candidate);
      if (ymd && isValidYMD(ymd)) normalized.push(ymd);
    }
    const unique = [...new Set(normalized)];
    if (unique.length === 1) {
      warrantyStart = unique[0];
    }
  }

  if (!warrantyExpiresAt && warrantyStart && isValidYMD(warrantyStart)) {
    const [Y,M,D] = warrantyStart.split("-");
    const startDate = new Date(`${Y}-${M}-${D}T00:00:00`);
    if (!Number.isNaN(startDate.getTime())) {
      const endDate = new Date(startDate.getTime());
      endDate.setMonth(endDate.getMonth() + 12);
      const yyyy = endDate.getFullYear();
      const mm   = String(endDate.getMonth() + 1).padStart(2, "0");
      const dd   = String(endDate.getDate()).padStart(2, "0");
      warrantyExpiresAt = `${yyyy}-${mm}-${dd}`;
    }
  }

  // מחיקה אחרי 7 שנים מרגע הקנייה
  let autoDeleteAfter = null;
  if (warrantyStart && isValidYMD(warrantyStart)) {
    const [yS,mS,dS] = warrantyStart.split("-");
    const sDate = new Date(`${yS}-${mS}-${dS}T00:00:00`);
    if (!Number.isNaN(sDate.getTime())) {
      const del = new Date(sDate.getTime());
      del.setFullYear(del.getFullYear() + 7);
      const yy = del.getFullYear();
      const mm = String(del.getMonth() + 1).padStart(2, "0");
      const dd = String(del.getDate()).padStart(2, "0");
      autoDeleteAfter = `${yy}-${mm}-${dd}`;
    }
  }

  return {
    warrantyStart:     (warrantyStart     && isValidYMD(warrantyStart))     ? warrantyStart     : null,
    warrantyExpiresAt: (warrantyExpiresAt && isValidYMD(warrantyExpiresAt)) ? warrantyExpiresAt : null,
    autoDeleteAfter
  };
}

// fallback ידני לתאריכים
function fallbackAskWarrantyDetails() {
  const normalizeManualDate = (str) => {
    if (!str) return null;
    let s = str.trim().replace(/[.\/]/g, "-");
    const parts = s.split("-");
    if (parts.length === 3) {
      let [a,b,c] = parts;
      if (a.length === 4) {
        const yyyy = a;
        const mm = b.padStart(2, "0");
        const dd = c.padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      } else if (c.length === 4) {
        const yyyy = c;
        const mm = b.padStart(2, "0");
        const dd = a.padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      }
    }
    return s;
  };

  const startAns = prompt(
    "לא הצלחתי לזהות אוטומטית.\nמה תאריך הקנייה? (למשל 28/10/2025)"
  );
  const expAns = prompt(
    "עד מתי האחריות בתוקף? (למשל 28/10/2026)\nאם אין אחריות/לא רלוונטי אפשר לבטל."
  );

  const warrantyStart = startAns ? normalizeManualDate(startAns) : null;
  const warrantyExpiresAt = expAns ? normalizeManualDate(expAns) : null;

  let autoDeleteAfter = null;
  if (warrantyStart && /^\d{4}-\d{2}-\d{2}$/.test(warrantyStart)) {
    const delDate = new Date(warrantyStart + "T00:00:00");
    delDate.setFullYear(delDate.getFullYear() + 7);
    autoDeleteAfter = delDate.toISOString().split("T")[0];
  }

  return {
    warrantyStart,
    warrantyExpiresAt,
    autoDeleteAfter
  };
}

// טוסט
function showNotification(message, isError = false) {
  const box = document.getElementById("notification");
  if (!box) return;
  box.textContent = message;
  box.className = "notification show" + (isError ? " error" : "");
  setTimeout(() => {
    box.className = "notification hidden";
  }, 4000);
}

// ניקוי אוטומטי לאחר שפג תאריך המחיקה
function purgeExpiredWarranties(docsArray) {
  const today = new Date();
  let changed = false;
  for (let i = docsArray.length - 1; i >= 0; i--) {
    const d = docsArray[i];
    if (d.category && d.category.includes("אחריות") && d.autoDeleteAfter) {
      const deleteOn = new Date(d.autoDeleteAfter + "T00:00:00");
      if (today > deleteOn) {
        // גם מוחקים את הקובץ בפועל מה-DB
        deleteFileFromDB(d.id).catch(() => {});
        docsArray.splice(i, 1);
        changed = true;
      }
    }
  }
  return changed;
}

// מיון לתצוגה
let currentSortField = "uploadedAt";
let currentSortDir   = "desc";

function sortDocs(docsArray) {
  const arr = [...docsArray];
  arr.sort((a, b) => {
    let av = a[currentSortField];
    let bv = b[currentSortField];

    if (
      currentSortField === "uploadedAt" ||
      currentSortField === "warrantyExpiresAt" ||
      currentSortField === "autoDeleteAfter" ||
      currentSortField === "warrantyStart"
    ) {
      const ad = av ? new Date(av) : new Date(0);
      const bd = bv ? new Date(bv) : new Date(0);
      if (ad < bd) return currentSortDir === "asc" ? -1 : 1;
      if (ad > bd) return currentSortDir === "asc" ? 1 : -1;
      return 0;
    }

    if (currentSortField === "year") {
      const an = parseInt(av ?? 0, 10);
      const bn = parseInt(bv ?? 0, 10);
      if (an < bn) return currentSortDir === "asc" ? -1 : 1;
      if (an > bn) return currentSortDir === "asc" ? 1 : -1;
      return 0;
    }

    av = (av ?? "").toString().toLowerCase();
    bv = (bv ?? "").toString().toLowerCase();
    if (av < bv) return currentSortDir === "asc" ? -1 : 1;
    if (av > bv) return currentSortDir === "asc" ? 1 : -1;
    return 0;
  });
  return arr;
}

/*********************
 * 4. אפליקציה / UI  *
 *********************/

document.addEventListener("DOMContentLoaded", async () => {
  const currentUser   = getCurrentUser();
  if (!currentUser) {
    // אם אין משתמש שמור, אפשר פשוט לבחור "ברירת מחדל"
    // או להפנות למסך התחברות אם יש לך אחד
    localStorage.setItem(CURRENT_USER_KEY, "defaultUser");
  }

  const userNow = getCurrentUser() || "defaultUser";

  const homeView      = document.getElementById("homeView");
  const folderGrid    = document.getElementById("folderGrid");
  const categoryView  = document.getElementById("categoryView");
  const categoryTitle = document.getElementById("categoryTitle");
  const docsList      = document.getElementById("docsList");
  const backButton    = document.getElementById("backButton");
  const uploadBtn     = document.getElementById("uploadBtn");
  const fileInput     = document.getElementById("fileInput");
  const sortSelect    = document.getElementById("sortSelect");

  // אלמנטים של מודאל עריכה
  const editModal           = document.getElementById("editModal");
  const editForm            = document.getElementById("editForm");
  const editCancelBtn       = document.getElementById("editCancelBtn");

  const edit_title          = document.getElementById("edit_title");
  const edit_org            = document.getElementById("edit_org");
  const edit_year           = document.getElementById("edit_year");
  const edit_recipient      = document.getElementById("edit_recipient");
  const edit_warrantyStart  = document.getElementById("edit_warrantyStart");
  const edit_warrantyExp    = document.getElementById("edit_warrantyExpiresAt");
  const edit_autoDelete     = document.getElementById("edit_autoDeleteAfter");
  const edit_category       = document.getElementById("edit_category");
  const edit_sharedWith     = document.getElementById("edit_sharedWith");

  let currentlyEditingDocId = null;

  // טוענים נתונים מה- localStorage
  let allUsersData = loadAllUsersDataFromStorage();
  let allDocsData  = getUserDocs(userNow, allUsersData);

function normalizeEmail(e) { return (e || "").trim().toLowerCase(); }

  // === INIT shared fields (run once after loading allUsersData/allDocsData) ===
function ensureUserSharedFields(allUsersData, username) {
  if (!allUsersData[username]) allUsersData[username] = { password: "", docs: [] };
  const u = allUsersData[username];

  // אם אין email, ננסה לקבוע:
  // 1) אם שם המשתמש נראה כמו מייל – נשמור אותו כ-email
  // 2) אחרת נשמור את השם כ-email לוגי, כדי שתמיד תהיה לנו זהות יציבה
  if (!u.email) {
    const looksLikeEmail = /.+@.+\..+/.test(username);
    u.email = looksLikeEmail ? username : (u.email || username);
  }

  if (!u.sharedFolders) u.sharedFolders = {};
  if (!u.incomingShareRequests) u.incomingShareRequests = [];
  if (!u.outgoingShareRequests) u.outgoingShareRequests = [];
}


function findUsernameByEmail(allUsersData, email) {
  const target = normalizeEmail(email);
  for (const [uname, u] of Object.entries(allUsersData)) {
    const userEmail = normalizeEmail(u.email || uname);
    if (userEmail === target) return uname;
  }
  return null;
}
ensureUserSharedFields(allUsersData, userNow);
saveAllUsersDataToStorage(allUsersData);
          
  if (!allDocsData || allDocsData.length === 0) {
    allDocsData = [];
    setUserDocs(userNow, allDocsData, allUsersData);
  }

  // מסירים אחריות שפג תוקפה
  const removed = purgeExpiredWarranties(allDocsData);
  if (removed) {
    setUserDocs(userNow, allDocsData, allUsersData);
    showNotification("מסמכי אחריות ישנים הוסרו אוטומטית");
  }

  // כפתורי התיקיות בעמוד הבית
  function renderFolderItem(categoryName) {
    const folder = document.createElement("button");
    folder.className = "folder-card";
    folder.setAttribute("data-category", categoryName);

    folder.innerHTML = `
      <div class="folder-icon"></div>
      <div class="folder-label">${categoryName}</div>
    `;

    folder.addEventListener("click", () => {
      openCategoryView(categoryName);
    });

    folderGrid.appendChild(folder);
  }

  function renderHome() {
    folderGrid.innerHTML = "";
    CATEGORIES.forEach(cat => {
      renderFolderItem(cat);
    });

    homeView.classList.remove("hidden");
    categoryView.classList.add("hidden");
  }

  function buildDocCard(doc, mode) {
    const card = document.createElement("div");
    card.className = "doc-card";

    const warrantyBlock =
      (doc.category && doc.category.includes("אחריות")) ?
      `
        <span>הועלה ב: ${doc.uploadedAt || "-"}</span>
        <span>תאריך קנייה: ${doc.warrantyStart || "-"}</span>
        <span>תוקף אחריות עד: ${doc.warrantyExpiresAt || "-"}</span>
        <span>מחיקה אוטומטית אחרי: ${doc.autoDeleteAfter || "-"}</span>
      `
      : `
        <span>הועלה ב: ${doc.uploadedAt || "-"}</span>
      `;

    const openFileButtonHtml = `
      <button class="doc-open-link"
              data-open-id="${doc.id}">
        פתיחת קובץ
      </button>
    `;

    card.innerHTML = `
      <p class="doc-card-title">${doc.title}</p>

      <div class="doc-card-meta">
        <span>ארגון: ${doc.org || "לא ידוע"}</span>
        <span>שנה: ${doc.year || "-"}</span>
        <span>שייך ל: ${doc.recipient?.join(", ") || "-"}</span>
        ${warrantyBlock}
      </div>

      ${openFileButtonHtml}

      <div class="doc-actions"></div>
    `;

    const actions = card.querySelector(".doc-actions");

    if (mode !== "recycle") {
      const editBtn = document.createElement("button");
      editBtn.className = "doc-action-btn";
      editBtn.textContent = "עריכה ✏️";
      editBtn.addEventListener("click", () => {
        openEditModal(doc);
      });
      actions.appendChild(editBtn);

      const trashBtn = document.createElement("button");
      trashBtn.className = "doc-action-btn danger";
      trashBtn.textContent = "העבר לסל מחזור 🗑️";
      trashBtn.addEventListener("click", () => {
        markDocTrashed(doc.id, true);

        const currentCat = categoryTitle.textContent;
        if (currentCat === "אחסון משותף") {
          openSharedView();
        } else if (currentCat === "סל מחזור") {
          openRecycleView();
        } else {
          openCategoryView(currentCat);
        }
      });
      actions.appendChild(trashBtn);

      // כפתור: הכנס לתיקייה משותפת
const addToSharedBtn = document.createElement("button");
addToSharedBtn.className = "doc-action-btn";
addToSharedBtn.textContent = "הכנס לתיקייה משותפת";
addToSharedBtn.addEventListener("click", () => {
  const me = allUsersData[userNow];
  openSharedFolderPicker(me, (folderId) => {
    const docId = doc.id;
    const i = allDocsData.findIndex(d => d.id === docId);
    if (i > -1) {
      allDocsData[i].sharedFolderId = folderId;
      setUserDocs(userNow, allDocsData, allUsersData);
      showNotification("המסמך שויך לתיקייה המשותפת");
      const currentCat = categoryTitle.textContent;
      if (currentCat === "אחסון משותף") {
        openSharedView();
      } else if (currentCat === "סל מחזור") {
        openRecycleView();
      } else {
        openCategoryView(currentCat);
      }
    }
  });
});

actions.appendChild(addToSharedBtn);


    } else {
      const restoreBtn = document.createElement("button");
      restoreBtn.className = "doc-action-btn restore";
      restoreBtn.textContent = "שחזור ♻️";
      restoreBtn.addEventListener("click", () => {
        markDocTrashed(doc.id, false);
        openRecycleView();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "doc-action-btn danger";
      deleteBtn.textContent = "מחיקה לצמיתות 🗑️";
      deleteBtn.addEventListener("click", () => {
        deleteDocForever(doc.id);
        openRecycleView();
      });

      actions.appendChild(restoreBtn);
      actions.appendChild(deleteBtn);
    }

    return card;
  }

  function openCategoryView(categoryName) {
    categoryTitle.textContent = categoryName;

    let docsForThisCategory = allDocsData.filter(doc =>
      doc.category &&
      doc.category.includes(categoryName) &&
      !doc._trashed
    );

    docsForThisCategory = sortDocs(docsForThisCategory);

    docsList.innerHTML = "";
    docsForThisCategory.forEach(doc => {
      const card = buildDocCard(doc, "normal");
      docsList.appendChild(card);
    });

    homeView.classList.add("hidden");
    categoryView.classList.remove("hidden");
  }

  function renderDocsList(docs, mode = "normal") {
    const sortedDocs = sortDocs(docs);
    docsList.innerHTML = "";
    sortedDocs.forEach(doc => {
      const card = buildDocCard(doc, mode);
      docsList.appendChild(card);
    });

    homeView.classList.add("hidden");
    categoryView.classList.remove("hidden");
  }

  // === HELPER: אסוף מסמכים מכל המשתמשים לתיקייה משותפת מסוימת ===
function collectSharedFolderDocs(allUsersData, folderId) {
  const list = [];
  for (const [uname, u] of Object.entries(allUsersData)) {
    const docs = (u.docs || []);
    for (const d of docs) {
      if (!d._trashed && d.sharedFolderId === folderId) {
        // מצרפים גם שם מעלה המסמך:
        list.push({ ...d, _ownerEmail: u.email || uname });
      }
    }
  }
  return list;
}


// ===== Smart Shared-Folder Picker (modal) =====
function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else el.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    if (typeof c === "string") el.appendChild(document.createTextNode(c));
    else el.appendChild(c);
  });
  return el;
}

function openSharedFolderPicker(me, onSelect) {
  const folders = Object.entries(me.sharedFolders || {}); // [ [fid, {name,...}], ... ]
  if (!folders.length) {
    showNotification("אין לך עדיין תיקיות משותפות. צרי אחת במסך 'אחסון משותף'.", true);
    return;
  }

  // Overlay
  const overlay = createEl("div", { style: {
    position: "fixed", inset: "0", background: "rgba(0,0,0,.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: "10000", fontFamily: "Rubik,system-ui,sans-serif"
  }});

  const panel = createEl("div", { style: {
    background: "#fff", color:"#000", width:"min(520px, 92vw)", maxHeight:"80vh",
    borderRadius:"12px", padding:"12px", boxShadow:"0 18px 44px rgba(0,0,0,.45)",
    display: "grid", gridTemplateRows:"auto auto 1fr auto", gap:"10px"
  }});

  const title = createEl("div", { style:{fontWeight:"700"} }, "בחרי תיקייה משותפת");
  const search = createEl("input", { type:"text", placeholder:"חיפוש לפי שם תיקייה...", style:{
    padding:".5rem", border:"1px solid #bbb", borderRadius:"8px", width:"100%"
  }});
  const listWrap = createEl("div", { style:{
    overflow:"auto", border:"1px solid #eee", borderRadius:"8px", padding:"6px"
  }});
  const btnRow = createEl("div", { style:{ display:"flex", gap:"8px", justifyContent:"flex-end" }});
  const cancelBtn = createEl("button", { class:"doc-action-btn", style:{background:"#b63a3a", color:"#fff"}}, "בטל");
  const chooseBtn = createEl("button", { class:"doc-action-btn", style:{background:"#0e3535", color:"#fff"}}, "בחרי");

  btnRow.append(cancelBtn, chooseBtn);
  panel.append(title, search, listWrap, btnRow);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  let selectedId = null;

  function renderList(filter = "") {
    listWrap.innerHTML = "";
    const norm = (s) => (s||"").toString().toLowerCase().trim();
    const f = norm(filter);
    const filtered = folders.filter(([fid, fobj]) => norm(fobj.name).includes(f));

    filtered.forEach(([fid, fobj]) => {
      const row = createEl("label", { style:{
        display:"grid", gridTemplateColumns:"24px 1fr", alignItems:"center",
        gap:"8px", padding:"6px", borderRadius:"6px", cursor:"pointer"
      }});
      row.addEventListener("mouseover", () => row.style.background = "#f7f7f7");
      row.addEventListener("mouseout",  () => row.style.background = "transparent");

      const radio = createEl("input", { type:"radio", name:"sf_pick", value: fid });
      const name  = createEl("div", {}, `${fobj.name}  `);
      row.append(radio, name);
      listWrap.appendChild(row);

      radio.addEventListener("change", () => { selectedId = fid; });
    });

    if (!filtered.length) {
      listWrap.appendChild(createEl("div", { style:{opacity:.7, padding:"8px"}}, "לא נמצאו תיקיות מתאימות"));
    }
  }

  renderList();
  search.addEventListener("input", () => renderList(search.value));

  cancelBtn.onclick = () => { overlay.remove(); };
  chooseBtn.onclick = () => {
    if (!selectedId) { showNotification("בחרי תיקייה מהרשימה", true); return; }
    overlay.remove();
    if (typeof onSelect === "function") onSelect(selectedId);
  };
}



// === UI: רינדור ניהול תיקיות משותפות + בקשות ממתינות ===
function openSharedView() {
  categoryTitle.textContent = "אחסון משותף";
  docsList.innerHTML = "";

  const me = allUsersData[userNow];
  const myEmail = (me.email || userNow);

  // קונטיינר עליון לניהול תיקיות
  const manage = document.createElement("div");
  manage.className = "shared-manage";
  manage.style.display = "grid";
  manage.style.gap = "12px";
  manage.style.marginBottom = "16px";

  // יצירת תיקייה
  const createRow = document.createElement("div");
  createRow.innerHTML = `
    <strong>תיקיות משותפות</strong><br>
    <input id="sf_new_name" placeholder="שם תיקייה חדשה" style="padding:.4rem; border:1px solid #bbb; border-radius:6px;">
    <button id="sf_create_btn" class="doc-action-btn">צור תיקייה</button>
  `;
  manage.appendChild(createRow);

  // רשימת תיקיות קיימות
  const listRow = document.createElement("div");
  listRow.innerHTML = `<div id="sf_list" style="display:flex; flex-direction:column; gap:8px;"></div>`;
  manage.appendChild(listRow);

  // בקשות ממתינות
  const pendingRow = document.createElement("div");
  pendingRow.innerHTML = `
    <strong>בקשות ממתינות</strong>
    <div id="sf_pending" style="display:flex; flex-direction:column; gap:8px;"></div>
  `;
  manage.appendChild(pendingRow);

  docsList.appendChild(manage);

  // רינדור תיקיות
  function renderSharedFoldersList() {
    const wrap = listRow.querySelector("#sf_list");
    wrap.innerHTML = "";

    // כל התיקיות שאני בעלים/חברה בהן (אצלי ב־sharedFolders)
    const sfs = me.sharedFolders || {};
    const entries = Object.entries(sfs);

    if (!entries.length) {
      wrap.innerHTML = `<div style="opacity:.7">אין עדיין תיקיות משותפות</div>`;
      return;
    }

    for (const [fid, folder] of entries) {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.gap = "8px";
      row.style.alignItems = "center";

      row.innerHTML = `
        <input data-fid="${fid}" class="sf_name_input" value="${folder.name}"
               style="flex:1; padding:.35rem; border:1px solid #bbb; border-radius:6px;">
        <button data-open="${fid}" class="doc-action-btn">פתח תיקייה</button>
        <button data-rename="${fid}" class="doc-action-btn">שנה שם</button>
        <input data-email="${fid}" placeholder="הוסף מייל לשיתוף" style="padding:.35rem; border:1px solid #bbb; border-radius:6px;">
        <button data-invite="${fid}" class="doc-action-btn">שלח הזמנה</button>
      `;
      wrap.appendChild(row);
    }
  }

  // רינדור בקשות ממתינות
  function renderPending() {
    const wrap = pendingRow.querySelector("#sf_pending");
    wrap.innerHTML = "";
    const list = (me.incomingShareRequests || []).filter(r => r.status === "pending");
    if (!list.length) {
      wrap.innerHTML = `<div style="opacity:.7">אין בקשות ממתינות</div>`;
      return;
    }
    for (const req of list) {
      const line = document.createElement("div");
      line.style.display = "flex";
      line.style.alignItems = "center";
      line.style.gap = "8px";
      line.innerHTML = `
        הזמנה לתיקייה "<b>${req.folderName}</b>" מאת ${req.fromEmail}
        <button class="doc-action-btn" data-accept="${req.folderId}">אשר</button>
        <button class="doc-action-btn danger" data-reject="${req.folderId}">סרב</button>
      `;
      wrap.appendChild(line);
    }
  }

  renderSharedFoldersList();
  renderPending();

  // האזנות
  // צור תיקייה
  createRow.querySelector("#sf_create_btn").addEventListener("click", () => {
    const name = createRow.querySelector("#sf_new_name").value.trim();
    if (!name) { showNotification("צריך שם תיקייה", true); return; }
    const fid = crypto.randomUUID();
    me.sharedFolders[fid] = { name, owner: myEmail, members: [myEmail] };
    saveAllUsersDataToStorage(allUsersData);
    renderSharedFoldersList();
    showNotification(`נוצרה תיקייה "${name}"`);
  });

  // הקלקות על כפתורים בתוך רשימת התיקיות
  listRow.addEventListener("click", (ev) => {
    const t = ev.target;
    // פתח תיקייה
    const openId = t.getAttribute?.("data-open");
    if (openId) {
      // נאסוף מסמכים מכל המשתמשים לתיקייה הזו ונציג
      const docs = collectSharedFolderDocs(allUsersData, openId);
      categoryTitle.textContent = `תיקייה משותפת: ${me.sharedFolders[openId]?.name || ""}`;
      docsList.innerHTML = "";
      const sorted = sortDocs(docs);
      for (const d of sorted) {
        const card = buildDocCard(d, "shared"); // מצב shared – בלי מחיקה לצמיתות וכו'
        // נציג גם מי הבעלים המקורי של הקובץ
        const meta = card.querySelector(".doc-card-meta");
        if (meta) {
          const span = document.createElement("span");
          span.textContent = `הועלה ע"י: ${d._ownerEmail || "-"}`;
          meta.appendChild(span);
        }
        docsList.appendChild(card);
      }
      return;
    }

    // שנה שם
    const renameId = t.getAttribute?.("data-rename");
    if (renameId) {
      const input = listRow.querySelector(`.sf_name_input[data-fid="${renameId}"]`);
      const newName = (input?.value || "").trim();
      if (!newName) { showNotification("שם תיקייה לא יכול להיות ריק", true); return; }

      // מעדכן שם תיקייה אצל כל החברים (שיהיה עקבי לכולם)
      for (const [uname, u] of Object.entries(allUsersData)) {
        if (u.sharedFolders && u.sharedFolders[renameId]) {
          u.sharedFolders[renameId].name = newName;
        }
        // מעדכן גם בבקשות תלויות
        (u.incomingShareRequests || []).forEach(r => { if (r.folderId === renameId) r.folderName = newName; });
        (u.outgoingShareRequests || []).forEach(r => { if (r.folderId === renameId) r.folderName = newName; });
      }

      saveAllUsersDataToStorage(allUsersData);
      renderSharedFoldersList();
      showNotification("שם התיקייה עודכן");
      return;
    }



    // --- שלח הזמנה ---
// --- שלח הזמנה ---
const inviteId = t.getAttribute?.("data-invite");
if (inviteId) {
  // נמצא את השורה של הכפתור ואז את שדה המייל בשורה הזו
  const row = t.closest("div");
  const emailEl =
    row?.querySelector('input[data-email]') ||
    listRow.querySelector(`input[data-email="${inviteId}"]`);

  if (!emailEl) {
    showNotification("לא נמצא שדה מייל בשורה", true);
    return;
  }

  // נרמול המייל (trim + lower)
  const targetEmail = (emailEl.value || "").trim().toLowerCase();
  if (!targetEmail) {
    showNotification("הקלידי מייל של הנמען", true);
    return;
  }

  // חיפוש משתמש לפי מייל (case-insensitive)
  const targetUname = findUsernameByEmail(allUsersData, targetEmail);
  if (!targetUname) {
    showNotification("אין אדם כזה (המייל לא קיים במערכת)", true);
    return;
  }

  // לא להזמין את עצמי
  const myEmail = (allUsersData[userNow].email || userNow).toLowerCase();
  if (targetEmail === myEmail) {
    showNotification("את כבר חברה בתיקייה הזו", true);
    return;
  }

  // הוספת בקשה יוצאת אצלי
  const meUser = allUsersData[userNow];
  meUser.outgoingShareRequests.push({
    folderId: inviteId,
    folderName: meUser.sharedFolders[inviteId]?.name || "",
    toEmail: targetEmail,
    status: "pending"
  });

  // הוספת בקשה נכנסת אצל הנמען
  ensureUserSharedFields(allUsersData, targetUname);
  allUsersData[targetUname].incomingShareRequests.push({
    folderId: inviteId,
    folderName: meUser.sharedFolders[inviteId]?.name || "",
    fromEmail: myEmail,
    status: "pending"
  });

  saveAllUsersDataToStorage(allUsersData);
  showNotification("הזמנה נשלחה (ממתינה לאישור)");
  emailEl.value = "";
  return;
}


  });

  // אישור/דחייה של בקשות
  pendingRow.addEventListener("click", (ev) => {
    const t = ev.target;
    const accId = t.getAttribute?.("data-accept");
    const rejId = t.getAttribute?.("data-reject");

    if (!accId && !rejId) return;

    const list = me.incomingShareRequests || [];
    const req = list.find(r => r.folderId === (accId || rejId) && r.status === "pending");
    if (!req) return;

    // מצא את בעל התיקייה לפי האימייל שלו
    const ownerUname = findUsernameByEmail(allUsersData, req.fromEmail);
    if (!ownerUname) { showNotification("שגיאה: בעל התיקייה לא נמצא", true); return; }
    const owner = allUsersData[ownerUname];

    if (accId) {
      // ודא שלמקבל יש את התיקייה ברשימה שלו
      ensureUserSharedFields(allUsersData, userNow);
      if (!me.sharedFolders[req.folderId]) {
        me.sharedFolders[req.folderId] = {
          name: req.folderName,
          owner: req.fromEmail,
          members: [req.fromEmail] // יתעדכן מיד למטה
        };
      }

      // הוסף את המייל שלי כחבר אצל כולם
      const myE = (me.email || userNow);
      // אצל הבעלים:
      if (!owner.sharedFolders[req.folderId]) {
        owner.sharedFolders[req.folderId] = {
          name: req.folderName,
          owner: req.fromEmail,
          members: [req.fromEmail]
        };
      }
      if (!owner.sharedFolders[req.folderId].members.includes(myE)) {
        owner.sharedFolders[req.folderId].members.push(myE);
      }
      // אצלי:
      if (!me.sharedFolders[req.folderId].members.includes(myE)) {
        me.sharedFolders[req.folderId].members.push(myE);
      }

      // עדכן סטטוס
      req.status = "accepted";
      // עדכן גם ב-outgoing של הבעלים
      (owner.outgoingShareRequests || []).forEach(o => {
        if (o.folderId === req.folderId && o.toEmail.toLowerCase() === myE.toLowerCase() && o.status === "pending") {
          o.status = "accepted";
        }
      });

      saveAllUsersDataToStorage(allUsersData);
      renderPending();
      showNotification("הצטרפת לתיקייה המשותפת ✔️");
    }

    if (rejId) {
      req.status = "rejected";
      (owner.outgoingShareRequests || []).forEach(o => {
        if (o.folderId === req.folderId && o.toEmail.toLowerCase() === (me.email||userNow).toLowerCase() && o.status === "pending") {
          o.status = "rejected";
        }
      });
      saveAllUsersDataToStorage(allUsersData);
      renderPending();
      showNotification("הזמנה נדחתה");
    }
  });

  homeView.classList.add("hidden");
  categoryView.classList.remove("hidden");
}


  function openRecycleView() {
    categoryTitle.textContent = "סל מחזור";
    const docs = allDocsData.filter(d => d._trashed === true);
    renderDocsList(docs, "recycle");
  }

  function markDocTrashed(id, trashed) {
    const i = allDocsData.findIndex(d => d.id === id);
    if (i > -1) {
      allDocsData[i]._trashed = !!trashed;
      setUserDocs(userNow, allDocsData, allUsersData);
      showNotification(trashed ? "הועבר לסל המחזור" : "שוחזר מהסל");
    }
  }

  function deleteDocForever(id) {
    const i = allDocsData.findIndex(d => d.id === id);
    if (i > -1) {
      // מוחקים גם את הקובץ עצמו מ-IndexedDB
      deleteFileFromDB(id).catch(() => {});
      allDocsData.splice(i, 1);
      setUserDocs(userNow, allDocsData, allUsersData);
      showNotification("הקובץ נמחק לצמיתות");
    }
  }

  function openEditModal(doc) {
    currentlyEditingDocId = doc.id;

    edit_title.value         = doc.title            || "";
    edit_org.value           = doc.org              || "";
    edit_year.value          = doc.year             || "";
    edit_recipient.value     = (doc.recipient || []).join(", ") || "";
    edit_warrantyStart.value = doc.warrantyStart    || "";
    edit_warrantyExp.value   = doc.warrantyExpiresAt|| "";
    edit_autoDelete.value    = doc.autoDeleteAfter  || "";
    edit_category.value      = doc.category         || "";
    edit_sharedWith.value    = (doc.sharedWith || []).join(", ") || "";

    editModal.classList.remove("hidden");
  }

  function closeEditModal() {
    currentlyEditingDocId = null;
    editModal.classList.add("hidden");
  }

  if (editCancelBtn) {
    editCancelBtn.addEventListener("click", () => {
      closeEditModal();
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", (ev) => {
      ev.preventDefault();

      if (!currentlyEditingDocId) {
        closeEditModal();
        return;
      }

      const idx = allDocsData.findIndex(d => d.id === currentlyEditingDocId);
      if (idx === -1) {
        closeEditModal();
        return;
      }

      const updatedRecipients = edit_recipient.value
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "");

      const updatedShared = edit_sharedWith.value
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "");

      allDocsData[idx].title             = edit_title.value.trim() || allDocsData[idx].title;
      allDocsData[idx].org               = edit_org.value.trim();
      allDocsData[idx].year              = edit_year.value.trim();
      allDocsData[idx].recipient         = updatedRecipients;
      allDocsData[idx].warrantyStart     = edit_warrantyStart.value || "";
      allDocsData[idx].warrantyExpiresAt = edit_warrantyExp.value   || "";
      allDocsData[idx].autoDeleteAfter   = edit_autoDelete.value    || "";
      allDocsData[idx].category          = edit_category.value.trim() || "";
      allDocsData[idx].sharedWith        = updatedShared;

      setUserDocs(userNow, allDocsData, allUsersData);

      const currentCat = categoryTitle.textContent;
      if (currentCat === "אחסון משותף") {
        openSharedView();
      } else if (currentCat === "סל מחזור") {
        openRecycleView();
      } else {
        openCategoryView(currentCat);
      }

      showNotification("המסמך עודכן בהצלחה");
      closeEditModal();
    });
  }

  // ניווט
  window.App = {
    renderHome,
    openSharedView,
    openRecycleView
  };

  if (backButton) {
    backButton.addEventListener("click", () => {
      renderHome();
    });
  }

  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener("click", () => {
      fileInput.click();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const [field, dir] = sortSelect.value.split("-");
      currentSortField = field;
      currentSortDir   = dir;
      if (!categoryView.classList.contains("hidden")) {
        openCategoryView(categoryTitle.textContent);
      }
    });
  }

  // העלאת קובץ ושמירה (Metadata -> localStorage, קובץ -> IndexedDB)
  if (fileInput) {
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!file) {
        showNotification("❌ לא נבחר קובץ", true);
        return;
      }

      try {
        const fileName = file.name.trim();

        const alreadyExists = allDocsData.some(doc => {
          return (
            doc.originalFileName === fileName &&
            doc._trashed !== true
          );
        });
        if (alreadyExists) {
          showNotification("הקובץ הזה כבר קיים בארכיון שלך", true);
          fileInput.value = "";
          return;
        }

        // קטגוריה
        let guessedCategory = guessCategoryForFileNameOnly(file.name);
        if (!guessedCategory || guessedCategory === "אחר") {
          const manual = prompt(
            'לא זיהיתי אוטומטית את סוג המסמך.\nלאיזו תיקייה לשמור?\nאפשרויות: ' +
            CATEGORIES.join(", "),
            "רפואה"
          );
          if (manual && manual.trim() !== "") {
            guessedCategory = manual.trim();
          } else {
            guessedCategory = "אחר";
          }
        }

        // פרטי אחריות אם זה "אחריות"
        let warrantyStart = null;
        let warrantyExpiresAt = null;
        let autoDeleteAfter = null;

        if (guessedCategory === "אחריות") {
          let extracted = {
            warrantyStart: null,
            warrantyExpiresAt: null,
            autoDeleteAfter: null,
          };

          if (file.type === "application/pdf") {
            const ocrText = await extractTextFromPdfWithOcr(file);
            const dataFromText = extractWarrantyFromText(ocrText);
            extracted = { ...extracted, ...dataFromText };
          }

          if (file.type.startsWith("image/") && window.Tesseract) {
            const { data } = await window.Tesseract.recognize(file, "heb+eng", {
              tessedit_pageseg_mode: 6,
            });
            const imgText = data?.text || "";
            const dataFromText = extractWarrantyFromText(imgText);
            extracted = { ...extracted, ...dataFromText };
          }

          if (!extracted.warrantyStart && !extracted.warrantyExpiresAt) {
            const buf = await file.arrayBuffer().catch(() => null);
            if (buf) {
              const txt = new TextDecoder("utf-8").decode(buf);
              const dataFromText = extractWarrantyFromText(txt);
              extracted = { ...extracted, ...dataFromText };
            }
          }

          if (!extracted.warrantyStart && !extracted.warrantyExpiresAt) {
            const manualData = fallbackAskWarrantyDetails();
            if (manualData.warrantyStart) {
              extracted.warrantyStart = manualData.warrantyStart;
            }
            if (manualData.warrantyExpiresAt) {
              extracted.warrantyExpiresAt = manualData.warrantyExpiresAt;
            }
            if (manualData.autoDeleteAfter) {
              extracted.autoDeleteAfter = manualData.autoDeleteAfter;
            }
          }

          warrantyStart     = extracted.warrantyStart     || null;
          warrantyExpiresAt = extracted.warrantyExpiresAt || null;
          autoDeleteAfter   = extracted.autoDeleteAfter   || null;
        }

        // קוראות את הקובץ כ-base64 (dataURL)
        const fileDataBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // מזהה למסמך
        const newId = crypto.randomUUID();

        // שמירת הקובץ עצמו ב-IndexedDB (לא ב-localStorage)
        await saveFileToDB(newId, fileDataBase64);

        // נבנה אובייקט מסמך בלי לשמור את כל הבסיס64
        const newDoc = {
          id: newId,
          title: fileName,
          originalFileName: fileName,
          category: guessedCategory,
          uploadedAt: new Date().toISOString().split("T")[0],
          year: new Date().getFullYear().toString(),
          org: "",
          recipient: [],
          sharedWith: [],

          warrantyStart,
          warrantyExpiresAt,
          autoDeleteAfter,

          mimeType: file.type,
          hasFile: true // יש קובץ שמור ב-IndexedDB
        };

        allDocsData.push(newDoc);
        setUserDocs(userNow, allDocsData, allUsersData);

  

        // ניסוח הודעה נחמד לפי התיקייה
let niceCat = guessedCategory && guessedCategory.trim()
  ? guessedCategory.trim()
  : "התיקייה";

showNotification(`הקובץ נוסף לתיקייה "${niceCat}" ✅`);

const currentCat = categoryTitle.textContent;
if (currentCat === "אחסון משותף") {
  openSharedView();
} else if (currentCat === "סל מחזור") {
  openRecycleView();
} else if (!homeView.classList.contains("hidden")) {
  renderHome();
} else {
  openCategoryView(currentCat);
}


        fileInput.value = "";

      } catch (err) {
        console.error("שגיאה בהעלאה:", err);
        showNotification("הייתה בעיה בהעלאה / OCR. נסי שוב או קובץ אחר.", true);
      }
    });
  }

  // פתיחת קובץ מה-IndexedDB
  document.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("[data-open-id]");
    if (!btn) return;

    const docId = btn.getAttribute("data-open-id");
    const docObj = allDocsData.find(d => d.id === docId);

    if (!docObj) {
      showNotification("לא נמצא המסמך", true);
      return;
    }

    // נטען את ה-dataURL מתוך IndexedDB
    let dataUrl = null;
    try {
      dataUrl = await loadFileFromDB(docObj.id);
    } catch (e) {
      console.error("שגיאה בשליפת קובץ מה-DB:", e);
    }

    if (!dataUrl) {
      showNotification("הקובץ הזה לא שמור / גדול מדי או נמחק מהמכשיר. אבל הפרטים נשמרו.", true);
      return;
    }

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = docObj.originalFileName || "file";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // להתחיל בדף הבית
  renderHome();
});
