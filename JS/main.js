// main.js
// כל הלוגיקה של האפליקציה בצד הדפדפן בלבד
// כולל OCR, חילוץ אחריות, שמירה בלוקאל סטורג', תצוגה, בלי שרת בכלל 💚

// -------------------------------------------------
// 1. קטגוריות ומילות מפתח
// -------------------------------------------------
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
    "מרשם תרופות","רשימת תרופות","טיפול תרופתי",
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
    "העברת חשמל","העברת מים","העברת גז","בעלות נכס","נכס על שמי","נכס על שמך",
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

// -------------------------------------------------
// 2. LocalStorage helpers
// -------------------------------------------------
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

// -------------------------------------------------
// 3. עזרים כלליים
// -------------------------------------------------
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

// -------------------------------------------------
// 3.1 OCR (תמונה בלבד)
// -------------------------------------------------
async function runOCR(file) {
  const mime = file.type.toLowerCase();
  const isImage =
    mime.startsWith("image/") ||
    file.name.toLowerCase().match(/\.(jpg|jpeg|png|heic|webp|bmp)$/);

  if (!isImage) {
    return null;
  }

  if (!window.Tesseract) {
    console.warn("Tesseract.js not loaded or script order wrong");
    return null;
  }

  try {
    const { data } = await window.Tesseract.recognize(file, {
      lang: "heb+eng"
    });
    if (data && data.text && data.text.trim().length > 0) {
      return data.text;
    }
  } catch (err) {
    console.warn("OCR failed", err);
  }

  return null;
}

// OCR ל-PDF (עמוד ראשון): מציירים לקנבס, עושים OCR על התמונה
// קורא PDF, מרנדר את העמוד הראשון לתמונה, עושה עליו OCR ומחזיר טקסט
async function extractTextFromPdfWithOcr(file) {
  // הגנה: אם pdfjsLib לא נטען
  if (!window.pdfjsLib) {
    console.warn("pdfjsLib missing");
    return "";
  }

  // נקרא את ה-PDF כ-ArrayBuffer
  const arrayBuf = await file.arrayBuffer();

  // נטען את ה-PDF דרך pdf.js
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuf }).promise;
  // ניקח בינתיים רק את העמוד הראשון
  const page = await pdf.getPage(1);

  // נהפוך את העמוד הזה ל-canvas
  const viewport = page.getViewport({ scale: 2 }); // scale 2 = יותר חד ל-OCR
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };
  await page.render(renderContext).promise;

  // עכשיו יש לנו תמונה ב-canvas -> נוציא blob
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

  // נריץ OCR עם Tesseract
  if (!window.Tesseract) {
    console.warn("Tesseract missing");
    return "";
  }

  const { data } = await window.Tesseract.recognize(blob, "heb+eng", {
    tessedit_pageseg_mode: 6,
  });

  const ocrText = data && data.text ? data.text : "";
  return ocrText;
}


