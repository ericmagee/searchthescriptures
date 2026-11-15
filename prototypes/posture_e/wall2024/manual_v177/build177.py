import hashlib,re
src=open('v176.txt',encoding='utf-8').read()
assert hashlib.md5(src.encode()).hexdigest()=='8fe1cc3950b4a668630b4d3e8d2f2017'
dr=open('entries177_draft.md',encoding='utf-8').read().split('\n')
def block(start):
    """lines from the one starting with `start` until a blank line or a heading"""
    idx=[k for k,l in enumerate(dr) if l.startswith(start)]; assert len(idx)==1,(start,idx)
    k=idx[0]; m=k+1
    while m<len(dr) and dr[m].strip() and not dr[m].startswith('#'): m+=1
    return dr[k:m]
def bl(start): return '\n'.join(block(start))
E={}
E['325']=bl('- A CLOSING CONTRADICTION WHOSE EARLIER WORDS')
E['327']=bl('- THE debate_removals VIEW NAMES')
E['328']=bl('- A FAILED ALTERNATE REPLY RECORDS')
E['R460']='\n'.join(block('- RULING 460 (operator')[:]) 
E['R461']=bl('- RULING 461 (operator')
E['330']=bl('- THE K-UNX GATE AND ITS CURE CHECK ACCEPT')
E['331']=bl('- A JUDGE OR ALTERNATE WHOSE UNCURED LINE')
E['329']=bl('- A RECORD-ONLY TRIAL BINDS EACH [L2] TAG')
own=block('- The operator, 15 Nov 2026 09:17 CST')
own=[l for l in own if not l.startswith('- Not yet approved')]
E['OWN']='- RULING, OWN-LANGUAGE [L2]: an [L2] word counts only at a verse in its own language; a Greek word on a Hebrew verse, or a Hebrew word on a Greek verse, is NOT COUNTED, even when the block cites both testaments.\n'+'\n'.join('  '+l for l in own)
# 333: recast as an entry
b333=block('- Entry text (when written):')
t=b333[0].replace('- Entry text (when written): ','')
E['333']='- THE ORACLE SEAT\'S ROUND 2 IS ITS PREMISE-LIST ROUND, NOT A CLOSE (ASK 333; C2 Build, Oracle seat only):\n  - '+t[0].upper()+t[1:]+'\n'+'\n'.join(b333[1:])
E['334']=bl('- THE ORACLE SEAT MAY CHARGE AN ASSUMED FACT IN ROUND 2')
E['335']=bl('- THE ORACLE SEAT ANSWERS A HOUSE REGISTER')
E['335']=E['335'].replace('  - Not included: a line on "came together" (Matthew 1:18 with 1:24 and 1:25), which needs its own order (W3 7012 (c)).','  - Its part (c), the "came together" line, needed its own order; it was written later as ASK 341.')
E['336']=bl('- AN [L2] LIST BINDS TO THE RUN OF [L1] PARAGRAPHS')
E['336']=E['336'].replace('The ASK 329 trial reads COUNTED tags, so newly counted tags reach it.','The ASK 329 trial reads COUNTED tags, so newly counted tags reach it. The departure from D4 for a paragraph that names its own verse in book-less form ("(1:24)", 32791 DR1) is closed by ASK 342.')
e337=block('- C2 Build only, once: the ASSUMES placeholder')
E['337']='- THE ROUND 2 ASSUMES PLACEHOLDER NO LONGER CARRIES ", not what it infers" (ASK 337; C2 Build only):\n  - '+e337[0][2:]+'\n'+'\n'.join(e337[1:])
e341=block('- GUARDHOLD in Init with Guards gains, once')
E['341']='- THE ORACLE SEAT READS "CAME TOGETHER" AS THE COMING UNDER ONE ROOF (ASK 341; Init with Guards, GUARDHOLD, Oracle seat only, Ruling 383):\n  - What it does: '+e341[0][2:]+'\n'+'\n'.join(e341[1:])
e342=block('- __run336 is replaced in the same 22 copies')
E['342']='- AN [L2] PARAGRAPH THAT NAMES ITS OWN VERSE IN BOOK-LESS FORM BINDS TO THAT VERSE (ASK 342 with condition e; 22 copies of tags(rounds), as ASK 336; counted path):\n  - What it does: '+e342[0][2:]+'\n'+'\n'.join(e342[1:])
for k,v in E.items(): assert v.strip() and '##' not in v,k
lines=src.split('\n')
def ind(l): return len(l)-len(l.lstrip(' '))
def find1(pred,what):
    idx=[k for k,l in enumerate(lines) if pred(l)]; assert len(idx)==1,(what,idx); return idx[0]
