const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({maxInstances: 10});

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

function createArticle(topic, category, subcategory){
  const title = `${topic} yüzünden taşınmadan önce keşke daha dikkatli olsaydım`;

  return {
    title,
    slug: slugify(title),
    category,
    subcategory,
    summary: `${topic} konusunda yaşanan gerçekçi bir deneyim ve bundan çıkarılan dersler.`,
    content: `
Evi ilk gördüğümde her şey çok normal görünüyordu. Konumu iyiydi, fiyatı bütçeme uygundu ve içime sinmişti. O an sadece evin içine baktım; odaların büyüklüğüne, mutfağa, banyoya, ışık alıp almadığına odaklandım.

Ama sonradan anladım ki ev sadece dört duvardan ibaret değilmiş. Apartman düzeni, komşular, ses, aidat, ortak alan kullanımı ve insanların birbirine saygısı en az evin kendisi kadar önemliymiş.

Taşındıktan kısa süre sonra ${topic} konusu hayatımı ciddi şekilde etkilemeye başladı. Önce küçük şeyler gibi geldi. "Olur böyle şeyler" dedim. Ama zamanla bu durum günlük hayatımı, uykumu ve evdeki huzurumu bozdu.

Keşke evi tutmadan önce apartmanda biraz daha vakit geçirseydim. Keşke komşularla konuşsaydım. Keşke sadece emlakçının anlattıklarına değil, orada yaşayan insanların deneyimlerine de kulak verseydim.

Bugün biri bana ev tutmadan önce neye dikkat etmeliyim diye sorsa, ilk söyleyeceğim şey şu olur: Sadece evi değil, yaşayacağın düzeni de incele. Çünkü kötü bir apartman düzeni, güzel bir evi bile yaşanmaz hale getirebilir.
    `.trim(),
    bilgeKedi: "Evin metrekaresini ölçersin ama komşunun sesini ölçemezsin.",
    tags: ["ev", "komşular", "apartman", "taşınma", topic],
    seoTitle: `${topic} hakkında gerçek bir ev deneyimi | Keşke Bilseydim`,
    seoDescription: `${topic} konusunda ev tutmadan önce bilinmesi gerekenleri gerçekçi bir deneyim üzerinden okuyun.`,
    regretScore: 8.7,
    comments: [
      "Ben de benzerini yaşadım, gerçekten ev kadar çevre de önemli.",
      "Keşke taşınmadan önce komşularla konuşsaymışım.",
      "Bu yazıyı ev arayan herkes okumalı.",
      "Apartman düzeni gerçekten insanın huzurunu etkiliyor.",
      "Bilge Kedi yine haklı."
    ],
    imagePrompt: `Modern bir apartmanda ${topic} nedeniyle huzursuz olan bir kiracı, premium dijital illüstrasyon, Keşke Bilseydim marka tarzı`,
    viewCount: Math.floor(Math.random() * 900) + 100,
    likeCount: Math.floor(Math.random() * 80) + 10,
    isGenerated: true,
    status: "published",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
}

async function generateAndSaveContent(){
  const category = "ev";
  const subcategory = "komsular";

  const topics = [
    "komşu gürültüsü",
    "apartmanda aidat sorunu",
    "üst komşunun sürekli ses yapması",
    "taşınmadan önce komşuları araştırmamak",
    "apartmanda ortak alan kavgası"
  ];

  const saved = [];

  for(const topic of topics){
    const article = createArticle(topic, category, subcategory);
    const ref = await db.collection("articles").add(article);
    saved.push({id: ref.id, title: article.title});
  }

  return saved;
}

exports.generateContentNow = onRequest(async (req, res) => {
  try{
    const saved = await generateAndSaveContent();

    res.status(200).json({
      success: true,
      count: saved.length,
      saved
    });
  }catch(error){
    logger.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

exports.generateContentEveryNight = onSchedule(
  {
    schedule: "0 3 * * *",
    timeZone: "Europe/Istanbul"
  },
  async () => {
    const saved = await generateAndSaveContent();
    logger.info("Nightly content generated", {count: saved.length});
  }
);