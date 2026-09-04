export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzA6ECx8oQd_tGeR_68wgh_U_x2B87-x6E4izJLg_WyjLpFQe9F2ux97Jcy3TyYBe80/exec';

    const body = JSON.stringify(req.body);

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: body,
      redirect: 'follow'
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      return res.status(200).json({ sucesso: true, raw: text });
    }

  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}
