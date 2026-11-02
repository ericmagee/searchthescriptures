# patch.py (judge_fix6): builds new/<node>.js from base/<node>.js (the live code of ORACLE_DEBATE_V1 version 6ff18a54, read by GET on
# 2026-11-02 into data/workflow_live.json and data/live_code/) and lib/. Offline; writes only new/. Anchored replacements: it refuses when an
# anchor is not found the expected number of times. lib/old/ holds the judge_fix5 library text as it stands in the live nodes (checked here).
#  H1 one layer reader (lib/layers.js) for K-B, K-LB and the cure checks; K-LB reads [L2] anywhere in the tag, skips premises ruled VOID
#  H2 the cure check reads single quotation marks; a refused K-LB statement names the step that refused it
#  H3 the renumbering flag fires only on a stated numbering, a number above the declared ones, or a label that maps to a different link
#  H4 the close-round press check marks sentences under the other side's labels and headings and grading sentences, not own-position or report-only ones
#  H5 K-G9: NOT PRESSED needs a reason; a "K-G9 PASS: n verses ruled" line when a side passes
#  H6 the citation scan: item cap raised 300 -> 1000, the sentence's earlier reference tried for a quotation, every NOT CHECKED with its reason
#  H7 Failure Salvage copies the CACHE DIAG lines into review_notes
#  H8 ENF_STATUS (lib/status.js): LIVE or TRIAL; a TRIAL item never counts in drv_uncured
import os,sys,re
H=os.path.dirname(os.path.abspath(__file__));B=H+'/base';N=H+'/new';L=H+'/lib';os.makedirs(N,exist_ok=True)
def rep(s,old,new,nm,count=1):
    c=s.count(old)
    if c!=count: sys.exit(f'{nm}: anchor found {c} times, want {count}: {old[:120]!r}')
    return s.replace(old,new)
rd=lambda nm:open(f'{B}/{nm}.js').read()
lib=lambda n:open(f'{L}/{n}').read().rstrip('\n')
OLD={k:lib('old/'+k+'.js') for k in ('layers','citedin','blocks','close')}
NEW={k:lib(k+'.js') for k in ('layers','citedin','blocks','close','status')}
CHECK=['Panel Payloads','Alternate Payloads','Extract Independent Verdict']
CURE=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize',
      'Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']
C4P=['Panel Build','Build Independent Verdict','D4 Extract','C4 Extract','Build Save Body','Build Synthesis','Format Markdown','D4 Build','C4 Build']
OUT={}
def get(nm):
    if nm not in OUT: OUT[nm]=rd(nm)
    return OUT[nm]

# ======================= H8 + H1: the status table and the one layer reader, in every checker and cure node =======================
for nm in CHECK+CURE:
    s=get(nm)
    s=rep(s,OLD['layers'],NEW['status']+'\n'+NEW['layers'],nm)
    s=rep(s,OLD['citedin'],NEW['citedin'],nm)           # H5
    if nm in CHECK: s=rep(s,OLD['blocks'],NEW['blocks'],nm)   # H1
    OUT[nm]=s

# ======================= H8: drv_uncured counts LIVE items only =======================
s=get('Panel Payloads')
s=rep(s," p.drv_uncured=DRV.items.length; // 5B (BB-6969): fail-closed; Panel Cure Check lowers it to the UNCURED count.",
      " p.drv_uncured=DRV.items.filter(enfLive).length; // judge_fix6 H8: LIVE items only (ENF_STATUS). 5B (BB-6969): fail-closed; Panel Cure Check lowers it to the UNCURED count.",'Panel Payloads')
OUT['Panel Payloads']=s
s=get('Alternate Payloads')
s=rep(s,"  p.drv_uncured=DRV.items.length; // 5B fail-closed","  p.drv_uncured=DRV.items.filter(enfLive).length; // judge_fix6 H8: LIVE items only. 5B fail-closed",'Alternate Payloads')
OUT['Alternate Payloads']=s
s=get('Panel Cure Check')
s=rep(s,"b.payload.drv_uncured=v.filter(x=>x.status!=='CURED').length;","b.payload.drv_uncured=enfUncured(v); /* judge_fix6 H8: an uncured TRIAL item removes no seat */",'Panel Cure Check')
OUT['Panel Cure Check']=s
s=get('Alternate Merge')
s=rep(s,"  b.payload.drv_uncured=v.filter(x=>x.status!=='CURED').length;","  b.payload.drv_uncured=enfUncured(v); /* judge_fix6 H8 */",'Alternate Merge')
OUT['Alternate Merge']=s

