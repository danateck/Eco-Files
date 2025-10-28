import { fetchData } from "./utils/fetchData.js";

/* -------------------------------------------------
   1. קטגוריות ומילות מפתח
   ------------------------------------------------- */
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
    "אישור רפואי","אישור כשירות","אישור כשירות רפואית","גלאוקומה","לחץ דם גבוה","סכרת","סכרת סוג 2","סכרת סוג2",
    "טופס התחייבות","טופס 17","טופס17","התחייבות","התחיבות","התחיבות קופה","התחייבות קופה",
    "בדיקת שמיעה","בדיקת ראיה","בדיקתראייה","בדיקת עיניים","בדיקת עין",
    "בדיקת הריון","בדיקת היריון","בדיקת הריון ביתית","בטא","בטא hcg","US","אולטרסאונד",
    "צילומי רנטגן","רנטגן","צילום חזה","צילום צוואר","MRI","סי טי","CT","ct","mri",
    "קרדיולוג","קרדיולוגיה","נוירולוג","נוירולוגיה","אורתופד","אורתופדיה",
    "אלרגיה","אלרגייה","אלרגי","אלרגית","אלרגיות",
    "אלריגה","אלרגיה חמורה","ואלרגיה","ואלריגה","אלרגיות קשות","רגישות","רגישות יתר","רגישות לתרופות",
    "אסתמה","אסטמה","אסטמא","אסתמא","אסתמטי","אסתמטית","קוצר נשימה","קושי נשימה","אלרגית אבק","אלרגיה לאבק",
    "חירום רפואי","מוקד חירום","מוקד רפואה דחופה","רפואה דחופה","מוקד לילה","מוקד קורונה",
    "בדיקת קורונה","קורונה חיובי","קורונה שלילי","COVID","covid","קורונה PCR","PCR",
    "אישור רפואי לוועדה","ועדה רפואית","ועדת השמה רפואית","נכות רפואית","אחוזי נכות","קביעת נכות",
    "פנימית","מחלה כרונית","מחלה כרונית פעילה","מחלות רקע","מצב רפואי"
  ],

  "עבודה": [
    "חוזה העסקה","חוזה העסקה אישי","חוזה עבודה","חוזה העסקה לעובד","חוזה העסקה לעובדת",
    "מכתב קבלה לעבודה","קבלה לעבודה","מכתב התחלת עבודה","ברוכים הבאים לחברה",
    "אישור העסקה","אישור העסקה רשמי","אישור העסקה לעובד","אישור ותק","אישור שנות ותק","אישור ניסיון תעסוקתי",
    "תלוש שכר","תלוששכר","תלוש משכורת","תלושי שכר","תלושי משכורת","שעות נוספות","שעותנוספות","רשימת משמרות","משמרות",
    "שכר עבודה","שכר לשעה","שכר חודשי","טופס שעות","אישור תשלום",
    "הצהרת מעסיק","טופס למעסיק","אישור מעסיק","אישור העסקה לצורך ביטוח לאומי",
    "מכתב פיטורים","מכתב סיום העסקה","הודעה מוקדמת","שימוע לפני פיטורים","שימוע לפני פיטורין","פיטורים","פיטורין",
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
    "תעודת אחריות","ת.אחריות","ת. אחריות","תעודת-אחריות","תעודת אחריות למוצר","תעודת אחריות יצרן",
    "תעוד אחריות","תעודת אחריות לקוח","כרטיס אחריות","כ.אחריות","כרטיס-אחריות",
    "warranty","waranty","guarantee","guaranty","manufacturer warranty",
    "limited warranty","1 year warranty","12 months warranty","24 months warranty",
    "warranty card","warranty certificate","customer warranty card",
    "הוכחת קנייה","הוכחת קניה","הוכחת רכישה","הוכחת רכישה למוצר","תעודת רכישה",
    "אישור רכישה","אישור קנייה","אישור קניה","תעודת קניה","תעודת קנייה",
    "חשבונית קנייה","חשבונית קניה","חשבונית רכישה",
    "חשבונית מס קניה","חשבונית מס קנייה","חשבונית מס קניה למוצר","חשבונית מס קנייה למוצר",
    "תעודת משלוח","ת.משלוח","תעודת-משלוח","תעודת מסירה","אישור מסירה",
    "קבלה למוצר","קבלה מוצר","קבלה רכישה","קבלה לקניה","קבלה לקנייה",
    "מספר סידורי מוצר","מספר סידורי","מספר סריאלי","מספר סידורי אחריות","serial number","s/n","sn:","s\\n","imei","imei1","imei2",
    "כרטיס תיקון","כרטיס שירות","כרטיס שרות","דוח תיקון",
    "תיקון במסגרת אחריות","טופס תיקון במסגרת אחריות",
    "פתיחת קריאה","פתיחת קריאה שירות","פתיחת קריאת שירות","פתיחת קריאת תיקון",
    "קריאת שירות","קריאת תיקון","service request","repair ticket","repair order","rma","rma form","rma request",
    "return merchandise authorization",
    "א. אחריות","פתק אחריות","אישור אחריות","אישור אחריות לקוח","אחריות חנות","אחריות מעבדה","אחריות מעבדה מורשית","טופס אחריות"
  ],

  "תעודות": [
    "תעודת","תעודה","תעוד","תאוד","תעדה","תעודא",
    "תעודת זהות","ת.ז","תז","תעודת זהוי","תעודת זהויי","תעודת זיהות","תז.","תז:",
    "רישיון","רישיון נהיגה","רשיון נהיגה","רישיוןנהיגה","רישיון רכב","רשיון רכב","רשיון נהיגה זמני",
    "דרכון","פספורט","passport","דרכון ביומטרי","דרכוןזמני","דרכון זמני",
    "תעודת לידה","תעודתלידה","אישור לידה","אישור לידה בית חולים","תמצית רישום","תמצית רישום אוכלוסין",
    "ספח","ספח תעודת זהות","ספח ת.ז","ספח תז","ספח ת.ז.",
    "אישור לימודים","אישור רישום","אישורסטודנט","אישור סטודנט","אישור תלמיד","אישור תלמידה",
    "בית ספר","ביה\"ס","גן ילדים","גני ילדים","תלמיד","תלמידה","סטודנט","סטודנטית",
    "אישור מגורים","אישור כתובת","אישור תושבות","אישורתושב","אישור תושב קבע",
    "תעודת התחסנות","כרטיס חיסונים"
  ],

  "עסק": [
    "עוסק מורשה","עוסק פטור","עוסקזעיר","תיק עוסק","פתיחת עוסק","סגירת עוסק","פתיחת תיק עוסק",
    "חשבונית מס","חשבוניתמס","חשבונית מס קבלה","קבלה מס","חשבונאות","דו\"ח מע\"מ","דוח מע\"מ","מעמ","מע\"מ",
    "ע.מ","עוסק","עוסק מורשה פעיל","עוסק פטור פעיל",
    "חברה בע\"מ","חברה בעמ","בע\"מ","בעמ","תאגיד","תאגיד בע\"מ","מספר ח.פ","ח.פ",
    "הצהרת הכנסות","הצהרת הכנסה","דוח הכנסות","דיווח הכנסה","דוח שנתי למס הכנסה",
    "לקוח","לקוחה","לקוחות","חשבונית ללקוח","הצעת מחיר","הצעתמחיר","צעת מחיר","הצעת עבודה ללקוח",
    "חשבונית עסקה","ספק","ספקית","ספקים","מספר עוסק","מספרעוסק"
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

/* -------------------------------------------------
   2. LocalStorage helpers
   ------------------------------------------------- */
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

/* -------------------------------------------------
   3. עזרים כלליים
   ------------------------------------------------- */
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

/* -------------------------------------------------
   3.1 OCR (תמונה בלבד)
   ------------------------------------------------- */
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


// הופך עמוד ראשון של PDF (כולל PDF סרוק/מצולם) לתמונה, ואז עושה OCR על התמונה.
// מחזיר טקסט שנקרא מהעמוד או null אם נכשל.
async function extractTextFromPdfWithOcr(file) {
  try {
    if (!window.pdfjsLib) {
        console.warn("pdfjsLib missing (pdf.js לא נטען)");
        return null;
    }
    if (!window.Tesseract) {
        console.warn("Tesseract missing (tesseract.js לא נטען)");
        return null;
    }

    // נקרא את ה-PDF לזיכרון בתור ArrayBuffer
    const arrayBuf = await file.arrayBuffer();

    // טוענים את ה-PDF בעזרת pdf.js
    const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuf });
    const pdf = await loadingTask.promise;

    // ניקח את העמוד הראשון בלבד
    const page = await pdf.getPage(1);

    // נגדיר רזולוציה טובה ל-OCR
    const scale = 2; // מעלה איכות. אם יצא מטושטש אפשר לעלות ל-3
    const viewport = page.getViewport({ scale });

    // נכין קנבס (canvas) לא מוצג לעין
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // נצייר את העמוד לתוך הקנבס
    await page.render({
      canvasContext: ctx,
      viewport
    }).promise;

    // נהפוך את הקנבס לתמונה (blob של PNG)
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, "image/png");
    });

    if (!blob) {
      console.warn("extractTextFromPdfWithOcr: failed to convert canvas to blob");
      return null;
    }

    // עכשיו ניתן את התמונה ל-Tesseract לקריאת טקסט
    const { data } = await window.Tesseract.recognize(blob, {
      lang: "heb+eng"
    });

    if (data && data.text && data.text.trim().length > 0) {
      return data.text;
    }

    console.warn("extractTextFromPdfWithOcr: OCR returned empty text");
    return null;
  } catch (err) {
    console.error("extractTextFromPdfWithOcr error:", err);
    return null;
  }
}


