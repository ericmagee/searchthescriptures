import json,pickle,re,collections,sys,datetime
sys.path.insert(0,'.')
from helpers import paths,short
from strc import structure,cmp,norm
S=pickle.load(open('S.pkl','rb'));N=S['n']['nodes'];O=S['o']['nodes']
SP=pickle.load(open('special.pkl','rb'))
R=json.load(open('removed.json'));F=json.load(open('free.json'));W1=json.load(open('w1_nodes.json'))
H=pickle.load(open('hits.pkl','rb'));T=pickle.load(open('T.pkl','rb'))
db={k:json.load(open(f'db_{t}.json')) for k,t in [('n','35067'),('o','34852')]}
L=[]
def p(x=''): L.append(x)
def ts(ms): return f'{ms/1000:.1f}s'
def tot(nodes,n): return sum((r['t'] or 0) for r in nodes.get(n,[]))
def dt(a,b): return (datetime.datetime.fromisoformat(b.replace('Z','+00:00'))-datetime.datetime.fromisoformat(a.replace('Z','+00:00'))).total_seconds()
mn,mo=S['n']['meta'],S['o']['meta']
wn,wo=dt(mn['startedAt'],mn['stoppedAt']),dt(mo['startedAt'],mo['stoppedAt'])
nruns_n=sum(len(v) for v in N.values());nruns_o=sum(len(v) for v in O.values())
errn=[(n,i) for n,v in N.items() for i,r in enumerate(v) if r['err'] or r['status']!='success']
erro=[(n,i) for n,v in O.items() for i,r in enumerate(v) if r['err'] or r['status']!='success']
reach=[x for x in W1 if x in N]; nreach=[x for x in W1 if x not in N]
p('# Facts B: pkgDCT first run (run 35067), for W3 grade (extracted by a delegated worker; W3 writes every verdict)')
p()
p('Read-only. Sources: ex35067_full.json, ex34852_full.json, fetchback_live_s130.json / _s127.json, prewrite_s127_DCT.json, W1 list, rows in debate_results / debate_judgments / debate_enforcer_log (SELECTs only). Scripts and intermediates: /tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/g35067b/. No cause is stated anywhere below, only what the text, the code and the rows show.')
p()
p('## 0. Summary of counts')
p(f'- Run 35067: execution status {mn["status"]}, workflowVersionId {mn["workflowVersionId"]}, started {mn["startedAt"]}, stopped {mn["stoppedAt"]}. Run 34852: status {mo["status"]}, version {mo["workflowVersionId"]}.')
p(f'- Nodes that ran in 35067: {len(N)} distinct nodes, {nruns_n} node runs. In 34852: {len(O)} nodes, {nruns_o} runs.')
p(f'- Node runs in error or with executionStatus other than success in 35067: {len(errn)}. In 34852: {len(erro)}. resultData.error in 35067: null; lastNodeExecuted: Raise If Incomplete.')
p('- The jsCode of all 418 nodes in the export workflowData is byte-equal to fetchback_live_s130.json (measured: 0 differences), so the code that ran is s130.')
p(f'- Error-string scan of every string in the 35067 export runData (and nested JSON strings): 0 hits for "is not defined", "ReferenceError", "TypeError", "is not a function", "is not iterable", "Cannot read properties", "[object Object]", and 0 for the word "undefined" and the word "NaN" in node outputs. Same 0 in 34852. DB rows: 0 hits in both runs. Detail in section 2.')
p(f'- 95 W1 nodes: REACHED {len(reach)}, NOT REACHED {len(nreach)} (list in section 4). Of the four W4 special nodes, none reached; of the ten R2 nodes, none reached. Early Alternate Build ran (0 output items). Init with Guards, Accept Build, Accept Final ran, no error.')
p('- Removed names (regex, s126 minus s127, per node): 95 W1 nodes each have a removal list (plus the Shared Library text, which is packed JSON and not runnable; see 3a). Free-variable analysis of the s130 code (acorn + eslint-scope) finds 0 removed names unresolved in any node, and 0 names unresolved in s130 that were not already unresolved in s126.')
p(f'- Run time: 35067 {wn:.1f}s ({wn/60:.1f} min) wall; 34852 {wo:.1f}s ({wo/60:.1f} min) wall.')
p()
p('## 1. Nodes that ran, errors')
p(f'- Nodes in error: {"none" if not errn else errn}. Every one of the {nruns_n} node runs has executionStatus "success" and no error field (measured on every run entry).')
p(f'- Count: {len(N)} distinct nodes ran, {nruns_n} node runs ({sum(1 for v in N.values() if len(v)>1)} nodes ran more than once). The full table (name, runs, status, total execution time) is Appendix A1 at the end of this file.')
only_o=[n for n in O if n not in N]; only_n=[n for n in N if n not in O]
p(f'- Ran in 34852 but not in 35067 ({len(only_o)}): '+'; '.join(only_o)+'.')
p(f'- Ran in 35067 but not in 34852 ({len(only_n)}): '+'; '.join(only_n)+'.')
p()
p('## 2. Error-string scan')
p('Method: every string value in the whole export JSON walked (runData of every node and run, workflowData, top level), and every string that itself parses as JSON walked again (nested JSON). Patterns: "is not defined", "ReferenceError", "TypeError", "is not a function", "is not iterable", "Cannot read propert", "undefined", "[object Object]", "NaN" (word boundary and substring both counted).')
p()
p('| pattern | 35067 node outputs / error fields | 34852 node outputs / error fields | 35067 DB rows | 34852 DB rows |')
p('|---|---|---|---|---|')
for pat in ['is not defined','ReferenceError','TypeError','is not a function','is not iterable','Cannot read properties','undefined (as a word)','[object Object]','NaN (as a word)']:
    p(f'| {pat} | 0 | 0 | 0 | 0 |')
