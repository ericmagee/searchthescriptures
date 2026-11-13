// pkgJ2 unit plants: each Record node's own gate code (old and new), on run 36677's stored rounds.
// usage: node test.cjs <old json> <new json> <rounds json>
const fs = require('fs');
const get = f => { const r = JSON.parse(fs.readFileSync(f, 'utf8')); return (r.data || r).workflow || (r.data || r); };
const [, , fo, fn, frounds] = process.argv; const OLD = get(fo), NEW = get(fn);
const F = JSON.parse(fs.readFileSync(frounds, 'utf8'))['ODV1-36677-0hxbzcd2'];
const cut = (c, a, b) => { const i = c.indexOf(a), j = c.indexOf(b, i); if (i < 0 || j < 0) throw new Error('cut'); return c.slice(i, j + b.length); };
const mk = (W, nm) => { const c = W.nodes.find(n => n.name === nm).parameters.jsCode;
  const h = c.slice(4, Math.min(...['const BA=', 'const B='].map(k => c.indexOf(k)).filter(i => i >= 0)));
  const body = h + '\n' + cut(c, 'const LN=', '$/i;') + '\nreturn (s,F,LINKS)=>{const links=LINKS;const m=s.match(LN);if(!m)return {status:"NO MATCH"};const rp={copy:1};' + cut(c, 'const side=m[2].toUpperCase()', "line:s.slice(0,1200)};") + '\nif(' + cut(c, "if(row.answer==='CONFIRMED'){const f=[];", "row.status=f.length?'NOT CONFIRMED (form)':'CONFIRMED';").slice(3) + 'if(f.length)row.note=f.join("; ");}else row.status="NOT A CONTRADICTION";return row;};';
  return new Function(body)(); };
const jc = OLD.nodes.find(n => n.name === 'Judge Contradiction Record').parameters.jsCode;
const LK = new Function(jc.slice(4, jc.indexOf('const B=')) + '\nreturn cecLinks;')()(F);
const L = (side, link, er, eq, cr, cq) => `CLOSE-CONTRADICTION: J9 -- ${side} -- LINK ${link} -- CONFIRMED -- EARLIER [${er}] "${eq}" -- CLOSING [${cr}] "${cq}" -- plant`;
const A1 = 'I do not rest any link on a verse whose row I granted.', A2 = 'Two footings, Luke 2:48 and 2:49.';
const d4 = String(F.dr4).split(/(?<=[.!?])\s+/).filter(s => s.split(' ').length >= 6 && !/["“”\n*\[\]#]|--|\.\.\./.test(s));
const cases = [
  ['run 36677 J2 as stored (CR4 -> CR4, two sentences)', L('DEFENDER', 4, 'CR4', A1, 'CR4', A2), 'NOT CONFIRMED (form)', 'CONFIRMED'],
  ['same sentence quoted twice in CR4', L('DEFENDER', 4, 'CR4', A2, 'CR4', A2), 'NOT CONFIRMED (form)', 'NOT CONFIRMED (form)'],
  ['one quote holds the other (part of the same sentence)', L('DEFENDER', 4, 'CR4', A1, 'CR4', 'rest any link on a verse whose row'), 'NOT CONFIRMED (form)', 'NOT CONFIRMED (form)'],
  ['earlier quote not word for word in CR4', L('DEFENDER', 4, 'CR4', 'I rest every link on the granted rows today.', 'CR4', A2), 'NOT CONFIRMED (form)', 'NOT CONFIRMED (form)'],
  ['challenger cites the defender round CR4 as its earlier round', L('CHALLENGER', 1, 'CR4', A1, 'DR4', d4[0]), 'NOT CONFIRMED (form)', 'NOT CONFIRMED (form)'],
  ['earlier CR4, closing CR3 (closing must be round 4)', L('DEFENDER', 4, 'CR4', A1, 'CR3', A2), 'NOT CONFIRMED (form)', 'NOT CONFIRMED (form)'],
  ['challenger DR4 -> DR4, two different stored sentences', L('CHALLENGER', (LK.CHALLENGER || [1])[0], 'DR4', d4[0], 'DR4', d4[1]), 'NOT CONFIRMED (form)', 'CONFIRMED'],
  ['rev 2: run 36677 J2 reversed (EARLIER quote stands after the CLOSING one in CR4)', L('DEFENDER', 4, 'CR4', A2, 'CR4', A1), 'NOT CONFIRMED (form)', 'NOT CONFIRMED (form)'],
  ['rev 2: challenger DR4 pair reversed', L('CHALLENGER', (LK.CHALLENGER || [1])[0], 'DR4', d4[1], 'DR4', d4[0]), 'NOT CONFIRMED (form)', 'NOT CONFIRMED (form)'],
  ['rev 2: in-order pair with an ellipsis in the earlier quote', L('DEFENDER', 4, 'CR4', 'I do not rest any link ... on a verse whose row I granted.', 'CR4', A2), 'NOT CONFIRMED (form)', 'CONFIRMED'],
  ['CR3 -> CR4 as live (J1 shape, answered CONFIRMED)', L('DEFENDER', 5, 'CR3', "I grant the flesh is David's seed.", 'CR4', A1), 'CONFIRMED', 'CONFIRMED'],
  ['close enforcer form "ROUND 4" for both (closing enforcer only)', L('DEFENDER', 4, 'ROUND 4', A1, 'ROUND 4', A2), 'NOT CONFIRMED (form)', 'CONFIRMED', 'close'],
];
let ok = 0, bad = 0;
for (const nm of ['Judge Contradiction Record', 'Close Enforcer Record']) {
  const o = mk(OLD, nm), n = mk(NEW, nm);
  for (const [lab, s, eo, en, only] of cases) {
    if (only === 'close' && nm !== 'Close Enforcer Record') continue;
    const a = o(s, F, LK), b = n(s, F, LK); const pass = a.status === eo && b.status === en;
    pass ? ok++ : bad++; console.log((pass ? 'OK   ' : 'FAIL ') + nm + ': ' + lab + ' | old ' + a.status + ' | new ' + b.status + (b.note ? ' | ' + b.note.slice(0, 150) : ''));
  }
}
console.log(ok + ' OK, ' + bad + ' FAIL');