def after_entry(prefix):
    k=find1(lambda l:l.lstrip().startswith(prefix),prefix); d=ind(lines[k]); m=k+1
    while m<len(lines) and lines[m].strip() and ind(lines[m])>d: m+=1
    return m,d
def before_heading(h):
    k=find1(lambda l:l==h,h); m=k
    while lines[m-1]=='' : m-=1
    return m,0
def shift(txt,d): return '\n'.join(' '*d+l for l in txt.split('\n'))
ins=[]
m,d=after_entry('- AN [L2] MEANING IN THE ORACLE\'S ROUNDS IS THE LEXICON GLOSS'); ins.append((m,shift(E['335']+'\n'+E['341'],d)))
m,d=after_entry('- C2 CLOSING ends with UNSUPPORTED-L4 PREMISES'); ins.append((m,shift(E['333']+'\n'+E['334']+'\n'+E['337'],d)))
m,d=before_heading('## 9. Enforcers'); ins.append((m,E['R460']+'\n'+E['R461']+'\n'+E['OWN']))
m,d=after_entry('- A DEFENDER CLOSE THAT RESTATES A NARROWED LINK\'S ROUND 1 HEADING'); ins.append((m,shift(E['325'],d)))
m,d=after_entry('- THE K-UNX GATE OFFERS THE ASSUMES ROUTE ON ITS PLAIN PATH'); ins.append((m,shift(E['330'],d)))
m,d=before_heading('## 11. Persistence and the column map (crossed columns: read before any query)'); ins.append((m,E['327']+'\n'+E['328']+'\n'+E['331']))
m,d=after_entry('- A "(Gn)" THAT POINTS TO A GRANT LABEL'); ins.append((m,shift(E['329']+'\n'+E['336']+'\n'+E['342'],d)))
for m,t in sorted(ins,key=lambda x:-x[0]): lines[m:m]=t.split('\n')
c='\n'.join(lines)
def rep(old,new):
    global c; assert c.count(old)==1,(c.count(old),old[:80]); c=c.replace(old,new)
rep('- C2 CLOSING ends with UNSUPPORTED-L4 PREMISES','- C2 PREMISE-LIST ROUND (round 2 of 4) ends with UNSUPPORTED-L4 PREMISES')
rep(' Three options, none preferred.',' Three options, none preferred. The case-sensitive UNXA_ASM pattern was a code misread. Offering the ASSUMES route on the plain path extends the gate rule to a case its stated rule did not reach (an assumed fact with no row); that extension was the operator\'s decision, given by his card for ASK 323.')
rep('- Live flow: s218 (n8n version ffc2f775, 455 nodes; Shared Library 947,963 characters, sha 2bff75837e74ad16).','- Live flow: s227 (n8n version d23c65ca, 455 nodes; Shared Library 963,897 characters, sha 515f047ee6cad94f).')
rep('s218 = s217 + pkgGLB (ASK 324).','s218 = s217 + pkgGLB (ASK 324). s219 (5d26ce38) = s218 + ASKs 325, 330, 331. s220 (b799dd0b) = s219 + ASK 328; the debate_removals view change (ASK 327) is database only. s221 (67e89720) = s220 + ASK 329 (record-only trial). s222 (3a290d4c) = s221 + ASKs 333, 335. s223 (e7cde216) = s222 + ASK 334 rev 2. s224 (985572ac) = s223 + ASK 336 rev 2. s225 (657d2953) = s224 + ASK 337. s226 (defaa968) = s225 + ASK 341. s227 (d23c65ca) = s226 + ASK 342 with condition e. Run 37510 ran on s221: it exercised ASKs 327, 328 and 329; 325, 330 and 331 were not exercised; 333 to 337, 341 and 342 are UNEXERCISED until a run.')
# open item for the operator from the correction
k=c.index('## 17. Known open items (verify live before acting)'); k2=c.index('\n',k)+1
note=[l for l in dr if l.startswith('- Open for the operator (Worker_A3 6912 item 8)')]; assert len(note)==1
c=c[:k2]+note[0]+'\n'+c[k2:]
open('engine_manual_v177_draft.txt','w',encoding='utf-8').write(c)
print(len(src),len(c),hashlib.md5(c.encode()).hexdigest())
for wd in ['WRITTEN AS s2','UNEXERCISED','HELD until','fill on','Fill on','(when written)']: print(wd,c.count(wd))
