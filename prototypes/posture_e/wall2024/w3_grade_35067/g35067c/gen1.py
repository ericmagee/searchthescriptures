import json,re
row=json.load(open('row_clean.json'))
jdg=json.load(open('jdg_clean.json'))
def N(n): return json.load(open('nodes/%s.json'%n))[0]
def main(n,i=0): return N(n)['data']['main'][0][i]['json']
ROUND={'CR1':'claude_r1','CR2':'claude_r2','CR3':'engine_r3','CR4':'defender_r4','DR1':'engine_r1','DR2':'engine_r2','DR3':'challenger_r3','DR4':'challenger_r4'}
W=[];p=lambda s='':W.append(s)
def fence(t,f='~~~~'): p(f);p(t);p(f)
def nm(t): return re.sub(r'\s+',' ',t).strip()
def unesc(v): return v.replace('\\n','\n').replace('\\"','"')
# ---- block helpers
HEAD=re.compile(r'^(#{1,4}\s|\*\*LINK\s|---\s*$)')
def block_at(text,pos):
    lines=text.split('\n');off=0;idx=0;starts=[]
    for i,l in enumerate(lines): starts.append(off); off+=len(l)+1
    li=max(i for i,s in enumerate(starts) if s<=pos)
    a=li
    while a>0 and not (HEAD.match(lines[a]) and not lines[a].startswith('---')): a-=1
    b=li+1
    while b<len(lines) and not HEAD.match(lines[b]): b+=1
    return a,b,lines
def block_text(text,sentence,mark=True):
    # find sentence by flexible match (quotes normalised)
    def norm(s): return re.sub(r'\s+',' ',s.replace('“','"').replace('”','"').replace('‘',"'").replace('’',"'").replace('*','')).strip()
    key=norm(sentence).rstrip('.')
    lines=text.split('\n')
    # find line containing key (normalised)
    hit=[i for i,l in enumerate(lines) if key in norm(l)]
    if not hit: return None,None
    li=hit[0]
    a=li
    while a>0 and not (re.match(r'^(#{1,4}\s|\*\*LINK\s)',lines[a])): a-=1
    b=li+1
    while b<len(lines) and not re.match(r'^(#{1,4}\s|\*\*LINK\s|---\s*$)',lines[b]): b+=1
    blk=lines[a:b]
    out=[]
    for i,l in enumerate(blk):
        if a+i==li:
            # mark sentence
            k=norm(l).find(key)
            out.append('>>> '+l+'   <<< [the quoted sentence is in this line]')
        else: out.append(l)
    return '\n'.join(out), lines[a]
sd=lambda: None
ceb=main('Close_Enforcer_Build'); cebs=N('Close_Enforcer_Build')['data']['main'][0]
cec_call=N('Close_Enforcer_Call_deepseek')['data']['main'][0]
cer=main('Close_Enforcer_Record'); cec=cer['cec']
sbody=main('Build_Save_Body')
CR=row['claude_r1']
p('# Facts C, closing round (Close Enforcer, pkgRCL rev 3, pkgCLK, pkgCLG, pkgSYL, anti-cheat, judge contradiction, assumption check), live run 35067')
p()
p('Facts and full texts only. No verdicts, no causes. Source: execution export /mnt/project-files/wall2024/ex35067_full.json (execution 35067, status success, started 2026-11-11T14:56:21Z, stopped 15:39:57Z); the saved debate row (debate_results id 359389a6-0c95-469d-b85e-e691b205eb7c, run token ODV1-35067-z8obkqib, created_at 2026-11-11 15:21:55+00; panel verdict BROKEN 3-0, outcome CHALLENGER PREVAILS); debate_judgments and debate_enforcer_log rows of the run (read-only SELECTs). The texts below are copied from the stored debate row (md5 of defender_r4 10fecc75a37aa89192520a8c2f45bcaa, 21,588 characters; challenger_r4 a706dec126be36a020570eb6278a4ce5, 15,908 characters; synthesis 10a2c2de7d4294da28b9c47edf4ae689, 10,697 characters), and are equal to the texts the nodes saw (Build Save Body saveBody.defender_r4 and challenger_r4 equal the row).')
p()
p('Version fact: the workflow stored inside the export has the same Shared Library (sha256 prefix 6227f1eccc42) and the same Close Enforcer Build node code (a529aa1360bf, 8,283 characters) as fetchback_live_s130.json. fetchback_live_s129.json has the same Shared Library and a 6,129-character Close Enforcer Build (0696aa058012). By content the run executed s130 (pkgA1N rev 3 and pkgRCL rev 3). The export carries no versionId.')
p()
p('Round labels. In the engine\'s labels the defender\'s rounds are [CR1] (stored claude_r1), [CR2] (claude_r2), [CR3] (engine_r3, the defender\'s link round), [CR4] (defender_r4, the defender\'s close). The challenger\'s are [DR1] (engine_r1), [DR2] (engine_r2), [DR3] (challenger_r3, its link round), [DR4] (challenger_r4, its close). Inside a round, a "block" is the part under a heading line ("## D1 ...", "**LINK 1: ...**", "# CLOSE ROUND: DEFENDER" and its opening paragraph). The defender declared 5 links (D1 to D5); there is no D6 in this debate. The challenger has 5 link blocks (C1 to C5).')
p()
# ---------------- 1
p('## 1. The closing round in full, the declared chain, and every narrowing or withdrawal statement')
p()
p('### 1a. [CR4], the defender\'s closing round, exactly as stored (defender_r4, 21,588 characters)')
p()
fence(row['defender_r4'])
p()
p('### 1b. [DR4], the challenger\'s closing round, exactly as stored (challenger_r4, 15,908 characters)')
p()
fence(row['challenger_r4'])
p()
p('### 1c. The defender\'s link declarations, as declared in [CR1] (section "## DECLARED CHAIN" of claude_r1, whole)')
p()
i=CR.find('## DECLARED CHAIN'); fence(CR[i:])
p()
p('The Close Enforcer Build reads these as D1 = LINK 1 to D5 = LINK 5 (prompt line: "The defender\'s links: D1 = LINK 1, D2 = LINK 2, D3 = LINK 3, D4 = LINK 4, D5 = LINK 5 (its DECLARED CHAIN in [CR1]). Its closing round is [CR4]."). links read by the code: DEFENDER [1,2,3,4,5], CHALLENGER [1,2,3,4,5].')
p()
def sents(t):
    out=[]
    for l in t.split('\n'):
        if not l.strip(): continue
        for s in re.split(r'(?<=[.!?])["”’\')\]]*\s+(?=[A-Z"“\[*(-])',l): out.append(s)
    return out