p()
nsub=[h for h in H['n'] if not h[1].startswith('<') and h[0]=='NaN_sub']
p(f'- Substring "NaN" (no word boundary) in 35067 node outputs: {len(nsub)} hits; 0 in 34852. Each sits inside an opaque encrypted token (reasoning_details[].data, a base64-like string, or the response_text that holds the same JSON) in nodes Panel Judges Fetch, Panel Judges Collect, Panel Judge 1/2/3 Route, Panel Judge 1/2 openrouter, Panel Cure Call 1 openrouter. Example (300 chars around the first hit, node Panel Judges Fetch, path .data.main[0][0].json.rows[0].response_text): `{nsub[0][4][:300]}`. These are letters N-a-N inside a random token, not a printed NaN value. Not present in 34852 only because the token text differs per run.')
p(f'- The word "undefined" and the substring "undefined" occur only in workflowData code text (code that tests for undefined): 185 hits in the 35067 export, 184 in 34852, none in any node output or error field. NaN as a word: 1 in workflowData code in each export.')
p('- Fields named error / reply_error / vc_error etc. with a non-empty value in node outputs (walk of all keys): 35067 has 5 distinct (node, path, value) entries, 90 occurrences; 34852 has 5 entries, 20 occurrences. All five are the same string at the same place in both runs: `NOT SENT: the engine\'s closing-contradiction break; a send-back does not undo it (pkgECB)` at Send Back Record .sb_rows[].reply_error, Alternate Merge Seat / Alternate Merge 1 / Alternate Merge / Dry? .enforcer_log[].reply_error. So it is pre-existing text, new only in count (18 each in 35067, 4 each in 34852).')
p('- Saved rows: scan of every column of debate_results (1 row each), debate_judgments (3 rows each) and debate_enforcer_log (469 rows in 35067, 515 in 34852) with a word-boundary regex for all nine patterns: 0 hits in both runs. debate_enforcer_log.reply_error is non-empty in 18 rows (35067) and 4 rows (34852); all 22 hold the NOT SENT string above (seat, kind send_back, rule E-COL).')
p()
p('## 3. The removed names')
p('### 3a. Method')
p('- Names declared per node: regex over `function NAME(` and `(const|let|var) NAME=` on the node source. For the 43 library stub nodes the source is the rebuilt text (the stub\'s own rebuild: lines of the Shared Library listed in that node\'s entry in the MAP, joined by newline; every rebuilt length equals the recorded length, measured for s126, s127 and s130). Removed = declared in s126 (prewrite_s127_DCT.json), not declared in s127 (fetchback_live_s127.json), compared by name per node. A name declared in a nested scope and still declared elsewhere in the node is therefore not listed (name-set comparison).')
p(f'- Result: {len(R["removed"])-1} nodes with a non-empty removed list, 14433 names in total over 96 entries incl. the Shared Library text. The set of 95 equals W1\'s 95 (measured: same names, 0 on either side only), plus the Shared Library node, whose jsCode is the packed library JSON (it does not parse as code: acorn error "Unexpected token (7:24)"); its list (25 names) is an artefact of the regex on packed text and is not a node that runs. Full per-node removed lists: Appendix A3 (long).')
p('- Reference check on s130: (1) acorn parse of every Code node source (176 parsed; the Shared Library is the one that does not) and eslint-scope analysis: every identifier that resolves to no declaration in the node (free variable) is listed. (2) Intersection of each node\'s removed list with its s130 free variables. (3) s130 free variables that were not free in s126.')
p('- Result (2): empty. No removed name is unresolved in the same node\'s s130 code (for stub nodes: in the rebuilt library text). Result (3): empty. The only non-builtin free names in s130 are: `lbFoot` (Build Independent Verdict, Panel Build, D4 Build) and `PRS_LB` (Extract Independent Verdict, Panel Payloads, Cure Normalize/Check, Panel Cure Normalize 1-3/Check, Alternate Payloads/Cure Normalize/Merge Seat, Send Back Build/Record, Gate Build/Record, Alt and R2 siblings): both appear only as `if(typeof lbFoot===\'function\')return lbFoot(b,true);if(typeof PRS_LB===\'function\')...` inside `const foot=(b)=>{try{...`, guarded by typeof; and `DRV_SRC`, `DRV_TL_STOP`, `LB_REF`, `LB_TL` in Send Back Record, Alt Send Back Record, R2 Alt Send Back Record (inside `function lbFoot` of the `MNP` block, e.g. `if(DRV_SRC.test(w)||m[1]||src){met.add(\'L2\');break;}`). Those four are free in s126, s127 and s130 alike (same counts: DRV_SRC 2, LB_TL 1, LB_REF 3, DRV_TL_STOP 4), none is in a removed list. Send Back Record ran in 35067 without error.')
p('- Limits: static analysis does not see names reached by `eval`, `new Function` strings other than the stub rebuild, or property lookups by computed string. NOT CHECKED: dynamic access of that kind.')
p()
p('### 3b. W3\'s older finding: ciRounds, netUnwrap, REFP, ECL')
p('Declared = a `function`/`const|let|var` or any binding in the node source (acorn). Referenced = an identifier use (not a property name). Counts per version for the same node.')
p()
p('| name | node | s126: declared / refs | s127: declared / refs | s130: declared / refs | node ran in 35067 | status |')
p('|---|---|---|---|---|---|---|')
for o in R['old']:
    def c(t):
        x=o[t]
        return f'{"yes" if x.get("declared") else "no"} / {x.get("identRefs")}'
    ran=N.get(o['node'])
    p(f'| {o["name"]} | {o["node"]} | {c("s126")} | {c("s127")} | {c("s130")} | {len(ran) if ran else 0} runs | {ran[0]["status"] if ran else "NOT REACHED"} |')
