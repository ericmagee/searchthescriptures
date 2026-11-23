# ASK 531 build (W4; plan rev 1a de0e843c, PASS W2 10594/10599). Base: live engine 48513907 (fetch-back af95e833), child ac517c41 (e7f2c047).
# Usage: patch531.py <engine.json> <child.json> <out_engine.json> <out_child.json>
# CHANGE 1 Assume Check Record (engine): with the 524 marker ("EVERY VERSE THE" in the E-ASSUME prompt), a round 2 charge (r2, 91 and up) both readers find
#   NOT STATED gets a grade per judge (COUNTED when the judge's CONCEDED LINKS line counts it, or counts a premise k with the same fact), and an item for each
#   judge that does not; item rows read ENFORCED (pkgACX). acx gains m524 and vq (each side's quoted verses). Without the marker the node's output is unchanged.
#   The child's Assume Check Record is a pass-through of the engine's (Alternate Pass In), so it needs no change.
# CHANGE 2 Send Back Build (and Alt, R2 Alt): E-ASSUME items from acx.facts for each seat (alternates by their own CONCEDED LINKS line), with the rule text.
# CHANGE 3 Send Back Record (and Alt, R2 Alt): cure reading acx531Cure; uncured -> ACXM, counted in drv_uncured with AUDIT v65; sb_items carry acx.
# CHANGE 4 apply path (sbApply2024, in the gate and merge nodes): an E-ASSUME change is refused (pkgPS) when it regrades other premises, moves side, or counts
#   the same fact twice. psGrades(l,wide) reads 91 and up when wide is set; with no second argument it reads as today.
import json,sys,hashlib,re
VP4_STOP=['The','A','An','And','But','Or','Of','In','On','To','For','By','At','As','With','From','That','This','These','Those','He','His','Him','She','Her','It','Its','They','Their','I','We','Our','You','Your','Then','So','No','Not','Is','Was','Be','When','Where','Which','Who','Whom','Matthew','Mark','Luke','John','Acts','Romans','Genesis','Exodus','Isaiah','Numbers','Ruth','Samuel','Kings','Chronicles','Ezra','Corinthians','Galatians','Hebrews','Psalms','Psalm','Deuteronomy','Leviticus','Jeremiah']
STOP_JS="new Set("+json.dumps([w.lower() for w in VP4_STOP])+")"
ACX_FN=("function acx531Norm(s){/* ASK 531 (pkgACX, W4): lower case, a possessive 's dropped, letters and digits only */return String(s==null?'':s).replace(/\\\\+\"/g,'\"').toLowerCase().replace(/[\\u2018\\u2019]/g,\"'\").replace(/'s\\b/g,'').replace(/[^a-z0-9]+/g,' ').trim();}\n"
 "function acx531Stop(){return "+STOP_JS+";}\n"
 "function acx531Content(f){const S=acx531Stop();return [...new Set(acx531Norm(f).split(' ').filter(w=>w.length>3&&!S.has(w)))];}\n"
 "function acx531Names(f){const S=acx531Stop();const o=[];for(const m of String(f==null?'':f).replace(/[\"\\u201c\\u201d]/g,' ').matchAll(/\\b([A-Z][a-z]+)(?:['\\u2019]s)?\\b/g)){const w=m[1].toLowerCase();if(!S.has(w)&&!o.includes(w))o.push(w);}return o;}\n"
 "function acx531Same(fact,seg){/* THE SAME-FACT TEST (plan 531 rev 1a, section 3.1a): at least two content words of the fact stand in the premise's text, one of them a proper name in the fact */"
 "const W=new Set(acx531Norm(seg).split(' '));const sh=acx531Content(fact).filter(w=>W.has(w));const nm=acx531Names(fact);return sh.length>=2&&sh.some(w=>nm.includes(w));}\n"
 "function acx531Seg(line,k){/* the text a CONCEDED LINKS line gives premise k: from \"Premise k\" to the next \"Premise <n>\" */const t=String(line==null?'':line).replace(/\\\\+\"/g,'\"').replace(/[*_`]+/g,'');const ps=t.split(/(?=\\bPremises?\\s+\\d+\\b)/i).filter(x=>new RegExp('^Premises?\\\\s+'+k+'\\\\b','i').test(x));return ps.join(' ');}\n"
 "function acx531G(l){/* the Assume Check Record reading of a CONCEDED LINKS line (psG), reading 91 and up as well */const g={};let t=String(l==null?'':l).replace(/\\\\+\"/g,'\"').replace(/[*_`]+/g,'');const m=t.match(/^\\s*(?:[-\\u2022]\\s*|\\d+[.)]\\s*)?(DEFENDER\\s+|CHALLENGER\\s+)?CONCEDED LINKS\\s*:\\s*(\\d+)?\\s*(?:--|\\u2014|\\u2013)?/i);if(!m)return null;t=t.slice(m[0].length);\n"
 " t=t.replace(/\\([^()]*\\)/g,' ').replace(/\"[^\"\\n]*\"|\\u201c[^\\u201d\\n]*\\u201d/g,q=>/[.!?]\\s*[\"\\u201d]$/.test(q)?' . ':' ').replace(/(^|[\\s(\\[:;,])(['\\u2018](?:[^'\\u2019\\n]|['\\u2019](?=[A-Za-z]))+?['\\u2019])(?=$|[\\s.,;:!?)\\]])/g,(x,a,q)=>a+(/[.!?]\\s*['\\u2019]$/.test(q)?' . ':' '))\n"
 "  .replace(/\\[[^\\]]*\\]/g,' ').replace(/\\b\\d+:\\d+(?:[-\\u2013]\\d+)?\\b/g,' ').replace(/\\b(?:Commitment|Link|LINK|links?)\\s+\\d+\\b/g,' ').replace(/\\b[CDL]\\d+\\b/g,' ').replace(/\\b[123]\\s+(?:Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John)\\b/g,' ')\n"
 "  .replace(/\\b(\\d)\\s*[\\u2013\\u2014-]\\s*(\\d)\\b/g,(x,a,b)=>{const o=[];for(let i=+a;i<=+b;i++)o.push(i);return o.join(', ');});\n"
 " const W=/\\b(VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS)\\b/ig;\n"
 " for(const c0 of t.split(/;|\\.(?=\\s|$)/)){const c=c0.replace(/\\bnone\\s+counted\\b/ig,' ').replace(/\\b(?:(?:are|is|were|was|be|been)\\s+)?(?:not|never)\\s+counted\\b|\\buncounted\\b/ig,' spared ');W.lastIndex=0;const w=W.exec(c);if(!w)continue;const k=w[1].toUpperCase();const G=k==='VOID'?'VOID':(k==='UNEXHIBITED'||k==='CONCEDED'||k==='COUNTED')?'COUNTED':'SPARED';\n"
 "  for(const n of (c.match(/\\b(?:\\d|9\\d)\\b/g)||[]).map(Number))if(n>0&&!(n in g))g[n]=G;}\n"
 " return {side:m[1]&&/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER',n:m[2]!=null?+m[2]:null,g};}\n"
 "function acx531Line(raw,side){for(const l of String(raw==null?'':raw).replace(/\\\\n/g,'\\n').split('\\n')){const r=acx531G(l);if(r&&r.side===side)return {line:l.trim(),r};}return null;}\n"
 "function acx531R2(raw,side,n,fact){/* a round 2 charge: COUNTED when the judge counts premise n, or a premise k of its own whose text carries the same fact */const L=acx531Line(raw,side);if(!L)return {grade:'SPARED',k:null,line:''};if(L.r.g[n]==='COUNTED')return {grade:'COUNTED',k:n,line:L.line};\n"
 " const k=Object.keys(L.r.g).map(Number).find(k=>k!==n&&L.r.g[k]==='COUNTED'&&acx531Same(fact,acx531Seg(L.line,k)));return k!=null?{grade:'COUNTED',k,line:L.line}:{grade:'SPARED',k:null,line:L.line};}\n"
 "function acx531Items(acx,raw){/* ASK 531 (pkgACX): the E-ASSUME items for one seat, only on a run whose E-ASSUME call carried the 524 scope (acx.m524) */if(!acx||!acx.m524||!Array.isArray(acx.facts))return [];const out=[];\n"
 " for(const f of acx.facts){if(!f||!f.both_not_stated)continue;const L=acx531Line(raw,f.side);\n"
 "  if(f.r2){const r=acx531R2(raw,f.side,f.n,f.fact);if(r.grade!=='SPARED')continue;}else{const r=L?L.r:null;const g=r?((f.n in r.g)?r.g[f.n]:(!Object.keys(r.g).length&&r.n===0?'SPARED':null)):null;if(g!=='SPARED')continue;}\n"
 "  out.push({side:f.side,n:f.n,k:f.k||1,fact:f.fact,r2:!!f.r2,line:L?L.line:''});}return out;}\n"
 "function acx531Acx(){try{const a=$('Assume Check Record');if(!a||!a.isExecuted)return null;return (a.first().json||{}).acx||null;}catch(e){return null;}}\n"
 "function acx531Cure(it,a){/* ASK 531 (pkgACX) cure reading */const x=it.acx||{};const sd=String(x.side||'').toLowerCase();const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w+' (pkgACX, ASK 531)'});\n"
 " if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');\n"
 " if(a.ans==='KEEP'){const ac=acx531Acx();const vq=ac&&ac.vq&&Array.isArray(ac.vq[x.side])?ac.vq[x.side]:[];const V=' '+vq.map(acx531Norm).join(' | ')+' ';\n"
 "  const qs=[...String(a.why||'').replace(/\\\\+\"/g,'\"').matchAll(/[\"\\u201c]([^\"\\u201d]{2,})[\"\\u201d]/g)].map(m=>m[1]);const hit=qs.find(q=>{const n=acx531Norm(q);return n.split(' ').length>=4&&V.includes(' '+n+' ');});\n"
 "  return hit?R(true,'KEEP quotes verse words found in the '+sd+'\\'s quoted verses: \"'+hit.slice(0,120)+'\"'):R(false,'the KEEP quotes no verse words (4 or more in a row) found in the '+sd+'\\'s quoted verses');}\n"
 " if(a.ans!=='CHANGE')return R(false,'no KEEP or CHANGE');const to=String(a.to||'');const P=typeof psGrades==='function'?psGrades(to,true):null;\n"
 " if(!P||P.side!==x.side)return R(false,'the CHANGE TO is not the '+sd+' CONCEDED LINKS line');const cn=P.g[x.n]==='COUNTED';\n"
 " const ks=x.r2?Object.keys(P.g).map(Number).filter(k=>k!==x.n&&P.g[k]==='COUNTED'&&acx531Same(x.fact,acx531Seg(to,k))):[];\n"
 " if(cn&&ks.length)return R(false,'the same fact is counted twice (premise '+x.n+' and premise '+ks.join(', ')+')');\n"
 " const Q=psGrades(it.line,true);if(Q){const known=k=>(k in Q.g)?Q.g[k]:(!Object.keys(Q.g).length&&Q.n===0?'SPARED':null);const out=Object.keys(P.g).map(Number).filter(k=>k!==x.n&&!ks.includes(k)&&known(k)!=null&&known(k)!==P.g[k]);\n"
 "  if(out.length)return R(false,'the change regrades premise'+(out.length>1?'s ':' ')+out.join(', ')+', which this item does not name (pkgPS)');}\n"
 " if(cn)return R(true,'CHANGE TO counts premise '+x.n);if(ks.length)return R(true,'CHANGE TO counts premise '+ks[0]+', which carries the same fact');return R(false,'the CHANGE TO does not count premise '+x.n+(x.r2?' or a premise of the judge\\'s own that carries the same fact':''));}\n"
 "function acx531Apply(x,to,cu){/* ASK 531 (pkgACX): the apply path for an E-ASSUME change; returns the refusal, or null */const a=x.acx||{};const P=typeof psGrades==='function'?psGrades(to,true):null,Q=typeof psGrades==='function'?psGrades(cu,true):null;\n"
 " if(!P)return 'the change for an E-ASSUME item must be the '+String(a.side||'').toLowerCase()+' CONCEDED LINKS line with its label and count (pkgACX)';if(!Q)return null;if(P.side!==Q.side)return 'the change moves the '+Q.side+' CONCEDED LINKS line to the '+P.side+' side (pkgPS)';\n"
 " const ks=a.r2?Object.keys(P.g).map(Number).filter(k=>k!==a.n&&P.g[k]==='COUNTED'&&acx531Same(a.fact,acx531Seg(to,k))):[];if(P.g[a.n]==='COUNTED'&&ks.length)return 'the same fact is counted twice (premise '+a.n+' and premise '+ks.join(', ')+'; pkgACX: count it once)';\n"
 " const named=new Set([a.n].concat(ks));const known=k=>(k in Q.g)?Q.g[k]:(!Object.keys(Q.g).length&&Q.n===0?'SPARED':null);const out=Object.keys(P.g).map(Number).filter(k=>!named.has(k)&&known(k)!=null&&known(k)!==P.g[k]);\n"
 " const jump=P.n!=null&&Q.n!=null&&Math.abs(P.n-Q.n)>named.size;if(out.length||jump)return 'the change regrades '+(out.length?'premise'+(out.length>1?'s ':' ')+out.join(', '):'the count from '+Q.n+' to '+P.n)+', which its item does not name (named: '+[...named].join(', ')+'; pkgPS)';return null;}")
