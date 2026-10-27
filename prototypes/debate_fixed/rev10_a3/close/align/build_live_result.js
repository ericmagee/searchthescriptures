// ALIGNED TO LIVE (BB-7821, 7825): the engine under test is the live ask edge function (debug:true).
// Shapes its reply into the input Build Drift Eval already reads (seam 1A: engine_retrieved_sights).
const start = ($('Oracle Start').first().json.body || $('Oracle Start').first().json);
const base_prompt = start.oracle_system_prompt || '';
const user_question = start.user_question || '';
if (!base_prompt || !user_question) throw new Error('Missing oracle_system_prompt or user_question');
const r = $input.first().json || {};
const answer = r.answer;
if (!answer || String(answer).trim() === '') throw new Error('Live ask returned no answer: ' + JSON.stringify(r).slice(0, 300));
const guardItems = $('Fetch Guards').all().map(i => i.json);
const guards = Array.isArray(guardItems) && guardItems.length === 1 && Array.isArray(guardItems[0]) ? guardItems[0] : guardItems;
if (guards.length === 0) throw new Error('GUARD GATE: 0 drift-guards loaded for the grader');
const guardBlock = 'DRIFT GUARDS (BINDING — ' + guards.length + ' loaded):\n' + guards.map(g => 'DG-' + g.rule_num + ' [' + (g.priority || 'STANDARD') + '] ' + g.subject + ': ' + g.rule + (g.anchor_verses ? ' [Anchors: ' + g.anchor_verses + ']' : '')).join('\n');
return [{json:{
  oracle_system_prompt: base_prompt + '\n\n' + guardBlock,
  user_question,
  sd: new Date().toISOString().split('T')[0],
  guardCount: guards.length,
  heldCount: 0,
  gemini_response: answer,
  retried: false,
  violations_r1: [],
  violations_r2: [],
  engine_retrieved_sights: Array.isArray(r.retrieved_sights) ? r.retrieved_sights : [],
  live_meta: { retrieved_count: r.retrieved_count ?? null, coverage: r.coverage ?? null, retry_status: r.retry_status ?? null, truncated: r.truncated ?? null, stop_reason: r.stop_reason ?? null }
}}];