p()
p('- In s126 each of the four names is referenced once and declared nowhere in the node: `ciRounds`: `function drvLxx(text,ptext){...const L=lxxScan(ciRounds(ptext));...`; `netUnwrap`: `const T=netUnwrap(text).replace(/[*_`]+/g,\'\');`; `REFP`: `const refsIn=t=>{const out=[];try{for(const k of REFP.keys(String(t||\'\'),{scoped:true,cap:12}))out.push(k.key);}catch(e){}return [...new Set(out)];};`; `ECL`: `function setOk(set,ctx){if(!set)return {ok:false,l1:\'NONE\'};try{const c=ECL.check(\'FORCED -- GROUND: \'+N(set),ctx||{});return {ok:c.l1===\'COUNTED\',l1:c.l1};}catch(e){return {ok:false,l1:\'ERROR\'};}}` (each line cut to 200 characters in the machine output).')
p('- In s127 and s130 each of these four names occurs 0 times in those nodes (word-boundary count 0), neither declared nor referenced: the referencing functions (drvLxx, refsIn, setOk) are among the removed names. All 18 referencing node rows (ciRounds 2, netUnwrap 2, REFP 7, ECL 7) are nodes that ran in 35067, 1 run each, status success (table column). None is NOT REACHED.')
p('- Where each name is declared in the s130 code (regex, any node; does not run in the table\'s nodes): ciRounds in 18 entries, netUnwrap in 21, ECL in 10, REFP in 71 (library stub nodes and own-code nodes; the Shared Library text counts as one entry each). None of these declarations is in a node of the table.')
p()
p('## 4. W1 per-node list of 95 nodes')
p(f'REACHED = ran with no error (runs in 35067 shown). NOT REACHED = no run entry in 35067. Counts: REACHED {len(reach)}, NOT REACHED {len(nreach)}.')
p()
p('NOT REACHED (' + str(len(nreach)) + '): ' + '; '.join(nreach) + '.')
p()
p('Of the NOT REACHED list, Alternate Build, Alternate Payloads, Alternate Cure Build and Alternate Cure Normalize had runs in 34852 (1, 1, 1 and 2 runs); QR Ask Build and QR Merge had 0 runs in both runs; the other 14 (4 special nodes and the 10 R2 nodes) had 0 runs in both. In 35067 Alternate Needed? ran once and took its second output (item counts [0,1]).')
p()
p('| # | node | 35067 | runs | 34852 runs |')
p('|---|---|---|---|---|')
for i,x in enumerate(W1,1):
    r=N.get(x)
    p(f'| {i} | {x} | {"REACHED" if r else "NOT REACHED"} | {len(r) if r else 0} | {len(O.get(x,[]))} |')
p()
p('### 4a. Special nodes, own lines')
for x in ['Accept Return Build','Accept DS Return Build','Reserve Build','Failure Salvage']:
    p(f'- {x}: {"REACHED" if x in N else "NOT REACHED"} in 35067 (0 runs); 34852: {len(O.get(x,[]))} runs. The static and AST proof stays the only evidence for it; the stored replays do not count.')
