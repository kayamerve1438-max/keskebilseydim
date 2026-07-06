import { db, storage } from "./firebase-db.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const form = document.getElementById("experienceForm");

const fields = {
  title: document.getElementById("title"),
  category: document.getElementById("category"),
  summary: document.getElementById("summary"),
  story: document.getElementById("story"),
  mistake: document.getElementById("mistake"),
  advice: document.getElementById("advice"),
  cost: document.getElementById("cost"),
  rating: document.getElementById("rating")
};

const preview = {
  title: document.getElementById("previewTitle"),
  category: document.getElementById("previewCategory"),
  summary: document.getElementById("previewSummary"),
  mistake: document.getElementById("previewMistake"),
  advice: document.getElementById("previewAdvice"),
  cost: document.getElementById("previewCost"),
  rating: document.getElementById("previewRating"),
  progressFill: document.getElementById("progressFill"),
  progressText: document.getElementById("progressText"),
  summaryCount: document.getElementById("summaryCount")
};

const uploadBtn = document.getElementById("uploadImageBtn");
const imageInput = document.getElementById("experienceImages");
const previewGrid = document.getElementById("imagePreview");

let selectedImages = [];

function updatePreview() {
  preview.title.textContent =
    fields.title.value.trim() || "Başlığın burada görünecek";

  preview.category.textContent =
    fields.category.value || "Kategori";

  preview.summary.textContent =
    fields.summary.value.trim() ||
    "Kısa özet yazdığında burada gerçek deneyim kartı gibi görünecek.";

  preview.mistake.textContent =
    fields.mistake.value.trim() || "Henüz yazılmadı.";

  preview.advice.textContent =
    fields.advice.value.trim() || "Henüz yazılmadı.";

  preview.cost.textContent =
    fields.cost.value.trim() || "Maliyet bilgisi yok.";

  preview.rating.textContent =
    fields.rating.value || "-";

  preview.summaryCount.textContent = fields.summary.value.length;

  const requiredFields = [
    fields.title,
    fields.category,
    fields.summary,
    fields.story,
    fields.rating
  ];

  const optionalFields = [
    fields.mistake,
    fields.advice,
    fields.cost
  ];

  let score = 0;

  requiredFields.forEach(field => {
    if (field.value.trim()) score += 15;
  });

  optionalFields.forEach(field => {
    if (field.value.trim()) score += 8;
  });

  const percent = Math.min(score, 100);

  preview.progressFill.style.width = percent + "%";
  preview.progressText.textContent = percent + "%";
}

Object.values(fields).forEach(field => {
  field.addEventListener("input", updatePreview);
  field.addEventListener("change", updatePreview);
});

if (uploadBtn && imageInput && previewGrid) {
  uploadBtn.addEventListener("click", () => {
    console.log("Fotoğraf seç butonuna basıldı");
    imageInput.click();
  });

  imageInput.addEventListener("change", () => {
    const files = Array.from(imageInput.files);

    files.forEach((file) => {
      if (selectedImages.length >= 10) {
        alert("En fazla 10 fotoğraf yükleyebilirsin.");
        return;
      }

      selectedImages.push(file);

      const reader = new FileReader();

      reader.onload = (e) => {
        const div = document.createElement("div");
        div.className = "image-preview-item";

        div.innerHTML = `
          <img src="${e.target.result}">
          <button type="button" class="remove-image-btn">×</button>
        `;

        div.querySelector(".remove-image-btn").addEventListener("click", () => {
          selectedImages = selectedImages.filter((img) => img !== file);
          div.remove();
        });

        previewGrid.appendChild(div);
      };

      reader.readAsDataURL(file);
    });

    imageInput.value = "";
  });
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  console.log("Form gönderme başladı");

  const experienceData = {
    title: fields.title.value.trim(),
    category: fields.category.value,
    summary: fields.summary.value.trim(),
    story: fields.story.value.trim(),
    mistake: fields.mistake.value.trim(),
    advice: fields.advice.value.trim(),
    cost: fields.cost.value.trim(),
    rating: fields.rating.value,
    imageCount: 0,
    

    status: "pending",
    authorName: "Anonim",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    approvedAt: null,
    approvedBy: null
  };

  try {
    const docRef = await addDoc(collection(db, "experiences"), experienceData);

    console.log("Kayıt başarılı:", docRef.id);

    alert("🎉 Deneyimin editör kontrolüne gönderildi.");

    form.reset();
    selectedImages = [];
    previewGrid.innerHTML = "";
    updatePreview();

  } catch (error) {
    console.error("Firebase kayıt hatası:", error);
    alert("Kayıt yapılamadı. Console hatasına bakalım.");
  }
});

updatePreview();