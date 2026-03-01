exports.handler = async (event) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers, body: '' };
    }

    try {
      const targetUrl = event.queryStringParameters?.url;
      if (!targetUrl) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing url parameter' }),
        };
      }

      const response = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      const data = await response.text();

      return {
        statusCode: response.status,
        headers: {
          ...headers,
          'Content-Type': response.headers.get('Content-Type') || 'application/json',
          'Cache-Control': 'max-age=3600',
        },
        body: data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message }),
      };
    }
  };
