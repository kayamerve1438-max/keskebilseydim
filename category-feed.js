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
  const page = window.location.pathname.split("/").pop();

  const map = {
    "ev.html": "EV",
    "is.html": "İŞ",
    "yasam.html": "YAŞAM",
    "egitim.html": "EĞİTİM",
    "sinema.html": "SİNEMA",
    "kitap.html": "KİTAP",
    "eglence.html": "EĞLENCE",
    "para.html": "PARA"
  };

  return map[page];
}

async function loadCategoryFeed() {
  const container = document.getElementById("articleList");

  if (!container) return;

  const category = getPageCategory();
  const params = new URLSearchParams(window.location.search);
  const alt = params.get("alt");

  if (!category) return;

const q = query(
  collection(db, "articles"),
  where("status", "==", "published"),
  where("category", "==", category)
);

  const snapshot = await getDocs(q);
  console.log("Sayfa kategorisi:", category);
console.log("URL alt kategorisi:", alt);
console.log("Firebase'den gelen kayıt:", snapshot.size);

snapshot.forEach((docSnap) => {
  const item = docSnap.data();

  console.log({
    title: item.title,
    category: item.category,
    subcategory: item.subcategory,
    subcategorySlug: slugify(item.subcategory)
  });
});

  container.innerHTML = "";

  let results = [];

  snapshot.forEach((docSnap) => {
    const exp = docSnap.data();

    if (!alt || slugify(exp.subcategory) === alt) {
      results.push({
        id: docSnap.id,
        ...exp
      });
    }
  });

  if (!results.length) {
    container.innerHTML = `<p>Bu başlıkta henüz deneyim yok.</p>`;
    return;
  }

  results.forEach((exp) => {
    const card = document.createElement("article");
    card.className = "experience-row";

    card.innerHTML = `
      ${exp.images && exp.images.length > 0 ? `
        <img src="${exp.images[0]}" alt="${exp.title || "Deneyim fotoğrafı"}">
      ` : ""}

      <div>
        <span class="risk-badge">🐾 Bilge Kedi Risk Puanı ${exp.rating || "-"}/10</span>
        <h3>${exp.title || "Başlıksız Deneyim"}</h3>
        <p>${exp.summary || ""}</p>
        <small>👁 0 görüntülenme · 💬 0 yorum · ⏱ 4 dk okuma</small>
        <br>
        <a href="detay.html?id=${exp.id}">Deneyimi Oku →</a>
      </div>
    `;

    container.appendChild(card);
  });
}

loadCategoryFeed();