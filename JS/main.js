import { fetchData } from "./utils/fetchData.js";

/* -------------------------------------------------
   1. אוצר מילים לכל קטגוריה
   ------------------------------------------------- */

const CATEGORY_KEYWORDS = {
    "כלכלה": [
        "חשבון", "חשבונית", "חשבונית מס", "ארנונה", "בנק", "אשראי",
        "תשלום", "תשלומים", "יתרה", "משכנתא", "הלוואה", "משכורת",
        "שכר", "שכר עבודה", "תלוש", "תלוש שכר", "מקבל גמלה",
        "ביטוח לאומי", "דמי אבטלה", "פנסיה", "קרן פנסיה", "קופת גמל",
        "מס הכנסה", "דו\"ח שנתי", "החזר מס", "מע\"מ", "קבלה", "קבלות",
        "פרמיה", "סכום לתשלום", "ביטוח רכב", "ביטוח דירה"
    ],

    "רפואה": [
        "רפואה", "רפואי", "רפואית", "מרפאה", "קופת חולים", "בדיקת דם",
        "בדיקות דם", "אבחנה", "אבחון", "סיכום מחלה", "סיכום ביקור",
        "הפניה", "הפנייה", "מרשם", "תרופות", "חיסון", "חיסונים",
        "אשפוז", "שחרור", "מכתב שחרור", "אישור מחלה", "אישור רפואי",
        "טופס התחייבות", "התחייבות", "טופס 17", "מכבי", "לאומית",
        "כללית", "מאוחדת", "ועדת השמה רפואית", "רופא משפחה",
        "רופא ילדים", "פסיכולוג", "טיפול רגשי", "התפתחות הילד"
    ],

    "עבודה": [
        "חוזה העסקה", "חוזה העסקה אישי", "מכתב קבלה לעבודה",
        "אישור העסקה", "אישור העסקה רשמי", "אישור ותק",
        "תלוש שכר", "תלושי שכר", "שכר עבודה", "העסקה", "העסקת עובד",
        "מכתב פיטורים", "סיום העסקה", "הערכת עובד", "משמרות",
        "הצהרת מעסיק", "שעות נוספות"
    ],

    "בית": [
        "חוזה שכירות", "הסכם שכירות", "נישואין", "שכירות", "שוכר", "משכיר",
        "בעל הדירה", "נכס", "דירה", "נכס מגורים", "ועד בית",
        "חברת חשמל", "חשמל", "גז", "מים", "אינטרנט", "ספק אינטרנט",
        "כבלים", "הוט", "יס", "ארנונה מגורים", "כתובת מגורים",
        "טופס מסירה מונה", "קריאת מונה", "חברת הגז",
        "גירושין", "הסכם גירושין", "צו גירושין", "מזונות", "משמורת",
        "צו משמורת", "הסדרי ראייה", "משפחה", "הורה משמורן"
    ],

    "תעודות": [
        "תעודת", "תעודה", "תעודת זהות", "ת.ז", "תז", "תעודת זהוי",
        "רישיון", "רישיון נהיגה", "דרכון", "פספורט",
        "תעודת לידה", "תמצית רישום", "ספח", "אישור לימודים",
        "אישור רישום", "תלמיד", "גני ילדים", "בית ספר",
        "אישור מגורים", "תעודת התחסנות"
    ],

    "עסק": [
        "עוסק מורשה", "עוסק פטור", "תיק עוסק", "חשבונית מס",
        "קבלה", "חשבונאות", "דו\"ח מע\"מ", "ע.מ", "עסקי", "חברה בע\"מ",
        "עוסק", "הצהרת הכנסות", "דוח הכנסות", "פתיחת עוסק"
    ]
};

/* -------------------------------------------------
   2. קטגוריות בתצוגת הבית
   ------------------------------------------------- */

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
   3. LocalStorage users
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
    return localStorage.getItem(CURRENT_USER_KEY) || null;
}

function setCurrentUser(username) {
    localStorage.setItem(CURRENT_USER_KEY, username);
}

function getUserDocs(username, allUsersData) {
    return allUsersData[username] || [];
}

function setUserDocs(username, docsArray, allUsersData) {
    allUsersData[username] = docsArray;
    saveAllUsersDataToStorage(allUsersData);
}

