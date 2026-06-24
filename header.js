function initHeader(){
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("nav a").forEach(link => {
        const href = link.getAttribute("href");
        if(!href) return;

        const cleanHref = href.split("?")[0];

        if(cleanHref === currentPage){
            link.classList.add("active-nav");
        }
    });
}

function loadAuth(){
    const authScript = document.createElement("script");
    authScript.type = "module";
    authScript.src = "auth.js";

    authScript.onload = function(){
        fetch("auth.html")
          .then(res => res.text())
          .then(data => {
              const authContainer = document.getElementById("auth-container");
              if(!authContainer) return;

              authContainer.innerHTML = data;

              if(typeof initAuth === "function"){
                  initAuth();
              }

              loadProfile();
          });
    };

    document.body.appendChild(authScript);
}

function loadProfile(){
    const profileScript = document.createElement("script");
    profileScript.src = "profile.js";

    profileScript.onload = function(){

    console.log("PROFILE JS YÜKLENDİ");

    console.log(typeof initProfile);

    if(typeof initProfile === "function"){
        initProfile();
    }
};

    document.body.appendChild(profileScript);
}

initHeader();
loadAuth();
setTimeout(() => {
    if (window.lucide) {
        lucide.createIcons();
    }

    const toggles = document.querySelectorAll(".mega-toggle");

    toggles.forEach((toggle) => {
        toggle.addEventListener("change", () => {
            if (toggle.checked) {
                toggles.forEach((other) => {
                    if (other !== toggle) {
                        other.checked = false;
                    }
                });
            }
        });
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".nav-dropdown")) {
            toggles.forEach((toggle) => {
                toggle.checked = false;
            });
        }
    });
}, 300);