import json,re,sys,io
_o=sys.stdout; sys.stdout=io.StringIO()
from an3 import V,EA,sections,row,st
from an2 import ROUND,strip,nm
from cmp import parse
sys.stdout=_o
W=[]
def p(s=''): W.append(s)
ids={y['id']:y for c in st for y in c['json']['ids']}
call=json.load(open('nodes/Judge_Enforcer_Call_deepseek.json'))[0]['data']['main'][0]
# parse DS lines
DS={}
for i,x in enumerate(call):
    for l in x['json']['choices'][0]['message']['content'].split('\n'):
        m=re.match(r'ENFORCER:\s*(\S+)\s*--\s*(\w[\w ]*?)\s*--',l)
        if m: DS[m.group(1)]=(m.group(2),l,i+1)
rec=json.load(open('nodes/Judge_Enforcer_Record.json'))[0]['data']['main'][0][0]['json']
sb=json.load(open('nodes/Send_Back_Record.json'))[0]['data']['main'][0][0]['json']
sbc=json.load(open('nodes/Send_Back_Call_openrouter.json'))[0]['data']['main'][0]
jdg=json.load(open('jdg_clean.json'))
p('# Facts C, answer check (rule E-ANS), live run 35067')
p()
p('Facts only. No verdicts. Source: execution export /mnt/project-files/wall2024/ex35067_full.json (status success, started 2026-11-11T14:56:21Z, stopped 15:39:57Z), live code /mnt/project-files/wall2024/fetchback_live_s127/s128/s129/s130.json, database rows of run token ODV1-35067-z8obkqib (debate id 359389a6-0c95-469d-b85e-e691b205eb7c). Scripts: /tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/g35067c/ (harness.cjs, cmp.py, an2.py to an5.py, gen2.py). No database write, no n8n call, no model call.')
p()
p('Version fact: the workflow stored inside the export (workflowData) has a Shared Library node of 863,990 characters with the same sha256 prefix (6227f1eccc42) as the Shared Library in fetchback_live_s129 and fetchback_live_s130, and a Close Enforcer Build node of 8,283 characters with the same hash (a529aa1360bf) as s130 (s129 has 6,129 characters there, hash 0696aa058012). The export has no versionId field. By content the run executed s130 code. Node stubs of Judge Enforcer Build, Alt Judge Enforcer Build and R2 Alt Judge Enforcer Build are identical in s127 to s130 (hashes 9e510783a2bc, 3820823fbc1b, 2fcd6b7ca23b); the code sits in the Shared Library.')
p()
p('Rebuild check: the s130 rebuild of Judge Enforcer Build on this run\'s stored upstream outputs equals the stored output (all 8 request bodies, ids, counts, not_checked equal). So the s127, s128 and s129 rebuilds below use the same harness.')
p()
# ---------- 1
p('## 1. Check calls built, per node run')
p()
p('| Node | Ran | Output |')
p('|---|---|---|')
p('| Judge Enforcer Build | 1 run (executionTime 1084 ms) | je_skip false, 8 check calls (call 1 of 8 to call 8 of 8), model deepseek-flash, not_checked [] (0 entries), counts: ans_items 117, ans_grades 139, void_items 1, void_rulings 1 |')
p('| Alt Judge Enforcer Build | 1 run | je_skip true, why "no panel judgment text", items [] (0 calls); alt_needed false in Judge Enforcer Record |')
p('| R2 Alt Judge Enforcer Build | NOT REACHED: no entry in runData (node did not run in this execution) | none |')
p()
p('Cap: MAX_CALLS=10 and CALL_CHARS=40000 in the Judge Enforcer Build source (s128 and s130). Calls built 8; cap of 10 not reached. A single call may exceed CALL_CHARS (stored user texts 25,501 to 52,907 characters, see below).')
p()
p('Judge Enforcer Build, stored output, per call (system text is the same 14,035 characters in every call):')
p()
p('| Call | User text chars | Ids (grades) in call | Rules in call | DeepSeek reply chars | ENFORCER lines in reply | NO ANSWER in reply | prompt_tokens / completion_tokens | finish |')
p('|---|---|---|---|---|---|---|---|---|')
from collections import Counter
for i,(x,c) in enumerate(zip(st,call)):
    j=x['json']; u=j['body']['messages'][1]['content']; m=c['json']['choices'][0]['message']['content']
    rc=Counter(y['rule'] for y in j['ids'])
    nl=len([l for l in m.split('\n') if l.startswith('ENFORCER')])
    p('| %d | %d | %d | %s | %d | %d | %d | %d / %d | %s |'%(i+1,len(u),len(j['ids']),', '.join('%s %d'%(k,v) for k,v in rc.items()),len(m),nl,m.count('NO ANSWER'),c['json']['usage']['prompt_tokens'],c['json']['usage']['completion_tokens'],c['json']['choices'][0]['finish_reason']))