def label(rnd,t,s):
    # block label: nearest heading before the first line containing the sentence
    lines=t.split('\n');hit=[i for i,l in enumerate(lines) if s[:60] in l]
    if not hit: return '(block not located)'
    li=hit[0];h=None;sub=None
    for j in range(li,-1,-1):
        if sub is None and re.match(r'^\*\*ANSWER:',lines[j]): sub=lines[j][:70]
        if re.match(r'^(#{1,4}\s|\*\*LINK\s)',lines[j]): h=lines[j][:110];break
    if h is None: return '[%s] opening (above any heading)'%rnd
    if rnd=='CR4' and h.startswith('# CLOSE ROUND'): return '[CR4] opening paragraph, under "%s", above "## D1"'%h
    return '[%s] block "%s"'%(rnd,h)+(' / sub-block "%s"'%sub if sub else '')
NK=re.compile(r'NARROW|\bdrop|withdr|conced|do not rest|no longer|give up|gave up|do not press|do not narrow|do not claim|do not hold|set aside|retract',re.I)
GK=re.compile(r'\bI grant\b|\bI agree\b|\bI accept\b',re.I)
p('### 1d. Narrowing, withdrawal and concession statements of the defender after the declaration (sentences matching NARROW, drop, withdr, conced, "do not rest", "no longer", "do not press", "do not narrow", etc. in [CR2], [CR3], [CR4]; [CR1] has none; sentences split at ". " before a capital, so a sentence can be cut at an abbreviation)')
p()
p('| Round | Block | Full sentence |')
p('|---|---|---|')
for r in ['CR2','CR3','CR4']:
    t=row[ROUND[r]]
    for s in sents(t):
        if NK.search(s): p('| [%s] | %s | %s |'%(r,label(r,t,s).replace('|','/'),s.replace('|','/')))
p()
p('Link-status lines of [CR3] (the defender\'s link round; every line that opens a link block, whole line):')
p()
for l in row['engine_r3'].split('\n'):
    if re.match(r'^\*\*LINK\s',l): p('- '+l)
p()
p('Sentences of [CR2], [CR3] and [CR4] that open with "I grant", "I agree" or "I accept" (concessions; count: [CR2] %d, [CR3] %d, [CR4] %d), whole sentence:'%tuple(sum(1 for s in sents(row[ROUND[r]]) if GK.search(s)) for r in ['CR2','CR3','CR4']))
p()
p('| Round | Block | Full sentence |')
p('|---|---|---|')
for r in ['CR2','CR3','CR4']:
    t=row[ROUND[r]]
    for s in sents(t):
        if GK.search(s) and not NK.search(s): p('| [%s] | %s | %s |'%(r,label(r,t,s).replace('|','/'),s.replace('|','/')))
