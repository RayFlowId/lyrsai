exports.handler = async function(event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(), body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: "Method not allowed" }) };
  const key = process.env.INTERN_AI_API_KEY;
  if (!key) return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: "INTERN_AI_API_KEY belum diatur di Netlify." }) };
  try {
    const body = JSON.parse(event.body || "{}");
    if (!Array.isArray(body.messages) || !body.messages.length) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: "Pesan tidak valid." }) };
    const r = await fetch("https://discovery-api.intern-ai.org.cn/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.INTERN_AI_MODEL || "intern-latest", messages: body.messages.map(m => ({ role: m.role, content: String(m.content ?? "") })), temperature: 0.7, stream: false })
    });
    return { statusCode: r.status, headers: corsHeaders(), body: await r.text() };
  } catch (e) {
    return { statusCode: 502, headers: corsHeaders(), body: JSON.stringify({ error: "Server gagal memproses permintaan AI." }) };
  }
};
function corsHeaders(){ return { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" }; }
