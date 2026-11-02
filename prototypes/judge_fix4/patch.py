# patch.py (judge_fix4): builds new/<node>.js from base/<node>.js (the live code of ORACLE_DEBATE_V1 version d9ec1e19, read by GET on
# 2026-11-02; base/ equals judge_fix3/new for every node judge_fix3 changed). Offline; writes only new/. Anchored replacements: it refuses
# when an anchor is not found the expected number of times. No node is added and no connection is changed.
#  F1 recompute after a cure (counts, standings, verdict, RESULT) from the cured lines; written to the row and the stored text, AUDIT kept
#  F2 K-DG8 removed (rulings 382, 383): the mark, its cure item and every judge-facing text on Matthew 1:18 and 1:25
#  F3 cure parser: RETRACTED <label> with whatever follows; each item's own refused line
#  F4 K-C, K-S, K-S2, K-U, K-SC read the judge's own ground clause (quotes and the declared link wording removed)
#  F5 defender close: NEW IN CLOSE, NOT COUNTED; round-4 rule for the judges; the close keeps the declared numbering (flagged when not)
#  F6 a bare chapter:verse names a verse only with its book earlier in the same sentence (ledger, K-G4, K-G6)
#  F7 citation check: MATCHES (MARGIN)      F8 UNEXHIBITED per ruling 372 in every rule copy; ruling 372 in "How to read"
#  F9 synthesis checks printed in the transcript      F10 shortened-quotation check behind one switch, default OFF
import os,sys,re
H=os.path.dirname(os.path.abspath(__file__));B=H+'/base';N=H+'/new';os.makedirs(N,exist_ok=True)
def rep(s,old,new,nm,count=1):
    c=s.count(old)
    if c!=count: sys.exit(f'{nm}: anchor found {c} times, want {count}: {old[:100]!r}')
    return s.replace(old,new)
def cut(s,a,b,new,nm):  # replace the span from anchor a (once) through the first b after it (inclusive)
    if s.count(a)!=1: sys.exit(f'{nm}: span start found {s.count(a)} times: {a[:80]!r}')
    i=s.index(a);j=s.find(b,i)
    if j<0: sys.exit(f'{nm}: span end not found: {b[:80]!r}')
    return s[:i]+new+s[j+len(b):]
rd=lambda nm:open(f'{B}/{nm}.js').read()
CURE_NODES=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize',
            'Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']
CHECK_NODES=['Panel Payloads','Alternate Payloads','Extract Independent Verdict']
OUT={}

# ======================= F2: K-DG8 removed (shared checker block, 17 nodes) =======================
F2_NOTE=('// judge_fix4 F2 (operator rulings 382 and 383, 2026-11-02: "only \'Debate Oracle\' is bound by the guards and the judges grade the text\n'
         '// (evidence present to them) alone"; "we can not impose our corpus on the judges"): K-DG8, the judge check on Matthew 1:18 and 1:25 read\n'
         '// against the union, is removed with its cure item and its cure-rule text. Drift guard 8 binds the Oracle debater seat only, and the\n'
         '// synthesis audits that seat alone (Build Synthesis, section 3).\n')
def f2(s,nm):
    s=cut(s,'// judge_fix2 E5 (K-DG8;','\n return out;}\n',F2_NOTE,nm)
    for v in ('DG8_','dg8Lines'):
        pass
    m=re.search(r"\n for\(const n of dg8Lines\(text\)\)\{[^\n]*",s)
    if not m: sys.exit(nm+': dg8Lines call not found')
    s=s[:m.start()]+s[m.end():]
    s=rep(s,"// judge_fix2 E1, E2, E5 (K-N, K-SC, K-DG8): items with a cure, as K-C.","// judge_fix2 E1, E2 (K-N, K-SC): items with a cure, as K-C (judge_fix4 F2: K-DG8 removed).",nm)
    if 'DG8_' in s or 'dg8Lines(text)' in s: sys.exit(nm+': a DG8 reference is left')
    return s
def f2_cure(s,nm):
    s=cut(s,'stands. "\n +"K-DG8 (a line whose ground','whose ground does not rest on that reading.";','stands.";',nm)
    s=rep(s,"  // judge_fix2 E1, E4, E5: K-N, K-K and K-DG8 are cured by one RESTATED line for the item that its own test no longer marks.\n  if(x.rule==='K-N'||x.rule==='K-K'||x.rule==='K-DG8'){const rs=cureRest(o,x);const test=x.rule==='K-N'?knLines:x.rule==='K-K'?kkLines:dg8Lines;",
          "  // judge_fix2 E1, E4: K-N and K-K are cured by one RESTATED line for the item that its own test no longer marks (judge_fix4 F2: K-DG8 removed).\n  if(x.rule==='K-N'||x.rule==='K-K'){const rs=cureRest(o,x);const test=x.rule==='K-N'?knLines:kkLines;",nm)
    s=rep(s,"x.rule==='K-K'||x.rule==='K-DG8')","x.rule==='K-K')",nm,count=3)
    s=rep(s,"   if(x.rule==='K-DG8'&&/LINK BROKEN$/.test(rs[0].grade||'')&&o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line]);\n","",nm)
    for bad in ("'K-DG8'",'the record holds','DG-8 holds','dg8Lines','K-DG8 (a line'):
        if bad in s: sys.exit(f'{nm}: {bad} left in code or text')
    return s

# ======================= F4: the judge's own ground clause =======================
F4_DEF=r'''// judge_fix4 F4 (run 32266, problems D and E; Worker_E item 3: GLM's KEYSTONE was refused because it quoted the defender's own link "his flesh
// came from Mary alone"; run 32212: the single-verse check matched the defender's quoted concession): the pattern checks K-C, K-S, K-S2, K-U and
// K-SC read only the judge's own ground clause. On a line with GROUND: that is the text after its last GROUND:; on a line without it, the line
// after its label. Quoted text (double quotes, a round's words in single quotes) and the declared link wording (a run of six or more words of a
// DECLARED CHAIN link, read from the judge's prompt) are removed first, so a quotation of either side is never read as the judge's reasoning.
// K-N reads the judge's CONCEDED (stated) tag outside the quotes and tests the quoted words as the side's words (unchanged). The answer-test
// mask (netMask) still runs on the clause; whether the line names an answering round is still read on the whole line.
const GROUND_HEAD=/^(?:[-•]|\d+[.)])?\s*(?:D\d+(?:\s+vs\.?\s+C\d+(?:\s*\/\s*C\d+)*)?(?:\s*\([^)]*\))?|KEYSTONE|RESULT|CLAUSE|REASONING|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*:?\s*/i;
function drvUnlink(t,dl){const W=x=>[...String(x).matchAll(/[A-Za-z0-9’']+/g)].map(m=>m[0].toLowerCase().replace(/’/g,"'"));const toks=[...String(t).matchAll(/[A-Za-z0-9’']+/g)];const tw=toks.map(m=>m[0].toLowerCase().replace(/’/g,"'"));const cut=[];
 for(const L of dl||[]){const lw=W(L);if(lw.length<6)continue;const pos=new Map();lw.forEach((w,i)=>{if(!pos.has(w))pos.set(w,[]);pos.get(w).push(i);});
  for(let i=0;i<tw.length;i++){const st=pos.get(tw[i]);if(!st)continue;let best=0;for(const j of st){let k=0;while(i+k<tw.length&&j+k<lw.length&&tw[i+k]===lw[j+k])k++;if(k>best)best=k;}
   if(best>=6){cut.push([toks[i].index,toks[i+best-1].index+toks[i+best-1][0].length]);i+=best-1;}}}
 if(!cut.length)return t;cut.sort((a,b)=>a[0]-b[0]);const mg=[];for(const c of cut){const l=mg[mg.length-1];if(l&&c[0]<=l[1])l[1]=Math.max(l[1],c[1]);else mg.push(c.slice());}
 let s=String(t);for(let k=mg.length-1;k>=0;k--)s=s.slice(0,mg[k][0])+'[link]'+s.slice(mg[k][1]);return s;}
function drvGround(line,dl){let t=String(line||'').replace(/[*_`]+/g,'');const gs=[...t.matchAll(/\bGROUND\s*:/gi)];
 if(gs.length){const g=gs[gs.length-1];t=t.slice(g.index+g[0].length);}else t=t.trim().replace(GROUND_HEAD,'');
 t=t.replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'");return Array.isArray(dl)&&dl.length?drvUnlink(t,dl):t;}
// The declared links, from the judge's prompt: the numbered lines under its first DECLARED CHAIN heading, each up to its "Footing:".
function drvLinks(ptext){const t=String(ptext||'');const i=t.search(/DECLARED CHAIN\b/);if(i<0)return [];const L=[];
 for(const l of t.slice(i).split('\n').slice(1)){const m=l.match(/^\s*\**\s*(\d+)[.)]\s+(\S.*)$/);if(m){L.push(m[2].replace(/\s*Footing\s*:.*$/i,'').replace(/[*_`]+/g,''));continue;}if(L.length&&l.trim()&&!/^\s/.test(l))break;}
 return L;}
'''
def f4(s,nm):
    s=rep(s,"function drvCheck(text,dConc,cConc,dStand,cStand,askedCC){",F4_DEF+"function drvCheck(text,dConc,cConc,dStand,cStand,askedCC,DL){ /* judge_fix4 F4: DL, the declared link wording */",nm)
    s=rep(s,"if((gs==='UNDERDETERMINED'||gs==='STANDS')&&DRV_STATE.test(line)&&!DRV_ANS.test(line)){","if((gs==='UNDERDETERMINED'||gs==='STANDS')&&DRV_STATE.test(drvGround(line,DL))&&!DRV_ANS.test(line)){ /* judge_fix4 F4 */",nm)
    s=rep(s,"if(DRV_STATE.test(line)&&(DRV_ANS.test(line)||DRV_BARE.test(line)))marks.push(","if(DRV_STATE.test(drvGround(line,DL))&&(DRV_ANS.test(line)||DRV_BARE.test(line)))marks.push(",nm)
    s=rep(s,"const un=drvUnans(line);","const un=drvUnans(drvGround(line,DL));",nm)
    s=rep(s,"for(const n of scLines(text)){","for(const n of scLines(text,DL)){",nm)
    s=rep(s,"for(const n of netLines(text)){","for(const n of netLines(text,null,DL)){",nm)
    s=rep(s,"function scLines(text){","function scLines(text,DL){",nm)
    s=rep(s,"const lq=line.replace(NET_QUOTE,'\"[quote]\"');const om=lq.match(SC_CONC);","const lq=drvGround(line,DL);const om=lq.match(SC_CONC); /* judge_fix4 F4: the judge's own ground clause */",nm)
    s=rep(s,"function netLines(text,links){","function netLines(text,links,DL){",nm)
    s=rep(s,"const clauses=line.replace(NET_QUOTE,'\"[quote]\"').replace(NET_QUOTE1,\"'[quote]'\").split(","const clauses=drvGround(line,DL).split( /* judge_fix4 F4: the judge's own ground clause, quotes and link wording removed */",nm)
    s=rep(s,"function netKeeps(text){for(const c0 of String(text||'').replace(/[*_`]+/g,'').replace(NET_QUOTE,'\"[quote]\"').split(","function netKeeps(text){for(const c0 of drvGround(String(text||''),null).split( /* judge_fix4 F4 */",nm)
    return s

