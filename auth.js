import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfWhRF8BpXTxXlE5Hzs45FDuoocWy9H9E",
  authDomain: "keskebilseydim-f56dc.firebaseapp.com",
  projectId: "keskebilseydim-f56dc",
  storageBucket: "keskebilseydim-f56dc.firebasestorage.app",
  messagingSenderId: "524443729178",
  appId: "1:524443729178:web:abc85bbcbcf65a3075c0a3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.initAuth = function(){

    const loginButtons = document.querySelectorAll(".login");
    const authModal = document.getElementById("authModal");
    const authClose = document.getElementById("authClose");
    const loginBtn = document.getElementById("loginBtn");
    const authMessage = document.getElementById("authMessage");
    const authBox = document.querySelector(".auth-box");
    const authEmail = document.getElementById("authEmail");
    const authPassword = document.getElementById("authPassword");
    const switchAuthMode = document.getElementById("switchAuthMode");
    const authSwitchText = document.getElementById("authSwitchText");
    const forgotPassword = document.getElementById("forgotPassword");
    const googleLogin = document.getElementById("googleLogin");
    const eyeIcon = document.querySelector(".eye");

    if(!authModal || !loginBtn || !authEmail || !authPassword) return;

    let isRegisterMode = false;

    function updateLoginButtonState(){
        const hasEmail = authEmail.value.trim() !== "";
        const hasPassword = authPassword.value.trim() !== "";

        if(hasEmail && hasPassword){
            loginBtn.style.background = "#22c55e";
            loginBtn.style.opacity = "1";
        }else{
            loginBtn.style.background = "#86d39b";
            loginBtn.style.opacity = "0.6";
        }
    }

    authEmail.addEventListener("input", updateLoginButtonState);
    authPassword.addEventListener("input", updateLoginButtonState);
    updateLoginButtonState();

    loginButtons.forEach(btn => {
        btn.onclick = function(){
            if(btn.classList.contains("logged-in")) return;
            authModal.classList.add("active");
        };
    });

    authClose.onclick = function(){
        authModal.classList.remove("active");
    };

    authModal.onclick = function(e){
        if(e.target === authModal){
            authModal.classList.remove("active");
        }
    };

    switchAuthMode.onclick = function(){
        isRegisterMode = !isRegisterMode;

        if(isRegisterMode){
            authBox.classList.add("register-mode");
            document.querySelector(".auth-box h2").textContent = "Hesap Oluştur";
            authSwitchText.textContent = "Zaten hesabın var mı?";
            switchAuthMode.textContent = "Giriş Yap";
            loginBtn.textContent = "Hesap Oluştur";
        }else{
            authBox.classList.remove("register-mode");
            document.querySelector(".auth-box h2").textContent = "Giriş Yap";
            authSwitchText.textContent = "Hesabın yok mu?";
            switchAuthMode.textContent = "Hemen oluştur";
            loginBtn.textContent = "Giriş Yap";
        }

        authMessage.textContent = "";
        updateLoginButtonState();
    };

    loginBtn.onclick = async function(){
        const name = document.getElementById("authName").value.trim();
        const email = authEmail.value.trim();
        const password = authPassword.value.trim();

        if(!email || !password){
            authMessage.textContent = "Lütfen e-posta ve şifre gir.";
            authMessage.style.color = "red";
            return;
        }

        if(isRegisterMode){
            if(!name){
                authMessage.textContent = "Ad Soyad girmen gerekiyor.";
                authMessage.style.color = "red";
                return;
            }

            try{
                await createUserWithEmailAndPassword(auth, email, password);
                localStorage.setItem("kb_user_name", name);
                localStorage.setItem("kb_user_email", email);
localStorage.setItem(
    "kb_register_date",
    new Date().toLocaleDateString("tr-TR")
);

                authMessage.textContent = "Hesap başarıyla oluşturuldu. Şimdi giriş yapabilirsin.";
                authMessage.style.color = "green";

                isRegisterMode = false;
                authBox.classList.remove("register-mode");
                document.querySelector(".auth-box h2").textContent = "Giriş Yap";
                authSwitchText.textContent = "Hesabın yok mu?";
                switchAuthMode.textContent = "Hemen oluştur";
                loginBtn.textContent = "Giriş Yap";

            }catch(error){
                showAuthError(error, "Kayıt oluşturulamadı");
            }

            return;
        }

        try{
            await signInWithEmailAndPassword(auth, email, password);

            authMessage.textContent = "Giriş başarılı.";
            authMessage.style.color = "green";

            setTimeout(() => {
                authModal.classList.remove("active");

                let savedName = localStorage.getItem("kb_user_name");

if(!savedName){
    savedName = "Profilim";
    localStorage.setItem("kb_user_name", savedName);
}

loginButtons.forEach(btn => {
    btn.textContent = savedName;
    btn.classList.add("logged-in");
});

if(typeof window.initProfile === "function"){
    window.initProfile();
}
                if(typeof window.initProfile === "function"){
    window.initProfile();
}
            }, 800);

        }catch(error){
            showAuthError(error, "Giriş yapılamadı");
        }
    };

    eyeIcon.onclick = function(){
        if(authPassword.type === "password"){
            authPassword.type = "text";
        }else{
            authPassword.type = "password";
        }
    };

    forgotPassword.onclick = async function(){
        const email = authEmail.value.trim();

        if(!email){
            authMessage.textContent = "Şifre sıfırlama için e-posta adresini gir.";
            authMessage.style.color = "red";
            return;
        }

        try{
            await sendPasswordResetEmail(auth, email);
            authMessage.textContent = "Şifre sıfırlama bağlantısı e-posta adresine gönderildi.";
            authMessage.style.color = "green";
        }catch(error){
            showAuthError(error, "Şifre sıfırlama gönderilemedi");
        }
    };

    googleLogin.onclick = async function(){
        const provider = new GoogleAuthProvider();

        try{
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            localStorage.setItem("kb_user_name", user.displayName || "Profilim");
            localStorage.setItem(
    "kb_user_email",
    user.email || ""
);

if(!localStorage.getItem("kb_register_date")){
    localStorage.setItem(
        "kb_register_date",
        new Date().toLocaleDateString("tr-TR")
    );
}

            authMessage.textContent = "Google ile giriş başarılı.";
            authMessage.style.color = "green";

            setTimeout(() => {
                authModal.classList.remove("active");

                loginButtons.forEach(btn => {
                    btn.textContent = user.displayName || "Profilim";
                    btn.classList.add("logged-in");
                });
                if(typeof window.initProfile === "function"){
    window.initProfile();
}
            }, 800);

        }catch(error){
            authMessage.textContent = "Google ile giriş yapılamadı: " + error.message;
            authMessage.style.color = "red";
        }
    };

    function showAuthError(error, fallback){
        if(error.code === "auth/invalid-email"){
            authMessage.textContent = "Lütfen geçerli bir e-posta adresi gir.";
        }else if(error.code === "auth/email-already-in-use"){
            authMessage.textContent = "Bu e-posta adresi zaten kayıtlı.";
        }else if(error.code === "auth/weak-password"){
            authMessage.textContent = "Şifre en az 6 karakter olmalı.";
        }else if(error.code === "auth/user-not-found"){
            authMessage.textContent = "Bu e-posta adresine ait kullanıcı bulunamadı.";
        }else if(error.code === "auth/wrong-password"){
            authMessage.textContent = "Şifre hatalı.";
        }else if(error.code === "auth/invalid-credential"){
            authMessage.textContent = "E-posta veya şifre hatalı.";
        }else{
            authMessage.textContent = fallback + ": " + error.message;
        }

        authMessage.style.color = "red";
    }
};