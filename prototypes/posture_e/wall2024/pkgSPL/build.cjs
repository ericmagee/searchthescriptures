// pkgSPL (ASK 226, plan Wall 5871): move the operational_doc version history out of the
// Every-3-Day SQL Snapshot (YWk9m3grughoRpWi) into the Every-3-Day Orphan Tables Snapshot
// (ROh4Px5Eap2tGKIc), with a captured-against-live gate there. No database change.
// usage: node build.cjs <parent_main.json> <parent_orphan.json> <target_main.json> <target_orphan.json>
const fs = require('fs'), crypto = require('crypto');
const [, , pm, po, tm, to] = process.argv;
const load = f => { const raw = JSON.parse(fs.readFileSync(f, 'utf8')); const W = (raw.data || raw).workflow || (raw.data || raw); return { raw, W }; };
const M = load(pm), O = load(po);
const uid = k => { const h = crypto.createHash('sha256').update('pkgSPL ' + k).digest('hex'); return h.slice(0, 8) + '-' + h.slice(8, 12) + '-4' + h.slice(13, 16) + '-a' + h.slice(17, 20) + '-' + h.slice(20, 32); };
const by = (W, n) => { const x = W.nodes.filter(y => y.name === n); if (x.length !== 1) throw new Error('node ' + n + ' count ' + x.length); return x[0]; };
const once = (s, a, b, what) => { const k = s.split(a).length - 1; if (k !== 1) throw new Error('anchor ' + what + ' found ' + k); return s.replace(a, () => b); };
const sizes = [];
const note = (what, before, after) => sizes.push(what + ' ' + (after - before >= 0 ? '+' : '') + (after - before));
if (M.W.id !== 'YWk9m3grughoRpWi' || O.W.id !== 'ROh4Px5Eap2tGKIc') throw new Error('wrong workflow ids ' + M.W.id + ' ' + O.W.id);
const mainNodes0 = M.W.nodes.length, orphNodes0 = O.W.nodes.length;

// ---------- MAIN ----------
const fod = JSON.parse(JSON.stringify(by(M.W, 'Fetch operational_doc')));
const flc = JSON.parse(JSON.stringify(by(M.W, 'Fetch live counts')));
const CM = M.W.connections;
if (JSON.stringify(CM['Fetch schema definitions']) !== '{"main":[[{"node":"Fetch operational_doc","type":"main","index":0}]]}') throw new Error('main: schema out ' + JSON.stringify(CM['Fetch schema definitions']));
if (JSON.stringify(CM['Fetch operational_doc']) !== '{"main":[[{"node":"Fetch session_load_manual","type":"main","index":0}]]}') throw new Error('main: opdoc out ' + JSON.stringify(CM['Fetch operational_doc']));
for (const k in CM) if (k !== 'Fetch schema definitions' && JSON.stringify(CM[k]).includes('"Fetch operational_doc"')) throw new Error('main: other input to opdoc from ' + k);
CM['Fetch schema definitions'] = { main: [[{ node: 'Fetch session_load_manual', type: 'main', index: 0 }]] };
delete CM['Fetch operational_doc'];
M.W.nodes = M.W.nodes.filter(n => n.name !== 'Fetch operational_doc');

const B = by(M.W, 'Build SQL Snapshot'); const b0 = B.parameters.jsCode; let b = b0;
b = once(b, "const opDoc = $('Fetch operational_doc').all().map(x => x.json);\n", '', 'opDoc line');
b = once(b, ', operational_doc: opDoc.length, schema_chars', ', schema_chars', 'counts opdoc');
b = once(b, ', origin_log: originLog, operational_doc: opDoc };', ', origin_log: originLog };', 'snapshot opdoc');
b = once(b, ",['origin_log','origin_log'],['operational_doc','operational_doc']];", ",['origin_log','origin_log']];", 'PAIRS opdoc');
b = once(b, "// Live counts come from snapshot_live_counts()", "// operational_doc moved to the Every-3-Day Orphan Tables Snapshot (ASK 226, pkgSPL): its version history was 42 percent of this payload.\n// Live counts come from snapshot_live_counts()", 'comment anchor');
if (/operational_doc|opDoc/.test(b.replace(/\/\/ operational_doc moved[^\n]*\n/, ''))) throw new Error('main: operational_doc remains in Build code');
B.parameters.jsCode = b; note('main Build SQL Snapshot jsCode', b0.length, b.length);

const L = by(M.W, 'Log Snapshot to audit_log'); const l0 = L.parameters.jsonBody;
L.parameters.jsonBody = once(l0, ' + " operational_doc=" + $("Build SQL Snapshot").first().json.counts.operational_doc', '', 'main log opdoc');
note('main Log jsonBody', l0.length, L.parameters.jsonBody.length);
if (/operational_doc/.test(JSON.stringify(M.W.nodes).replace(/\/\/ operational_doc moved[^\\]*\\n/, ''))) throw new Error('main: operational_doc still referenced: ' + M.W.nodes.filter(n => JSON.stringify(n).includes('operational_doc')).map(n => n.name).join(','));
const md0 = M.W.description || '';
if (typeof M.W.description === 'string') M.W.description = md0 + ' operational_doc history moved to the Orphan Tables Snapshot (ASK 226).';

