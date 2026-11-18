const superNorm = s => String(s || '').replace(/[*_`]+/g, '').replace(/^\s*(?:[-•]|\d+[.)])?\s*/, '').replace(/["“”‘’']/g, '').replace(/\[((?:CR|DR)[1-4]|L[1-4])\]/g, '$1').replace(/\s+VS\.?\s+/i, ' VS ').replace(/\s+/g, ' ').trim().toUpperCase();
const superKey = x => { if (x.label !== 'LINE') return null; const o = String(x.orig || ''); const p = o.split(' -- '); const p0 = p[0].trim();
  if (p.length < 2) { const q = o.split(' | '); return q.length >= 3 ? superNorm(q.slice(0, 2).join(' | ') + ' | ' + superNorm(q.slice(2).join(' | ')).slice(0, 40)) : null; }
  if (/^ANSWER CHECK\s*:/i.test(p0) || !/:/.test(p0)) return superNorm(p0 + ' -- ' + p[1]);
  if (/^(?:[A-Z]+\s*:\s*)?D\d+ vs\.? C\d+/i.test(p0)) return superNorm(p0.match(/^(?:[A-Z]+\s*:\s*)?D\d+ vs\.? C\d+/i)[0]);
  return superNorm(p0.replace(/:.*$/, ':')); }; /* ASK 389: a LINE tag is keyed on the head of its ORIGINAL */
const superApply = (txt, raw) => { const S = superOf(raw); if (!S.length) return txt; const K = S.map(superKey); const lines = String(txt).split('\n'); const used = new Set(); const at = {};
  lines.forEach((l, li) => { const u = l.replace(/[*_`]+/g, '').replace(/^\s*(?:[-•]|\d+[.)])?\s*/, '').replace(/\s+VS\.?\s+/i, ' VS ').toUpperCase(); const k = S.findIndex((x, i) => !used.has(i) && x.label !== 'LINE' && u.startsWith(x.label)); if (k >= 0) { used.add(k); at[li] = k; } });
  const N = lines.map(superNorm); const cp = (a, b) => { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; };
  S.forEach((x, i) => { if (used.has(i) || !K[i]) return; const o = superNorm(x.orig); let best = -1, bs = -1; N.forEach((n, li) => { if (at[li] != null || !n.startsWith(K[i])) return; const s = cp(n, o); if (s > bs) { bs = s; best = li; } }); if (best >= 0) { used.add(i); at[best] = i; } }); /* ASK 389: among lines sharing the key, the line nearest the ORIGINAL */
  const out = []; lines.forEach((l, li) => { if (at[li] == null) { out.push(l); return; } const k = at[li]; out.push(l + ' *(corrected by the cure)*', '', '> *Superseded by the cure (the judge\'s line before it):* ' + S[k].orig.replace(/\s+/g, ' '), ''); });
  const left = S.filter((x, i) => !used.has(i)); if (left.length) out.push('', ...left.map(x => '> *Superseded by the cure, line not found in the final text:* ' + x.orig.replace(/\s+/g, ' ')), ''); /* ASK 389: nothing is dropped */
  return out.join('\n'); };