# ======================= H2, H8, H5: the cure library (14 nodes) =======================
KLB_OLD=("  if(x.rule==='K-LB'){const st=stmtOf(x);const rk=x.side==='CHALLENGER'?'DR3':'CR3';\n"
 "   if(st&&!o.count.some(c=>c.side===x.side&&c.n>(x.conc||0))){const k=drvKinds(st);if(k.length>=2&&typeof R[rk]==='string'&&stmtQ(st).some(q=>cureFound(q,R[rk])))return res('CURED','statement quotes ['+rk+'] and exhibits '+k.join(' and '),['STATEMENT: '+st],k);}\n"
 "   return kCount(x,'no statement quoting ['+rk+'] with two layer kinds');}\n")
KLB_NEW=("  // judge_fix6 H2 (run 32293, enforcer row 81: the single judge's premise 4 statement was refused as \"no statement quoting [DR3] with two layer\n"
 "  // kinds\", though it quoted the block; the layer reader had read [L3] only): a refused statement names the step that refused it.\n"
 "  if(x.rule==='K-LB'){const st=stmtOf(x);const rk=x.side==='CHALLENGER'?'DR3':'CR3';let step='step 1 (statement): no STATEMENT line for the item';\n"
 "   if(st&&!o.count.some(c=>c.side===x.side&&c.n>(x.conc||0))){const k=drvKinds(st);const qs=stmtQ(st);const hit=typeof R[rk]==='string'&&qs.some(q=>cureFound(q,R[rk]));\n"
 "    if(k.length>=2&&hit)return res('CURED','statement quotes ['+rk+'] and exhibits '+k.join(' and '),['STATEMENT: '+st],k);\n"
 "    step=!qs.length?'step 2 (quotation): the STATEMENT quotes no words in quotation marks':!hit?'step 2 (quotation): no quotation in the STATEMENT stands in ['+rk+']':'step 3 (layer kinds): the STATEMENT exhibits '+(k.length?k.join(' and ')+' only':'no layer kind')+', fewer than two';}\n"
 "   else if(st)step='step 1 (statement): a CORRECTED COUNT was given, so the count is checked instead';\n"
 "   return kCount(x,'the STATEMENT was refused at '+step);}\n")
STMTQ_OLD="const stmtQ=(t)=>[...String(t||'').matchAll(/[\"“]([^\"”]{8,})[\"”]/g)].map(m=>m[1]);"
STMTQ_NEW=("const stmtQ=(t)=>[...String(t||'').matchAll(/[\"“]([^\"”]{8,})[\"”]|(?:^|[\\s(\\[{:;,—–-])['‘]([^\\n]{8,}?)['’](?=$|[\\s.,;:!?)\\]}\"”—–-])/g)].map(m=>m[1]||m[2]); "
 "// judge_fix6 H2 (run 32293: GLM's statements quoted in single marks, 'And he said unto me ...', and were refused): double or single marks")
KNEED_OLD="if(y.rule==='K-LB'&&y.premise!=null)ps.add('P'+y.premise); /* judge_fix5 G13 */}return ps.size;};"
KNEED_NEW=("if(y.rule==='K-LB'&&y.premise!=null&&(y===self||enfLive(y))&&!lbStated(y))ps.add('P'+y.premise); /* judge_fix5 G13; judge_fix6 H8: a TRIAL item, or one cured by "
 "statement, raises no other item's count */}return ps.size;};")
LBST=("  const lbStated=y=>{const st=stmtOf(y);const rk=y.side==='CHALLENGER'?'DR3':'CR3';return !!st&&drvKinds(st).length>=2&&typeof R[rk]==='string'&&stmtQ(st).some(q=>cureFound(q,R[rk]));};\n"
 "  const kNeed=(sd,self)=>{")