SBB_BLOCK=("try{const __acx=acx531Acx();if(__acx&&__acx.m524){const __aS=__acxAlt?new Set([].concat(((PCC&&PCC.alt_seats)||[]).map(x=>x&&x.seat),typeof E421!=='undefined'?[].concat(E421,E428).filter(x=>x&&x.seat_role==='alternate').map(x=>x.seat):[]).filter(Boolean)):null; /* alternates: the seats Alt Seated names, and any alternate an enforcer row names */const __tx=r=>String(r||'').replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"'); /* ASK 531 (pkgACX): E-ASSUME items */\n"
 " for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__p.judge_seat||(__acxAlt&&(!__aS||!__aS.has(__p.judge_seat))))continue;\n"
 "  const __t=__tx(__p.verdict_raw).split('\\n').filter(l=>!/^\\s*\\[(?:AUDIT|EXTRACTOR)\\b/.test(l)).join('\\n');\n"
 "  for(const __x of acx531Items(__acx,__t)){const __s=__x.side.toLowerCase();dis.push({seat:__p.judge_seat,seat_role:__acxAlt?'alternate':'panel',rule:'E-ASSUME',item:'premise listed against the '+__s+' '+__x.n+' FACT '+__x.k,flagged_line:__x.line,response_line:__x.line,"
 "cure_reason:'ENFORCER DISAGREE: ASSUMPTION (E-ASSUME, ENFORCED, pkgACX, ASK 531): premise '+__x.n+' of the '+__s+' takes as given \"'+__x.fact+'\". Neither the enforcer nor the code finds a verse the '+__s+' quoted that states it, and your CONCEDED LINKS line does not count it.',acx:{side:__x.side,n:__x.n,k:__x.k,fact:__x.fact,r2:__x.r2}});}}}}catch(e){}")
