export default async function handler(req, res) {

  // Autorise ton site à appeler ce proxy
  res.setHeader('Access-Control-Allow-Origin', 'https://www.airsoft-xp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const COLLECTION_ID = '6891fd02f2996c45c7f2841d';
  const TOKEN = process.env.WEBFLOW_TOKEN; // token caché, jamais visible

  let allItems = [];
  let offset = 0;
  const limit = 100;

  // Webflow renvoie max 100 items à la fois
  // On boucle jusqu'à tout récupérer
  while (true) {
    const response = await fetch(
      `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: 'Erreur API Webflow', status: response.status });
    }

    const data = await response.json();
    const items = data.items || [];
    allItems = allItems.concat(items);

    // Si on a reçu moins de 100 items, c'est qu'on a tout
    if (items.length < limit) break;
    offset += limit;
  }

  res.status(200).json({ items: allItems });
}
