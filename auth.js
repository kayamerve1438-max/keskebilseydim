function initAuth(){

    const loginBtn = document.querySelector(".login");
    const authModal = document.getElementById("authModal");
    const authClose = document.getElementById("authClose");

    if(!loginBtn || !authModal) return;

    loginBtn.addEventListener("click", () => {
        authModal.classList.add("active");
    });

    if(authClose){
        authClose.addEventListener("click", () => {
            authModal.classList.remove("active");
        });
    }

    authModal.addEventListener("click", (e) => {
        if(e.target === authModal){
            authModal.classList.remove("active");
        }
    });

    const switchBtn = document.getElementById("switchAuthMode");
    const authBox = document.querySelector(".auth-box");
    const authTitle = authBox?.querySelector("h2");
    const loginMainBtn = document.getElementById("loginBtn");
    const authSwitchText = document.getElementById("authSwitchText");

    let registerMode = false;

    if(switchBtn && authBox){

        switchBtn.addEventListener("click", () => {

            registerMode = !registerMode;

            authBox.classList.toggle("register-mode");

            if(registerMode){
                authTitle.textContent = "Kayıt Ol";
                loginMainBtn.textContent = "Kayıt Ol";
                authSwitchText.textContent = "Zaten hesabın var mı?";
                switchBtn.textContent = "Giriş Yap";
            }else{
                authTitle.textContent = "Giriş Yap";
                loginMainBtn.textContent = "Giriş Yap";
                authSwitchText.textContent = "Hesabın yok mu?";
                switchBtn.textContent = "Hemen oluştur";
            }

        });

    }

    document.querySelectorAll(".eye").forEach(btn => {

        btn.addEventListener("click", () => {

            const input = btn.parentElement.querySelector("input");

            if(input.type === "password"){
                input.type = "text";
            }else{
                input.type = "password";
            }

        });

    });

}

