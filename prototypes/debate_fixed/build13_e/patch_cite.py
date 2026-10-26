# Rev 9 DoD 22 patch (Worker_E): Citation Scan marks opp_short; Quote Report leaves out WORDING NOT FOUND items so marked.
import re
p='new13/Citation_Scan.js';s=open(p).read()
a=" return rounds.some((x,j)=>{if(j>=ri||x[0]===rounds[ri][0])return false;let at=0;for(const p of ps){const k=FULL[j].indexOf(p,at);if(k<0)return false;at=k+p.length;}return true;});};"
assert s.count(a)==1
b=a+r"""
// BB-7397 rev 9 DoD 22 (rulings 98 extended to a shortened quote): opp_short is true when the quotation's words (folded as QF folds them, at
// least 6) occur in order inside one sentence of an earlier round of the other side, the matched span of that sentence holding at most twice
// the quotation's word count. Quote Report leaves out such an item only when its status is WORDING NOT FOUND.
const QW=s=>QF(s).split(/[^a-z0-9]+/).filter(Boolean);
const SENTW=rounds.map(x=>QF(String(x[2]||'')).split(/[.!?](?:\s|$)|\n/).map(QW).filter(w=>w.length));
const OPPS=(ri,raw)=>{const q=QW(String(raw).replace(/…|\.\.\./g,' '));if(q.length<6)return false;
 return rounds.some((x,j)=>{if(j>=ri||x[0]===rounds[ri][0])return false;
  return SENTW[j].some(w=>{for(let st=0;st<w.length;st++){if(w[st]!==q[0])continue;let k=1,e=st;for(let i=st+1;i<w.length&&k<q.length;i++)if(w[i]===q[k]){k++;e=i;}
   if(k===q.length&&e-st+1<=2*q.length)return true;}return false;});});};"""
s=s.replace(a,b)
for old in ["opp_words:OPPW(ri,m[5]),","opp_words:OPPW(ri,m[1]),"]:
  assert s.count(old)==1,old; s=s.replace(old,old+old.replace('opp_words:OPPW','opp_short:OPPS'))
open(p,'w').write(s)
p='new13/Quote_Report.js';s=open(p).read()
a="const items=all.filter(i=>i.status==='MATCHES'||i.status==='NOT CHECKED'||(i.cite_form!==false&&!i.opp_words));"
assert s.count(a)==1
s=s.replace(a,"// BB-7397 rev 9 DoD 22: a WORDING NOT FOUND item whose words are the other side's sentence shortened (Citation Scan opp_short) is left out too.\nconst items=all.filter(i=>i.status==='MATCHES'||i.status==='NOT CHECKED'||(i.cite_form!==false&&!i.opp_words&&!(i.opp_short&&/^WORDING NOT FOUND IN /.test(i.status))));")
open(p,'w').write(s)
