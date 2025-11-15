export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon query parameters are required" });
    }

    const WAQI_TOKEN = process.env.WAQI_TOKEN;

    if (!WAQI_TOKEN) {
      return res.status(500).json({ error: "WAQI token not configured" });
    }

    const response = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}?token=${WAQI_TOKEN}`);
    const data = await response.json();

    if (data.status !== 'ok') {
      return res.status(404).json({ error: "Location not found or API error" });
    }

    res.status(200).json({
      aqi: data.data.aqi,
      idx: data.data.idx
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}