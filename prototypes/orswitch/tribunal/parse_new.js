const raw = $('Synthesis Call').first().json?.choices?.[0]?.message?.content || '{}';
const agg = $('Aggregate Responses').first().json;
let synthesis_json = {};

// Attempt 1: direct parse
try {
  synthesis_json = JSON.parse(raw.replace(/```json|```/g, '').trim());
} catch(e) {
  // Attempt 2: extract key fields with regex fallback
  try {
    const winnerMatch = raw.match(/"winner"\s*:\s*"([^"]+)"/);
    const reasonMatch = raw.match(/"winner_reason"\s*:\s*"([^"]+)"/);
    const assessMatch = raw.match(/"overall_assessment"\s*:\s*"([^"]*?)"/);
    const VALID_IDS = ['oracle', 'vanilla_claude', 'vanilla_deepseek', 'simulated_aig', 'simulated_gotq'];
    const scores = [];
    for (const id of VALID_IDS) {
      const pattern = new RegExp('"id"\\s*:\\s*"' + id + '"[^}]+}', 's');
      const m = raw.match(pattern);
      if (m) {
        try {
          scores.push(JSON.parse('{' + m[0]));
        } catch(se) {
          scores.push({ id, parse_error: true });
        }
      }
    }
    synthesis_json = {
      winner: winnerMatch ? winnerMatch[1] : 'unknown',
      winner_reason: reasonMatch ? reasonMatch[1] : '',
      overall_assessment: assessMatch ? assessMatch[1] : '',
      scores,
      parse_method: 'regex_fallback'
    };
  } catch(e2) {
    synthesis_json = { error: 'parse_failed', raw };
  }
}

return [{ json: {
  topic: agg.topic,
  question: agg.question,
  oracle_response: agg.oracle_response,
  challenger_results: agg.challengers,
  synthesis: synthesis_json.overall_assessment || '',
  synthesis_json,
  winner: synthesis_json.winner || 'unknown'
} }];