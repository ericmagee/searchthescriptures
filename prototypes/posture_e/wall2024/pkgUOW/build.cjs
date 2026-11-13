// pkgUOW: the pkgUND open-point test (OPEN, Shared Library) also reads a line that names two readings the record gives:
// "both <X> and <Y> reading/sense/meaning" (rev 2: "use" dropped, it matched the verb, W4 Wall 6055) and "two/rival/competing readings/senses/meanings". Run 36791 luna D5 (log 36189) was
// refused on wording alone: "the record gives both a mistaken-supposition use and a household-usage reading of the sonship".
// Operator's standing ruling: relax too-strict line formats. Only alternatives are added; nothing that passed before can fail.
// usage: node build.cjs <live json> <target json>
const fs = require('fs'), crypto = require('crypto');
const sha = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const [, , fin, fout] = process.argv;
const raw = JSON.parse(fs.readFileSync(fin, 'utf8')); const W = (raw.data || raw).workflow || (raw.data || raw);
if (W.id !== 'moMxiV4Irg1uRBZN') throw new Error('wrong workflow ' + W.id);
const Ls = W.nodes.filter(n => n.name === 'Shared Library'); if (Ls.length !== 1) throw new Error('library count');
const T = Ls[0].parameters.jsCode;
const iL = T.indexOf('\n/*LIB*/'), iM = T.lastIndexOf('\n/*MAP*/'), iE = T.lastIndexOf('\n/*END*/');
if (iL < 0 || iM < iL || iE < iM) throw new Error('not stub form 3');
const LIB = JSON.parse(T.slice(iL + 8, iM)), MAP = JSON.parse(T.slice(iM + 8, iE));
const rebuild = (L, m) => m.p.map(e => typeof e === 'number' ? L[e] : typeof e[0] === 'string' ? e[0] : L.slice(e[0], e[1] + 1).join('\n')).join('\n');
for (const k in MAP) if (rebuild(LIB, MAP[k]).length !== MAP[k].n) throw new Error('live rebuild length differs for ' + k);
const A = '|both\\s+readings|';
const B = '|both\\s+readings|both\\s+(?:(?!--)[^\\s.;:,!?()—–]+\\s+){1,6}and\\s+(?:(?!--)[^\\s.;:,!?()—–]+\\s+){0,6}(?:readings?|senses?|meanings?)\\b|(?:two|rival|competing)\\s+(?:(?!--)[^\\s.;:,!?()—–]+\\s+){0,2}(?:readings|senses|meanings)|';
const hit = LIB.map((l, i) => [i, l]).filter(([i, l]) => l.includes('const OPEN=') && l.includes(A));
if (hit.length !== 1 || hit[0][1].split(A).length !== 2) throw new Error('anchor');
const i0 = hit[0][0]; const before = LIB[i0]; LIB[i0] = before.replace(A, () => B);
const users = [];
for (const k in MAP) { const n0 = MAP[k].n, n1 = rebuild(LIB, MAP[k]).length; if (n1 !== n0) { MAP[k].n = n1; users.push(k + ' ' + n0 + '->' + n1); } }
const LJ = JSON.stringify(LIB);
const head = T.slice(0, iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/, (m, n) => { if (+n !== LIB.length) throw new Error('line count'); return '// library sha ' + sha(LJ) + ', ' + n + ' lines'; });
const T1 = head + '\n/*LIB*/' + LJ + '\n/*MAP*/' + JSON.stringify(MAP) + T.slice(iE);
Ls[0].parameters.jsCode = T1;
const s = JSON.stringify(raw); fs.writeFileSync(fout, s);
console.log('LIB line', i0, before.length, '->', LIB[i0].length, '(+' + (LIB[i0].length - before.length) + ')');
console.log('nodes whose rebuilt length changed (' + users.length + '): ' + users.join('; '));
console.log('Shared Library jsCode', T.length, '->', T1.length, '(' + (T1.length - T.length) + ')', '| library sha', (T.match(/library sha (\w+)/) || [])[1], '->', sha(LJ));
console.log('base sha256', sha(fs.readFileSync(fin, 'utf8')), '| base Shared Library sha', sha(T), '| target sha256', sha(s));
