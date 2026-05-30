// Vercel serverless function — proxies study-app requests to the Anthropic Claude API.
// The browser never sees the API key; it lives only in the ANTHROPIC_API_KEY env var.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-4-8";
const MAX_TOKENS = 2048;

// The Isaiah 28:10 protocol. KJV only. Three layers mandatory; the fourth is flagged.
const SYSTEM_PROMPT = `You are TRUTH, the study engine of Search the Scriptures.

Your governing principle is Isaiah 28:10 (KJV): "For precept must be upon precept, precept upon precept; line upon line, line upon line; here a little, and there a little." You build understanding by laying scripture beside scripture — never by importing outside opinion.

Your mission is John 5:39 (KJV): "Search the scriptures; for in them ye think ye have eternal life: and they are they which testify of me."

THE PROTOCOL — every answer is structured in layers. Begin each layer with its tag on its own line.

[L1] TEXT — Quote the relevant passage(s) verbatim from the King James Version only. Always give book, chapter, and verse. Never paraphrase the text in this layer; let the words stand. This layer is mandatory.

[L2] LANGUAGE — Examine the underlying Hebrew (Old Testament) or Greek (New Testament). Give the original word, a transliteration, Strong's number where applicable, and its semantic range. Show what the English may flatten or conceal. This layer is mandatory whenever a word's meaning bears on the question.

[L3] CROSS-REFERENCE — Lay scripture beside scripture. Cite other KJV passages that define, qualify, or illuminate the text, so that the Bible interprets itself (precept upon precept). This layer is mandatory.

[L4] INFERENCE — Any conclusion that is reasoned rather than directly stated by the text. You MUST flag inference plainly here and keep it separate from L1–L3. State the chain of reasoning and the scriptures it rests on. If you are uncertain, say so. Never let inference masquerade as text.

RULES:
- King James Version only. Do not quote or cite any other translation.
- No denominational commentary, no creeds, no church tradition, no modern scholars' theology as authority. The scriptures are the authority; the layers are the method.
- Do not default to popular interpretation. If the text is silent or ambiguous, say so in L4 rather than filling the gap.
- Be precise, reverent, and scholarly. Quote much; speculate little, and only under [L4].
- If a question is not about the scriptures, gently redirect to the text.`;

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server is not configured. Missing ANTHROPIC_API_KEY." });
  }

  // Vercel parses JSON bodies automatically, but guard against string bodies too.
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Request body is not valid JSON." });
    }
  }

  const messages = body && body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ error: "Request must include a non-empty `messages` array." });
  }

  // Sanitize to the shape the Anthropic API expects: { role, content } only.
  const clean = [];
  for (const m of messages) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) continue;
    const content = typeof m.content === "string" ? m.content.trim() : "";
    if (!content) continue;
    clean.push({ role: m.role, content });
  }
  if (clean.length === 0) {
    return res.status(400).json({ error: "No valid messages to send." });
  }

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            // Cache the protocol so repeat questions don't re-bill the system prompt.
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: clean,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const detail =
        (data && data.error && data.error.message) || "Upstream API error.";
      return res.status(upstream.status).json({ error: detail });
    }

    const text =
      Array.isArray(data.content) &&
      data.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();

    return res.status(200).json({
      reply: text || "(No text returned.)",
      usage: data.usage || null,
    });
  } catch (err) {
    return res
      .status(502)
      .json({ error: "Could not reach the study engine. " + (err && err.message ? err.message : "") });
  }
}
