// pkgONR offline tests: every pkgLIB stub in the workflow is run (up to its own length check) against the live and the target library;
// the rebuilt sources must pass the stub's length check, parse as the stub runs them, differ from live only by the six edits, and carry
// no name. Nodes other than Shared Library and the connections must be byte-identical.
// usage: node test.cjs <live json> <target json>
const fs = require('fs'), vm = require('vm');
const get = f => { const r = JSON.parse(fs.readFileSync(f, 'utf8')); return (r.data || r).workflow || (r.data || r); };
const A = get(process.argv[2]), B = get(process.argv[3]);
let pass = 0, fail = 0; const t = (n, f) => { try { const g = f(); pass++; console.log('PASS ' + n + (g ? ' -> ' + g : '')); } catch (e) { fail++; console.log('FAIL ' + n + ' -> ' + e.message); } };
const lib = W => W.nodes.find(n => n.name === 'Shared Library').parameters.jsCode;
const MARK = c => { const j = c.indexOf('if(__S.length!==__N)throw'); return j < 0 ? -1 : c.indexOf('\n', j); }; /* every stub form: run up to and including its own length check */
const T = lib(A); const MAPK = Object.keys(JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/') + 8, T.lastIndexOf('\n/*END*/'))));
const stubs = A.nodes.filter(n => n.type === 'n8n-nodes-base.code' && /\$\('Shared Library'\)/.test(n.parameters.jsCode || '') && n.name !== 'Shared Library');
const entryOf = n => { const m = n.parameters.jsCode.match(/\/\*END\*\/'\)\)\)\[("(?:[^"\\]|\\.)*")\]/); return m ? JSON.parse(m[1]) : null; };
const run = (stub, L) => { const i = MARK(stub); if (i < 0) throw new Error('no stub marker'); return new Function('$', stub.slice(0, i) + '\nreturn __S;')(n => { if (n !== 'Shared Library') throw new Error('read ' + n); return { params: { jsCode: L } }; }); };
const PAIRS = [["' (Eric 15:18 CST 2026-11-06)'", "' (ruling of 15:18 CST 2026-11-06)'"], ["names; Eric 2026-11-06)", "names; ruling of 2026-11-06)"], ["11-08; Eric approved ASK 2)", "11-08; ASK 2)"], ["(W2; Eric yes 11-08", "(W2; 11-08"], ["(W3 3362, Eric ASK 1)", "(W3 3362, ASK 1)"], ["2566; Eric 2026-11-06", "2566; 2026-11-06"]];
t('nodes other than Shared Library and the connections are byte-identical', () => { if (A.nodes.length !== B.nodes.length) throw new Error('count'); A.nodes.forEach((n, i) => { if (n.name !== 'Shared Library' && JSON.stringify(n) !== JSON.stringify(B.nodes[i])) throw new Error(n.name); }); if (JSON.stringify(A.connections) !== JSON.stringify(B.connections)) throw new Error('conn'); return A.nodes.length + ' nodes'; });
t('every MAP entry has a stub node and every stub node a MAP entry', () => { const sn = stubs.map(entryOf); const a = MAPK.filter(k => !sn.includes(k)), b = sn.filter(k => !MAPK.includes(k)); if (a.length || b.length) throw new Error(JSON.stringify([a, b])); return stubs.length + ' stubs'; });
let changed = 0;
for (const s of stubs) t('stub ' + s.name + ' (entry ' + entryOf(s) + '): rebuilds and passes its length check on target; parses; only the edits differ', () => {
  const a = run(s.parameters.jsCode, lib(A)), b = run(s.parameters.jsCode, lib(B));
  new vm.Script('(async()=>{\n' + b + '\n})();', { filename: s.name });
  let x = a; for (const [o, n] of PAIRS) x = x.split(o).join(n);
  if (x !== b) throw new Error('rebuilt source differs beyond the edits'); if (/Eric/.test(b)) throw new Error('name in rebuilt source');
  if (a !== b) changed++; return a.length + ' -> ' + b.length; });
t('the rebuilt sources changed in 30 stub nodes (29 MAP entries; Early Alternate Build reads the Alternate Build entry)', () => { if (changed !== 30) throw new Error(changed); return changed; });
t('no node parameter carries the name', () => { const n = B.nodes.filter(x => /Eric/.test(JSON.stringify(x.parameters))).length; if (n) throw new Error(n); });
t('library header sha matches its /*LIB*/ text', () => { const T = lib(B); const j = T.slice(T.indexOf('\n/*LIB*/') + 8, T.lastIndexOf('\n/*MAP*/')); const h = require('crypto').createHash('sha256').update(j).digest('hex').slice(0, 16); if (!T.includes('// library sha ' + h + ',')) throw new Error(h); return h; });
console.log('\n' + pass + ' pass, ' + fail + ' fail'); process.exit(fail ? 1 : 0);
