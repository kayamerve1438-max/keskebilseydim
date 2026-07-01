export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const { topic, category, subcategory, count } = req.body || {};

    const prompt = `
Keşke Bilseydim sitesi için ${category} > ${subcategory} kategorisinde "${topic}" konusu hakkında ${count || 5} adet özgün Türkçe deneyim yaz.

SADECE JSON ARRAY döndür. Açıklama yazma.

Her içerikte şu alanlar olsun:
title, summary, content, bilgeKedi, tags, seoTitle, seoDescription, regretScore, comments, imagePrompt, viewCount, likeCount

Kurallar:
- Gerçek insan deneyimi gibi yaz.
- content en az 500 kelime olsun.
- comments 5 adet, konuya özel ve gerçekçi olsun.
- likeCount 20-280 arası olsun.
- viewCount 300-3500 arası olsun.
- regretScore 6.5-9.8 arası olsun.
- imagePrompt İngilizce ve Pexels fotoğraf araması için uygun olsun.
`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.8
      })
    });

    const data = await openaiRes.json();

    return res.status(200).json(data);

    //const text = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({ text });

  } catch (err) {
    console.error("GENERATE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}