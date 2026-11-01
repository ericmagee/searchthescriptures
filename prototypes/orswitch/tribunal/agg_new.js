const prompts = $('Build Prompts').first().json;
const oracle_text = $('Oracle Call').first().json?.choices?.[0]?.message?.content || '';
const vanilla_claude_text = $('Vanilla Claude').first().json?.choices?.[0]?.message?.content || '';
const vanilla_claude_model = $('Vanilla Claude').first().json?.model || 'unknown model';
const deepseek_text = $('Vanilla DeepSeek').first().json?.choices?.[0]?.message?.content || '';
const aig_text = $('Simulated AiG').first().json?.choices?.[0]?.message?.content || '';
const gotq_text = $('Simulated GotQ').first().json?.choices?.[0]?.message?.content || '';
const challengers = [
  { id: 'oracle', label: '[FRAMEWORK: Isaiah 28:10 | KJV L1/L2/L3]', type: 'framework', response: oracle_text },
  { id: 'vanilla_claude', label: '[VANILLA AI - ' + vanilla_claude_model + ', no framework]', type: 'vanilla_ai', response: vanilla_claude_text },
  { id: 'vanilla_deepseek', label: '[VANILLA AI - DeepSeek, no framework]', type: 'vanilla_ai', response: deepseek_text },
  { id: 'simulated_aig', label: '[SIMULATED POSITION - Answers in Genesis]', type: 'simulated', response: aig_text },
  { id: 'simulated_gotq', label: '[SIMULATED POSITION - GotQuestions.org]', type: 'simulated', response: gotq_text }
];
const responseBlocks = challengers.map(c => '--- ' + c.label + ' (id:' + c.id + ') ---' + String.fromCharCode(10) + c.response).join(String.fromCharCode(10) + String.fromCharCode(10));
const schema = '{"scores":[{"id":"oracle","text_fidelity":0,"translation_used":"...","commentary_reliance":"LOW|MEDIUM|HIGH","transparency":0,"additions":["..."],"omissions":["..."],"divergence_point":"..."},{"id":"vanilla_claude",...},{"id":"vanilla_deepseek",...},{"id":"simulated_aig",...},{"id":"simulated_gotq",...}],"winner":"oracle|vanilla_claude|vanilla_deepseek|simulated_aig|simulated_gotq|draw","winner_reason":"...","overall_assessment":"..."}';
const lines = [
  'You are the TRUTH App Independent Synthesis node. Score each response HONESTLY. The framework can lose.',
  'CRITICAL: Return EXACTLY 5 score objects in the scores array, one for each of these ids in this order: oracle, vanilla_claude, vanilla_deepseek, simulated_aig, simulated_gotq. No additional entries.',
  'QUESTION: ' + prompts.question,
  'RESPONSES:',
  responseBlocks,
  'Return ONLY valid JSON with exactly 5 scores (one per id listed above), winner, winner_reason, overall_assessment:',
  schema
];
const synthesis_prompt = lines.join(String.fromCharCode(10) + String.fromCharCode(10));
return [{ json: { topic: prompts.topic, question: prompts.question, challengers, synthesis_prompt, oracle_response: oracle_text } }];