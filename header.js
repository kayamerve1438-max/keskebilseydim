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

  setTimeout(() => {
    const mobileMenu = document.getElementById("mobileMenu");
    if (!mobileMenu) return;

    const menuData = [
        {
            title: "Ev",
            main: "ev.html",
            items: [
                ["🏘️ Komşular", "ev.html?alt=komsular"],
                ["🔑 Ev Kiralamak", "ev.html?alt=kira"],
                ["🏠 Ev Almak", "ev.html?alt=ev-almak"],
                ["💸 Aidat & Site Hayatı", "ev.html?alt=aidat"],
                ["📦 Taşınma", "ev.html?alt=tasinma"],
                ["🏢 Emlakçılar", "ev.html?alt=emlakci"],
                ["🔨 Tadilat & Ustalar", "ev.html?alt=tadilat"],
                ["🛋️ Dekorasyon", "ev.html?alt=dekorasyon"],
                ["👥 Ev Arkadaşı", "ev.html?alt=ev-arkadasi"],
                ["🏗️ Deprem & Bina Güvenliği", "ev.html?alt=deprem"]
            ]
        },
        {
            title: "İş",
            main: "is.html",
            items: [
                ["💰 Maaş", "is.html?alt=maas"],
                ["💼 Mülakat", "is.html?alt=mulakat"],
                ["👔 Patron", "is.html?alt=patron"],
                ["🏢 Ofis Hayatı", "is.html?alt=ofis"],
                ["🚀 Kariyer", "is.html?alt=kariyer"],
                ["📄 İstifa", "is.html?alt=istifa"],
                ["💻 Freelance", "is.html?alt=freelance"],
                ["📈 Girişimcilik", "is.html?alt=girisim"]
            ]
        },
        {
            title: "Yaşam",
            main: "yasam.html",
            items: [
                ["👨‍👩‍👧 Aile", "yasam.html?alt=aile"],
                ["❤️ İlişkiler", "yasam.html?alt=iliski"],
                ["🏥 Sağlık", "yasam.html?alt=saglik"],
                ["🤝 Arkadaşlık", "yasam.html?alt=arkadas"],
                ["🧠 Psikoloji", "yasam.html?alt=psikoloji"]
            ]
        },
        {
            title: "Eğitim",
            main: "egitim.html",
            items: [
                ["🎓 Üniversite", "egitim.html?alt=universite"],
                ["📝 Sınavlar", "egitim.html?alt=sinav"],
                ["📚 Kurslar", "egitim.html?alt=kurs"],
                ["🌍 Yabancı Dil", "egitim.html?alt=yabanci-dil"]
            ]
        },
        {
            title: "Sinema",
            main: "sinema.html",
            items: [
                ["🎬 Filmler", "sinema.html?alt=film"],
                ["📺 Diziler", "sinema.html?alt=dizi"],
                ["⭐ Oyuncular", "sinema.html?alt=oyuncu"]
            ]
        },
        {
            title: "Kitap",
            main: "kitap.html",
            items: [
                ["📖 Roman", "kitap.html?alt=roman"],
                ["🧠 Kişisel Gelişim", "kitap.html?alt=kisisel-gelisim"],
                ["📚 Seriler", "kitap.html?alt=seri"]
            ]
        },
        {
            title: "Eğlence",
            main: "eglence.html",
            items: [
                ["🎮 Oyun", "eglence.html?alt=oyun"],
                ["🏖️ Tatil", "eglence.html?alt=tatil"],
                ["🎵 Konser", "eglence.html?alt=konser"]
            ]
        },
        {
            title: "Para",
            main: "para.html",
            items: [
                ["💰 Birikim", "para.html?alt=birikim"],
                ["📈 Yatırım", "para.html?alt=yatirim"],
                ["💳 Kredi", "para.html?alt=kredi"],
                ["🏦 Tasarruf", "para.html?alt=tasarruf"]
            ]
        },
        {
            title: "İtiraflarımız",
            main: "itiraflar.html",
            items: [
                ["❤️ Aşk", "itiraflar.html?alt=ask"],
                ["💼 İş", "itiraflar.html?alt=is"],
                ["👨‍👩‍👧 Aile", "itiraflar.html?alt=aile"],
                ["🎓 Okul", "itiraflar.html?alt=okul"]
            ]
        }
    ];

    mobileMenu.innerHTML = `
        <a href="index.html">Ana Sayfa</a>
        ${menuData.map(menu => `
            <div class="mobile-dropdown">
                <button class="mobile-dropdown-btn">${menu.title}</button>
                <div class="mobile-submenu">
                    <a href="${menu.main}">${menu.title} Ana Sayfa</a>
                    ${menu.items.map(item => `<a href="${item[1]}">${item[0]}</a>`).join("")}
                </div>
            </div>
        `).join("")}
    `;

    mobileMenu.querySelectorAll(".mobile-dropdown-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.parentElement.classList.toggle("open");
        });
    });
}, 600);

    evLink.replaceWith(wrapper);

    const btn = wrapper.querySelector(".mobile-dropdown-btn");
    btn.addEventListener("click", () => {
        wrapper.classList.toggle("open");
    });
}, 500);