# ======================= F3: the cure parser =======================
F3_RETR_OLD="  if(k[1]==='RETRACTED'&&(m=r.match(/^D(\\d+)\\s+vs\\.?\\s+C(\\d+)$/i)))o.withdrawn.push({link:cureId(m[1],m[2]),line:l});"
F3_RETR_NEW=r"""  // judge_fix4 F3 (run 32266: GLM's "RETRACTED: D1 vs C6 (Matthew 1:18) -- regraded UNDERDETERMINED -- [DR1] answered ..." was refused as
  // malformed, ten times): a RETRACTED line counts when it opens with the item label (D<n> vs C<m>, a rule name before it allowed); whatever
  // follows is read as its regrade (the first grade word) and its reason. A regrade to a LINK BROKEN grade is no retraction (malformed).
  if(k[1]==='RETRACTED'&&(m=r.match(/^(?:K-[A-Z]+\d*\s+)?D(\d+)\s+vs\.?\s+C(\d+)\b(.*)$/i))&&!/\bLINK\s+BROKEN\b/i.test(m[3].replace(/\bnot\s+(?:a\s+)?(?:\S+\s+)?LINK\s+BROKEN\b/ig,''))){const rest=m[3].trim();const g=(rest.toUpperCase().match(/\b(UNDERDETERMINED|STANDS)\b/)||[])[1]||null;
   o.withdrawn.push({link:cureId(m[1],m[2]),line:l,regrade:g,reason:rest.replace(/^\([^)]*\)\s*/,'').replace(/^(?:--|—|-|:)\s*/,'').replace(/^(?:re)?grade[sd]?\s+(?:to\s+)?(?:UNDERDETERMINED|STANDS)\s*(?:--|—|-|:)?\s*/i,'').trim()||null});}"""
F3_CAR_OLD="const carriers=o.statement.map(s=>({name:fold(s.label)+' '+strip(s.text),body:strip(s.text)})).concat(o.prose.map(p=>{const t=strip(p);return {name:t,body:t};}));"
F3_CAR_NEW="const carriers=o.statement.map(s=>({name:fold(s.label)+' '+strip(s.text),body:strip(s.text)})).concat(o.prose.map(p=>{const t=strip(p);return {name:t,body:t};})).concat(o.withdrawn.filter(w=>w.reason).map(w=>({name:w.link+' '+strip(w.reason),body:strip(w.reason)}))); /* judge_fix4 F3: a RETRACTED line carries its own reason */"
F3_REST_OLD="function cureRest(o,x){const V=s=>String(s==null?'':s).toUpperCase().replace(/\\s+/g,' ').trim();const L=V(x.link);const ex=o.restated.filter(r=>V(r.link)===L);if(ex.length)return ex;"
F3_REST_NEW=F3_REST_OLD+"\n // judge_fix4 F3: with no RESTATED line, a RETRACTED line that carries its regrade is the restated line of that collision.\n {const wr=o.withdrawn.filter(w=>w.reason&&V(w.link)===L).map(w=>({link:w.link,grade:w.regrade||'UNDERDETERMINED',text:w.link+' '+w.reason,line:w.line,retraction:true}));if(wr.length)return wr.slice(0,1);}"
F3_BAD_OLD="const bad=status==='UNCURED'?o.malformed.find(l=>keys.some(k=>k&&U(l).includes(U(k)))):null;"
F3_BAD_NEW="const bad=status==='UNCURED'?o.malformed.find(l=>cureOwn(l,x)):null; /* judge_fix4 F3: the item's own refused line, never the first one found */"
F3_OWN=r'''// judge_fix4 F3 (run 32266: the table quoted GLM's first malformed line, "RETRACTED: D1 vs C6", under nearly every item): a malformed line is an
// item's own when, after its keyword and an optional rule name, it opens with that item's label (for K-G3, "<SIDE> STANDING").
function cureOwn(l,x){const b=String(l).replace(/^[A-Z ]+:\s*/,'').replace(/^K-[A-Z]+\d*\s+/i,'').toUpperCase().replace(/\s+VS\.?\s+/g,' VS ').replace(/\s+/g,' ');
 const lab=x.rule==='K-G3'?String(x.side||'')+' STANDING':String(x.link||'').toUpperCase().replace(/\s+VS\.?\s+/g,' VS ').replace(/\s+/g,' ');
 return !!lab&&b.startsWith(lab)&&!/[0-9A-Z]/.test(b.charAt(lab.length));}
'''

# ======================= F6: a bare reference and its book (K-G4) =======================
F6_REFS_OLD="function cureRefs(t){const out=[];const s=String(t||'');let last=null;const re="
F6_REFS_NEW=("// judge_fix4 F6 (run 32266: \"(1:24)\" in [CR2] was read as naming Matthew 1:24): with scoped, a bare chapter:verse takes the last book named only when\n"
             "// no sentence ends between that book's reference and it (ruling 376: book, chapter and verse stated).\n"
             "const CURE_SENT=/[.!?][\"”'’)\\]]*\\s+(?=[\"“'‘(\\[]*[A-Z])|\\n/;\n"
             "function cureRefs(t,scoped){const out=[];const s=String(t||'');let last=null,lastEnd=-1;const re=")
