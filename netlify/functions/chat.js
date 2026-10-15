exports.handler = async function (event) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const key = process.env.INTERN_AI_API_KEY;

  if (!key) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "API key belum terbaca. Periksa Environment variables Netlify."
      })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    if (!Array.isArray(body.messages) || !body.messages.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Pesan tidak valid." })
      };
    }

    const response = await fetch(
      "https://discovery-api.intern-ai.org.cn/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.INTERN_AI_MODEL || "deepseek-v4-flash-0731",
          messages: body.messages.map((message) => ({
            role: message.role,
            content: String(message.content ?? "")
          })),
          temperature: 0.7,
          stream: false
        })
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || "Server API mengembalikan respons kosong." };
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error:
            data.error?.message ||
            data.message ||
            (typeof data.error === "string" ? data.error : null) ||
            `API gagal dengan status HTTP ${response.status}.`,
          details: data
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        error: "Gagal menghubungi server AI.",
        details: error.message
      })
    };
  }
};