for nm in CURE:
    s=get(nm)
    s=rep(s,KLB_OLD,KLB_NEW,nm)
    s=rep(s,STMTQ_OLD,STMTQ_NEW,nm)
    s=rep(s,"  const kNeed=sd=>{",LBST,nm)
    s=rep(s,KNEED_OLD,KNEED_NEW,nm)
    s=rep(s,"const needN=(x.conc||0)+kNeed(x.side);","const needN=(x.conc||0)+kNeed(x.side,x);",nm)
    s=rep(s,"+kNeed(x.side);if(n9<needN)","+kNeed(x.side,x);if(n9<needN)",nm)
    # H5: the cure prompt's K-G9 form gives the reason; H2: either mark
    s=rep(s,"or NOT PRESSED: <book chapter:verse>. Ruling 372:","or NOT PRESSED: <book chapter:verse> -- <the reason, in one clause, e.g. quoted for the side's own chain, not against a link or listed premise of the other side> (a NOT PRESSED line with no reason is not a ruling). Ruling 372:",nm)
    s=rep(s,"NOT PRESSED: <book chapter:verse>   (a K-G9 ruling)","NOT PRESSED: <book chapter:verse> -- <the reason, in one clause>   (a K-G9 ruling)",nm)
    s=rep(s,"([L1] the KJV words quoted, [L2] the source word, [L3] the cross-reference named)","([L1] the KJV words quoted, in double or single quotation marks, [L2] the source word with its meaning, [L3] the cross-reference named)",nm)
    # H8: a TRIAL item's report line and enforcer row say so
    if 'function cureReport(seat,v)' in s:
        s=rep(s,"+(x.why?'; WHY: '+cureSafe(x.why):'')+(x.line?'; LINE: '","+((x.why||!enfLive(x))?'; WHY: '+cureSafe(enfTrialWhy(x,x.why)):'')+(x.line?'; LINE: '",nm)
    if 'function enfRows(meta,v,reply,body)' in s:
        s=rep(s,"cure_status:x.status,cure_reason:x.why||null,at:T}));}","cure_status:x.status,cure_reason:enfTrialWhy(x,x.why)||null,at:T}));} // judge_fix6 H8",nm)
    OUT[nm]=s

# ======================= H3, H4: the close-round library (9 nodes) =======================
for nm in C4P:
    s=get(nm);s=rep(s,OLD['close'],NEW['close'],nm);OUT[nm]=s
s=get('Build Save Body')
s=rep(s,"CLOSE-ROUND NUMBERING CHECK ('+sd+'4) -- the ","CLOSE-ROUND NUMBERING CHECK ('+sd+'4) -- a TRIAL check: the ",'Build Save Body')
s=rep(s,"CLOSE-ROUND GRADING CHECK ('+sd+'4) -- the ","CLOSE-ROUND GRADING CHECK ('+sd+'4) -- a TRIAL check: the ",'Build Save Body')
# H6: the stored citation items keep the reason of a NOT CHECKED item and the reference a quotation was moved to
s=rep(s,"items:(q.items||[]).map(i=>({side:i.side,round:i.round,ref:i.ref,status:i.status,link:(i.link==null?null:i.link),load_bearing:i.load_bearing===true}))};",
      "items:(q.items||[]).map(i=>({side:i.side,round:i.round,ref:i.ref,status:i.status,link:(i.link==null?null:i.link),load_bearing:i.load_bearing===true,...(i.reason?{reason:i.reason}:{}),...(i.rebound_from?{rebound_from:i.rebound_from}:{})})),...(q.scanned!=null?{scanned:q.scanned,item_cap:q.item_cap}:{})}; /* judge_fix6 H6 */",'Build Save Body')
OUT['Build Save Body']=s

# ======================= H5: the judges' rule text (Panel Build, Build Independent Verdict) =======================
for nm in ['Panel Build','Build Independent Verdict']:
    s=get(nm)
    s=rep(s,"NOT PRESSED: <book chapter:verse>. A verse is PRESSED when",
          "NOT PRESSED: <book chapter:verse> -- <the reason, in one clause, for example: quoted for the side's own chain, not against a link or listed premise of the other side>. A NOT PRESSED line with no reason is not a ruling. A verse is PRESSED when",nm)
    OUT[nm]=s

# ======================= H6: the citation report =======================
s=get('Citation Scan')
s=rep(s,"  let alt=null;if(am){const ab=am[1]?BK[key(am[1])]:book;if(ab)alt={ref:ab+' '+am[2]+':'+am[3],book:ab,chapter:+am[2],verse:+am[3]};}",
 "  let alt=null;if(am){const ab=am[1]?BK[key(am[1])]:book;if(ab)alt={ref:ab+' '+am[2]+':'+am[3],book:ab,chapter:+am[2],verse:+am[3]};}\n"
 "  // judge_fix6 H6 (run 32293 item 22: \"And Luke 1:32 gives the throne before the question of Luke 1:34: \\\"the Lord God shall give unto him the throne\n"
 "  // of his father David.\\\"\" was given to Luke 1:34, the reference nearest the quotation, and reported WORDS ARE AT Luke 1:32; the fallback looked only\n"
 "  // between the reference and the quotation): with no other fallback, a reference written earlier in the same sentence, its subject (the last\n"
 "  // one before the quoted reference that is not itself a citation closed by \")\"), is the fallback, tried only when the nearer reference fails (Quote Compare).\n"
 "  if(!alt){const bk=x=>x?(BK[key(x)]||BK[key(String(x).split(/\\s/).pop())]||null):null;const c0=clauseAt(t,m.index),seg=t.slice(c0,m.index);const er=[...seg.matchAll(AR)].filter(x=>bk(x[1])&&!/^[\\s*_]*\\)/.test(seg.slice(x.index+x[0].length)));\n"
 "   if(er.length){const e0=er[er.length-1],eb=bk(e0[1]);alt={ref:eb+' '+e0[2]+':'+e0[3],book:eb,chapter:+e0[2],verse:+e0[3],from:'the earlier reference of the same sentence'};}}",'Citation Scan')