F6_LAST_OLD="bk=(n?n[1]+' ':'')+(CURE_BK[base0]||base0.slice(0,3));last=bk;}"
F6_LAST_NEW="bk=(n?n[1]+' ':'')+(CURE_BK[base0]||base0.slice(0,3));last=bk;lastEnd=m.index+m[0].length;}else if(scoped&&(lastEnd<0||CURE_SENT.test(s.slice(lastEnd,m.index))))bk=null; /* judge_fix4 F6 */"
F6_KG4_OLD="const h=cureRefs(R[k]).find(r=>r.key===w);"
F6_KG4_NEW="const h=cureRefs(R[k],true).find(r=>r.key===w); /* judge_fix4 F6 */"

# ======================= F1: recompute after a cure =======================
F1_LIB=r'''// judge_fix4 F1 (run 32266: DeepSeek retracted "D6 vs C4 (Matthew 1:25): CHALLENGER LINK BROKEN", the only ground of its CHALLENGE STANDING
// PROP-DEPENDENT and its RESULT DEFENDER WINS, and neither was recomputed; GLM likewise). After a cure that retracts or regrades a collision line,
// or corrects a count, the seat's counts, standings, verdict and RESULT are recomputed from the cured lines by the rulebook's own definitions
// (engine_manual v85 section 8): STANDINGS (SELF-SUPPORTED requires a count of 0; PROP-DEPENDENT at 1 or more, or while a link of that side is
// graded BROKEN (K-G3); COLLAPSED when 2c > L), VERDICT DEFINITIONS (first match: BROKEN-1 k >= 1; BROKEN-2 2w > n or the keystone WITHDRAWN;
// PARTIAL-1 w >= 1; PARTIAL-2 DEFENSE STANDING COLLAPSED; HELD-1), RESULT (BROKEN gives CHALLENGER WINS; HELD gives DEFENDER WINS only if the
// challenge is not SELF-SUPPORTED or a collision stands graded CHALLENGER LINK BROKEN; every other case UNDERDETERMINED). The values are written
// to the seat's fields and its stored text (the RESULT, STANDING, count, CLAUSE and retracted or regraded collision lines are replaced); the
// original values and lines stay in one AUDIT line. Applied before the panel outcome is derived; the single judge's record too.
function rcObjEnd(t,a){let d=0,q=false;for(let i=a;i<t.length;i++){const c=t[i];if(q){if(c==='\\')i++;else if(c==='"')q=false;continue;}if(c==='"')q=true;else if(c==='{')d++;else if(c==='}'&&--d===0)return i+1;}return -1;}
// The judgment's own text: a panel row's "reasoning" (the JSON object that opens the row), or the single judge's text before its AUDIT lines.
function cureJText(raw,panel){const s=String(raw||'');if(!panel){const i=s.indexOf('\n\n[AUDIT');return i<0?s:s.slice(0,i);}
 const a=s.indexOf('{');const b=a<0?-1:rcObjEnd(s,a);if(b>0){try{const o=JSON.parse(s.slice(a,b));if(o&&typeof o.reasoning==='string')return o.reasoning;if(o&&typeof o.reason==='string')return o.reason;}catch(e){}}return cureUnwrap(s);}
function rcLines(text){const out={col:[],clause:null,key:null,result:null,st:{},cn:{},wdn:0};
 for(const raw of String(text||'').split('\n')){const l=raw.replace(/[*_`]+/g,'').trim();const u=l.toUpperCase();if(!l)continue;
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+)\s+VS\.?\s+(C\d+)\b/);if(m){const g=(u.slice(m[0].length).match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/)||[])[1]||null;out.col.push({link:m[1]+' vs '+m[2],grade:g,raw});continue;}
  if(/^(?:[-•]|\d+[.)])?\s*D\d+\s*:?\s*(?:--|—|-|:)?\s*WITHDRAWN\b/.test(u))out.wdn++;
  if(/^CLAUSE\s*:/.test(u)){if(!out.clause)out.clause={raw,u};continue;}if(/^KEYSTONE\s*:/.test(u)){if(!out.key)out.key={raw,u};continue;}if(/^RESULT\s*:/.test(u)){if(!out.result)out.result={raw,u};continue;}
  const s=u.match(/^(DEFENSE|CHALLENGE) STANDING\s*:/);if(s){if(!out.st[s[1]])out.st[s[1]]={raw,u};continue;}
  const c=u.match(/^(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:/);if(c&&!out.cn[c[1]])out.cn[c[1]]={raw,u};}
 return out;}
const rcOne=s=>String(s||'').replace(/\s+/g,' ').trim();
const rcCut=s=>{s=rcOne(s);return s.length>300?s.slice(0,297)+'...':s;};
// F: the seat's current fields {verdict_tag, defense_standing, conceded_links, challenge_standing, challenger_conceded_links}. Returns null when
// the cure retracted, regraded or recounted nothing; else the recomputed fields, RESULT word, CLAUSE tag, line replacements and the AUDIT line.
function cureRecompute(seat,text,F,items,v,reply){const o=cureLines(reply&&reply.ok?reply.text:'');const U=s=>String(s==null?'':s).toUpperCase();const P=rcLines(text);
 const rsn=cureReasoned(o,(items||[]).map(x=>x.line));const wd=o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))):[];
 const trig=[];const rp=[];const col=P.col.map(c=>({...c}));const done=new Set();
 for(const w of wd){const c=col.find(z=>U(z.link)===U(w.link));if(!c||done.has(U(c.link)))continue;done.add(U(c.link));
  const rs=o.restated.find(r=>U(r.link)===U(w.link)&&r.grade&&!/LINK BROKEN$/.test(r.grade));const g=rs?rs.grade:(w.regrade||'UNDERDETERMINED');
  const nl=rs?rs.text:(w.link+((c.raw.match(/\([^)]*\d+:\d+[^)]*\)/)||[''])[0]?' '+(c.raw.match(/\([^)]*\d+:\d+[^)]*\)/)||[''])[0]:'')+': '+g+' -- retracted in the cure'+(w.reason?' -- '+w.reason:''));
  trig.push('RETRACTED '+w.link+' ('+(c.grade||'?')+' to '+g+')');c.grade=g;rp.push([c.raw,nl]);}
 for(const x of (v||[]).filter(y=>y.status==='CURED'&&/^D\d+ vs C\d+$/i.test(String(y.link||'')))){const c=col.find(z=>U(z.link)===U(x.link));if(!c||done.has(U(c.link)))continue;
  const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length!==1||!rs[0].grade||rs[0].grade==='STANDS'||rs[0].grade===c.grade)continue;done.add(U(c.link));
  trig.push('RESTATED '+x.link+' ('+(c.grade||'?')+' to '+rs[0].grade+')');c.grade=rs[0].grade;rp.push([c.raw,rs[0].text]);}
 const cs=cureSet(reply,v);const cnt={DEFENDER:F.conceded_links,CHALLENGER:F.challenger_conceded_links};const lab={DEFENDER:'CONCEDED LINKS',CHALLENGER:'CHALLENGER CONCEDED LINKS'};const cnew={};
 for(const sd of ['DEFENDER','CHALLENGER']){let n=null,from=null;
  const rc=o.restated.filter(r=>r.link===lab[sd]);const ok=(v||[]).some(x=>x.status==='CURED'&&(U(x.link)===lab[sd]||(x.rule==='K-SC'&&/restated count/.test(String(x.why||'')))));
  if(rc.length===1&&ok){const lead=rc[0].text.match(/^\s*(\d+)\b/);n=lead?+lead[1]:new Set(cntItems(lab[sd]+': '+rc[0].text).filter(i=>i.tag==='CONCEDED'||i.tag==='UNEXHIBITED').map(i=>i.n)).size;from=rc[0].text;}
  if(cs&&cs[sd]&&cs[sd].n!=null){n=cs[sd].n;from=null;trig.push('CORRECTED COUNT '+sd+' '+n);} /* a cured CORRECTED COUNT is a trigger even when already written to the fields */
  if(n!=null&&n!==cnt[sd]){trig.push('COUNT '+sd+' '+cnt[sd]+' to '+n);cnew[sd]={n,from};}}
 if(!trig.length)return null;
 const c={DEFENDER:cnew.DEFENDER?cnew.DEFENDER.n:cnt.DEFENDER,CHALLENGER:cnew.CHALLENGER?cnew.CHALLENGER.n:cnt.CHALLENGER};
 const Lof=k=>{const x=P.st[k];const m=x&&x.u.match(/\bL\s*=\s*(\d+)/);return m?+m[1]:null;};
 const brk={DEFENDER:col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length,CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length};
 const stand=(sd,k,orig)=>{const x=P.st[k];if(x&&/FORFEIT/.test(x.u))return orig;const L=Lof(k),n=c[sd];if(typeof n!=='number')return orig;
  if(L!=null&&2*n>L)return 'COLLAPSED';if(L==null&&orig==='COLLAPSED'&&n>0)return 'COLLAPSED';return (n>=1||brk[sd]>0)?'PROP-DEPENDENT':'SELF-SUPPORTED';};
 const dst=stand('DEFENDER','DEFENSE',F.defense_standing),cst=stand('CHALLENGER','CHALLENGE',F.challenge_standing);
 const cl=P.clause?P.clause.u:'';const nN=(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(cl.match(/\bW\s*=\s*(\d+)/)||[])[1];const n=nN!=null?+nN:null;const w=wN!=null?+wN:P.wdn;
 const kw=!!(P.key&&/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*WITHDRAWN\b/.test(P.key.u));const k=brk.DEFENDER;
 const tag=k>=1?'BROKEN-1':((n!=null&&2*w>n)||kw)?'BROKEN-2':w>=1?'PARTIAL-1':dst==='COLLAPSED'?'PARTIAL-2':'HELD-1';const word=tag.split('-')[0];
 const res=word==='BROKEN'?'CHALLENGER WINS':word==='HELD'?((cst!=='SELF-SUPPORTED'||brk.CHALLENGER>0)?'DEFENDER WINS':'UNDERDETERMINED'):'UNDERDETERMINED';
 const res0=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;
 const why='recomputed after the cure from the cured lines ('+trig.join('; ')+')';
 if(P.result&&res!==res0)rp.push([P.result.raw,'RESULT: '+res+' -- '+why+': '+tag+', CHALLENGE STANDING '+cst+', '+(brk.CHALLENGER?brk.CHALLENGER+' collision line(s) stand graded CHALLENGER LINK BROKEN':'no collision line stands graded CHALLENGER LINK BROKEN')+'.']);
 for(const [sd,k2,st,st0] of [['DEFENDER','DEFENSE',dst,F.defense_standing],['CHALLENGER','CHALLENGE',cst,F.challenge_standing]]){const x=P.st[k2];
  if(x&&(st!==st0||c[sd]!==cnt[sd]))rp.push([x.raw,k2+' STANDING: '+st+' -- L='+(Lof(k2)!=null?Lof(k2):'?')+' c='+c[sd]+' -- '+why+'.']);
  const y=P.cn[lab[sd]];if(y&&cnew[sd])rp.push([y.raw,lab[sd]+': '+c[sd]+' -- '+why+(cnew[sd].from?' -- '+cnew[sd].from.replace(/^\s*\d+\s*(?:--|—|-|:)?\s*/,''):'')+'.']);}
 if(P.clause&&!new RegExp('^CLAUSE\\s*:\\s*'+tag+'\\b').test(P.clause.u))rp.push([P.clause.raw,P.clause.raw.replace(/^(\s*[*_]*CLAUSE[*_]*\s*:\s*[*_]*)(?:[A-Z]+-\d)?/i,'$1'+tag+' ').replace(/\bk\s*=\s*\d+/i,'k='+k)]);
 const fields={verdict_tag:word,defense_standing:dst,conceded_links:c.DEFENDER,challenge_standing:cst,challenger_conceded_links:c.CHALLENGER};
 const f=(t,d,dc,s2,cc,r)=>t+', DEFENSE '+d+' '+dc+', CHALLENGE '+s2+' '+cc+', RESULT '+(r||'none');
 const audit='[AUDIT v25: RECOMPUTED AFTER CURE -- '+(seat?'SEAT: '+seat+'; ':'')+'TRIGGER: '+cureSafe(trig.join(', '))+'; ORIGINAL: '+f(F.verdict_tag,F.defense_standing,F.conceded_links,F.challenge_standing,F.challenger_conceded_links,res0)
  +'; RECOMPUTED: '+f(word+' ('+tag+')',dst,c.DEFENDER,cst,c.CHALLENGER,res)+'; RULE: engine_manual v85 section 8, STANDINGS, RESULT and VERDICT DEFINITIONS'
  +(rp.length?'; ORIGINAL LINES: '+cureSafe(rp.map(r=>rcCut(r[0])).join(' / ')).replace(/\bRESULT\s*:/g,'RESULT --').replace(/\{/g,'(').replace(/\}/g,')'):'')+']';
 return {fields,result:res,result0:res0,tag,trig,rp,audit,retracted:wd.map(x=>x.link)};}
// The recomputed lines and fields written into the stored text: in a panel row, inside its JSON object (each line JSON-encoded in place, else the
// object re-serialized) with its typed fields; in the single judge's text, before its AUDIT lines. The AUDIT line is appended. When the verdict word
// changes, a CORRECTED RESULT line in the form derive_debate_outcome reads (judgment_result_word) is put first after the object.
function cureRewrite(raw,panel,R,seat,F0){let s=String(raw||'');const enc=x=>JSON.stringify(String(x)).slice(1,-1);
 if(panel){const a=s.indexOf('{');const b=a<0?-1:rcObjEnd(s,a);if(b>0){let j=s.slice(a,b);let miss=false;
   for(const [o0,n0] of R.rp){const e=enc(o0);if(j.includes(e))j=j.replace(e,()=>enc(n0));else miss=true;}
   if(miss){try{const ob=JSON.parse(j);let t=typeof ob.reasoning==='string'?ob.reasoning:'';for(const [o0,n0] of R.rp)t=t.replace(o0,()=>n0);ob.reasoning=t;j=JSON.stringify(ob,null,2);}catch(e){}}
   const F=R.fields;j=j.replace(/("verdict_tag"\s*:\s*")[A-Z]+(")/,'$1'+F.verdict_tag+'$2').replace(/("defense_standing"\s*:\s*")[A-Z-]+(")/,'$1'+F.defense_standing+'$2').replace(/("challenge_standing"\s*:\s*")[A-Z-]+(")/,'$1'+F.challenge_standing+'$2')
    .replace(/("conceded_links"\s*:\s*)\d+/,'$1'+F.conceded_links).replace(/("challenger_conceded_links"\s*:\s*)\d+/,'$1'+F.challenger_conceded_links);
   const cr=(F0&&F0.verdict_tag&&F0.verdict_tag!==F.verdict_tag)?'\n[AUDIT v21: CORRECTED RESULT -- '+(seat?'SEAT: '+seat+'; ':'')+'ORIGINAL: '+F0.verdict_tag+'; COUNTED: '+F.verdict_tag+' ('+R.tag+'); RETRACTED: '+R.retracted.join(', ')+']':'';
   s=s.slice(0,a)+j+cr+s.slice(b);}}
 else{const i=s.indexOf('\n\n[AUDIT');let t=i<0?s:s.slice(0,i);const rest=i<0?'':s.slice(i);for(const [o0,n0] of R.rp)t=t.replace(o0,()=>n0);s=t+rest;}
 return s+'\n'+R.audit;}
'''
F1_PCC_OLD=" {const ch=cureCountHeld(r?r.reply:null,v,cs,s.seat);if(ch.length)b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+ch.join('\\n');}\n bodies[i]=JSON.stringify(b);});"
F1_PCC_NEW=(" {const ch=cureCountHeld(r?r.reply:null,v,cs,s.seat);if(ch.length)b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+ch.join('\\n');}\n"
            " // judge_fix4 F1: the seat's counts, standings, verdict and RESULT recomputed from the cured lines, written to its row and its text.\n"
            " {const F0={verdict_tag:b.payload.verdict_tag,defense_standing:b.payload.defense_standing,conceded_links:b.payload.conceded_links,challenge_standing:b.payload.challenge_standing,challenger_conceded_links:b.payload.challenger_conceded_links};\n"
            "  const rc=cureRecompute(s.seat,cureJText(b.payload.verdict_raw,true),F0,all,v,r?r.reply:null);if(rc){b.payload.verdict_raw=cureRewrite(b.payload.verdict_raw,true,rc,s.seat,F0);Object.assign(b.payload,rc.fields);s.recomputed={trigger:rc.trig,fields:rc.fields,result:rc.result};}}\n"
            " bodies[i]=JSON.stringify(b);});")
