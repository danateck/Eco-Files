// scriptLogin.js
// התחברות רגילה + גוגל + איפוס סיסמה
// גרסה מתוקנת: אין יותר "יצירת משתמש אוטומטית" בזמן לוגין

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

// פונקציה לרישום משתמש חדש (תשתמשי בה בעתיד בדף הרשמה אמיתי)
function registerUser(email, password) {
    const allUsers = loadAllUsersDataFromStorage();

    if (allUsers[email]) {
        // כבר קיים -> אסור לרשום שוב
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

// נסיון התחברות (ללא יצירה אוטומטית!)
function loginUser(email, password) {
    const allUsers = loadAllUsersDataFromStorage();
    const existingUser = allUsers[email];

    if (!existingUser) {
        return { ok: false, code: "NOUSER", msg: "אין חשבון עם האימייל הזה. צריך להירשם קודם." };
    }

    // משתמש קיים אבל בלי סיסמה (חשבון שנוצר דרך גוגל)
    if (!existingUser.password) {
        return { ok: false, code: "GOOGLE_ONLY", msg: "החשבון הזה מוגן דרך Google בלבד. התחברי עם Google." };
    }

    // יש סיסמה, אבל לא תואם
    if (existingUser.password !== password) {
        return { ok: false, code: "BADPASS", msg: "סיסמה שגויה" };
    }

    // הצלחה
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

        // Firebase (יוגדר דינמית כשעושים גוגל)
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
        // שליחת טופס התחברות
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // ולידציות בסיס
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));

        // בשביל ה-labels הצפים
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
            alert("לא נמצא חשבון עם האימייל הזה. אפשר פשוט להירשם עם סיסמה חדשה.");
            return;
        }

        // חשבון שנוצר רק דרך גוגל ואין לו password מקומי
        if (!userData.password) {
            alert("החשבון הזה נכנס רק עם Google. תתחברי עם Google או תצרי חשבון ידני חדש.");
            return;
        }

        // יש משתמש מקומי → לאפשר איפוס סיסמה ידנית
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

            alert("הסיסמה עודכנה בהצלחה. עכשיו אפשר להתחבר עם הסיסמה החדשה.");
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
            // fallback (למקרה של מייל לא קיים וכד')
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

    // 🔒 התחברות (LOGIN) בלבד. לא נרשמים אוטומטית.
    async handleSubmit(e) {
        e.preventDefault();

        const okEmail = this.validateEmail();
        const okPass = this.validatePassword();
        if (!okEmail || !okPass) return;

        this.setLoading(true);

        try {
            // "חוויית עומס" קלה אנימטיבית
            await new Promise(res => setTimeout(res, 300));

            const email = this.emailInput.value.trim();
            const password = this.passwordInput.value.trim();

            const result = loginUser(email, password);

            if (!result.ok) {
                // משתמש לא קיים בכלל
                if (result.code === "NOUSER") {
                    this.showError("email", "אין חשבון עם האימייל הזה. צרי חשבון חדש (הרשמה).");
                } else if (result.code === "GOOGLE_ONLY") {
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

            // אם הגענו לפה - התחברות הצליחה
            this.showHarmonySuccess();

            // מעבר לדשבורד שלך
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
        // אנימציית "Welcome Home"
        this.form.style.transform = 'scale(0.95)';
        this.form.style.opacity = '0';

        setTimeout(() => {
            this.form.style.display = 'none';
            document.querySelectorAll('.natural-social, .nurture-signup, .balance-divider')
                .forEach(el => el?.classList.add('hidden'));
            this.successMessage.classList.add('show');
        }, 300);
    }

    // ----------------------------------------
    // התחברות עם גוגל דרך Firebase Auth
    // ----------------------------------------

    initFirebaseAuth() {
        // נטען Firebase דינמי
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

                // נשמור את המשתמש בגזרתנו אם לא קיים
                const allUsers = loadAllUsersDataFromStorage();
                if (!allUsers[user.email]) {
                    allUsers[user.email] = {
                        password: "", // אין סיסמה מקומית
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

// אנימציית נשימה אם לא קיימת כבר
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