p('- Why the paths were not taken, from the run\'s own data: Reserve Needed? ran once, item counts [0,1] (second output). Accept Return? ran once, [0,1]. No node named Failure Salvage has a run entry.')
p()
p('R2 nodes (all 10 NOT REACHED, 0 runs in both runs): ' + '; '.join(f'{x}: {"REACHED" if x in N else "NOT REACHED"}' for x in ['R2 Alternate Build','R2 Alternate Cure Build','R2 Alternate Cure Normalize','R2 Alternate Merge','R2 Alternate Merge Seat','R2 Alternate Payloads','R2 Alt Gate Build','R2 Alt Gate Record','R2 Alt Send Back Build','R2 Alt Send Back Record'])+'. Their round-1 siblings in 35067: Alternate Merge 1, Alternate Merge Seat, Alt Gate Build, Alt Gate Record, Alt Send Back Build, Alt Send Back Record each REACHED (1 run, success); the siblings Alternate Build, Alternate Payloads, Alternate Cure Build, Alternate Cure Normalize are NOT REACHED. A sibling run is evidence for the shared lines only (W1 point 3).')
p()
p('#### Early Alternate Build (W1: swallows errors)')
pcc=None
import json as _j
x35=_j.load(open('/mnt/project-files/wall2024/ex35067_full.json'))
rd=x35['data']['resultData']['runData']
pc=rd['Panel Cure Check'][0]['data']['main'][0][0]['json']
pays=[_j.loads(b)['payload'] for b in pc['bodies']]
p(f'- Ran: 1 run, status success, {N["Early Alternate Build"][0]["t"]} ms, output items per branch {N["Early Alternate Build"][0]["items"]} (0 items). 34852: 1 run, {O["Early Alternate Build"][0]["t"]} ms, 1 item with keys alt, early (alt.seat haiku for removed seat sol; early.seat_for sol).')
p('- Condition for an early alternate, from the code Alternate Build/Early Alternate Build run (s130 rebuilt source): a seat is a candidate only when its payload has `drv_uncured > 0` (`pay.forEach((p,i)=>{if(!QA&&!((p.drv_uncured||0)>0))return;`); otherwise the node returns `no seat needs an alternate`, which Early Alternate Build filters to no items.')
p('- Input in 35067 (Panel Cure Check output, bodies[].payload.drv_uncured): '+', '.join(f'{q.get("judge_seat")}={q.get("drv_uncured")}' for q in pays)+'. In 34852 the same field was: luna=0, chatgpt=0, sol=1 (a seat sol was a candidate; Early Alternate Build then started haiku). Saved debate_judgments.drv_uncured for 35067: chatgpt 0, luna 0, sol 0.')
p('- So in 35067 the conditions for an early alternate did not arise, no alternate was seated (Alternate Merge Seat output: alternates_seated [], drv_removed [], alternates_tried []; panel_effective [chatgpt, luna, sol]; Alt Seated output bodies [], alt_seats []; Alternate Needed? took its second output; Alternate Build, Alternate Calls?, Early Alternate Start, Get Early Alternate did not run). The empty output is the same output the code returns when nothing needs an alternate; from the output alone a swallowed error cannot be told from this normal empty return (NOT CHECKED: a replay of the rebuilt code on the run\'s input; the node ran 703 ms).')
p()
for nm in ['Init with Guards','Accept Build','Accept Final']:
    p(f'#### {nm}')
    for k,lab in (('n','35067'),('o','34852')):
        its=[x for run in SP[nm][k] for x in run]
        keys=set()
        for x in its: keys|=set(x.keys())
        p(f'- {lab}: {len(SP[nm][k])} run, {len(its)} output item(s); top-level keys: {sorted(keys)}')
    pa=set();pb=set()
    for x in [x for run in SP[nm]['n'] for x in run]: pa|=set(paths(x).keys())
    for x in [x for run in SP[nm]['o'] for x in run]: pb|=set(paths(x).keys())
    p(f'- key paths (depth to 4, array elements merged as []): 35067 {len(pa)}, 34852 {len(pb)}; lost in 35067: {sorted(pb-pa)}; gained in 35067: {sorted(pa-pb)}')
    for k,lab in (('n','35067'),):
        its=[x for run in SP[nm][k] for x in run]
        emp={}
        for ii,x in enumerate(its):
            for pp,t in paths(x).items():
                if t in('null','emptystr','[]empty','{}empty'): emp.setdefault(pp,[]).append(ii)
        p(f'- empty or null values in 35067 (path: items): '+('; '.join(f'{q} ({"null" if False else ""}items {v[:6]})' for q,v in emp.items()) or 'none'))
    its=[x for run in SP[nm]['o'] for x in run]
    emp={}
    for ii,x in enumerate(its):
        for pp,t in paths(x).items():
            if t in('null','emptystr','[]empty','{}empty'): emp.setdefault(pp,[]).append(ii)
    p('- empty or null values in 34852: '+('; '.join(f'{q}' for q in emp) or 'none'))
    its=[x for run in SP[nm]['n'] for x in run]
    sh=short(its[0] if nm!='Accept Build' else its[:2],110)
    p('- output (35067, first item'+('s' if nm=='Accept Build' else '')+', strings cut to 110 chars): `'+json.dumps(sh,ensure_ascii=False)[:2600]+'`')
    p()
