// pkgJ2 end-to-end: runs the whole Judge Contradiction Record node (old and new) on run 36677's two stored checks.
// Inputs rebuilt from the log: each check's reply is its own two CLOSE-CONTRADICTION lines (rows 35244-35245, 35246-35247);
// candidates J1 and J2; rounds from debate_results. usage: node e2e.cjs <old json> <new json> <rows json> <rounds json>
const fs = require('fs');
const get = f => { const r = JSON.parse(fs.readFileSync(f, 'utf8')); return (r.data || r).workflow || (r.data || r); };
const [, , fo, fn, frows, frounds] = process.argv;
const ROWS = JSON.parse(fs.readFileSync(frows, 'utf8')).filter(r => r.run_token === 'ODV1-36677-0hxbzcd2' && r.seat === 'judge contradiction enforcer');
const F = JSON.parse(fs.readFileSync(frounds, 'utf8'))['ODV1-36677-0hxbzcd2'];
const reply = ids => ({ json: { choices: [{ message: { content: ROWS.filter(r => ids.includes(r.id)).map(r => r.response_line).join('\n') }, finish_reason: 'stop' }] } });
const run = W => {
  const code = W.nodes.find(n => n.name === 'Judge Contradiction Record').parameters.jsCode;
  const links = new Function(code.slice(4, code.indexOf('const B=')) + '\nreturn cecLinks;')()(F);
  const B1 = { cec_skip: false, cands_only: true, links, cands: [{ id: 'J1' }, { id: 'J2' }], body: { messages: [{}, { content: 'P' }] }, model: 'deepseek', run_token: 'ODV1-36677-0hxbzcd2', copy: 1 };
  const nodes = { 'Judge Contradiction Build': [B1, { ...B1, copy: 2 }], 'Panel Payloads': [{}], 'Final Output': [F] };
  const $ = nm => { if (!(nm in nodes)) return { isExecuted: false, first() { throw new Error('not run ' + nm); }, all() { return []; } }; return { isExecuted: true, first: () => ({ json: nodes[nm][0] }), all: () => nodes[nm].map(j => ({ json: j })) }; };
  const $input = { all: () => [reply([35244, 35245]), reply([35246, 35247])] };
  return new Function('$', '$input', code)($, $input)[0].json;
};
for (const [lab, f] of [['OLD', fo], ['NEW', fn]]) {
  const o = run(get(f)); const c = o.jcc;
  console.log(lab, '| skipped', c.skipped, '| errors', JSON.stringify(c.errors));
  c.rows.forEach(x => console.log('   ', x.id, x.side, 'LINK', x.link, x.earlier_round + '->' + x.closing_round, '|', x.status, x.note ? '| ' + x.note.slice(0, 160) : ''));
  console.log('   confirmed (link broken by the contradiction rule):', JSON.stringify(c.confirmed.map(x => x.side + ' LINK ' + x.link + ' ' + x.id)));
  console.log('   log rows:', o.jcc_log.length, o.jcc_log.map(r => r.item + ' = ' + (r.cure_reason || '').slice(0, 60)).join(' || '));
}
