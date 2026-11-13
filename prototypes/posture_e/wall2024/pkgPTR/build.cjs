// pkgPTR (ASK 228): Drive save retry for "TRUTH App — Protected Table Snapshot to Drive" (kXlKbZpceulxtWvQ), built on live 791e3414 (pkgPTS rev 2).
// Fault (W4 Wall 5903, execution 36648): Drive answered 403 rateLimitExceeded (requests per minute) on the second file; the RPC had
// already marked its 2 session_log rows exported, so the batch was lost.
// rev 2 (W1 FAIL Wall 5908): the Drive v2 error item is { error } with no pairing, so refused files cannot be found from an error
// output. The save now runs with "continue (regular output)": the router pushes exactly one item per input, in input order, { id } when
// saved and { error } when refused (n8n-nodes-base 2.15.1 router.js lines 51-83, createFromText line 139), so output k is file k.
// Change: refused files wait 62 s and are sent once more; files refused twice have their queue rows set back to pending
// (PATCH through the same "Supabase account" credential) and the run then stops with an error naming them.
// No database change. The 2 rows lost at 13:00 CST are re-queued by requeue_2rows.sql (a data write for W4).
// usage: node build.cjs <parent.json> <target.json>
const fs = require('fs'), crypto = require('crypto');
const [, , fin, fout] = process.argv;
const raw = JSON.parse(fs.readFileSync(fin, 'utf8')); const W = (raw.data || raw).workflow || (raw.data || raw);
if (W.id !== 'kXlKbZpceulxtWvQ') throw new Error('wrong workflow ' + W.id);
const by = n => { const x = W.nodes.filter(y => y.name === n); if (x.length !== 1) throw new Error('node ' + n + ' count ' + x.length); return x[0]; };
const uid = k => { const h = crypto.createHash('sha256').update('pkgPTR ' + k).digest('hex'); return h.slice(0, 8) + '-' + h.slice(8, 12) + '-4' + h.slice(13, 16) + '-a' + h.slice(17, 20) + '-' + h.slice(20, 32); };
const sizes = []; const note = (w, a, b) => sizes.push(w + ' ' + a + ' -> ' + b + ' (' + (b - a >= 0 ? '+' : '') + (b - a) + ')');
const nodes0 = W.nodes.length, wf0 = JSON.stringify({ n: W.nodes, c: W.connections }).length;
const NEW = ['Sort First Save', 'Wait Out Drive Quota', 'Save Snapshot to Drive (retry)', 'Collect Unsaved Rows', 'Re-queue Unsaved Rows', 'Stop: Drive Save Failed'];
for (const n of NEW) if (W.nodes.some(y => y.name === n)) throw new Error('name in use ' + n);
const C = W.connections;
if (JSON.stringify(C['Save Snapshot to Drive']) !== '{"main":[[{"node":"Log Complete","type":"main","index":0}]]}') throw new Error('save out ' + JSON.stringify(C['Save Snapshot to Drive']));
if (C['Log Complete']) throw new Error('log has outputs');

// ---- Build Snapshot Content: carry the queue ids of each file ----
const B = by('Build Snapshot Content'); const b0 = B.parameters.jsCode;
const bOld = "return { json: { content, filename, table_name: tableName, snapshot_ts: ts } };";
if (b0.split(bOld).length !== 2) throw new Error('build anchor');
B.parameters.jsCode = b0.replace(bOld, () => "// ASK 228: carry the queue ids so a file Drive refuses can be set back to pending.\nreturn { json: { content, filename, table_name: tableName, snapshot_ts: ts, export_ids: d.rows.map(r => r.id) } };");
note('Build Snapshot Content jsCode', b0.length, B.parameters.jsCode.length);

// ---- Save Snapshot to Drive: one output item per file, in order ----
const S = by('Save Snapshot to Drive');
if (S.onError || S.retryOnFail || S.continueOnFail) throw new Error('save error settings already set');
if (S.parameters.operation !== 'createFromText') throw new Error('save op ' + S.parameters.operation);
const s0 = JSON.stringify(S).length; S.onError = 'continueRegularOutput'; note('Save Snapshot to Drive node JSON', s0, JSON.stringify(S).length);

