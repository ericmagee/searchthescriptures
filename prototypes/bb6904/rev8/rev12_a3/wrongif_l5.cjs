// Wrong-if L5 for P2D revision 12 (BB-6904), written by the pen (Worker_A3), independent of node code.
// Fires on a CURED K-G1/K-G4 row when a verse in the BROKEN line's first parentheses is named in a later
// round of the broken side and no SHORT or STATEMENT quotation on that row is found in such a later round.
// Usage: node wrongif_l5.cjs <rows.md> <round dir>
const fs = require('fs');
const [rowsPath, dir] = process.argv.slice(2);
const ORDER = ['CR1', 'DR1', 'CR2', 'DR2', 'CR3', 'DR3'];
const rd = k => fs.readFileSync(dir + '/' + k + '.txt', 'utf8');
const R = Object.fromEntries(ORDER.map(k => [k, rd(k)]));
const fold = s => String(s).toLowerCase().replace(/[*_`]+/g, '').replace(/[“”‘’"']/g, '')
  .replace(/[—–]/g, '-').replace(/[\[(](l[1-4]|[cd]r[1-3])[\])]/g, '<$1>').replace(/\s+/g, ' ').trim();
const BK = { matthew: 'mat', matt: 'mat', mt: 'mat', luke: 'luk', lk: 'luk', genesis: 'gen', gen: 'gen', jeremiah: 'jer', jer: 'jer' };
function refs(t) {
  const out = []; let book = null;
  const re = /(?:\b([1-3]?\s?[A-Z][a-z]+)\.?\s+)?(\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?((?:\s*,\s*\d{1,3}(?![:\d]))*)/g; let m;
  while ((m = re.exec(t))) {
    if (m[1]) { const b = m[1].toLowerCase().trim(); book = BK[b] || b.slice(0, 3); }
    if (!book) continue;
    const vs = [+m[3]]; if (m[4]) for (let v = +m[3] + 1; v <= +m[4]; v++) vs.push(v);
    for (const x of (m[5] || '').split(',').map(s => s.trim()).filter(Boolean)) vs.push(+x);
    for (const v of vs) out.push(book + ' ' + m[2] + ':' + v);
  }
  return out;
}
const rows = fs.readFileSync(rowsPath, 'utf8').split('\n').filter(l => /^\| (Panel|Single)/.test(l))
  .map(l => l.replace(/\\\|/g, '\u0001').split(' | ').map(c => c.replace(/\u0001/g, '|').replace(/^\| |\s*\|$/g, '')));
let fired = 0;
for (const c of rows) {
  const [judge, link, kind, status, line, cure] = c;
  if (!/K-G[14]/.test(kind) || !/\bCURED\b/.test(status) || /UNCURED/.test(status)) continue;
  if (/RETRACTED:/.test(cure || '')) continue;
  const p = (line.match(/\(([^)]*\d+:\d+[^)]*)\)/) || [])[1]; if (!p) continue;
  const want = refs(p);
  const pressed = [...(cure || '').matchAll(/PRESSED:[^|]*\|\s*[\[(](DR1|DR2|CR1|CR2|CR3)[\])]/g)].map(m => m[1]);
  const side = /^D\d/.test(link) ? 'C' : 'D'; // DEFENDER link broken -> later rounds are CR*
  const first = Math.min(...(pressed.length ? pressed : [side === 'C' ? 'DR1' : 'CR1']).map(k => ORDER.indexOf(k)));
  const later = ORDER.filter((k, i) => i > first && k[0] === side);
  const naming = later.filter(k => refs(R[k]).some(r => want.includes(r)));
  if (!naming.length) { console.log('SILENT', judge, link, 'no later round of the broken side names', want.join(', ')); continue; }
  const quotes = [...(cure || '').matchAll(/(?:SHORT|STATEMENT):[^\n]*?"([^"]{8,}?)"(?=\s*(?:\||$|\/))/g)].map(m => m[1])
    .concat([...(cure || '').matchAll(/SHORT:[^|]*\|[^|]*\|\s*"(.+?)"\s*\|/g)].map(m => m[1]));
  const ok = quotes.some(q => naming.some(k => fold(R[k]).includes(fold(q))));
  if (ok) console.log('SILENT', judge, link, 'answer quoted from', naming.join('/'));
  else { fired++; console.log('FIRES', judge, link, want.join(', '), 'named in', naming.join('/'), '; no SHORT quotation from those rounds'); }
}
console.log('L5 fired on', fired);