p('Accept Build nested difference: key path .acc.body.temperature exists in 35067 only (some of its 6 items carry a body temperature; the 4 items of 34852 do not).')
p('Reading: for Init with Guards and Accept Final the key sets are identical to 34852 and the empty values are identical in place (d_served, d_named, rc_linked, sheet_req, sheet_off_url; acc.seats[].faults, return_faults, return_text, return_status; src.params, src.query). Accept Build: same two top-level keys (acc, ds) in both runs; ds is null in every item in both runs; 6 items in 35067 against 4 in 34852 (Accept Models gave 17 items against 16). NOT CHECKED: whether those null values are meaningful; only that they match 34852.')
p()
p('## 5. Saved debate, field comparison (35067 against 34852)')
p('Rows: debate_results id 359389a6-0c95-469d-b85e-e691b205eb7c (run_token ODV1-35067-z8obkqib, created 2026-11-11 15:21:55 UTC) and id acb918e5-9436-4336-af41-e47ccd1535db (ODV1-34852-azssrnkg, created 01:22:51 UTC). Same topic text in both ("Did Christ have a biological father?").')
p('### 5a. debate_results, every column (79 columns read)')
p('Filled in both (value may differ): id, debate_date, engine, variant, topic, guards_loaded, claude_r1, engine_r1, claude_r2, engine_r2, synthesis, framework_verdict, created_at, claude_model, engine_model, input_tokens, output_tokens, cache_write_tokens, cache_read_tokens, independent_verdict_raw, data_class, review_notes, engine_r3, defense_standing, conceded_links, challenge_standing, challenger_conceded_links, challenger_r3, judge_model, out_of_round_concessions, out_of_round_detail, challenger_chain_mark, outcome, panel_split, judged_by (3), panel_expected (3), panel_verdict, panel_fingerprint, run_token, defender_engine, defender_model, defender_profile, challenger_engine, challenger_model, challenger_profile, challenger_served (29 items), citation_check (7 keys: items, checked, matches, scanned, item_cap, mismatches, not_checked), defender_chain_mark, defender_r4, challenger_r4, conceded_split (3 keys), underdetermined_seats.')
p('NULL in both (not a loss): citation_block, engine_model_reported, engine_prompt_tokens, engine_response_id, engine_service_tier, judge_inference_geo, judge_message_id, judge_model_reported, judge_service_tier, panel_substitution, patterns_briefed, quarantine_reason. Empty array in both: defender_served (0 items).')
p('Empty or NULL in 35067 where 34852 had a value: exactly one column.')
p('- drv_removed: NULL in 35067; 34852 a JSON array of 1 object (seat luna removed, replaced_by haiku, drv_uncured 2, E-GATE CONTRADICTION x2). Does the path that fills it run in 35067? Yes: Alternate Merge Seat and Alternate Merge ran and output drv_removed = [] (alternates_seated [], alternates_tried []); Record Substitution ran ({ok:true, written:false}); Record Alternates ran ({ok:true, written:false}, in 34852 written:true with panel_expected). No seat had drv_uncured > 0 (Panel Cure Check, all 0), so there was nothing to record. Not a missing field by this evidence; the row is NULL because [] was written as nothing.')
p('New in 35067 (filled where 34852 was empty): none among columns. Value-level differences that are not emptiness: conceded_links 0 (34852: 4), panel_split "3-0" (34852 "1-0 (2 not counted: debate rule)"), framework_verdict/panel_verdict BROKEN (34852 CONTESTED), outcome CHALLENGER PREVAILS (34852 "UNGRADED - REVIEW"), defense_standing PROP-DEPENDENT (34852 COLLAPSED), underdetermined_seats 3 items {chatgpt,luna,sol}:COLLISION (34852 1 item haiku:COLLISION), out_of_round_concessions 18 (34852 8), conceded_split.defender all zeros (34852 stated 1, stored 1, unexhibited 1).')
p('### 5b. debate_judgments (3 rows each; per-column fill count)')
p('Every column filled in 3 of 3 rows in both runs: id, debate_id, judge_seat, judge_api_model, verdict_raw, verdict_tag, defense_standing, conceded_links, challenge_standing, challenger_conceded_links, finish_reason, truncated, created_at, drv_uncured, conceded_split. Empty or NULL in 35067 where 34852 had a value: none. Seats 35067: chatgpt, luna, sol (all BROKEN, drv_uncured 0, finish_reason stop, truncated false). Seats 34852: chatgpt, haiku, sol.')
p('### 5c. debate_enforcer_log (rows: 469 in 35067, 515 in 34852; column filled counts, 35067 / 34852)')
p('id 469/515; debate_id 469/515; run_token 469/515; seat 469/515; seat_role 469/515; kind 469/515; item 469/515; created_at 469/515; cure_reason 469/514; rule 469/514; at 459/509; judge_model 442/504; flagged_line 446/502; response_line 445/498; cure_status 142/202; prompt_sent 138/157; full_reply 138/158; reply_error 18/4. Empty or NULL in 35067 where 34852 had a value (column level): none; every column has fills in 35067. Rows by kind (35067 / 34852): alternate_reply 0/1, cure 114/136, enforcer_check 289/296, send_back 66/82. The one kind missing in 35067 (alternate_reply) is written by the alternate call path, which did not run (Alternate Call openrouter has no run entry in 35067).')
p()
p('### 5d. Saved synthesis and Build Save Body: lost functions')
p('- Build Save Body lost `note` (2 declarations), `U`, `noteD`, `score`, `noteR`, `noteL`, `noteP` in the trim. In the s126 source, call sites in Build Save Body (regex `NAME(` not preceded by a dot or word character): `U` 2 (inside the removed `note` and `noteD`), `noteL` 1 (inside the removed `noteP`), `note`, `noteD`, `score`, `noteR`, `noteP` 0. So within Build Save Body the removed notes were only reachable from each other (measured on s126 text).')
p('- The label strings those functions printed: `[LINK-ROUND FORMAT CHECK`, `[CLOSE-ROUND PRESS CHECK`, `[CLOSE-ROUND NEW-VERSE CHECK`, `[CLOSE-ROUND BOOK CHECK`, `[CLOSE-ROUND NUMBERING CHECK`, `[CLOSE-ROUND GRADING CHECK`. Counts of each in the Build Save Body output item (35067 / 34852): LINK-ROUND FORMAT 0/0; PRESS CHECK 0/2; NEW-VERSE 0/0; BOOK 0/0; NUMBERING 0/0; GRADING 2/2. In the saved synthesis column all six are 0/0 in both runs. In review_notes: PRESS CHECK 0/1, GRADING 2/2, others 0/0.')
p('- The one difference is `[CLOSE-ROUND PRESS CHECK`, present in 34852 (in the verdictBody prompt text, inside the Build Save Body output, and `[AUDIT v24: CLOSE-ROUND PRESS CHECK (C4) ...John 6:42` in review_notes) and absent in 35067. In s130 the same label string is still written by `note`/`of`/`fresh` inside Build Synthesis, Build Independent Verdict, Panel Build, Format Markdown and Build Save Body (declared there, measured). In 34852 the first node whose output holds the string is Build Synthesis (start 1794359855818), not a node whose function was trimmed. The condition, per the code (`fresh([gr1,gr2,dr3], DR4 text)`): a verse in DR4 not named in an earlier challenger round. In 35067 the two references my rough regex finds in DR4 and not in GR1/GR2/DR3 (Luke 1:35, Romans 1:4) are both named in earlier challenger text (Luke 1:35 in GR1 position 9205, GR2, DR3; Romans 1:3-4 in DR3 position 11840), by text search. NOT CHECKED: a replay of `fresh` on the run text.')
p('- Other trimmed `note`-type functions in D4 Build, D4 Extract, C4 Build, C4 Extract, C4G Extract, D4B Extract, C4B Extract carried the same label string in s126 and not in s130; in 34852 no output of those nodes was the first to hold the string (the first holder by start time is Build Synthesis).')
p('- pkgSYL (confirmed closing contradiction line): the Build Save Body output `synthesis` field has 9906 chars and the saved row has 10697. The saved row holds two added lines, `**ENGINE: D1 BROKEN** -- confirmed closing contradiction (X3): ... Added by code after the closing check.` and `**ENGINE: D4 BROKEN** -- ... (X4)`; they are present in Build Save Body.saveBody (the string occurs 2 times in Build Save Body, Get Row, Format Markdown and Plain Rule Lines outputs). In 34852 the row equals the output field (11703 chars) and has none.')
p()
p('### 5e. Structure comparison (headings, table headers, labelled lines), 35067 against 34852')
p('Method: regex per line. Heading = line starting with 1-6 `#`; table header = a `|` line whose next line is a `|---` separator; labelled line = a line whose first words (up to 60 chars) end in a colon, plus `[AUDIT vNN: ...` bracket labels and `**ENGINE: Dn ...**`. Digits normalised to N. Text produced by a model (synthesis, rounds) changes its headings from debate to debate; engine-generated labels are the ones to read.')
p()
bsbn=T['Build Save Body']['n'][0][0];bsbo=T['Build Save Body']['o'][0][0]
for name,(x,y) in {'saved synthesis (debate_results.synthesis)':(db['n']['synthesis'],db['o']['synthesis']),'Build Save Body diagnostic field':(bsbn['diagnostic'],bsbo['diagnostic']),'Build Save Body synthesis field':(bsbn['synthesis'],bsbo['synthesis'])}.items():
    out=[f'{name}: 35067 {len(x)} chars, 34852 {len(y)} chars']
    ha,ta,la=structure(x);hb,tb,lb=structure(y)
    cmp(ha,hb,'headings',out);cmp(ta,tb,'table header rows',out);cmp(la,lb,'labelled lines',out)
    p('```');L.extend(out);p('```')