p()
# ---------------- 2
p('## 2. Close Enforcer Build, DeepSeek closing enforcer call, Close Enforcer Record')
p()
p('Node runs: Close Enforcer Build 1 run (executionTime %d ms), output 2 items (side DEFENDER and side CHALLENGER); Close Enforcer Needed? 1 run; Close Enforcer Call deepseek 1 run with 2 calls; Close Enforcer Record 1 run. cec_skip false on both items, missing_rounds [] on both. No retry node for the closing enforcer ran (runData holds only Build, Needed?, Call, Record for this check). No error in any of the four.'%N('Close_Enforcer_Build')['executionTime'])
p()
p('### 2a. Candidates built (DEFENDER item; CHALLENGER item built 0 candidates)')
p()
p('4 candidates. Rule or source of each is the `by` field. X1 and X2 come from the challenger\'s own list in [DR4] ("OPPONENT\'S CONTRADICTIONS"); X3 and X4 come from the code, pkgRCL rev 3 (reclaim reader). No other rule produced a candidate (pkgRCL rev 3 reclaim candidates: 2; all others: 2).')
p()
for c in ceb['cands']:
    p('**%s** -- side %s -- LINK %s -- source: %s'%(c['id'],c['side'],c['n'],c['by']))
    p('- Earlier sentence, [%s]: `%s`'%(c['earlier_round'],c['earlier_q']))
    p('- Closing sentence, [%s]: `%s`'%(c['closing_round'],c['closing_q']))
    p('- Reason text: `%s`'%c['why'])
    p()
p('The challenger\'s [DR4] lines the code read for X1 and X2 ("OPPONENT\'S CONTRADICTIONS" section, whole, with the next 12 lines):')
p()
d4=row['challenger_r4'];i=re.search(r"OPPONENT['’]S CONTRADICTIONS",d4).start()
j=d4.rfind('\n',0,i)+1
fence('\n'.join(d4[j:].split('\n')[:14]))
p()
p('Same candidate block as built by the s129 code (before pkgRCL rev 3), rebuilt offline (rb3.cjs): the s129 DEFENDER prompt holds X1 and X2 only (63,219 characters); the s130 stored prompt (64,336 characters) equals the s129 prompt plus the two lines X3 and X4 (checked: removing those two lines from the s130 prompt gives the s129 prompt byte for byte); the CHALLENGER prompt (72,141 characters) is byte-equal on s129 and s130. The s130 rebuild equals the stored Build output.')
p()
p('### 2b. DeepSeek closing enforcer calls')
p()
for k,(b,c) in enumerate(zip(cebs,cec_call)):
    j=b['json'];r=c['json']
    p('- Call %d, side %s: model %s, system text %d characters, user text %d characters (database prompt_sent holds both prompts joined: 136,517 characters on the first log row); max_tokens 64000, temperature 0; usage prompt_tokens %d, completion_tokens %d (reasoning_tokens %d); finish_reason %s; reply (content) %d characters; reasoning_content %d characters (not copied here, it is in the export).'%(k+1,j['side'],j['model'],len(j['body']['messages'][0]['content']),len(j['body']['messages'][1]['content']),r['usage']['prompt_tokens'],r['usage']['completion_tokens'],r['usage']['completion_tokens_details']['reasoning_tokens'],r['choices'][0]['finish_reason'],len(r['choices'][0]['message']['content']),len(r['choices'][0]['message'].get('reasoning_content',''))))
p('- Number of sends: 2 (one per side), 0 retries.')
p()
p('System text (whole, 256 characters):')
fence(ceb['body']['messages'][0]['content'])
p()
p('Raw reply of call 1 (DEFENDER), in full (content, 1,863 characters):')
fence(cec_call[0]['json']['choices'][0]['message']['content'])
p()
p('Raw reply of call 2 (CHALLENGER), in full (25 characters):')
fence(cec_call[1]['json']['choices'][0]['message']['content'])
p()
p('The prompt of call 1 (user text, 64,336 characters) opens with the instruction text, then the candidate lines X1 to X4 (quoted in 2a), then the rounds [CR1] to [CR4] of the defender. Whole text: stored in the export under Close Enforcer Build, item 0, body.messages[1]; a copy is at /tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/g35067c/ceb_user.txt. Its instruction text is the same as in the stored candidate lines above.')
p()
p('### 2c. Close Enforcer Record output')
p()
p('skipped %s; model %s; none %s; no_answer %s; errors %s; confirmed %d; rows %d. No row with id NEW. Rows, each in full (line field):'%(cec['skipped'],cec['model'],cec['none'],cec['no_answer'],cec['errors'],len(cec['confirmed']),len(cec['rows'])))
p()
for r in cec['rows']:
    p('- **%s** %s, LINK %s (link the Record holds), status **%s**'%(r['id'],r['side'],r['link'],r['status']))
    p('  - line: `%s`'%r['line'])
    p('  - quotation blocks: earlier [%s], closing [%s]'%(r['earlier_round'],r['closing_round']))
p()
p('Rows that share quotations. Candidate rows X3 and X4 share the same closing sentence (and the same closing block); their earlier sentences differ (LINK 1 line and LINK 4 line of [CR3]). No NEW row exists, so no candidate row and NEW row share quotations. Rows X1 and X2 have different earlier and closing sentences from each other and from X3 and X4. In the Record\'s `confirmed` array the closing_q of X3 and X4 reads "D1 to D5 stand as declared, and I keep all five. I do not narrow or concede any." (the reply\'s quotation), while the candidate line carried "D1 to D5 stand as declared, and I keep all five." (the shorter first sentence).')
p()
p('Confirmed array of the Record (id, side, link, earlier, closing, why):')
p()
for r in cec['confirmed']:
    p('- %s %s LINK %s: earlier [%s] `%s` ; closing [%s] `%s` ; why `%s`'%(r['id'],r['side'],r['link'],r['earlier_round'],r['earlier_q'],r['closing_round'],r['closing_q'],r['why']))