p()
tu=sum(len(x['json']['body']['messages'][1]['content']) for x in st)
p('Totals: user text %d characters over 8 calls (largest 52,907, call 3; smallest 25,501, call 8); system text 8 x 14,035 = 112,280. Total ids 202 (E-ANS 139, others 63). 3 code_rows in call 1 (not sent to DeepSeek).'%tu)
p()
# ---------- 2
p('## 2. Offline rebuild on s127, s128, s129, s130 (build step only, stored inputs)')
p()
p('Harness: /tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/g35067c/harness.cjs (rebuilds the node from each version\'s Shared Library map, runs it with $ answered from the stored outputs of this run). Alt Judge Enforcer Build rebuilt on s127, s128, s130: output {je_skip:true, why:"no panel judgment text", items:[]} each time, same as stored. R2 Alt Judge Enforcer Build: NOT REACHED (the node has no stored run in this execution, so the harness has no input and throws; no rebuild possible).')
p()
p('| Version | Calls | User chars per call | Sum user chars | Largest call | not_checked | E-ANS items | E-ANS grades | E-ANS items with THE ANSWER IN FULL | Non-E-ANS items with FULL | E-ANS items with THE SIDE\'S OTHER LINES ON THIS VERSE |')
p('|---|---|---|---|---|---|---|---|---|---|---|')
for v in ['127','128','129','130']:
    calls,its=V[v]
    us=[len(c['body']['messages'][1]['content']) for c in calls]
    ea=[k for k,x in its.items() if x['rule']=='E-ANS']
    eag=sum(1 for c in calls for y in c['ids'] if y['rule']=='E-ANS')
    nc=[c['not_checked'] for c in calls]
    p('| s%s | %d | %s | %d | %d | %s | %d | %d | %d | %d | %d |'%(v,len(calls),', '.join(map(str,us)),sum(us),max(us),'none' if all(not n for n in nc) else json.dumps(nc),len(ea),eag,sum(1 for k in ea if its[k]['full']),sum(1 for k,x in its.items() if x['rule']!='E-ANS' and x['full']),sum(1 for k in ea if its[k]['other'])))
