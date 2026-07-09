import { db } from "./firebase-db.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const categoryEl = document.getElementById("category");
const subcategoryEl = document.getElementById("subcategory");
const contentCountEl = document.getElementById("contentCount");
const jsonArea = document.getElementById("jsonArea");

const generateBtn = document.getElementById("generateBtn");
const dailyPackBtn = document.getElementById("dailyPackBtn");

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
const topicDatabase = {
  ev: {
    komsular: [
      "üst komşu gürültüsü",
      "alt komşuyla anlaşamama",
      "apartman dedikodusu",
      "komşunun sürekli kapı çalması",
      "ortak alan kavgası",
      "apartmanda çocuk sesi",
      "gece yapılan tadilat",
      "komşunun evcil hayvan sorunu"
    ],
    kira: [
      "depozito alamama",
      "ev sahibinin sürekli zam istemesi",
      "kontratı okumadan imzalamak",
      "evi görmeden kapora göndermek",
      "rutubetli evi fark etmemek",
      "aidatı sonradan öğrenmek",
      "eski tesisat sorunu",
      "emlakçıya fazla güvenmek"
    ]
  },

  is: {
    genel: [
      "maaş pazarlığı yapmamak",
      "fazla mesaiyi baştan konuşmamak",
      "mobbingi geç fark etmek",
      "iş görüşmesinde soru sormamak",
      "yanlış ekibe girmek",
      "sözlü vaatlere inanmak",
      "deneme süresini hafife almak",
      "işten ayrılmadan plan yapmamak"
    ]
  },

  yasam: {
    genel: [
      "hayır diyememek",
      "herkesi memnun etmeye çalışmak",
      "arkadaş kazığını geç fark etmek",
      "kendini sürekli ertelemek",
      "aile baskısına boyun eğmek",
      "ilişkide kırmızı bayrakları görmezden gelmek",
      "sağlığı ihmal etmek",
      "zamanı boşa harcamak"
    ]
  },

  egitim: {
    genel: [
      "yanlış bölüm seçmek",
      "üniversite tercihinde sadece puana bakmak",
      "stajı önemsememek",
      "dil öğrenmeyi ertelemek",
      "dersleri son haftaya bırakmak",
      "hoca seçimini araştırmamak",
      "sertifika kursuna körü körüne yazılmak",
      "okulu sosyal çevre için seçmek"
    ]
  },

  para: {
    genel: [
      "kredi kartı borcunu küçümsemek",
      "taksitleri kontrol etmemek",
      "gereksiz alışveriş yapmak",
      "birikim yapmayı ertelemek",
      "yanlış yatırım tavsiyesi dinlemek",
      "abonelikleri unutmak",
      "acil durum parası ayırmamak",
      "ucuz diye kalitesiz ürün almak"
    ]
  },

  itiraflar: {
    genel: [
      "içimde kalan söz",
      "zamanında özür dilememek",
      "sevdiğini söyleyememek",
      "susarak yanlış yapmak",
      "kendine haksızlık etmek",
      "başkasının hayatını kıskanmak",
      "gerçeği geç fark etmek",
      "keşke daha cesur olsaydım"
    ]
  },

  kitap: {
    genel: [
      "abartılan kitabı zorla bitirmek",
      "doğru kitabı çok geç okumak",
      "popüler diye kitap almak",
      "yarım bırakmaya suçluluk duymak"
    ]
  },

  sinema: {
    genel: [
      "fragmana aldanmak",
      "abartılan filme beklentiyle gitmek",
      "yanlış kişiyle film izlemek",
      "puanına bakmadan film seçmek"
    ]
  },

  eglence: {
    genel: [
      "plansız tatile çıkmak",
      "mekanı araştırmadan rezervasyon yapmak",
      "pahalı etkinliğe beklentiyle gitmek",
      "kalabalık grupta plan yapmaya çalışmak"
    ]
  }
};

const titleTemplates = [
  "{topic} konusunda keşke daha önce uyansaydım",
  "{topic} yüzünden aldığım dersi unutamıyorum",
  "{topic} bana pahalıya patladı",
  "{topic} sandığım kadar basit değilmiş",
  "{topic} için kimse beni uyarmamıştı"
];

const bilgeKediNotes = [
  "Bazı dersler okulda değil, hayatın pati izlerinde öğrenilir.",
  "Keşke dememek için bazen iki kere sormak gerekir.",
  "İçine sinmeyen şeyin üstünü örtme, sonra halının altından miyavlar.",
  "Ucuz görünen karar bazen en pahalı pişmanlık olur.",
  "Bir karar vermeden önce, o yolu yürüyenin sesini dinle."
];

