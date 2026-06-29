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
setTimeout(() => {
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if(!mobileBtn || !mobileMenu) return;

    mobileBtn.onclick = function(){
        mobileMenu.classList.toggle("active");
        mobileBtn.textContent = mobileMenu.classList.contains("active") ? "×" : "☰";
    };

    mobileMenu.querySelectorAll("a").forEach(link => {
        link.onclick = function(){
            mobileMenu.classList.remove("active");
            mobileBtn.textContent = "☰";
        };
    });
}, 300);
setTimeout(() => {
    const evLink = document.querySelector('#mobileMenu a[href="ev.html"]');
    if (!evLink) return;

    const wrapper = document.createElement("div");
    wrapper.className = "mobile-dropdown";

    wrapper.innerHTML = `
    <button class="mobile-dropdown-btn">Ev</button>
    <div class="mobile-submenu">
        <a href="ev.html">Ev Ana Sayfa</a>
        <a href="ev.html?alt=komsular">🏘️ Komşular</a>
        <a href="ev.html?alt=kira">🔑 Ev Kiralamak</a>
        <a href="ev.html?alt=ev-almak">🏠 Ev Almak</a>
        <a href="ev.html?alt=aidat">💸 Aidat & Site Hayatı</a>
        <a href="ev.html?alt=tasinma">📦 Taşınma</a>
        <a href="ev.html?alt=emlakci">🏢 Emlakçılar</a>
        <a href="ev.html?alt=tadilat">🔨 Tadilat & Ustalar</a>
        <a href="ev.html?alt=dekorasyon">🛋️ Dekorasyon</a>
        <a href="ev.html?alt=ev-arkadasi">👥 Ev Arkadaşı</a>
        <a href="ev.html?alt=deprem">🏗️ Deprem & Bina Güvenliği</a>
    </div>
`;

    evLink.replaceWith(wrapper);

    const btn = wrapper.querySelector(".mobile-dropdown-btn");
    btn.addEventListener("click", () => {
        wrapper.classList.toggle("open");
    });
}, 500);