p()
p('Marker text of the pkgA1N added section in the s129 and s130 Judge Enforcer Build source: "THE SIDE\'S OTHER LINES ON THIS VERSE (the block the answer points to, and its later rounds that name the pressed verse)". Present in s129 and s130 source, absent from s127 and s128 source (checked with harness.cjs, cap.cjs). The pkgEAF AU marker is "THE ANSWER IN FULL, FROM [round]" (eaw_blk; in s127 source the same marker exists for the 55 items it serves).')
p()
p('Compare per item id (B-number ids; E-ANS items B1 to B117), version against version. Results of an2.py (text compared after removing the FULL and the OTHER LINES sections and blank lines):')
p()
p('```')
p(open('an2.out').read().rstrip())
p('```')
p()
p('Reading of those lines as counts (no judgment): on every pair the 202 ids are the same ids with the same rule, seat, judge grade, item name, flagged line and response line; the 158 items (117 E-ANS) are the same set; no item missing; no id changed. s127 to s128: 38 E-ANS items gain THE ANSWER IN FULL (55 to 93), 0 lose it; items differ only in that block. s128 to s129 and s128 to s130: 58 E-ANS items gain THE SIDE\'S OTHER LINES; 59 E-ANS items are byte-equal to s128; the FULL blocks are byte-equal on all 93. s129 to s130: all 158 items byte-equal (pkgRCL touches Close Enforcer Build only). Calls: s127 6, s128 6, s129 8, s130 8 (s130 minus s128 = +2; s128 minus s127 = 0). Largest call: s127 52,351; s128 52,638; s130 52,907. Sum of user text: s127 269,061; s128 292,132; s130 374,170 (s130 minus s128 = +82,038: 8 calls x 322 added rule characters = 2,576 [the E-ANS rule text is in the user text of every call, 1,217 characters on s128 and 1,539 on s130], plus 58 sections totalling 52,482 characters including their headers; the remaining 26,980 characters are not attributed, NOT CHECKED).')
p()
p('not_checked on s128 versus s130: empty on both (rebuild). Grades that s128 checks and s130 leaves unchecked: none (202 ids in both, the same ids in each; every id sits in a call on both). Calls used 8 of 10 on s130 (6 of 10 on s128): the cap of 10 is not reached; nothing left unchecked.')
p()
# ---------- 3
p('## 3. Backslash check (W4 check 4)')
p()
bs=json.load(open('bs130.json'))
p('E-ANS items on s130 whose ANSWER or ANSWER IN FULL text holds a double quote mark: 103 of 117 (s127: 70; s128, s129: 103). Round texts in the debate row (claude_r1, claude_r2, engine_r3, defender_r4, engine_r1, engine_r2, challenger_r3, challenger_r4) hold no backslash character at all (scanned). Served FULL and OTHER LINES sections hold no backslash (48 backslash occurrences in all E-ANS items of s130: 21 in the WHAT THE PRESS SAYS line, 24 in the THE ANSWER line, 3 in the judges\' grade lines; none in a FULL or OTHER LINES block). Every one of the 48 is a backslash before an apostrophe (\\\'), none before a double quote mark. They are the same 48 on s127, s128, s129, s130 (the text of the judge\'s own quoted line; 22 items, B86 to B117 subset, the judge on each is sol). Items and counts:')
p()
from collections import defaultdict
d=defaultdict(list)
for k,f,ch,ctx in bs: d[k].append((f,ch))
p('| Item | Occurrences (field, next character) |')
p('|---|---|')
for k,v in d.items(): p('| %s | %s |'%(k,'; '.join('%s: backslash before %s'%(f,'an apostrophe' if ch=="'" else repr(ch)) for f,ch in v)))
p()
p('Example context (item B86, THE WHAT THE PRESS SAYS line as served): `the angel\\\'s "for" grounds the command to take his wife on God\\\'s claim of the child, spoken to a son of David.`')
p()
# ---------- 4
p('## 4. Check replies (W4 check 5)')
p()
tot_due=0;tot_lines=0
p('Per call (table in section 1 also): REPLY LINES DUE = ids in the call (the prompt lists them per item); ENFORCER lines = lines starting "ENFORCER" in the reply. No reply holds "NO ANSWER". Calls 1 to 8: ids 27, 34, 38, 34, 21, 19, 24, 5 = 202; ENFORCER lines 27, 34, 38, 34, 21, 19, 24, 5 = 202. Every id has a reply line (202 of 202 parsed; missing: none). Record tally E-ANS: AGREE 135, DISAGREE 4, NO ANSWER 0, NO VERDICT 0 (Judge Enforcer Record enf428.tally). enf428.errors: [] (0). esr.retried: [], eid.unmapped 0. Call sizes (user chars) are in section 1; no NO ANSWER, so no call size to give.')
p()
# ---------- 5
p('## 5. W2\'s eight pkgA1N first-run checks (quoted from /mnt/project-files/wall2024/w2_manual_A1N_RCL3.md, then facts)')
p()
p('Check 1. "RULE E-ANS in every check call\'s prompt carries the new sentence (\\"and also the block the answer points to ...\\")."')
p('Facts: the sentence ", and also the block the answer points to (\\"answered under link 3\\") and any line of a later round of that side (its round 2, its link round or, for the defender, its close round [CR4]) that quotes the verse or names it by reference, as THE SIDE\'S OTHER LINES ON THIS VERSE shows; an answer given there counts as the answer" is present in the user text of calls 1, 2, 3, 4, 5, 6, 7, 8 (8 of 8; the rule text is in every call, also in calls 6 to 8 that hold no E-ANS item). It is absent from all 6 s128 rebuilt calls. The E-ANS rule block is 1,217 characters on s128 and 1,539 on s130 (+322).')
p()
oth=[(k,x) for k,x in EA.items() if x['other']]
p('Check 2. "Each E-ANS item whose answering side names the pressed verse in a later round, or points with \\"under link N\\" or \\"(link N)\\", carries THE SIDE\'S OTHER LINES ON THIS VERSE. No item carries it when the record has neither; this is byte-equal to the s128 item text. The section is at most 900 characters. It holds no PRESSED WITH or \\"-- MEANS:\\" line. It holds no paragraph from the other side\'s rounds."')
p('Facts (an3.py):')
p('- E-ANS items 117: answered in [CR3] 70, in [DR3] 39, in [CR4] 8. Items carrying the section: 58, all among the 70 [CR3] items, none among the 39 [DR3] items or the 8 [CR4] items (the code reads later rounds only).')
p('- Of the 12 [CR3] items without the section: a text search of [CR4] for the pressed verse reference found none (0 of 12 names its verse in [CR4]; this search is mine, not the code\'s, and uses the verse reference string from PRESSED VERSE; NOT CHECKED for a verse written without its book name). Items: '+', '.join('%s (%s)'%(k,x['verse']) for k,x in EA.items() if x['rnd']=='CR3' and not x['other'])+'.')
p('- Answers (ANSWER or ANSWER IN FULL text) containing "link N" in any letter case: 0 of 117. So no item carried a pointer-built block.')
lens=sorted(len(x['other']) for k,x in oth)
p('- Section length (text between the quote marks, label and the " [...]" cut mark included): minimum %d, maximum %d; 58 sections, total 52,482 characters with their headers. Paragraph count per section: 30 sections with 1 paragraph, 28 with 2 (labels [CR4] only; 86 paragraphs in all).'%(lens[0],lens[-1]))
p('- Sections holding "PRESSED WITH" or "-- MEANS:": 0. Paragraphs found as a word-for-word run (whitespace normalised) inside the defender\'s stored [CR4] (defender_r4): 86 of 86; found inside the challenger\'s [DR4]: 0 of 86. All labels are [CR4].')
p('- Byte-equal to s128: 59 E-ANS items (the 59 without the section) are byte-equal to the s128 item; the 58 with it equal the s128 item once the section is removed.')
p()
p('Check 3. "Every pointed section is labelled \\"[XRn, LINK N]\\", and N matches the answer\'s pointer. An answer that only says \\"fits Link 1 and Link 2\\" gets no LINK block."')
p('Facts: NOT REACHED for the labelled form: 0 sections carry a "[XRn, LINK N]" label (all 86 paragraphs carry the label [CR4] only), and 0 of 117 answers hold a "link N" pointer. Items whose answer says "fits Link ..." : 0 by the same scan (case-insensitive "link \\d").')
p()
p('Check 4. "Check calls: the run makes 0 to 2 more DeepSeek answer-check calls than the same item set would make on s128. Stored range: panel +0 to +2, alternates +0 to +1. More than 2 added calls in one node is a FAIL to explain."')
p('Facts: Judge Enforcer Build: 8 calls on s130 (stored), 6 calls on the s128 rebuild: +2. Alt Judge Enforcer Build: 0 calls (skip), s128 rebuild 0: +0. R2 Alt: NOT REACHED. E-ANS grades per call: s128 rebuild calls 1 to 3 hold all 139 (51, 53, 35), calls 4 to 6 hold other rules; s130 calls 1 to 5 hold them (27, 34, 38, 34, 6), calls 6 to 8 hold other rules.')
p()
p('Check 5. "Check text grows by about +35K to +146K characters per run."')
p('Facts: user text sum s130 374,170 minus s128 292,132 = +82,038 characters (system text: 112,280 versus 84,210 = +28,070 for the two added calls). Within W2\'s stated range of +35K to +146K for user text.')
p()
p('Check 6. "not_checked is no longer than on s128 for the same items. No Judge Enforcer Build, Alt Judge Enforcer Build or R2 Alt Judge Enforcer Build error. Every E-ANS item is still sent, and items are not renumbered against the judges\' lines."')
p('Facts: not_checked [] in all 8 stored calls; s128 rebuild [] too. Errors: none in Judge Enforcer Build (output present), Alt Judge Enforcer Build (output present, skip), R2 Alt Judge Enforcer Build (did not run). E-ANS items on s130 117, on s128 117; E-ANS grades 139 on both; ids B1..B117 with the same seat, item name and flagged line on both (no renumbering: 0 changed of 202). Every id has a reply line.')
p()
p('Check 7. "The pkgEAF AU lines still act: the full answer block (eaw_blk) is served as on s128."')
p('Facts: E-ANS items with THE ANSWER IN FULL: s128 93, s130 93; the FULL block text is byte-equal on all 93; 0 lost; ids entries carry eaw_blk (stored ids[].eaw_blk present). FROM labels on s130: [CR3] 59, [DR3] 30, [CR4] 4. In addition 5 non-E-ANS items (E-HOLD and similar) carry a FULL block in every version.')
p()
p('Check 8. "Record, not pass or fail: each E-ANS row whose DeepSeek grade differs from the judge\'s, with whether the item had the new section."')
p('Facts: 4 E-ANS rows DISAGREE (of 139): B36.1 (luna, judge MEETS, DeepSeek right MISSES; item without FULL, without OTHER LINES), B39.1 (luna, judge MISSES, right MEETS; item carried FULL, no OTHER LINES), B53.1 (luna, judge MISSES, right MEETS; item carried FULL, no OTHER LINES), B82.1 (chatgpt, judge MEETS, right MISSES; no FULL, no OTHER LINES). None of the 4 carried THE SIDE\'S OTHER LINES ON THIS VERSE. Section 6 holds the full texts.')
p()
p('Other E-ANS facts for W3: the 58 items that carried the OTHER LINES section hold 72 judge grades; their DeepSeek replies: all AGREE (the only DISAGREE rows are the four above).')
# ---------- 6
p()
p('## 6. THE HAND-READING LIST: E-ANS rows where DeepSeek DISAGREED with the judge')
p()
p('Four rows (139 E-ANS grades: AGREE 135, DISAGREE 4). Direction: right MISSES against a judge MEETS: B36.1 (luna), B82.1 (chatgpt). Right MEETS against a judge MISSES: B39.1 (luna), B53.1 (luna). FULL marks: B39 and B53 carried THE ANSWER IN FULL; B36 and B82 did not. Added pkgA1N section (THE SIDE\'S OTHER LINES ON THIS VERSE): none of the four. No judgment is made here. The database E-ANS log rows for these (debate_enforcer_log, kind enforcer_check) have cure_status null; the record-only note "(ruling 428; the judge keeps the decision)" is in the send_back rows quoted below.')
p()
sbit={ (x['seat'],x['item'],x['line']):x for x in sb['sb_items']}
def judge_reply(seat):
    for r in sbc:
        pass
