let currentEditImages = [];
import { db } from "./firebase-db.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const pendingList = document.getElementById("pendingList");
const pendingCount = document.getElementById("pendingCount");

async function loadPendingExperiences() {
  pendingList.innerHTML = `<p class="empty-text">Yükleniyor...</p>`;

const q = query(
  collection(db, "experiences"),
  where("status", "==", "pending")
);

  const snapshot = await getDocs(q);

  pendingList.innerHTML = "";

  if (snapshot.empty) {
    pendingCount.textContent = "0 içerik";
    pendingList.innerHTML = `<p class="empty-text">Henüz bekleyen deneyim yok.</p>`;
    return;
  }

  pendingCount.textContent = `${snapshot.size} içerik`;

  snapshot.forEach((docSnap) => {
    const exp = docSnap.data();
    const id = docSnap.id;

    const card = document.createElement("div");
    card.className = "pending-item";

    card.innerHTML = `
      <div>
        <span class="pending-category">${exp.category || "Kategori Yok"}</span>
        <h3>${exp.title || "Başlıksız Deneyim"}</h3>
        <p>${exp.summary || "Özet yok."}</p>
        <small>Status: ${exp.status}</small>
        ${exp.images && exp.images.length > 0 ? `
  <div class="admin-image-preview">
    ${exp.images.map(url => `<img src="${url}" alt="Deneyim fotoğrafı">`).join("")}
  </div>
` : ""}
        
      </div>

      <div class="pending-actions">
        <button class="edit-btn" data-id="${id}">Düzenle</button>
        <button class="approve-btn" data-id="${id}">Onayla</button>
        <button class="reject-btn" data-id="${id}">Reddet</button>
      </div>
    `;

    pendingList.appendChild(card);
  });

  document.querySelectorAll(".approve-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const ok = confirm("Bu deneyimi yayına almak istediğine emin misin?");

    if (!ok) return;

    await updateDoc(doc(db, "experiences", btn.dataset.id), {
      status: "published"
    });

    alert("Deneyim yayına alındı.");
    loadPendingExperiences();
  });
});

document.querySelectorAll(".reject-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const ok = confirm("Bu deneyimi reddetmek istediğine emin misin?");

    if (!ok) return;

    await updateDoc(doc(db, "experiences", btn.dataset.id), {
      status: "rejected"
    });

    alert("Deneyim reddedildi.");
    loadPendingExperiences();
  });
});

document.querySelectorAll(".edit-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    openEditModal(btn.dataset.id);
  });
});
}

loadPendingExperiences();
const editModal = document.getElementById("editModal");
const closeEditModal = document.getElementById("closeEditModal");
const saveEditBtn = document.getElementById("saveEditBtn");

const editFields = {
  id: document.getElementById("editId"),
  title: document.getElementById("editTitle"),
  category: document.getElementById("editCategory"),
  summary: document.getElementById("editSummary"),
  story: document.getElementById("editStory"),
  mistake: document.getElementById("editMistake"),
  advice: document.getElementById("editAdvice"),
  cost: document.getElementById("editCost"),
  rating: document.getElementById("editRating"),
  images: document.getElementById("editImages")

};

async function openEditModal(id) {
  const ref = doc(db, "experiences", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("Deneyim bulunamadı.");
    return;
  }

  const exp = snap.data();

  editFields.id.value = id;
  editFields.title.value = exp.title || "";
  editFields.category.value = exp.category || "";
  editFields.summary.value = exp.summary || "";
  editFields.story.value = exp.story || "";
  editFields.mistake.value = exp.mistake || "";
  editFields.advice.value = exp.advice || "";
  editFields.cost.value = exp.cost || "";
  editFields.rating.value = exp.rating || "";
  currentEditImages = exp.images || [];
renderEditImages();

  editModal.classList.add("active");
}

closeEditModal.addEventListener("click", () => {
  editModal.classList.remove("active");
});

saveEditBtn.addEventListener("click", async () => {
  const id = editFields.id.value;

  await updateDoc(doc(db, "experiences", id), {
    title: editFields.title.value.trim(),
    category: editFields.category.value.trim(),
    summary: editFields.summary.value.trim(),
    story: editFields.story.value.trim(),
    mistake: editFields.mistake.value.trim(),
    advice: editFields.advice.value.trim(),
    cost: editFields.cost.value.trim(),
    rating: editFields.rating.value.trim(),
    images: currentEditImages,
    imageCount: currentEditImages.length
  });

  alert("Deneyim güncellendi.");
  editModal.classList.remove("active");
  loadPendingExperiences();
});
loadPendingExperiences();

function renderEditImages() {
  editFields.images.innerHTML = "";

  if (!currentEditImages.length) {
    editFields.images.innerHTML = `<small>Fotoğraf yok.</small>`;
    return;
  }

  currentEditImages.forEach((url, index) => {
    const item = document.createElement("div");
    item.className = "edit-image-item";

    item.innerHTML = `
      <img src="${url}" alt="Deneyim fotoğrafı">
      <button type="button" class="delete-edit-image">×</button>
    `;

    item.querySelector("button").addEventListener("click", () => {
      const ok = confirm("Bu fotoğrafı kaldırmak istediğine emin misin?");
      if (!ok) return;

      currentEditImages.splice(index, 1);
      renderEditImages();
    });

    editFields.images.appendChild(item);
  });
}