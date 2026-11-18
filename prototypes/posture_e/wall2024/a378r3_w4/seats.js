const SEATS = (() => { /* ASK 378 rev 3 (DoD 4): one number per panel seat. Each seat's chain (panel seat, reserve, alternate) is built from the run's own records: panel_substitution (failed_seat, substitute), drv_removed (seat, replaced_by) and AUDIT v21 ALTERNATE TRIED; never from panel_expected, which is rewritten during the run. */
  const DR = Array.isArray(r.drv_removed) ? r.drv_removed : []; let pb = null; try { pb = $('Panel Build').first(0).json; } catch (e) { pb = null; }
  const SB = r.panel_substitution && r.panel_substitution.failed_seat ? r.panel_substitution : null;
  const TRS = []; J.concat(DR).forEach(q => { for (const m of String(q.verdict_raw || '').matchAll(/\[AUDIT v21: ALTERNATE TRIED -- SEAT: ([^;\]]+); ALTERNATE: ([^;\]]+); MODEL: [^;\]]+; RESULT: SEATED\b/g)) TRS.push({ seat: m[1].trim(), alt: m[2].trim() }); });
  const origin = s0 => { let s = s0; const seen = new Set(); for (;;) { if (seen.has(s)) return s; seen.add(s); const x = DR.find(d => d.replaced_by === s); if (x) { s = x.seat; continue; } if (SB && SB.substitute === s && SB.failed_seat !== s) { s = SB.failed_seat; continue; } const y = TRS.find(z => z.alt === s && z.seat !== s); if (y) { s = y.seat; continue; } return s; } };
  let order = pb && Array.isArray(pb.judges) ? pb.judges.map(x => x && x.seat).filter(Boolean) : null;
  if (!order || !order.length) order = J.map(j => origin(j.judge_seat)).concat(DR.map(x => origin(x.seat))).filter((x, i, a) => a.indexOf(x) === i).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  const out = [], used = new Set(), usedD = new Set(); let n = 0;
  order.forEach(seat => { n++; let cur = seat, tag = ''; const seen = new Set();
    if (SB && SB.failed_seat === seat && !J.some(q => q.judge_seat === seat) && !DR.some(d => d.seat === seat)) { out.push({ failed: SB, n }); cur = SB.substitute; tag = ', reserve for ' + nm(seat); }
    for (;;) { if (seen.has(cur)) break; seen.add(cur);
      const x = DR.find(d => d.seat === cur && !usedD.has(d)); if (x) { usedD.add(x); out.push({ removed: x, n, tag }); tag = ', alternate for ' + nm(x.seat); cur = x.replaced_by; if (!cur) break; continue; }
      const j = J.find(q => q.judge_seat === cur && !used.has(q)); if (j) { used.add(j); out.push({ j, n, tag }); } break; } });
  DR.forEach(x => { if (!usedD.has(x)) { n++; usedD.add(x); out.push({ removed: x, n, tag: '' }); const j = J.find(q => q.judge_seat === x.replaced_by && !used.has(q)); if (j) { used.add(j); out.push({ j, n, tag: ', alternate for ' + nm(x.seat) }); } } });
  J.forEach(q => { if (!used.has(q)) { n++; used.add(q); out.push({ j: q, n, tag: '' }); } }); return out; })();
