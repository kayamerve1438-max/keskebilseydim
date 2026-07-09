import { db } from "./firebase-db.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { storage } from "./firebase-storage.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
const jsonInput = document.getElementById("jsonInput");
const importJsonBtn = document.getElementById("importJsonBtn");
const loadDraftsBtn = document.getElementById("loadDraftsBtn");
const draftList = document.getElementById("draftList");
const saveDraftsBtn = document.getElementById("saveDraftsBtn");
const categoryEl = document.getElementById("category");
const subcategoryEl = document.getElementById("subcategory");
const countEl = document.getElementById("count");

const generateBtn = document.getElementById("generateBtn");
const dailyBtn = document.getElementById("dailyBtn");
const promptBtn = document.getElementById("promptBtn");
const promptArea = document.getElementById("promptArea");
const dailyPromptBtn = document.getElementById("dailyPromptBtn");
const clearBtn = document.getElementById("clearBtn");

const contentList = document.getElementById("contentList");
const contentCount = document.getElementById("contentCount");
const todayContent = document.getElementById("todayContent");
const draftCount = document.getElementById("draftCount");

let generatedItems = [];
let topicStore = {};
let usedTopicIds = JSON.parse(localStorage.getItem("usedTopicIds") || "[]");

const topicDatabase = {
  ev: ["üst komşu gürültüsü","depozito alamama","ev sahibi baskısı","aidat sorunu","taşınma pişmanlığı"],
  is: ["maaş pazarlığı yapmamak","mobbingi geç fark etmek","fazla mesaiyi konuşmamak","yanlış ekibe girmek"],
  yasam: ["hayır diyememek","arkadaş kazığı","aile baskısı","kendini ihmal etmek"],
  egitim: ["yanlış bölüm seçmek","stajı önemsememek","dil öğrenmeyi ertelemek"],
  para: ["kredi kartı borcu","gereksiz harcama","birikim yapmamak","yanlış yatırım"],
  itiraflar: ["içimde kalan söz","zamanında özür dilememek","keşke susmasaydım"],
  kitap: ["abartılan kitabı zorla bitirmek","doğru kitabı geç okumak","popüler diye kitap almak"],
  sinema: ["fragmana aldanmak","abartılan filme beklentiyle gitmek","yanlış film seçimi"],
  eglence: ["plansız tatil","pahalı etkinlik","yanlış mekan seçimi"]
};

const dailyPlan = {
  ev: 2,
  is: 2,
  yasam: 2,
  egitim: 2,
  para: 2,
  itiraflar: 2,
  kitap: 1,
  sinema: 1,
  eglence: 1
};

const titleTemplates = [
  "{topic} konusunda keşke daha önce uyansaydım",
  "{topic} bana pahalıya patladı",
  "{topic} sandığım kadar basit değilmiş",
  "{topic} için kimse beni uyarmamıştı"
];

const bilgeKediNotes = [
  "Keşke dememek için bazen iki kere sormak gerekir.",
  "Ucuz görünen karar bazen en pahalı pişmanlık olur.",
  "İçine sinmeyen şeyin üstünü örtme, sonra halının altından miyavlar.",
  "Bir karar vermeden önce, o yolu yürüyenin sesini dinle."
];

