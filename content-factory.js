import { db, storage } from "./firebase-db.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  ref,
  uploadString,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const categoryEl = document.getElementById("category");
const subcategoryEl = document.getElementById("subcategory");
const contentCountEl = document.getElementById("contentCount");
const jsonArea = document.getElementById("jsonArea");
const generateBtn = document.getElementById("generateBtn");
const fillSampleBtn = document.getElementById("fillSampleBtn");
const previewBtn = document.getElementById("previewBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const previewList = document.getElementById("previewList");
const previewCount = document.getElementById("previewCount");
const resultBox = document.getElementById("resultBox");

function slugify(text){
  return String(text || "")
    .toLowerCase()
    .replaceAll("ı","i")
    .replaceAll("ğ","g")
    .replaceAll("ü","u")
    .replaceAll("ş","s")
    .replaceAll("ö","o")
    .replaceAll("ç","c")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");
}
async function generateImageForItem(item){
  const prompt =
    item.imagePrompt ||
    item.seoTitle ||
    item.title ||
    "Gerçekçi blog kapak görseli";

  const response = await fetch("/api/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();

  if(!response.ok){
    console.error("Görsel üretim hatası:", data.error);
    return "";
  }

  const fileName = `article-images/${Date.now()}-${slugify(item.title)}.png`;
  const imageRef = ref(storage, fileName);

  await uploadString(imageRef, data.imageDataUrl, "data_url");

  return await getDownloadURL(imageRef);
}

function parseJson() {
  let text = jsonArea.value.trim();

  if (!text) return [];

  text = text.replace(/```json/g, "");
  text = text.replace(/```/g, "");
  text = text.trim();

  const parsed = JSON.parse(text);

  return Array.isArray(parsed) ? parsed : [];
}

function renderPreview(items){
  previewCount.textContent = `${items.length} içerik`;

  if(items.length === 0){
    previewList.innerHTML = "";
    return;
  }
  previewList.innerHTML = items.map((item, index) => `
    <div class="content-card">
      <h3>${index + 1}. ${item.title || "Başlıksız"}</h3>
      <p><b>Özet:</b> ${item.summary || ""}</p>
      <p><b>Bilge Kedi:</b> 🐾 ${item.bilgeKedi || ""}</p>
      <div class="card-meta">
        <span>${item.category || categoryEl.value}</span>
        <span>${item.subcategory || subcategoryEl.value}</span>
        <span>SEO</span>
        <span>${item.regretScore || 0}/10</span>
        <span>${(item.comments || []).length} yorum</span>
      </div>
    </div>
  `).join("");
}

fillSampleBtn.onclick = () => {
  jsonArea.value = JSON.stringify([
    {
      title:"Apartmanı Beğendim, Üst Komşuyu Hiç Hesaba Katmadım",
      summary:"Evi çok sevdim ama taşındıktan sonra asıl meselenin üst katta başladığını anladım.",
      content:"Evi ilk gördüğümde gerçekten içime sinmişti. Konumu güzeldi, fiyatı uygundu ve odaları beklediğimden ferahtı. Fakat taşındıktan birkaç gün sonra fark ettim ki sadece evi beğenmek yetmiyormuş. Üst komşunun gece geç saatlerde başlayan sandalye sesleri, koşuşturmalar ve sürekli düşen eşyalar evdeki huzurumu tamamen değiştirdi. İlk başta alışırım sandım ama zamanla eve gelmek bile yorucu hissettirmeye başladı. Keşke taşınmadan önce apartmanda akşam saatlerinde biraz vakit geçirseydim.",
      bilgeKedi:"Evin manzarası güzel olabilir ama tavanından gelen ses manzarayı unutturur.",
      tags:["ev","komşu","üst komşu","gürültü","taşınma"],
      seoTitle:"Üst Komşu Gürültüsü Yüzünden Pişman Oldum",
      seoDescription:"Ev kiralamadan önce komşuları araştırmanın neden önemli olduğunu gerçekçi bir deneyim üzerinden okuyun.",
      regretScore:9.2,
      comments:[
        "Ben de üst komşu yüzünden taşınmak zorunda kaldım.",
        "Ev bakarken akşam saatinde gitmek gerçekten önemli.",
        "Bu yazıyı herkes okumalı.",
        "Komşu konusu evin kaderini belirliyor.",
        "Bilge Kedi yine noktayı koymuş."
      ],
      imagePrompt:"Gece apartman dairesinde tavandan gelen ses yüzünden rahatsız olan kiracı, modern premium illüstrasyon"
    }
  ], null, 2);

  renderPreview(parseJson());
  resultBox.textContent = "Örnek JSON dolduruldu.";
};

generateBtn.onclick = async () => {
  try {
    const currentData = JSON.parse(jsonArea.value || "{}");

    const topic = currentData.topic || subcategoryEl.value || "genel deneyim";

    resultBox.textContent = "Yapay zekâ içerik üretiyor...";

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic,
        category: categoryEl.value,
        subcategory: subcategoryEl.value,
        count: Number(contentCountEl.value || 5)
      })
    });

    const data = await response.json();
    console.log("AI CEVABI:", data.text);

    if (!response.ok) {
      resultBox.textContent = "Hata: " + (data.error || "AI içerik üretilemedi.");
      return;
    }

    jsonArea.value = data.text;
    renderPreview(parseJson());

    resultBox.textContent = "AI içerik paketi hazır.";
  } catch (err) {
    console.error(err);
    resultBox.textContent = "Hata: Önce bir trend seç veya JSON formatını kontrol et.";
  }
};


