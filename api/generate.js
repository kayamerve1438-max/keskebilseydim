export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY eksik" });
  }

  const { topic, category, subcategory, count } = req.body || {};

  const prompt = `
Keşke Bilseydim sitesi için ${category} > ${subcategory} kategorisinde "${topic}" konusu hakkında ${count || 5} adet özgün Türkçe deneyim yaz.

SADECE JSON ARRAY döndür. Markdown, açıklama, kod bloğu yazma.

Her içerikte şu alanlar kesin olsun:
title, summary, content, bilgeKedi, tags, seoTitle, seoDescription, regretScore, comments, imagePrompt, viewCount, likeCount

Kurallar:
- Her yazı gerçek bir insanın yaşadığı deneyim gibi doğal olsun.
- Aynı başlık, aynı giriş cümlesi, aynı yorum veya aynı kalıp tekrar etme.
- content en az 500 kelime olsun.
- summary kısa ve merak uyandırıcı olsun.
- bilgeKedi kısa, hafif alaycı ama tatlı bir yorum olsun.
- tags 5-8 adet konuya özel etiket olsun.
- regretScore 6.5 ile 9.8 arasında değişken sayı olsun.
- viewCount 300 ile 3500 arasında gerçekçi sayı olsun.
- likeCount 20 ile 280 arasında gerçekçi sayı olsun.
- comments alanı 5 adet olsun.
- comments mutlaka konuya özel, farklı kişilerden yazılmış gibi doğal yorumlar olsun.
- comments genel geçer değil, yazının konusuna dokunan gerçekçi yorumlar olsun.
- imagePrompt, Pexels'te aranabilecek net İngilizce fotoğraf arama cümlesi olsun.
- imagePrompt illüstrasyon değil, gerçek fotoğraf gibi düşünülmeli.

Yorum örnek mantığı:
- Depozito ise depozito iadesi, ev sahibi, boya, hasar, sözleşme gibi detaylardan bahset.
- Komşu gürültüsü ise üst komşu, gece sesleri, apartman yönetimi, huzursuzluk gibi detaylardan bahset.
- Aidat ise yönetim, makbuz, şeffaflık, ortak gider gibi detaylardan bahset.
- Taşınma ise nakliye, eşya hasarı, sözleşme, zamanlama gibi detaylardan bahset.

JSON dışında hiçbir şey yazma.
`;

  const openaiRes = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt
    })
  });

  const data = await openaiRes.json();

  const text =
    data.output_text ||
    data.output?.[0]?.content?.[0]?.text ||
    "";

  res.status(200).json({ text });
}