p('Reading: the synthesis and the diagnostic are model-written. The table `| Link | Link-round status | Press and close-round response |` and the `Status key` line are in the 34852 synthesis and not in 35067; no note or score line from the trimmed functions is among the labels (see 5d); the two `**ENGINE: Dn BROKEN**` lines are new in 35067 (pkgSYL).')
p()
p('Format Markdown (md output, level 1 and 2 headings only, distinct, digits normalised; 35067 md 1248137 chars, 34852 md 1500249 chars):')
fa=T['Format Markdown']['n'][0][0]['md'];fb=T['Format Markdown']['o'][0][0]['md']
def h12(t): return [norm(m.group(1)) for m in re.finditer(r'^(#{1,2}\s.*)$',t,re.M)]
a,b=h12(fa),h12(fb)
sa,sb=set(a),set(b)
p(f'- level 1-2 headings: 35067 {len(a)} ({len(sa)} distinct), 34852 {len(b)} ({len(sb)} distinct).')
for x in [y for y in dict.fromkeys(b) if y not in sa]: p(f'  - in 34852 only: {x}')
for x in [y for y in dict.fromkeys(a) if y not in sb]: p(f'  - in 35067 only: {x}')
p('- Engine sections: `## Citation check of the synthesis` (34852 only) is written only when Quote Report.synthesis.checked is non-zero (code: `if (QRd && QRd.synthesis && QRd.synthesis.checked)`); Quote Report.synthesis.checked is 0 in 35067 and 5 in 34852. `## Alternate judges` (34852 only) is written only when drv_removed or an ALTERNATE TRIED audit line exists (code: `if(DRM.length||TRIED.length)`); drv_removed is [] in 35067. All other engine headings (Result, Citation check, Debate rule violations, Enforcer send-back, How to read this debate, Round 1..4, Synthesis, Panel judge n, What the judges were sent) are in both. The panel judge headings differ in seat names only (35067: luna, sol, ChatGPT; 34852: Claude Haiku, sol, ChatGPT).')
p()
p('Citation Scan and Quote Report, Build Save Body: key-path structure (union over all array elements, depth unlimited).')
def kp(o,pre='',out=None):
    out=out if out is not None else set()
    if isinstance(o,dict):
        for k,v in o.items(): out.add(pre+'.'+k); kp(v,pre+'.'+k,out)
    elif isinstance(o,list):
        for v in o: kp(v,pre+'[]',out)
    return out
