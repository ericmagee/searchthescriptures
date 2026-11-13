// pkgONR: the operator's name out of the engine's own text (op doc v121 §0(7)). Built on live s184 (1bf4bb8d).
// The name stands 6 times, all in the Shared Library (pkgLIB stub form 3). Two reach stored records: the K-G4 retraction cure reason
// (debate_enforcer_log.cure_reason, 45 rows in 18 runs) and a judges' rule sentence (in prompts: 457 enforcer prompt_sent rows; 14
// judgments). Four are code comments. Each reference is removed, not replaced (§0(7)); a ruling keeps its date and time.
// Text only: no logic, regex or reader of these strings changes. The library is edited the way pack.cjs writes it: the line text in
// /*LIB*/ or a node's own line in /*MAP*/, then each node's rebuilt length n in /*MAP*/ (the stubs refuse a length mismatch), then the
// header sha. Stubs do not change. Anchors must each occur exactly once, so the package re-applies on a later live version.
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
if (JSON.stringify(LIB) !== T.slice(iL + 8, iM) || JSON.stringify(MAP) !== T.slice(iM + 8, iE)) throw new Error('round trip');
const rebuild = (L, m) => m.p.map(e => typeof e === 'number' ? L[e] : typeof e[0] === 'string' ? e[0] : L.slice(e[0], e[1] + 1).join('\n')).join('\n');
for (const k in MAP) if (rebuild(LIB, MAP[k]).length !== MAP[k].n) throw new Error('live rebuild length differs for ' + k);
const R = [
  ["' (Eric 15:18 CST 2026-11-06)'", "' (ruling of 15:18 CST 2026-11-06)'"],                                   // stored: K-G4 cure reason
  ["or the verse of the line its later round names; Eric 2026-11-06)", "or the verse of the line its later round names; ruling of 2026-11-06)"], // prompts
  ["/* pkgSGA3 (W2, 11-08; Eric approved ASK 2):", "/* pkgSGA3 (W2, 11-08; ASK 2):"],                          // comments
  ["{/* pkgRCD (W2; Eric yes 11-08 17:40 CST; Matthew 1:18 repeat):", "{/* pkgRCD (W2; 11-08 17:40 CST; Matthew 1:18 repeat):"],
  ["/* pkgGDS (W3 3362, Eric ASK 1):", "/* pkgGDS (W3 3362, ASK 1):"],
  ["// pkgUND (W3 Wall ruling after 2566; Eric 2026-11-06 \"the results", "// pkgUND (W3 Wall ruling after 2566; 2026-11-06 \"the results"]
];
// every text slot: library lines and nodes' own lines
const slots = []; LIB.forEach((l, i) => slots.push({ get: () => LIB[i], set: v => { LIB[i] = v; }, where: 'LIB ' + i }));
for (const k in MAP) MAP[k].p.forEach(e => { if (Array.isArray(e) && typeof e[0] === 'string') slots.push({ get: () => e[0], set: v => { e[0] = v; }, where: 'own ' + k }); });
const done = [];
for (const [a, b] of R) {
  const hit = slots.filter(s => s.get().includes(a)); const k = hit.reduce((n, s) => n + s.get().split(a).length - 1, 0);
  if (k !== 1) throw new Error('anchor x' + k + ': ' + a);
  hit[0].set(hit[0].get().replace(a, () => b)); done.push(hit[0].where);
}
const users = [];
for (const k in MAP) { const n0 = MAP[k].n, n1 = rebuild(LIB, MAP[k]).length; if (n1 !== n0) { MAP[k].n = n1; users.push(k + ' ' + n0 + '->' + n1); } }
const LJ = JSON.stringify(LIB);
const head = T.slice(0, iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/, (m, n) => { if (+n !== LIB.length) throw new Error('line count'); return '// library sha ' + sha(LJ) + ', ' + n + ' lines'; });
const T1 = head + '\n/*LIB*/' + LJ + '\n/*MAP*/' + JSON.stringify(MAP) + T.slice(iE);
Ls[0].parameters.jsCode = T1;
const left = W.nodes.filter(n => /Eric/.test(JSON.stringify(n.parameters))).map(n => n.name);
if (left.length) throw new Error('name still in ' + left.join(', '));
const s = JSON.stringify(raw); fs.writeFileSync(fout, s);
console.log('edited slots: ' + done.join('; '));
console.log('nodes whose rebuilt length changed (' + users.length + '): ' + users.join('; '));
console.log('Shared Library jsCode', T.length, '->', T1.length, '(' + (T1.length - T.length) + ')', '| library sha', T.match(/library sha (\w+)/)[1], '->', sha(LJ));
console.log('nodes', W.nodes.length, '| target sha256', sha(s));