// -------------------------------------------------
// 3.2 חילוץ אחריות מתמליל (טקסט גולמי)
// -------------------------------------------------
function extractWarrantyFromText(rawBufferMaybe) {
  // --- שלב 0: להכין טקסט מלא + lowercase לעבודה regex ---
  let rawText = "";
  if (typeof rawBufferMaybe === "string") {
    rawText = rawBufferMaybe;
  } else if (rawBufferMaybe instanceof ArrayBuffer) {
    rawText = new TextDecoder("utf-8").decode(rawBufferMaybe);
  } else {
    rawText = String(rawBufferMaybe || "");
  }

  // נשמור גם גרסה מנוקה וגם lowercase
  const cleaned = rawText.replace(/\s+/g, " ").trim();
  const lower   = cleaned.toLowerCase();

  // --- עוזרים פנימיים ---

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

  // הופך "31/08/2022", "31-08-22", "31 אוגוסט 2022", "2022-08-31" => "2022-08-31"
  function normalizeDateGuess(str) {
    if (!str) return null;

    let s = str
      .replace(/[,]/g, " ")
      .replace(/[.\/\\\-]+/g, "-")
      .replace(/\s+/g, "-")
      .toLowerCase()
      .trim();

    const tokens = s.split("-");

    // מילולי: 31 אוגוסט 2022 / 31 aug 2022
    if (tokens.some(t => monthMap[t])) {
      let day = null, mon = null, year = null;
      for (const t of tokens) {
        if (monthMap[t]) {
          mon = monthMap[t];
        } else if (/^\d{1,2}$/.test(t) && parseInt(t,10) <= 31 && day === null) {
          day = t.padStart(2,"0");
        } else if (/^\d{2,4}$/.test(t) && year === null) {
          if (t.length === 4) {
            year = t;
          } else if (t.length === 2) {
            const yy = parseInt(t,10);
            year = (yy < 50 ? 2000+yy : 1900+yy).toString();
          }
        }
      }
      if (day && mon && year) {
        const ymd = `${year}-${mon}-${day}`;
        if (isValidYMD(ymd)) return ymd;
      }
    }

    // yyyy-mm-dd
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

    // dd-mm-yyyy
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

    // dd-mm-yy
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

  // מחפש "מילת מפתח + תאריך"
  function findDateAfterKeywords(keywords, textToSearch) {
    for (const kw of keywords) {
      const pattern =
        kw +
        "[ \\t:]*" +
        "(" +
          "\\d{1,2}[.\\-/\\\\ ]\\d{1,2}[.\\-/\\\\ ]\\d{2,4}" +
          "|" +
          "\\d{4}[.\\-/\\\\ ]\\d{1,2}[.\\-/\\\\ ]\\d{1,2}" +
          "|" +
          "\\d{1,2}\\s+[a-zא-ת]+\\s+\\d{2,4}" +
        ")";
      const re = new RegExp(pattern, "i");
      const m = textToSearch.match(re);
      if (m && m[1]) {
        const guess = normalizeDateGuess(m[1]);
        if (isValidYMD(guess)) {
          return guess;
        }
      }
    }
    return null;
  }

  // שלב 1: תאריך קנייה/מסירה/חשבונית לפי מילות מפתח
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
    "תעודת\\s*משלוח\\s*מספר", // לפעמים זה מופיע ככותרת בראש
    "תאריך\\s*משלוח",
    "תאריך\\s*אספקה",
    "תאריך\\s*מסירה",
    "נמסר\\s*בתאריך",
    "נרכש\\s*בתאריך",
    "purchase\\s*date",
    "date\\s*of\\s*purchase",
    "invoice\\s*date",
    "invoice\\s*#?date",
    "buy\\s*date"
  ], lower);

  // שלב 2: תוקף אחריות / אחריות עד
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

  // שלב 3: אם עדיין אין warrantyStart,
  // תני עדיפות לתאריך שמופיע ממש בהתחלה של המסמך (למעלה במסמך).
  if (!warrantyStart) {
    const headChunk = lower.slice(0, 300); // רק ההתחלה
    const headDateRegex = new RegExp(
      "(" +
        "\\d{1,2}[.\\-/\\\\ ]\\d{1,2}[.\\-/\\\\ ]\\d{2,4}" +
        "|" +
        "\\d{4}[.\\-/\\\\ ]\\d{1,2}[.\\-/\\\\ ]\\d{1,2}" +
        "|" +
        "\\d{1,2}\\s+[a-zא-ת]+\\s+\\d{2,4}" +
      ")",
      "i"
    );
    const mHead = headChunk.match(headDateRegex);
    if (mHead && mHead[1]) {
      const guess = normalizeDateGuess(mHead[1]);
      if (isValidYMD(guess)) {
        warrantyStart = guess;
      }
    }
  }

  // שלב 4: אם עדיין אין warrantyStart,
  // נעשה fallback זהיר: אם יש רק תאריך תקין אחד בכל המסמך -> קחי אותו.
  if (!warrantyStart) {
    const anyDateRegex = new RegExp(
      "(" +
        "\\d{1,2}[.\\-/\\\\ ]\\d{1,2}[.\\-/\\\\ ]\\d{2,4}" +
        "|" +
        "\\d{4}[.\\-/\\\\ ]\\d{1,2}[.\\-/\\\\ ]\\d{1,2}" +
        "|" +
        "\\d{1,2}\\s+[a-zא-ת]+\\s+\\d{2,4}" +
      ")",
      "ig"
    );
    const matches = [...lower.matchAll(anyDateRegex)].map(m => m[1]);
    const normalized = [];
    for (const candidate of matches) {
      const ymd = normalizeDateGuess(candidate);
      if (isValidYMD(ymd)) {
        normalized.push(ymd);
      }
    }
    const unique = [...new Set(normalized)];
    if (unique.length === 1) {
      warrantyStart = unique[0];
    }
  }

  // שלב 5: אין תוקף אחריות אבל יש תאריך התחלה -> נניח שנה
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

  // שלב 6: autoDeleteAfter = שנתיים אחרי סוף האחריות
  let autoDeleteAfter = null;
  if (warrantyExpiresAt && isValidYMD(warrantyExpiresAt)) {
    const [Y2,M2,D2] = warrantyExpiresAt.split("-");
    const expDate = new Date(`${Y2}-${M2}-${D2}T00:00:00`);
    if (!Number.isNaN(expDate.getTime())) {
      const del = new Date(expDate.getTime());
      del.setMonth(del.getMonth() + 24);
      const y3 = del.getFullYear();
      const m3 = String(del.getMonth() + 1).padStart(2, "0");
      const d3 = String(del.getDate()).padStart(2, "0");
      autoDeleteAfter = `${y3}-${m3}-${d3}`;
    }
  }

  return {
    warrantyStart: (warrantyStart && isValidYMD(warrantyStart)) ? warrantyStart : null,
    warrantyExpiresAt: (warrantyExpiresAt && isValidYMD(warrantyExpiresAt)) ? warrantyExpiresAt : null,
    autoDeleteAfter
  };
}



