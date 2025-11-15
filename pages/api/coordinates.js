export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://tqwdvwcgpqwtkrtjuyqf.supabase.co/functions/v1/get-coords', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxd2R2d2NncHF3dGtydGp1eXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODkyOTIsImV4cCI6MjA3ODc2NTI5Mn0.GlGsmrq5eq8HlTNeztL-AstlrFNvZK6sDZbADnkFm5g',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coordinates' });
  }
}