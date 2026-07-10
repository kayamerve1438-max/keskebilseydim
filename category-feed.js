import { db } from "./firebase-db.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getPageCategory() {
  const page = window.location.pathname.split("/").pop() || "";

  const map = {
    "ev.html": "ev",
    "is.html": "is",
    "yasam.html": "yasam",
    "egitim.html": "egitim",
    "sinema.html": "sinema",
    "kitap.html": "kitap",
    "eglence.html": "eglence",
    "para.html": "para",
    "itiraflar.html": "itiraflar"
  };

  return map[page] || "";
}

function getAltCategoryTitle(alt) {
  const titles = {
    kira: "Ev Kiralamak Deneyimleri",
    komsular: "Komşular Deneyimleri",
    "ev-almak": "Ev Almak Deneyimleri",
    aidat: "Aidat ve Site Hayatı Deneyimleri",
    tasinma: "Taşınma Deneyimleri",
    emlakci: "Emlakçı Deneyimleri",
    tadilat: "Tadilat ve Usta Deneyimleri",
    dekorasyon: "Dekorasyon Deneyimleri",
    "ev-arkadasi": "Ev Arkadaşı Deneyimleri",
    deprem: "Deprem ve Bina Güvenliği Deneyimleri"
  };

  return titles[alt] || "Deneyimler";
}

function getImage(exp) {
  if (exp.imageUrl && String(exp.imageUrl).trim()) {
    return exp.imageUrl;
  }

  if (Array.isArray(exp.images) && exp.images[0]) {
    return exp.images[0];
  }

  return "images/defaults/ev.jpg";
}

async function loadCategoryFeed() {
  const container = document.getElementById("articleList");
  const heading = document.getElementById("altKategoriBaslik");

  if (!container) {
    console.error("articleList bulunamadı.");
    return;
  }

  const pageCategory = getPageCategory();
  const params = new URLSearchParams(window.location.search);
  const alt = slugify(params.get("alt") || "");

  if (!pageCategory) {
    console.error("Sayfa kategorisi belirlenemedi.");
    return;
  }

  container.innerHTML = "<p>Deneyimler yükleniyor...</p>";

  if (heading) {
    heading.textContent = alt
      ? getAltCategoryTitle(alt)
      : `${pageCategory.toUpperCase()} Deneyimleri`;
  }

  try {
    // Sadece published sorgulanıyor.
    // Kategori ve alt kategori aşağıda güvenli şekilde filtreleniyor.
    const q = query(
      collection(db, "articles"),
      where("status", "==", "published")
    );

    const snapshot = await getDocs(q);

    console.log("Yayınlanmış toplam kayıt:", snapshot.size);
    console.log("Aranan kategori:", pageCategory);
    console.log("Aranan alt kategori:", alt);

    const results = [];

    snapshot.forEach((docSnap) => {
      const exp = docSnap.data();

      const itemCategory = slugify(
        exp.categorySlug ||
        exp.category ||
        ""
      );

      const itemSubcategory = slugify(
        exp.subcategorySlug ||
        exp.subcategory ||
        "genel"
      );

      const categoryMatches = itemCategory === pageCategory;
      const subcategoryMatches = !alt || itemSubcategory === alt;

      console.log({
        title: exp.title,
        category: itemCategory,
        subcategory: itemSubcategory,
        categoryMatches,
        subcategoryMatches
      });

      if (categoryMatches && subcategoryMatches) {
        results.push({
          id: docSnap.id,
          ...exp
        });
      }
    });

    container.innerHTML = "";

    if (!results.length) {
      container.innerHTML = `
        <p>
          Bu başlıkta yayınlanmış deneyim bulunamadı.
        </p>
      `;
      return;
    }

    results.forEach((exp) => {
      const card = document.createElement("a");

      card.className = "article-card";
      card.href = `detay.html?id=${exp.id}&source=articles`;

      const imageUrl = getImage(exp);
      const views = exp.viewCount || 0;
      const comments = exp.commentCount || 0;
      const rating = exp.rating || exp.regretScore || "-";

      card.innerHTML = `
        <img
          src="${imageUrl}"
          alt="${exp.title || "Deneyim görseli"}"
          onerror="this.src='images/defaults/ev.jpg'"
        >

        <div>
          <div class="risk-score">
            🐾 Bilge Kedi Risk Puanı
            <span>${rating}/10</span>
          </div>

          <h3>${exp.title || "Başlıksız Deneyim"}</h3>

          <p>${exp.summary || ""}</p>

          <div class="article-meta">
            👁️ ${views} görüntülenme ·
            💬 ${comments} yorum ·
            ⏱️ 4 dk okuma
          </div>

          <span>Deneyimi Oku →</span>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Kategori içerikleri yüklenemedi:", error);

    container.innerHTML = `
      <p>Deneyimler yüklenirken bir hata oluştu.</p>
    `;
  }
}

loadCategoryFeed();