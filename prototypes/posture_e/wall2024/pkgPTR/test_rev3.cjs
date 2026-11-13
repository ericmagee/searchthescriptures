// pkgPTR rev 3 offline tests. Shapes read from source (n8n-nodes-base 2.15.1): createFromText returns { id } per file, the router
// pushes { error } for a refused item under continue (regular output); fileFolder search with returnAll returns one item per found
// file ({ id, name } with fields id, name), none when nothing is found (alwaysOutputData then gives one empty item), { error } refused.
// usage: node test_rev3.cjs target_rev3.json
const fs = require('fs');
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const W = (r.data || r).workflow || (r.data || r);
const node = n => { const x = W.nodes.find(y => y.name === n); if (!x) throw new Error('no node ' + n); return x; };
const code = n => node(n).parameters.jsCode;
const live = JSON.parse(fs.readFileSync(__dirname + '/live_item_36577.json', 'utf8')).json;
const mk = data => n => { if (!(n in data)) throw new Error('unmocked node ' + n); const v = data[n]; return { all: () => v.map(j => ({ json: j })), first: () => ({ json: v[0] }) }; };
const run = (c, data, input, prev) => new Function('$', '$input', '$prevNode', c)(mk(data), { all: () => input.map(j => ({ json: j })), first: () => ({ json: input[0] }) }, { name: prev || '' });
const expr = (s, data, json) => new Function('$', '$json', 'return ' + s.replace(/^=\{\{\s*/, '').replace(/\s*\}\}$/, ''))(mk(data), json);
let pass = 0, fail = 0;
const expect = (name, fn) => { try { const g = fn(); pass++; console.log('PASS ' + name + (g ? ' -> ' + String(g).slice(0, 220) : '')); } catch (e) { fail++; console.log('FAIL ' + name + ' -> ' + e.message); } };
const eq = (a, b, w) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(w + ': got ' + JSON.stringify(a) + ' want ' + JSON.stringify(b)); };
const ERR = 'Forbidden - perhaps check your credentials?';

// Execution 36680 shape: four tables, all four reported refused by the first save; session_log had landed.
const T = ['session_log', 'audit_log', 'debate_results', 'debate_judgments'];
const rows = []; let id = 60000;
T.forEach((t, k) => { for (let i = 0; i < k + 1; i++) rows.push({ ...live, id: id++, table_name: t }); });
const built = run(code('Build Snapshot Content'), {}, run(code('Group By Table'), {}, rows).map(x => x.json)).map(x => x.json);
const D = { 'Build Snapshot Content': built };
const sorted = run(code('Sort First Save'), D, T.map(() => ({ error: ERR }))).map(x => x.json);
expect('36680: all four reported refused -> all four wait', () => { eq(sorted.map(b => b.table_name), T, 'sort'); });

const FOLDER = node('Save Snapshot to Drive').parameters.folderId.value;
const Fq = node('Find Landed Files').parameters.queryString;
expect('search query names the folder and each waiting file exactly', () => { const s = expr(Fq, { 'Wait Out Drive Quota': sorted }); eq(s, "'" + FOLDER + "' in parents and (" + sorted.map(b => "name = '" + b.filename + "'").join(' or ') + ")", 'q'); return s; });
expect('a quote or backslash in a name is escaped for Drive', () => { const s = expr(Fq, { 'Wait Out Drive Quota': [{ filename: "a'b\\c.md" }] }); eq(s, "'" + FOLDER + "' in parents and (name = 'a\\'b\\\\c.md')", 'q'); return s; });

const drop = res => run(code('Drop Landed Files'), { 'Wait Out Drive Quota': sorted }, res).map(x => x.json);
expect('36680 fix: session_log found in the folder -> only the other three go to the retry', () => { const d = drop([{ id: 'F0', name: built[0].filename }]); eq(d.map(b => b.table_name), T.slice(1), 'drop'); eq(d[0].content, built[1].content, 'content kept'); return d[0].search; });
expect('nothing found (alwaysOutputData empty item) -> all four go', () => { eq(drop([{}]).length, 4, 'n'); });
expect('nothing found (no item) -> all four go', () => { eq(drop([]).length, 4, 'n'); });
expect('search refused -> all four go (rev 2 behaviour), reason kept', () => { const d = drop([{ error: ERR }]); eq(d.length, 4, 'n'); return d[0].search; });
expect('all found -> no item, retry does not run', () => { eq(drop(built.map((b, k) => ({ id: 'F' + k, name: b.filename }))).length, 0, 'n'); });
expect('a found item with no id does not count', () => { eq(drop([{ name: built[0].filename }]).length, 4, 'n'); });
expect('a similar but not equal name does not count', () => { eq(drop([{ id: 'x', name: built[0].filename + ' (1)' }]).length, 4, 'n'); });

