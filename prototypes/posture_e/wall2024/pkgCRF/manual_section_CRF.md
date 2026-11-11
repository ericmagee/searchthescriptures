# Engine manual section: pkgCRF (cure calls without the cure_lines schema, so they read the prompt cache)

Nodes: Shared Library only (three library lines). Stubs that rebuild them: the six cure builders (Cure Build, Panel Cure Build 1 to 3,
Alternate Cure Build, R2 Alternate Cure Build) and the six cure readers (Cure Normalize, Panel Cure Normalize 1 to 3, Alternate Cure Normalize,
R2 Alternate Cure Normalize). Prompt: none (the text sent to every model is unchanged).

## What it does
- A cure call to terra, sol, luna or Haiku (`xkJsonModels()`) no longer carries `response_format` json_schema `cure_lines`. The ANSWER FORMAT
  note stays on the cure ask exactly as before, so the model is still asked for `{"cure_lines":[...]}` in the same words.
- Why: the provider places a structured-output schema ahead of the messages in the cached prefix. A cure request with the schema therefore
  matched nothing the judge's earlier call had cached and read 0 cached tokens, although its messages begin with that earlier request. Without
  the schema the cure request starts with the judge's earlier request (the panel judge call, or the single judge's Verdict call) and can read it.
- The follow-up ask (pkgFUM) adds the ANSWER FORMAT note when the cure ask it follows ended with that note (before: when the cure body carried
  the schema). Same cases, same text.
- `xkRF()` (the schema) is no longer called; its library line is left empty.
- Reading is unchanged: cureText reads cure_lines JSON (fenced or not, extra keys ignored, a reply cut off mid-array keeps every complete entry),
  and reads any other reply as plain lines.

## Limits
- Without the schema the model is not held to the JSON form. A reply that opens with prose before the JSON, JSON with single quotes, or entries
  without "item" is read as text; its items count as unanswered and the follow-up asks them once (one more call). Stored panel verdicts of terra,
  sol, luna and Haiku, asked for JSON with no schema, opened with a complete valid JSON object in 116 of 116 cases (30 days).
- A cache read is not guaranteed: the provider keeps a prefix for a limited time and routes by its own rules. Stored runs before the schema read
  the panel prefix on every Panel Cure call (W4, Wall 4871).

## Size
Code -416 characters (measured, whole workflow); prompt 0.
