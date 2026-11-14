// pkgD22: removal only. Deletes the clause ` "his neighbour's wife," Deuteronomy 22:24;` from the DG-8 footing sentence in
// node "Init with Guards" (W2 Wall 6084; same clause ASK 250 removed from Conclusion 76). Nothing added, nothing else changed.
// Built on live s189 (library sha 786852fd247f0812). usage: node build.cjs <live json> <target json>
const fs = require('fs'), crypto = require('crypto');
const md5 = s => crypto.createHash('md5').update(s).digest('hex');
const [, , fin, fout] = process.argv;
const raw = JSON.parse(fs.readFileSync(fin, 'utf8')); const W = (raw.data || raw).workflow || (raw.data || raw);
if (W.id !== 'moMxiV4Irg1uRBZN') throw new Error('wrong workflow ' + W.id);
const lib = W.nodes.find(n => n.name === 'Shared Library').parameters.jsCode;
if (!lib.includes('library sha 786852fd247f0812, 3497 lines')) throw new Error('not s189 library');
const N = W.nodes.filter(n => n.name === 'Init with Guards'); if (N.length !== 1) throw new Error('node count');
const c0 = N[0].parameters.jsCode;
const A = ' \\"his neighbour\'s wife,\\" Deuteronomy 22:24;';
const k = c0.split(A).length - 1; if (k !== 1) throw new Error('anchor x' + k);
const c1 = c0.replace(A, () => '');
if (/neighbour's wife|Deuteronomy 22/.test(c1)) throw new Error('residue');
N[0].parameters.jsCode = c1;
for (const n of W.nodes) if (n.name !== 'Init with Guards' && /neighbour's wife|Deuteronomy 22:2[34]/.test(n.parameters?.jsCode || '')) throw new Error('other carrier ' + n.name);
fs.writeFileSync(fout, JSON.stringify(raw));
console.log('Init with Guards', c0.length, '->', c1.length, '(' + (c1.length - c0.length) + ')', md5(c0), '->', md5(c1));
console.log('removed:', JSON.stringify(A));
const i = c1.indexOf('\\"Mary thy wife,\\" Matthew 1:20;'); console.log('after:', c1.slice(i - 120, i + 80));