ACX_R=("const __acxR=i=>{if(!i.acx)return '';const s=String(i.acx.side||'').toLowerCase(),S=i.acx.side==='CHALLENGER'?'CHALLENGER ':'',n=i.acx.n;return '\\nTHE ASSUMPTION RULE (E-ASSUME, ENFORCED, pkgACX): premise '+n+' of the '+s+' takes as given \"'+i.acx.fact+'\". Neither the enforcer nor the code finds a verse the '+s+' quoted that states it. "
 "Either count it (CHANGE TO your '+S+'CONCEDED LINKS line, grading premise '+n+' UNEXHIBITED), or KEEP and quote the verse words, from the '+s+'\\'s own rounds, that state it.'+(i.acx.r2?' This fact stands in the defender\\'s round 2 charges. If a premise of your own list already carries it, count that premise and name its number. If none does, write it as premise '+n+' on your CONCEDED LINKS line, and your count rises by one. Count it once.':'');};")
CNT_LOOP=(" for(const [seat,its] of Object.entries(ACXM)){const i=bodies.findIndex(x=>__seatOf(x)===seat);if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;\n"
 "  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;acx_counted.push({seat,items:its});\n"
 "  p.verdict_raw=p.verdict_raw+'\\n[AUDIT v65: ASSUMPTION UNCURED (pkgACX, ASK 531) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}")