/* -------------------------------------------------
   3.2 חילוץ טקסטואלית של אחריות
   ------------------------------------------------- */
function extractWarrantyFromText(rawBufferMaybe) {
  // 1. להביא טקסט גולמי
  let rawText = "";
  if (typeof rawBufferMaybe === "string") {
    rawText = rawBufferMaybe;
  } else if (rawBufferMaybe instanceof ArrayBuffer) {
    rawText = new TextDecoder("utf-8").decode(rawBufferMaybe);
  } else {
    rawText = String(rawBufferMaybe || "");
  }

  // ננקה רווחים כפולים ונעבוד באותיות קטנות לחיפושים
  const lower = rawText.replace(/\s+/g, " ").toLowerCase();

  // ---------------------------------
  // עזר 1: בדיקת תאריך חוקי (yyyy-mm-dd)
  // ---------------------------------
  function isValidYMD(ymd) {
    if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return false;
    const [Y, M, D] = ymd.split("-").map(n => parseInt(n, 10));
    if (M < 1 || M > 12) return false;
    if (D < 1 || D > 31) return false;
    const dt = new Date(`${Y}-${String(M).padStart(2,"0")}-${String(D).padStart(2,"0")}T00:00:00`);
    return !Number.isNaN(dt.getTime());
  }

  // ---------------------------------
  // עזר 2: המרת שנים של 2 ספרות ל־4 ספרות
  // "23" -> "2023"
  // "98" -> "1998"
  // ---------------------------------
  function expandYear(twoOrFour) {
    if (!twoOrFour) return null;
    if (twoOrFour.length === 4) return twoOrFour;
    if (twoOrFour.length === 2) {
      const yy = parseInt(twoOrFour, 10);
      // נניח 00-49 זה 2000-2049, ו-50-99 זה 1950-1999
      return (yy < 50 ? 2000 + yy : 1900 + yy).toString();
    }
    return null;
  }

  // ---------------------------------
  // עזר 3: שמות חודשים -> מספר
  // כולל עברית, אנגלית, וחודשים עבריים (בקירוב)
  // ---------------------------------
  const monthMap = {
    jan:"01", january:"01", feb:"02", february:"02", mar:"03", march:"03",
    apr:"04", april:"04", may:"05", jun:"06", june:"06", jul:"07", july:"07",
    aug:"08", august:"08", sep:"09", sept:"09", september:"09",
    oct:"10", october:"10", nov:"11", november:"11", dec:"12", december:"12",
    ינואר:"01", פברואר:"02", מרץ:"03", מרס:"03", אפריל:"04", מאי:"05",
    יוני:"06", יולי:"07", אוגוסט:"08", ספטמבר:"09", אוקטובר:"10",
    נובמבר:"11", דצמבר:"12",
    תשרי:"09", חשוון:"10", חשון:"10", כסלו:"11", טבת:"12", שבט:"01",
    אדר:"02", ניסן:"03", ניסן:"03", אייר:"04", אייר:"04",
    סיוון:"05", סיון:"05", תמוז:"06", אב:"07", אלול:"08"
  };

  // ---------------------------------
  // עזר 4: הופך מחרוזת תאריך "כלשהי" ל־YYYY-MM-DD בטוח או null
  // מקבל דברים כמו:
  // "10/10/23", "10\10\2023", "2025-01-02", "10.10.2023", "10 oct 23", "oct 10, 2023", "10 אוקטובר 23"
  // ---------------------------------
 function normalizeDateGuess(str) {
    if (!str) return null;

    // קודם כל נחתוך כל שעה אם יש (לדוגמה "10-10-23 17:53" -> "10-10-23")
    let cut = str.split(" ")[0];

    // עכשיו נעבוד על החלק שנשאר
    let s = cut
      .replace(/[,]/g, " ")
      .replace(/[.\/\\\-]+/g, "-") // כל מפריד → '-'
      .replace(/\s+/g, "-")
      .toLowerCase()
      .trim();

    // דוגמא: "10-oct-23" או "oct-10-2023"
    // נזהה מילים שהם חודשים
    const tokens = s.split("-");
    // ננסה לזהות תבנית עם שם חודש
    if (tokens.some(t => monthMap[t])) {
        // אפשרויות:
        //   DD-MON-YYYY
        //   DD-MON-YY
        //   MON-DD-YYYY
        //   MON-DD-YY
        if (tokens.length >= 3) {
          // ננסה למצוא מה זה היום / חודש / שנה
          let day = null, mon = null, year = null;
          for (const t of tokens) {
            if (monthMap[t]) {
              mon = monthMap[t];
            } else if (/^\d{1,2}$/.test(t) && parseInt(t,10) <= 31 && day === null) {
              day = t.padStart(2,"0");
            } else if (/^\d{2,4}$/.test(t) && year === null) {
              year = expandYear(t);
            }
          }
          if (day && mon && year) {
            const ymd = `${year}-${mon}-${day}`;
            if (isValidYMD(ymd)) return ymd;
          }
        }
    }

    // אחרת - תבנית מספרים בלבד
    // למשל "10-10-23" או "2023-10-10"
    const nums = s.match(/\d+/g);
    if (!nums || nums.length < 3) {
      return null;
    }

    // case A: YYYY-MM-DD (חלק ראשון 4 ספרות)
    if (nums[0].length === 4) {
      const Y = nums[0];
      const M = nums[1].padStart(2,"0");
      const D = nums[2].padStart(2,"0");
      const ymd = `${Y}-${M}-${D}`;
      if (isValidYMD(ymd)) return ymd;
    }

    // case B: DD-MM-YYYY או DD-MM-YY
    // nums[0] = יום, nums[1] = חודש, nums[2] = שנה
    {
      const D = nums[0].padStart(2,"0");
      const M = nums[1].padStart(2,"0");
      const Y = expandYear(nums[2]);
      if (Y) {
        const ymd = `${Y}-${M}-${D}`;
        if (isValidYMD(ymd)) return ymd;
      }
    }

    return null;
  }

  // ---------------------------------
  // 1. ננסה לחלץ "תאריך קנייה", "תאריך אספקה", וכו'
  // ---------------------------------
  function findDateByKeywords(keywords) {
    for (const kw of keywords) {
      // דוגמה מחפשת "תאריך קנייה:" ואז כל צורה של תאריך
      // נשים קבוצה גדולה מאוד של דפוסים:
      const pattern =
        kw +
        "\\s*[:\\-]?" +
        "\\s*(ביום|ב|ל|on|at)?\\s*" +
        "(" +
          // מספרי: 10/10/23 | 10-10-2023 | 2023.10.10 | 10\10\23
          "\\d{1,2}[.\\-/\\\\ ]\\d{1,2}[.\\-/\\\\ ]\\d{2,4}" +
          "|" +
          "\\d{4}[.\\-/\\\\ ]\\d{1,2}[.\\-/\\\\ ]\\d{1,2}" +
          "|" +
          // מילים באנגלית: 10 Oct 2023 | Oct 10, 23
          "\\d{1,2}\\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+\\d{2,4}" +
          "|" +
          "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+\\d{1,2},?\\s+\\d{2,4}" +
          "|" +
          // עברית: 10 אוקטובר 23 | 10 תשרי תשפד (ננסה להתעלם מהשנה העברית כרגע אם היא לא ניתנת לפענוח מספרי)
          "\\d{1,2}\\s+(ינואר|פברואר|מרץ|מרס|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר|תשרי|חשוון|חשון|כסלו|טבת|שבט|אדר|ניסן|אייר|סיוון|סיון|תמוז|אב|אלול)\\s+\\d{2,4}" +
        ")";

      const regex = new RegExp(pattern, "i");
      const m = lower.match(regex);
      if (m && m[2]) {
        const ymd = normalizeDateGuess(m[2]);
        if (isValidYMD(ymd)) {
          return ymd;
        }
      }
    }
    return null;
  }

  let warrantyStart = findDateByKeywords([
    "תאריך ק.?נ.?י.?ה",
    "תאריך רכישה",
    "תאריך קניה",
    "תאריך קנייה",
    "תאריך הקניה",
    "תאריך הקנייה",
    "תאריך אספקה",
    "תאריך משלוח",
    "תאריך מסירה",
    "נרכש בתאריך",
    "purchase date",
    "date of purchase",
    "invoice date",
    "buy date"
  ]);

  // ---------------------------------
  // 2. אם אין עדיין, ניקח את התאריך הראשון שמופיע במסמך בכלל
  // ---------------------------------
  if (!warrantyStart) {
    // ענק-רב-פורמטים, כמו קודם, אבל כ-match גלובלי
    const anyDateRegex = new RegExp(
      "(" +
        "\\d{1,2}[.\\-/\\\\ ]\\d{1,2}[.\\-/\\\\ ]\\d{2,4}" +
        "|" +
        "\\d{4}[.\\-/\\\\ ]\\d{1,2}[.\\-/\\\\ ]\\d{1,2}" +
        "|" +
        "\\d{1,2}\\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+\\d{2,4}" +
        "|" +
        "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+\\d{1,2},?\\s+\\d{2,4}" +
        "|" +
        "\\d{1,2}\\s+(ינואר|פברואר|מרץ|מרס|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר|תשרי|חשוון|חשון|כסלו|טבת|שבט|אדר|ניסן|אייר|סיוון|סיון|תמוז|אב|אלול)\\s+\\d{2,4}" +
      ")",
      "ig"
    );

    const m2 = lower.match(anyDateRegex);
    if (m2 && m2.length > 0) {
      for (const candidate of m2) {
        const ymd = normalizeDateGuess(candidate);
        if (isValidYMD(ymd)) {
          warrantyStart = ymd;
          break;
        }
      }
    }
  }

  // ---------------------------------
  // 3. למצוא "תוקף אחריות עד", "warranty until", וכו'
  // ---------------------------------
  let warrantyExpiresAt = findDateByKeywords([
    "תוקף אחריות",
    "תוקף האחריות",
    "האחריות בתוקף עד",
    "בתוקף עד",
    "אחריות עד",
    "warranty until",
    "warranty expiry",
    "warranty expires",
    "valid until",
    "expiry date",
    "expiration date"
  ]);

  // ---------------------------------
  // 4. אם אין תוקף אבל יש תאריך התחלה -> נניח שנה אחריות
  // ---------------------------------
  if (!warrantyExpiresAt && warrantyStart && isValidYMD(warrantyStart)) {
    const [Y,M,D] = warrantyStart.split("-");
    const startDate = new Date(`${Y}-${M}-${D}T00:00:00`);
    if (!Number.isNaN(startDate.getTime())) {
      const endDate = new Date(startDate.getTime());
      endDate.setMonth(endDate.getMonth() + 12); // שנה אחריות
      const yyyy = endDate.getFullYear();
      const mm = String(endDate.getMonth() + 1).padStart(2, "0");
      const dd = String(endDate.getDate()).padStart(2, "0");
      warrantyExpiresAt = `${yyyy}-${mm}-${dd}`;
    }
  }

  // ---------------------------------
  // 5. מחיקה אוטומטית: רק אם יש תאריך תוקף חוקי
  // ---------------------------------
  let autoDeleteAfter = null;
  if (warrantyExpiresAt && isValidYMD(warrantyExpiresAt)) {
    const [Y2,M2,D2] = warrantyExpiresAt.split("-");
    const expDate = new Date(`${Y2}-${M2}-${D2}T00:00:00`);
    if (!Number.isNaN(expDate.getTime())) {
      const del = new Date(expDate.getTime());
      del.setMonth(del.getMonth() + 24); // שנתיים אחרי תום האחריות
      const yyyy2 = del.getFullYear();
      const mm2 = String(del.getMonth() + 1).padStart(2, "0");
      const dd2 = String(del.getDate()).padStart(2, "0");
      autoDeleteAfter = `${yyyy2}-${mm2}-${dd2}`;
    }
  }

  return {
    warrantyStart: isValidYMD(warrantyStart) ? warrantyStart : null,
    warrantyExpiresAt: isValidYMD(warrantyExpiresAt) ? warrantyExpiresAt : null,
    autoDeleteAfter
  };
}



