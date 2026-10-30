const r = $('Get Row').first().json;
const J = $('Get Judgments').all().map(i => i.json).filter(j => j && j.judge_seat);
const v = $('Get Verse').first().json;
if (!r || !r.id) throw new Error('No debate_results row for this run_token.');
const ALTN0 = { alt_minimax31: 'MiniMax M3.1 Flash', alt_minimax3: 'MiniMax M3' }; // the alternates' names, as ALTN below (head line of a removed seat, DoD 25)
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
const RULES = ONE_RULEBOOK ? '**One rulebook.** Every panel judgment applies these same rules.\n\n' : '**Note on this run.** It ran before 4 October 2026, 00:33 UTC. The single judge applied the rules above; the three panel judges were given only the three verdict words and graded by their own judgment, without these counting rules. From that time on, all four judges apply the same rules.\n\n';
// ORDER I (BB-6182, ruling BB-6185 (a)): worked text keyed "reason", not "reasoning" (ODV1-26257, debate_judgments 708), is read under "reason" here and in panelText.
// A panel verdict whose reasoning carries unescaped quotation marks fails JSON.parse (ODV1-25869 Gemini, BB-5827); its six fields, in their fixed order with the reasoning last, are then read by position.
const looseVerdict = s => { const m = String(s).match(/^\{\s*"verdict_tag"\s*:\s*"(\w+)"\s*,\s*"defense_standing"\s*:\s*"([^"]*)"\s*,\s*"challenge_standing"\s*:\s*"([^"]*)"\s*,\s*"conceded_links"\s*:\s*(\d+|null)\s*,\s*"challenger_conceded_links"\s*:\s*(\d+|null)\s*,\s*"reason(?:ing)?"\s*:\s*"([\s\S]*)"\s*\}$/); if (!m) return null; const num = x => x === 'null' ? null : +x; return { verdict_tag: m[1], defense_standing: m[2], challenge_standing: m[3], conceded_links: num(m[4]), challenger_conceded_links: num(m[5]), reasoning: m[6].replace(/\\(n|t|"|\\)/g, (q, c) => c === 'n' ? '\n' : c === 't' ? '\t' : c) }; };
// BB-7397 rev 8 DoD 17: the Verdict and standing lines show the judgment as counted (the stored row's columns, after any cure); where the
// judge's own text differs, its own value is named beside it.
// BB-7397 rev 9 DoD 21: a judgment whose cure changed its verdict (its CORRECTED RESULT line, ORIGINAL not COUNTED) prints the counted clause
// first, then its own RESULT, CLAUSE and KEYSTONE lines, quoted, under one line saying they are its text before the cure.
const curedTo = raw => { const m = String(raw || '').match(/\[AUDIT v21: CORRECTED RESULT -- SEAT: [^;\]]*; ORIGINAL: (\w+); COUNTED: (\w+) \(((?:BROKEN|PARTIAL|HELD)-\d)\)(?:; RETRACTED: ([^\]]*))?\]/); return m && m[1] !== m[2] ? { orig: m[1], counted: m[2], code: m[3], retracted: (m[4] || '').trim() } : null; };
const beforeCure = (txt, c) => { if (!c) return txt; const L = String(txt).split('\n'); const own = /^[ \t*_]*(RESULT|CLAUSE|KEYSTONE)[ \t*_]*:/; const at = L.findIndex(l => own.test(l)); if (at < 0) return txt;
  const mine = L.filter(l => own.test(l)), rest = L.filter(l => !own.test(l)); const head = rest.slice(0, at), tail = rest.slice(at);
  return head.concat(['CLAUSE: ' + c.code + " -- counted after the judge's cure" + (c.retracted ? '; retracted: ' + c.retracted : ''), '', "The judge's own lines before its cure, not counted:", ''], mine.map(l => '> ' + l.trim()), [''], tail).join('\n'); };
const panelText = (raw, j) => { let o = null; const a = String(raw || '').indexOf('{'), b = String(raw || '').lastIndexOf('}'); try { if (a > -1 && b > a) o = JSON.parse(String(raw).slice(a, b + 1)); } catch (e) { o = looseVerdict(String(raw).slice(a, b + 1)); }
  if (!o || typeof o !== 'object' || !o.verdict_tag) return raw ? demote(nameGuards(noMarkers(raw))) : '(no text recorded)';
  const cv = k => (j && j[k] != null && j[k] !== '') ? j[k] : o[k]; const num = x => (x == null || x === '') ? null : +x;
  const wrote = (k, f) => { const a = cv(k), b = o[k]; return (f ? f(a) !== f(b) : a !== b) ? ' (counted after its cure; the judge wrote ' + (b == null ? 'none' : b) + ')' : ''; };
  return '**Verdict:** ' + cv('verdict_tag') + VSIDE + wrote('verdict_tag') + '\n\n**Defense standing:** ' + (cv('defense_standing') || '?') + ', ' + cnt(num(cv('conceded_links'))) + wrote('defense_standing') + wrote('conceded_links', num) + '\n\n**Challenge standing:** ' + (cv('challenge_standing') || '?') + ', ' + cnt(num(cv('challenger_conceded_links'))) + wrote('challenge_standing') + wrote('challenger_conceded_links', num) + '\n\n' + demote(nameGuards(noMarkers(beforeCure((o.reasoning == null && o.reason != null ? o.reason : o.reasoning) || '(no reasoning given)', curedTo(raw))))); };
let t = '# TRUTH App Debate\n\n';
// Panel failure notice and run time (operator order 2026-10-08, Worker_A3 thread).
let PF = null; try { if ($('Panel Failure Note').isExecuted) PF = $('Panel Failure Note').first().json; } catch (e) { PF = null; }
if (PF) t += '> **RUN INCOMPLETE: the panel stage failed.** It stopped at node "' + PF.failed_node + '": ' + PF.failed_msg + '\n>\n> The debate rounds and the synthesis below are complete and saved. The panel verdict is missing or partial.\n\n';
const ct = x => x.toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
const runTime = () => { let s = null; try { s = $('Init Seats').first().json.t0; } catch (e) { s = null; } const end = new Date(); if (!s) return '**Run time:** not recorded (the run started before the start time was kept).'; const ms = end - new Date(s); const m = Math.floor(ms / 60000), sec = Math.round((ms % 60000) / 1000); let rg = false; try { rg = $('Init Seats').first().json.regrade === true; } catch (e) { rg = false; } if (rg) return '**Run time:** not kept for the original run. The panel stage failed on that run and was re-judged on ' + ct(new Date(s)) + '; the re-judging took ' + m + ' min ' + sec + ' s.'; return '**Run time:** ' + m + ' min ' + sec + ' s (started ' + ct(new Date(s)) + ', transcript written ' + ct(end) + ').'; };
t += '**Topic:** ' + r.topic + '\n\n';
t += '**Defender:** ' + nm(r.defender_engine) + ' (' + (r.defender_model || 'model not recorded') + '), ' + prof(r.defender_profile) + ', arguing ' + dpos + '.\n\n';
t += '**Challenger:** ' + nm(r.challenger_engine) + ' (' + (r.challenger_model || 'model not recorded') + '), ' + prof(r.challenger_profile) + ', arguing ' + cpos + '.\n\n';
if (misrouted) t += '**Note:** MiMo ran through OpenRouter on this run (mis-routed).\n\n';
t += '**Judges:**\n\n';
// THE DEBATE FIXED (BB-7397, DoD 1): the panel's verdict is the debate's verdict; the single judge is a SECOND OPINION, its word read from its
// own stored text (a CORRECTED RESULT line first), never from framework_verdict, which now carries the panel's verdict.
const SJV = (() => { const s = String(r.independent_verdict_raw || ''); const c = s.match(/\[AUDIT v21: CORRECTED RESULT -- [^\]]*COUNTED: (HELD|PARTIAL|BROKEN)\b/); if (c) return c[1]; const m = s.replace(/[*_`#>\s]+/g, ' ').trim().match(/^"?\{?[^A-Z]*?\b(HELD|PARTIAL|BROKEN)\b/); return m ? m[1] : null; })();
t += '- Verdict of the debate: ' + (r.panel_verdict ? '**' + r.panel_verdict + '** (the panel)' : '**UNGRADED** (the panel did not finish)') + VSIDE + '\n';
// THE DEBATE FIXED rev 7, DoD 10 (c) (his 1, BB-7504: readers never see the second opinion): each counted seat's verdict with its reason, the
// sentence of its own RESULT line; a seat not in judged_by says so. The single judge's reading is kept in the stored row only.
const seatReason = raw => { const m = String(raw || '').replace(/\\n/g, '\n').match(/RESULT[ \t*_]*:[ \t*_]*(?:DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)[ \t*_]*(?:--|—|–)[ \t]*([^\n"]+)/); return m ? m[1].replace(/\\"/g, '"').trim() : null; };
const COUNTED = Array.isArray(r.judged_by) ? r.judged_by : null;
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
SEATS.forEach(e => { if (e.removed) { const x = e.removed; t += '- Panel judge ' + e.n + ': ' + nm(x.seat) + ' (' + (x.api_model || '') + '): **' + (x.verdict_tag || '?') + '**' + VSIDE + ' (removed: ' + (x.drv_uncured || 0) + ' debate rule violation(s) not cured; not counted; ' + (ALTN0[x.replaced_by] || nm(x.replaced_by)) + ' sat in its place)\n'; return; }
  const j = e.j; const why = curedTo(j.verdict_raw) ? null : seatReason(j.verdict_raw); const counted = !COUNTED || COUNTED.includes(j.judge_seat); t += '- Panel judge ' + e.n + e.tag + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): **' + (j.verdict_tag || '?') + '**' + VSIDE + (counted ? '' : ' (not counted)') + (why ? '. Reason: ' + why : '') + '\n'; });
if (!J.length) t += '- No panel judgments recorded\n';
t += '- Panel result: **' + (r.panel_verdict || '?') + '**' + (r.panel_split ? ' (' + r.panel_split + ')' : '') + VSIDE + '\n';
t += '\n';
// DEBATE RULE VIOLATIONS (BB-6904 e, step 6): one row per report line the cure check stored in a judge's text (single judge:
// independent_verdict_raw; panel: verdict_raw), read back by its fixed fields. The judge texts above drop these lines (noMarkers).
// DRV_EFFECT states what the report does to the outcome: the operator's ruling on 6904 (d), option 2 (BB-6965).
const DRV_EFFECT = 'A panel judge with any violation not cured is not counted in the panel result; if fewer than two panel judges are counted, the result is ungraded and goes to review.';
const DRV_RULE = { 'K-B': 'Two kinds of layer (K-B)', 'K-G1': 'Conceded count (K-G1)', 'K-G3': 'Standing (K-G3)', 'K-G4': 'Pressing sentence (K-G4)', 'K-G6': 'Unanswered premise not counted (K-G6)', 'K-G7': 'BROKEN on a premise the count leaves out (K-G7)', 'K-G8': 'Counted premises list differs from the count (K-G8)' };
const drvCell = x => String(x == null ? '' : x).replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
const drvRead = (who, raw) => { const rows = []; let prose = false;
  for (const ln of String(raw || '').split('\n')) { const l = ln.trim(); const m = l.match(/^\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- (.*)\]$/);
    if (m) { const p = m[1].split(/(?:^|; )(SEAT|ITEM|RULE|RESULT|KINDS|WHY|LINE|STATEMENT|JUDGE STATEMENT): /); const o = { who }; for (let i = 1; i < p.length; i += 2) o[p[i]] = p[i + 1]; if (o.ITEM && o.RESULT) rows.push(o); continue; }
    if (/^\[AUDIT v21: DEBATE RULE VIOLATION REPLY -- /.test(l)) prose = true; }
  return { rows, prose }; };
// A panel seat removed for an uncured violation (drv_removed) keeps its report lines here, labelled removed (BB-7154 finding 1).
const DRV = J.map(j => drvRead('Panel judge ' + nm(j.judge_seat), j.verdict_raw)).concat((Array.isArray(r.drv_removed) ? r.drv_removed : []).map(x => drvRead('Panel judge (removed): ' + nm(x.seat), x.verdict_raw)));
const DRVR = [].concat(...DRV.map(x => x.rows));
// The cure's corrected standing and conceded count, per judge and side, printed beside the stored values in the Result table
// (BB-7154 finding 2, BB-7157). Only CURED rows correct. From BB-7406 (DoD 5) the stored columns carry the correction too; the judge's
// own answer is kept in its text by an AUDIT v21 CORRECTED STANDING line.
const COR = {}; DRVR.filter(x => x.RESULT === 'CURED').forEach(x => { const s = String(x.STATEMENT || ''); const k = x.who;
  let m = s.match(/CORRECTED STANDING: (DEFENDER|CHALLENGER) ([A-Z-]+)/); if (m) { (COR[k + '|' + m[1]] = COR[k + '|' + m[1]] || {}).st = m[2]; }
  m = s.match(/CORRECTED COUNT: (DEFENDER|CHALLENGER) (\d+)/); if (m) { (COR[k + '|' + m[1]] = COR[k + '|' + m[1]] || {}).n = +m[2]; } });
const cor = (who, side) => { const c = COR[who + '|' + side]; if (!c) return ''; const p = []; if (c.st) p.push(c.st); if (c.n != null) p.push(c.n + ' conceded'); return ' (corrected by the cure: ' + p.join(', ') + ')'; };
t += '## Result\n\n| | |\n|---|---|\n';
t += '| Outcome | ' + (r.outcome || 'not recorded') + ' |\n';
// Panel standings by seat, and review flags from review_notes (operator-approved 2026-10-13, BB-5678).
J.forEach(j => { const w = 'Panel judge ' + nm(j.judge_seat); t += '| ' + w + ' | defense ' + (j.defense_standing || 'UNGRADED') + ', ' + cnt(j.conceded_links) + cor(w, 'DEFENDER') + '; challenge ' + (j.challenge_standing || 'UNGRADED') + ', ' + cnt(j.challenger_conceded_links) + cor(w, 'CHALLENGER') + ' |\n'; });
// Panel judges' review flags (BB-5809 F5): the flag a panel row carries after its JSON. A flag whose item that seat's cure REPORT line reads
// CURED is printed as cured, not for review (THE DEBATE FIXED rev 7, DoD 13). The single judge's flags stay in the row (DoD 10 (c)).
const flagKey = x => { let m = x.match(/\((K-G\d)\) -- (D\d+ vs C\d+)/); if (m) return m[1] + '|' + m[2].toUpperCase(); m = x.match(/\((K-G3)\) -- (DEFENSE|CHALLENGE) STANDING/); if (m) return 'K-G3|' + (m[2] === 'DEFENSE' ? 'DEFENDER' : 'CHALLENGER') + ' STANDING';
  m = x.match(/\((K-G6)\) -- ((?:DEFENDER|CHALLENGER) premise \d+)/); if (m) return 'K-G6|' + m[2].toUpperCase(); m = x.match(/\((K-G8)\) -- counted_premises_(defender|challenger)/); if (m) return 'K-G8|' + m[2].toUpperCase() + ' COUNTED PREMISES';
  m = x.match(/VIOLATION -- (D\d+ vs C\d+) /); if (m) return 'K-B|' + m[1].toUpperCase(); return null; };
const curedSet = raw => { const c = new Set(); drvRead('', raw).rows.forEach(o => { if (o.RESULT === 'CURED') c.add(String(o.RULE).trim() + '|' + String(o.ITEM).trim().toUpperCase()); }); return c; };
J.forEach(j => { const cs = curedSet(j.verdict_raw); (String(j.verdict_raw || '').match(/\[(?:EXTRACTOR|AUDIT) v\d+[^\]\n]*REVIEW THIS ROW[^\]\n]*\]/g) || []).filter(x => !/single judge/i.test(x)).forEach(x => { const k = flagKey(x); const cured = k && cs.has(k); t += '| ' + (cured ? 'Cured flag' : 'Review flag') + ' (panel judge ' + nm(j.judge_seat) + ') | ' + (cured ? x.slice(1, -1).replace(/REVIEW THIS ROW\.?/, 'CURED by the seat\'s cure reply; recorded, not for review.') : x.slice(1, -1)).replace(/\|/g, '\\|') + ' |\n'; }); }); // a flag that compares a seat with the single judge (SAME-MODEL DIVERGENCE) stays in the judgment row only (DoD 10 (c))
// BB-7397 rev 9 DoD 26 (2): a collision label off the guide's [DR3] order, recorded by Panel Payloads or Alternate Payloads; not a violation, not counted.
J.forEach(j => { String(j.verdict_raw || '').split('\n').forEach(l => { const m = l.trim().match(/^\[AUDIT v21: C-LABEL OFF THE GUIDE -- (.*)\]$/); if (m) t += '| C-label off the guide (panel judge ' + nm(j.judge_seat) + ') | ' + m[1].replace(/\|/g, '\\|') + ' |\n'; }); });
t += '| Run | ' + (r.run_token || '') + ', ' + date + ' |\n\n';
FF.forEach(x => { t += x + '\n\n'; });
// Citation check against the KJV (item 9): printed from the Quote Report step when it ran.
let QRd = null; try { QRd = $('Quote Report').first().json; } catch (e) { QRd = null; }
if (QRd && !QRd.unavailable && Array.isArray(QRd.items)) {
  const bad = QRd.items.filter(i => i.status && i.status !== 'MATCHES' && i.status !== 'NOT CHECKED');
  const plain = st => /^WORDS ARE AT /.test(st) ? 'the words are at ' + st.slice(13) : /^WORDING DIFFERS FROM /.test(st) ? 'the wording differs from ' + st.slice(21) : /^WORDING NOT FOUND IN /.test(st) ? 'this wording is not in ' + st.slice(21) : 'the cited verse does not exist';
  t += '## Citation check\n\nEvery quotation given with a verse reference was checked against the KJV text: ' + QRd.checked + ' checked, ' + QRd.matches + ' match the verse cited, ' + bad.length + (bad.length === 1 ? ' does not' : ' do not') + (QRd.not_checked ? ', ' + QRd.not_checked + ' too short to check' : '') + '.\n\n';
  bad.forEach(i => { t += '- ' + (i.side === 'DEFENDER' ? 'Defender' : 'Challenger') + ', round ' + String(i.round).replace(/^R/, '') + ': cited ' + i.ref + ' for "' + String(i.quote).slice(0, 200) + '": ' + plain(i.status) + '.\n'; });
  if (bad.length) t += '\n';
  // Nearer reference shown (2026-10-13, WALL-0966 1262 and 1264; part of the quote-checker fix, ruling 4): a match made on the nearer reference written beside the quotation is listed, with the first reference.
  const rb = QRd.items.filter(i => i.status === 'MATCHES' && i.rebound_from && !i.after_first);
  if (rb.length) { t += rb.length + (rb.length === 1 ? ' match was' : ' matches were') + ' made on a nearer reference written beside the quotation, after the first reference before it did not match:\n\n'; rb.forEach(i => { t += '- ' + (i.side === 'DEFENDER' ? 'Defender' : 'Challenger') + ', round ' + String(i.round).replace(/^R/, '') + ': "' + String(i.quote).slice(0, 200) + '" matches ' + i.ref + ' (first reference before it: ' + i.rebound_from + ').\n'; }); t += '\n'; }
  // BB-8172 C1 (BB-8209): the reference written after a quotation is scored first; a match made on the reference before it is listed.
  const ra = QRd.items.filter(i => i.status === 'MATCHES' && i.rebound_from && i.after_first);
  if (ra.length) { t += ra.length + (ra.length === 1 ? ' match was' : ' matches were') + ' made on the reference before the quotation, after the reference written after it did not match:\n\n'; ra.forEach(i => { t += '- ' + (i.side === 'DEFENDER' ? 'Defender' : 'Challenger') + ', round ' + String(i.round).replace(/^R/, '') + ': "' + String(i.quote).slice(0, 200) + '" matches ' + i.ref + ' (reference after it: ' + i.rebound_from + ').\n'; }); t += '\n'; }
}
if (DRVR.length) {
  const nc = DRVR.filter(x => x.RESULT === 'CURED').length;
  t += '## Debate rule violations\n\n**Rule B.** A link a judge grades BROKEN must show, on its own line, at least two different kinds of lower layer: [L1] the KJV words quoted, [L2] the Hebrew or Greek word in its own script, with its transliteration marks, or with its Strong\'s number; or [L3] the cross-reference named. A judge whose line did not, or whose counts or standings disagreed with its own BROKEN lines, was asked once to cure it in a fixed form, and the cure was checked by the same count.\n\n';
  t += '**Effect on the verdict.** ' + DRV_EFFECT + '\n\n';
  t += DRVR.length + (DRVR.length === 1 ? ' violation' : ' violations') + ': ' + nc + ' cured, ' + (DRVR.length - nc) + ' not cured.\n\n';
  t += '| Judge | Item | Rule | Result | Original line | Cure statement, or why not cured | Judge\'s own statement |\n|---|---|---|---|---|---|---|\n';
  DRVR.forEach(x => { const last = x.RESULT === 'CURED' ? (x.STATEMENT || x.WHY || '') : ((x.STATEMENT ? x.STATEMENT + ' -- ' : '') + (x.WHY ? 'Not cured: ' + x.WHY + '.' : 'Not cured.')) // BB-7397 rev 9 DoD 24: ' -- ' sets the reason off;
    t += '| ' + drvCell(x.who) + ' | ' + drvCell(x.ITEM) + ' | ' + drvCell(DRV_RULE[x.RULE] || x.RULE) + ' | **' + drvCell(x.RESULT) + '**' + (x.KINDS ? ' (' + drvCell(x.KINDS) + ')' : '') + ' | ' + drvCell(x.LINE || '') + ' | ' + drvCell(last) + ' | ' + drvCell(x['JUDGE STATEMENT'] || 'not recorded') + ' |\n'; });
  t += '\n';
  const PR = DRV.filter(x => x.prose).map(x => x.rows.length ? x.rows[0].who : null).filter(Boolean);
  if (PR.length) t += 'The reply of ' + PR.join(', ') + ' also held prose. It is recorded in the stored row and was not read for a cure.\n\n';
}
// ALTERNATES (BB-6904 g, step 7): a seat not counted for an uncured violation, and the alternate that sat (stored drv_removed).
const ALTN={alt_minimax31:'MiniMax M3.1 Flash',alt_minimax3:'MiniMax M3'}; // names for the alternates' seat ids (7014 note 4)
const DRM=Array.isArray(r.drv_removed)?r.drv_removed:[];
// BB-7397 rev 8 DoD 16: every alternate tried, from the AUDIT ALTERNATE TRIED lines of the stored judgments and of drv_removed.
const TRIED=[];J.concat(DRM).forEach(j=>String(j.verdict_raw||'').split('\n').forEach(l=>{const m=l.trim().match(/^\[AUDIT v21: ALTERNATE TRIED -- SEAT: ([^;]+); ALTERNATE: ([^;]+); MODEL: ([^;]+); RESULT: ([A-Z ]+?)(?:; WHY: (.*))?\]$/);if(m)TRIED.push({seat:m[1],alt:m[2],model:m[3],result:m[4],why:m[5]||''});}));
if(DRM.length||TRIED.length){t += '## Alternate judges\n\n';DRM.forEach(x=>{t += '- ' + nm(x.seat) + ' was not counted (' + (x.drv_uncured||0) + ' debate rule violation(s) not cured); ' + (ALTN[x.replaced_by]||nm(x.replaced_by)) + ' (' + String(x.replaced_by_model||'') + ') sat in its place.\n';});
 TRIED.forEach(x=>{t += '- ' + nm(x.seat) + ': alternate ' + (x.alt==='none'?'none':(ALTN[x.alt]||nm(x.alt)) + ' (' + x.model + ')') + ' tried, ' + x.result + (x.why ? ': ' + x.why : '') + '.\n';});t += '\n';}
t += '---\n\n';
t += '## How to read this debate\n\n**The method.** Isaiah 28:10 (KJV): "' + verse + '" The case is not one verse; it is verses laid on verses until the point stands. That is how these debates are built and how they are judged.\n\n';
t += '- **[L1] The KJV verse:** the verse itself, quoted exactly.\n- **[L2] Source language:** the Hebrew or Greek behind the English.\n- **[L3] Cross-reference:** what the rest of scripture says.\n- **[L4] Inference:** a conclusion the debater draws from at least two prior layers.\n\n';
t += "**How the case is judged.** To win, the challenger must break the defender's chain, the linked argument the defender builds for the topic. Defeating one isolated verse or term does not break the chain. A chain breaks in one of two ways: the challenger shows from the text that a link is false (a cited verse says the opposite and the defender has no answer), or the defender takes down enough of its own links.\n\n";
t += "**The link round.** The challenger ends its second round, and the defender ends its link round (round 3), by listing up to six of the other side's inferences that it says have no footing. Each side then answers every item on the list against it: SUPPORTED, showing the verses and layers it rests on, or CONCEDED, admitting it has no footing. Only these answers are counted; everything else is argument.\n\n";
t += "**Labels in the judges' texts.** [CR1], [CR2] and [CR3] are the defender's rounds 1 to 3; [DR1], [DR2] and [DR3] are the challenger's. D1, D2 and so on are the links of the defender's declared chain, in its own order; C1, C2 and so on are the claims the defender listed against the challenger, in the order the challenger answered them in [DR3].\n\n";
t += "**How each judge reaches a verdict.** The rules are applied in this order, and the first that fits decides.\n\n- **BROKEN:** the challenger refuted at least one of the defender's declared links from the text, or the defender withdrew more than half of the links it declared, or withdrew its conclusion link (the last link of its chain).\n- **PARTIAL:** the defender withdrew at least one declared link, or its defense standing is COLLAPSED.\n- **HELD:** none of the above.\n\n" + RULES + nameGuards("**What else decides a link.** The judges' rulebook adds three rules, quoted here in its own words.\n\n- **UNEXHIBITED.** A link is graded UNEXHIBITED \"when the block asserted the link and offered no layer footing at all\"; it counts as conceded.\n- **VOID.** A premise \"listed without a verbatim quote, or charged in terms stronger than its quote, is VOID -- it counts for neither side, and a CONCEDED answer to a void premise is NOT a concession\".\n- **KEYSTONE.** The keystone is \"the LAST declared link, Dn, which is the conclusion link\": \"WITHDRAWN if it is withdrawn or conceded\". A withdrawn keystone is a withdrawn conclusion link, so the verdict is BROKEN.\n\n");
t += '**What the standings mean.** Both sides are graded the same way, from their link-round answers.\n\n- **SELF-SUPPORTED:** every listed claim shows the layers it stands on (each inference shows at least two prior layers).\n- **PROP-DEPENDENT:** some listed claims were conceded or stood without showing their layers, but not more than half. Those claims do not count.\n- **COLLAPSED:** more than half of the claims the other side listed against it were conceded or left without footing. Exactly half is not COLLAPSED.\n\n---\n\n';
const D = nm(r.defender_engine), C = nm(r.challenger_engine);
const rounds = [['Round 1 - Defender (' + D + ')', r.claude_r1], ['Round 1 - Challenger (' + C + ')', r.engine_r1], ['Round 2 - Defender (' + D + ')', r.claude_r2], ['Round 2 - Challenger (' + C + ')', r.engine_r2], ['Round 3 - Defender (' + D + '): link round', r.engine_r3], ['Round 3 - Challenger (' + C + '): link round', r.challenger_r3]];
rounds.forEach(x => { t += '## ' + x[0] + '\n\n' + (x[1] ? demote(nameGuards(x[1])) : '(not recorded)') + '\n\n---\n\n'; });
const SP = synthParts(r.synthesis);
t += '## Synthesis\n\n**Analyst:** ' + SJN + ', gives no verdict\n\n' + (r.synthesis ? synthClean(SP[0]) : '(not recorded)') + '\n\n---\n\n';
SEATS.filter(e => e.j).forEach(e => { const j = e.j; t += '## Panel judge ' + e.n + e.tag + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): ' + (j.verdict_tag || '?') + VSIDE + '\n\n' + panelText(j.verdict_raw, j) + '\n\n---\n\n'; });
t += (PF ? '*Debate incomplete: the panel stage failed (see the notice at the top).*' : '*Debate complete.*') + '\n\n' + runTime() + '\n';
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
const SENT_ERR = [];
// BB-7397 rev 9 DoD 23: a read that gave no text is named by its node only; the error text stays out of the report.
const fromNode = (name, f) => { try { const r = f($(name)); if (r == null || (Array.isArray(r) && !r.length)) SENT_ERR.push(name); return r; } catch (e) { SENT_ERR.push(name); return null; } };
const SENT = (() => {
  const calls = [], cures = [];
  const pb = fromNode('Panel Build', x => x.first(0).json);
  if (pb && Array.isArray(pb.judges)) pb.judges.forEach((j, i) => calls.push({ who: 'panel judge ' + (i + 1) + ' ' + nm(j.seat) + ' (' + (j.api_model || '') + ')', m: sentMsgs(j.body) }));
  (fromNode('Reserve Build', x => x.all(0).map(i => i.json)) || []).forEach(j => { if (j && j.body) calls.push({ who: 'reserve judge ' + nm(j.seat) + ' (' + (j.api_model || '') + ')', m: sentMsgs(j.body) }); });
  (fromNode('Alternate Build', x => x.all().map(i => i.json.alt)) || []).forEach(a => { if (a && a.body && !a.skip) calls.push({ who: 'alternate judge ' + nm(a.pool_seat || a.seat) + ' (' + (a.api_model || '') + ') ' + (DRM.some(x => x.replaced_by === a.seat && x.seat === a.removed_seat) ? 'seated for ' + nm(a.removed_seat) : 'sent as alternate for ' + nm(a.removed_seat) + ', not seated'), m: sentMsgs(a.body) }); }); // BB-7397 rev 8 DoD 17
  // Each cure call's reply, read from the Normalize node that follows its build (THE DEBATE FIXED rev 7, DoD 13), matched by caller and seat.
  const REPLY = {}; ['Panel Cure Normalize 1', 'Panel Cure Normalize 2', 'Panel Cure Normalize 3', 'Alternate Cure Normalize'].forEach(n => { try { if (!$(n).isExecuted) return; $(n).all().forEach(i => { const c = i.json && i.json.cure; if (c && c.seat) REPLY[(c.who || '') + '|' + c.seat] = i.json.reply || null; }); } catch (e) { } });
  ['Panel Cure Build 1', 'Panel Cure Build 2', 'Panel Cure Build 3', 'Alternate Cure Build'].forEach(n => {
    (fromNode(n, x => x.all().map(i => i.json.cure)) || []).forEach(c => { if (c && c.body && !c.skip) cures.push({ who: 'Cure call, ' + (c.who === 'alternate' ? 'alternate ' : '') + nm(c.seat) + ' (' + (c.model || '') + ')', m: sentMsgs(c.body), reply: REPLY[(c.who || '') + '|' + c.seat] }); });
  });
  return { calls, cures };
})();
const sentFence = (s) => { let n = 3; (String(s).match(/`{3,}/g) || []).forEach(r => { if (r.length >= n) n = r.length + 1; }); const f = '`'.repeat(n); return f + 'text\n' + s + '\n' + f; };
const sentBlock = (m) => m.map(x => '**' + x.role + ' message** (' + x.text.length + ' characters)\n\n' + sentFence(x.text) + '\n\n').join('');
let s8 = '## What the judges were sent\n\nEvery text the system sent to a judge in this debate, verbatim. Each distinct text is printed once; its heading names every seat and call that received it and gives the md5 of the text (its messages joined in order, UTF-8). A cure call re-sends its judge\'s text with the judge\'s answer and the cure request; those two are printed in full under the cure call, which names the text it followed.\n\n';
const SG = [];
SENT.calls.forEach(c => { if (!c.m) return; const h = MD5(c.m.map(x => x.text).join('')); let g = SG.find(x => x.h === h); if (!g) { g = { h, m: c.m, who: [] }; SG.push(g); } g.who.push(c.who); });
if (SENT_ERR.length) s8 += '*Reads that gave no text:* ' + SENT_ERR.join('; ') + '.\n\n';
if (!SG.length && !SENT.cures.length) s8 += '*Not available: the texts sent to the judges are not in this run.*\n\n';
SG.forEach((g, i) => { s8 += '### Text ' + (i + 1) + ', md5 ' + g.h + '\n\nSent to: ' + g.who.join('; ') + '.\n\n' + sentBlock(g.m); });
SENT.cures.forEach(c => {
  let k = -1, g = null;
  for (let n = c.m.length; n > 0 && !g; n--) { const h = MD5(c.m.slice(0, n).map(x => x.text).join('')); g = SG.find(x => x.h === h) || null; if (g) k = n; }
  s8 += '### ' + c.who + '\n\n';
  if (g) s8 += 'Followed the ' + g.h + ' text above (Text ' + (SG.indexOf(g) + 1) + '), then:\n\n' + sentBlock(c.m.slice(k));
  else s8 += 'md5 ' + MD5(c.m.map(x => x.text).join('')) + '; its opening matches no text above, so the whole call is printed:\n\n' + sentBlock(c.m);
  s8 += (c.reply && c.reply.ok && typeof c.reply.text === 'string') ? '**reply to the cure request** (' + c.reply.text.length + ' characters)\n\n' + sentFence(c.reply.text) + '\n\n' : '*No reply was read: ' + ((c.reply && c.reply.why) || 'the reply was not found') + '.*\n\n';
});
t += '\n---\n\n' + s8;
const fileName = (PF ? 'INCOMPLETE - ' : '') + 'Debate [' + D + ' v ' + C + '] - ' + r.topic + ' - ' + date + '.md';
return [{ json: { fileName, md: t, chars: t.length, judges: J.length, run_token: r.run_token } }];