s=rep(s,"const items3=items.slice(0,300);",
 "// judge_fix6 H6 (runs 32266, 32284, 32293: the report stopped at item 295 to 297, inside the defender's close; the scan kept its first 300 items and\n"
 "// dropped the rest unmarked): the item cap is raised to ITEM_CAP; an item past it is reported NOT CHECKED with that reason, never dropped.\n"
 "const ITEM_CAP=1000;const items3=items.slice(0,ITEM_CAP);const over=items.slice(ITEM_CAP).map(i=>({...i,over_cap:true}));",'Citation Scan')
s=rep(s,"return [{json:{items:items3.map(i=>(i.parts||[{chapter:i.chapter}]).every(p=>readK.has(i.book+'|'+p.chapter))?i:{...i,unread:true}),scanned:items.length,",
      "return [{json:{items:items3.map(i=>(i.parts||[{chapter:i.chapter}]).every(p=>readK.has(i.book+'|'+p.chapter))?i:{...i,unread:true}).concat(over),scanned:items.length,item_cap:ITEM_CAP,",'Citation Scan')
OUT['Citation Scan']=s
s=get('Quote Compare')
s=rep(s," if(i.unread)return {...i,status:'NOT CHECKED'};",
 " // judge_fix6 H6: every NOT CHECKED item carries its reason.\n"
 " if(i.over_cap)return {...i,status:'NOT CHECKED',reason:'past the citation scan\\'s item cap ('+S.item_cap+' items)'};\n"
 " if(i.unread)return {...i,status:'NOT CHECKED',reason:'the cited chapter was not read: the verse read\\'s address was full (7,000 characters)'};",'Quote Compare')
s=rep(s,"return {...i,status:'NOT CHECKED'};}const tw=new Set(words(cited));",
 "return {...i,status:'NOT CHECKED',reason:cited?'a quotation of fewer than three words of three letters is checked only as an exact phrase, and \"'+String(i.quote).slice(0,60)+'\" is not in the text of '+i.ref:'the cited verse '+i.ref+' is not in the KJV table'};}const tw=new Set(words(cited));",'Quote Compare')
s=rep(s,"return [{json:{items,url_find:url,","return [{json:{items,scanned:S.scanned,item_cap:S.item_cap,url_find:url,",'Quote Compare')
OUT['Quote Compare']=s
s=get('Quote Report')
s=rep(s,"return [{json:{checked:items.length,","return [{json:{scanned:C.scanned,item_cap:C.item_cap,checked:items.length,",'Quote Report')
OUT['Quote Report']=s

# ======================= H7: Failure Salvage keeps the CACHE DIAG lines =======================
s=get('Failure Salvage')
s=rep(s,"delete body.queue_id;body.framework_verdict=null;",
 "delete body.queue_id;body.framework_verdict=null;\n"
 "// judge_fix6 H7 (run 32300: a failed run's partial row lost the [CACHE DIAG ...] lines Build Save Body writes): each round Extract's cache_diag line\n"
 "// is copied into review_notes, in round order, unless already there (a failed save carries Build Save Body's notes).\n"
 "{const cd=[];['D1','C1','D2','C2','D3','C3','D4','C4'].forEach(r=>{const x=P(r+' Extract',j=>j.cache_diag);if(typeof x==='string'&&x&&!String(body.review_notes||'').includes(x))cd.push(x);});\n"
 " if(cd.length)body.review_notes=(body.review_notes?body.review_notes+' ':'')+cd.join(' ');}",'Failure Salvage')
OUT['Failure Salvage']=s

# ======================= write =======================
for nm,s in OUT.items():
    if s==rd(nm): sys.exit(nm+': unchanged')
    open(f'{N}/{nm}.js','w').write(s)
base=sorted(f[:-3] for f in os.listdir(B) if f.endswith('.js'))
if sorted(OUT)!=base: sys.exit('base/ and the nodes changed differ: '+str(sorted(set(base)^set(OUT))))
print('wrote',len(OUT),'nodes:',', '.join(sorted(OUT)))
