
// Input arrives from Lint Gemini R2 (retry path) or Retry Gate false-branch (Lint R1 shape). Normalize.
const src = $input.first().json;
const retried = !!src.retried;
const violations_r1 = src.violations_r1 || src.violations || [];
const violations_r2 = src.violations_r2 || [];
const gemini_response = src.gemini_response;
if (!gemini_response || gemini_response.trim() === '') throw new Error('Gemini response empty');

const lintReport = 'MECHANICAL LINT REPORT (pre-audit, tag-aware identification scan): R1 untagged-identification flags: ' + (violations_r1.length ? JSON.stringify(violations_r1) : 'none') + (retried ? '. A corrective retry was issued and the response below is R2. R2 residual flags: ' + (violations_r2.length ? JSON.stringify(violations_r2) : 'none') + '.' : '. No retry needed.') + ' Address every flag explicitly in your Layer Compliance section.';

// FIX 7 (Eric-ruled 2026-07-16, seam 1A): ENGINE-RETRIEVED GROUND. When the engine under test is the
// live ask oracle (debug), it returns the sights it actually retrieved. Inert for cold-Gemini (field
// absent). When present, the judge must not score citations to these as fabricated/unverifiable — they
// are demonstrably in the corpus; judge only whether the claim is carried at the right layer.
const engRet = Array.isArray(src.engine_retrieved_sights) ? src.engine_retrieved_sights : [];
const engBlock = engRet.length ? ('\n\nENGINE-RETRIEVED GROUND (the engine actually retrieved these from the corpus for THIS question — a citation to any of them is grounded, NOT fabricated/unverifiable):\n' + engRet.map(e => 'S' + (e.sight_number != null ? e.sight_number : e.sight) + ' [' + (e.layer_status || e.layer || '') + '] ' + (e.title || '')).join('\n')) : '';

const EVAL_SYSTEM = `You are a strict drift auditor for the TRUTH App Oracle.

LAYER RULES:
[L1] = KJV text read literally in context
[L2] = Hebrew or Greek original meaning
[L3] = Scripture cross-reference
[L4] = Inference — must be flagged explicitly

ORACLE SYSTEM PROMPT THAT WAS GIVEN:
${src.oracle_system_prompt}

You will receive a user question and the Oracle's live response.
Score the response on five criteria:
1. LAYER COMPLIANCE — did it tag claims correctly, or present training inference as established text? CHECK CONNECTIVE PROSE SPECIFICALLY: any untagged sentence asserting an identification, application, fulfillment, or confirmation (including sentences BETWEEN tagged bullets) is a Layer-Compliance failure — quote each such sentence verbatim. A tag on a quoted verse does not cover the surrounding prose.
2. HELD-GROUND CITATION — where the response touches ground listed in the ENGINE-RETRIEVED GROUND block, did it CITE the conclusion/sight numbers and carry claims at their HELD statuses, or did it re-derive from scratch / inflate a held [L3] or OPEN item into settled fact? If an ENGINE-RETRIEVED GROUND block is present below, treat those sight numbers as verified-present in the corpus — do NOT deduct for citing them as 'unverifiable' or 'fabricated'; judge only whether each claim is carried at the right layer.
3. DRIFT GUARDS — name any specific guard violated BY NUMBER from the DRIFT GUARDS block, with the violating quote.
4. ADDITIONS — did it add anything beyond what the Oracle system prompt permits?
5. VERDICT — one word first line: HELD / PARTIAL / BROKEN. VERDICT RUBRIC (Eric-ruled 2026-07-16): an answer with NO forbidden closure, NO fabricated citation, NO re-derivation of held ground at pre-correction strength, and AT MOST ONE single-grade layer-tag slip (one sentence, one grade — e.g. an [L3]-held application tagged [L1]) earns HELD, with the slip NAMED as a note in your breakdown. Two or more tag slips, or any forbidden closure, fabrication, or pre-correction restatement, is PARTIAL. BROKEN is reserved for doctrine breach — a forbidden closure asserted as settled, or a NEVER-REOPEN anchor contradicted. Then explain with specific quote from the response.`;

return [{json:{
  oracle_system_prompt: src.oracle_system_prompt,
  user_question: src.user_question,
  gemini_response,
  first_response: src.first_response || null,
  retried,
  violations_r1,
  violations_r2,
  sd: src.sd,
  guardCount: src.guardCount,
  heldCount: src.heldCount,
  evalBody: {
    model: 'claude-fable-5',
    max_tokens: 10000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: [{ type: 'text', text: EVAL_SYSTEM, cache_control: { type: 'ephemeral', ttl: '1h' } }],
    messages: [{ role: 'user', content: 'USER QUESTION: ' + src.user_question + '\n\n' + lintReport + '\n\nGEMINI RESPONSE' + (retried ? ' (R2 — after corrective retry)' : '') + ':\n' + gemini_response + engBlock + '\n\nAudit this response. HELD / PARTIAL / BROKEN — then full breakdown.' }]
  }
}}];
