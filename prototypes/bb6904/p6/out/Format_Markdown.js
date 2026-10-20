const r = $('Get Row').first().json;
const J = $('Get Judgments').all().map(i => i.json).filter(j => j && j.judge_seat);
const v = $('Get Verse').first().json;
if (!r || !r.id) throw new Error('No debate_results row for this run_token.');
const NAME = {claude:'Claude',chatgpt:'ChatGPT',gemini:'Gemini',grok:'Grok',mimo:'MiMo',glm:'GLM',qwen:'Qwen',deepseek:'DeepSeek'};
const nm = e => NAME[e] || e || '?';
const ORDER = ['deepseek','gemini','grok','chatgpt','mimo','glm','qwen'];
J.sort((a,b) => ORDER.indexOf(a.judge_seat) - ORDER.indexOf(b.judge_seat));
const oracleSeat = r.defender_profile === 'oracle' ? 'defender' : (r.challenger_profile === 'oracle' ? 'challenger' : null);
const REC = "the record's reading", STD = 'the standard reading';
const dpos = oracleSeat === 'challenger' ? STD : REC;
const cpos = oracleSeat === 'challenger' ? REC : STD;
// Each verdict word grades the defender's chain (engine_manual, the line-1 grade); the label names that side (ORDER M, P5).
const VSIDE = " (a grade of the defender's chain: " + nm(r.defender_engine) + ", arguing " + dpos + ")";
const prof = p => p === 'oracle' ? 'as The Oracle, with the TRUTH framework and the record' : 'plain, without the framework or the record';
const cnt = n => n == null ? 'not counted' : (n === 1 ? '1 link conceded' : n + ' links conceded');
const misrouted = (r.defender_engine === 'mimo' && /\//.test(r.defender_model || '')) || (r.challenger_engine === 'mimo' && /\//.test(r.challenger_model || ''));
let verse = String(v.text || '').replace(/\s*\[[^\]]*:\s*or,[^\]]*\]\s*$/, '').replace(/\[([^\]]+)\]/g, '*$1*').trim();
const date = String(r.created_at || '').slice(0, 10);
// Single judge (also the synthesis analyst): the first engine not seated, never assumed to be DeepSeek.
let SJ = null; try { SJ = $('Init Seats').first().json.single_judge; } catch (e) { SJ = null; }
const jm = String(r.judge_model || '').toLowerCase();
const SJN = SJ ? nm(SJ) : (/^gemini/.test(jm) ? 'Gemini' : /^grok/.test(jm) ? 'Grok' : /^(gpt|chatgpt|o\d)/.test(jm) ? 'ChatGPT' : /deepseek/.test(jm) ? 'DeepSeek' : /mimo/.test(jm) ? 'MiMo' : /glm/.test(jm) ? 'GLM' : /qwen/.test(jm) ? 'Qwen' : '?');
// Reader cleanup (operator order 2026-10-04, Worker_C findings BB-4821 items 1-4).
const demote = x => String(x == null ? '' : x).replace(/^(#{1,6})(?=\s)/gm, h => '#'.repeat(Math.min(6, h.length + 2)));
const noMarkers = x => String(x == null ? '' : x).replace(/^[ \t]*\[(?:EXTRACTOR|AUDIT)\b[^\n]*\][ \t]*$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
// Guards named for the reader (BB-5809 F2, ruling BB-5811 Q1): each DG-number becomes the guard's drift_guards subject, cut at its first ' — ', '; ' or '. ' and at 80 characters, with the number kept in parentheses; in every section.
const GD = {}; try { $('Get Guards').all().forEach(i => { const g = i.json; if (g && g.rule_num != null) GD[g.rule_num] = g.subject; }); } catch (e) { }
const gshort = x => { let y = String(x || '').split(/ — |; |\. /)[0].replace(/[\s.,;:]+$/, '').replace(/^"([^"]*)"$/, '$1').replace(/"/g, "'"); if (y.length > 80) y = y.slice(0, 80).replace(/\s+\S*$/, '') + '...'; return y; };
const gq = n => '"' + gshort(GD[n]) + '"';
const gone = n => GD[n] != null ? 'guard ' + gq(n) + ' (DG-' + n + ')' : 'guard DG-' + n;
const glist = (g, poss) => { const ns = g.match(/\d+/g) || []; if (poss && ns.length === 1) return GD[ns[0]] != null ? gq(ns[0]) + ' guard' + poss + ' (DG-' + ns[0] + ')' : 'guard DG-' + ns[0] + poss; const p = ns.map((n, i) => i ? gone(n).replace(/^guard /, '') : gone(n)); return p.length < 2 ? p.join('') : p.slice(0, -1).join(', ') + ' and ' + p[p.length - 1]; };
const cap = (y, off, str) => (off === 0 || /(^|[.!?]\s+|\n[ \t>*_-]*)$/.test(str.slice(Math.max(0, off - 6), off))) ? y.charAt(0).toUpperCase() + y.slice(1) : y;
// The author's own article and modifier are kept ("a full DG-60 violation" reads "a full guard ... violation"); a number with no article of its own prints the guard's name alone, nothing added (operator ruling "option 1", BB-5836).
const nameOnly = (g, poss) => { const ns = g.match(/\d+/g) || []; if (poss && ns.length === 1) return GD[ns[0]] != null ? gq(ns[0]) + ' guard' + poss + ' (DG-' + ns[0] + ')' : 'DG-' + ns[0] + poss; const one = n => GD[n] != null ? gq(n) + ' (DG-' + n + ')' : 'DG-' + n; const p = ns.map(one); return p.length < 2 ? p.join('') : p.slice(0, -1).join(', ') + ' and ' + p[p.length - 1]; };
const nameGuards = x => String(x == null ? '' : x).replace(/\b(?:(an?|the)(\s+(?:full\s+)?))?(DG-\d+(?:\s*\/\s*DG-\d+)*)(['’]s)?/gi, (m, art, mod, g, poss, off, str) => !art ? nameOnly(g, poss) : cap((/^an$/i.test(art) ? art.charAt(0) : art) + mod + glist(g, poss).replace(/^guard (?=.* and )/, 'guards '), off, str));
// The single judge's diagnostic follows the synthesis behind a marker line (BB-5809 F3); it is printed as its own section, and its [GR1]/[GR2] (the challenger's rounds) read as [DR1]/[DR2] (F6, ruling Q2).
const DIAG_MARK = '--- ORACLE_DEBATE_V1 BROKEN DIAGNOSTIC ---';
const synthParts = x => { let y = String(x == null ? '' : x); const k = y.indexOf('--- ORACLE_DEBATE_V1 CONFIRMATION ---'); if (k > -1) y = y.slice(0, k); const d = y.indexOf(DIAG_MARK); return d > -1 ? [y.slice(0, d), y.slice(d + DIAG_MARK.length)] : [y, null]; };
const synthClean = x => demote(nameGuards(noMarkers(x))).trim();
// The diagnostic model's own tags ([VERDICT], [ACTION], [TENSION], [TENSION-ROW / PRIMARY]; ODV1-25502, 25581, 25634, 25804, 25907) are dropped and the sentence kept:
// an emphasised tag with its emphasis, a tag ending a sentence with the space before it, any other with the space after it. Every other bracket ([L1], [DR1], [CR3], [DG-60], verse margins) stays.
const noDiagTags = x => String(x).replace(/(\*\*|__)\[(?:VERDICT|ACTION|TENSION(?:-ROW[ \t]*\/[ \t]*[A-Z][A-Z ]*[A-Z])?)\]\1[ \t]*/g, '').replace(/[ \t]+\[(?:VERDICT|ACTION|TENSION(?:-ROW[ \t]*\/[ \t]*[A-Z][A-Z ]*[A-Z])?)\](?=[.,;:!?)]|[ \t]*$)/gm, '').replace(/\[(?:VERDICT|ACTION|TENSION(?:-ROW[ \t]*\/[ \t]*[A-Z][A-Z ]*[A-Z])?)\][ \t]*/g, '');
const diagClean = x => synthClean(noDiagTags(String(x).replace(/\[GR([1-3])\]/g, '[DR$1]').replace(/\bGR([1-3])\b/g, 'DR$1')));
// Link-round forfeit (operator-approved 2026-10-04): count the premise list each side filed against the other.
const listCount=(text,re)=>{const s=String(text||'');const g=new RegExp(re.source,'gi');let m,last=-1;while((m=g.exec(s))!==null)last=m.index+m[0].length;if(last<0)return {n:0,missing:true};const tail=s.slice(last);const pc=tail.match(/PREMISE COUNT:\s*\**\s*(\d+)/i);if(pc)return {n:+pc[1],missing:false};return {n:(tail.match(/^\s*[*_]*\s*\d+[.)]\s+\S/gm)||[]).length,missing:false};};
const d={gr2:r.engine_r2,cr3:r.engine_r3};
const vsDef=listCount(d.gr2,/UNSUPPORTED-L4 PREMISES/);const vsCh=listCount(d.cr3,/CHALLENGER.{0,2}S UNSUPPORTED-L4 PREMISES/);const FF=[];
if(vsDef.n===0)FF.push('**Link round forfeited by the challenger:** the challenger listed no claims against the defender, so the defender had nothing to answer in its link round. That round carries no information, and the defender cannot be marked COLLAPSED for it.');
if(vsCh.n===0)FF.push('**Link round forfeited by the defender:** the defender listed no claims against the challenger, so the challenger had nothing to answer in its link round. That round carries no information about the challenger.');

const ONE_RULEBOOK = String(r.created_at || '') >= '2026-10-04T00:33';
const RULES = ONE_RULEBOOK ? '**One rulebook.** All four judgments (the three panel judges and the single judge) apply these same rules.\n\n' : '**Note on this run.** It ran before 4 October 2026, 00:33 UTC. The single judge applied the rules above; the three panel judges were given only the three verdict words and graded by their own judgment, without these counting rules. From that time on, all four judges apply the same rules.\n\n';
// ORDER I (BB-6182, ruling BB-6185 (a)): worked text keyed "reason", not "reasoning" (ODV1-26257, debate_judgments 708), is read under "reason" here and in panelText.
// A panel verdict whose reasoning carries unescaped quotation marks fails JSON.parse (ODV1-25869 Gemini, BB-5827); its six fields, in their fixed order with the reasoning last, are then read by position.
const looseVerdict = s => { const m = String(s).match(/^\{\s*"verdict_tag"\s*:\s*"(\w+)"\s*,\s*"defense_standing"\s*:\s*"([^"]*)"\s*,\s*"challenge_standing"\s*:\s*"([^"]*)"\s*,\s*"conceded_links"\s*:\s*(\d+|null)\s*,\s*"challenger_conceded_links"\s*:\s*(\d+|null)\s*,\s*"reason(?:ing)?"\s*:\s*"([\s\S]*)"\s*\}$/); if (!m) return null; const num = x => x === 'null' ? null : +x; return { verdict_tag: m[1], defense_standing: m[2], challenge_standing: m[3], conceded_links: num(m[4]), challenger_conceded_links: num(m[5]), reasoning: m[6].replace(/\\(n|t|"|\\)/g, (q, c) => c === 'n' ? '\n' : c === 't' ? '\t' : c) }; };
const panelText = raw => { let o = null; const a = String(raw || '').indexOf('{'), b = String(raw || '').lastIndexOf('}'); try { if (a > -1 && b > a) o = JSON.parse(String(raw).slice(a, b + 1)); } catch (e) { o = looseVerdict(String(raw).slice(a, b + 1)); }
  if (!o || typeof o !== 'object' || !o.verdict_tag) return raw ? demote(nameGuards(noMarkers(raw))) : '(no text recorded)';
  return '**Verdict:** ' + o.verdict_tag + VSIDE + '\n\n**Defense standing:** ' + (o.defense_standing || '?') + ', ' + cnt(o.conceded_links) + '\n\n**Challenge standing:** ' + (o.challenge_standing || '?') + ', ' + cnt(o.challenger_conceded_links) + '\n\n' + demote(nameGuards(noMarkers((o.reasoning == null && o.reason != null ? o.reason : o.reasoning) || '(no reasoning given)'))); };
let t = '# TRUTH App Debate\n\n';
// Panel failure notice and run time (operator order 2026-10-08, Worker_A3 thread).
let PF = null; try { if ($('Panel Failure Note').isExecuted) PF = $('Panel Failure Note').first().json; } catch (e) { PF = null; }
if (PF) t += '> **RUN INCOMPLETE: the panel stage failed.** It stopped at node "' + PF.failed_node + '": ' + PF.failed_msg + '\n>\n> The debate rounds, the synthesis and the single judge below are complete and saved. The panel verdict is missing or partial.\n\n';
const ct = x => x.toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
const runTime = () => { let s = null; try { s = $('Init Seats').first().json.t0; } catch (e) { s = null; } const end = new Date(); if (!s) return '**Run time:** not recorded (the run started before the start time was kept).'; const ms = end - new Date(s); const m = Math.floor(ms / 60000), sec = Math.round((ms % 60000) / 1000); let rg = false; try { rg = $('Init Seats').first().json.regrade === true; } catch (e) { rg = false; } if (rg) return '**Run time:** not kept for the original run. The panel stage failed on that run and was re-judged on ' + ct(new Date(s)) + '; the re-judging took ' + m + ' min ' + sec + ' s.'; return '**Run time:** ' + m + ' min ' + sec + ' s (started ' + ct(new Date(s)) + ', transcript written ' + ct(end) + ').'; };
t += '**Topic:** ' + r.topic + '\n\n';
t += '**Defender:** ' + nm(r.defender_engine) + ' (' + (r.defender_model || 'model not recorded') + '), ' + prof(r.defender_profile) + ', arguing ' + dpos + '.\n\n';
t += '**Challenger:** ' + nm(r.challenger_engine) + ' (' + (r.challenger_model || 'model not recorded') + '), ' + prof(r.challenger_profile) + ', arguing ' + cpos + '.\n\n';
if (misrouted) t += '**Note:** MiMo ran through OpenRouter on this run (mis-routed).\n\n';
t += '**Judges:**\n\n';
J.forEach((j, i) => { t += '- Panel judge ' + (i + 1) + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): **' + (j.verdict_tag || '?') + '**' + VSIDE + '\n'; });
if (!J.length) t += '- No panel judgments recorded\n';
t += '- Panel result: **' + (r.panel_verdict || '?') + '**' + (r.panel_split ? ' (' + r.panel_split + ')' : '') + VSIDE + '\n';
t += '- Single judge: ' + SJN + ' (' + (r.judge_model || '') + '): **' + (r.framework_verdict || '?') + '**' + VSIDE + '\n\n';
t += '## Result\n\n| | |\n|---|---|\n';
t += '| Outcome | ' + (r.outcome || 'not recorded') + ' |\n';
t += '| Defense standing (single judge) | ' + (r.defense_standing || 'UNGRADED') + ', ' + cnt(r.conceded_links) + ' |\n';
t += '| Challenge standing (single judge) | ' + (r.challenge_standing || 'UNGRADED') + ', ' + cnt(r.challenger_conceded_links) + ' |\n';
// Panel standings by seat, and review flags from review_notes (operator-approved 2026-10-13, BB-5678).
J.forEach(j => { t += '| Panel judge ' + nm(j.judge_seat) + ' | defense ' + (j.defense_standing || 'UNGRADED') + ', ' + cnt(j.conceded_links) + '; challenge ' + (j.challenge_standing || 'UNGRADED') + ', ' + cnt(j.challenger_conceded_links) + ' |\n'; });
const RVW = String(r.review_notes || '').match(/\[(?:EXTRACTOR|AUDIT) v\d+[^\]\n]*REVIEW THIS ROW[^\]\n]*\]/g) || [];
RVW.forEach(x => { t += '| Review flag | ' + x.slice(1, -1).replace(/\|/g, '\\|') + ' |\n'; });
// Panel judges' review flags (BB-5809 F5): the flag a panel row carries after its JSON.
J.forEach(j => { (String(j.verdict_raw || '').match(/\[(?:EXTRACTOR|AUDIT) v\d+[^\]\n]*REVIEW THIS ROW[^\]\n]*\]/g) || []).forEach(x => { t += '| Review flag (panel judge ' + nm(j.judge_seat) + ') | ' + x.slice(1, -1).replace(/\|/g, '\\|') + ' |\n'; }); });
t += '| Run | ' + (r.run_token || '') + ', ' + date + ' |\n\n';
FF.forEach(x => { t += x + '\n\n'; });
// Citation check against the KJV (item 9): printed from the Quote Report step when it ran.
let QRd = null; try { QRd = $('Quote Report').first().json; } catch (e) { QRd = null; }
if (QRd && !QRd.unavailable && Array.isArray(QRd.items)) {
  const bad = QRd.items.filter(i => i.status && i.status !== 'MATCHES' && i.status !== 'NOT CHECKED');
  const plain = st => /^WORDS ARE AT /.test(st) ? 'the words are at ' + st.slice(13) : /^WORDING NOT FOUND IN /.test(st) ? 'this wording is not in ' + st.slice(21) : 'the cited verse does not exist';
  t += '## Citation check\n\nEvery quotation given with a verse reference was checked against the KJV text: ' + QRd.checked + ' checked, ' + QRd.matches + ' match the verse cited, ' + bad.length + (bad.length === 1 ? ' does not' : ' do not') + (QRd.not_checked ? ', ' + QRd.not_checked + ' too short to check' : '') + '.\n\n';
  bad.forEach(i => { t += '- ' + (i.side === 'DEFENDER' ? 'Defender' : 'Challenger') + ', round ' + String(i.round).replace(/^R/, '') + ': cited ' + i.ref + ' for "' + String(i.quote).slice(0, 200) + '": ' + plain(i.status) + '.\n'; });
  if (bad.length) t += '\n';
  // Nearer reference shown (2026-10-13, WALL-0966 1262 and 1264; part of the quote-checker fix, ruling 4): a match made on the nearer reference written beside the quotation is listed, with the first reference.
  const rb = QRd.items.filter(i => i.status === 'MATCHES' && i.rebound_from);
  if (rb.length) { t += rb.length + (rb.length === 1 ? ' match was' : ' matches were') + ' made on a nearer reference written beside the quotation, after the first reference before it did not match:\n\n'; rb.forEach(i => { t += '- ' + (i.side === 'DEFENDER' ? 'Defender' : 'Challenger') + ', round ' + String(i.round).replace(/^R/, '') + ': "' + String(i.quote).slice(0, 200) + '" matches ' + i.ref + ' (first reference before it: ' + i.rebound_from + ').\n'; }); t += '\n'; }
}
// DEBATE RULE VIOLATIONS (BB-6904 e, step 6): one row per report line the cure check stored in a judge's text (single judge:
// independent_verdict_raw; panel: verdict_raw), read back by its fixed fields. The judge texts above drop these lines (noMarkers).
// DRV_EFFECT states what the report does to the outcome: the operator's ruling on 6904 (d), option 2 (BB-6965).
const DRV_EFFECT = 'A panel judge with any violation not cured is not counted in the panel result; if fewer than two panel judges are counted, the result is ungraded and goes to review. The single judge\'s violations are reported here; the single judge does not set the outcome.';
const DRV_RULE = { 'K-B': 'Two kinds of layer (K-B)', 'K-G1': 'Conceded count (K-G1)', 'K-G3': 'Standing (K-G3)' };
const drvCell = x => String(x == null ? '' : x).replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
const drvRead = (who, raw) => { const rows = []; let prose = false;
  for (const ln of String(raw || '').split('\n')) { const l = ln.trim(); const m = l.match(/^\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- (.*)\]$/);
    if (m) { const p = m[1].split(/(?:^|; )(SEAT|ITEM|RULE|RESULT|KINDS|WHY|LINE|STATEMENT): /); const o = { who }; for (let i = 1; i < p.length; i += 2) o[p[i]] = p[i + 1]; if (o.ITEM && o.RESULT) rows.push(o); continue; }
    if (/^\[AUDIT v21: DEBATE RULE VIOLATION REPLY -- /.test(l)) prose = true; }
  return { rows, prose }; };
const DRV = [drvRead('Single judge: ' + SJN, r.independent_verdict_raw)].concat(J.map(j => drvRead('Panel judge ' + nm(j.judge_seat), j.verdict_raw)));
const DRVR = [].concat(...DRV.map(x => x.rows));
if (DRVR.length) {
  const nc = DRVR.filter(x => x.RESULT === 'CURED').length;
  t += '## Debate rule violations\n\n**Rule B.** A link a judge grades BROKEN must show, on its own line, at least two different kinds of lower layer: [L1] the KJV words quoted, [L2] the Hebrew or Greek word in its own script, with its transliteration marks, or with its Strong\'s number; or [L3] the cross-reference named. A judge whose line did not, or whose counts or standings disagreed with its own BROKEN lines, was asked once to cure it in a fixed form, and the cure was checked by the same count.\n\n';
  t += '**Effect on the verdict.** ' + DRV_EFFECT + '\n\n';
  t += DRVR.length + (DRVR.length === 1 ? ' violation' : ' violations') + ': ' + nc + ' cured, ' + (DRVR.length - nc) + ' not cured.\n\n';
  t += '| Judge | Item | Rule | Result | Original line | Cure statement, or why not cured |\n|---|---|---|---|---|---|\n';
  DRVR.forEach(x => { const last = x.RESULT === 'CURED' ? (x.STATEMENT || x.WHY || '') : ((x.STATEMENT ? x.STATEMENT + ' ' : '') + (x.WHY ? 'Not cured: ' + x.WHY + '.' : 'Not cured.'));
    t += '| ' + drvCell(x.who) + ' | ' + drvCell(x.ITEM) + ' | ' + drvCell(DRV_RULE[x.RULE] || x.RULE) + ' | **' + drvCell(x.RESULT) + '**' + (x.KINDS ? ' (' + drvCell(x.KINDS) + ')' : '') + ' | ' + drvCell(x.LINE || '') + ' | ' + drvCell(last) + ' |\n'; });
  t += '\n';
  const PR = DRV.filter(x => x.prose).map(x => x.rows.length ? x.rows[0].who : null).filter(Boolean);
  if (PR.length) t += 'The reply of ' + PR.join(', ') + ' also held prose. It is recorded in the stored row and was not read for a cure.\n\n';
}
t += '---\n\n';
t += '## How to read this debate\n\n**The method.** Isaiah 28:10 (KJV): "' + verse + '" The case is not one verse; it is verses laid on verses until the point stands. That is how these debates are built and how they are judged.\n\n';
t += '- **[L1] The KJV verse:** the verse itself, quoted exactly.\n- **[L2] Source language:** the Hebrew or Greek behind the English.\n- **[L3] Cross-reference:** what the rest of scripture says.\n- **[L4] Inference:** a conclusion the debater draws from at least two prior layers.\n\n';
t += "**How the case is judged.** To win, the challenger must break the defender's chain, the linked argument the defender builds for the topic. Defeating one isolated verse or term does not break the chain. A chain breaks in one of two ways: the challenger shows from the text that a link is false (a cited verse says the opposite and the defender has no answer), or the defender takes down enough of its own links.\n\n";
t += "**The link round.** The challenger ends its second round, and the defender ends its link round (round 3), by listing up to six of the other side's inferences that it says have no footing. Each side then answers every item on the list against it: SUPPORTED, showing the verses and layers it rests on, or CONCEDED, admitting it has no footing. Only these answers are counted; everything else is argument.\n\n";
t += "**Labels in the judges' texts.** [CR1], [CR2] and [CR3] are the defender's rounds 1 to 3; [DR1], [DR2] and [DR3] are the challenger's. D1, D2 and so on are the links of the defender's declared chain, in its own order; C1, C2 and so on are the claims the defender listed against the challenger, in the order the challenger answered them in [DR3].\n\n";
t += "**How each judge reaches a verdict.** The rules are applied in this order, and the first that fits decides.\n\n- **BROKEN:** the challenger refuted at least one of the defender's declared links from the text, or the defender withdrew more than half of the links it declared, or withdrew its conclusion link (the last link of its chain).\n- **PARTIAL:** the defender withdrew at least one declared link, or its defense standing is COLLAPSED.\n- **HELD:** none of the above.\n\n" + RULES + nameGuards("**What else decides a link.** The judges' rulebook adds four rules, quoted here in its own words.\n\n- **Who-belongs verdicts.** A \"WHO-BELONGS VERDICT -- a claim that a person or a people-group is, or is not, of Israel, in any vocabulary\", and \"an identity closed from circumcision status\", is \"graded UNEXHIBITED whatever its footing, on either side\" (DG-1/DG-60). Not in that class: \"a cross-reference identification of a text's referent or structure held at [L3] and stated as L3 with the census disclaimed\".\n- **UNEXHIBITED.** A link is graded UNEXHIBITED \"when the block asserted the link and offered no layer footing at all\"; it counts as conceded.\n- **VOID.** A premise \"listed without a verbatim quote, or charged in terms stronger than its quote, is VOID -- it counts for neither side, and a CONCEDED answer to a void premise is NOT a concession\".\n- **KEYSTONE.** The keystone is \"the LAST declared link, Dn, which is the conclusion link\": \"WITHDRAWN if it is withdrawn or conceded\". A withdrawn keystone is a withdrawn conclusion link, so the verdict is BROKEN.\n\n");
t += '**What the standings mean.** Both sides are graded the same way, from their link-round answers.\n\n- **SELF-SUPPORTED:** every listed claim shows the layers it stands on (each inference shows at least two prior layers).\n- **PROP-DEPENDENT:** some listed claims were conceded or stood without showing their layers, but not more than half. Those claims do not count.\n- **COLLAPSED:** more than half of the claims the other side listed against it were conceded or left without footing. Exactly half is not COLLAPSED.\n\n---\n\n';
const D = nm(r.defender_engine), C = nm(r.challenger_engine);
const rounds = [['Round 1 - Defender (' + D + ')', r.claude_r1], ['Round 1 - Challenger (' + C + ')', r.engine_r1], ['Round 2 - Defender (' + D + ')', r.claude_r2], ['Round 2 - Challenger (' + C + ')', r.engine_r2], ['Round 3 - Defender (' + D + '): link round', r.engine_r3], ['Round 3 - Challenger (' + C + '): link round', r.challenger_r3]];
rounds.forEach(x => { t += '## ' + x[0] + '\n\n' + (x[1] ? demote(nameGuards(x[1])) : '(not recorded)') + '\n\n---\n\n'; });
const SP = synthParts(r.synthesis);
t += '## Synthesis\n\n**Analyst:** ' + SJN + ', gives no verdict\n\n' + (r.synthesis ? synthClean(SP[0]) : '(not recorded)') + '\n\n---\n\n';
if (SP[1] != null) t += '## Diagnostic\n\n**Analyst:** ' + SJN + ', after the single judge\'s BROKEN verdict\n\n' + diagClean(SP[1]) + '\n\n---\n\n';
J.forEach((j, i) => { t += '## Panel judge ' + (i + 1) + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): ' + (j.verdict_tag || '?') + VSIDE + '\n\n' + panelText(j.verdict_raw) + '\n\n---\n\n'; });
t += '## Single judge: ' + SJN + ' (' + (r.judge_model || '') + '): ' + (r.framework_verdict || '?') + VSIDE + '\n\n' + (r.independent_verdict_raw ? demote(nameGuards(noMarkers(r.independent_verdict_raw))) : '(no text recorded)') + '\n\n' + (PF ? '*Debate incomplete: the panel stage failed (see the notice at the top).*' : '*Debate complete.*') + '\n\n' + runTime() + '\n';
const fileName = (PF ? 'INCOMPLETE - ' : '') + 'Debate [' + D + ' v ' + C + '] - ' + r.topic + ' - ' + date + '.md';
return [{ json: { fileName, md: t, chars: t.length, judges: J.length, run_token: r.run_token } }];

