// pkgPTR rev 3: no file is sent again until Drive is asked whether a file of that name already sits in the folder.
// Built on live cf6b0b9f (pkgPTR rev 2, ASK 231). Fault (W4 Wall 5925, execution 36680): the first save reported all 4 files refused,
// but session_log had landed, so the retry wrote it a second time. Cause, read from source (n8n-nodes-base 2.15.1 and the newer copy,
// createFromText.operation.js, text/plain branch): two calls, a multipart POST /upload/drive/v3/files carrying name and parent (the
// file exists after it), then a PATCH on that id. A 403 on the PATCH reports the item refused after its file landed.
// Change:
//  - Find Landed Files (Drive fileFolder search, after Wait Out Drive Quota) and Drop Landed Files (code) take out every refused file
//    whose exact name is already in the folder; the rest go to the retry. A refused or unreadable search sends all (rev 2 behaviour).
//  - Collect Unsaved Rows now hands on the files the retry refused; Find Landed Files (retry) and Confirm Unsaved Rows take out those
//    that landed, so a landed file's rows are not re-queued. Re-queue and the Stop message read Confirm Unsaved Rows.
// No database change. usage: node build_rev3.cjs <rev2 live json> <target json>
const fs = require('fs'), crypto = require('crypto');
const [, , fin, fout] = process.argv;
const raw = JSON.parse(fs.readFileSync(fin, 'utf8')); const W = (raw.data || raw).workflow || (raw.data || raw);
if (W.id !== 'kXlKbZpceulxtWvQ') throw new Error('wrong workflow ' + W.id);
const by = n => { const x = W.nodes.filter(y => y.name === n); if (x.length !== 1) throw new Error('node ' + n + ' count ' + x.length); return x[0]; };
const uid = k => { const h = crypto.createHash('sha256').update('pkgPTR rev3 ' + k).digest('hex'); return h.slice(0, 8) + '-' + h.slice(8, 12) + '-4' + h.slice(13, 16) + '-a' + h.slice(17, 20) + '-' + h.slice(20, 32); };
const sizes = []; const note = (w, a, b) => sizes.push(w + ' ' + a + ' -> ' + b + ' (' + (b - a >= 0 ? '+' : '') + (b - a) + ')');
const nodes0 = W.nodes.length, wf0 = JSON.stringify({ n: W.nodes, c: W.connections }).length;
const NEW = ['Find Landed Files', 'Drop Landed Files', 'Find Landed Files (retry)', 'Confirm Unsaved Rows'];
for (const n of NEW) if (W.nodes.some(y => y.name === n)) throw new Error('name in use ' + n);
const C = W.connections;
const m = n => ({ node: n, type: 'main', index: 0 });
const want = {
  'Wait Out Drive Quota': [[m('Save Snapshot to Drive (retry)')]],
  'Save Snapshot to Drive (retry)': [[m('Log Complete'), m('Collect Unsaved Rows')]],
  'Collect Unsaved Rows': [[m('Re-queue Unsaved Rows')]],
  'Re-queue Unsaved Rows': [[m('Stop: Drive Save Failed')]]
};
for (const k in want) if (JSON.stringify(C[k] && C[k].main) !== JSON.stringify(want[k])) throw new Error('rev 2 wiring differs at ' + k);

const S = by('Save Snapshot to Drive');
const FOLDER = S.parameters.folderId && S.parameters.folderId.value;
if (!/^[A-Za-z0-9_-]{20,}$/.test(FOLDER)) throw new Error('folder ' + FOLDER);
if (JSON.stringify(by('Save Snapshot to Drive (retry)').parameters) !== JSON.stringify(S.parameters)) throw new Error('save nodes differ');

// Drive query: the folder, and any of the given exact names. A quote or backslash in a name is escaped for the Drive query syntax.
const q = src => "={{ \"'" + FOLDER + "' in parents and (\" + " + src + ".map(f => \"name = '\" + String(f).replace(/['\\\\]/g, c => '\\\\' + c) + \"'\").join(' or ') + \")\" }}";
const find = (key, name, src, pos) => ({
  id: uid(key), name, type: 'n8n-nodes-base.googleDrive', typeVersion: S.typeVersion, position: pos,
  executeOnce: true, alwaysOutputData: true, onError: 'continueRegularOutput',
  parameters: { resource: 'fileFolder', operation: 'search', searchMethod: 'query', queryString: q(src), returnAll: true,
    filter: { driveId: { __rl: true, mode: 'list', value: 'My Drive' }, whatToSearch: 'files' }, options: { fields: ['id', 'name'] } },
  credentials: JSON.parse(JSON.stringify(S.credentials))
});