seatidx={'luna':0,'chatgpt':1,'sol':2}
rows=[('B36.1','CR3'),('B39.1','DR3'),('B53.1','DR3'),('B82.1','DR3')]
links={'B36.1':'Defender [CR3], answer under the block "**LINK 4: NARROWED TO:** ..." (the line "- **Hebrews 2:14.** ..." is the only occurrence of Hebrews 2:14 in [CR3], inside the LINK 4 block). The item gives no collision label (NOT CHECKED which C link pressed it).',
 'B39.1':'Challenger [DR3], answer in the block "**LINK 1: SUPPORTED.** Joseph knew Mary his wife within the espousal, and the child is of his loins." (the answer text sits at offset 3106 of challenger_r3). The item gives no collision label (NOT CHECKED which D link the press belongs to).',
 'B53.1':'Challenger [DR3], answer in the block "**LINK 5: SUPPORTED.** Christ had a biological father: Joseph, of the house and lineage of David." (offset 15260 of challenger_r3).',
 'B82.1':'Challenger [DR3]. Matthew 1:16 occurs three times in challenger_r3: twice under "**LINK 1: SUPPORTED.**" (offsets 4260 and 4714; the second is "- [L4] Matthew 1:16 names both parents of the house, Joseph as \\"husband\\" (*anēr*) and Mary as the one who bore...") and once under "**LINK 5: SUPPORTED.**" (offset 14363, "- See P1.4. [L1] Matthew 1:16 names Joseph \\"husband\\" (*anēr*, G435) and Mary as the one who bore."). The item text below shows which one the check served.'}
