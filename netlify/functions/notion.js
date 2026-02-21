exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID  = process.env.DATABASE_ID;

  if (!NOTION_TOKEN || !DATABASE_ID) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Variables de entorno no configuradas.' }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const payload = { page_size: 100 };
    if (body.start_cursor) payload.start_cursor = body.start_cursor;

    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return { statusCode: res.status, headers, body: JSON.stringify(data) };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
