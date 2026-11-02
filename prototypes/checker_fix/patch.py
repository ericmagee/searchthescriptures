# patch.py: builds new/<node>.js from base/<node>.js (the live code of version de2c7688). Offline; writes only new/.
# FIX 1 (K-C) in every node that carries netLines; the K-C cure test and FIX 2 (K-G4) in every node that carries cureVerdicts.
import os,sys
B='base';N='new';os.makedirs(N,exist_ok=True)
def rep(s,old,new,nm,count=1):
    c=s.count(old)
    if c!=count: sys.exit(f'{nm}: anchor found {c} times, want {count}: {old[:80]!r}')
    return s.replace(old,new)
NET_DEFS=r'''// checker_fix FIX 1 (kc_fix, run 32157 B2; run 32212 B2): the unanswered-witness test is not the stating ground. Before NET_STATE runs,
// a clause is masked: (a) "<round or side> does not name / never names / not named <witness>" and "<round or side> left <witness> unstated",
// "<witness> went unstated in <round>" (NET_ANSWER); (b) words in double quotation marks, which are a round's or a verse's words, not the
// judge's ground (NET_QUOTE). A clause whose hit follows "CONCEDED (stated)" reports the side's own concession (NET_CONC), as NET_REPORT
// does for "conceded that". A stating ground elsewhere in the clause still counts.
const NET_ANSWER=/((?:defen[cs]e|defender|challenger|rounds?|block|reply|answer|link\s+round|\[?[CD]R\d\]?|\(?[CD]R\d\)?)[^;.]{0,60}?)((?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?name[sd]?|never\s+names?|not\s+named)(?=[^;.]{0,50}?(?:\d+:\d+|witness|verses?|them|those|rows?))/gi;
// "<witness>, which <round or side> did not name / never names" (the witness before the verb; judgment 872 restated lines).
const NET_ANSWER_R=/(\b(?:which|whom)\s+(?:the\s+)?(?:later\s+)?(?:defen[cs]e|defender|challenger|rounds?|block|reply|link\s+round|\[?\(?[CD]R\d\]?\)?)(?:'s\s+(?:\S+\s+){0,2}?)?\s*)((?:do|does|did)\s+not\s+(?:\S+\s+){0,2}?name[sd]?|never\s+names?)\b/gi;
const NET_ANSWER_U=[/((?:defen[cs]e|defender|challenger|rounds?|block|reply|link\s+round|\[?[CD]R\d\]?|\(?[CD]R\d\)?)[^;.]{0,60}?\b(?:left|leaves|leave)\s+(?:\S+\s+){0,6}?)unstated\b/gi,
 /(\b(?:went|goes|go|was|were|remains?|remained|stays?|stayed)\s+)unstated(?=\s+(?:in|by|at)\s+(?:(?:the\s+)?(?:defen[cs]e|defender|challenger|link\s+round|rounds?)\b|\[?\(?[CD]R\d))/gi];
const NET_QUOTE=/["“][^"”\n]{2,}?["”]/g;
const NET_CONC=/\bCONCEDED\s*\(\s*stated\s*\)/i;
function netMask(cl){let t=String(cl).replace(NET_QUOTE,'"[quote]"').replace(NET_ANSWER,'$1[answer-check]').replace(NET_ANSWER_R,'$1[answer-check]');for(const rx of NET_ANSWER_U)t=t.replace(rx,'$1[answer-check]');return t;}
// The K-C cure test of a RESTATED line: true when a clause of it, masked as netLines masks it, still gives the stating ground as the judge's own.
function netKeeps(text){for(const c0 of String(text||'').replace(/[*_`]+/g,'').replace(NET_QUOTE,'"[quote]"').split(/;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/)){const cl=netMask(c0);
 const hit=NET_STATE.find(rx=>rx.test(cl));if(!hit)continue;const pre=cl.slice(0,cl.search(hit));if(NET_REPORT.test(pre)||NET_CONC.test(pre))continue;return true;}return false;}
'''
KG4_FN=r'''// checker_fix FIX 2 (runs 32194 B2, 32212 B2): K-G4 searches, for each PRESSED witness the BROKEN line names, every later round of the side
// that holds the link (order CR1 DR1 CR2 DR2 CR3 DR3; CR = defender, DR = challenger). The pressed witnesses: the verses the line names that
// the quoted pressing words also name; failing that, the verses the line names outside its anchor parentheses that the pressing round names;
// failing that, the verses the line names outside its anchor. The line's anchor verse is never searched for its own sake (32212 ChatGPT).
// Returns each later naming found: {ref, round, pos}. Any naming makes the BROKEN grade unanswered-false.
function kg4Witnesses(line,q,pressText){const L=new Set(cureRefs(line).map(r=>r.key));const Q=[...new Set(cureRefs(q).map(r=>r.key))].filter(k=>L.has(k));if(Q.length)return Q;
 const an=new Set(cureRefs((String(line||'').match(/\(([^)]*\d+:\d+[^)]*)\)/)||[0,''])[1]).map(r=>r.key));const B0=[...L].filter(k=>!an.has(k));
 const P=new Set(cureRefs(pressText||'').map(r=>r.key));const BP=B0.filter(k=>P.has(k));return BP.length?BP:B0;}
function kg4Answered(side,line,presses,R){const ORD=['CR1','DR1','CR2','DR2','CR3','DR3'];const own=side==='DEFENDER'?['CR1','CR2','CR3']:['DR1','DR2','DR3'];const out=[];const seen=new Set();
 for(const p of presses){const later=own.filter(k=>ORD.indexOf(k)>ORD.indexOf(p.round));
  for(const w of kg4Witnesses(line,p.q,R[p.round]))for(const k of later){if(typeof R[k]!=='string'||seen.has(w+'|'+k))continue;const h=cureRefs(R[k]).find(r=>r.key===w);if(h){seen.add(w+'|'+k);out.push({ref:w,round:k,pos:h.pos});}}}
 return out;}
const kg4Txt=a=>a.map(z=>'['+z.round+'] '+z.ref+' at '+z.pos).join('; ');
'''
OLD_KG4=r'''   if(!ps.length){const sp=stmtPress(x);if(!sp)return res('UNCURED','no PRESSED line, no RETRACTED line, and no statement that names a pressing round and quotes it, for '+x.link,lines);
    if(!shortOk(sp.round))return res('UNCURED','statement quotes '+sp.round+'; the later round '+nmTxt(sp.round)+' and neither a SHORT line nor the statement quotes its answer',lines.concat([sp.line]));
    return res('CURED','statement passes the check: quotation found in '+sp.round+(nmTxt(sp.round)?'; answer quoted for '+nmTxt(sp.round):''),lines.concat([sp.line]));}
   const ok=ps.filter(p=>CURE_PRESS[x.side].includes(p.round));if(!ok.length)return res('UNCURED','PRESSED round '+ps.map(p=>'['+p.round+']').join(', ')+' does not press the '+x.side.toLowerCase(),lines);
   const hit=ok.find(p=>typeof R[p.round]==='string'&&cureFoundAll(p.q,R[p.round]));if(!hit)return res('UNCURED',ok.every(p=>typeof R[p.round]!=='string')?'the named round text could not be read':'no quotation found in the named round',lines);
   if(!shortOk(hit.round))return res('UNCURED','the later round '+nmTxt(hit.round)+'; no SHORT line quoting its answer',lines);
   return res('CURED','pressed: quotation found in '+hit.round+(nmTxt(hit.round)?'; SHORT found for '+nmTxt(hit.round):''),lines);}'''