F1_AM_OLD="  {const ch=cureCountHeld(c?c.reply:null,v,cs,a.seat);if(ch.length)b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+ch.join('\\n');}}"
F1_AM_NEW=("  {const ch=cureCountHeld(c?c.reply:null,v,cs,a.seat);if(ch.length)b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+ch.join('\\n');}\n"
           "  // judge_fix4 F1: recomputed from the cured lines, before the seat is seated or refused.\n"
           "  {const F0={verdict_tag:b.payload.verdict_tag,defense_standing:b.payload.defense_standing,conceded_links:b.payload.conceded_links,challenge_standing:b.payload.challenge_standing,challenger_conceded_links:b.payload.challenger_conceded_links};\n"
           "   const rc=cureRecompute(a.seat,cureJText(b.payload.verdict_raw,true),F0,r.drv,v,c?c.reply:null);if(rc){b.payload.verdict_raw=cureRewrite(b.payload.verdict_raw,true,rc,a.seat,F0);Object.assign(b.payload,rc.fields);}}}")
F1_CC_OLD="const enforcer_log=enfRows({run_token:$('Init Seats').first().json.run_token,seat:'single',role:'single',model:(r&&r.cure&&r.cure.model)||base.judge_model||null},v,r?r.reply:null,r&&r.cure?r.cure.body:null); // judge_fix2 W2\nreturn [{json:{...base,enforcer_log,...(cc?{verdict_tag:cc.word}:{}),...(cs?B2:{}),independent_verdict_raw:base.independent_verdict_raw+'\\n\\n'+cureReport(null,v)"
F1_CC_NEW=("const enforcer_log=enfRows({run_token:$('Init Seats').first().json.run_token,seat:'single',role:'single',model:(r&&r.cure&&r.cure.model)||base.judge_model||null},v,r?r.reply:null,r&&r.cure?r.cure.body:null); // judge_fix2 W2\n"
           "// judge_fix4 F1: the single judge's record is recomputed from its cured lines too (its text, verdict, standings and counts; it moves no panel verdict).\n"
           "const F0={verdict_tag:cc?cc.word:base.verdict_tag,defense_standing:cs?B2.defense_standing:base.defense_standing,conceded_links:cs?B2.conceded_links:base.conceded_links,challenge_standing:cs?B2.challenge_standing:base.challenge_standing,challenger_conceded_links:cs?B2.challenger_conceded_links:base.challenger_conceded_links};\n"
           "const RC=cureRecompute(null,cureJText(base.independent_verdict_raw,false),F0,all,v,r?r.reply:null);\n"
           "const RAW0=RC?cureRewrite(base.independent_verdict_raw,false,{...RC,audit:''},null,null).replace(/\\n$/,''):base.independent_verdict_raw;\n"
           "return [{json:{...base,enforcer_log,...(cc?{verdict_tag:cc.word}:{}),...(cs?B2:{}),...(RC?RC.fields:{}),recomputed:RC?{trigger:RC.trig,fields:RC.fields,result:RC.result}:null,independent_verdict_raw:RAW0+'\\n\\n'+cureReport(null,v)")
