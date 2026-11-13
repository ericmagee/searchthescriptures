// pkgPTS rev 2 (ASK 227, plan Wall 5879; rev 2 after W3 FAIL Wall 5887): two fixes to "TRUTH App — Protected Table Snapshot to Drive" (kXlKbZpceulxtWvQ).
// Fix 1: "Fetch Pending Snapshots" authenticates with the stored "Supabase account" credential instead of the hard-coded
//        anon headers (anon's 3 s statement_timeout cancels the RPC; measured mean 2,240 ms).
// Fix 2: "Build Snapshot Content" builds one file item per table group (it read only $input.first(), while the RPC marks
//        every fetched row exported); "Log Complete" lists every table and file.
// No database change.
// usage: node build.cjs <parent.json> <target.json>
const fs = require('fs'), crypto = require('crypto');
const [, , fin, fout] = process.argv;
const raw = JSON.parse(fs.readFileSync(fin, 'utf8')); const W = (raw.data || raw).workflow || (raw.data || raw);
if (W.id !== 'kXlKbZpceulxtWvQ') throw new Error('wrong workflow ' + W.id);
const by = n => { const x = W.nodes.filter(y => y.name === n); if (x.length !== 1) throw new Error('node ' + n + ' count ' + x.length); return x[0]; };
const sizes = []; const note = (w, a, b) => sizes.push(w + ' ' + a + ' -> ' + b + ' (' + (b - a >= 0 ? '+' : '') + (b - a) + ')');
const nodes0 = W.nodes.length, conn0 = JSON.stringify(W.connections);

// ---- Fix 1 ----
const F = by('Fetch Pending Snapshots'); const f0 = JSON.stringify(F).length;
const hp = F.parameters.headerParameters.parameters;
const names = hp.map(h => h.name).join(',');
if (names !== 'apikey,Authorization,Content-Type') throw new Error('fetch headers changed: ' + names);
if (F.credentials) throw new Error('fetch already has credentials');
F.parameters.headerParameters.parameters = hp.filter(h => h.name === 'Content-Type');
F.parameters.authentication = 'predefinedCredentialType';
F.parameters.nodeCredentialType = 'supabaseApi';
F.credentials = { supabaseApi: { id: '0Ap4HeISSH05ZS9s', name: 'Supabase account' } };
note('Fetch Pending Snapshots node JSON', f0, JSON.stringify(F).length);

// ---- Fix 2a (rev 2, W3 FAIL Wall 5887): Group By Table reads every input item ----
// Live shape (execution 36577): the HTTP node splits the RPC's jsonb array into one item PER ROW, so the old code,
// which read only $input.first().json and accepted an array or a one-key object, found no rows and returned [] on every run.
const G = by('Group By Table'); const g0 = G.parameters.jsCode;
const gOld = "const raw = $input.first().json;\nlet rows = [];\nif (Array.isArray(raw)) {\n  rows = raw;\n} else if (raw && typeof raw === 'object') {\n  const keys = Object.keys(raw);\n  if (keys.length === 1) rows = raw[keys[0]] || [];\n}\n";
if (!g0.startsWith(gOld) || g0.split(gOld).length !== 2) throw new Error('group anchor');
const gNew = "// ASK 227 rev 2: the HTTP node emits one item PER ROW (execution 36577), so rows come from every input item.\n" +
  "// The two older shapes (the whole array as one item, or an object with one key holding it) are still accepted.\n" +
  "const ins = $input.all().map(i => i.json);\nlet rows = [];\n" +
  "if (ins.length === 1 && Array.isArray(ins[0])) {\n  rows = ins[0];\n" +
  "} else if (ins.length === 1 && ins[0] && typeof ins[0] === 'object' && !('table_name' in ins[0]) && Object.keys(ins[0]).length === 1) {\n  rows = ins[0][Object.keys(ins[0])[0]] || [];\n" +
  "} else {\n  rows = ins.filter(r => r && typeof r === 'object' && typeof r.table_name === 'string');\n}\n";
G.parameters.jsCode = gNew + g0.slice(gOld.length);
if (G.parameters.mode && G.parameters.mode !== 'runOnceForAllItems') throw new Error('group mode ' + G.parameters.mode);
note('Group By Table jsCode', g0.length, G.parameters.jsCode.length);

// ---- Fix 2 ----
const B = by('Build Snapshot Content'); const b0 = B.parameters.jsCode;
if (B.parameters.mode && B.parameters.mode !== 'runOnceForAllItems') throw new Error('build mode ' + B.parameters.mode);
const head = "const d = $input.first().json;\n";
const tail = "return [{ json: { content, filename, table_name: tableName, snapshot_ts: ts } }];";
if (!b0.startsWith(head) || !b0.endsWith(tail) || b0.split(head).length !== 2) throw new Error('build anchors');
const body = b0.slice(head.length, b0.length - tail.length);
B.parameters.jsCode = "// ASK 227: one file per table group. The RPC marks every fetched row exported, so every group must be written.\n" +
  "return $input.all().map(item => {\nconst d = item.json;\n" + body +
  "return { json: { content, filename, table_name: tableName, snapshot_ts: ts } };\n});";
note('Build Snapshot Content jsCode', b0.length, B.parameters.jsCode.length);

const L = by('Log Complete'); const l0 = L.parameters.jsCode;
const lOld = "return [{ json: { status: 'snapshot_saved', table: $('Build Snapshot Content').first().json.table_name, file: $('Build Snapshot Content').first().json.filename, ts: new Date().toISOString() } }];";
if (l0 !== lOld) throw new Error('log code changed');
L.parameters.jsCode = "const built = $('Build Snapshot Content').all().map(x => x.json);\nreturn [{ json: { status: 'snapshot_saved', tables: built.map(b => b.table_name), files: built.map(b => b.filename), saved: $input.all().length, ts: new Date().toISOString() } }];";
note('Log Complete jsCode', l0.length, L.parameters.jsCode.length);
// Log Complete runs once per input item by default only in runOnceForEachItem mode; check the mode so it still emits one row.
if (L.parameters.mode && L.parameters.mode !== 'runOnceForAllItems') throw new Error('log mode ' + L.parameters.mode);

if (W.nodes.length !== nodes0 || JSON.stringify(W.connections) !== conn0) throw new Error('nodes or wiring changed');
const s = JSON.stringify(raw); fs.writeFileSync(fout, s);
console.log('nodes', W.nodes.length, '| sha256', crypto.createHash('sha256').update(s).digest('hex').slice(0, 16));
console.log(sizes.join('\n'));