// -------------------------------------------------
// 3.3 fallback – אם לא הצלחנו בכלל לקרוא תאריכים,
// נשאל את המשתמש ידנית (מה תאריך הקנייה? עד מתי האחריות?)
// -------------------------------------------------
function fallbackAskWarrantyDetails() {
  const startAns = prompt(
    "לא הצלחתי לזהות אוטומטית.\nמה תאריך הקנייה? (למשל 28/10/2025)"
  );
  const expAns = prompt(
    "עד מתי האחריות בתוקף? (למשל 28/10/2026)\nאם אין אחריות/לא רלוונטי אפשר לבטל."
  );

  function normalizeManualDate(str) {
    if (!str) return null;
    let s = str.trim().replace(/[.\/]/g, "-");
    const parts = s.split("-");
    if (parts.length === 3) {
      let [a,b,c] = parts;
      if (a.length === 4) {
        // yyyy-mm-dd
        const yyyy = a;
        const mm = b.padStart(2, "0");
        const dd = c.padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      } else if (c.length === 4) {
        // dd-mm-yyyy
        const yyyy = c;
        const mm = b.padStart(2, "0");
        const dd = a.padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      }
    }
    return s;
  }

  const warrantyStart = startAns ? normalizeManualDate(startAns) : null;
  const warrantyExpiresAt = expAns ? normalizeManualDate(expAns) : null;

  let autoDeleteAfter = null;
  if (warrantyExpiresAt && /^\d{4}-\d{2}-\d{2}$/.test(warrantyExpiresAt)) {
    const delDate = new Date(warrantyExpiresAt + "T00:00:00");
    delDate.setMonth(delDate.getMonth() + 24);
    autoDeleteAfter = delDate.toISOString().split("T")[0];
  }

  return {
    warrantyStart,
    warrantyExpiresAt,
    autoDeleteAfter
  };
}

// -------------------------------------------------
// 3.4 הודעות toast
// -------------------------------------------------
function showNotification(message, isError = false) {
  const box = document.getElementById("notification");
  if (!box) return;
  box.textContent = message;
  box.className = "notification show" + (isError ? " error" : "");
  setTimeout(() => {
    box.className = "notification hidden";
  }, 3000);
}

// -------------------------------------------------
// 3.5 ניקוי מסמכי אחריות שפג להם זמן השמירה
// -------------------------------------------------
function purgeExpiredWarranties(docsArray) {
  const today = new Date();
  let changed = false;

  for (let i = docsArray.length - 1; i >= 0; i--) {
    const d = docsArray[i];
    if (
      d.category &&
      d.category.includes("אחריות") &&
      d.autoDeleteAfter
    ) {
      const deleteOn = new Date(d.autoDeleteAfter + "T00:00:00");
      if (today > deleteOn) {
        docsArray.splice(i, 1);
        changed = true;
      }
    }
  }
  return changed;
}

// -------------------------------------------------
// 3.6 מיון
// -------------------------------------------------
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

