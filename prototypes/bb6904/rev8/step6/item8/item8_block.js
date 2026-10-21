
// ITEM 8 (BB-7224, shape BB-7234): WHAT THE JUDGES WERE SENT. Each distinct text sent to a judge in this run is printed once, verbatim,
// under a heading that names every seat and call that received it and gives the md5 of the text (its messages joined in order, UTF-8).
// Each cure call prints the judge's re-sent answer and the cure request verbatim and names the text it followed. Appended; nothing above moves.
const MD5 = (str) => {
  const s = unescape(encodeURIComponent(String(str))); const n = s.length; const w = [];
  for (let i = 0; i < n; i++) w[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
  w[n >> 2] |= 0x80 << ((n % 4) * 8); const L = (((n + 8) >> 6) + 1) * 16; for (let i = 0; i < L; i++) w[i] = w[i] | 0; w[L - 2] = n * 8;
  const K = [], R = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
  let a0 = 0x67452301, b0 = 0xefcdab89 | 0, c0 = 0x98badcfe | 0, d0 = 0x10325476;
  for (let o = 0; o < L; o += 16) {
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) { f = (b & c) | (~b & d); g = i; } else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; } else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      const t = d; d = c; c = b; const x = (a + f + K[i] + w[o + g]) | 0; const r = R[(i >> 4) * 4 + (i % 4)];
      b = (b + ((x << r) | (x >>> (32 - r)))) | 0; a = t;
    }
    a0 = (a0 + a) | 0; b0 = (b0 + b) | 0; c0 = (c0 + c) | 0; d0 = (d0 + d) | 0;
  }
  return [a0, b0, c0, d0].map(v => { let h = ''; for (let i = 0; i < 4; i++) h += ((v >>> (i * 8)) & 255).toString(16).padStart(2, '0'); return h; }).join('');
};
const sentMsgs = (b) => {
  if (!b || typeof b !== 'object') return null; const out = [];
  if (b.systemInstruction || b.contents) {
    if (b.systemInstruction) out.push({ role: 'system', text: (b.systemInstruction.parts || []).map(p => p.text || '').join('') });
    (b.contents || []).forEach(c => out.push({ role: c.role || 'user', text: (c.parts || []).map(p => p.text || '').join('') }));
    return out;
  }
  if (typeof b.system === 'string') out.push({ role: 'system', text: b.system });
  else if (Array.isArray(b.system)) out.push({ role: 'system', text: b.system.map(x => x.text || '').join('') });
  (b.messages || []).forEach(m => out.push({ role: m.role, text: typeof m.content === 'string' ? m.content : (Array.isArray(m.content) ? m.content.map(x => x.text || '').join('') : '') }));
  return out;
};
const fromNode = (name, f) => { try { return f($(name)); } catch (e) { return null; } };
const SENT = (() => {
  const calls = [], cures = [];
  const sj = fromNode('Build Independent Verdict', x => x.first().json);
  if (sj && sj.verdictBody) calls.push({ who: 'single judge ' + SJN + ' (' + (sj.judge_model || '') + ')', m: sentMsgs(sj.verdictBody) });
  const pb = fromNode('Panel Build', x => x.first().json);
  if (pb && Array.isArray(pb.judges)) pb.judges.forEach((j, i) => calls.push({ who: 'panel judge ' + (i + 1) + ' ' + nm(j.seat) + ' (' + (j.api_model || '') + ')', m: sentMsgs(j.body) }));
  (fromNode('Reserve Build', x => x.all().map(i => i.json)) || []).forEach(j => { if (j && j.body) calls.push({ who: 'reserve judge ' + nm(j.seat) + ' (' + (j.api_model || '') + ')', m: sentMsgs(j.body) }); });
  (fromNode('Alternate Build', x => x.all().map(i => i.json.alt)) || []).forEach(a => { if (a && a.body && !a.skip) calls.push({ who: 'alternate judge ' + nm(a.pool_seat || a.seat) + ' (' + (a.api_model || '') + ') seated for ' + nm(a.removed_seat), m: sentMsgs(a.body) }); });
  ['Cure Build', 'Panel Cure Build 1', 'Panel Cure Build 2', 'Panel Cure Build 3', 'Alternate Cure Build'].forEach(n => {
    (fromNode(n, x => x.all().map(i => i.json.cure)) || []).forEach(c => { if (c && c.body && !c.skip) cures.push({ who: 'Cure call, ' + (c.who === 'single' ? 'single judge ' + SJN : (c.who === 'alternate' ? 'alternate ' : '') + nm(c.seat)) + ' (' + (c.model || '') + ')', m: sentMsgs(c.body) }); });
  });
  return { calls, cures };
})();
const sentFence = (s) => { let n = 3; (String(s).match(/`{3,}/g) || []).forEach(r => { if (r.length >= n) n = r.length + 1; }); const f = '`'.repeat(n); return f + 'text\n' + s + '\n' + f; };
const sentBlock = (m) => m.map(x => '**' + x.role + ' message** (' + x.text.length + ' characters)\n\n' + sentFence(x.text) + '\n\n').join('');
let s8 = '## What the judges were sent\n\nEvery text the system sent to a judge in this debate, verbatim. Each distinct text is printed once; its heading names every seat and call that received it and gives the md5 of the text (its messages joined in order, UTF-8). A cure call re-sends its judge\'s text with the judge\'s answer and the cure request; those two are printed in full under the cure call, which names the text it followed.\n\n';
const SG = [];
SENT.calls.forEach(c => { if (!c.m) return; const h = MD5(c.m.map(x => x.text).join('')); let g = SG.find(x => x.h === h); if (!g) { g = { h, m: c.m, who: [] }; SG.push(g); } g.who.push(c.who); });
if (!SG.length && !SENT.cures.length) s8 += '*Not available: the texts sent to the judges are not in this run.*\n\n';
SG.forEach((g, i) => { s8 += '### Text ' + (i + 1) + ', md5 ' + g.h + '\n\nSent to: ' + g.who.join('; ') + '.\n\n' + sentBlock(g.m); });
SENT.cures.forEach(c => {
  let k = -1, g = null;
  for (let n = c.m.length; n > 0 && !g; n--) { const h = MD5(c.m.slice(0, n).map(x => x.text).join('')); g = SG.find(x => x.h === h) || null; if (g) k = n; }
  s8 += '### ' + c.who + '\n\n';
  if (g) s8 += 'Followed the ' + g.h + ' text above (Text ' + (SG.indexOf(g) + 1) + '), then:\n\n' + sentBlock(c.m.slice(k));
  else s8 += 'md5 ' + MD5(c.m.map(x => x.text).join('')) + '; its opening matches no text above, so the whole call is printed:\n\n' + sentBlock(c.m);
});
t += '\n---\n\n' + s8;