p()
p('Database rows of the closing enforcer (debate_enforcer_log, ids 29894 to 29898): X1 DEFENDER LINK 2, X2 DEFENDER LINK 4, X3 DEFENDER LINK 1, X4 DEFENDER LINK 4, NONE CHALLENGER (response_line "CLOSE-CONTRADICTION: NONE", cure_reason "NONE FOUND"); cure_status null on all five; prompt_sent 136,517 characters on the first row and 46 on the others ("[SAME prompt_sent AS the first E-CLOSECON row]"); full_reply 1,889 characters on the first row (the two replies joined by a newline: 1,863 + 1 + 25); reply_error null.')
p()
p('### 2d. Links broken by the engine as a result')
p()
d=sbody
p('Build Save Body recomputed: trigger = %s; fields = %s; result = %s. void_links %s, challenger_void_links %s.'%(json.dumps(d['recomputed']['trigger'],ensure_ascii=False),json.dumps(d['recomputed']['fields']),d['recomputed']['result'],d['void_links'],d['challenger_void_links']))
p()
p('Engine-added lines naming a broken link in the saved synthesis: D1 (from X3) and D4 (from X4), 2 lines (section 5). Judge Contradiction Record confirmed J1 (link 1), J2 (link 4), J3 (link 2) on the same closing sentence (section 7). Audit lines in the saved judge verdicts "LINK n BROKEN BY A CONFIRMED CLOSING CONTRADICTION" name links 1, 2 and 4 for the panel seats and links 1 and 4 for the single judge (section 8). Link 2 appears in the judges\' audit lines and in J3, and does not appear in a Close Enforcer Record row (X1 is the only row with link 2; status NOT A CONTRADICTION).')
p()
# CONFIRMED blocks
p('### 2e. Each CONFIRMED line with both sentences in their full blocks')
p()
for r in cec['confirmed']:
    p('#### %s (%s LINK %s), CONFIRMED'%(r['id'],r['side'],r['link']))
    p()
    p('Reply line, in full: `%s`'%[x for x in cec['rows'] if x['id']==r['id']][0]['line'])
    p()
    eb,eh=block_text(row['engine_r3'],r['earlier_q'].split(': ',1)[-1] if r['earlier_q'].startswith('LINK') else r['earlier_q'])
    p('EARLIER sentence, round [CR3], block "%s" (the whole block; the line holding the sentence is marked):'%eh)
    fence(eb or '(block not located)')
    cb,ch=block_text(row['defender_r4'],'D1 to D5 stand as declared, and I keep all five.')
    p('CLOSING sentence, round [CR4], block "%s" (the opening block of the close, whole; the sentence is the first sentence of the paragraph; it sits above the first "## D1" heading, so in no link block):'%ch)
    fence(cb)
    p()
p('Not confirmed rows, closing blocks given for completeness (earlier sentences are in 1d):')
p()
for r in [x for x in cec['rows'] if x['status']!='CONFIRMED']:
    cb,ch=block_text(row['defender_r4'],r['closing_q'])
    p('%s (%s), closing sentence `%s` sits in [CR4] block "%s":'%(r['id'],r['status'],r['closing_q'],ch))
    fence(cb or '(not located)')
    p()
# ---------------- 3
p('## 3. pkgCLK rev 3 and pkgCLG')
p()
clk=json.load(open('clk_out.json'))
p('pkgCLK rev 3 (Close Enforcer Record code): for a CONFIRMED row the code finds the closing block (the nearest heading above the quotation that names exactly one D or LINK number at its start) and, when that block names another link, sets the row\'s link to it (note "set by the code ... pkgCLK"). It skips a row when the candidate came from the code (by "the code ...") or when the closing quotation itself contains "D<n>" or "LINK <n>". Facts below come from running the stored Record code\'s cecBlk function on the stored [CR4] and each row (clk.cjs, clk_out.json).')
p()
p('| Line | Status | Link the enforcer named in its reply | Block the closing sentence sits in ([CR4]) | cecBlk result for that sentence | Skip: candidate by the code | Skip: closing sentence names D/LINK | Link the Record holds | Note field |')
p('|---|---|---|---|---|---|---|---|---|')
byid={r['id']:r for r in cec['rows']}
def reply_link(line):
    m=re.search(r'-- LINK (\d+) --',line); return m.group(1) if m else '?'
byby={c['id']:c['by'] for c in ceb['cands']}
for x in clk['cec']['res']:
    r=byid[x['id']]
    cb,ch=block_text(row['defender_r4'],r['closing_q'].split('. ')[0]+'.' if r['id'] in('X3','X4') else r['closing_q'])
    p('| %s | %s | LINK %s | %s | %s | %s | %s | %s | %s |'%(x['id'],r['status'],reply_link(r['line']),(ch or '').replace('|','/')[:80],'none (null)' if x['blk'] is None else 'link %s'%x['blk'],'yes' if byby[x['id']].startswith('the code') else 'no','yes' if x['closing_names_link'] else 'no',x['link'],'none (no note field in the stored row)' if not r.get('note') else r['note']))
