// pkgPTS rev 2 offline test. Input shape is the LIVE one: one item per row, as the HTTP node emitted in execution 36577
// (fixture live_item_36577.json); planted rows copy that item's keys exactly.
// Chain: Group By Table -> Build Snapshot Content -> (Drive save, one output per item) -> Log Complete
const fs = require('fs'); const [, , f] = process.argv;
const r = JSON.parse(fs.readFileSync(f, 'utf8')); const W = (r.data || r).workflow || (r.data || r);
const code = n => W.nodes.find(x => x.name === n).parameters.jsCode;
const mk = items => ({ all: () => items.map(j => ({ json: j })), first: () => ({ json: items[0] }) });
const live = JSON.parse(fs.readFileSync(__dirname + '/live_item_36577.json', 'utf8')).json;
const keys = Object.keys(live).join(',');
const plant = (t, i, k) => { const x = JSON.parse(JSON.stringify(live)); x.id = 90000 + k * 100 + i; x.table_name = t; x.changed_row = { ...x.changed_row, planted: t + i }; return x; };
const rows = [['audit_log', 5], ['kb_sights', 3], ['drift_guards', 1], ['audit_log', 1]].flatMap(([t, n], k) => Array.from({ length: n }, (_, i) => plant(t, i, k)));
rows.unshift(live);
let pass = 0, fail = 0; const ck = (name, ok, got) => { ok ? pass++ : fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + ' -> ' + got); };
ck('planted rows carry the live item keys', rows.every(x => Object.keys(x).join(',') === keys), keys);
const chain = items => {
  const groups = new Function('$input', code('Group By Table'))(mk(items)).map(x => x.json);
  const built = groups.length ? new Function('$input', code('Build Snapshot Content'))(mk(groups)).map(x => x.json) : [];
  return { groups, built };
};
const L = chain(rows);
ck('LIVE SHAPE (one item per row, 11 rows, 3 tables): 3 files', L.built.length === 3, L.built.length + ' files: ' + L.built.map(b => b.table_name).join(','));
const written = L.built.reduce((s, b) => s + (b.content.match(/### Change /g) || []).length, 0);
ck('every fetched row appears in a file', written === rows.length, written + ' of ' + rows.length);
ck('the real item from 36577 is in the audit_log file', L.built.some(b => b.table_name === 'audit_log' && b.content.includes('"id": 28185')), 'audit_log contains changed_row id 28185');
ck('file names distinct', new Set(L.built.map(b => b.filename)).size === L.built.length, L.built.map(b => b.filename).join(' '));
const one = chain([live]);
ck('a single live row gives one file', one.built.length === 1 && one.built[0].table_name === 'audit_log', one.built.length + ' file');
const A = chain([rows]);
ck('older shape, whole array as one item: 3 files', A.built.length === 3, A.built.length + ' files');
const K = chain([{ get_pending_snapshots: rows }]);
ck('older shape, one-key object: 3 files', K.built.length === 3, K.built.length + ' files');
const E1 = chain([{}]);
ck('empty response as one empty item: no file, no error', E1.groups.length === 0, E1.groups.length + ' groups');
const E2 = chain([[]]);
ck('empty array as one item: no file, no error', E2.groups.length === 0, E2.groups.length + ' groups');
const log = new Function('$', '$input', code('Log Complete'))(() => mk(L.built), mk(L.built.map(() => ({ id: 'drive' })))).map(x => x.json);
ck('log is one row listing every table', log.length === 1 && Array.isArray(log[0].tables) && log[0].tables.length === 3 && log[0].saved === 3, JSON.stringify(log[0]).slice(0, 140));
const F = W.nodes.find(x => x.name === 'Fetch Pending Snapshots');
const hdr = F.parameters.headerParameters.parameters.map(h => h.name).join(',');
ck('fetch uses stored Supabase credential, no inline key', F.parameters.authentication === 'predefinedCredentialType' && F.parameters.nodeCredentialType === 'supabaseApi' && F.credentials && F.credentials.supabaseApi && F.credentials.supabaseApi.name === 'Supabase account' && hdr === 'Content-Type' && !JSON.stringify(F).includes('eyJ'), hdr + ' | ' + JSON.stringify(F.credentials || null));
ck('fetch body and RPC unchanged', F.parameters.url.endsWith('/rpc/get_pending_snapshots') && F.parameters.jsonBody === '{ "p_limit": 100 }' && F.executeOnce === true, F.parameters.jsonBody);
console.log('\n' + pass + ' pass, ' + fail + ' fail'); process.exit(fail ? 1 : 0);
