# ASK 524 + 525 (stacked): patch Assume Check Build and Assume Check Record in an engine JSON.
# usage: SRC=<engine.json> OUT=<target.json> python3 patch524.py
import json, os, hashlib
src=os.environ['SRC']; out=os.environ['OUT']
E=json.load(open(src)); nodes=E.get('nodes') or E['data']['nodes']
def node(n): return [x for x in nodes if x['name']==n][0]
def rep(s,a,b,cnt=1):
    assert s.count(a)==cnt, (a[:80], s.count(a)); return s.replace(a,b)
B=node('Assume Check Build'); b=B['parameters']['jsCode']
# --- 525 (code): the defender's round 2 STEP/ASSUMES list against the challenger is read too
b=rep(b,"const P=F?vp4List(F.gr2,'DEFENDER').concat(vp4G1(F.gr1,F.gr2)).concat(vp4List(F.cr3,'CHALLENGER')):[];",
"""const vp525R2=(t2,t3,have)=>{t2=String(t2||'');const i=t2.search(/UNSUPPORTED-L4 PREMISES/i);if(i<0)return [];let body=t2.slice(t2.indexOf('\\n',i)+1);const e=body.search(/\\n[ \\t]*(?:#{1,3}\\s|---[ \\t]*\\n|\\*\\*[A-Z][A-Z\\x27 -]{4,}\\*\\*)/);if(e>=0)body=body.slice(0,e);const B3=vp4All(t3).filter(p=>p.q);const out=[];let k=0;
 for(const ln of body.split(/\\n(?=[ \\t]*\\**[ \\t]*(?:\\d+[.)]\\s|STEP\\s*:))/i)){const a=ln.match(/ASSUMES\\s*:\\s*([\\s\\S]*?)\\s*(?:--\\s*)?(?:ROWS GIVE\\s*:|\\nPRESSED WITH|$)/i);if(!a)continue;k++;const r=ln.match(/ROWS GIVE\\s*:\\s*([\\s\\S]*?)\\s*(?:\\nPRESSED WITH|$)/i);const q=vp4Q1(ln);const hit=B3.find(x=>vp4Same(x.q,q));
  if(hit&&have.has(hit.n))continue;out.push({side:'CHALLENGER',n:hit?hit.n:90+k,link:hit?hit.link:null,r2:!hit,assumes:a[1].replace(/\\*+/g,'').replace(/\\s+/g,' ').replace(/\\s*--\\s*$/,'').trim(),rows_give:r?r[1].replace(/\\*+/g,'').replace(/\\s+/g,' ').trim():''});}
 return out;}; /* ASK 525: the defender's round 2 list against the challenger; an item not carried into the round 3 list is numbered 91 and up and is record-only */
const P0=F?vp4List(F.gr2,'DEFENDER').concat(vp4G1(F.gr1,F.gr2)).concat(vp4List(F.cr3,'CHALLENGER')):[];
const P=F?P0.concat(vp525R2(F.cr2,F.cr3,new Set(P0.filter(p=>p.side==='CHALLENGER').map(p=>p.n)))):[];""")
# --- 524: the side's whole case (verses it quoted in rounds 1 to 3) is shown and used for the STATED word check
b=rep(b,"const prem=P.map(p=>{const blk=vp4Block(p.side==='DEFENDER'?F.cr3:F.dr3,p.link,p.n);return {...p,answer_round:(p.side==='DEFENDER'?'CR3':'DR3'),block:blk,quotes:vp4Quotes(blk)};});",
"""const vp524Verses=ts=>{const by=new Map();for(const t of ts)for(const m of String(t||'').matchAll(/((?:[123] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \\d+:\\d+(?:[-\\u2013]\\d+)?)(?: margin)?:?[ \\t]*["\\u201c]([^"\\u201d\\n]{2,})["\\u201d]/g)){if(!by.has(m[1]))by.set(m[1],[]);by.get(m[1]).push(m[2]);}
 const out=[];for(const [ref,ws] of by){const ns=ws.map(w=>VP4N0(w));ws.forEach((w,i)=>{if(ns.some((x,j)=>j!==i&&(x.length>ns[i].length||(x.length===ns[i].length&&j<i))&&x.includes(ns[i])))return;out.push({ref,w});});}return out;}; /* one entry per distinct quotation; a quotation inside a longer one of the same verse is dropped */
const VP4N0=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const vp524Case=F?{DEFENDER:vp524Verses([F.cr1,F.cr2,F.cr3]),CHALLENGER:vp524Verses([F.gr1,F.gr2,F.dr3])}:{DEFENDER:[],CHALLENGER:[]}; /* ASK 524: every verse the side quoted in rounds 1 to 3 */
const prem=P.map(p=>{const blk=p.link==null?'':vp4Block(p.side==='DEFENDER'?F.cr3:F.dr3,p.link,p.n);return {...p,answer_round:(p.side==='DEFENDER'?'CR3':'DR3'),block:blk,quotes:vp4Quotes(blk),case_quotes:vp524Case[p.side].map(v=>v.w)};});""")
b=rep(b,"Your one task: does the answering block's own quoted scripture state each assumed fact?",
"Your one task: does the scripture the side itself quoted state each assumed fact? Read the answering block together with every verse that side quoted in its rounds 1 to 3, which is listed once for each side at the end.")
b=rep(b,"STATED: the verse words quoted in the answering block, one verse or several read together, give the fact.",
"STATED: the verse words quoted in the answering block or in that side's listed verses, one verse or several read together, give the fact.")
b=rep(b,"NOT STATED: no verse words quoted in the block give the fact;","NOT STATED: no verse words quoted in the block or in that side's listed verses give the fact;")
b=rep(b,"no verse the block does not quote.","no verse that side did not quote.")
b=rep(b,"(p.block||'(no LINK '+p.link+' block found in ['+p.answer_round+'])')).join('\\n\\n');",
"(p.r2?'(this premise stands in the defender\\'s round 2 list only; no LINK block answers it: read it against the challenger\\'s listed verses)':(p.block||'(no LINK '+p.link+' block found in ['+p.answer_round+'])'))).join('\\n\\n')+['DEFENDER','CHALLENGER'].filter(s=>prem.some(p=>p.side===s)).map(s=>'\\n\\n######## EVERY VERSE THE '+s+' QUOTED IN ROUNDS 1 TO 3, read together ########\\n'+(vp524Case[s].length?vp524Case[s].map(v=>v.ref+': \"'+v.w+'\"').join('\\n'):'(none found)')).join('');")
B['parameters']['jsCode']=b
R=node('Assume Check Record'); r=R['parameters']['jsCode']
r=rep(r,"const qs=p?VP4N(p.quotes.join(' | ')):'';","const qs=p?VP4N(p.quotes.concat(p.case_quotes||[]).join(' | ')):'';")
r=rep(r,"if(!x.found)x.answer='STATED (verse words not found in the block)';","if(!x.found)x.answer='STATED (verse words not found in the side\\'s quoted verses)';")
r=rep(r,"const spared=judges.map(j=>({seat:j.seat,grade:gradeOf(j.raw,p.side,p.n)}));","const spared=p.r2?[]:judges.map(j=>({seat:j.seat,grade:gradeOf(j.raw,p.side,p.n)}));")
r=rep(r,"const fx={side:p.side,n:p.n,link:p.link,","const fx={side:p.side,n:p.n,link:p.link,r2:!!p.r2,")
R['parameters']['jsCode']=r
D=node('D3 Build'); dc=D['parameters']['jsCode']
dc=rep(dc,"Write that line only for such a premise; it carries none of the words no, not, none, never, only, without, alone, every or no other. After the quote, write PRESSED WITH:",
"Write that line only for such a premise; it carries none of the words no, not, none, never, only, without, alone, every or no other. If your round 2 charged the challenger with an assumption (an UNSUPPORTED-L4 PREMISES list or CHARGE THE ASSUMPTION), carry each such charge into this list as its own numbered premise: the challenger\\'s own words that assert the fact, quoted verbatim, and the STEP/ASSUMES/ROWS GIVE line. If no words of the challenger assert the fact, do not list the charge. A charge left outside this list is not graded. After the quote, write PRESSED WITH:")
D['parameters']['jsCode']=dc
s=json.dumps(E,ensure_ascii=False); open(out,'w').write(s)
print('wrote',out,hashlib.md5(open(out,'rb').read()).hexdigest()[:8])