p()
p('Mismatches as facts: for X3 and X4 the enforcer named LINK 1 and LINK 4, the closing sentence sits in the opening block of [CR4] (no link heading above it), cecBlk returns no link for it, and the Record holds LINK 1 and LINK 4 (equal to the reply). For X1 the enforcer named LINK 2 and cecBlk returns link 2 for the closing block (equal). For X2 the enforcer named LINK 4 and cecBlk returns link 5 for the block holding its closing sentence; X2 is NOT A CONTRADICTION, so pkgCLK does not act on it (the Record holds LINK 4). No row has a link_named or a "set by the code" note.')
p()
p('pkgCLG (Record grouping, code in the Record): rows are grouped by candidate id ("I|id") and by the pair side + earlier sentence + closing sentence normalised ("P|..."); a group that holds both a CONFIRMED row and a NOT A CONTRADICTION row turns its CONFIRMED rows into "NOT CONFIRMED (conflicting answers)". Groups in this run (clk_out.json): each of X1, X2, X3, X4 forms one id group and one pair group of its own, with one row each ("X1:NOT A CONTRADICTION", "X2:NOT A CONTRADICTION", "X3:CONFIRMED", "X4:CONFIRMED"); no group holds two rows; no row was turned to NOT CONFIRMED. After grouping, the Record keeps one confirmed entry per side and link ("the same link is already broken by an earlier confirmed line" otherwise): link 1 and link 4 each have one confirmed row, so both stay (2 confirmed).')
p()
# ---------------- 4
p('## 4. pkgRCL rev 3 (reclaim reader)')
p()
rcl=json.load(open('rcl_out.json'))
p('The reader (cecReclaim in Close Enforcer Build, run offline on the stored rounds with the node\'s own code, rcl.cjs) finds, per side, the first sentence of the side\'s close round that contains "as declared" and passes its tests (a keep/stand verb in the clause, no negation, no condition, no question, no other-side word, not inside an unbalanced quotation). It then reads the clause for link names (D<n> or a range "D<n> to D<m>") and takes, from the lines of [CR2] and [CR3] that open "LINK <n>: NARROWED TO / CONCEDED / WITHDRAWN / DROPPED", the last such line per link.')
p()
p('Sentences matched: DEFENDER [CR4]: `D1 to D5 stand as declared, and I keep all five.` Links named by the clause: D1 to D5 (links 1, 2, 3, 4, 5). Lines of [CR3] the reader\'s opening pattern matched: LINK 1 (`LINK 1: NARROWED TO: Joseph\'s resolve ... answers that resolve.`) and LINK 4 (`LINK 4: NARROWED TO: The Son\'s flesh ... (Romans 1:3).`). Candidates produced: X3 (link 1) and X4 (link 4), 2. CHALLENGER [DR4]: no sentence matched (0 candidates).')
p()
p('Link-opening lines of [CR3] that the reader\'s pattern (`^LINK <n> :` right after the number) did not match, whole line: ')
p()
for l in row['engine_r3'].split('\n'):
    if re.match(r'^\*\*LINK\s',l) and not re.match(r'^\*\*LINK\s+\d+\s*:',l): p('- '+l)
p()
p('(In [CR3], LINK 1 and LINK 4 read "**LINK n: NARROWED TO:**"; the narrowed line for link 2 reads "**LINK 2 [premise 3]: NARROWED TO:**". [CR2] holds no line opening "LINK <n>:".)')
p()
p('Closing sentences containing "as declared", "as stated", "keep", "stand", "maintain", "D1" to "D6" or "link" (any letter case; match is a substring, so "understand" and "stands" count) that did NOT become candidates, whole sentences, for hand reading. Sentence split at ". " before a capital or quote; lines are split first. [CR4]: 252 sentences, 55 matches, of which the candidate sentence is 1 (marked); challenger [DR4]: 199 sentences, 12 matches.')
p()
K=re.compile(r'as declared|as stated|keep|stand|maintain|\bD[1-6]\b|link',re.I)
for r,t in [('CR4',row['defender_r4']),('DR4',row['challenger_r4'])]:
    p('**[%s]**'%r)
    p()
    p('| Block | Sentence |')
    p('|---|---|')
    for s in sents(t):
        if K.search(s):
            mark=' **[CANDIDATE X3/X4]**' if s.strip()=='D1 to D5 stand as declared, and I keep all five.' else ''
            p('| %s | %s%s |'%(label(r,t,s).replace('|','/'),s.replace('|','/'),mark))
    p()