for g,rnd in rows:
    y=ids[g]; k=g.split('.')[0]; x=EA[k]; seat=y['seat']
    d=DS[g]
    p('### %s: %s, %s, %s [%s], judge %s'%(g,seat,x['verse'],'defender answer' if x['rnd'].startswith('C') else 'challenger answer',x['rnd'],y['grade']))
    p()
    p('- Seat: %s. Pressed verse: %s. Answer round: [%s]. Check call: %d of 8 (DeepSeek reply from that call).'%(seat,x['verse'],x['rnd'],x['call']))
    p('- Link or collision: '+links[g])
    p('- Item carried THE ANSWER IN FULL: %s. Item carried THE SIDE\'S OTHER LINES ON THIS VERSE (pkgA1N): %s.'%('YES (FROM [%s])'%x['full'][0].strip('[]') if x['full'] else 'NO','YES' if x['other'] else 'NO'))
    p('- Press text (WHAT THE PRESS SAYS THE VERSE MEANS): '+x['means'])
    p('- Judge\'s grade line, as the Judge Enforcer Build stored it (flagged_line): `%s`'%y['flagged_line'])
    p('- Judge\'s grade on the item: %s.'%y['grade'])
    p('- DeepSeek reply line, in full: `%s`'%d[1])
    # sent back?
    hit=[v for kk,v in sbit.items() if kk[0]==seat and kk[2]==y['flagged_line']]
    if hit:
        h=hit[0]
        p('- Sent back: YES, as %s in the send-back call for %s. Send-back item reason: `%s`'%(h['sid'],seat,h['reason']))
        p('- The judge\'s send-back answer for this item (ans=%s), full CHANGE line: `%s`'%(h['ans'],h['to']))
        if h.get('why'): p('- Judge\'s stated reason: `%s`'%h['why'])
    else: p('- Sent back: NO match in sb_items (NOT FOUND)')
    p('- Final grade: see "Final grade evidence" below the four items.')
    p()
    p('Full served item text (stored Judge Enforcer Build call %d):'%x['call'])
    p('````')
    p(nm(x['text']))
    p('````')
    if x['full']==None:
        p('(No FULL block was served for this item: the stored item holds only THE ANSWER as quoted in the judge line.)')
        p()
        p('Not served to the check, for W3\'s reading: every line of the round text ([%s], stored in the debate row) that names %s, in full:'%(x['rnd'],x['verse']))
        p('````')
        for ln in row[ROUND[x['rnd']]].split('\n'):
            if x['verse'] in ln: p(ln)
        p('````')
    p()