/* -------------------------------------------------
   4. עזר לזיהוי קטגוריה
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

function guessCategoryFromWords(words) {
    const scores = {};
    for (const rawWord of words) {
        const cleanWord = normalizeWord(rawWord);
        for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
            for (const kw of keywords) {
                const cleanKw = normalizeWord(kw);
                if (cleanWord.includes(cleanKw) || cleanKw.includes(cleanWord)) {
                    if (!scores[category]) scores[category] = 0;
                    scores[category] += 1;
                }
            }
        }
    }

    let bestCategory = null;
    let bestScore = 0;
    for (const [cat, sc] of Object.entries(scores)) {
        if (sc > bestScore) {
            bestScore = sc;
            bestCategory = cat;
        }
    }
    return bestCategory || null;
}

function guessCategoryForFileNameOnly(fileName) {
    const base = fileName.replace(/\.[^/.]+$/, ""); // בלי סיומת
    const parts = base.split(/[\s_\-]+/g);          // ["תלוש","שכר","מרץ","2025"]
    const cat = guessCategoryFromWords(parts);
    return cat || "אחר";
}

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
   5. UI / לוגיקה ראשית
   ------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
    // אם אין משתמש מחובר -> תעברי ל-login.html
    const currentUserCheck = getCurrentUser();
    if (!currentUserCheck) {
        window.location.href = "login.html";
        return;
    }

    // אלמנטים מה-DOM
    const homeView = document.getElementById("homeView");
    const folderGrid = document.getElementById("folderGrid");

    const uploadBtn = document.getElementById("uploadBtn");
    const fileInput = document.getElementById("fileInput");

    const categoryView = document.getElementById("categoryView");
    const categoryTitle = document.getElementById("categoryTitle");
    const docsList = document.getElementById("docsList");
    const backButton = document.getElementById("backButton");

    // שלב 1: נטען את מסד המשתמשים מה-localStorage
    let allUsersData = loadAllUsersDataFromStorage();

    // המשתמש הנוכחי
    const currentUser = getCurrentUser();

    // שלב 2: נטען את המסמכים של המשתמש הזה
    let allDocsData = getUserDocs(currentUser, allUsersData);

    // אם אין לו עדיין כלום, נאתחל מה-JSON הראשוני שלך
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

    function openCategoryView(categoryName) {
    // עדכן כותרת
    categoryTitle.textContent = categoryName;

    // בחרי רק את המסמכים בקטגוריה הזאת, ושלא נמצאים בסל מחזור
    const docsForThisCategory = allDocsData.filter(doc =>
        doc.category &&
        doc.category.includes(categoryName) &&
        !doc._trashed
    );

    // ננקה את הרשימה
    docsList.innerHTML = "";

    // נבנה כרטיס לכל מסמך
    docsForThisCategory.forEach(doc => {
        const card = document.createElement("div");
        card.className = "doc-card";

        card.innerHTML = `
            <p class="doc-card-title">${doc.title}</p>

            <div class="doc-card-meta">
                <span>ארגון: ${doc.org}</span>
                <span>שנה: ${doc.year}</span>
                <span>שייך ל: ${doc.recipient.join(", ")}</span>
                <span>הועלה ב: ${doc.uploadedAt}</span>
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

        // אזור הפעולות למסמך
        const actions = card.querySelector(".doc-actions");

        // כפתור: שלח לסל מחזור
        const trashBtn = document.createElement("button");
        trashBtn.className = "doc-action-btn danger";
        trashBtn.textContent = "🗑️ העבר לסל מחזור";

        trashBtn.addEventListener("click", () => {
            markDocTrashed(doc.id, true);
            // מרעננות את הרשימה של אותה קטגוריה אחרי שהעברנו למסל"ש
            openCategoryView(categoryName);
        });

        actions.appendChild(trashBtn);

        docsList.appendChild(card);
    });

    // מעבר תצוגה:
    homeView.classList.add("hidden");
    categoryView.classList.remove("hidden");
}


    // רינדור רשימת מסמכים גנרי לפי מערך מסמכים
    function renderDocsList(docs, options = {}) {
    const { mode = "normal" } = options; // 'normal' | 'shared' | 'recycle'
    const homeView = document.getElementById("homeView");
    const categoryView = document.getElementById("categoryView");
    const categoryTitle = document.getElementById("categoryTitle");
    const docsList = document.getElementById("docsList");

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

        ${doc.fileUrl ? `<a class="doc-open-link" href="${doc.fileUrl}" target="_blank" rel="noopener">פתיחת קובץ</a>` : ""}

        <div class="doc-actions"></div>
        `;

        const actions = card.querySelector(".doc-actions");

        // ב"רגיל" וב"משותף" – אפשר להעביר לסל
        if (mode !== "recycle") {
        const trashBtn = document.createElement("button");
        trashBtn.className = "doc-action-btn danger";
        trashBtn.textContent = "🗑️ העבר לסל מחזור";
        trashBtn.addEventListener("click", () => {
            markDocTrashed(doc.id, true);
            if (mode === "shared") openSharedView(); else openCategoryView(categoryTitle.textContent);
        });
        actions.appendChild(trashBtn);
        }

        // ב"סל מחזור" – שחזור/מחיקה לצמיתות
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

    // תצוגת "אחסון משותף" – מסמכים שיש להם sharedWith לא ריק ולא בסל
    function openSharedView() {
    const categoryTitle = document.getElementById("categoryTitle");
    categoryTitle.textContent = "אחסון משותף";
    const docs = allDocsData.filter(d => Array.isArray(d.sharedWith) && d.sharedWith.length > 0 && !d._trashed);
    renderDocsList(docs, { mode: "shared" });
    }

    // תצוגת "סל מחזור"
    function openRecycleView() {
    const categoryTitle = document.getElementById("categoryTitle");
    categoryTitle.textContent = "סל מחזור";
    const docs = allDocsData.filter(d => d._trashed === true);
    renderDocsList(docs, { mode: "recycle" });
    }

    // סימון/ביטול סל מחזור ושמירה
    function markDocTrashed(id, trashed) {
    const i = allDocsData.findIndex(d => d.id === id);
    if (i > -1) {
        allDocsData[i]._trashed = !!trashed;
        setUserDocs(currentUser, allDocsData, allUsersData);
        showNotification(trashed ? "הועבר לסל המחזור" : "שוחזר מהסל");
    }
    }

    // מחיקה לצמיתות
    function deleteDocForever(id) {
    const i = allDocsData.findIndex(d => d.id === id);
    if (i > -1) {
        allDocsData.splice(i, 1);
        setUserDocs(currentUser, allDocsData, allUsersData);
        showNotification("הקובץ נמחק לצמיתות");
    }
    }

    // לחשוף לפעולות מה-index.html
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

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];

        if (!file) {
            showNotification("❌ לא נבחר קובץ", true);
            return;
        }

        try {
            // שלב 1: ניחוש קטגוריה
            let guessedCategory = guessCategoryForFileNameOnly(file.name);

            // שלב 2: אם לא בטוח, נשאל אותך לאן לשמור
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

            // שלב 3: ניצור URL זמני לקובץ כדי שאפשר יהיה לפתוח אותו
            const fileObjectUrl = URL.createObjectURL(file);

            const now = new Date();
            const uploadedAt = now.toISOString().split("T")[0];

            const newDoc = {
                id: "doc-" + Date.now(),
                title: file.name.replace(/\.[^/.]+$/, ""),
                org: "לא ידוע",
                year: now.getFullYear(),
                recipient: ["אני"],
                category: [guessedCategory],
                sharedWith: [],         // כבר קיים אצלך
                fileUrl: fileObjectUrl,
                uploadedAt: uploadedAt,
                _trashed: false         // <-- חדש
                };


            // נשמור בזכרון ולמשתמש
            allDocsData.push(newDoc);
            setUserDocs(currentUser, allDocsData, allUsersData);

            renderHome();
            fileInput.value = "";

            showNotification(
                `✅ "${file.name}" נשמר בתיקייה "${guessedCategory}" וניתן לפתיחה`,
                false
            );

        } catch (err) {
            console.error(err);
            showNotification("❌ תקלה בהעלאה – נסי שוב", true);
        }
    });

    renderHome();
});