p('W2\'s three first-run checks for pkgRCL (W2 text, then facts):')
p()
p('1. "When [CR4] has an \\"as declared\\" sentence covering earlier-narrowed links, the closing enforcer\'s request lists one reclaim candidate per such link. Otherwise the request is byte-equal to s128." Facts: [CR4] has one "as declared" sentence ("D1 to D5 stand as declared, and I keep all five."), covering D1 to D5. Earlier-narrowed links by the reader\'s pattern: 1 and 4 (a link 2 line "**LINK 2 [premise 3]: NARROWED TO:**" exists in [CR3], see above). The request lists 2 candidates, X3 (link 1) and X4 (link 4), one per matched link. The DEFENDER request equals the s129-code request plus exactly those two lines (byte check above); the CHALLENGER request is byte-equal on s129 and s130. A s128 rebuild of Close Enforcer Build was NOT run (s128 and s129 carry the same Close Enforcer Build code, hash 0696aa058012, as s127).')
p('2. "DeepSeek\'s reply decides each candidate. A confirmed one is recorded as the dropped part under ruling ASK 20." Facts: reply lines for X3 and X4 are CONFIRMED (section 2c); the Record `confirmed` array holds both; the saved synthesis holds one engine line for each (section 5). The enforcer\'s why for X3: "Link 1 cannot both be expressly narrowed/dropped and simultaneously kept as originally declared and un-narrowed."; for X4: "The close restores the declared Link 4 as un-narrowed after CR3 narrowed it and dropped \\"the woman alone,\\" so both cannot be true together."')
p('3. "No Close Enforcer Build error." Facts: Close Enforcer Build ran once, error none, cec_skip false, missing_rounds [] on both items.')
p()
# ---------------- 5
p('## 5. pkgSYL: engine lines in the saved synthesis')
p()
syn=row['synthesis'];L=syn.split('\n')
p('Saved synthesis (debate_results.synthesis) is 106 lines, 10,697 characters; the version before the engine lines (Build Save Body, field synthesis) is 9,906 characters; the difference is 791 characters, the two engine lines with their line breaks (the text above them and the text from "--- ORACLE_DEBATE_V1 BROKEN DIAGNOSTIC ---" on are the pre-save text, one line-break character apart). Counts in the saved text: "**ENGINE: Dn BROKEN**" lines 2; rows of the form "| Dn (engine) | **BROKEN** |" 0 (the synthesis has no table with a link row, so the row form does not occur); "(engine)" 0. Confirmed closing contradictions in Close Enforcer Record cec.confirmed: 2 (X3, X4). Engine lines: 2. Count equal.')
p()
for tag,idx in [('D1 (X3)',68),('D4 (X4)',70)]:
    a=max(0,idx-5);b=min(len(L),idx+6)
    p('The line for %s, lines %d to %d of the stored synthesis (the engine line is line %d; 5 lines before and 5 after; empty lines shown as empty):'%(tag,a+1,b,idx+1))
    fence('\n'.join(L[a:b]))
    p()
p('The two engine lines sit together, before the line "--- ORACLE_DEBATE_V1 BROKEN DIAGNOSTIC ---" (line 72). Judge Contradiction Record confirmed 3 lines (J1 link 1, J2 link 4, J3 link 2); the synthesis holds no engine line for link 2 and none labelled J1 to J3 (lines 1 to 106 scanned for "J1", "J2", "J3" and "(engine)": the labels X3 and X4 only).')
p()
# ---------------- 6
p('## 6. Anti-cheat check (Anticheat Build, Anticheat Call deepseek, Anticheat Record)')
p()
ab=N('Anticheat_Build')['data']['main'][0]
ac=N('Anticheat_Call_deepseek')['data']['main'][0]
ar=main('Anticheat_Record')['acx']
p('Anticheat Build: 4 calls (items per call 23, 23, 31, 38 = 115 items), user text %s characters per call, not_checked [] on all 4. Anticheat Call deepseek: 4 replies, characters %s. Anticheat Record: skipped %s, record_only %s, counts %s; no_answer []; not_checked []; errors [].'%(', '.join(str(len(x['json']['body']['messages'][1]['content'])) for x in ab),', '.join(str(len(x['json']['choices'][0]['message']['content'])) for x in ac),ar['skipped'],ar['record_only'],json.dumps(ar['counts'])))
p()
p('Rows that were not CONSISTENT (9 of 115), whole:')
p()
for x in ar['rows']:
    if x['answer']!='CONSISTENT': p('- '+json.dumps(x,ensure_ascii=False))
p()
p('The DeepSeek reply lines for the 5 REVERSED items (whole):')
p()
for x in ac:
    for l in x['json']['choices'][0]['message']['content'].split('\n'):
        if re.match(r'ANTICHEAT: X(48|52|63|65|100) -- REVERSED',l): p('- `%s`'%l)
