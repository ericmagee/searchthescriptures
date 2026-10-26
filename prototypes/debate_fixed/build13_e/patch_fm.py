# Rev 9 Format Markdown and Plain Rule Lines patch (Worker_E): DoD 21, 23, 24 (2), 25 and the DoD 26 report row. Each anchor must hit once.
P='new13/Format_Markdown.js';s=open(P).read()
def rep(a,b):
  global s; assert s.count(a)==1,a[:80]; s=s.replace(a,b)
# DoD 21: a judgment counted after its cure, with its tag changed by the cure.
rep("const panelText = (raw, j) => {",
"""// BB-7397 rev 9 DoD 21: a judgment whose cure changed its verdict (its CORRECTED RESULT line, ORIGINAL not COUNTED) prints the counted clause
// first, then its own RESULT, CLAUSE and KEYSTONE lines, quoted, under one line saying they are its text before the cure.
const curedTo = raw => { const m = String(raw || '').match(/\\[AUDIT v21: CORRECTED RESULT -- SEAT: [^;\\]]*; ORIGINAL: (\\w+); COUNTED: (\\w+) \\(((?:BROKEN|PARTIAL|HELD)-\\d)\\)(?:; RETRACTED: ([^\\]]*))?\\]/); return m && m[1] !== m[2] ? { orig: m[1], counted: m[2], code: m[3], retracted: (m[4] || '').trim() } : null; };
const beforeCure = (txt, c) => { if (!c) return txt; const L = String(txt).split('\\n'); const own = /^[ \\t*_]*(RESULT|CLAUSE|KEYSTONE)[ \\t*_]*:/; const at = L.findIndex(l => own.test(l)); if (at < 0) return txt;
  const mine = L.filter(l => own.test(l)), rest = L.filter(l => !own.test(l)); const head = rest.slice(0, at), tail = rest.slice(at);
  return head.concat(['CLAUSE: ' + c.code + " -- counted after the judge's cure" + (c.retracted ? '; retracted: ' + c.retracted : ''), '', "The judge's own lines before its cure, not counted:", ''], mine.map(l => '> ' + l.trim()), [''], tail).join('\\n'); };
const panelText = (raw, j) => {""")
rep("demote(nameGuards(noMarkers((o.reasoning == null && o.reason != null ? o.reason : o.reasoning) || '(no reasoning given)'))); };",
    "demote(nameGuards(noMarkers(beforeCure((o.reasoning == null && o.reason != null ? o.reason : o.reasoning) || '(no reasoning given)', curedTo(raw))))); };")
# DoD 25: seat-order numbering for the head and the sections.
rep("const COUNTED = Array.isArray(r.judged_by) ? r.judged_by : null;\nJ.forEach((j, i) => { const why = seatReason(j.verdict_raw); const counted = !COUNTED || COUNTED.includes(j.judge_seat); t += '- Panel judge ' + (i + 1) + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): **' + (j.verdict_tag || '?') + '**' + VSIDE + (counted ? '' : ' (not counted)') + (why ? '. Reason: ' + why : '') + '\\n'; });",
"""const COUNTED = Array.isArray(r.judged_by) ? r.judged_by : null;
// BB-7397 rev 9 DoD 25: the head and the panel sections number the judges as the section "What the judges were sent" does: by seat in Panel
// Build's order (without it, the ORDER list). A seat removed for violations not cured keeps its number and is named; the alternate seated
// for it is "Panel judge N, alternate"; a reserve judge is "Panel judge N, reserve for <seat>". A judgment no seat claims follows, numbered on.
const SEATS = (() => { const DR = Array.isArray(r.drv_removed) ? r.drv_removed : []; let pb = null; try { pb = $('Panel Build').first().json; } catch (e) { pb = null; }
  let order = pb && Array.isArray(pb.judges) ? pb.judges.map(x => x && x.seat).filter(Boolean) : null;
  if (!order || !order.length) order = J.map(j => j.judge_seat).concat(DR.map(x => x.seat)).filter((x, i, a) => a.indexOf(x) === i).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  const SB = r.panel_substitution && r.panel_substitution.failed_seat ? r.panel_substitution : null; const out = [], used = new Set(); let n = 0;
  order.forEach(seat => { n++; const x = DR.find(d => d.seat === seat); const j = J.find(q => q.judge_seat === seat && !used.has(q));
    if (x) { out.push({ removed: x, n }); const a = J.find(q => q.judge_seat === x.replaced_by && !used.has(q)); if (a) { used.add(a); out.push({ j: a, n, tag: ', alternate' }); } }
    else if (j) { used.add(j); out.push({ j, n, tag: '' }); }
    else if (SB && SB.failed_seat === seat) { const q = J.find(z => z.judge_seat === SB.substitute && !used.has(z)); if (q) { used.add(q); out.push({ j: q, n, tag: ', reserve for ' + nm(seat) }); } } });
  J.forEach(q => { if (!used.has(q)) { n++; used.add(q); out.push({ j: q, n, tag: '' }); } }); return out; })();
SEATS.forEach(e => { if (e.removed) { const x = e.removed; t += '- Panel judge ' + e.n + ': ' + nm(x.seat) + ' (' + (x.api_model || '') + '): **' + (x.verdict_tag || '?') + '**' + VSIDE + ' (removed: ' + (x.drv_uncured || 0) + ' debate rule violation(s) not cured; not counted; ' + (ALTN0[x.replaced_by] || nm(x.replaced_by)) + ' sat in its place)\\n'; return; }
  const j = e.j; const why = curedTo(j.verdict_raw) ? null : seatReason(j.verdict_raw); const counted = !COUNTED || COUNTED.includes(j.judge_seat); t += '- Panel judge ' + e.n + e.tag + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): **' + (j.verdict_tag || '?') + '**' + VSIDE + (counted ? '' : ' (not counted)') + (why ? '. Reason: ' + why : '') + '\\n'; });""")
