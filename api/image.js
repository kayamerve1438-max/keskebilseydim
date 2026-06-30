export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt boş olamaz." });
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Görsel üretilemedi."
      });
    }

    const b64 = data.data?.[0]?.b64_json;

    if (!b64) {
      return res.status(500).json({ error: "Görsel verisi dönmedi." });
    }

    res.status(200).json({
  imageDataUrl: `data:image/png;base64,${b64}`
});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}