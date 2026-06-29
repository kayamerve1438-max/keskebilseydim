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

function initMegaMenu(){
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
}

function initMobileMenu(){
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if(!mobileBtn || !mobileMenu) return;

    mobileMenu.innerHTML = `
        <div class="mobile-user-box">
            <div class="mobile-user-icon">👤</div>
            <div>
                <strong>test1234</strong>
                <span>test1234@gmail.com</span>
            </div>
        </div>

        <div class="mobile-account-links">
            <a href="profil.html">👤 Profilim</a>
            <a href="bildirimler.html">🔔 Bildirimler</a>
            <a href="messages.html">💬 Mesaj Kutusu</a>
            <a href="sifre-guncelle.html">🔒 Şifre Güncelle</a>
        </div>

        <a href="index.html">Ana Sayfa</a>

        <div class="mobile-dropdown">
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
        </div>

        <div class="mobile-dropdown">
            <button class="mobile-dropdown-btn">İş</button>
            <div class="mobile-submenu">
                <a href="is.html">İş Ana Sayfa</a>
                <a href="is.html?alt=maas">💰 Maaş</a>
                <a href="is.html?alt=mulakat">💼 Mülakat</a>
                <a href="is.html?alt=patron">👔 Patron</a>
                <a href="is.html?alt=ofis">🏢 Ofis Hayatı</a>
                <a href="is.html?alt=kariyer">🚀 Kariyer</a>
                <a href="is.html?alt=istifa">📄 İstifa</a>
            </div>
        </div>

        <div class="mobile-dropdown">
            <button class="mobile-dropdown-btn">Yaşam</button>
            <div class="mobile-submenu">
                <a href="yasam.html">Yaşam Ana Sayfa</a>
                <a href="yasam.html?alt=aile">👨‍👩‍👧 Aile</a>
                <a href="yasam.html?alt=iliski">❤️ İlişkiler</a>
                <a href="yasam.html?alt=saglik">🏥 Sağlık</a>
                <a href="yasam.html?alt=arkadas">🤝 Arkadaşlık</a>
                <a href="yasam.html?alt=psikoloji">🧠 Psikoloji</a>
            </div>
        </div>

        <div class="mobile-dropdown">
            <button class="mobile-dropdown-btn">Eğitim</button>
            <div class="mobile-submenu">
                <a href="egitim.html">Eğitim Ana Sayfa</a>
                <a href="egitim.html?alt=universite">🎓 Üniversite</a>
                <a href="egitim.html?alt=sinav">📝 Sınavlar</a>
                <a href="egitim.html?alt=kurs">📚 Kurslar</a>
                <a href="egitim.html?alt=yabanci-dil">🌍 Yabancı Dil</a>
            </div>
        </div>

        <div class="mobile-dropdown">
            <button class="mobile-dropdown-btn">Sinema</button>
            <div class="mobile-submenu">
                <a href="sinema.html">Sinema Ana Sayfa</a>
                <a href="sinema.html?alt=film">🎬 Filmler</a>
                <a href="sinema.html?alt=dizi">📺 Diziler</a>
                <a href="sinema.html?alt=oyuncu">⭐ Oyuncular</a>
            </div>
        </div>

        <div class="mobile-dropdown">
            <button class="mobile-dropdown-btn">Kitap</button>
            <div class="mobile-submenu">
                <a href="kitap.html">Kitap Ana Sayfa</a>
                <a href="kitap.html?alt=roman">📖 Roman</a>
                <a href="kitap.html?alt=kisisel-gelisim">🧠 Kişisel Gelişim</a>
                <a href="kitap.html?alt=seri">📚 Seriler</a>
            </div>
        </div>

        <div class="mobile-dropdown">
            <button class="mobile-dropdown-btn">Eğlence</button>
            <div class="mobile-submenu">
                <a href="eglence.html">Eğlence Ana Sayfa</a>
                <a href="eglence.html?alt=oyun">🎮 Oyun</a>
                <a href="eglence.html?alt=tatil">🏖️ Tatil</a>
                <a href="eglence.html?alt=konser">🎵 Konser</a>
            </div>
        </div>

        <div class="mobile-dropdown">
            <button class="mobile-dropdown-btn">Para</button>
            <div class="mobile-submenu">
                <a href="para.html">Para Ana Sayfa</a>
                <a href="para.html?alt=birikim">💰 Birikim</a>
                <a href="para.html?alt=yatirim">📈 Yatırım</a>
                <a href="para.html?alt=kredi">💳 Kredi</a>
                <a href="para.html?alt=tasarruf">🏦 Tasarruf</a>
            </div>
        </div>

        <div class="mobile-dropdown">
            <button class="mobile-dropdown-btn">İtiraflarımız</button>
            <div class="mobile-submenu">
                <a href="itiraflar.html">İtiraflar Ana Sayfa</a>
                <a href="itiraflar.html?alt=ask">❤️ Aşk</a>
                <a href="itiraflar.html?alt=is">💼 İş</a>
                <a href="itiraflar.html?alt=aile">👨‍👩‍👧 Aile</a>
                <a href="itiraflar.html?alt=okul">🎓 Okul</a>
            </div>
        </div>

        <button class="mobile-logout-btn">🚪 Çıkış Yap</button>
    `;

    mobileBtn.onclick = function(){
        mobileMenu.classList.toggle("active");
        mobileBtn.textContent = mobileMenu.classList.contains("active") ? "×" : "☰";
    };

    mobileMenu.querySelectorAll(".mobile-dropdown-btn").forEach(btn => {
        btn.onclick = function(){
            btn.parentElement.classList.toggle("open");
        };
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
        link.onclick = function(){
            mobileMenu.classList.remove("active");
            mobileBtn.textContent = "☰";
        };
    });
}

initHeader();
loadAuth();

setTimeout(() => {
    initMegaMenu();
    initMobileMenu();
}, 600);