rep("const NAME = {", "const ALTN0 = { alt_minimax31: 'MiniMax M3.1 Flash', alt_minimax3: 'MiniMax M3' }; // the alternates' names, as ALTN below (head line of a removed seat, DoD 25)\nconst NAME = {")
rep("J.forEach((j, i) => { t += '## Panel judge ' + (i + 1) + ': ' + nm(j.judge_seat)",
    "SEATS.filter(e => e.j).forEach(e => { const j = e.j; t += '## Panel judge ' + e.n + e.tag + ': ' + nm(j.judge_seat)")
# DoD 26 (2), the report: each C-LABEL OFF THE GUIDE line of a panel judgment is a Result row, recorded, not for review.
rep("t += '| Run | ' + (r.run_token || '') + ', ' + date + ' |\\n\\n';",
"""// BB-7397 rev 9 DoD 26 (2): a collision label off the guide's [DR3] order, recorded by Panel Payloads or Alternate Payloads; not a violation, not counted.
J.forEach(j => { String(j.verdict_raw || '').split('\\n').forEach(l => { const m = l.trim().match(/^\\[AUDIT v21: C-LABEL OFF THE GUIDE -- (.*)\\]$/); if (m) t += '| C-label off the guide (panel judge ' + nm(j.judge_seat) + ') | ' + m[1].replace(/\\|/g, '\\\\|') + ' |\\n'; }); });
t += '| Run | ' + (r.run_token || '') + ', ' + date + ' |\\n\\n';""")
# DoD 24 (2): the reason is set off from the statement.
rep("((x.STATEMENT ? x.STATEMENT + ' ' : '') + (x.WHY ? 'Not cured: ' + x.WHY + '.' : 'Not cured.'))",
    "((x.STATEMENT ? x.STATEMENT + ' -- ' : '') + (x.WHY ? 'Not cured: ' + x.WHY + '.' : 'Not cured.')) // BB-7397 rev 9 DoD 24: ' -- ' sets the reason off")
# DoD 23: the reads that gave no text are named, without the error text.
rep("const fromNode = (name, f) => { try { const r = f($(name)); if (r == null || (Array.isArray(r) && !r.length)) SENT_ERR.push(name + ': the read returned nothing'); return r; } catch (e) { SENT_ERR.push(name + ': ' + String((e && e.message) || e).slice(0, 300)); return null; } };",
    "// BB-7397 rev 9 DoD 23: a read that gave no text is named by its node only; the error text stays out of the report.\nconst fromNode = (name, f) => { try { const r = f($(name)); if (r == null || (Array.isArray(r) && !r.length)) SENT_ERR.push(name); return r; } catch (e) { SENT_ERR.push(name); return null; } };")
open(P,'w').write(s)
P='new13/Plain_Rule_Lines.js';s=open(P).read()
rep("const md0 = HEAD.replace(/^CLAUSE:\\s*((BROKEN|PARTIAL|HELD)-\\d)\\s*(?:(?:--|—|–)\\s*)?n=(\\d+)\\s+w=(\\d+)\\s+k=(\\d+)\\s*$/gm, (m, code, word, n, w, k) => 'Rule applied: '",
    "// BB-7397 rev 9 DoD 21: the clause counted after a judge's cure (Format Markdown's line), and a judge's own lines quoted under it (\"> \").\nconst md0 = HEAD.replace(/^CLAUSE: ((BROKEN|PARTIAL|HELD)-\\d) -- counted after the judge's cure(?:; retracted: (.*))?$/gm, (m, code, word, rx) => 'Rule applied: ' + word + ', because ' + (WHY[code] || 'the judge applied rule ' + code) + \" (the clause counted after the judge's cure\" + (rx ? '; retracted: ' + rx : '') + ').').replace(/^(> )?CLAUSE:\\s*((BROKEN|PARTIAL|HELD)-\\d)\\s*(?:(?:--|—|–)\\s*)?n=(\\d+)\\s+w=(\\d+)\\s+k=(\\d+)\\s*$/gm, (m, qt, code, word, n, w, k) => (qt || '') + 'Rule applied: '")
open(P,'w').write(s)
print('ok')