p()
p('Output notes: the Anticheat Record\'s `reversed` list holds the items shown to judges (shown true): X63 and X65 on the defender side (D), X100 on the challenger side (C); X48 and X52 are REVERSED with quote_not_found (shown false, note "QUOTE NOT FOUND"). The notes as the panel judges received them (Panel Build, judges[0].body.messages[3], identical text is repeated to each of the 3 panel judges; 3 distinct notes), in full:')
p()
notes=["[ANTI-CHEAT CHECK -- computed by the system's enforcer, not by a judge (a TRIAL check): this close round reverses the same side's own earlier reading of Galatians 4:4. The close says: \"So the flesh of David's seed is the flesh made of the woman\". The same side said earlier: \"I drop \"the woman alone\" and any claim that a row states Mary's own house.\". The close sentence is disregarded (this note by itself breaks no link; only a pair listed under CONFIRMED CLOSING CONTRADICTIONS is confirmed); grade this side's earlier answer on Galatians 4:4 on its own words, against the verse.]",
"[ANTI-CHEAT CHECK -- computed by the system's enforcer, not by a judge (a TRIAL check): this close round reverses the same side's own earlier reading of Romans 1:3. The close says: \"The flesh is the woman's by Romans 1:3 read with Galatians 4:4.\". The same side said earlier: \"I drop \"the woman alone\" and any claim that a row states Mary's own house.\". The close sentence is disregarded (this note by itself breaks no link; only a pair listed under CONFIRMED CLOSING CONTRADICTIONS is confirmed); grade this side's earlier answer on Romans 1:3 on its own words, against the verse.]",
"[ANTI-CHEAT CHECK -- computed by the system's enforcer, not by a judge (a TRIAL check): this close round reverses the same side's own earlier reading of Genesis 48:5. The close says: \"a son born to one father can be claimed by another, Genesis 48:5\". The same side said earlier: \"Jacob's claim falls on sons \"born unto\" Joseph, his own son. They were already of Jacob's loins. So the fathers' house claims its own seed.\". The close sentence is disregarded (this note by itself breaks no link; only a pair listed under CONFIRMED CLOSING CONTRADICTIONS is confirmed); grade this side's earlier answer on Genesis 48:5 on its own words, against the verse.]"]
for n in notes: p('- `%s`'%n)
p()
p('Pairs the closing enforcer also ruled on (same earlier sentence and same closing sentence):')
p()
p('- Anticheat X65 (D, Romans 1:3): closing `The flesh is the woman\'s by Romans 1:3 read with Galatians 4:4.` against earlier `I drop "the woman alone" and any claim that a row states Mary\'s own house.` The Close Enforcer ruled the same pair as candidate X2 (LINK 4): NOT A CONTRADICTION, why: "The close assigns the flesh to the woman but does not assert \\"the woman alone\\" or Mary\'s own house, and it fits the narrowed Link 4\'s \\"born of thee\\" and \\"made of a woman\\" footing." Anti-cheat ruling on the pair: REVERSED (shown to judges as a note). The two rulings differ on the same two sentences.')
p('- Anticheat X63 (D, Galatians 4:4): closing `So the flesh of David\'s seed is the flesh made of the woman` against the same earlier sentence. The Close Enforcer had no candidate on this closing sentence (X2 carries the sentence about Romans 1:3). The earlier sentence `I drop "the woman alone" and any claim that a row states Mary\'s own house.` is the earlier sentence of X2 (NOT A CONTRADICTION) and of Judge Contradiction candidate J2 (CONFIRMED, closing sentence "D1 to D5 stand as declared ...").')
p('- Anticheat X100 (C, Genesis 48:5): challenger side; the Close Enforcer ran no candidate on the challenger (reply "CLOSE-CONTRADICTION: NONE").')
p('- X48 and X52 (side C, quote not found): closing sentence `The flesh is the woman\'s by Romans 1:3 read with Galatians 4:4.` is the defender sentence of X2 (listed under side "C" with earlier_ok false; the note says QUOTE NOT FOUND).')
p()
# ---------------- 7
p('## 7. Judge Contradiction Build / Record and Assume Check Build / Record')
p()
jb=main('Judge_Contradiction_Build');jc=N('Judge_Contradiction_Call_deepseek')['data']['main'][0][0]['json'];jr=main('Judge_Contradiction_Record')
p('### 7a. Judge Contradiction (ran)')
p()
p('Input summary: Judge Contradiction Build cands_only true, answered_before 0, cec_skip false; 3 candidates built from the judges\' CONTRADICTION lines (side DEFENDER, link "?" at build); user text %d characters, system text 256 characters; call prompt_tokens %d, completion_tokens %d; one call; reply %d characters.'%(len(jb['body']['messages'][1]['content']),jc['usage']['prompt_tokens'],jc['usage']['completion_tokens'],len(jc['choices'][0]['message']['content'])))
p()
for c in jb['cands']:
    p('- %s %s LINK ?: earlier [%s] `%s`; closing [%s] `%s`; by: %s'%(c['id'],c['side'],c['earlier_round'],c['earlier_q'],c['closing_round'],c['closing_q'],c['by']))