const dropped = drop([{ id: 'F0', name: built[0].filename }]);
const collect = out => run(code('Collect Unsaved Rows'), { 'Drop Landed Files': dropped }, out).map(x => x.json);
expect('retry saved all three -> no item, no search, no PATCH', () => { eq(collect(dropped.map((b, k) => ({ id: 'g' + k }))).length, 0, 'n'); });
const col = collect([{ id: 'g1' }, { error: ERR }, { error: ERR }]);
expect('retry refused two -> those two handed on with their ids', () => { eq(col.length, 1, 'one'); eq(col[0].lost.map(b => b.table_name), T.slice(2), 'lost'); eq(col[0].error, ERR, 'err'); });
expect('retry count mismatch -> every file sent is handed on', () => { eq(collect([{ id: 'g1' }])[0].lost.length, 3, 'n'); });

const Fr = node('Find Landed Files (retry)').parameters.queryString;
expect('retry search names only the refused files', () => { const s = expr(Fr, {}, col[0]); eq(s, "'" + FOLDER + "' in parents and (" + col[0].lost.map(b => "name = '" + b.filename + "'").join(' or ') + ")", 'q'); });
const confirm = res => run(code('Confirm Unsaved Rows'), { 'Collect Unsaved Rows': col }, res).map(x => x.json);
const idsOf = t => built.find(b => b.table_name === t).export_ids;
expect('one of the two landed -> only the other is re-queued', () => { const c = confirm([{ id: 'H', name: built[2].filename }]); eq(c[0].tables, ['debate_judgments'], 't'); eq(c[0].ids, idsOf('debate_judgments'), 'ids'); return c[0].search; });
expect('neither landed -> both re-queued', () => { eq(confirm([{}])[0].ids, [...idsOf('debate_results'), ...idsOf('debate_judgments')], 'ids'); });
expect('both landed -> no item, no PATCH', () => { eq(confirm(col[0].lost.map((b, k) => ({ id: 'H' + k, name: b.filename }))).length, 0, 'n'); });
expect('retry search refused -> both re-queued', () => { const c = confirm([{ error: ERR }]); eq(c[0].ids.length, 7, 'n'); return c[0].search; });
expect('no ids raises (run errors, not silent)', () => { try { run(code('Confirm Unsaved Rows'), { 'Collect Unsaved Rows': [{ lost: [{ filename: 'a.md' }], error: ERR }] }, [{}]); } catch (e) { if (/no queue ids/.test(e.message)) return e.message.slice(0, 100); throw e; } throw new Error('did not raise'); });

const con = confirm([{}]);
const stopMsg = node('Stop: Drive Save Failed').parameters.errorMessage;
expect('stop message reads Confirm Unsaved Rows', () => { const s = expr(stopMsg, { 'Confirm Unsaved Rows': con, 'Re-queue Unsaved Rows': con[0].ids.map(i => ({ id: i })) }); if (!/Re-queued 7 of 7/.test(s) || /undefined/.test(s) || /Collect Unsaved/.test(stopMsg)) throw new Error(s); return s; });
const rq = node('Re-queue Unsaved Rows');
expect('re-queue URL from Confirm output', () => { eq(rq.parameters.url.replace("{{ $json.ids.join(',') }}", con[0].ids.join(',')), '=https://bhffmkginddovmdcpnty.supabase.co/rest/v1/table_snapshot_queue?status=eq.exported&id=in.(' + con[0].ids.join(',') + ')', 'url'); });

expect('search nodes: Drive credential, once, empty item when none found, regular output on error, files only, id and name', () => {
  for (const n of ['Find Landed Files', 'Find Landed Files (retry)']) { const x = node(n), p = x.parameters;
    eq([x.type, x.typeVersion, x.executeOnce, x.alwaysOutputData, x.onError, p.resource, p.operation, p.searchMethod, p.returnAll, p.filter.whatToSearch, p.filter.driveId.value, p.options.fields], ['n8n-nodes-base.googleDrive', 3, true, true, 'continueRegularOutput', 'fileFolder', 'search', 'query', true, 'files', 'My Drive', ['id', 'name']], n);
    eq(x.credentials, node('Save Snapshot to Drive').credentials, n + ' cred'); } });
const C = W.connections, out = n => (C[n].main[0] || []).map(c => c.node).join(',');
expect('wiring', () => {
  eq(['Save Snapshot to Drive', 'Sort First Save', 'Wait Out Drive Quota', 'Find Landed Files', 'Drop Landed Files', 'Save Snapshot to Drive (retry)', 'Collect Unsaved Rows', 'Find Landed Files (retry)', 'Confirm Unsaved Rows', 'Re-queue Unsaved Rows'].map(out),
    ['Log Complete,Sort First Save', 'Wait Out Drive Quota', 'Find Landed Files', 'Drop Landed Files', 'Save Snapshot to Drive (retry)', 'Log Complete,Collect Unsaved Rows', 'Find Landed Files (retry)', 'Confirm Unsaved Rows', 'Re-queue Unsaved Rows', 'Stop: Drive Save Failed'], 'w');
  for (const k in C) for (const o of C[k].main) for (const c of o) if (!W.nodes.some(n => n.name === c.node)) throw new Error('dangling ' + c.node);
  const pos = new Set(W.nodes.map(n => n.position.join(','))); if (pos.size !== W.nodes.length) throw new Error('two nodes share a position'); });
console.log('\n' + pass + ' pass, ' + fail + ' fail'); process.exit(fail ? 1 : 0);