for nm in ['Citation Scan','Quote Report','Build Save Body']:
    a=kp(T[nm]['n'][0][0]);b=kp(T[nm]['o'][0][0])
    p(f'- {nm}: key paths 35067 {len(a)}, 34852 {len(b)}; in 34852 only: {sorted(b-a) or "none"}; in 35067 only: {sorted(a-b) or "none"}')
p()
p('## 6. Output shape: first output item key set, nodes that ran in both runs')
both=[n for n in N if n in O]
diff=[]
for n in both:
    a=N[n][0]['fk'];b=O[n][0]['fk']
    if a!=b: diff.append((n,N[n][0],O[n][0]))
p(f'Nodes that ran in both: {len(both)}. Key set of the first item (first non-empty output branch of the first run entry) differs in {len(diff)}. Nodes with no output item in 35067 but one in 34852 are listed too. A lost key is "in 34852, not in 35067".')
p()
p('| node | branch 35067 / 34852 | keys lost | keys gained | note |')
p('|---|---|---|---|---|')
notes={'Panel Cure Normalize 1':'FUM path not taken in 35067 (FUM Needed? Panel 1 took second output)','Panel Cure Normalize 2':'same','FUM Needed? Panel 1':'same','FUM Needed? Panel 2':'same','Early Alternate Build':'0 items, see 4a','Record Alternates':'panel_expected is written only when something was recorded (written true in 34852)','Alternate Merge 1':'alt_apply only when an alternate was seated','Alternate Merge':'same','Dry?':'same'}
for n,a,b in diff:
    if a['fk'] is None or b['fk'] is None:
        p(f'| {n} | {a["br"]} / {b["br"]} | {"all (no item)" if a["fk"] is None else "none"} | {"none" if a["fk"] is None else "all"} | {notes.get(n,"")} |')
    else:
        A,B=set(a['fk']),set(b['fk'])
        p(f'| {n} | {a["br"]} / {b["br"]} | {", ".join(sorted(B-A)) or "none"} | {", ".join(sorted(A-B)) or "none"} | {notes.get(n,"output branch differs (path taken differs); not traced node by node")} |')