// ---- Log Complete: say which save path it reports ----
const L = by('Log Complete'); const l0 = L.parameters.jsCode;
const lOld = "return [{ json: { status: 'snapshot_saved', tables: built.map(b => b.table_name), files: built.map(b => b.filename), saved: $input.all().length, ts: new Date().toISOString() } }];";
if (!l0.endsWith(lOld)) throw new Error('log anchor');
L.parameters.jsCode = l0.slice(0, l0.length - lOld.length) + "// ASK 228: the save nodes continue on a refused file, so count only items carrying a Drive file id.\nconst out = $input.all().map(x => x.json || {});\nconst saved = out.filter(j => typeof j.id === 'string' && j.id.length > 0).length;\nreturn [{ json: { status: saved === out.length ? 'snapshot_saved' : 'snapshot_partial', path: $prevNode.name, tables: built.map(b => b.table_name), files: built.map(b => b.filename), saved, refused: out.length - saved, of: built.length, ts: new Date().toISOString() } }];";
note('Log Complete jsCode', l0.length, L.parameters.jsCode.length);

// ---- new nodes ----
const [x, y] = S.position;
const SORT = [
  "// ASK 228: the save node continues on a refused file. The Google Drive v2 router pushes exactly one item per input file, in order:",
  "// { id } when Drive created the file, { error: <message> } when Drive refused it (n8n-nodes-base 2.15.1). So save output k is",
  "// Build Snapshot Content item k. Only the refused files go on, through the 62 s wait, to the retry; none refused ends this branch.",
  "const built = $('Build Snapshot Content').all().map(x => x.json);",
  "const out = $input.all().map(x => x.json || {});",
  "const savedAt = k => typeof out[k].id === 'string' && out[k].id.length > 0;",
  "if (out.length !== built.length) {",
  "  // Not the shape the router produces: send every file again. A duplicate file is acceptable, a lost batch is not.",
  "  return built.map(b => ({ json: { ...b, first_error: 'save returned ' + out.length + ' items for ' + built.length + ' files' } }));",
  "}",
  "return built.map((b, k) => ({ b, k })).filter(x => !savedAt(x.k))",
  "  .map(x => ({ json: { ...x.b, first_error: String(out[x.k].error || 'no file id returned').slice(0, 300) } }));"
].join('\n');
const COLLECT = [
  "// ASK 228: the retry continues on a refused file and returns one item per file, in order, as the first save does. A file refused",
  "// twice has its rows set back to pending, because get_pending_snapshots already marked them exported. None refused ends this branch.",
  "const sent = $('Wait Out Drive Quota').all().map(x => x.json);",
  "const out = $input.all().map(x => x.json || {});",
  "const lost = out.length !== sent.length ? sent : sent.filter((b, k) => !(typeof out[k].id === 'string' && out[k].id.length > 0));",
  "if (lost.length === 0) return [];",
  "const ids = [...new Set(lost.flatMap(b => Array.isArray(b.export_ids) ? b.export_ids : []))].filter(v => Number.isInteger(v) && v > 0);",
  "if (ids.length === 0) throw new Error('PROTECTED SNAPSHOT: Drive refused ' + lost.length + ' file(s) twice and no queue ids were found to re-queue. Rows stay marked exported: ' + lost.map(b => b.filename).join(', '));",
  "const e = out.find(j => j && j.error);",
  "const error = String((e && e.error) || (out.length !== sent.length ? 'retry returned ' + out.length + ' items for ' + sent.length + ' files' : 'no file id returned')).slice(0, 300);",
  "return [{ json: { ids, files: lost.map(b => b.filename), tables: lost.map(b => b.table_name), error } }];"
].join('\n');
const F = by('Fetch Pending Snapshots');
const host = F.parameters.url.replace(/\/rest\/v1\/.*$/, '');
if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(host)) throw new Error('host ' + host);
const add = [
  { id: uid('sort'), name: 'Sort First Save', type: 'n8n-nodes-base.code', typeVersion: 2, position: [x + 224, y + 224],
    parameters: { jsCode: SORT } },
  { id: uid('wait'), name: 'Wait Out Drive Quota', type: 'n8n-nodes-base.wait', typeVersion: 1.1, position: [x + 448, y + 224],
    parameters: { resume: 'timeInterval', amount: 62, unit: 'seconds' } },
  Object.assign(JSON.parse(JSON.stringify(S)), { id: uid('retry'), name: 'Save Snapshot to Drive (retry)', position: [x + 672, y + 224] }),
  { id: uid('collect'), name: 'Collect Unsaved Rows', type: 'n8n-nodes-base.code', typeVersion: 2, position: [x + 896, y + 448],
    parameters: { jsCode: COLLECT } },
  { id: uid('requeue'), name: 'Re-queue Unsaved Rows', type: 'n8n-nodes-base.httpRequest', typeVersion: F.typeVersion, position: [x + 1120, y + 448],
    alwaysOutputData: true, executeOnce: true,
    parameters: { method: 'PATCH', url: "=" + host + "/rest/v1/table_snapshot_queue?status=eq.exported&id=in.({{ $json.ids.join(',') }})",
      authentication: 'predefinedCredentialType', nodeCredentialType: 'supabaseApi',
      sendHeaders: true, headerParameters: { parameters: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Prefer', value: 'return=representation' }] },
      sendBody: true, contentType: 'json', specifyBody: 'json', jsonBody: '{ "status": "pending", "exported_at": null }', options: {} },
    credentials: JSON.parse(JSON.stringify(F.credentials)) },
  { id: uid('stop'), name: 'Stop: Drive Save Failed', type: 'n8n-nodes-base.stopAndError', typeVersion: 1, position: [x + 1344, y + 448],
    parameters: { errorType: 'errorMessage', errorMessage: "={{ 'PROTECTED SNAPSHOT: Drive refused ' + $('Collect Unsaved Rows').first().json.files.join(', ') + ' twice, 62 s apart (' + $('Collect Unsaved Rows').first().json.error + '). Re-queued ' + $('Re-queue Unsaved Rows').all().filter(i => i.json && i.json.id).length + ' of ' + $('Collect Unsaved Rows').first().json.ids.length + ' queue rows as pending for the next run.' }}" } }
];
if (!F.credentials || !F.credentials.supabaseApi) throw new Error('fetch credential');
W.nodes.push(...add);
for (const n of add) note('added node ' + n.name, 0, JSON.stringify(n).length);
const m = n => ({ node: n, type: 'main', index: 0 });
C['Save Snapshot to Drive'] = { main: [[m('Log Complete'), m('Sort First Save')]] };
C['Sort First Save'] = { main: [[m('Wait Out Drive Quota')]] };
C['Wait Out Drive Quota'] = { main: [[m('Save Snapshot to Drive (retry)')]] };
C['Save Snapshot to Drive (retry)'] = { main: [[m('Log Complete'), m('Collect Unsaved Rows')]] };
C['Collect Unsaved Rows'] = { main: [[m('Re-queue Unsaved Rows')]] };
C['Re-queue Unsaved Rows'] = { main: [[m('Stop: Drive Save Failed')]] };
if (typeof W.description === 'string') W.description += ' ASK 228: a file Drive refuses is sent again after 62 s; if refused twice its rows go back to pending and the run errors.';

const s = JSON.stringify(raw); fs.writeFileSync(fout, s);
console.log('nodes', nodes0, '->', W.nodes.length, '| sha256', crypto.createHash('sha256').update(s).digest('hex').slice(0, 16));
console.log('nodes+connections JSON', wf0, '->', JSON.stringify({ n: W.nodes, c: W.connections }).length);
console.log(sizes.join('\n'));
