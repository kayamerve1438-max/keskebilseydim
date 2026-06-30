import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { prompt } = req.body;

    const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024"
      })
    });

    const imageData = await imageResponse.json();

    console.log("OpenAI response:", JSON.stringify(imageData, null, 2));
    console.log("OpenAI status:", imageResponse.status);
    
    const b64 = imageData.data?.[0]?.b64_json;

    if (!b64) {
      return res.status(500).json({ error: "OpenAI görsel üretmedi." });
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const signature = crypto
      .createHash("sha1")
      .update(`timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
      .digest("hex");

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: new URLSearchParams({
          file: `data:image/png;base64,${b64}`,
          api_key: process.env.CLOUDINARY_API_KEY,
          timestamp: String(timestamp),
          signature
        })
      }
    );

    const cloudinaryData = await cloudinaryResponse.json();

    console.log("Cloudinary response:", cloudinaryData);
    console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("API key var mı:", !!process.env.CLOUDINARY_API_KEY);
    console.log("Secret var mı:", !!process.env.CLOUDINARY_API_SECRET);

    if (!cloudinaryData.secure_url) {
      console.error("Cloudinary hata:", cloudinaryData);
      return res.status(500).json({
        error: cloudinaryData.error?.message || "Cloudinary yükleme başarısız."
      });
    }

    return res.status(200).json({
      imageUrl: cloudinaryData.secure_url
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}