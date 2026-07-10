import { db } from "./firebase-db.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function loadPublishedExperiences() {
  console.log("Home feed başladı");

  const container = document.querySelector(".recent-card-grid");

  if (!container) {
    console.error("recent-card-grid bulunamadı");
    return;
  }

  const q = query(
  collection(db, "articles"),
  where("status", "==", "published")
);

  const snapshot = await getDocs(q);
 const docs = snapshot.docs
  .sort((a, b) => {
    const aTime = a.data().publishedAt?.seconds || 0;
    const bTime = b.data().publishedAt?.seconds || 0;
    return bTime - aTime;
  })
  .slice(0, 3);

  console.log("Yayınlanan içerik sayısı:", snapshot.size);

  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = `<p>Henüz yayınlanmış deneyim yok.</p>`;
    return;
  }

  docs.forEach((docSnap) => {
    const exp = docSnap.data();

    const card = document.createElement("article");
    card.className = "new-exp-card";

    card.innerHTML = `
      <span class="tag">${exp.category || "GENEL"}</span>
      <h3>${exp.title || "Başlıksız Deneyim"}</h3>
      <p>${exp.summary || ""}</p>

      <div class="exp-footer">
        <div class="user-mini">
          <div class="user-avatar">🐱</div>
          <div>
            <strong>${exp.authorName || "Anonim"}</strong>
            <span>Yeni eklendi</span>
          </div>
        </div>

        <div class="card-actions">
          <span>♡ 0</span>
          <span>☰ 0</span>
        </div>
      </div>
    `;
    card.style.cursor = "pointer";

card.addEventListener("click", () => {
  window.location.href = `detay.html?id=${docSnap.id}&source=articles`;
});

    container.appendChild(card);
  });
}

loadPublishedExperiences();