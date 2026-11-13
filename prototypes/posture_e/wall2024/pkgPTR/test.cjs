// pkgPTR rev 2 offline tests (save output shape from drive_v2_source_excerpt.js): runs the target Code nodes and the Stop expression with mocked n8n inputs; checks wiring.
// usage: node test.cjs target.json
const fs = require('fs');
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const W = (r.data || r).workflow || (r.data || r);
const code = n => W.nodes.find(x => x.name === n).parameters.jsCode;
const live = JSON.parse(fs.readFileSync(__dirname + '/live_item_36577.json', 'utf8')).json;
const mk = data => n => { if (!(n in data)) throw new Error('unmocked node ' + n); const v = data[n]; return { all: () => v.map(j => ({ json: j })), first: () => ({ json: v[0] }) }; };
const run = (c, data, input, prev) => new Function('$', '$input', '$prevNode', c)(mk(data), { all: () => input.map(j => ({ json: j })), first: () => ({ json: input[0] }) }, { name: prev || '' });
let pass = 0, fail = 0;
const expect = (name, fn) => { try { const g = fn(); pass++; console.log('PASS ' + name + (g ? ' -> ' + String(g).slice(0, 200) : '')); } catch (e) { fail++; console.log('FAIL ' + name + ' -> ' + e.message); } };
const eq = (a, b, w) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(w + ': got ' + JSON.stringify(a) + ' want ' + JSON.stringify(b)); };

// Execution 36648 shape: 98 audit_log rows + 2 session_log rows (ids 50356, 50424), one item per row.
const rows = [];
for (let i = 0; i < 98; i++) rows.push({ ...live, id: 50140 + i, table_name: 'audit_log' });
rows.push({ ...live, id: 50356, table_name: 'session_log' }, { ...live, id: 50424, table_name: 'session_log' });
const groups = run(code('Group By Table'), {}, rows).map(x => x.json);
const built = run(code('Build Snapshot Content'), {}, groups).map(x => x.json);
expect('build carries export_ids per file', () => { eq(built.map(b => [b.table_name, b.export_ids.length]), [['audit_log', 98], ['session_log', 2]], 'ids'); eq(built[1].export_ids, [50356, 50424], 'session ids'); return built.map(b => b.filename).join(' '); });
expect('build keeps content and filename unchanged in form', () => { if (!built[0].content.startsWith('# TRUTH App') || !/^Snapshot_audit_log_.*\.md$/.test(built[0].filename)) throw new Error('form'); });

// Real save output shape (n8n-nodes-base 2.15.1, drive_v2_source_excerpt.js): one item per input file, in order;
// { id } when saved, { error: <message string> } when refused, no other fields.
const ERR = 'Quota exceeded for quota metric \'Queries\' and limit \'Requests per minute\' of service \'drive.googleapis.com\'';
const D = { 'Build Snapshot Content': built };
const sort = out => run(code('Sort First Save'), D, out).map(x => x.json);
expect('36648 case: audit_log saved, session_log refused -> only session_log goes to the retry', () => { const r = sort([{ id: 'f1' }, { error: ERR }]); eq(r.map(p => p.table_name), ['session_log'], 'sort'); eq(r[0].export_ids, [50356, 50424], 'ids'); eq([r[0].content, r[0].filename], [built[1].content, built[1].filename], 'fields'); return r[0].first_error; });
expect('all saved -> no item, retry branch does not run', () => { eq(sort([{ id: 'f1' }, { id: 'f2' }]).length, 0, 'n'); });
expect('first file refused, second saved -> only the first', () => { eq(sort([{ error: ERR }, { id: 'f2' }]).map(p => p.table_name), ['audit_log'], 'sort'); });
expect('both refused -> both', () => { eq(sort([{ error: ERR }, { error: ERR }]).length, 2, 'n'); });
expect('item with empty id counts as refused', () => { eq(sort([{ id: '' }, { id: 'f2' }]).map(p => p.table_name), ['audit_log'], 'sort'); });
expect('count mismatch (not the router shape) -> every file resent', () => { const r = sort([{ id: 'f1' }]); eq(r.length, 2, 'n'); return r[0].first_error; });
const three = [...built, { ...built[0], table_name: 'kb_sights', filename: 'Snapshot_kb_sights_x.md', export_ids: [7, 8] }];
expect('three files, middle refused -> only the middle', () => { eq(run(code('Sort First Save'), { 'Build Snapshot Content': three }, [{ id: 'a' }, { error: ERR }, { id: 'c' }]).map(x => x.json.table_name), ['session_log'], 'sort'); });