// -------------------------------------------------
// 4. אפליקציה / UI
// -------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const currentUser   = getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const homeView      = document.getElementById("homeView");
  const folderGrid    = document.getElementById("folderGrid");
  const categoryView  = document.getElementById("categoryView");
  const categoryTitle = document.getElementById("categoryTitle");
  const docsList      = document.getElementById("docsList");
  const backButton    = document.getElementById("backButton");
  const uploadBtn     = document.getElementById("uploadBtn");
  const fileInput     = document.getElementById("fileInput");
  const sortSelect    = document.getElementById("sortSelect");

  let allUsersData = loadAllUsersDataFromStorage();
  let allDocsData  = getUserDocs(currentUser, allUsersData);

  // אם המשתמש חדש לגמרי - נתחיל ריק
  if (!allDocsData || allDocsData.length === 0) {
    allDocsData = [];
    setUserDocs(currentUser, allDocsData, allUsersData);
  }

  // ננקה מסמכי אחריות שפג להם הזמן
  const removed = purgeExpiredWarranties(allDocsData);
  if (removed) {
    setUserDocs(currentUser, allDocsData, allUsersData);
    showNotification("מסמכי אחריות ישנים הוסרו אוטומטית");
  }

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

  function buildDocCard(doc, mode, categoryNameForRefresh = null) {
    const card = document.createElement("div");
    card.className = "doc-card";

    const warrantyBlock =
      (doc.category && doc.category.includes("אחריות")) ?
      `
        <span>תאריך קנייה: ${doc.warrantyStart || "-"}</span>
        <span>תוקף אחריות עד: ${doc.warrantyExpiresAt || "-"}</span>
        <span>מחיקה אוטומטית אחרי: ${doc.autoDeleteAfter || "-"}</span>
      `
      : "";

    card.innerHTML = `
      <p class="doc-card-title">${doc.title}</p>

      <div class="doc-card-meta">
        <span>ארגון: ${doc.org || "לא ידוע"}</span>
        <span>שנה: ${doc.year || "-"}</span>
        <span>שייך ל: ${doc.recipient?.join(", ") || "-"}</span>
        <span>הועלה ב: ${doc.uploadedAt || "-"}</span>
        ${warrantyBlock}
      </div>

      ${doc.fileUrl ? `
        <a class="doc-open-link"
           href="${doc.fileUrl}"
           target="_self"
           rel="noopener noreferrer">
           פתיחת קובץ
        </a>
      ` : ""}

      <div class="doc-actions"></div>
    `;

    const actions = card.querySelector(".doc-actions");

    if (mode !== "recycle") {
      const trashBtn = document.createElement("button");
      trashBtn.className = "doc-action-btn danger";
      trashBtn.textContent = "🗑️ העבר לסל מחזור";
      trashBtn.addEventListener("click", () => {
        markDocTrashed(doc.id, true);
        if (mode === "shared") {
          openSharedView();
        } else if (categoryNameForRefresh) {
          openCategoryView(categoryNameForRefresh);
        }
      });
      actions.appendChild(trashBtn);
    }

    if (mode === "recycle") {
      const restoreBtn = document.createElement("button");
      restoreBtn.className = "doc-action-btn restore";
      restoreBtn.textContent = "♻️ שחזור";
      restoreBtn.addEventListener("click", () => {
        markDocTrashed(doc.id, false);
        openRecycleView();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "doc-action-btn danger";
      deleteBtn.textContent = "🗑️ מחיקה לצמיתות";
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
      const card = buildDocCard(doc, "normal", categoryName);
      docsList.appendChild(card);
    });

    homeView.classList.add("hidden");
    categoryView.classList.remove("hidden");
  }

  function renderDocsList(docs, mode = "normal") {
    const sortedDocs = sortDocs(docs);

    docsList.innerHTML = "";

    sortedDocs.forEach(doc => {
      const card = buildDocCard(doc, mode, categoryTitle.textContent);
      docsList.appendChild(card);
    });

    homeView.classList.add("hidden");
    categoryView.classList.remove("hidden");
  }

  function openSharedView() {
    categoryTitle.textContent = "אחסון משותף";
    const docs = allDocsData.filter(
      d => Array.isArray(d.sharedWith) && d.sharedWith.length > 0 && !d._trashed
    );
    renderDocsList(docs, "shared");
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
      setUserDocs(currentUser, allDocsData, allUsersData);
      showNotification(trashed ? "הועבר לסל המחזור" : "שוחזר מהסל");
    }
  }

  function deleteDocForever(id) {
    const i = allDocsData.findIndex(d => d.id === id);
    if (i > -1) {
      allDocsData.splice(i, 1);
      setUserDocs(currentUser, allDocsData, allUsersData);
      showNotification("הקובץ נמחק לצמיתות");
    }
  }

  // חשיפה לניווט בכפתורים שב-header
  window.App = {
    renderHome,
    openSharedView,
    openRecycleView
  };

  backButton.addEventListener("click", () => {
    renderHome();
  });

  // טיפול בלחיצה על "העלאת קובץ"
  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  // מיון
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const [field, dir] = sortSelect.value.split("-");
      currentSortField = field;
      currentSortDir = dir;
      if (!categoryView.classList.contains("hidden")) {
        openCategoryView(categoryTitle.textContent);
      }
    });
  }

  // הטיפול הראשי בהעלאת קובץ
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) {
      showNotification("❌ לא נבחר קובץ", true);
      return;
    }

    try {
      const fileName = file.name.trim();

      // למנוע כפילויות
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

      // ניחוש קטגוריה לפי שם
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

      // ערכי אחריות שננסה למלא
      let warrantyStart = null;
      let warrantyMonths = null;
      let warrantyExpiresAt = null;
      let autoDeleteAfter = null;

      if (guessedCategory === "אחריות") {
    console.log("🔅 קובץ בקטגורית 'אחריות' => מפעילים OCR וניתוח");

    let extracted = {
      warrantyStart: null,
      warrantyExpiresAt: null,
      autoDeleteAfter: null,
    };

    // 1. אם זה PDF -> OCR PDF ראשון
    if (file.type === "application/pdf") {
      const ocrText = await extractTextFromPdfWithOcr(file);
      window.__lastOcrText = ocrText; // <<< שמירה גלובלית כדי שנוכל לראות בקונסול
      console.log("OCR raw text >>>", ocrText);

      const dataFromText = extractWarrantyFromText(ocrText);
      extracted = { ...extracted, ...dataFromText };
    }

    // 2. אם זה תמונה -> OCR ישיר
    if (
      file.type.startsWith("image/")
    ) {
      const { data } = await Tesseract.recognize(file, "heb+eng", {
        tessedit_pageseg_mode: 6,
      });
      const imgText = data?.text || "";
      window.__lastOcrText = imgText;
      console.log("OCR raw text (image) >>>", imgText);

      const dataFromText = extractWarrantyFromText(imgText);
      extracted = { ...extracted, ...dataFromText };
    }

    // 3. fallback: אם זה קובץ טקסטואלי (docx/pdf טקסט חי בלי OCR)
    if (!window.__lastOcrText) {
      const buf = await file.arrayBuffer().catch(() => null);
      if (buf) {
        const txt = new TextDecoder("utf-8").decode(buf);
        window.__lastOcrText = txt;
        console.log("Raw text fallback >>>", txt);

        const dataFromText = extractWarrantyFromText(txt);
        extracted = { ...extracted, ...dataFromText };
      }
    }

    // 4. אם עדיין אין לנו כלום מ-OCR -> נשאל ידנית
    if (!extracted.warrantyStart && !extracted.warrantyExpiresAt) {
      const manualData = fallbackAskWarrantyDetails(); // פותח prompt
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

    // 5. נשמור את מה שיצא ב-extracted בשדות שנשמרים במסמך
    warrantyStart     = extracted.warrantyStart || null;
    warrantyExpiresAt = extracted.warrantyExpiresAt || null;
    autoDeleteAfter   = extracted.autoDeleteAfter || null;
}


      // עכשיו בונים את הרשומה לשמירה
      const now = new Date();
      const uploadedAt = now.toLocaleString("he-IL", {
        dateStyle: "short",
        timeStyle: "short"
      });
      const fileObjectUrl = URL.createObjectURL(file);

      const newDoc = {
        id: "doc-" + Date.now(),
        title: fileName.replace(/\.[^/.]+$/, ""),
        org: "לא ידוע",        // בעתיד אפשר למלא לפי OCR "ספק"/"חברה"
        year: now.getFullYear(),
        recipient: ["אני"],    // למי שייך הבעלות
        category: [guessedCategory],
        sharedWith: [],
        fileUrl: fileObjectUrl,
        uploadedAt: uploadedAt,
        originalFileName: fileName,
        _trashed: false,

        // אחריות:
        warrantyStart,
        warrantyMonths,
        warrantyExpiresAt,
        autoDeleteAfter
      };

      // שמירה למשתמש הנוכחי
      allDocsData.push(newDoc);
      setUserDocs(currentUser, allDocsData, allUsersData);

      showNotification(`המסמך נשמר בתיקייה: ${guessedCategory} ✔️`);

      // נחזור למסך הבית ונראה עדכון
      renderHome();
      fileInput.value = "";
    } catch (err) {
      console.error(err);
      showNotification("❌ תקלה בהעלאה – נסי שוב", true);
    }
  });

  // רנדר ראשון
  renderHome();
});
