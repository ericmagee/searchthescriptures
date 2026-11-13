// pkgERC rev 2 offline tests and replay. usage: node test.cjs <live json> <target json> <Alt Judge Enforcer Record full source (rebuilt from the library)> <replay json>
const fs = require('fs');
const get = f => { const r = JSON.parse(fs.readFileSync(f, 'utf8')); return (r.data || r).workflow || (r.data || r); };
const A = get(process.argv[2]), B = get(process.argv[3]); const REC = fs.readFileSync(process.argv[4], 'utf8'); const REPLAY = JSON.parse(fs.readFileSync(process.argv[5], 'utf8'));
let pass = 0, fail = 0; const t = (n, f) => { try { const g = f(); pass++; console.log('PASS ' + n + (g ? ' -> ' + g : '')); } catch (e) { fail++; console.log('FAIL ' + n + ' -> ' + e.message); } };
const eq = (a, b, w) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(w + ': got ' + JSON.stringify(a) + ' want ' + JSON.stringify(b)); };
const code = (W, n) => W.nodes.find(x => x.name === n).parameters.jsCode;
const NAMES = ['Enforcer Resend Build', 'Judge Enforcer Resend Build', 'Alt Judge Enforcer Resend Build', 'R2 Alt Judge Enforcer Resend Build'];
const RETRY = n => n.replace('Resend Build', 'Retry Build');
const run = (c, nm, halves, replies) => new Function('$', '$input', c)(n => { if (n !== RETRY(nm)) throw new Error('read ' + n); return { all: () => halves.map(j => ({ json: j })) }; }, { all: () => replies.map(j => ({ json: j })) }).map(x => x.json);
t('only the 4 Resend Build nodes change; connections identical', () => { A.nodes.forEach((n, i) => { if (!NAMES.includes(n.name) && JSON.stringify(n) !== JSON.stringify(B.nodes[i])) throw new Error(n.name); }); if (JSON.stringify(A.connections) !== JSON.stringify(B.connections)) throw new Error('conn'); });
const H = k => ({ esr_retry: true, esr_of: 0, esr_half: k + 1, body: { model: 'deepseek-flash', messages: [{}, { content: 'h' + k }] }, model: 'deepseek-flash', run_token: 'T' });
const OK = { choices: [{ finish_reason: 'stop', message: { content: 'ENFORCER: Y1.1 -- AGREE' } }] };
const CAP = { choices: [{ finish_reason: 'length', message: { content: '' } }] };
const CAPTXT = { choices: [{ finish_reason: 'length', message: { content: 'ENFORCER: Y1.1 -- AGR' } }] };
const EMPTY = { choices: [{ finish_reason: 'stop', message: { content: '  ' } }] };
const NOCH = { error: { message: 'timeout' } };
for (const nm of NAMES) {
  const o = code(A, nm), n = code(B, nm);
  t(nm + ': cases', () => {
    const halves = [H(0), H(1), H(2), H(3), H(4), H(5)], rr = [OK, CAP, CAPTXT, EMPTY, NOCH, undefined];
    const a = run(o, nm, halves, rr).map(x => x.ers_k), b = run(n, nm, halves, rr).map(x => [x.ers_k, x.ers_why]);
    eq(a, [4, 5], 'old'); eq(b, [[1, 'empty content (finish_reason length)'], [3, 'empty content'], [4, 'no choices'], [5, 'no choices']], 'new');
    eq(run(n, nm, [H(0), H(1)], [OK, OK]), [{ ers_resend: false }], 'none'); eq(run(n, nm, [{ esr_retry: false }], [CAP]), [{ ers_resend: false }], 'no retry');
    const one = run(n, nm, [H(0)], [CAP])[0]; eq([one.body, one.model, one.run_token], [H(0).body, 'deepseek-flash', 'T'], 'body passed'); });
}
// Record merge (Alt Judge Enforcer Record lines 109-112, live code): a resent reply replaces the half at its index.
const L = REC.split('\n'); const i0 = L.findIndex(l => l.startsWith('const __esr={retried:[]')); const blk = L.slice(i0, i0 + 4).join('\n');
t('record merge block found unchanged (live library)', () => { if (!/RR\[s\.ers_k\]=SR\[j\]/.test(blk) || !/__esr\.halves\+\+/.test(blk)) throw new Error('block'); });
const merge = (Bc, Rc, RB, RR, SB, SR) => new Function('$', 'B0', 'R0', 'let B=B0,R=R0;' + blk + '\nreturn {B,R,esr:__esr};')(n => ({ isExecuted: true, all: () => ({ 'Alt Judge Enforcer Retry Build': RB, 'Alt Judge Enforcer Retry Call deepseek': RR, 'Alt Judge Enforcer Resend Build': SB, 'Alt Judge Enforcer Resend Call deepseek': SR }[n] || (() => { throw new Error('read ' + n); })()).map(j => ({ json: j })) }), Bc, Rc);
t('36677 shape: call k=2 split in 2 halves, half 0 cut at cap and resent -> the resent reply is read for half 0', () => {
  const Bc = [{ ids: [] }, { ids: [] }, { ids: [{ id: 'Y1.1' }, { id: 'Y2.1' }], body: {} }], Rc = [OK, OK, CAP];
  const RB = [{ ...H(0), esr_of: 2, ids: [{ id: 'Y1.1' }] }, { ...H(1), esr_of: 2, ids: [{ id: 'Y2.1' }] }], RR = [CAP, OK];
  const SB = run(code(B, 'Alt Judge Enforcer Resend Build'), 'Alt Judge Enforcer Resend Build', RB, RR); eq(SB.map(x => x.ers_k), [0], 'resend');
  const m = merge(Bc, Rc, RB, RR, SB, [OK]); eq(m.R.slice(2), [OK, OK], 'replies'); eq(m.esr.resent, 1, 'resent'); return 'calls ' + m.B.length + ', resent ' + m.esr.resent; });