p('### Final grade evidence (what the stored final verdicts and send-back record show)')
p()
def unesc(v): return v.replace('\\n','\n').replace('\\"','"')
for seat,pats in [('luna',['Hebrews 2:14','Matthew 1:25 -- [DR3]']),('chatgpt',['Matthew 1:16 -- [DR3]'])]:
    r=[x for x in jdg if x['judge_seat']==seat][0]; t=unesc(r['verdict_raw'])
    p('Seat %s, saved verdict_raw (debate_judgments id %d), lines containing "ANSWER CHECK:" for these presses, as stored:'%(seat,r['id']))
    p('````')
    for l in t.split('\n'):
        if any(pt in l for pt in pats) and ('ANSWER CHECK' in l):
            p(l)
    p('````')
p()
p('The AUDIT lines for luna Hebrews 2:14 in the saved verdict (full): the first shows the line now graded MISSES, the superseded line shows the original MEETS:')
p('````')
t=unesc([x for x in jdg if x['judge_seat']=='luna'][0]['verdict_raw'])
for l in t.split('\n'):
    if 'Hebrews 2:14' in l and l.startswith('[AUDIT'): p(l)
p('````')
p('Chatgpt Matthew 1:16 AUDIT lines in its saved verdict (full): the superseded original line, then the later lines:')
p('````')
t=unesc([x for x in jdg if x['judge_seat']=='chatgpt'][0]['verdict_raw'])
for l in t.split('\n'):
    if 'Matthew 1:16' in l and l.startswith('[AUDIT v27'): p(l)