p()
p('Reading: most differences come with a different output branch (35067 / 34852 branch column) or a path that ran in one run only (alternate path, FUM path, Assume Check call), so the key set is of a different branch\'s item. Lost keys on a same-branch node: L2 Counts (gained book, chapter, strongs_number, verse only), Assume Check Build (lost why, gained body, model: in 35067 the assume check was called, in 34852 skipped with a why; Assume Check Call deepseek ran only in 35067), Panel Cure Normalize 1 and 2 (lost fum), Alt Judge Enforcer Build, Alt Send Back Build, Alt Reread Build (alternate-seat path, did not run in 35067), Alternate Merge 1 / Alternate Merge (lost alt_apply), Record Alternates (lost panel_expected). NOT CHECKED: whether each lost key is expected for the branch taken; only that each lost key is on a path that did not carry the same input in 35067 (no seat removed, no FUM on panels 1 and 2).')
p()
p('## 7. Run time')
def top10(nodes):
    L2=sorted(((tot(nodes,n),n,len(v)) for n,v in nodes.items()),reverse=True)[:10]
    return L2
p(f'- 35067: wall {wn:.1f}s ({wn/60:.1f} min), sum of node execution times {sum(tot(N,n) for n in N)/1000:.1f}s. 34852: wall {wo:.1f}s ({wo/60:.1f} min), sum of node execution times {sum(tot(O,n) for n in O)/1000:.1f}s. Both are wall from startedAt to stoppedAt. 35067 is {wo-wn:.1f}s shorter; the runs differ in the alternate path (23 nodes ran only in 34852), so it is not a like-for-like comparison of the trimmed code.')
p()
p('Ten slowest nodes by total execution time (sum over the node\'s runs), 35067:')
p('| rank | node | runs | total |'); p('|---|---|---|---|')
for i,(t,n,c) in enumerate(top10(N),1): p(f'| {i} | {n} | {c} | {ts(t)} |')
p()
p('Ten slowest nodes, 34852:')
p('| rank | node | runs | total |'); p('|---|---|---|---|')
for i,(t,n,c) in enumerate(top10(O),1): p(f'| {i} | {n} | {c} | {ts(t)} |')
p()
p('The ten slowest are model-call or wait nodes by name in both runs (not Code nodes); the slowest Code nodes of 35067 among the 95: ' + '; '.join(f'{n} {ts(tot(N,n))}' for n in sorted([x for x in W1 if x in N],key=lambda z:-tot(N,z))[:5]) + ' (34852: '+'; '.join(f'{n} {ts(tot(O,n))}' for n in sorted([x for x in W1 if x in O],key=lambda z:-tot(O,z))[:5])+').')
p()
p('## What I could not check (NOT CHECKED)')
p('- Whether any model-written text (synthesis, diagnostic, rounds) is wrong in content; only structure and counts were compared.')
p('- A replay of the s130 rebuilt code on 35067 input (to separate a swallowed error in Early Alternate Build from a normal empty return); only the code condition and the run\'s drv_uncured values were read.')
p('- Dynamic name access (eval, computed property lookups) in the node code; static free-variable analysis only.')
p('- The 20 + 4 nodes that did not run (section 4): no evidence beyond static analysis.')
p('- Per-node trace of each key-set difference in section 6.')
p('- debate rows outside the three tables (replay rows, other tables).')
p()
p('---')
p('## Appendix A1. Every node that ran in 35067 (name, runs, status, total execution time), count '+str(len(N)))
p('| # | node | runs | status | total ms |'); p('|---|---|---|---|---|')
for i,n in enumerate(sorted(N),1):
    v=N[n];st=','.join(sorted({r["status"] for r in v}))
    p(f'| {i} | {n} | {len(v)} | {st} | {tot(N,n)} |')
p()
p(f'Count: {len(N)} nodes, {nruns_n} runs.')
p()
p('## Appendix A3. Removed names per node (regex: `function NAME(` and `(const|let|var) NAME=`; declared in s126, not declared in s127; sorted)')
for n,v in R['removed'].items():
    p(f'- {n} ({"stub, rebuilt text" if v["stub"] else "own code"}; {len(v["removed"])} names): '+', '.join(v['removed']))
open('/mnt/project-files/w3/grade_35067/facts_B_dct.md','w').write('\n'.join(L))
print(len('\n'.join(L)))
