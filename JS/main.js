import { fetchData } from "./utils/fetchData.js";

/* -------------------------------------------------
   1. הגדרות קטגוריות
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
    // מילים רפואיות בסיסיות
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

  "תעודות": [
    "תעודת","תעודה","תעוד","תאוד","תעדה","תעודא",
    "תעודת זהות","ת.ז","תז","תעודת זהוי","תעודת זהויי","תעודת זיהות", "תז.", "תז:",
    "רישיון","רישיון נהיגה","רשיון נהיגה","רישיוןנהיגה","רישיון רכב","רשיון רכב","רשיון נהיגה זמני",
    "דרכון","פספורט","passport","דרכון ביומטרי","דרכוןזמני","דרכון זמני",
    "תעודת לידה","תעודתלידה","אישור לידה","אישור לידה בית חולים","תמצית רישום","תמצית רישום אוכלוסין","ספח",
    "ספח תעודת זהות","ספח ת.ז","ספח תז","ספח ת.ז.",
    "אישור לימודים","אישור רישום","אישורסטודנט","אישור סטודנט","אישור תלמיד","אישור תלמידה",
    "בית ספר","ביה\"ס","גן ילדים","גני ילדים","תלמיד","תלמידה","סטודנט","סטודנטית",
    "אישור מגורים","אישור כתובת","אישור תושבות","אישורתושב","אישור תושב קבע","תעודת התחסנות","כרטיס חיסונים"
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

  "אחר": [
    // קטגוריה ברירת מחדל, אפשר להשאיר ריק/מילים כלליות.
  ]
};


const CATEGORIES = [
  "כלכלה",
  "רפואה",
  "עבודה",
  "בית",
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
   3. עזרים
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

// ניחוש תיקייה לפי שם קובץ
function guessCategoryForFileNameOnly(fileName) {
  const base = fileName.replace(/\.[^/.]+$/, ""); // בלי סיומת
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

// פופ-אפ למעלה
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
   4. קוד ראשי
   ------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  // אם אין יוזר מחובר - צא להתחברות
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // אלמנטים מה-DOM
  const homeView      = document.getElementById("homeView");
  const folderGrid    = document.getElementById("folderGrid");
  const categoryView  = document.getElementById("categoryView");
  const categoryTitle = document.getElementById("categoryTitle");
  const docsList      = document.getElementById("docsList");
  const backButton    = document.getElementById("backButton");
  const uploadBtn     = document.getElementById("uploadBtn");
  const fileInput     = document.getElementById("fileInput");

  // טוענים דאטה של כל היוזרים
  let allUsersData = loadAllUsersDataFromStorage();
  // המסמכים של היוזר הנוכחי
  let allDocsData  = getUserDocs(currentUser, allUsersData);

  // אם זה משתמש חדש ואין לו עדיין מסמכים - נטען מסמכי ברירת מחדל
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

  /* ---------- ציור עמוד הבית (תיקיות) ---------- */
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

  /* ---------- פתיחת תיקייה ספציפית ---------- */
  function openCategoryView(categoryName) {
    categoryTitle.textContent = categoryName;

    const docsForThisCategory = allDocsData.filter(doc =>
      doc.category &&
      doc.category.includes(categoryName) &&
      !doc._trashed
    );

    docsList.innerHTML = "";

    docsForThisCategory.forEach(doc => {
      const card = document.createElement("div");
      card.className = "doc-card";

      card.innerHTML = `
        <p class="doc-card-title">${doc.title}</p>

        <div class="doc-card-meta">
          <span>ארגון: ${doc.org}</span>
          <span>שנה: ${doc.year}</span>
          <span>שייך ל: ${doc.recipient?.join(", ") || "-"}</span>
          <span>הועלה ב: ${doc.uploadedAt || "-"}</span>
        </div>

        ${doc.fileUrl ? `
          <a class="doc-open-link"
             href="${doc.fileUrl}"
             target="_blank"
             rel="noopener noreferrer">
             פתיחת קובץ
          </a>
        ` : ""}

        <div class="doc-actions"></div>
      `;

      const actions = card.querySelector(".doc-actions");

      const trashBtn = document.createElement("button");
      trashBtn.className = "doc-action-btn danger";
      trashBtn.textContent = "🗑️ העבר לסל מחזור";

      trashBtn.addEventListener("click", () => {
        markDocTrashed(doc.id, true);
        openCategoryView(categoryName);
      });

      actions.appendChild(trashBtn);

      docsList.appendChild(card);
    });

    homeView.classList.add("hidden");
    categoryView.classList.remove("hidden");
  }

  /* ---------- תצוגות מיוחדות: אחסון משותף / סל מחזור ---------- */
  function renderDocsList(docs, mode = "normal") {
    docsList.innerHTML = "";

    docs.forEach(doc => {
      const card = document.createElement("div");
      card.className = "doc-card";

      card.innerHTML = `
        <p class="doc-card-title">${doc.title}</p>
        <div class="doc-card-meta">
          <span>ארגון: ${doc.org}</span>
          <span>שנה: ${doc.year}</span>
          <span>שייך ל: ${doc.recipient?.join(", ") || "-"}</span>
          <span>הועלה ב: ${doc.uploadedAt || "-"}</span>
        </div>

        ${doc.fileUrl ? `
          <a class="doc-open-link"
             href="${doc.fileUrl}"
             target="_blank"
             rel="noopener">
             פתיחת קובץ
          </a>` : ""}

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
          } else {
            openCategoryView(categoryTitle.textContent);
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

  /* ---------- פעולות על מסמך ---------- */
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

  // נותנות גישה מה-sidebar
  window.App = {
    renderHome,
    openSharedView,
    openRecycleView
  };

  /* ---------- כפתורים ---------- */
  backButton.addEventListener("click", () => {
    renderHome();
  });

  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  // כאן עושים את בדיקת הכפילות כמו שצריך
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (!file) {
      showNotification("❌ לא נבחר קובץ", true);
      return;
    }

    try {
      const fileName = file.name.trim();

      // 1. לבדוק אם שם הקובץ כבר קיים אצל המשתמש הזה ואינו בפח
      const alreadyExists = allDocsData.some(doc => {
        return (
          doc.originalFileName === fileName &&
          doc._trashed !== true
        );
      });

      if (alreadyExists) {
        showNotification("הקובץ הזה כבר קיים בארכיון שלך", true);
        // לנקות כדי שאפשר יהיה לבחור אותו שוב בעתיד
        fileInput.value = "";
        return;
      }

      // 2. ניחוש קטגוריה
      let guessedCategory = guessCategoryForFileNameOnly(file.name);

      // אם לא בטוח או "אחר" -> לשאול אותך ידנית
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

      // 3. מכינים נתונים לשמירה
      const now = new Date();
      const uploadedAt = now.toLocaleString("he-IL", {
        dateStyle: "short",
        timeStyle: "short"
      });

      // blob URL כדי שתוכלי לפתוח את הקובץ ("פתיחת קובץ")
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
        _trashed: false
      };

      // 4. שומרות במערך וב-LocalStorage
      allDocsData.push(newDoc);
      setUserDocs(currentUser, allDocsData, allUsersData);

      // 5. פידבק למשתמשת
      showNotification("המסמך הועלה בהצלחה ✔️");

      // 6. לחזור למסך הבית (שיראו את התיקיות)
      renderHome();

      // 7. לנקות את ה-input
      fileInput.value = "";

    } catch (err) {
      console.error(err);
      showNotification("❌ תקלה בהעלאה – נסי שוב", true);
    }
  });

  /* ---------- הצגה ראשונית ---------- */
  renderHome();
});
