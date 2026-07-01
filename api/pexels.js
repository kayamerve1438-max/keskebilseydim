export default async function handler(req, res) {
  try {
    const { query } = req.body;

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    const data = await response.json();

    if (!data.photos || data.photos.length === 0) {
      return res.status(200).json({
        image: ""
      });
    }

    return res.status(200).json({
      image: data.photos[0].src.large2x
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
}