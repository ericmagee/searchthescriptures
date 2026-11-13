// pkgPTR offline tests: runs the target Code nodes and the Stop expression with mocked n8n inputs; checks wiring.
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

const err = { error: { message: 'Quota exceeded for quota metric Queries and limit Requests per minute', description: 'rateLimitExceeded' } };
const D = { 'Build Snapshot Content': built };
// first save: audit_log saved, session_log refused (n8n merges the paired input item into the error item)
const pick = run(code('Pick Unsaved Files'), D, [{ ...built[1], ...err }]).map(x => x.json);
expect('pick resends only the refused file', () => { eq(pick.map(p => p.table_name), ['session_log'], 'pick'); eq(pick[0].export_ids, [50356, 50424], 'ids'); return pick[0].first_error; });
expect('pick keeps content and filename for the Drive node', () => { eq([pick[0].content, pick[0].filename], [built[1].content, built[1].filename], 'fields'); });
const pickAll = run(code('Pick Unsaved Files'), D, [err]).map(x => x.json);
expect('pick: error item without filename resends every file', () => { eq(pickAll.map(p => p.table_name), ['audit_log', 'session_log'], 'fallback'); });
expect('pick: unmatched filename resends every file', () => { eq(run(code('Pick Unsaved Files'), D, [{ ...err, filename: 'x.md' }]).length, 2, 'n'); });
expect('pick: error as plain string', () => run(code('Pick Unsaved Files'), D, [{ ...built[1], error: 'boom' }])[0].json.first_error === 'boom' ? 'boom' : (() => { throw new Error('msg'); })());

const D2 = { ...D, 'Pick Unsaved Files': pick };
const col = run(code('Collect Unsaved Rows'), D2, [{ ...pick[0], ...err }]).map(x => x.json);
expect('collect: refused twice gives the 2 ids', () => { eq(col.length, 1, 'one item'); eq(col[0].ids, [50356, 50424], 'ids'); eq(col[0].tables, ['session_log'], 't'); return JSON.stringify(col[0]).slice(0, 160); });
const D3 = { ...D, 'Pick Unsaved Files': pickAll };
expect('collect: only the still-refused file of two', () => { eq(run(code('Collect Unsaved Rows'), D3, [{ ...pickAll[1], ...err }])[0].json.ids, [50356, 50424], 'ids'); });
expect('collect: no filename re-queues every file sent', () => { eq(run(code('Collect Unsaved Rows'), D3, [err])[0].json.ids.length, 100, 'n'); });
expect('collect: no ids raises (run errors, not silent)', () => { try { run(code('Collect Unsaved Rows'), { 'Pick Unsaved Files': [{ filename: 'a.md' }] }, [{ filename: 'a.md', ...err }]); } catch (e) { if (/no queue ids/.test(e.message)) return e.message.slice(0, 120); throw e; } throw new Error('did not raise'); });

const stopMsg = W.nodes.find(x => x.name === 'Stop: Drive Save Failed').parameters.errorMessage.replace(/^=\{\{\s*/, '').replace(/\s*\}\}$/, '');
const msg = (rq) => new Function('$', 'return ' + stopMsg)(mk({ 'Collect Unsaved Rows': col, 'Re-queue Unsaved Rows': rq }));
expect('stop message, 2 rows re-queued', () => { const s = msg([{ id: 50356 }, { id: 50424 }]); if (!/Re-queued 2 of 2/.test(s) || /undefined/.test(s)) throw new Error(s); return s; });
expect('stop message, PATCH matched nothing (alwaysOutputData gives one empty item)', () => { const s = msg([{}]); if (!/Re-queued 0 of 2/.test(s)) throw new Error(s); return s; });

const L = run(code('Log Complete'), D, [{ id: 'f1' }], 'Save Snapshot to Drive (retry)')[0].json;
expect('log names the save path', () => { eq([L.path, L.saved, L.of], ['Save Snapshot to Drive (retry)', 1, 2], 'log'); });

const rq = W.nodes.find(x => x.name === 'Re-queue Unsaved Rows');
expect('re-queue URL and body', () => { const u = rq.parameters.url.replace("{{ $json.ids.join(',') }}", col[0].ids.join(',')); eq(u, '=https://bhffmkginddovmdcpnty.supabase.co/rest/v1/table_snapshot_queue?status=eq.exported&id=in.(50356,50424)', 'url'); eq(JSON.parse(rq.parameters.jsonBody), { status: 'pending', exported_at: null }, 'body'); eq(rq.credentials, W.nodes.find(x => x.name === 'Fetch Pending Snapshots').credentials, 'cred'); });
expect('both Drive nodes identical except id, name, position', () => { const s = n => { const c = JSON.parse(JSON.stringify(W.nodes.find(x => x.name === n))); delete c.id; delete c.name; delete c.position; return c; }; eq(s('Save Snapshot to Drive (retry)'), s('Save Snapshot to Drive'), 'drive'); if (s('Save Snapshot to Drive').onError !== 'continueErrorOutput') throw new Error('onError'); });
expect('wait is 62 seconds (under n8n 65 s in-memory limit, over one quota minute)', () => { const p = W.nodes.find(x => x.name === 'Wait Out Drive Quota').parameters; eq([p.resume, p.amount, p.unit], ['timeInterval', 62, 'seconds'], 'wait'); });
const C = W.connections, out = (n, i) => (C[n].main[i] || []).map(c => c.node).join(',');
expect('wiring', () => { eq([out('Save Snapshot to Drive', 0), out('Save Snapshot to Drive', 1), out('Wait Out Drive Quota', 0), out('Pick Unsaved Files', 0), out('Save Snapshot to Drive (retry)', 0), out('Save Snapshot to Drive (retry)', 1), out('Collect Unsaved Rows', 0), out('Re-queue Unsaved Rows', 0)], ['Log Complete', 'Wait Out Drive Quota', 'Pick Unsaved Files', 'Save Snapshot to Drive (retry)', 'Log Complete', 'Collect Unsaved Rows', 'Re-queue Unsaved Rows', 'Stop: Drive Save Failed'], 'wiring'); for (const k in C) for (const o of C[k].main) for (const c of o) if (!W.nodes.some(n => n.name === c.node)) throw new Error('dangling ' + c.node); });
console.log('\n' + pass + ' pass, ' + fail + ' fail'); process.exit(fail ? 1 : 0);
