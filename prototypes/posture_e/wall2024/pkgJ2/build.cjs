// pkgJ2 (ASK 234, operator "yes" 11-13 16:15 CST): a contradiction made within the closing round itself counts.
// Fault: run 36677, judge contradiction J2 (DEFENDER LINK 4) was CONFIRMED by both checks and refused by the form gate:
// "the earlier round CR4 is not one of the defender's rounds 1 to 3". Both quotes stood in the defender's closing round.
// Part A (gate, needed): in Close Enforcer Record and Judge Contradiction Record, the earlier round may be the side's round 4
// (still only its own rounds); when it is, the two quotations must be two different sentences (neither holds the other).
// Part B (prompt): in Close Enforcer Build and Judge Contradiction Build, one sentence tells the checker that two sentences of
// the same closing round that cannot both be true are a contradiction, and how to quote them.
// usage: node build.cjs <live json> <target json> [A|AB]   (default AB)
const fs = require('fs'), crypto = require('crypto');
const [, , fin, fout, partsArg] = process.argv; const parts = partsArg || 'AB';
const raw = JSON.parse(fs.readFileSync(fin, 'utf8')); const W = (raw.data || raw).workflow || (raw.data || raw);
if (W.id !== 'moMxiV4Irg1uRBZN') throw new Error('wrong workflow ' + W.id);
const OLD_G = "if(!(row.earlier_round.startsWith(P)&&/[123]$/.test(row.earlier_round)))f.push('the earlier round '+row.earlier_round+' is not one of the '+side.toLowerCase()+'\\'s rounds 1 to 3');";
const NEW_G = "if(!(row.earlier_round.startsWith(P)&&/[1234]$/.test(row.earlier_round)))f.push('the earlier round '+row.earlier_round+' is not one of the '+side.toLowerCase()+'\\'s rounds 1 to 4');"
 + "\n  /* pkgJ2 (ASK 234): a contradiction within the closing round counts; it needs two different sentences */"
 + "\n  if(row.earlier_round===P+'4'&&row.closing_round===P+'4'){const a=cecN(row.earlier_q),b=cecN(row.closing_q);if(!a||!b||a.includes(b)||b.includes(a))f.push('both quotations are in '+P+'4 and one holds the other: a contradiction within the closing round needs two different sentences (pkgJ2)');}";
const OLD_P = "A contradiction is two statements that cannot both be true. ";
const NEW_P = "A contradiction is two statements that cannot both be true. Two sentences of the same closing round that cannot both be true are also a contradiction: quote the first as EARLIER [<round 4>] and the second as CLOSING [<round 4>]. ";
const edits = [];
if (parts.includes('A')) for (const nm of ['Close Enforcer Record', 'Judge Contradiction Record']) edits.push([nm, OLD_G, NEW_G]);
if (parts.includes('B')) for (const nm of ['Close Enforcer Build', 'Judge Contradiction Build']) edits.push([nm, OLD_P, NEW_P]);
const out = [];
for (const [nm, a, b] of edits) {
  const ns = W.nodes.filter(n => n.name === nm); if (ns.length !== 1) throw new Error(nm + ' count ' + ns.length);
  const c0 = ns[0].parameters.jsCode; if (c0.split(a).length !== 2) throw new Error(nm + ' anchor count ' + (c0.split(a).length - 1));
  ns[0].parameters.jsCode = c0.replace(a, () => b);
  out.push(nm + ' ' + c0.length + ' -> ' + ns[0].parameters.jsCode.length + ' (+' + (ns[0].parameters.jsCode.length - c0.length) + ')');
}
const s = JSON.stringify(raw); fs.writeFileSync(fout, s);
console.log(out.join('\n')); console.log('parts', parts, '| nodes', W.nodes.length, '| target sha256', crypto.createHash('sha256').update(s).digest('hex').slice(0, 16));
