exports.handler = async function(event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(), body: "" };
  if (event.httpMethod !== "GET") return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: "Method not allowed" }) };
  const key = process.env.INTERN_AI_API_KEY;
  if (!key) return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: "INTERN_AI_API_KEY belum diatur di Netlify." }) };
  try {
    const r = await fetch("https://discovery-api.intern-ai.org.cn/v1/models", { headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" } });
    return { statusCode: r.status, headers: corsHeaders(), body: await r.text() };
  } catch (e) {
    return { statusCode: 502, headers: corsHeaders(), body: JSON.stringify({ error: "Tidak dapat menghubungi API Intern AI." }) };
  }
};
function corsHeaders(){ return { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "GET, OPTIONS" }; }