p('````')
p()
p('### Judge send-back replies, in full (Send Back Call openrouter, one call per seat; 3 calls, tally CHANGE 21, KEEP 0, NO ANSWER 0, not_sent 18)')
p()
for seat,i in [('luna',0),('chatgpt',1)]:
    p('Seat %s, reply (%d characters):'%(seat,len(sbc[i]['json']['choices'][0]['message']['content'])))
    p('````')
    p(sbc[i]['json']['choices'][0]['message']['content'])
    p('````')
p()
p('Record-only note (database send_back rows, ruling 428 trial pkgVP3): for the three luna rows and the chatgpt row the stored cure_reason ends "(ruling 428; the judge keeps the decision)"; luna Hebrews 2:14 row: "CURE (record-only until promoted): CURED -- CHANGE TO grades MISSES | TRIAL pkgVP3: code check does not agree, not an item"; luna Matthew 1:25 rows: "CURED -- CHANGE TO MEETS with a fuller answer found in [DR3]"; chatgpt Matthew 1:16 row: "CURED -- CHANGE TO grades MISSES | TRIAL pkgVP3: code check does not agree, not an item -- [DR3] names Matthew 1:16 again (line 62 ...)". Other E-ANS send-backs in this run (sol Numbers 1:2, sol Luke 3:23) came from the pkgABS code check, not from a DeepSeek DISAGREE.')
p()
# ---------- 7 table
p('## 7. All 117 E-ANS items (for reference)')
p()
p('| Item | Round | Verse | FULL | OTHER LINES | Judges: seat grade / DeepSeek |')
p('|---|---|---|---|---|---|')
for k,x in EA.items():
    gs=[(i,ids[i]) for i in ids if i.split('.')[0]==k and ids[i]['rule']=='E-ANS']
    p('| %s | [%s] | %s | %s | %s | %s |'%(k,x['rnd'],x['verse'].replace('|','/'),'FULL' if x['full'] else '-','OTHER' if x['other'] else '-','; '.join('%s %s / %s'%(y['seat'],y['grade'],DS[i][0]) for i,y in gs)))
open('/mnt/project-files/w3/grade_35067/facts_C_answercheck.md','w').write('\n'.join(W)+'\n')
print(len('\n'.join(W)))
