export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY eksik" });
    }

    const { topic, category, subcategory, count } = req.body || {};

    const prompt = `
Keşke Bilseydim sitesi için ${category} > ${subcategory} kategorisinde "${topic}" konusu hakkında ${count || 5} adet özgün Türkçe deneyim yaz.

SADECE JSON ARRAY döndür. Markdown, açıklama, kod bloğu yazma.

Her içerikte şu alanlar olsun:
title, summary, content, bilgeKedi, tags, seoTitle, seoDescription, regretScore, comments, imagePrompt, viewCount, likeCount

Kurallar:
- Gerçek insan deneyimi gibi yaz.
- content en az 500 kelime olsun.
- comments 5 adet, konuya özel ve gerçekçi olsun.
- likeCount 20 ile 280 arasında olsun.
- viewCount 300 ile 3500 arasında olsun.
- regretScore 6.5 ile 9.8 arasında olsun.
- imagePrompt gerçek fotoğraf araması için İngilizce olsun.
- JSON dışında hiçbir şey yazma.
`;

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
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

    return res.status(200).json({ text });

  } catch (err) {
    console.error("GENERATE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}