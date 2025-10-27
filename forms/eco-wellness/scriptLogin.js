// scriptLogin.js
// לוגין שמתנהג גם כרישום אוטומטי אם אין משתמש

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

// זו כבר לא בשימוש ישיר כרגע אבל אני עדיין משאירה לך, זה שימושי אם תרצי בעתיד דף "הרשמה"
function registerUser(email, password) {
    const allUsers = loadAllUsersDataFromStorage();

    if (allUsers[email]) {
        // אם כבר קיים לא נרשום מחדש בסיסמה אחרת
        return { ok: false, msg: "המייל כבר רשום. התחברי עם הסיסמה שלו." };
    }

    allUsers[email] = {
        password: password,
        docs: [] // משתמש חדש מתחיל בלי מסמכים
    };
    saveAllUsersDataToStorage(allUsers);
    setCurrentUser(email);

    return { ok: true, msg: "נרשמת והתחברת." };
}

// התחברות שיכולה גם ליצור משתמש אם הוא לא קיים עדיין
function loginUser(email, password) {
    const allUsers = loadAllUsersDataFromStorage();
    const existingUser = allUsers[email];

    // --- מצב 1: אין בכלל משתמש כזה עדיין ---
    if (!existingUser) {
        // יוצרים משתמש חדש "מהאוויר" עם הסיסמה שהוזנה עכשיו
        allUsers[email] = {
            password: password,
            docs: [] // אין לו עדיין קבצים
        };
        saveAllUsersDataToStorage(allUsers);

        setCurrentUser(email);
        return { ok: true, code: "NEW_USER_CREATED", msg: "נוצר משתמש חדש והתחברת" };
    }

    // --- מצב 2: יש משתמש קיים אבל הוא נוצר דרך גוגל (בלי סיסמה לוקאלית) ---
    if (!existingUser.password) {
        // אם אין password שמור אצלו, זה חשבון Google בלבד
        return { ok: false, code: "GOOGLE_ONLY", msg: "החשבון הזה נכנס רק עם Google." };
    }

    // --- מצב 3: יש משתמש קיים עם סיסמה ואנחנו בודקות התאמה ---
    if (existingUser.password !== password) {
        return { ok: false, code: "BADPASS", msg: "סיסמה שגויה" };
    }

    // --- מצב 4: סיסמה טובה ---
    setCurrentUser(email);
    return { ok: true, code: "OK", msg: "מחוברת" };
}

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
        this.forgotLink = document.querySelector(".healing-link");

        // Firebase (לגוגל)
        this.auth = null;
        this.googleProvider = null;
        this._signInWithPopup = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupWellnessEffects();
        this.setupGoogleButton();
        this.setupForgotPassword();
    }

    bindEvents() {
        // כשלוחצים התחברות
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // ולידציה בסיסית
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));

        // כדי שהלייבלים לא יתנגשו
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

    setupForgotPassword() {
        if (!this.forgotLink) return;

        this.forgotLink.addEventListener("click", (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
    }

    handleForgotPassword() {
        const email = this.emailInput.value.trim();
        const allUsers = loadAllUsersDataFromStorage();

        if (!email) {
            alert("כדי לאפס סיסמה, הזיני קודם את כתובת האימייל שלך.");
            this.emailInput.focus();
            return;
        }

        const userData = allUsers[email];

        if (!userData) {
            // עכשיו בגלל שאנחנו מרשות יצירה אוטומטית בלוגין,
            // זה מצב די מוזר אבל עדיין נטפל בו יפה:
            alert("אין חשבון עם האימייל הזה עדיין. תתחברי פעם ראשונה וזה ייצור חשבון.");
            return;
        }

        // חשבון של גוגל בלבד (אין סיסמה מקומית לשנות)
        if (!userData.password) {
            alert("החשבון הזה נכנס רק עם Google.");
            return;
        }

        // איפוס סיסמה רגיל לחלון modal
        localStorage.setItem("pendingResetUser", email);
        this.openResetModal();
    }

    openResetModal() {
        const modal = document.getElementById("resetModal");
        const newPassInput = document.getElementById("newPasswordInput");
        const cancelBtn = document.getElementById("resetCancelBtn");
        const saveBtn = document.getElementById("resetSaveBtn");

        if (!modal) {
            alert("שגיאה: חלון איפוס לא זמין.");
            return;
        }

        modal.classList.remove("hidden");
        newPassInput.value = "";
        newPassInput.focus();

        cancelBtn.onclick = () => {
            modal.classList.add("hidden");
            localStorage.removeItem("pendingResetUser");
        };

        saveBtn.onclick = () => {
            const newPass = newPassInput.value.trim();
            if (!newPass || newPass.length < 3) {
                alert("הסיסמה החדשה חייבת להיות לפחות באורך 3 תווים.");
                return;
            }

            const emailToReset = localStorage.getItem("pendingResetUser");
            if (!emailToReset) {
                alert("שגיאה פנימית: לא ידוע איזה משתמש לאפס.");
                return;
            }

            const allUsers = loadAllUsersDataFromStorage();
            if (!allUsers[emailToReset]) {
                alert("שגיאה: המשתמש כבר לא קיים.");
                return;
            }

            allUsers[emailToReset].password = newPass;
            saveAllUsersDataToStorage(allUsers);

            localStorage.removeItem("pendingResetUser");
            modal.classList.add("hidden");

            alert("הסיסמה עודכנה. עכשיו אפשר להתחבר עם הסיסמה החדשה.");
        };
    }

    setupWellnessEffects() {
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
        } else {
            alert(message);
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

    async handleSubmit(e) {
        e.preventDefault();

        const okEmail = this.validateEmail();
        const okPass = this.validatePassword();
        if (!okEmail || !okPass) return;

        this.setLoading(true);

        try {
            // אנימציה קטנה
            await new Promise(res => setTimeout(res, 300));

            const email = this.emailInput.value.trim();
            const password = this.passwordInput.value.trim();

            const result = loginUser(email, password);

            if (!result.ok) {
                // המצב היחיד שעדיין חוסם אותך הוא חשבון גוגל-בלבד
                if (result.code === "GOOGLE_ONLY") {
                    this.showError("email", "החשבון הזה נכנס רק עם Google.");
                } else if (result.code === "BADPASS") {
                    this.showError("password", "סיסמה שגויה");
                    this.passwordInput.focus();
                } else {
                    this.showError("password", "שגיאת התחברות");
                }

                this.setLoading(false);
                return;
            }

            // הצלחה (או משתמש חדש שנוצר עכשיו או משתמש קיים)
            this.showHarmonySuccess();

            setTimeout(() => {
                window.location.href = "../../index.html";
            }, 1500);

        } catch (err) {
            console.error(err);
            this.showError("password", "אירעה שגיאה, נסי שוב");
            this.setLoading(false);
        }
    }

    showHarmonySuccess() {
        // מיני-אנימציה
        this.form.style.transform = 'scale(0.95)';
        this.form.style.opacity = '0';

        setTimeout(() => {
            this.form.style.display = 'none';
            document
              .querySelectorAll('.natural-social, .nurture-signup, .balance-divider')
              .forEach(el => el?.classList.add('hidden'));

            this.successMessage.classList.add('show');
        }, 300);
    }

    /* ---------------- Google Login ---------------- */

    initFirebaseAuth() {
        return Promise.all([
            import("https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js"),
            import("https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js")
        ]).then(([appModule, authModule]) => {
            const { initializeApp } = appModule;
            const { getAuth, GoogleAuthProvider, signInWithPopup } = authModule;

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
        const googleBtn = document.querySelector(".earth-social");
        if (!googleBtn) return;

        googleBtn.addEventListener("click", async () => {
            if (!this.auth) {
                await this.initFirebaseAuth();
            }

            try {
                this.setLoading(true);

                const result = await this._signInWithPopup(this.auth, this.googleProvider);
                const user = result.user;

                // לשמור/לעדכן את המשתמש אצלנו
                const allUsers = loadAllUsersDataFromStorage();
                if (!allUsers[user.email]) {
                    allUsers[user.email] = {
                        password: "", // אין סיסמה מקומית לחשבון גוגל
                        docs: []
                    };
                    saveAllUsersDataToStorage(allUsers);
                }

                setCurrentUser(user.email);

                this.showHarmonySuccess();
                setTimeout(() => {
                    window.location.href = "../../index.html";
                }, 1500);

            } catch (err) {
                console.error("Google Sign-In Error:", err);
                alert("שגיאה בהתחברות עם Google. נסי שוב.");
            } finally {
                this.setLoading(false);
            }
        });
    }
}

// אנימציה נשימה לשדות
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

// הפעלה
document.addEventListener('DOMContentLoaded', () => {
    new EcoWellnessLoginForm();
});