REP=[ # (old, new) on Library lines; each old occurs once in the Library
 ("function psGrades(l){const g={};","function psGrades(l,wide){const g={};"),
 ("for(const n of (c.match(/\\b\\d\\b/g)||[]).map(Number))if(n>0&&!(n in g))g[n]=G;}","for(const n of (c.match(wide?/\\b(?:\\d|9\\d)\\b/g:/\\b\\d\\b/g)||[]).map(Number))if(n>0&&!(n in g))g[n]=G;}"),
 ("const __psg=x.rule==='E-GATE'&&x.psrc?","if(x.rule==='E-ASSUME'&&x.acx&&typeof acx531Apply==='function'){const __ar=acx531Apply(x,to,map.has(o)?map.get(o).to:o);if(__ar){items.push({sid:x.sid,kind:'NOT APPLIED',why:__ar,to,lines:[o]});continue;}} /* ASK 531 (pkgACX) */const __psg=x.rule==='E-GATE'&&x.psrc?"),
 ("imp:x.imp||null,ksc:x.ksc||null","imp:x.imp||null,acx:x.acx||null,ksc:x.ksc||null"),
 ("+__mnpR(i)+__impR(i)+__kscR(i)","+__mnpR(i)+__impR(i)+__acxR(i)+__kscR(i)"),
 ("imp:i.imp||null,ksc:i.ksc||null","imp:i.imp||null,acx:i.acx||null,ksc:i.ksc||null"),
 ("if(it.imp){try{__ec=IMP.cure(","if(it.acx){try{__ec=acx531Cure(it,a||{ans:'NO ANSWER'});}catch(e){__ec={status:'UNREAD',why:'assumption cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* ASK 531 (pkgACX) */\n  if(it.imp){try{__ec=IMP.cure("),
 ("why:a?a.why:(err?'no reply: '+err:'no SENDBACK line for this item')});","why:a?a.why:(err?'no reply: '+err:'no SENDBACK line for this item'),...(it.acx?{acx:it.acx}:{})});"),
 ("const IMPM={};","const IMPM={};const ACXM={};"),
 ("const imp_counted=[];","const imp_counted=[];const acx_counted=[];"),
 ("imp_counted,","imp_counted,acx_counted,"),
]
IMPM2="else if(it.imp&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';"
ACXM_ST=("\n  if(it.acx&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED'&&!__oaSkip(it,a,rows[rows.length-1],b.seat))(ACXM[b.seat]=ACXM[b.seat]||[]).push(it.sid+' (E-ASSUME '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';}\n"
 "  else if(it.acx&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';")
