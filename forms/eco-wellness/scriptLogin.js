// scriptLogin.js
// גרסה: התחברות רגילה + גוגל + שמירת משתמש + ניתוב

// -----------------------------
// חלק 1: ניהול משתמשים מקומיים
// -----------------------------

const STORAGE_KEY = "docArchiveUsers";
const CURRENT_USER_KEY = "docArchiveCurrentUser";

function loadAllUsersDataFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveAllUsersDataToStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function setCurrentUser(username) {
    localStorage.setItem(CURRENT_USER_KEY, username);
}

// -----------------------------
// חלק 2: לוגיקה של טופס ה-ECO WELLNESS
// -----------------------------

class EcoWellnessLoginForm {
    constructor() {
        // אלמנטים מהדף
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.harmony-button');
        this.successMessage = document.getElementById('successMessage');
        this.socialButtons = document.querySelectorAll('.earth-social');

        // Firebase auth objects נאתחל בהמשך
        this.auth = null;
        this.googleProvider = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupWellnessEffects();
        this.setupGoogleButton();
    }

    bindEvents() {
        // שליחת טופס רגילה (אימייל+סיסמה)
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // ולידציות
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));

        // נוודא שאין placeholder ויזואלי שמקלקל את העיצוב הצף
        this.emailInput.setAttribute('placeholder', ' ');
        this.passwordInput.setAttribute('placeholder', ' ');
    }

    setupPasswordToggle() {
        if (!this.passwordToggle) return;
        this.passwordToggle.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            this.passwordToggle.classList.toggle('toggle-visible', type === 'text');
        });
    }

    setupWellnessEffects() {
        // אפקט נשימה עדין על שדות
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', (e) => {
                this.triggerMindfulEffect(e.target.closest('.organic-field'));
            });
            input.addEventListener('blur', (e) => {
                this.resetMindfulEffect(e.target.closest('.organic-field'));
            });
        });
    }

    triggerMindfulEffect(field) {
        const fieldNature = field?.querySelector('.field-nature');
        if (fieldNature) {
            fieldNature.style.animation = 'gentleBreath 3s ease-in-out infinite';
        }
    }

    resetMindfulEffect(field) {
        const fieldNature = field?.querySelector('.field-nature');
        if (fieldNature) {
            fieldNature.style.animation = '';
        }
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.showError('email', 'אנא הזיני כתובת אימייל');
            return false;
        }
        if (!emailRegex.test(email)) {
            this.showError('email', 'כתובת האימייל אינה חוקית');
            return false;
        }

        this.clearError('email');
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        if (!password) {
            this.showError('password', 'נא להזין סיסמה');
            return false;
        }
        if (password.length < 3) {
            this.showError('password', 'הסיסמה קצרה מדי (לפחות 3 תווים)');
            return false;
        }

        this.clearError('password');
        return true;
    }

    showError(field, message) {
        const organicField = document.getElementById(field)?.closest('.organic-field');
        const errorElement = document.getElementById(`${field}Error`);
        if (organicField && errorElement) {
            organicField.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearError(field) {
        const organicField = document.getElementById(field)?.closest('.organic-field');
        const errorElement = document.getElementById(`${field}Error`);
        if (organicField && errorElement) {
            organicField.classList.remove('error');
            errorElement.classList.remove('show');
            setTimeout(() => {
                errorElement.textContent = '';
            }, 300);
        }
    }

    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
        this.socialButtons.forEach(button => {
            button.style.pointerEvents = loading ? 'none' : 'auto';
            button.style.opacity = loading ? '0.6' : '1';
        });
    }

    // 🟢 התחברות רגילה (אימייל+סיסמה בלי גוגל)
    async handleSubmit(e) {
        e.preventDefault();

        const okEmail = this.validateEmail();
        const okPass = this.validatePassword();
        if (!okEmail || !okPass) return;

        this.setLoading(true);

        try {
            // "שהייה" קטנה בשביל האנימציה
            await new Promise(res => setTimeout(res, 800));

            const email = this.emailInput.value.trim();
            const allUsers = loadAllUsersDataFromStorage();

            // אם אין משתמש כזה עדיין -> ניצור לו רשימה ריקה (sign up שקורה אוטומטית)
            if (!allUsers[email]) {
                allUsers[email] = [];
                saveAllUsersDataToStorage(allUsers);
            }

            // נגדיר שהוא המחובר כרגע
            setCurrentUser(email);

            // מעבר עם האנימציה
            this.showHarmonySuccess();
        } catch (err) {
            console.error(err);
            this.showError('password', 'התרחשה שגיאה. נסי שוב.');
        } finally {
            this.setLoading(false);
        }
    }

    showHarmonySuccess() {
        // מסתירות את הטופס, מציגות מסך "Welcome Home"
        this.form.style.transform = 'scale(0.95)';
        this.form.style.opacity = '0';

        setTimeout(() => {
            this.form.style.display = 'none';
            document.querySelectorAll('.natural-social, .nurture-signup, .balance-divider')
                .forEach(el => el?.classList.add('hidden'));
            this.successMessage.classList.add('show');
        }, 300);

        // אחרי קצת זמן – נכנסות למערכת
        setTimeout(() => {
            window.location.href = "../../index.html";
        }, 2000);
    }

    // ----------------------------------------
    // חלק 3: התחברות עם גוגל דרך Firebase Auth
    // ----------------------------------------

    initFirebaseAuth() {
        // נטען Firebase (שימי לב: חייב לרוץ בשרת מקומי/Live Server, לא file://)

        // נייבא דינמית מה-CDN הרשמי (גרסה תואמת)
        // שימי לב: לא לשנות את ה-url בלי סיבה
        return Promise.all([
            import("https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js"),
            import("https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js")
        ]).then(([appModule, authModule]) => {

            const { initializeApp } = appModule;
            const { getAuth, GoogleAuthProvider, signInWithPopup } = authModule;

            // זה הקונפיג שלך מפיירבייס 👇
            const firebaseConfig = {
                apiKey: "AIzaSyBPr4X2_8JYCgXzMlTcVB0EJLhup9CdyYw",
                authDomain: "login-page-echo-file.firebaseapp.com",
                projectId: "login-page-echo-file",
                storageBucket: "login-page-echo-file.firebasestorage.app",
                messagingSenderId: "200723524735",
                appId: "1:200723524735:web:9eaed6ef10cbc2c406234a",
                measurementId: "G-LT5XQFQPKP"
            };

            const firebaseApp = initializeApp(firebaseConfig);
            this.auth = getAuth(firebaseApp);
            this.googleProvider = new GoogleAuthProvider();
            this._signInWithPopup = signInWithPopup;
        });
    }

    setupGoogleButton() {
        // נניח שהכפתור של גוגל הוא הראשון עם הקלאס הזה:
        const googleBtn = document.querySelector(".earth-social");

        if (!googleBtn) return;

        googleBtn.addEventListener("click", async () => {
            // אם עדיין לא אתחלנו פיירבייס → נאתחל עכשיו
            if (!this.auth) {
                await this.initFirebaseAuth();
            }

            try {
                this.setLoading(true);

                // פותח חלון התחברות גוגל
                const result = await this._signInWithPopup(this.auth, this.googleProvider);
                const user = result.user;

                // שומרים את האימייל ב-localStorage כדי שהמערכת הראשית תדע מי מחובר
                const allUsers = loadAllUsersDataFromStorage();
                if (!allUsers[user.email]) {
                    allUsers[user.email] = [];
                    saveAllUsersDataToStorage(allUsers);
                }

                setCurrentUser(user.email);

                // ונריץ את אותה אנימציית "ברוכה הבאה"
                this.showHarmonySuccess();
                        setTimeout(() => {
        window.location.href = "../../index.html";
        }, 2000);
            } catch (err) {
                console.error("Google Sign-In Error:", err);
                alert("שגיאה בהתחברות עם Google. נסי שוב.");
            } finally {
                this.setLoading(false);
            }
        });
    }
}

// אנימציית נשימה רכה (אם לא קיים כבר)
if (!document.querySelector('#wellness-keyframes')) {
    const style = document.createElement('style');
    style.id = 'wellness-keyframes';
    style.textContent = `
        @keyframes gentleBreath {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.01); }
        }
    `;
    document.head.appendChild(style);
}

// אתחול הטופס כשעמוד הלוגין נטען
document.addEventListener('DOMContentLoaded', () => {
    new EcoWellnessLoginForm();
});