function pickRandom(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeTitle(topic){
  return pickRandom(titleTemplates).replace("{topic}", topic);
}

function createItems(category, subcategory, count){
  const topics = topicDatabase[category] || topicDatabase.ev;
  const items = [];

  for(let i = 0; i < count; i++){
    const topic = topics[i % topics.length];
    const title = makeTitle(topic);

    items.push({
      title,
      category,
      subcategory,
      topic,
      summary: `${topic} hakkında sonradan fark edilen küçük detayların büyük bir pişmanlığa dönüşmesini anlatan deneyim taslağı.`,
      content: `${topic} ilk başta bana çok büyük bir mesele gibi görünmemişti. Karar verirken bunu fazla düşünmeye gerek olmadığını sandım. Ama zaman geçtikçe küçük sandığım detayların bütün süreci etkilediğini fark ettim. Keşke en başta acele etmeseydim, birkaç soru daha sorsaydım ve içime sinmeyen tarafları görmezden gelmeseydim.`,
      bilgeKedi: pickRandom(bilgeKediNotes),
      socialInstagram: `${title}\n\nBazen küçük sandığımız detaylar sonradan büyük pişmanlıklara dönüşebilir.\n\nSen böyle bir şey yaşadın mı?`,
      socialX: `${title} — Keşke Bilseydim`,
      socialLinkedin: `${title}\n\nKarar vermeden önce gerçek deneyimleri okumak bazen en iyi hazırlıktır.`,
      hashtags: ["#keşkebilseydim", "#deneyim", "#pişmanlık", `#${category}`],
      imagePrompt: `${topic} konusunu anlatan sade, modern, duygusal web görseli`,
      status: "draft"
    });
  }

  return items;
}

function renderItems(){
  contentCount.textContent = `${generatedItems.length} içerik`;
  todayContent.textContent = generatedItems.length;
  draftCount.textContent = generatedItems.filter(item => item.status === "draft").length;

  if(generatedItems.length === 0){
    contentList.innerHTML = "";
    return;
  }

  contentList.innerHTML = generatedItems.map((item, index) => `
    <div class="content-card">
      <h3>${index + 1}. ${item.title}</h3>
      <p><b>Özet:</b> ${item.summary}</p>
      <p><b>Deneyim:</b> ${item.content}</p>
      <p><b>Bilge Kedi:</b> 🐾 ${item.bilgeKedi}</p>
      <p><b>Instagram:</b> ${item.socialInstagram.replaceAll("\n","<br>")}</p>
      <div class="image-upload-box">
  <p><b>Kapak Görseli:</b></p>

  ${item.imageUrl ? `
    <img src="${item.imageUrl}" style="max-width:180px;border-radius:14px;display:block;margin-bottom:10px;">
  ` : `
    <p style="color:#64748b;">Henüz görsel yok.</p>
  `}

  <input type="file" accept="image/*" onchange="uploadContentImage(${index}, this.files[0])">
</div>
       
       <p><b>Görsel:</b></p>
<input 
  type="text" 
  placeholder="Görsel linki veya images/dosya-adi.jpg"
  value="${item.imageUrl || ""}"
  onchange="updateImageUrl(${index}, this.value)"
>
      <div class="content-meta">
        <span>${item.category}</span>
        <span>${item.subcategory}</span>
        <span>${item.topic}</span>
        <span>${item.status}</span>
      </div>

      <div class="content-actions">
        <button class="light" onclick="copyItem(${index})">Kopyala</button>
        <button onclick="markPublished(${index})">Yayınlandı İşaretle</button>
      </div>
    </div>
  `).join("");
}

window.copyItem = function(index){
  const item = generatedItems[index];
  navigator.clipboard.writeText(JSON.stringify(item, null, 2));
  alert("İçerik kopyalandı.");
};

window.markPublished = function(index){
  generatedItems[index].status = "published";
  renderItems();
};

generateBtn.onclick = () => {
  generatedItems = createItems(
    categoryEl.value,
    subcategoryEl.value || "genel",
    Number(countEl.value || 5)
  );

  renderItems();
};

dailyBtn.onclick = () => {
  generatedItems = [];

  Object.entries(dailyPlan).forEach(([category, count]) => {
    generatedItems.push(...createItems(category, "genel", count));
  });

  renderItems();
};

clearBtn.onclick = () => {
  generatedItems = [];
  renderItems();
};

renderItems();
function buildPrompt(){
  const category = categoryEl.value;
  const subcategory = subcategoryEl.value || "genel";
  const count = Number(countEl.value || 5);

  return `
Keşke Bilseydim adlı deneyim platformu için içerik üret.

Amaç:
Gerçek insanların yaşadığı pişmanlıkları ve deneyimleri doğal, samimi ve okunabilir şekilde anlatmak.

Genel Kurallar:
- Türkçe yaz.
- Her içerik tamamen özgün olsun.
- Aynı fikir, aynı başlık veya benzer anlatımı tekrar etme.
- Gerçek insan anlatımı kullan.
- Yapay zekâ tarafından yazıldığı hissi vermesin.
- Reklam dili kullanma.
- Abartı yapma.
- Marka, kişi veya kurum karalama.
- Hakaret ve küfür kullanma.
- Tıbbi, hukuki ve finansal kesin tavsiye verme.
- Yorum ve beğeni üretme.
- Çıktı sadece geçerli JSON array olsun.
- Markdown kullanma.
- Açıklama ekleme.

Kategori: ${category}
Alt Kategori: ${subcategory}
İçerik Sayısı: ${count}

Her içerik şu yapıda olsun:

[
  {
    "title": "",
    "category": "${category}",
    "subcategory": "${subcategory}",
    "summary": "",
    "content": "",
    "lesson": "",
    "bilgeKedi": "",
    "seoTitle": "",
    "seoDescription": "",
    "tags": [],
    "socialInstagram": "",
    "socialX": "",
    "socialLinkedin": "",
    "hashtags": [],
    "imagePrompt": "",
    "status": "draft"
  }
]

Alan Kuralları:

title:
- 45–65 karakter olsun.
- Merak uyandırsın.
- Clickbait olmasın.

summary:
- 20–35 kelime olsun.

content:
- 120–180 kelime olsun.
- Giriş → olay → fark ediş → pişmanlık → ders akışı olsun.
- Samimi ve doğal bir dille yazılsın.

lesson:
- 1 cümlelik çıkarım olsun.

bilgeKedi:
- En fazla 18 kelime olsun.
- Zeki, hafif alaycı ama sevimli olsun.

seoTitle:
- 55–60 karakter olsun.

seoDescription:
- 140–160 karakter olsun.

tags:
- 4–8 adet olsun.

socialInstagram:
- Samimi ve paylaşılabilir olsun.

socialX:
- Kısa ve vurucu olsun.

socialLinkedin:
- Daha profesyonel ve sakin olsun.

hashtags:
- 5–10 adet olsun.

imagePrompt:
- Türkçe yaz.
- Fotoğraf değil, modern dijital illüstrasyon tarzında olsun.
- Gerçek insan yüzü tarif etme.

Bütün içerikler birbirinden tamamen farklı olsun.
`;
}

promptBtn.onclick = async () => {
  const prompt = buildPrompt();
  promptArea.style.display = "block";
  promptArea.value = prompt;

  try{
    await navigator.clipboard.writeText(prompt);
    alert("Prompt kopyalandı. Şimdi ChatGPT’ye yapıştırabilirsin.");
  }catch(err){
    alert("Prompt hazırlandı. Kutudan kopyalayabilirsin.");
  }
};
importJsonBtn.onclick = () => {
  try{
    let text = jsonInput.value.trim();

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");

    const parsed = JSON.parse(text);

    if(!Array.isArray(parsed)){
      alert("JSON array olmalı. Yani çıktı [ ... ] şeklinde başlamalı.");
      return;
    }

    generatedItems = parsed.map(item => ({
      ...item,
      status: item.status || "draft"
    }));

    renderItems();
    alert(`${generatedItems.length} içerik içe aktarıldı.`);
  }catch(err){
    alert("JSON okunamadı. ChatGPT çıktısını tam kopyaladığından emin ol.");
    console.error(err);
  }
};
async function buildDailyPrompt(){
  const dailyTopicLines = [];

  for(const [category, count] of Object.entries(dailyPlan)){
    const topics = await loadTopics(category);
    const selectedTopics = getUnusedTopics(topics, count);

    dailyTopicLines.push(
      `- ${category}: ${selectedTopics.map(item => `${item.id} / ${item.subcategory} / ${item.topic}`).join(", ")}`
    );
  }

  const topicText = dailyTopicLines.join("\n");

  return `
Keşke Bilseydim adlı deneyim platformu için günlük içerik paketi üret.

Genel Kurallar:
- Türkçe yaz.
- Her içerik tamamen özgün olsun.
- Gerçek insan deneyimi gibi doğal yaz.
- Aynı başlık veya benzer anlatımı tekrar etme.
- Abartılı, sahte, reklam kokan dil kullanma.
- Tıbbi, hukuki veya finansal kesin tavsiye verme.
- Küfür, hakaret, marka karalama, kişi hedef gösterme olmasın.
- Yorum ve beğeni üretme.
- Çıktıyı sadece geçerli JSON array olarak ver.
- Markdown kod bloğu kullanma.

Bugün kullanılacak konu havuzu:
${topicText}

Her içerik şu alanlara sahip olsun:
{
  "topicId": "",
  "title": "",
  "category": "",
  "subcategory": "",
  "summary": "",
  "content": "",
  "lesson": "",
  "bilgeKedi": "",
  "seoTitle": "",
  "seoDescription": "",
  "tags": [],
  "socialInstagram": "",
  "socialX": "",
  "socialLinkedin": "",
  "hashtags": [],
  "imagePrompt": "",
  "status": "draft"
}

Önemli:
- Her içerikte topicId alanını verilen ID ile doldur.
- category ve subcategory alanlarını konu havuzundaki bilgilerle doldur.
- content 120-180 kelime olsun.
- İçerikler birbirinden tamamen farklı olsun.
`;
}

dailyPromptBtn.onclick = async () => {
  const prompt = await buildDailyPrompt();

  promptArea.style.display = "block";
  promptArea.value = prompt;

  try{
    await navigator.clipboard.writeText(prompt);
    alert("Günlük paket promptu kopyalandı. ChatGPT’ye yapıştırabilirsin.");
  }catch(err){
    alert("Prompt hazırlandı. Kutudan kopyalayabilirsin.");
  }
};
function buildImageQuery(item){
  const text = `${item.title || ""} ${item.summary || ""} ${item.content || ""} ${item.imagePrompt || ""}`.toLowerCase();

  if(text.includes("kapora") || text.includes("depozito") || text.includes("kira")){
    return "apartment keys rental";
  }

  if(text.includes("komşu") || text.includes("apartman") || text.includes("gürültü")){
    return "apartment building neighbors";
  }

  if(text.includes("taşın") || text.includes("koli") || text.includes("nakliye")){
    return "moving boxes apartment";
  }

  if(text.includes("iş") || text.includes("maaş") || text.includes("mobbing")){
    return "office work stress";
  }

  if(text.includes("para") || text.includes("borç") || text.includes("kredi")){
    return "money bills finance";
  }

  if(text.includes("eğitim") || text.includes("üniversite") || text.includes("sınav")){
    return "student studying";
  }

  return "life decision thinking";
}

async function findFreeImage(item) {
  if (item.imageUrl) return item.imageUrl;

  try {
    const query = buildImageQuery(item);

    const response = await fetch("/api/pexels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      console.warn("Pexels API çalışmadı.");
      return "";
    }

    const data = await response.json();
    return data.image || "";

  } catch (err) {
    console.warn("Görsel alınamadı:", err);
    return "";
  }
}
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

saveDraftsBtn.onclick = async () => {
  try{
    if(generatedItems.length === 0){
      alert("Kaydedilecek içerik yok.");
      return;
    }

    let saved = 0;

    for(const item of generatedItems){
        const autoImageUrl = await findFreeImage(item);
      await addDoc(collection(db, "articles"), {
        topicId: item.topicId || "",
        title: item.title || "",
        slug: item.slug || slugify(item.title),
        category: item.category || "",
        subcategory: item.subcategory || "genel",
        summary: item.summary || "",
        content: item.content || "",
        lesson: item.lesson || "",
        bilgeKedi: item.bilgeKedi || "",
        seoTitle: item.seoTitle || item.title || "",
        seoDescription: item.seoDescription || item.summary || "",
        tags: item.tags || [],
        socialInstagram: item.socialInstagram || "",
        socialX: item.socialX || "",
        socialLinkedin: item.socialLinkedin || "",
        hashtags: item.hashtags || [],
        imagePrompt: item.imagePrompt || "",
        imageUrl: autoImageUrl || item.imageUrl || "",
        status: "draft",
        isGenerated: true,
        viewCount: 0,
        likeCount: 0,
        comments: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      saved++;
    }

    alert(`${saved} içerik Firebase'e taslak olarak kaydedildi.`);
  }catch(err){
    console.error("Firebase kayıt hatası:", err);
    alert("Firebase kayıt hatası: " + err.message);
  }
};
async function loadDrafts(){
  draftList.innerHTML = "Taslaklar yükleniyor...";

  try{
    const q = query(
  collection(db, "articles"),
  where("status", "==", "draft"),
  );

    const snapshot = await getDocs(q);

    if(snapshot.empty){
      draftList.innerHTML = "<p>Henüz taslak yok.</p>";
      return;
    }

    draftList.innerHTML = snapshot.docs.map(docSnap => {
      const item = docSnap.data();

      return `
  <div class="content-card">
    <h3>${item.title || "Başlıksız"}</h3>
    <p><b>Özet:</b> ${item.summary || ""}</p>
    <p><b>Kategori:</b> ${item.category || ""} / ${item.subcategory || ""}</p>
    <p><b>Bilge Kedi:</b> 🐾 ${item.bilgeKedi || ""}</p>
    <p><b>Durum:</b> ${item.status || "draft"}</p>

    <div class="content-actions">
      <button onclick="publishDraft('${docSnap.id}')">🚀 Yayınla</button>
    </div>
  </div>
`;
    }).join("");

  }catch(err){
    console.error("Taslaklar yüklenemedi:", err);
    draftList.innerHTML = "<p>Taslaklar yüklenirken hata oluştu.</p>";
  }
}

loadDraftsBtn.onclick = loadDrafts;
window.publishDraft = async function(id){
  const confirmPublish = confirm("Bu içeriği yayına almak istiyor musun?");

  if(!confirmPublish) return;

  try{
    await updateDoc(doc(db, "articles", id), {
      status: "published",
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    alert("İçerik yayına alındı.");
    loadDrafts();
  }catch(err){
    console.error("Yayınlama hatası:", err);
    alert("Yayınlama hatası: " + err.message);
  }
};
window.updateImageUrl = function(index, value){
  generatedItems[index].imageUrl = value.trim();
};
window.uploadContentImage = async function(index, file){
  if(!file) return;

  try{
    const item = generatedItems[index];

    const safeName = `${Date.now()}-${file.name}`.replace(/\s+/g, "-");
    const imageRef = ref(storage, `article-images/${safeName}`);

    await uploadBytes(imageRef, file);

    const url = await getDownloadURL(imageRef);

    generatedItems[index].imageUrl = url;

    alert("Görsel yüklendi.");
    renderItems();
  }catch(err){
    console.error("Görsel yükleme hatası:", err);
    alert("Görsel yüklenemedi: " + err.message);
  }
};