NEW_KG4=r'''   // checker_fix FIX 2: the pressing sentence is still quoted and found; then each pressed witness is searched in every later round of the
   // side that holds the link (kg4Answered), not the line's anchor verse; a later naming makes the grade unanswered-false (a SHORT line no longer cures it).
   if(!ps.length){const sp=stmtPress(x);if(!sp)return res('UNCURED','no PRESSED line, no RETRACTED line, and no statement that names a pressing round and quotes it, for '+x.link,lines);
    const an=kg4Answered(x.side,x.line,[sp],R);if(an.length)return res('UNCURED','unanswered-false: statement quotes '+sp.round+', but a later '+x.side.toLowerCase()+' round names the pressed witness: '+kg4Txt(an),lines.concat([sp.line]));
    return res('CURED','statement passes the check: quotation found in '+sp.round+'; the pressed witness is named in no later '+x.side.toLowerCase()+' round',lines.concat([sp.line]));}
   const ok=ps.filter(p=>CURE_PRESS[x.side].includes(p.round));if(!ok.length)return res('UNCURED','PRESSED round '+ps.map(p=>'['+p.round+']').join(', ')+' does not press the '+x.side.toLowerCase(),lines);
   const hits=ok.filter(p=>typeof R[p.round]==='string'&&cureFoundAll(p.q,R[p.round]));if(!hits.length)return res('UNCURED',ok.every(p=>typeof R[p.round]!=='string')?'the named round text could not be read':'no quotation found in the named round',lines);
   const an=kg4Answered(x.side,x.line,hits,R);if(an.length)return res('UNCURED','unanswered-false: quotation found in '+hits.map(p=>p.round).join(', ')+', but a later '+x.side.toLowerCase()+' round names the pressed witness: '+kg4Txt(an),lines);
   return res('CURED','pressed: quotation found in '+hits.map(p=>p.round).join(', ')+'; the pressed witness is named in no later '+x.side.toLowerCase()+' round',lines);}'''
