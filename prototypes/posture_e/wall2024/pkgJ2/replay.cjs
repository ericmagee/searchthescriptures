// pkgJ2 replay: runs each Record node's OWN code text (helpers, line regex, row build, form gate) from the old and the new
// workflow over every stored E-CLOSECON response line (close enforcer and judge contradiction enforcer), with the debate's
// stored rounds. Lists every row whose form-gate result differs. usage: node replay.cjs <old json> <new json> <rows json> <rounds json>
const fs = require('fs');
const get = f => { const r = JSON.parse(fs.readFileSync(f, 'utf8')); return (r.data || r).workflow || (r.data || r); };
const [, , fo, fn, frows, frounds] = process.argv;
const OLD = get(fo), NEW = get(fn), ROWS = JSON.parse(fs.readFileSync(frows, 'utf8')), RD = JSON.parse(fs.readFileSync(frounds, 'utf8'));
const cut = (c, a, b, incl) => { const i = c.indexOf(a); if (i < 0) throw new Error('no ' + a.slice(0, 40)); const j = c.indexOf(b, i); if (j < 0) throw new Error('no ' + b.slice(0, 40)); return c.slice(i, incl ? j + b.length : j); };
const mk = (W, nm) => {
  const c = W.nodes.find(n => n.name === nm).parameters.jsCode;
  const helpers = c.slice(4, Math.min(...['const BA=', 'const B='].map(k => c.indexOf(k)).filter(i => i >= 0)));               // after "try{": CEC_RK, CEC_PRE, cecN, cecStands, cecLinks, cecRL...
  const ln = cut(c, 'const LN=', '$/i;', true);
  const rowb = cut(c, 'const side=m[2].toUpperCase()', "line:s.slice(0,1200)};", true);
  const gate = cut(c, "if(row.answer==='CONFIRMED'){const f=[];", "row.status=f.length?'NOT CONFIRMED (form)':'CONFIRMED';", true);
  const body = helpers + '\n' + ln + '\nreturn (s,F,rp,LINKS)=>{const links=typeof cecLinks==="function"?cecLinks(F):LINKS;const m=s.match(LN);if(!m)return {status:"NO MATCH"};' + rowb + '\nif(' + gate.slice(3) + 'if(f.length)row.note=f.join("; ");}else row.status="NOT A CONTRADICTION";return row;};';
  return new Function(body)();
};
// the close enforcer takes its links from Close Enforcer Build (cecLinks there); the same function text is in Judge Contradiction Record
const LINKS = (() => { const c = OLD.nodes.find(n => n.name === 'Judge Contradiction Record').parameters.jsCode; return new Function(c.slice(4, c.indexOf('const B=')) + '\nreturn cecLinks;')(); })();
const nodeOf = seat => seat === 'close enforcer' ? 'Close Enforcer Record' : 'Judge Contradiction Record';
const fx = {};
for (const nm of ['Close Enforcer Record', 'Judge Contradiction Record']) fx[nm] = { o: mk(OLD, nm), n: mk(NEW, nm) };
let n = 0, diff = [], same = 0, nomatch = 0; const st = {};
for (const r of ROWS) {
  const s = String(r.response_line || '').trim(); const F = RD[r.run_token] || {}; const f = fx[nodeOf(r.seat)];
  const LK = LINKS(F); const a = f.o(s, F, { copy: 1 }, LK), b = f.n(s, F, { copy: 1 }, LK); n++;
  if (a.status === 'NO MATCH') { nomatch++; continue; }
  // the stored status must equal the old gate where the stored row records a form result
  const stored = /NOT CONFIRMED \(form\)/.test(r.cure_reason || '') ? 'NOT CONFIRMED (form)' : null;
  const k = a.status + ' -> ' + b.status; st[k] = (st[k] || 0) + 1;
  if (stored && a.status !== stored) diff.push({ id: r.id, fidelity: 'OLD GATE DIFFERS FROM STORED', old: a.status, stored });
  if (a.status !== b.status || (a.note || '') !== (b.note || '')) diff.push({ id: r.id, run: r.run_token, seat: r.seat, item: r.item, old: a.status + (a.note ? ' -- ' + a.note : ''), new: b.status + (b.note ? ' -- ' + b.note : '') }); else same++;
}
console.log('rows read', n, '| not in line form (NONE, NO LINE, UNREADABLE)', nomatch, '| unchanged', same);
console.log('old -> new status counts', JSON.stringify(st));
console.log('differences', diff.length); diff.forEach(d => console.log('  ' + JSON.stringify(d)));