/* -------------------------------------------------
   3.3 fallback – נשאל אותך אם אין כלום
   ------------------------------------------------- */
function fallbackAskWarrantyDetails() {
  const startAns = prompt(
    "אני לא הצלחתי לקרוא אוטומטית.\nמה תאריך הקנייה? (לדוגמה 28/10/2025)"
  );
  const expAns = prompt(
    "עד מתי האחריות בתוקף? (לדוגמה 28/10/2026)\nאם אין אחריות / לא רלוונטי אפשר לבטל."
  );

  function normalizeManualDate(str) {
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

/* -------------------------------------------------
   3.4 התראות
   ------------------------------------------------- */
function showNotification(message, isError = false) {
  const box = document.getElementById("notification");
  if (!box) return;
  box.textContent = message;
  box.className = "notification show" + (isError ? " error" : "");
  setTimeout(() => {
    box.className = "notification hidden";
  }, 3000);
}

/* -------------------------------------------------
   3.5 מחיקה אוטומטית (חוק התיישנות)
   ------------------------------------------------- */
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

/* -------------------------------------------------
   3.6 מיון
   ------------------------------------------------- */
let currentSortField = "uploadedAt";
let currentSortDir = "desc";

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

/* -------------------------------------------------
   4. אפליקציה
   ------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = getCurrentUser();
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

  if (!allDocsData || allDocsData.length === 0) {
    try {
      const data = await fetchData("./API/documents.json");
      allDocsData = Array.isArray(data) ? data : [];
      setUserDocs(currentUser, allDocsData, allUsersData);
    } catch (err) {
      console.error("Error loading initial data:", err);
      allDocsData = [];
      setUserDocs(currentUser, allDocsData, allUsersData);
    }
  }

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

  window.App = {
    renderHome,
    openSharedView,
    openRecycleView
  };

  backButton.addEventListener("click", () => {
    renderHome();
  });

  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

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

  // ====== העלאת קובץ ======
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    console.log("📁 MIME TYPE:", file?.type, "NAME:", file?.name);

    if (!file) {
      showNotification("❌ לא נבחר קובץ", true);
      return;
    }

    try {
      const fileName = file.name.trim();

      // מניעת כפילות
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

      // ניחוש קטגוריה
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

      // שדות אחריות (יתמלאו אוטומטית אם נצליח)
      let warrantyStart = null;
      let warrantyMonths = null;
      let warrantyExpiresAt = null;
      let autoDeleteAfter = null;
      

if (guessedCategory === "אחריות") {
  console.log("🟡 נכנס לקטגוריה אחריות");

  // זה האובייקט שנמלא ונכניס למסמך
  let extracted = {
    warrantyStart: null,
    warrantyExpiresAt: null,
    autoDeleteAfter: null
  };

  try {
    console.log("🟡 מתחיל חילוץ אחריות אוטומטי");

    // נקרא שכבת טקסט גולמית אם קיימת (ל-PDF טקסטואלי/חשבונית דיגיטלית)
    let rawText = "";
    try {
      rawText = await file.text(); // אם זה PDF "חי" עם שכבת טקסט - נקבל טקסט קריא
    } catch (e1) {
      rawText = "";
    }

    const mime = file.type?.toLowerCase() || "";
    const isImage =
      mime.startsWith("image/") ||
      file.name.toLowerCase().match(/\.(jpg|jpeg|png|heic|webp|bmp)$/);
    const isPdf = mime === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    console.log("🔍 סוג קובץ:", { mime, isImage, isPdf });

    if (rawText && rawText.length > 20) {
  console.log("📜 מצב 1: יש שכבת טקסט בקובץ (rawText)");
  extracted = extractWarrantyFromText(rawText);
  console.log("📄 תוצאה אחרי rawText בלבד:", extracted);

  // ❗ חידוש: אם עדיין אין תאריך, ונראה שזה PDF עם תמונה,
  // ננסה גם OCR על ה-PDF (מצב 3) כדי לקרוא דברים שנשארו כתמונה.
  if (
    isPdf &&
    (!extracted.warrantyStart && !extracted.warrantyExpiresAt)
  ) {
    console.log("🔁 מצב 1 לא מצא תאריך, מנסה OCR על ה-PDF בכל זאת (מצב 3)");
    const pdfOcrText = await extractTextFromPdfWithOcr(file);
    console.log("PDF OCR TEXT (first 200):", pdfOcrText?.slice(0,200));
    if (pdfOcrText && pdfOcrText.trim().length > 0) {
      const ocrExtracted = extractWarrantyFromText(pdfOcrText);
      console.log("📄 תוצאה אחרי OCR על PDF:", ocrExtracted);
      // אם ה-OCR הצליח יותר מהטקסט הרגיל, ניקח אותו
      if (
        (ocrExtracted.warrantyStart && !extracted.warrantyStart) ||
        (ocrExtracted.warrantyExpiresAt && !extracted.warrantyExpiresAt)
      ) {
        extracted = ocrExtracted;
      }
    }
  }

} else if (isImage) {
  console.log("🖼 מצב 2: מנסים OCR על תמונה (runOCR)");
  const ocrText = await runOCR(file);
  console.log("OCR IMAGE TEXT (first 200):", ocrText?.slice(0,200));
  if (ocrText && ocrText.trim().length > 0) {
    extracted = extractWarrantyFromText(ocrText);
  }

} else if (isPdf) {
  console.log("📄 מצב 3: PDF, מנסים extractTextFromPdfWithOcr");
  const pdfOcrText = await extractTextFromPdfWithOcr(file);
  console.log("PDF OCR TEXT (first 200):", pdfOcrText?.slice(0,200));
  if (pdfOcrText && pdfOcrText.trim().length > 0) {
    extracted = extractWarrantyFromText(pdfOcrText);
  }

} else {
  console.log("🪫 מצב 4: fallback arrayBuffer decode");
  const buf = await file.arrayBuffer();
  const decoder = new TextDecoder("utf-8");
  const bufText = decoder.decode(buf || new ArrayBuffer());
  console.log("BUF TEXT (first 200):", bufText.slice(0,200));
  if (bufText && bufText.trim().length > 0) {
    extracted = extractWarrantyFromText(bufText);
  }
}


    console.log("📄 תוצאה מהחילוץ הראשוני:", extracted);

    // אם עדיין לא הצלחנו לזהות כלום -> אין תאריך קנייה ואין תאריך תוקף
    // רק אז נבקש ממך ידנית
    if (!extracted.warrantyStart && !extracted.warrantyExpiresAt) {
      console.log("❌ אין לי עדיין אף תאריך -> אשאל ידנית");
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
    } else {
      console.log("✅ זיהיתי לבד תאריכים, לא אשאל ידנית");
    }

    // אם יש לנו תאריך קנייה אבל אין 'תוקף אחריות עד'
    // נניח אחריות לשנה מהקנייה
    if (
      extracted.warrantyStart &&
      !extracted.warrantyExpiresAt &&
      /^\d{4}-\d{2}-\d{2}$/.test(extracted.warrantyStart)
    ) {
      const guessEnd = new Date(extracted.warrantyStart + "T00:00:00");
      guessEnd.setMonth(guessEnd.getMonth() + 12); // אחריות שנה
      const yyyy = guessEnd.getFullYear();
      const mm = String(guessEnd.getMonth() + 1).padStart(2, "0");
      const dd = String(guessEnd.getDate()).padStart(2, "0");
      extracted.warrantyExpiresAt = `${yyyy}-${mm}-${dd}`;
    }

    // אם יש 'תוקף אחריות עד' אבל אין 'מחיקה אוטומטית אחרי' → נוסיף עוד 24 חודשים (חוק התיישנות)
    if (
      extracted.warrantyExpiresAt &&
      !extracted.autoDeleteAfter &&
      /^\d{4}-\d{2}-\d{2}$/.test(extracted.warrantyExpiresAt)
    ) {
      const delDate = new Date(extracted.warrantyExpiresAt + "T00:00:00");
      delDate.setMonth(delDate.getMonth() + 24); // שנתיים אחרי תום האחריות
      extracted.autoDeleteAfter = delDate.toISOString().split("T")[0];
    }

    console.log("✅ נתונים סופיים לאחריות אחרי חישובים:", extracted);

    // ולבסוף נמפה את זה ל-out variables שהקוד בהמשך משתמש בהם
    warrantyStart       = extracted.warrantyStart       || null;
    warrantyExpiresAt   = extracted.warrantyExpiresAt   || null;
    autoDeleteAfter     = extracted.autoDeleteAfter     || null;
    warrantyMonths      = null; // כרגע לא מחשבות חודשים גלויים

  } catch (err) {
    console.warn("auto extraction failed", err);
    // במקרה של קריסה (לא אמור לקרות עכשיו), שלא ניתקע בלי המשתנים
    warrantyStart     = null;
    warrantyExpiresAt = null;
    autoDeleteAfter   = null;
    warrantyMonths    = null;
  }
}



      // בניית האובייקט הסופי
      const now = new Date();
      const uploadedAt = now.toLocaleString("he-IL", {
        dateStyle: "short",
        timeStyle: "short"
      });

      const fileObjectUrl = URL.createObjectURL(file);

      const newDoc = {
        id: "doc-" + Date.now(),
        title: fileName.replace(/\.[^/.]+$/, ""),
        org: "לא ידוע",
        year: now.getFullYear(),
        recipient: ["אני"],
        category: [guessedCategory],
        sharedWith: [],
        fileUrl: fileObjectUrl,
        uploadedAt: uploadedAt,
        originalFileName: fileName,
        _trashed: false,

        warrantyStart,
        warrantyMonths,
        warrantyExpiresAt,
        autoDeleteAfter
      };

      allDocsData.push(newDoc);
      setUserDocs(currentUser, allDocsData, allUsersData);

      showNotification(`המסמך נשמר בתיקייה: ${guessedCategory} ✔️`);

      renderHome();
      fileInput.value = "";
    } catch (err) {
      console.error(err);
      showNotification("❌ תקלה בהעלאה – נסי שוב", true);
    }
  });

  renderHome();
});