function pickRandom(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeTitle(topic){
  return pickRandom(titleTemplates).replace("{topic}", topic);
}

function createLocalContent(){
  const category = categoryEl.value;
  const subcategory = subcategoryEl.value.trim() || "genel";
  const count = Number(contentCountEl.value || 5);
  const categoryTopics = topicDatabase[category] || topicDatabase.ev;
  const topics = categoryTopics[subcategory] || categoryTopics.genel || Object.values(categoryTopics).flat();

  const items = [];

  for(let i = 0; i < count; i++){
    const topic = pickRandom(topics);
    const title = makeTitle(topic);

    items.push({
      title,
      category,
      subcategory,
      summary: `${topic} hakkında sonradan fark edilen küçük detayların nasıl büyük bir pişmanlığa dönüştüğünü anlatan gerçekçi bir deneyim taslağı.`,
      content: `${topic} ilk başta bana çok büyük bir mesele gibi görünmemişti. Hatta karar verirken bunu fazla düşünmeye gerek olmadığını sanmıştım. Ama zaman geçtikçe küçük sandığım detayların aslında bütün süreci etkilediğini fark ettim. O an daha dikkatli olsaydım, birkaç soru daha sorsaydım ya da acele karar vermeseydim bugün bu kadar uğraşmak zorunda kalmazdım. En çok da başta içime sinmeyen şeyi görmezden geldiğim için pişman oldum.`,
      bilgeKedi: pickRandom(bilgeKediNotes),
      editorNote: `Editör Notu: Bu içerik ${topic} konusunda okuyucuya karar vermeden önce düşünmesi gereken noktaları hatırlatmak için hazırlanmıştır.`,
      socialInstagram: `${title}\n\nBazen küçük sandığımız detaylar, sonradan büyük pişmanlıklara dönüşebiliyor.\n\nSen böyle bir şey yaşadın mı?`,
      socialX: `${title} — Keşke Bilseydim`,
      socialLinkedin: `${title}\n\nKarar vermeden önce gerçek deneyimleri okumak bazen en iyi hazırlıktır.`,
      readerQuestion: `Sen ${topic} konusunda ne yaşadın?`,
      tags: [category, subcategory, topic],
      seoTitle: title,
      seoDescription: `${topic} hakkında karar vermeden önce okunması gereken kısa ve gerçekçi bir deneyim.`,
      regretScore: Number((Math.random() * 3 + 7).toFixed(1)),
      comments: [],
      imagePrompt: `${topic} konusunu anlatan sade, modern ve duygusal web görseli`,
      imageUrl: "",
      status: "draft"
    });
  }

  return items;
}

const dailyCategoryPlan = {
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

function createDailyPack(){
  const oldCategory = categoryEl.value;
  const oldSubcategory = subcategoryEl.value;
  const oldCount = contentCountEl.value;

  const allItems = [];

  Object.entries(dailyCategoryPlan).forEach(([category, count]) => {
    categoryEl.value = category;
    subcategoryEl.value = category === "ev" ? "komsular" : "genel";
    contentCountEl.value = count;

    const items = createLocalContent();
    allItems.push(...items);
  });

  categoryEl.value = oldCategory;
  subcategoryEl.value = oldSubcategory;
  contentCountEl.value = oldCount;

  return allItems;
}

dailyPackBtn.onclick = () => {
  const items = createDailyPack();

  jsonArea.value = JSON.stringify(items, null, 2);
  renderPreview(items);

  resultBox.textContent = `Günlük paket hazır: ${items.length} içerik taslağı oluşturuldu.`;
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
        comments:[],
        editorNote:item.editorNote || "",
        imagePrompt:item.imagePrompt || "",
        imageUrl:item.imageUrl || "",
        viewCount:0,
        likeCount:0,
        isGenerated:true,
        status:"published",
        createdAt:serverTimestamp()
        
      });

      saved++;
    }

    resultBox.textContent = `${saved} içerik Firebase’e kaydedildi.`;
  }catch(err){
  console.error("FIREBASE HATASI:", err);

  alert(err.message);

  resultBox.textContent = err.message;
}
  
};
const totalContent = document.getElementById("totalContent");
const todayContent = document.getElementById("todayContent");
const pendingImages = document.getElementById("pendingImages");
const trendList = document.getElementById("trendList");

function loadDashboard(){
  totalContent.textContent = "1";
  todayContent.textContent = "1";
  pendingImages.textContent = "0";

  const categoryTopicGroup = topicDatabase[categoryEl.value] || topicDatabase.ev;
  const activeTrends = Object.values(categoryTopicGroup).flat();

  trendList.innerHTML = activeTrends.map(topic => `
    <button class="trend-item" data-topic="${topic}">
      ${topic}
    </button>
  `).join("");

  document.querySelectorAll(".trend-item").forEach(btn => {
    btn.onclick = () => {
      const topic = btn.dataset.topic;

      jsonArea.value = JSON.stringify({
        task: "Keşke Bilseydim için API'siz içerik üret.",
        topic,
        category: categoryEl.value,
        subcategory: subcategoryEl.value,
        count: Number(contentCountEl.value || 10),
        note: "Bu konuya göre yerel şablonlardan içerik üretilecek."
      }, null, 2);

      resultBox.textContent = `"${topic}" konusu seçildi. Şimdi Taslak Paket Oluştur butonuna basabilirsin.`;
    };
  });
}

categoryEl.addEventListener("change", loadDashboard);

loadDashboard();