import sys
B=sys.argv[1]; p=B+'/new11/Format_Markdown.js'; s=open(p).read()
def sub(old,new,count=1):
    global s
    assert s.count(old)==count,(old[:80],s.count(old)); s=s.replace(old,new)
# PF notice: no single judge on the reader page (DoD 10 (c))
sub("> The debate rounds, the synthesis and the single judge below are complete and saved.","> The debate rounds and the synthesis below are complete and saved.")
# Verdict block: the panel's verdict, then each counted seat with its own RESULT sentence; no second opinion (DoD 10 (c), his 1 of BB-7504).
sub("""t += '- Verdict of the debate: ' + (r.panel_verdict ? '**' + r.panel_verdict + '** (the panel)' : '**UNGRADED** (the panel did not finish)') + VSIDE + '\\n';
J.forEach((j, i) => { t += '- Panel judge ' + (i + 1) + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): **' + (j.verdict_tag || '?') + '**' + VSIDE + '\\n'; });""",
"""t += '- Verdict of the debate: ' + (r.panel_verdict ? '**' + r.panel_verdict + '** (the panel)' : '**UNGRADED** (the panel did not finish)') + VSIDE + '\\n';
// THE DEBATE FIXED rev 7, DoD 10 (c) (his 1, BB-7504: readers never see the second opinion): each counted seat's verdict with its reason, the
// sentence of its own RESULT line; a seat not in judged_by says so. The single judge's reading is kept in the stored row only.
const seatReason = raw => { const m = String(raw || '').replace(/\\\\n/g, '\\n').match(/RESULT[ \\t*_]*:[ \\t*_]*(?:DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)[ \\t*_]*(?:--|—|–)[ \\t]*([^\\n"]+)/); return m ? m[1].replace(/\\\\"/g, '"').trim() : null; };
const COUNTED = Array.isArray(r.judged_by) ? r.judged_by : null;
J.forEach((j, i) => { const why = seatReason(j.verdict_raw); const counted = !COUNTED || COUNTED.includes(j.judge_seat); t += '- Panel judge ' + (i + 1) + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): **' + (j.verdict_tag || '?') + '**' + VSIDE + (counted ? '' : ' (not counted)') + (why ? '. Reason: ' + why : '') + '\\n'; });""")
sub("""t += '- SECOND OPINION (single judge, not the verdict): ' + SJN + ' (' + (r.judge_model || '') + '): **' + (SJV || '?') + '**' + VSIDE + '\\n\\n';""","t += '\\n';")
# Violations: panel and alternate seats only (DoD 10 (c)); the single judge's report lines stay in its stored text.
sub("const DRV_EFFECT = 'A panel judge with any violation not cured is not counted in the panel result; if fewer than two panel judges are counted, the result is ungraded and goes to review. The single judge\\'s violations are reported here; the single judge does not set the outcome.';",
    "const DRV_EFFECT = 'A panel judge with any violation not cured is not counted in the panel result; if fewer than two panel judges are counted, the result is ungraded and goes to review.';")
sub("const DRV = [drvRead('Single judge: ' + SJN, r.independent_verdict_raw)].concat(J.map(j => drvRead('Panel judge ' + nm(j.judge_seat), j.verdict_raw)))",
    "const DRV = J.map(j => drvRead('Panel judge ' + nm(j.judge_seat), j.verdict_raw))")