F1_CC_TAIL_OLD=".concat(cureCountHeld(r?r.reply:null,v,cs,null)).join('\\n'),debate_rule_report:"
F1_CC_TAIL_NEW=".concat(cureCountHeld(r?r.reply:null,v,cs,null)).concat(RC?[RC.audit]:[]).join('\\n'),debate_rule_report:"

def cure_lib(s,nm):
    s=f2(s,nm);s=f2_cure(s,nm);s=f4(s,nm)
    s=rep(s,F3_RETR_OLD,F3_RETR_NEW,nm);s=rep(s,F3_CAR_OLD,F3_CAR_NEW,nm);s=rep(s,F3_REST_OLD,F3_REST_NEW,nm);s=rep(s,F3_BAD_OLD,F3_BAD_NEW,nm)
    s=rep(s,"// Judge each item against the fixed-form lines (6904 c; 6946; 6952).",F3_OWN+"// Judge each item against the fixed-form lines (6904 c; 6946; 6952).",nm)
    s=rep(s,F6_REFS_OLD,F6_REFS_NEW,nm);s=rep(s,F6_LAST_OLD,F6_LAST_NEW,nm);s=rep(s,F6_KG4_OLD,F6_KG4_NEW,nm)
    s=rep(s,"// Report line (step 6, 6904 e):",F1_LIB+"// Report line (step 6, 6904 e):",nm)
    return s
for nm in CURE_NODES:
    s=cure_lib(rd(nm),nm)
    if nm=='Panel Cure Check': s=rep(s,F1_PCC_OLD,F1_PCC_NEW,nm)
    if nm=='Alternate Merge': s=rep(s,F1_AM_OLD,F1_AM_NEW,nm)
    if nm=='Cure Check': s=rep(s,F1_CC_OLD,F1_CC_NEW,nm);s=rep(s,F1_CC_TAIL_OLD,F1_CC_TAIL_NEW,nm)
    OUT[nm]=s
for nm in CHECK_NODES:
    s=f4(f2(rd(nm),nm),nm)
    if nm=='Panel Payloads': s=rep(s,"const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk)","const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk,drvLinks(drvPromptText(jd.body)))",nm)
    if nm=='Alternate Payloads': s=rep(s,"const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk)","const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk,drvLinks(drvPromptText(a.body)))",nm)
    if nm=='Extract Independent Verdict': s=rep(s,"const DRV=drvCheck(raw0,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,askedD)","const DRV=drvCheck(raw0,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,askedD,drvLinks(drvPromptText(prev&&prev.verdictBody)))",nm)
    OUT[nm]=s

# ======================= F6: the ledger (PWL in Panel Build, Build Independent Verdict, D4 Build, C4 Build) =======================
def f6_pwl(s,nm):
    s=rep(s," const LF=String.fromCharCode(10);"," const LF=String.fromCharCode(10);\n // judge_fix4 F6: a sentence end (the scoped reader of refs).\n const PSENT=/[.!?][\"”'’)\\]]*\\s+(?=[\"“'‘(\\[]*[A-Z])|\\n/;",nm)
    s=rep(s," const refs=t=>{const T=String(t||'');const out=[];const RE=new RegExp("," // judge_fix4 F6 (run 32266: \"(1:24)\" in [CR2], with no book, was read as naming Matthew 1:24; ruling 376): scoped, a bare reference takes the last\n // book named only when no sentence ends between them; an answering text is read scoped (namedIn), a pressing list as before.\n const refs=(t,scoped)=>{const T=String(t||'');const out=[];const RE=new RegExp(",nm)
    s=rep(s,"if(b){lastBook=b;lastAt=m.index;}","if(b){lastBook=b;lastAt=m.index;}const cx=b||((scoped&&(lastAt<0||PSENT.test(T.slice(lastAt,m.index))))?null:lastBook);",nm)
    s=rep(s,"ctx:b||lastBook","ctx:cx",nm,count=2)
    s=rep(s,"const namedIn=t=>{const s=new Map();for(const r of refs(t))","const namedIn=t=>{const s=new Map();for(const r of refs(t,true))",nm)
    s=rep(s,"if(!bk||f.books.has(bk)||f.inh.has(bk))return true;return f.bare&&f.books.size===0;};","if(!bk||f.books.has(bk)||f.inh.has(bk))return true;return false;}; // judge_fix4 F6: a reference with no book named in its sentence names no verse",nm)
    if nm in ('Panel Build','Build Independent Verdict'):
        s=rep(s,"A reference to a verse past the end of its chapter in the KJV is dropped;","A reference written without its book names a verse only when the book is named earlier in the same sentence (\"(1:24)\" alone names none). A reference to a verse past the end of its chapter in the KJV is dropped;",nm)
    return s