p()
p('Output, raw reply in full:')
fence(jc['choices'][0]['message']['content'])
p('Judge Contradiction Record jcc: skipped false, none false, no_answer [], errors [], confirmed 3 (J1 link 1, J2 link 4, J3 link 2), rows 3 (all CONFIRMED). Closing block of all three: the opening block of [CR4] (sentence "D1 to D5 stand as declared, and I keep all five. I do not narrow or concede any."; shown whole in 2e). Earlier sentences and their blocks in [CR3]:')
p()
for r in jr['jcc']['confirmed']:
    q=r['earlier_q'].replace('‘',"'").replace('’',"'").replace('“','"').replace('”','"')
    eb,eh=block_text(row['engine_r3'],q.rstrip('.') )
    p('%s (LINK %s), why: `%s`'%(r['id'],r['link'],r['why']))
    p('Earlier sentence `%s` stands in [CR3] block "%s":'%(r['earlier_q'],eh))
    fence(eb or '(not located)')
    p()
p('Database rows (debate_enforcer_log ids 29899 to 29901, seat "judge contradiction enforcer", rule E-CLOSECON): J1 DEFENDER LINK 1, J2 DEFENDER LINK 4, J3 DEFENDER LINK 2, all CONFIRMED; prompt_sent 134,432 characters on the first row.')
p()
p('### 7b. Assume Check (ran)')
p()
ab_=main('Assume_Check_Build');ac_=N('Assume_Check_Call_deepseek')['data']['main'][0][0]['json'];ar_=main('Assume_Check_Record')
pm=ab_['prem'][0]
p('Input summary: Assume Check Build acx_skip false; 1 premise: side %s, premise number %d, link %d; ASSUMES text `%s`; ROWS GIVE `%s`; answering block [%s] LINK %d (the "**LINK 4: NARROWED TO:**" block of [CR3], %d characters; same block as the LINK 4 block shown in 2e); quotes extracted from the block: %d; prompt %d characters; one call, prompt_tokens %d, completion_tokens %d.'%(pm['side'],pm['n'],pm['link'],pm['assumes'],pm['rows_give'],pm['answer_round'],pm['link'],len(pm['block']),len(pm['quotes']),len(ab_['body']['messages'][1]['content']),ac_['usage']['prompt_tokens'],ac_['usage']['completion_tokens']))
p()
p('Raw reply in full:')
fence(ac_['choices'][0]['message']['content'])
p('Assume Check Record acx (whole facts):')
fence(json.dumps(ar_['acx'],indent=1,ensure_ascii=False))
p('Log rows (acx_log cure_reason, whole):')
for x in ar_['acx_log']: p('- `%s` : `%s`'%(x['item'],x['cure_reason']))
p()
# ---------------- 8
p('## 8. What the judges\' final verdicts say about closing contradictions (per seat)')
p()
p('Source: debate_judgments.verdict_raw (panel seats luna id 1128, chatgpt id 1129, sol id 1130 order by id; and the single judge\'s second opinion, debate_results.independent_verdict_raw). Lines are shown after unescaping the JSON newline and quote marks of the stored text. Included: every line that starts with "CONTRADICTION --"; every collision line carrying an engine audit text "[AUDIT: LINK n BROKEN BY A CONFIRMED CLOSING CONTRADICTION ...]" (shown whole, from the start of the line to the end of the line); every RESULT line. The engine\'s own AUDIT v25 recompute line and the v37 apply line are given whole for each panel seat. A line naming "engine-confirmed" does not occur in these verdicts (scanned).')
p()
single=sbody['independent_verdict_raw']
seats=[(x['judge_seat'],x['id'],unesc(x['verdict_raw'])) for x in jdg]+[('single judge',None,unesc(single))]
for seat,i,t in seats:
    p('### %s%s: verdict tag %s'%(seat,' (debate_judgments id %d)'%i if i else ' (second opinion)',(re.search(r'"verdict_tag"\s*:\s*"(\w+)"',t).group(1) if re.search(r'"verdict_tag"\s*:\s*"(\w+)"',t) else t.split()[0])))
    p()
    p('"engine-confirmed" occurrences: %d.'%t.lower().count('engine-confirmed'))
    out=[]
    L=t.split('\n')
    i2=0
    # collision lines with audit text possibly spanning lines
    full=t
    for m in re.finditer(r'\[AUDIT: LINK \d BROKEN BY A CONFIRMED CLOSING CONTRADICTION',full):
        ls=full.rfind('\n',0,m.start())+1
        end=full.find(']',m.start()); 
        # extend to the closing bracket ] that ends the audit (may contain nested [CR3])
        depth=0;k=m.start()
        while k<len(full):
            if full[k]=='[':depth+=1
            elif full[k]==']':
                depth-=1
                if depth==0:break
            k+=1
        le=full.find('\n',k)
        out.append(full[ls:le if le>=0 else len(full)])
    for l in L:
        if l.startswith('CONTRADICTION --') or l.startswith('RESULT:'): out.append(l)
        if l.startswith('[AUDIT v25') or l.startswith('[AUDIT v37'): out.append(l)
    fence('\n'.join(out))
    p()
open('/mnt/project-files/w3/grade_35067/facts_C_closing.md','w').write('\n'.join(W)+'\n')
print(len('\n'.join(W)))