# Result table: no single-judge rows; panel flags marked CURED when that seat's report line reads CURED (DoD 13).
sub("""t += '| Defense standing (single judge) | ' + (r.defense_standing || 'UNGRADED') + ', ' + cnt(r.conceded_links) + cor('Single judge: ' + SJN, 'DEFENDER') + ' |\\n';
t += '| Challenge standing (single judge) | ' + (r.challenge_standing || 'UNGRADED') + ', ' + cnt(r.challenger_conceded_links) + cor('Single judge: ' + SJN, 'CHALLENGER') + ' |\\n';
""","")
sub("""const RVW = String(r.review_notes || '').match(/\\[(?:EXTRACTOR|AUDIT) v\\d+[^\\]\\n]*REVIEW THIS ROW[^\\]\\n]*\\]/g) || [];
RVW.forEach(x => { t += '| Review flag | ' + x.slice(1, -1).replace(/\\|/g, '\\\\|') + ' |\\n'; });
// Panel judges' review flags (BB-5809 F5): the flag a panel row carries after its JSON.
J.forEach(j => { (String(j.verdict_raw || '').match(/\\[(?:EXTRACTOR|AUDIT) v\\d+[^\\]\\n]*REVIEW THIS ROW[^\\]\\n]*\\]/g) || []).forEach(x => { t += '| Review flag (panel judge ' + nm(j.judge_seat) + ') | ' + x.slice(1, -1).replace(/\\|/g, '\\\\|') + ' |\\n'; }); });""",
"""// Panel judges' review flags (BB-5809 F5): the flag a panel row carries after its JSON. A flag whose item that seat's cure REPORT line reads
// CURED is printed as cured, not for review (THE DEBATE FIXED rev 7, DoD 13). The single judge's flags stay in the row (DoD 10 (c)).
const flagKey = x => { let m = x.match(/\\((K-G\\d)\\) -- (D\\d+ vs C\\d+)/); if (m) return m[1] + '|' + m[2].toUpperCase(); m = x.match(/\\((K-G3)\\) -- (DEFENSE|CHALLENGE) STANDING/); if (m) return 'K-G3|' + (m[2] === 'DEFENSE' ? 'DEFENDER' : 'CHALLENGER') + ' STANDING';
  m = x.match(/\\((K-G6)\\) -- ((?:DEFENDER|CHALLENGER) premise \\d+)/); if (m) return 'K-G6|' + m[2].toUpperCase(); m = x.match(/\\((K-G8)\\) -- counted_premises_(defender|challenger)/); if (m) return 'K-G8|' + m[2].toUpperCase() + ' COUNTED PREMISES';
  m = x.match(/VIOLATION -- (D\\d+ vs C\\d+) /); if (m) return 'K-B|' + m[1].toUpperCase(); return null; };
const curedSet = raw => { const c = new Set(); drvRead('', raw).rows.forEach(o => { if (o.RESULT === 'CURED') c.add(String(o.RULE).trim() + '|' + String(o.ITEM).trim().toUpperCase()); }); return c; };
J.forEach(j => { const cs = curedSet(j.verdict_raw); (String(j.verdict_raw || '').match(/\\[(?:EXTRACTOR|AUDIT) v\\d+[^\\]\\n]*REVIEW THIS ROW[^\\]\\n]*\\]/g) || []).forEach(x => { const k = flagKey(x); const cured = k && cs.has(k); t += '| ' + (cured ? 'Cured flag' : 'Review flag') + ' (panel judge ' + nm(j.judge_seat) + ') | ' + (cured ? x.slice(1, -1).replace(/REVIEW THIS ROW\\.?/, 'CURED by the seat\\'s cure reply; recorded, not for review.') : x.slice(1, -1)).replace(/\\|/g, '\\\\|') + ' |\\n'; }); });""")
# Rules text: no single-judge reference on the reader page.
sub("'**One rulebook.** All four judgments (the three panel judges and the single judge) apply these same rules.\\n\\n'","'**One rulebook.** Every panel judgment applies these same rules.\\n\\n'")
# Diagnostic and second opinion: not printed (DoD 10 (c)); they stay on the row.
sub("""if (SP[1] != null) t += '## Diagnostic\\n\\n**Analyst:** ' + SJN + ', after the single judge\\'s BROKEN second opinion\\n\\n' + diagClean(SP[1]) + '\\n\\n---\\n\\n';
""","")
sub("""t += '## SECOND OPINION (single judge, not the verdict): ' + SJN + ' (' + (r.judge_model || '') + '): ' + (SJV || '?') + VSIDE + '\\n\\n' + (r.independent_verdict_raw ? demote(nameGuards(noMarkers(r.independent_verdict_raw))) : '(no text recorded)') + '\\n\\n' + (PF ?""",
"""t += (PF ?""")
# Section 8: Panel Build and Reserve Build read from output 0 (their output 1 is the error branch to Panel Failure Note, which also reaches this
# node; first() resolved along it and read the empty output, 27795 and 27665). The single judge's text and cure call are not printed (DoD 10 (c)).
sub("""  const sj = fromNode('Build Independent Verdict', x => x.first().json);
  if (sj && sj.verdictBody) calls.push({ who: 'single judge ' + SJN + ' (' + (sj.judge_model || '') + ')', m: sentMsgs(sj.verdictBody) });
  const pb = fromNode('Panel Build', x => x.first().json);""","""  const pb = fromNode('Panel Build', x => x.first(0).json);""")
sub("(fromNode('Reserve Build', x => x.all().map(i => i.json)) || [])","(fromNode('Reserve Build', x => x.all(0).map(i => i.json)) || [])")
sub("""  ['Cure Build', 'Panel Cure Build 1', 'Panel Cure Build 2', 'Panel Cure Build 3', 'Alternate Cure Build'].forEach(n => {
    (fromNode(n, x => x.all().map(i => i.json.cure)) || []).forEach(c => { if (c && c.body && !c.skip) cures.push({ who: 'Cure call, ' + (c.who === 'single' ? 'single judge ' + SJN : (c.who === 'alternate' ? 'alternate ' : '') + nm(c.seat)) + ' (' + (c.model || '') + ')', m: sentMsgs(c.body) }); });
  });""","""  // Each cure call's reply, read from the Normalize node that follows its build (THE DEBATE FIXED rev 7, DoD 13), matched by caller and seat.
  const REPLY = {}; ['Panel Cure Normalize 1', 'Panel Cure Normalize 2', 'Panel Cure Normalize 3', 'Alternate Cure Normalize'].forEach(n => { try { if (!$(n).isExecuted) return; $(n).all().forEach(i => { const c = i.json && i.json.cure; if (c && c.seat) REPLY[(c.who || '') + '|' + c.seat] = i.json.reply || null; }); } catch (e) { } });
  ['Panel Cure Build 1', 'Panel Cure Build 2', 'Panel Cure Build 3', 'Alternate Cure Build'].forEach(n => {
    (fromNode(n, x => x.all().map(i => i.json.cure)) || []).forEach(c => { if (c && c.body && !c.skip) cures.push({ who: 'Cure call, ' + (c.who === 'alternate' ? 'alternate ' : '') + nm(c.seat) + ' (' + (c.model || '') + ')', m: sentMsgs(c.body), reply: REPLY[(c.who || '') + '|' + c.seat] }); });
  });""")
sub("""  else s8 += 'md5 ' + MD5(c.m.map(x => x.text).join('')) + '; its opening matches no text above, so the whole call is printed:\\n\\n' + sentBlock(c.m);
});""","""  else s8 += 'md5 ' + MD5(c.m.map(x => x.text).join('')) + '; its opening matches no text above, so the whole call is printed:\\n\\n' + sentBlock(c.m);
  s8 += (c.reply && c.reply.ok && typeof c.reply.text === 'string') ? '**reply to the cure request** (' + c.reply.text.length + ' characters)\\n\\n' + sentFence(c.reply.text) + '\\n\\n' : '*No reply was read: ' + ((c.reply && c.reply.why) || 'the reply was not found') + '.*\\n\\n';
});""")
open(p,'w').write(s); print('ok')
