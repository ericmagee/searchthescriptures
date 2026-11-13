// pkgSPL offline tests: runs the target Build code nodes and log expressions with mocked n8n inputs.
// usage: node test.cjs target_main.json target_orphan.json
const fs = require('fs');
const [, , tm, to] = process.argv;
const wf = f => { const r = JSON.parse(fs.readFileSync(f, 'utf8')); return (r.data || r).workflow || (r.data || r); };
const M = wf(tm), O = wf(to);
const node = (W, n) => W.nodes.find(x => x.name === n);
const mk = data => n => {
  if (!(n in data)) throw new Error('unmocked node ' + n);
  const v = data[n];
  return { all: () => v.map(j => ({ json: j })), first: () => ({ json: v[0] }) };
};
const run = (code, data, input) => new Function('$', '$input', code)(mk(data), { all: () => (input || []).map(j => ({ json: j })) });
const rows = (k, n) => Array.from({ length: n }, (_, i) => ({ id: i + 1, content: k + ' row ' + i }));
let pass = 0, fail = 0;
const expect = (name, fn, want) => {
  let got;
  try { const r = fn(); got = 'OK ' + JSON.stringify(r).length; } catch (e) { got = 'RAISE ' + e.message; }
  const ok = want === 'OK' ? got.startsWith('OK') : got.startsWith('RAISE') && got.includes(want);
  ok ? pass++ : fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + name + ' -> ' + got.slice(0, 160));
};

// ---- main Build SQL Snapshot ----
const mainLive = { kb_sights: 3, tensions_wall: 2, journal_entries: 2, drift_guards: 2, app_state: 2, origin_log: 2, operational_doc: 5, session_load_manual: 1, book_walk_manual: 1, oracle_manual: 1, fold_manual: 1 };
const mainData = live => ({
  'Fetch kb_sights': rows('s', 3), 'Fetch tensions_wall': rows('t', 2), 'Fetch journal_entries': rows('j', 2), 'Fetch drift_guards': rows('g', 2),
  'Fetch app_state': rows('a', 2), 'Fetch origin_log': rows('o', 2), 'Fetch schema definitions': [{ data: 'x'.repeat(1500) }], 'Fetch live counts': [live]
});
const MB = node(M, 'Build SQL Snapshot').parameters.jsCode;
expect('main: passes with operational_doc absent from the fetches', () => {
  const out = run(MB, mainData(mainLive));
  const snap = JSON.parse(out[0].json.content);
  if ('operational_doc' in snap || 'operational_doc' in snap.counts) throw new Error('operational_doc still in main snapshot');
  return out;
}, 'OK');
expect('main: shortfall on kb_sights still raises', () => run(MB, mainData({ ...mainLive, kb_sights: 4 })), 'SNAPSHOT TRUNCATED');
expect('main: malformed live count still raises', () => run(MB, mainData({ ...mainLive, journal_entries: '2' })), 'ANTI-HOLLOW GATE');
expect('main: malformed operational_doc live count no longer matters', () => run(MB, mainData({ ...mainLive, operational_doc: null })), 'OK');
expect('main: no node reads Fetch operational_doc', () => { if (JSON.stringify({ n: M.nodes, c: M.connections }).includes("Fetch operational_doc")) throw new Error('reference remains'); return 1; }, 'OK');