IMPR_END="const __impR=i=>"
SB=[('Send Back Record',"$('Panel Cure Check').first().json.bodies"),('Alt Send Back Record',"$('Alt Seated').first().json.bodies"),('R2 Alt Send Back Record',"$('R2 Alt Seated').first().json.bodies")]
# Assume Check Record (engine node) replacements
AC=[
 ("const B=$('Assume Check Build').first().json;","const B=$('Assume Check Build').first().json;const M524=/EVERY VERSE THE/.test(String(((((B.body||{}).messages||[])[1])||{}).content||'')); /* ASK 531 (pkgACX): the 524 scope marker */"),
 ("const spared=p.r2?[]:judges.map(j=>({seat:j.seat,grade:gradeOf(j.raw,p.side,p.n)}));","const spared=p.r2?(M524?judges.map(j=>{const g=acx531R2(j.raw,p.side,p.n,x.fact);return {seat:j.seat,grade:g.grade,...(g.k!=null&&g.k!==p.n?{same_fact_premise:g.k}:{})};}):[]):judges.map(j=>({seat:j.seat,grade:gradeOf(j.raw,p.side,p.n)}));"),
 ("cure_status:'ITEM (TRIAL)',","cure_status:M524?'ITEM (ENFORCED)':'ITEM (TRIAL)',"),
 ("return OUT({skipped:false,model:B.model||'',facts,items,errors:err?[err]:[]},acx_log);",
  "return OUT({skipped:false,model:B.model||'',facts,items,errors:err?[err]:[],...(M524?{m524:true,vq:(()=>{const o={DEFENDER:[],CHALLENGER:[]};for(const p of B.prem||[]){const a=o[p.side];if(!a)continue;for(const q of (p.quotes||[]).concat(p.case_quotes||[]))if(!a.includes(q))a.push(q);}return o;})()}:{})},acx_log);"),
]
AC_TRIAL="RECORD-ONLY TRIAL (VP4): nothing is sent back and no seat is removed.'"
AC_ENF="'+(M524?'ENFORCED (pkgACX, ASK 531): sent back to the seat.':'RECORD-ONLY TRIAL (VP4): nothing is sent back and no seat is removed.')"
def libparts(t):
    a=t.index('\n/*LIB*/')+8;b=t.rindex('\n/*MAP*/');c=b+8;e=t.rindex('\n/*END*/');return a,b,c,e,json.loads(t[a:b]),json.loads(t[c:e])
def one(L,old):
    h=[i for i,l in enumerate(L) if old in l];assert len(h)==1 and L[h[0]].count(old)==1,(old[:70],h);return h[0]