// ---------- ORPHAN ----------
for (const n of ['Fetch live counts', 'Fetch operational_doc']) if (O.W.nodes.some(y => y.name === n)) throw new Error('orphan: name in use ' + n);
const CO = O.W.connections;
if (JSON.stringify(CO['Every-3-Day Orphan Trigger']) !== '{"main":[[{"node":"Fetch kb_conclusions","type":"main","index":0}]]}') throw new Error('orphan trigger out');
if (JSON.stringify(CO['Fetch kb_book_chapters']) !== '{"main":[[{"node":"Build Orphan Snapshot","type":"main","index":0}]]}') throw new Error('orphan chapters out');
const tr = by(O.W, 'Every-3-Day Orphan Trigger'), ch = by(O.W, 'Fetch kb_book_chapters');
flc.id = uid('Fetch live counts'); flc.position = [tr.position[0] + 112, tr.position[1] - 200];
fod.id = uid('Fetch operational_doc'); fod.position = [ch.position[0], ch.position[1] + 200];
if (!fod.executeOnce) fod.executeOnce = true;
O.W.nodes.push(flc, fod);
CO['Every-3-Day Orphan Trigger'] = { main: [[{ node: 'Fetch live counts', type: 'main', index: 0 }]] };
CO['Fetch live counts'] = { main: [[{ node: 'Fetch kb_conclusions', type: 'main', index: 0 }]] };
CO['Fetch kb_book_chapters'] = { main: [[{ node: 'Fetch operational_doc', type: 'main', index: 0 }]] };
CO['Fetch operational_doc'] = { main: [[{ node: 'Build Orphan Snapshot', type: 'main', index: 0 }]] };

const OB = by(O.W, 'Build Orphan Snapshot'); const o0 = OB.parameters.jsCode; let o = o0;
const GATE = "const opDoc = $('Fetch operational_doc').all().map(x => x.json);\n" +
  "// ASK 226 (pkgSPL): the operational_doc version history moved here from the main snapshot. Same rule as the main gate:\n" +
  "// CAPTURED is compared against LIVE (snapshot_live_counts, read before the fetches); a malformed live count or a shortfall refuses the run.\n" +
  "const lc = $('Fetch live counts').first().json;\n" +
  "const live = (lc && typeof lc === 'object' && !Array.isArray(lc)) ? lc : (Array.isArray(lc) && lc.length ? lc[0] : {});\n" +
  "const isCount = (v) => typeof v === 'number' && Number.isInteger(v) && v >= 0;\n" +
  "if (!isCount(live.operational_doc)) throw new Error('ORPHAN SNAPSHOT REFUSED - operational_doc live count is not a non-negative integer (' + JSON.stringify(live.operational_doc) + '). Refusing to write a backup that cannot be checked.');\n" +
  "if (opDoc.length < live.operational_doc) throw new Error('ORPHAN SNAPSHOT REFUSED - operational_doc captured ' + opDoc.length + ' of ' + live.operational_doc + '. Aborting rather than writing a partial backup.');\n";
o = once(o, "const chapters = $('Fetch kb_book_chapters').all().map(x => x.json);\n", "const chapters = $('Fetch kb_book_chapters').all().map(x => x.json);\n" + GATE, 'orphan chapters line');
o = once(o, "|| chapters.length === 0)", "|| chapters.length === 0 || opDoc.length === 0)", 'orphan zero test');
o = once(o, " + ' chapters=' + chapters.length + ').", " + ' chapters=' + chapters.length + ' operational_doc=' + opDoc.length + ').", 'orphan zero msg');
o = once(o, ", chapter_chars: chapterChars }, kb_conclusions:", ", chapter_chars: chapterChars, operational_doc: opDoc.length }, live_counts: { operational_doc: live.operational_doc }, kb_conclusions:", 'orphan counts');
o = once(o, ", kb_book_chapters: chapters };", ", kb_book_chapters: chapters, operational_doc: opDoc };", 'orphan snapshot obj');
o = once(o, "note: 'Orphan-table backstop — tables not in the main Every-3-Day SQL Snapshot.'", "note: 'Orphan-table backstop — tables not in the main Every-3-Day SQL Snapshot, and the operational_doc version history (ASK 226).'", 'orphan note');
OB.parameters.jsCode = o; note('orphan Build Orphan Snapshot jsCode', o0.length, o.length);

const OL = by(O.W, 'Log Orphan Snapshot to audit_log'); const ol0 = OL.parameters.jsonBody;
OL.parameters.jsonBody = once(ol0, ' + " chapter_chars=" + $("Build Orphan Snapshot").first().json.counts.chapter_chars', ' + " chapter_chars=" + $("Build Orphan Snapshot").first().json.counts.chapter_chars + " operational_doc=" + $("Build Orphan Snapshot").first().json.counts.operational_doc', 'orphan log');
note('orphan Log jsonBody', ol0.length, OL.parameters.jsonBody.length);
if (typeof O.W.description === 'string') O.W.description = O.W.description + ' Also backs up every operational_doc version (moved from the main snapshot, ASK 226), gated captured-against-live.';

note('orphan added node Fetch live counts', 0, JSON.stringify(flc).length);
note('orphan added node Fetch operational_doc', 0, JSON.stringify(fod).length);
note('main removed node Fetch operational_doc', JSON.stringify(fod).length, 0);

const wr = (f, x) => { const s = JSON.stringify(x.raw); fs.writeFileSync(f, s); return crypto.createHash('sha256').update(s).digest('hex').slice(0, 16); };
console.log('main nodes', mainNodes0, '->', M.W.nodes.length, '| sha256', wr(tm, M));
console.log('orphan nodes', orphNodes0, '->', O.W.nodes.length, '| sha256', wr(to, O));
console.log(sizes.join('\n'));