// ---- orphan Build Orphan Snapshot ----
const OB = node(O, 'Build Orphan Snapshot').parameters.jsCode;
const chap = [{ id: 1, content: 'c'.repeat(120000) }];
const orphData = (op, live) => ({
  'Fetch kb_conclusions': rows('k', 2), 'Fetch fold_history': rows('f', 2), 'Fetch kb_pamphlets': rows('p', 2), 'Fetch kb_books': rows('b', 1),
  'Fetch kb_book_chapters': chap, 'Fetch operational_doc': op, 'Fetch live counts': [live]
});
expect('orphan: passes, operational_doc in file and counts', () => {
  const out = run(OB, orphData(rows('d', 5), { operational_doc: 5 }));
  const snap = JSON.parse(out[0].json.content);
  if (!Array.isArray(snap.operational_doc) || snap.operational_doc.length !== 5 || snap.counts.operational_doc !== 5 || snap.live_counts.operational_doc !== 5) throw new Error('operational_doc missing');
  if (snap.kb_book_chapters.length !== 1 || snap.counts.chapter_chars !== 120000) throw new Error('orphan tables changed');
  return out;
}, 'OK');
expect('orphan: rows added mid-run pass (captured 6, live 5)', () => run(OB, orphData(rows('d', 6), { operational_doc: 5 })), 'OK');
expect('orphan: shortfall raises (captured 4 of 5)', () => run(OB, orphData(rows('d', 4), { operational_doc: 5 })), 'captured 4 of 5');
expect('orphan: live count null raises', () => run(OB, orphData(rows('d', 5), { operational_doc: null })), 'not a non-negative integer');
expect('orphan: live count string raises', () => run(OB, orphData(rows('d', 5), { operational_doc: '5' })), 'not a non-negative integer');
expect('orphan: live count missing raises', () => run(OB, orphData(rows('d', 5), {})), 'not a non-negative integer');
expect('orphan: live count NaN raises', () => run(OB, orphData(rows('d', 5), { operational_doc: NaN })), 'not a non-negative integer');
expect('orphan: live side as array is unwrapped and passes', () => run(OB, { ...orphData(rows('d', 5), null), 'Fetch live counts': [[{ operational_doc: 5 }]] }), 'OK');
expect('orphan: zero operational_doc rows with live 0 raises on zero rule', () => run(OB, orphData([], { operational_doc: 0 })), 'operational_doc=0');
expect('orphan: an old table at zero still raises', () => run(OB, { ...orphData(rows('d', 5), { operational_doc: 5 }), 'Fetch kb_books': [] }), 'books=0');

// ---- log expressions ----
const evalExpr = (body, data) => { const e = body.replace(/^=\{\{\s*/, '').replace(/\s*\}\}$/, ''); return new Function('$', '$now', 'return ' + e)(mk(data), { toISODate: () => '2026-11-16' }); };
const mainOut = run(MB, mainData(mainLive));
expect('main log text has no operational_doc and no undefined', () => {
  const s = evalExpr(node(M, 'Log Snapshot to audit_log').parameters.jsonBody, { 'Build SQL Snapshot': mainOut.map(x => x.json) });
  if (/operational_doc|undefined/.test(s)) throw new Error(s); return s;
}, 'OK');
const orphOut = run(OB, orphData(rows('d', 5), { operational_doc: 5 }));
expect('orphan log text carries operational_doc=5', () => {
  const s = evalExpr(node(O, 'Log Orphan Snapshot to audit_log').parameters.jsonBody, { 'Build Orphan Snapshot': orphOut.map(x => x.json) });
  if (!/operational_doc=5/.test(s) || /undefined/.test(s)) throw new Error(s); return s;
}, 'OK');

// ---- wiring ----
const reach = (W, start) => { const seen = []; let cur = start; while (cur && !seen.includes(cur)) { seen.push(cur); const c = W.connections[cur]; cur = c && c.main && c.main[0] && c.main[0][0] && c.main[0][0].node; } return seen; };
expect('main chain', () => { const r = reach(M, 'Every-3-Day Snapshot Trigger'); if (r.includes('Fetch operational_doc') || !r.includes('Save Snapshot File') || !r.includes('Fetch session_load_manual')) throw new Error(r.join(' > ')); return r; }, 'OK');
expect('orphan chain', () => { const r = reach(O, 'Every-3-Day Orphan Trigger'); const want = ['Every-3-Day Orphan Trigger', 'Fetch live counts', 'Fetch kb_conclusions', 'Fetch fold_history', 'Fetch kb_pamphlets', 'Fetch kb_books', 'Fetch kb_book_chapters', 'Fetch operational_doc', 'Build Orphan Snapshot', 'Save Orphan Snapshot File', 'Log Orphan Snapshot to audit_log']; if (JSON.stringify(r) !== JSON.stringify(want)) throw new Error(r.join(' > ')); return r; }, 'OK');
console.log('\n' + pass + ' pass, ' + fail + ' fail');
process.exit(fail ? 1 : 0);