OLD_RULE=r'''"For a K-G1 or K-G4 link whose cited verse any later round of the side that holds the link names ([CR2] or [CR3] against the defender, [DR2] or [DR3] against the challenger), add a SHORT line "
 +"quoting the words of that round that answer it and saying from the text why they do not overturn the link; without it the link is not cured. "'''
NEW_RULE=r'''"For a K-G1 link whose cited verse any later round of the side that holds the link names ([CR2] or [CR3] against the defender, [DR2] or [DR3] against the challenger), add a SHORT line "
 +"quoting the words of that round that answer it and saying from the text why they do not overturn the link; without it the link is not cured. "
 +"For a K-G4 link the system searches every later round of the side that holds the link ([CR2] or [CR3] against the defender; [DR1], [DR2] or [DR3] against the challenger, each after the pressing round) for each pressed witness your line and your PRESSED quotation name; if any of those rounds names the witness, it was answered, the BROKEN grade is unanswered-false and only RETRACTED cures it. "'''
OLD_KC="if(NET_STATE.some(rx=>rx.test(rs[0].text)))return res('UNCURED','the restated line keeps the ground that a verse does not state the link',[rs[0].line]);"
NEW_KC="if(netKeeps(rs[0].text))return res('UNCURED','the restated line keeps the ground that a verse does not state the link',[rs[0].line]); // checker_fix FIX 1: masked as netLines masks"
OLD_FORM=r'''"item it must name the round that pressed the witness and quote that round's words; where a later round of the side that holds the link names the verse, it must also quote "
 +"that round's own answer.'''
NEW_FORM=r'''"item it must name the round that pressed the witness and quote that round's words; for a K-G1 item, where a later round of the side that holds the link names the verse, it must also quote "
 +"that round's own answer; a K-G4 item whose pressed witness a later round of that side names is not cured by any statement.'''
done=[]
for f in sorted(os.listdir(B)):
    s=open(f'{B}/{f}').read();nm=f[:-3];t=s
    if 'function netLines' in s:
        t=rep(t,"// A clause that reports what a side itself stated or granted",NET_DEFS+"// A clause that reports what a side itself stated or granted",nm)
        t=rep(t,"const clauses=line.split(/;|(?<=[.!?])\\s+(?=[A-Z\\[])|\\s--\\s|\\s—\\s/);","const clauses=line.replace(NET_QUOTE,'\"[quote]\"').split(/;|(?<=[.!?])\\s+(?=[A-Z\\[])|\\s--\\s|\\s—\\s/);",nm)
        t=rep(t,"for(const cl of clauses){if(!NET_STATE.some(rx=>rx.test(cl)))continue;","for(const cl0 of clauses){const cl=netMask(cl0);if(!NET_STATE.some(rx=>rx.test(cl)))continue;",nm)
        t=rep(t,"if(NET_REPORT.test(cl.slice(0,at))||(NET_CLAIM","if(NET_REPORT.test(cl.slice(0,at))||NET_CONC.test(cl.slice(0,at))||(NET_CLAIM",nm)
    if 'function cureVerdicts' in s:
        t=rep(t,OLD_KC,NEW_KC,nm)
        t=rep(t,OLD_KG4,NEW_KG4,nm)
        t=rep(t,"function cureVerdicts(",KG4_FN+"function cureVerdicts(",nm)
        t=rep(t,OLD_RULE,NEW_RULE,nm)
        t=rep(t,OLD_FORM,NEW_FORM,nm)
    if t!=s: open(f'{N}/{f}','w').write(t);done.append(nm)
print(len(done),'nodes written:',', '.join(done))