const DROP = [
  "// pkgPTR rev 3: a save item reported refused can still have created its file (the upload is a POST, then a PATCH; a 403 on the",
  "// PATCH comes after the file exists). Every refused file whose exact name the search found in the folder is left out of the retry.",
  "// A refused or unreadable search sends every refused file again, as rev 2 did: a duplicate file is acceptable, a lost batch is not.",
  "const sent = $('Wait Out Drive Quota').all().map(x => x.json);",
  "const res = $input.all().map(x => x.json || {});",
  "const e = res.find(j => j && j.error);",
  "const found = new Set(e ? [] : res.filter(j => typeof j.id === 'string' && j.id.length > 0 && typeof j.name === 'string').map(j => j.name));",
  "const search = e ? 'search refused: ' + String(e.error).slice(0, 200) : 'searched: ' + found.size + ' of ' + sent.length + ' already in the folder';",
  "return sent.filter(b => !found.has(b.filename)).map(b => ({ json: { ...b, search } }));"
].join('\n');
const COLLECT = [
  "// pkgPTR rev 3: the retry continues on a refused file and returns one item per file, in order. The files it refused go on to a",
  "// name search (Find Landed Files (retry)); Confirm Unsaved Rows re-queues only those not found. None refused ends this branch.",
  "const sent = $('Drop Landed Files').all().map(x => x.json);",
  "const out = $input.all().map(x => x.json || {});",
  "const lost = out.length !== sent.length ? sent : sent.filter((b, k) => !(typeof out[k].id === 'string' && out[k].id.length > 0));",
  "if (lost.length === 0) return [];",
  "const e = out.find(j => j && j.error);",
  "const error = String((e && e.error) || (out.length !== sent.length ? 'retry returned ' + out.length + ' items for ' + sent.length + ' files' : 'no file id returned')).slice(0, 300);",
  "return [{ json: { lost: lost.map(b => ({ filename: b.filename, table_name: b.table_name, export_ids: b.export_ids })), error } }];"
].join('\n');
const CONFIRM = [
  "// pkgPTR rev 3: a file the retry reported refused but whose name is in the folder landed; its rows stay exported. The rest have",
  "// their rows set back to pending, because get_pending_snapshots already marked them exported. A refused search re-queues them all.",
  "const c = $('Collect Unsaved Rows').first().json;",
  "const res = $input.all().map(x => x.json || {});",
  "const e = res.find(j => j && j.error);",
  "const found = new Set(e ? [] : res.filter(j => typeof j.id === 'string' && j.id.length > 0 && typeof j.name === 'string').map(j => j.name));",
  "const lost = c.lost.filter(b => !found.has(b.filename));",
  "if (lost.length === 0) return [];",
  "const ids = [...new Set(lost.flatMap(b => Array.isArray(b.export_ids) ? b.export_ids : []))].filter(v => Number.isInteger(v) && v > 0);",
  "if (ids.length === 0) throw new Error('PROTECTED SNAPSHOT: Drive refused ' + lost.length + ' file(s) twice and no queue ids were found to re-queue. Rows stay marked exported: ' + lost.map(b => b.filename).join(', '));",
  "const search = e ? 'search refused: ' + String(e.error).slice(0, 200) : 'searched: ' + (c.lost.length - lost.length) + ' of ' + c.lost.length + ' already in the folder';",
  "return [{ json: { ids, files: lost.map(b => b.filename), tables: lost.map(b => b.table_name), error: c.error, search } }];"
].join('\n');

const Wt = by('Wait Out Drive Quota'), R = by('Save Snapshot to Drive (retry)'), Co = by('Collect Unsaved Rows'), Rq = by('Re-queue Unsaved Rows'), St = by('Stop: Drive Save Failed');
// make room: retry and everything after it move right by two slots
for (const n of [R, Co, Rq, St]) n.position = [n.position[0] + 448, n.position[1]];
const [wx, wy] = Wt.position;
const add = [
  find('find', 'Find Landed Files', "$('Wait Out Drive Quota').all().map(i => i.json.filename)", [wx + 224, wy]),
  { id: uid('drop'), name: 'Drop Landed Files', type: 'n8n-nodes-base.code', typeVersion: 2, position: [wx + 448, wy], parameters: { jsCode: DROP } },
  find('findretry', 'Find Landed Files (retry)', "$json.lost.map(b => b.filename)", [Co.position[0] + 224, Co.position[1]]),
  { id: uid('confirm'), name: 'Confirm Unsaved Rows', type: 'n8n-nodes-base.code', typeVersion: 2, position: [Co.position[0] + 448, Co.position[1]], parameters: { jsCode: CONFIRM } }
];
Rq.position = [Rq.position[0] + 448, Rq.position[1]]; St.position = [St.position[0] + 448, St.position[1]];
const co0 = Co.parameters.jsCode.length; Co.parameters.jsCode = COLLECT; note('Collect Unsaved Rows jsCode', co0, COLLECT.length);
const st0 = St.parameters.errorMessage;
if (st0.split("$('Collect Unsaved Rows')").length !== 4) throw new Error('stop anchor');
St.parameters.errorMessage = st0.split("$('Collect Unsaved Rows')").join("$('Confirm Unsaved Rows')").replace("twice, 62 s apart (", "twice, 62 s apart, and the name search did not find them (");
note('Stop errorMessage', st0.length, St.parameters.errorMessage.length);
W.nodes.push(...add);
for (const n of add) note('added node ' + n.name, 0, JSON.stringify(n).length);
C['Wait Out Drive Quota'] = { main: [[m('Find Landed Files')]] };
C['Find Landed Files'] = { main: [[m('Drop Landed Files')]] };
C['Drop Landed Files'] = { main: [[m('Save Snapshot to Drive (retry)')]] };
C['Collect Unsaved Rows'] = { main: [[m('Find Landed Files (retry)')]] };
C['Find Landed Files (retry)'] = { main: [[m('Confirm Unsaved Rows')]] };
C['Confirm Unsaved Rows'] = { main: [[m('Re-queue Unsaved Rows')]] };
if (typeof W.description === 'string') W.description = W.description.replace(' and sent once more;', ';') + ' rev 3: a refused file whose name is already in the folder is not sent or re-queued.';

const s = JSON.stringify(raw); fs.writeFileSync(fout, s);
console.log('nodes', nodes0, '->', W.nodes.length, '| sha256', crypto.createHash('sha256').update(s).digest('hex').slice(0, 16));
console.log('nodes+connections JSON', wf0, '->', JSON.stringify({ n: W.nodes, c: W.connections }).length);
console.log(sizes.join('\n'));