previewBtn.onclick = () => {
  try{
    const items = parseJson();
    renderPreview(items);
    resultBox.textContent = "Önizleme hazır.";
  }catch(err){
    resultBox.textContent = "Hata: JSON formatı geçersiz.";
  }
};

clearBtn.onclick = () => {
  jsonArea.value = "";
  renderPreview([]);
  resultBox.textContent = "Temizlendi.";
};

saveBtn.onclick = async () => {
  try{
    const items = parseJson();
    

    if(items.length === 0){
      alert("Kaydedilecek içerik yok.");
      return;
      
    }

    resultBox.textContent = "Firebase’e kaydediliyor...";

    let saved = 0;

    for(const item of items){
        const generatedImageUrl = await generateImageForItem(item);
      const category = item.category || categoryEl.value;
      const subcategory = item.subcategory || subcategoryEl.value.trim();
      const slug = item.slug || slugify(item.title);

      await addDoc(collection(db, "articles"), {
        title:item.title || "",
        slug,
        category,
        subcategory,
        summary:item.summary || "",
        content:item.content || "",
        bilgeKedi:item.bilgeKedi || "",
        tags:item.tags || [],
        seoTitle:item.seoTitle || item.title || "",
        seoDescription:item.seoDescription || item.summary || "",
        regretScore:item.regretScore || 0,
        comments:item.comments || [],
        imagePrompt:item.imagePrompt || "",
        imageUrl: generatedImageUrl || item.imageUrl || item.image || item.img || "",
        viewCount:item.viewCount || Math.floor(Math.random() * 900) + 100,
        likeCount:item.likeCount || Math.floor(Math.random() * 80) + 10,
        isGenerated:true,
        status:"published",
        createdAt:serverTimestamp()
        
      });

      saved++;
    }

    resultBox.textContent = `${saved} içerik Firebase’e kaydedildi.`;
  }catch(err){
    console.error(err);
    resultBox.textContent = "Hata: JSON formatını veya Firebase bağlantısını kontrol et.";
  }
  
};
const totalContent = document.getElementById("totalContent");
const todayContent = document.getElementById("todayContent");
const pendingImages = document.getElementById("pendingImages");
const trendList = document.getElementById("trendList");

const fakeTrends = [
  "komşu gürültüsü",
  "depozito alamama",
  "ev sahibi baskısı",
  "aidat kavgası",
  "üst komşu sesi",
  "apartman yönetimi",
  "taşınma pişmanlığı",
  "ev arkadaşı sorunu",
  "iş yerinde mobbing",
  "maaş pazarlığı"
];

function loadDashboard(){
  totalContent.textContent = "1";
  todayContent.textContent = "1";
  pendingImages.textContent = "1";

  trendList.innerHTML = fakeTrends.map(topic => `
    <button class="trend-item" data-topic="${topic}">
      ${topic}
    </button>
  `).join("");

  document.querySelectorAll(".trend-item").forEach(btn => {
    btn.onclick = () => {
      subcategoryEl.value = categoryEl.value === "ev" ? "komsular" : subcategoryEl.value;

      const topic = btn.dataset.topic;

      jsonArea.value = JSON.stringify({
        task:"Keşke Bilseydim için trend bazlı içerik üret.",
        topic,
        category:categoryEl.value,
        subcategory:subcategoryEl.value,
        count:Number(contentCountEl.value || 10),
        note:"Bu konudan gerçek insan deneyimi gibi, SEO uyumlu JSON array üret."
      }, null, 2);

      resultBox.textContent = `"${topic}" trend konusu için üretim paketi hazırlandı.`;
    };
  });
}

loadDashboard();