# ======================= F5: the close rounds =======================
C4P_OLD=" return {refs,fresh,of,note};})();"
C4P_NEW=r""" // judge_fix4 F5 (run 32266: the defender's close named Leviticus 15:16, Deuteronomy 22:23, Isaiah 7:13, Luke 3:38 and 1 Corinthians 15:47 for
 // the first time, and nothing marked them): a verse reference in [CR4] that no earlier round of either side ([CR1]-[DR3]) names is NEW IN CLOSE,
 // NOT COUNTED, marked as a [DR4] new press is. The transcript is not altered.
 const ofD=F=>F&&F.cr4?fresh([F.cr1,F.gr1,F.cr2,F.gr2,F.cr3,F.dr3],F.cr4):[];
 const noteD=F=>{const n=ofD(F);return n.length?'\n\n[CLOSE-ROUND NEW-VERSE CHECK -- computed by the system, not by a model: [CR4] names '+n.length+' verse reference(s) that no earlier round of either side names: '+n.join(', ')+'. Each is NEW IN CLOSE, NOT COUNTED: not evidence, footing, witness or answer. Material in [CR4] counts only as an answer to a witness already pressed against the defender; a sentence in [CR4] that grades or presses against a challenger link is disregarded.]':'';};
 // judge_fix4 F5 (run 32266: the defender's close "I number D1-D6 in the order of the link round"; the challenger's "I number my chain as pressed:
 // C1 ... C4"): a close keeps the D numbers of the DECLARED CHAIN in [CR1] and the C numbers of the [DR3] LINK blocks. A close that states a
 // numbering of its own, or names a D or C number above those, is flagged; the judges grade by the declared numbers.
 const RENUM=/\b(?:re-?number\w*|I\s+(?:now\s+)?number|number(?:ed|ing)?\s+(?:my|the|its|our|his)\s+(?:chain|links?|premises)|in\s+the\s+order\s+of\s+the\s+link\s+round)\b/i;
 const nDecl=F=>{const t=String(F.cr1||'');const i=t.search(/DECLARED CHAIN\b/);if(i<0)return 0;let n=0;for(const l of t.slice(i).split('\n').slice(1)){const m=l.match(/^\s*\**\s*(\d+)[.)]\s+\S/);if(m){n=Math.max(n,+m[1]);continue;}if(n&&l.trim()&&!/^\s/.test(l))break;}return n;};
 const nLink=F=>[...String(F.dr3||'').matchAll(/^[ \t>*#_-]*LINK\s+(\d+)/gmi)].length;
 const renum=(F,sd)=>{const t=String((sd==='D'?F.cr4:F.dr4)||'');if(!t)return [];const out=[];
  const rm=t.match(RENUM);if(rm&&/\b[DC]\d+\b/.test(t.slice(rm.index,rm.index+220))){const a=Math.max(0,t.lastIndexOf('\n',rm.index)+1);out.push('it states a numbering of its own ("'+t.slice(Math.max(a,rm.index-40),rm.index+120).replace(/\s+/g,' ').replace(/[\[\]"]/g,'').trim()+'")');}
  const nd=nDecl(F),nc=nLink(F);const hd=[...new Set([...t.matchAll(/\bD(\d+)\b/g)].map(m=>+m[1]))].filter(x=>nd&&x>nd);const hc=[...new Set([...t.matchAll(/\bC(\d+)\b/g)].map(m=>+m[1]))].filter(x=>nc&&x>nc);
  if(hd.length)out.push('D'+hd.join(', D')+' above the '+nd+' declared links');if(hc.length)out.push('C'+hc.join(', C')+' above the '+nc+' LINK blocks of [DR3]');return out;};
 const noteR=(F,sd)=>{const r=renum(F,sd);return r.length?'\n\n[CLOSE-ROUND NUMBERING CHECK -- computed by the system, not by a model: ['+(sd==='D'?'CR4':'DR4')+'] does not keep the declared numbering: '+r.join('; ')+'. Grade by the D numbers of the DECLARED CHAIN in [CR1] and the C numbers of the [DR3] LINK blocks; a numbering made in a close round does not govern.]':'';};
 return {refs,fresh,of,note,ofD,noteD,renum,noteR};})();"""
def c4p(s,nm): return rep(s,C4P_OLD,C4P_NEW,nm)
CLOSE_RULE_OLD="it presses nothing against the challenger, and a verse it names against the challenger is not a pressed witness."
CLOSE_RULE_NEW=("it presses nothing against the challenger, and a verse it names against the challenger is not a pressed witness. Material in [CR4] counts "
                "only as an answer to a witness already pressed against the defender: a verse [CR4] names that no earlier round of either side names is NEW IN CLOSE "
                "and NOT COUNTED (the system lists any under [CR4]), and a sentence in [CR4] that grades or presses against a challenger link is disregarded. "
                "Both close rounds keep the D numbers of the DECLARED CHAIN in [CR1] and the C numbers of the [DR3] LINK blocks; a numbering made in a close round does not govern (the system flags one).")
# ======================= F8: UNEXHIBITED per ruling 372 =======================
F8_OLD="UNEXHIBITED (no footing offered) when the block asserted the link and offered no layer footing at all."
F8_NEW=("UNEXHIBITED (no footing offered, or a pressed witness left unanswered) when the block asserted the link and offered no layer footing at all, "
        "or when a witness pressed against that premise was left unanswered (md_notes_rulings 372: it counts toward CONCEDED LINKS and the standings).")
# ======================= F7: margins in the judges' citation list =======================
BAD_OLD="const bad=x.items.filter(i=>i.status&&i.status!=='MATCHES'&&i.status!=='NOT CHECKED');"
BAD_NEW="const bad=x.items.filter(i=>i.status&&!/^MATCHES\\b/.test(i.status)&&i.status!=='NOT CHECKED'); /* judge_fix4 F7: MATCHES (MARGIN) is a match */"

# Panel Build
s=rd('Panel Build');s=c4p(s,'Panel Build');s=f6_pwl(s,'Panel Build')
s=rep(s,"['[CR4] DEFENDER R4 -- CLOSE ROUND (defender final defense; answers pressed witnesses)',SAN(F.cr4)],['[DR4] CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press)',F.dr4?SAN(F.dr4)+C4P.note(F):null]];",
      "['[CR4] DEFENDER R4 -- CLOSE ROUND (defender final defense; answers pressed witnesses)',F.cr4?SAN(F.cr4)+C4P.noteD(F)+C4P.noteR(F,'D'):null],['[DR4] CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press)',F.dr4?SAN(F.dr4)+C4P.note(F)+C4P.noteR(F,'C'):null]]; /* judge_fix4 F5 */",'Panel Build')
s=rep(s,CLOSE_RULE_OLD,CLOSE_RULE_NEW,'Panel Build');s=rep(s,F8_OLD,F8_NEW,'Panel Build',count=2);s=rep(s,BAD_OLD,BAD_NEW,'Panel Build');OUT['Panel Build']=s
# Build Independent Verdict
s=rd('Build Independent Verdict');s=c4p(s,'BIV');s=f6_pwl(s,'Build Independent Verdict')
s=rep(s,"(d.cr4?NL+'=== [CR4] DEFENDER R4 -- CLOSE ROUND (defender final defense; answers pressed witnesses) ==='+NL+SAN(d.cr4):'')+(d.dr4?NL+'=== [DR4] CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press) ==='+NL+SAN(d.dr4)+C4P.note(d):'')",
      "(d.cr4?NL+'=== [CR4] DEFENDER R4 -- CLOSE ROUND (defender final defense; answers pressed witnesses) ==='+NL+SAN(d.cr4)+C4P.noteD(d)+C4P.noteR(d,'D'):'')+(d.dr4?NL+'=== [DR4] CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press) ==='+NL+SAN(d.dr4)+C4P.note(d)+C4P.noteR(d,'C'):'')",'BIV')