const pick = sort([{ id: 'f1' }, { error: ERR }]);
const D2 = { ...D, 'Wait Out Drive Quota': pick };
const collect = (sent, out) => run(code('Collect Unsaved Rows'), { ...D, 'Wait Out Drive Quota': sent }, out).map(x => x.json);
const col = collect(pick, [{ error: ERR }]);
expect('retry refused again -> the 2 session_log ids', () => { eq(col.length, 1, 'one item'); eq(col[0].ids, [50356, 50424], 'ids'); eq(col[0].tables, ['session_log'], 't'); if (col[0].error !== ERR) throw new Error('error text ' + col[0].error); return JSON.stringify(col[0]).slice(0, 160); });
expect('retry saved -> no item, no PATCH', () => { eq(collect(pick, [{ id: 'f9' }]).length, 0, 'n'); });
const two = sort([{ error: ERR }, { error: ERR }]);
expect('retry of two, first saved second refused -> only the second file\'s ids (no re-queue of a saved file)', () => { eq(collect(two, [{ id: 'g1' }, { error: ERR }])[0].ids, [50356, 50424], 'ids'); });
expect('retry of two, first refused second saved -> only the 98 audit_log ids', () => { eq(collect(two, [{ error: ERR }, { id: 'g2' }])[0].ids.length, 98, 'n'); });
expect('retry count mismatch -> every file sent is re-queued', () => { eq(collect(two, [{ id: 'g1' }])[0].ids.length, 100, 'n'); });
expect('no ids raises (run errors, not silent)', () => { try { collect([{ filename: 'a.md' }], [{ error: ERR }]); } catch (e) { if (/no queue ids/.test(e.message)) return e.message.slice(0, 120); throw e; } throw new Error('did not raise'); });

const stopMsg = W.nodes.find(x => x.name === 'Stop: Drive Save Failed').parameters.errorMessage.replace(/^=\{\{\s*/, '').replace(/\s*\}\}$/, '');
const msg = (rq) => new Function('$', 'return ' + stopMsg)(mk({ 'Collect Unsaved Rows': col, 'Re-queue Unsaved Rows': rq }));
expect('stop message, 2 rows re-queued', () => { const s = msg([{ id: 50356 }, { id: 50424 }]); if (!/Re-queued 2 of 2/.test(s) || /undefined/.test(s)) throw new Error(s); return s; });
expect('stop message, PATCH matched nothing (alwaysOutputData gives one empty item)', () => { const s = msg([{}]); if (!/Re-queued 0 of 2/.test(s)) throw new Error(s); return s; });

const L = run(code('Log Complete'), D, [{ id: 'f1' }], 'Save Snapshot to Drive (retry)')[0].json;
expect('log names the save path', () => { eq([L.path, L.saved, L.refused, L.of, L.status], ['Save Snapshot to Drive (retry)', 1, 0, 2, 'snapshot_saved'], 'log'); });
const L2 = run(code('Log Complete'), D, [{ id: 'f1' }, { error: ERR }], 'Save Snapshot to Drive')[0].json;
expect('log on a partial first save counts the refusal', () => { eq([L2.saved, L2.refused, L2.status], [1, 1, 'snapshot_partial'], 'log'); });

const rq = W.nodes.find(x => x.name === 'Re-queue Unsaved Rows');
expect('re-queue URL and body', () => { const u = rq.parameters.url.replace("{{ $json.ids.join(',') }}", col[0].ids.join(',')); eq(u, '=https://bhffmkginddovmdcpnty.supabase.co/rest/v1/table_snapshot_queue?status=eq.exported&id=in.(50356,50424)', 'url'); eq(JSON.parse(rq.parameters.jsonBody), { status: 'pending', exported_at: null }, 'body'); eq(rq.credentials, W.nodes.find(x => x.name === 'Fetch Pending Snapshots').credentials, 'cred'); });
expect('both Drive nodes identical except id, name, position; regular output on error; no whole-node retry', () => { const s = n => { const c = JSON.parse(JSON.stringify(W.nodes.find(x => x.name === n))); delete c.id; delete c.name; delete c.position; return c; }; eq(s('Save Snapshot to Drive (retry)'), s('Save Snapshot to Drive'), 'drive'); const d = s('Save Snapshot to Drive'); if (d.onError !== 'continueRegularOutput' || d.retryOnFail) throw new Error('onError ' + d.onError); });
expect('wait is 62 seconds (under n8n 65 s in-memory limit, over one quota minute)', () => { const p = W.nodes.find(x => x.name === 'Wait Out Drive Quota').parameters; eq([p.resume, p.amount, p.unit], ['timeInterval', 62, 'seconds'], 'wait'); });
const C = W.connections, out = (n, i) => (C[n].main[i] || []).map(c => c.node).join(',');
expect('wiring', () => { eq([out('Save Snapshot to Drive', 0), out('Sort First Save', 0), out('Wait Out Drive Quota', 0), out('Save Snapshot to Drive (retry)', 0), out('Collect Unsaved Rows', 0), out('Re-queue Unsaved Rows', 0)], ['Log Complete,Sort First Save', 'Wait Out Drive Quota', 'Save Snapshot to Drive (retry)', 'Log Complete,Collect Unsaved Rows', 'Re-queue Unsaved Rows', 'Stop: Drive Save Failed'], 'wiring'); for (const n of ['Save Snapshot to Drive', 'Save Snapshot to Drive (retry)']) if (C[n].main.length !== 1) throw new Error(n + ' has an error output'); for (const k in C) for (const o of C[k].main) for (const c of o) if (!W.nodes.some(n => n.name === c.node)) throw new Error('dangling ' + c.node); });
console.log('\n' + pass + ' pass, ' + fail + ' fail'); process.exit(fail ? 1 : 0);