def has(p,i): return any((isinstance(e,int) and e==i) or (isinstance(e,list) and isinstance(e[0],int) and e[0]<=i<=e[-1]) for e in p)
def build_lib(t):
    a,b,c,e,L,M=libparts(t);changed=[]
    iApply=one(L,"const __psg=x.rule==='E-GATE'&&x.psrc?")
    for o,n in REP: i=one(L,o);L[i]=L[i].replace(o,n);changed.append(i)
    i=one(L,IMPM2);L[i]=L[i].replace(IMPM2,IMPM2+ACXM_ST);changed.append(i)
    i=one(L,IMPR_END);assert L[i].rstrip().endswith(';'),L[i][-80:];L[i]=L[i]+'\n'+ACX_R;changed.append(i)
    nF=len(L);L.append(ACX_FN);nB=len(L);L.append(SBB_BLOCK);nC=len(L);L.append(CNT_LOOP)
    # the functions go first in every node that holds the apply path, the send-back build or the send-back record
    for k in M:
        p=M[k]['p']
        if has(p,iApply) or k in ('Send Back Build','Alt Send Back Build','R2 Alt Send Back Build') or k in [s for s,_ in SB]: p.insert(0,nF)
    # send-back build: the E-ASSUME block last, just before the items are grouped by seat (const MAX=60), so every earlier item keeps its number
    iMax=one(L,"const MAX=60;const bySeat=new Map();");assert iMax==2923 and L[2922].rstrip().endswith(';'),L[2922][-40:]
    for k,alt in (('Send Back Build',False),('Alt Send Back Build',True),('R2 Alt Send Back Build',True)):
        p=M[k]['p'];j=[q for q,x in enumerate(p) if x==[2920,2957]];assert len(j)==1,k
        p[j[0]:j[0]+1]=[[2920,2922],["const __acxAlt="+('true' if alt else 'false')+";"],nB,[2923,2957]]
    for k,src in SB:
        p=M[k]['p'];j=[q for q,x in enumerate(p) if isinstance(x,list) and isinstance(x[0],str) and x[0].startswith('if(Object.keys(IMPM).length)')];assert len(j)==1,k
        assert p[j[0]+1]==[2832,2834],p[j[0]+1]
        p[j[0]+2:j[0]+2]=[["if(Object.keys(ACXM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:"+src+")).slice();"],nC]
    newsha=hashlib.sha256(json.dumps(L,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()[:16]
    head=re.sub(r'library sha [0-9a-f]{16}','library sha '+newsha,t[:a-8],count=1)
    def code(k): return '\n'.join((L[x] if isinstance(x,int) else (x[0] if isinstance(x[0],str) else '\n'.join(L[x[0]:x[1]+1]))) for x in M[k]['p'])
    ch=[]
    for k in M:
        nl=len(code(k))
        if M[k].get('n')!=nl: M[k]['n']=nl;ch.append(k)
    print('lines changed',sorted(set(changed)),'appended',nF,nB,nC,'sha',newsha,'MAP n changed',len(ch),ch)
    return head+'\n/*LIB*/'+json.dumps(L,ensure_ascii=False)+'\n/*MAP*/'+json.dumps(M,ensure_ascii=False)+'\n/*END*/'+t[e+8:],L
def patch_stub(js,name):
    o=re.match(r'if\(false\)\{((?:\$\((?:"[^"]*"|String\(\))\);)*)\}',js);assert o,js[:80];assert '$("'+name+'")' not in o.group(1)
    return js[:o.end()-1]+'$("'+name+'");'+js[o.end()-1:]
def patch_ac(js):
    for o,n in AC: assert js.count(o)==1,o[:60];js=js.replace(o,n)
    assert js.count(AC_TRIAL)==1;js=js.replace(AC_TRIAL,AC_ENF)
    i=js.index('try{');return js[:i]+ACX_FN+'\n'+js[i:]
STUBS=['Send Back Build','Alt Send Back Build','R2 Alt Send Back Build','Send Back Record','Alt Send Back Record','R2 Alt Send Back Record']
def patch(src,dst,kind):
    d=json.load(open(src));N={n['name']:n for n in d['nodes']}
    lib,L=build_lib(N['Shared Library']['parameters']['jsCode']);N['Shared Library']['parameters']['jsCode']=lib
    if kind=='engine': N['Assume Check Record']['parameters']['jsCode']=patch_ac(N['Assume Check Record']['parameters']['jsCode'])
    else: assert 'Alternate Pass In' in N['Assume Check Record']['parameters']['jsCode']
    for s in STUBS:
        if s in N and len(N[s]['parameters']['jsCode'])>200: N[s]['parameters']['jsCode']=patch_stub(N[s]['parameters']['jsCode'],'Assume Check Record')
    json.dump(d,open(dst,'w'),ensure_ascii=False);return L
if __name__=='__main__':
    e,c,oe,oc=sys.argv[1:5]
    L1=patch(e,oe,'engine');L2=patch(c,oc,'child');assert L1==L2;print('engine and child LIB equal')