s=rep(s,CLOSE_RULE_OLD,CLOSE_RULE_NEW,'BIV');s=rep(s,F8_OLD,F8_NEW,'BIV',count=2);s=rep(s,BAD_OLD,BAD_NEW,'BIV');OUT['Build Independent Verdict']=s
# D4 Build, C4 Build: the ledger reader (D4's open list) and the numbering instruction
s=rd('D4 Build');s=f6_pwl(s,'D4 Build')
s=rep(s,"do not add links or re-seat the chain.","do not add links or re-seat the chain. Keep the numbering: D1..Dn exactly as your round 1 DECLARED CHAIN numbers them, and C1..Cm as the challenger\\'s link round numbers its LINK blocks; do not renumber (the system flags a close round that does).",'D4 Build')
OUT['D4 Build']=s
s=rd('C4 Build');s=f6_pwl(s,'C4 Build')
s=rep(s,"You may restate, narrow (NARROWED TO: <the limb you keep>) or concede (CONCEDED) your own links;","You may restate, narrow (NARROWED TO: <the limb you keep>) or concede (CONCEDED) your own links, under the numbers your link round gave them (C1..Cm as its LINK blocks; D1..Dn as the defender\\'s round 1 DECLARED CHAIN): do not renumber (the system flags a close round that does);",'C4 Build')
OUT['C4 Build']=s
# D4 Extract: the new-in-close and numbering record; C4 Extract: the numbering record
c4src=rd('C4 Extract');a=c4src.index('// judge_fix3 B2 (operator ruling');b=c4src.index(C4P_OLD)+len(C4P_OLD)+1
C4P_BLOCK=c4p(c4src[a:b],'C4P block')
s=rd('D4 Extract')
s=rep(s,"return [{json:{run_token:TOK,round:'D4',raw,labelled,usage:e.u,fam:B.fam,model:B.model}}];",
      "// judge_fix4 F5: verses new in the defender's close, and a close that renumbers, recorded on this item (the judges see the same lists, recomputed from the rounds).\n"
      "let new_in_close=[],renumbered=[];try{const F4={cr1:$('D1 Extract').first().json.raw,gr1:$('C1 Extract').first().json.raw,cr2:$('D2 Extract').first().json.raw,gr2:$('C2 Extract').first().json.raw,cr3:$('D3 Extract').first().json.raw,dr3:$('C3 Extract').first().json.raw,cr4:raw};new_in_close=C4P.ofD(F4);renumbered=C4P.renum(F4,'D');}catch(x){new_in_close=[];renumbered=[];}\n"
      "return [{json:{run_token:TOK,round:'D4',raw,labelled,usage:e.u,fam:B.fam,model:B.model,new_in_close,renumbered}}];",'D4 Extract')
s=C4P_BLOCK+s;OUT['D4 Extract']=s
s=c4p(rd('C4 Extract'),'C4 Extract')
s=rep(s,"return [{json:{run_token:TOK,round:'C4',raw,labelled,usage:e.u,fam:B.fam,model:B.model,new_press}}];",
      "let renumbered=[];try{renumbered=C4P.renum({cr1:$('D1 Extract').first().json.raw,dr3:$('C3 Extract').first().json.raw,dr4:raw},'C');}catch(x){renumbered=[];} // judge_fix4 F5\n"
      "return [{json:{run_token:TOK,round:'C4',raw,labelled,usage:e.u,fam:B.fam,model:B.model,new_press,renumbered}}];",'C4 Extract')
OUT['C4 Extract']=s
# Build Synthesis: the [CR4] marks in the synthesis transcript
s=c4p(rd('Build Synthesis'),'Build Synthesis')
s=rep(s,"'\\n\\n[DEFENDER R4 -- CLOSE ROUND (defender final defense)]\\n'+cr4+'\\n\\n[CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press)]\\n'+dr4+C4P.note({gr1,gr2,dr3,dr4})",
      "'\\n\\n[DEFENDER R4 -- CLOSE ROUND (defender final defense)]\\n'+cr4+C4P.noteD({cr1,gr1,cr2,gr2,cr3,dr3,cr4})+C4P.noteR({cr1,dr3,cr4},'D')+'\\n\\n[CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press)]\\n'+dr4+C4P.note({gr1,gr2,dr3,dr4})+C4P.noteR({cr1,dr3,dr4},'C')",'Build Synthesis')
OUT['Build Synthesis']=s
# Build Save Body: review lines for the defender's close
s=c4p(rd('Build Save Body'),'Build Save Body')
s=rep(s,"{let np=[];try{np=C4P.of(d);}catch(e){np=[];}",
      "{let nd=[];try{nd=C4P.ofD(d);}catch(e){nd=[];}if(nd.length)FF.push('[AUDIT v25: CLOSE-ROUND NEW-VERSE CHECK (D4) -- the defender\\'s close round names '+nd.length+' verse reference(s) no earlier round of either side names ('+nd.join(', ')+'); each is NEW IN CLOSE, marked NOT COUNTED for the judges. REVIEW THIS ROW.]');} // judge_fix4 F5\n"
      "for(const sd of ['D','C']){let rn=[];try{rn=C4P.renum(d,sd);}catch(e){rn=[];}if(rn.length)FF.push('[AUDIT v25: CLOSE-ROUND NUMBERING CHECK ('+sd+'4) -- the '+(sd==='D'?'defender':'challenger')+'\\'s close round does not keep the declared numbering: '+rn.join('; ').replace(/[\\[\\]]/g,'')+'; the judges grade by the declared numbers. REVIEW THIS ROW.]');} // judge_fix4 F5\n"
      "{let np=[];try{np=C4P.of(d);}catch(e){np=[];}",'Build Save Body')
OUT['Build Save Body']=s
# Format Markdown: F5 marks, F7 margins, F8 rule copy and ruling 372, F9 synthesis checks
s=c4p(rd('Format Markdown'),'Format Markdown')
s=rep(s,"r.defender_r4 ? [['Round 4 - Defender (' + D + '): close round', r.defender_r4]] : []",
      "r.defender_r4 ? [['Round 4 - Defender (' + D + '): close round', r.defender_r4 + C4P.noteD({cr1: r.claude_r1, gr1: r.engine_r1, cr2: r.claude_r2, gr2: r.engine_r2, cr3: r.engine_r3, dr3: r.challenger_r3, cr4: r.defender_r4}) + C4P.noteR({cr1: r.claude_r1, dr3: r.challenger_r3, cr4: r.defender_r4}, 'D')]] : []",'Format Markdown')
s=rep(s,"r.challenger_r4 + C4P.note({gr1: r.engine_r1, gr2: r.engine_r2, dr3: r.challenger_r3, dr4: r.challenger_r4})",
      "r.challenger_r4 + C4P.note({gr1: r.engine_r1, gr2: r.engine_r2, dr3: r.challenger_r3, dr4: r.challenger_r4}) + C4P.noteR({cr1: r.claude_r1, dr3: r.challenger_r3, dr4: r.challenger_r4}, 'C')",'Format Markdown')
s=rep(s,"const bad = QRd.items.filter(i => i.status && i.status !== 'MATCHES' && i.status !== 'NOT CHECKED');","const bad = QRd.items.filter(i => i.status && !/^MATCHES\\b/.test(i.status) && i.status !== 'NOT CHECKED'); // judge_fix4 F7: MATCHES (MARGIN) is a match",'Format Markdown')
s=rep(s,"The judges' rulebook adds six rules, quoted here in its own words.\\n\\n- **UNEXHIBITED.** A link is graded UNEXHIBITED \\\"when the block asserted the link and offered no layer footing at all\\\"; it counts as conceded.\\n",
      "The judges' rulebook adds seven rules, quoted here in its own words.\\n\\n- **UNEXHIBITED.** A link is graded UNEXHIBITED (no footing offered, or a pressed witness left unanswered) \\\"when the block asserted the link and offered no layer footing at all, or when a witness pressed against that premise was left unanswered\\\"; it counts as conceded.\\n- **AN UNANSWERED PRESSED WITNESS (operator ruling 372).** \\\"A premise whose pressed witness goes unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings.\\\" A non-response is never neutral: a side could otherwise win by not responding.\\n",'Format Markdown')
s=rep(s,"the challenger's close is its final words, answers nothing new and may not press, and a verse it names that its earlier rounds never named is marked NOT COUNTED.",
      "the challenger's close is its final words, answers nothing new and may not press, and a verse it names that its earlier rounds never named is marked NOT COUNTED. The defender's close counts only as an answer to a witness already pressed: a verse it names that no earlier round of either side names is marked NEW IN CLOSE, NOT COUNTED, and a sentence in it that grades or presses against a challenger link is disregarded. Both closes keep the declared D numbers and the round-3 C numbers; a close that renumbers is flagged.",'Format Markdown')
s=rep(s,"t += '## Synthesis\\n\\n**Analyst:** ' + SJN + ', gives no verdict\\n\\n' + (r.synthesis ? synthClean(SP[0]) : '(not recorded)') + '\\n\\n---\\n\\n';",
      "t += '## Synthesis\\n\\n**Analyst:** ' + SJN + ', gives no verdict\\n\\n' + (r.synthesis ? synthClean(SP[0]) : '(not recorded)') + '\\n\\n';\n"
      "// judge_fix4 F9 (run 32266, Worker_G1 finding 9): the synthesis checks S-A to S-E, recorded in review_notes by Build Save Body, printed here so a reader\n"
      "// of the document sees which synthesis sentences the system flagged.\n"
      "{ const SC = [...String(r.review_notes || '').matchAll(/\\[AUDIT v\\d+: SYNTHESIS CHECK \\((S-[A-E])\\) -- ([\\s\\S]*?)\\. REVIEW THIS ROW\\.\\]/g)];\n"
      "  t += '**Synthesis checks** (computed by the system, not by a model; each flags a synthesis sentence for review and changes no verdict): ' + (SC.length ? '\\n\\n' + SC.map(m => '- **' + m[1] + '.** ' + m[2].replace(/\\s+/g, ' ').trim()).join('\\n') : 'none flagged.') + '\\n\\n---\\n\\n'; }",'Format Markdown')