t('W4 plant: a cap-cut half holding verdict lines is not resent; with an errored or empty resend the Record keeps its 2 lines', () => {
  const partial = { choices: [{ finish_reason: 'length', message: { content: 'H1.1 -- AGREE -- RIGHT: MEETS -- x\nH1.2 -- DISAGREE -- RIGHT: BROKEN -- y\nH1.3 -- AG' } }] };
  const RB = [{ ...H(0), esr_of: 2, ids: [{ id: 'H1.1' }] }, { ...H(1), esr_of: 2, ids: [{ id: 'H2.1' }] }], RR = [partial, OK];
  const SB = run(code(B, 'Alt Judge Enforcer Resend Build'), 'Alt Judge Enforcer Resend Build', RB, RR); eq(SB, [{ ers_resend: false }], 'no resend');
  const Bc = [{ ids: [] }, { ids: [] }, { ids: [{ id: 'H1.1' }, { id: 'H2.1' }], body: {} }], Rc = [OK, OK, CAP];
  for (const SR of [[{ error: 'Bad request - please check your parameters' }], [CAP]]) { const m = merge(Bc, Rc, RB, RR, SB, SR); eq(m.R[2], partial, 'kept'); eq(m.esr.resent || 0, 0, 'resent'); }
  return 'kept 2 verdict lines under both resend failures'; });
t('an empty cap-cut half resent and the resend errors: the half held nothing before, so nothing is lost', () => {
  const RB = [H(0)], RR = [CAP]; const SB = run(code(B, 'Alt Judge Enforcer Resend Build'), 'Alt Judge Enforcer Resend Build', RB, RR); eq(SB.map(x => x.ers_why), ['empty content (finish_reason length)'], 'why'); });
// Replay over every stored run whose retry calls ran (call_costs): o null -> no choices, o = 64000 -> cut at cap, else a reply.
let diff = [];
t('replay over stored retry calls (' + REPLAY.length + ' halves): only cap-cut halves change', () => {
  const runs = {}; for (const x of REPLAY) (runs[x.run + '|' + x.node] = runs[x.run + '|' + x.node] || []).push(x);
  for (const key in runs) { const xs = runs[key].sort((a, b) => a.k - b.k); const nm = xs[0].node.replace('Retry Call deepseek', 'Resend Build');
    const halves = xs.map(() => H(0)), rr = xs.map(x => x.o == null ? NOCH : x.o >= 64000 ? CAP : OK);
    const a = run(code(A, nm), nm, halves, rr).filter(x => x.ers_resend).map(x => x.ers_k), b = run(code(B, nm), nm, halves, rr).filter(x => x.ers_resend).map(x => x.ers_k);
    const extra = b.filter(k => !a.includes(k)); if (a.some(k => !b.includes(k))) throw new Error(key + ' lost a resend');
    for (const k of extra) { if (!(xs[k].o >= 64000)) throw new Error(key + ' changed a non-cap half ' + k); diff.push(key + ' k=' + xs[k].k); } }
  return 'new resends: ' + (diff.join('; ') || 'none'); });
console.log('\n' + pass + ' pass, ' + fail + ' fail'); process.exit(fail ? 1 : 0);