OUT['Format Markdown']=s

# ======================= F7, F10: Quote Compare, Quote Report =======================
s=rd('Quote Compare')
s=rep(s,"const idx={};rows.forEach(r=>{idx[r.book+'|'+r.chapter+'|'+r.verse]=r.text;});",
      r"""// judge_fix4 F10 (operator ruling 376, ruling 3): ONE SWITCH. The operator has since ruled (2026-11-02): "as long as the verse if properly cited,
// writing partial of okay", so a partial quotation counts and the switch stays OFF. When true, a quotation that matches but is a
// strict part of the verse (or range) it cites is marked SHORTENED and is NOT COUNTED, for both sides alike. Default false: no change.
const SHORTENED_CHECK=false;
// judge_fix4 F7 (run 32266, item 103: the challenger's "or, thou, O virgin, shalt call" was marked WORDING DIFFERS FROM Isaiah 7:14, though the
// stored verse carries the 1611 margin "[shall call: or, thou, O virgin, shalt call]"): a quotation that fails against the verse text is
// matched against its bracketed margin notes: inside a note's reading (after its colon, with or without its "or,"), or in the verse with the
// note's keyed words read as that reading. Found, it is MATCHES (MARGIN).
const margins=s=>[...String(s||'').matchAll(/\[([^\]:]*):([^\]]*)\]/g)].map(m=>({key:m[1],alt:m[2]}));
const inMargin=(i,cited)=>{const ms=margins(cited);if(!ms.length)return false;const segs=(Array.isArray(i.segs)&&i.segs.length?i.segs:[i.quote]).map(x=>fold(x)).filter(Boolean);if(!segs.length)return false;
 const hit=txt=>{const cv=' '+fold(txt)+' ';let at=0;for(const g of segs){const k=cv.indexOf(' '+g+' ',at);if(k<0)return false;at=k+g.length+1;}return true;};
 const base=noMargin(cited);return ms.some(m=>{const alt=String(m.alt).replace(/^\s*(?:or|Heb|Gr|Chald|that is)\b[.,:]*\s*/i,'');if(hit(m.alt)||hit(alt))return true;
  const kf=fold(m.key);if(!kf)return false;const bv=' '+fold(base)+' ';return bv.includes(' '+kf+' ')&&hit(bv.replace(' '+kf+' ',' '+fold(alt)+' '));});};
const idx={};rows.forEach(r=>{idx[r.book+'|'+r.chapter+'|'+r.verse]=r.text;});""",'Quote Compare')
s=rep(s," if(q.length<3){if(contig(i,cited))return {...i,q,cited,score:1,status:'MATCHES',phrase:true};return {...i,status:'NOT CHECKED'};}",
      " if(q.length<3){if(contig(i,cited))return {...i,q,cited,score:1,status:'MATCHES',phrase:true};if(cited&&inMargin(i,cited))return {...i,q,cited,score:1,status:'MATCHES (MARGIN)',phrase:true};return {...i,status:'NOT CHECKED'};}",'Quote Compare')
s=rep(s," return {...i,q,cited,score:Math.round(score*100)/100,status:score>=0.75&&contig(i,cited)?'MATCHES':'PENDING'};});",
      " if(!(score>=0.75&&contig(i,cited))&&cited&&inMargin(i,cited))return {...i,q,cited,score:1,status:'MATCHES (MARGIN)'}; // judge_fix4 F7\n"
      " return {...i,q,cited,score:Math.round(score*100)/100,status:score>=0.75&&contig(i,cited)?'MATCHES':'PENDING'};});\n"
      "// judge_fix4 F10: with the switch on, a MATCHES quotation with fewer words than the cited text is SHORTENED (NOT COUNTED for the judges).\n"
      "if(SHORTENED_CHECK)items.forEach((i,k)=>{if(i.status!=='MATCHES'||!i.cited)return;const qw=fold(unGloss((Array.isArray(i.segs)&&i.segs.length?i.segs.join(' '):i.quote),i.cited)).split(' ').filter(Boolean).length;const cw=fold(noMargin(i.cited)).split(' ').filter(Boolean).length;if(qw<cw)items[k]={...i,status:'SHORTENED',shortened:{quoted:qw,verse:cw}};});",'Quote Compare')
s=rep(s,"const items=S.items.map(i=>{","let items=S.items.map(i=>{",'Quote Compare')
OUT['Quote Compare']=s
s=rd('Quote Report')
s=rep(s,"const items=all.filter(i=>i.status==='MATCHES'||i.status==='NOT CHECKED'||",
      "// judge_fix4 F7, F10: MATCHES (MARGIN) is a match; SHORTENED (switch on) is a scripture quotation and stays in the report.\nconst items=all.filter(i=>/^MATCHES\\b/.test(i.status)||i.status==='SHORTENED'||i.status==='NOT CHECKED'||",'Quote Report')
s=rep(s,"const n=s=>items.filter(i=>i.status===s).length;","const n=s=>items.filter(i=>s==='MATCHES'?/^MATCHES\\b/.test(i.status):i.status===s).length;",'Quote Report')
OUT['Quote Report']=s

# ======================= R3: operator ruling on ruling 3's "quoted fully" (2026-11-02, via the coordinator) =======================
# The operator: "as long as the verse if properly cited, writing partial of okay". A verse counts only when its book, chapter and verse are stated
# and the words quoted are exactly the words of the KJV; a quotation may be part of a verse; paraphrased or misquoted words do not count. Every judge, cure,
# synthesis and Format Markdown rule copy and both debater frames (Init with Guards) take that wording.
R3=[("its words are quoted fully and correctly (operator ruling 3); an answer in substance",
     "the words quoted are exactly the words of the KJV (operator ruling 3; a quotation may be part of a verse; paraphrased or misquoted words do not count); an answer in substance"),
    ("only when its book, chapter and verse are stated and its words are quoted fully and correctly from the KJV. A verse woven into an argument without its book, chapter and verse named, or with its words paraphrased, shortened or misquoted, is not counted;",
     "only when its book, chapter and verse are stated and the words quoted are exactly the words of the KJV; a quotation may be part of a verse. A verse woven into an argument without its book, chapter and verse named, or with its words paraphrased or misquoted, is not counted;"),
    ("RULE (operator ruling 3: a verse counts only when its book, chapter and verse are stated and its words are quoted fully and correctly):",
     "RULE (operator ruling 3: a verse counts only when its book, chapter and verse are stated and the words quoted are exactly the words of the KJV; a quotation may be part of a verse; paraphrased or misquoted words do not count):"),
    ("only when its book, chapter and verse are stated and its words are quoted fully and correctly from the KJV\\\"",
     "only when its book, chapter and verse are stated and the words quoted are exactly the words of the KJV; a quotation may be part of a verse; paraphrased or misquoted words do not count\\\""),
    ("A verse counts only when its book, chapter and verse are stated and its words are quoted fully and correctly (operator ruling 3).",
     "A verse counts only when its book, chapter and verse are stated and the words quoted are exactly the words of the KJV; a quotation may be part of a verse; paraphrased or misquoted words do not count (operator ruling 3)."),
    ("quote its words exactly as the KJV gives them. A verse alluded to, paraphrased, shortened or misquoted,",
     "quote its words exactly as the KJV gives them; a quotation may be part of a verse. A verse alluded to, paraphrased or misquoted,")]
OUT['Init with Guards']=rd('Init with Guards')
for nm in list(OUT):
    s=OUT[nm]
    for o,n in R3: s=s.replace(o,n)
    OUT[nm]=s
for nm,s in OUT.items():
    for bad in ('fully and correctly','shortened or misquoted'):
        if bad in s: sys.exit(f'{nm}: R3 wording left: {bad}')

for nm,s in OUT.items():
    if s==rd(nm): sys.exit(nm+': unchanged')
    open(f'{N}/{nm}.js','w').write(s)
print('wrote',len(OUT),'nodes:',', '.join(sorted(OUT)))
