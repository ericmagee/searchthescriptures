// pkgRC (reader phase 2, Group 2; W3 spec section 10): rcLines reads each collision line with the shared readLine.
// A collision line the reader refuses keeps grade null and carries `unread` (the refusal code). Every caller tests the explicit grade:
// null is never STANDS and never "not broken". Base pkgSBR/patched (W1 08f8b61, on pkgPS; 22 library nodes). Each anchor is asserted per node.
const fs=require('fs'),cr=require('crypto');const D=__dirname,B=D+'/../pkgSBR/patched/';const sha=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,16);
const R=[
 // 1. rcLines: the collision grade from readLine (19 nodes)
 {n:19,a:"if(m){const g=(u.slice(m[0].length).match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/)||[])[1]||null;out.col.push({link:m[1]+' vs '+m[2],grade:g,raw});continue;}",
  b:"if(m){const r=__RL.readLine(raw);const ok=r.form==='COLLISION'&&!(r.f&&r.f.restated);out.col.push(ok?{link:m[1]+' vs '+m[2],grade:r.f.grade,raw}:{link:m[1]+' vs '+m[2],grade:null,raw,unread:r.detail||r.code||'NO_LINE_FORM'});continue;} /* pkgRC (W3 spec 10): the shared reader; STANDS and WITHDRAWN are read; a refused line has grade null and never counts as not broken */"},
 // 1b. spec 14 (W3 Wall 2459): a pair line the reader refuses is skipped when the same pair has a read COLLISION line in the text; otherwise it stays UNREAD
 {n:19,a:"if(c&&!out.cn[c[1]])out.cn[c[1]]={raw,u};}\n return out;}",b:"if(c&&!out.cn[c[1]])out.cn[c[1]]={raw,u};}\n out.col=out.col.filter(z=>z.grade||!out.col.some(y=>y.grade&&y.link===z.link)); /* pkgRC, spec 14: a note on a pair with a read collision line is skipped */\n return out;}"},
 // 2. keyChecks rule 0: KEYSTONE BROKEN with no broken collision is a contradiction only when every keystone collision is read
 {n:6,a:"if(m[2]==='BROKEN'&&!br&&!sbKeyExempt2024(P.key.raw,P,RD))",b:"if(m[2]==='BROKEN'&&!br&&kc.every(z=>z.grade)&&!sbKeyExempt2024(P.key.raw,P,RD))"},
 // 3. keyChecks rule 2: only an explicit "not BROKEN" (false), never an unknown (null)
 {n:6,a:"if(m[2]==='BROKEN'&&!bw)out.push",b:"if(m[2]==='BROKEN'&&bw===false)out.push"},
 {n:6,a:"return k>=1||(n!=null&&2*w>n)||kw;}",b:"const __r=k>=1||(n!=null&&2*w>n)||kw;return __r?true:(P.col.some(z=>!z.grade)?null:false);} /* pkgRC: null when a collision line is unread */"},
 // 4. pkgKY: derive STANDS only when every keystone collision is read
 {n:6,a:"else if(km[2]==='BROKEN'&&!brl.length&&moved",b:"else if(km[2]==='BROKEN'&&!brl.length&&kc.every(z=>z.grade)&&moved"},
 // 5. recompute (E-APPLY in 6 nodes, cureRecompute in 19): an unread collision line is named; with no broken line read, the verdict, result,
 //    clause and a SELF-SUPPORTED standing are not derived from it (the judge's own stand)
 {n:[19,25],all:true,a:"const brk={DEFENDER:col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length,CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length};",
  b:"const brk={DEFENDER:col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length,CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length};const unk=col.filter(z=>!z.grade);if(unk.length)trig.push('UNREAD '+unk.map(z=>z.link+' ('+z.unread+')').join(', ')); /* pkgRC */"},
 {n:6,a:"if(n>=1||brk[sd]>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return 'SELF-SUPPORTED';};",b:"if(n>=1||brk[sd]>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return unk.length?orig:'SELF-SUPPORTED';};"},
 {n:19,a:"if(n>=1||brk[sd]>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return 'SELF-SUPPORTED'; /* trim A3",b:"if(n>=1||brk[sd]>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return unk.length?orig:'SELF-SUPPORTED'; /* trim A3"},
 {n:[19,25],all:true,a:"const tag=k>=1?'BROKEN-1':((n!=null&&2*w>n)||kw)?'BROKEN-2':w>=1?'PARTIAL-1':dst==='COLLAPSED'?'PARTIAL-2':'HELD-1';const word=tag.split('-')[0];",
  b:"const held=k<1&&unk.length>0;const tag=held?'UNREAD':k>=1?'BROKEN-1':((n!=null&&2*w>n)||kw)?'BROKEN-2':w>=1?'PARTIAL-1':dst==='COLLAPSED'?'PARTIAL-2':'HELD-1';const word=held?(F.verdict_tag||null):tag.split('-')[0]; /* pkgRC: held = no broken line read and one unread, so nothing is derived */"},
 {n:6,a:"const tie=!col.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))&&dst===cst",b:"const tie=!unk.length&&!col.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))&&dst===cst"},
 {n:6,a:"if(tie&&(res==='DEFENDER WINS'||res==='CHALLENGER WINS'))res='UNDERDETERMINED';",b:"if(tie&&(res==='DEFENDER WINS'||res==='CHALLENGER WINS'))res='UNDERDETERMINED';if(held)res=res0;"},
 {n:19,a:"const __tie421=(cl,a1,a2,n1,n2,r)=>!cl.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))",b:"const __tie421=(cl,a1,a2,n1,n2,r)=>!cl.some(z=>!z.grade)&&!cl.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))"},
 {n:19,a:"const res=(__x=>{if(__tie421(",b:"const res=held?(P.result?((P.result.u.match(/^RESULT\\s*:\\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null):(__x=>{if(__tie421("},
 {n:[19,25],all:true,a:"if(P.clause&&!new RegExp('^CLAUSE\\\\s*:\\\\s*'+tag+'\\\\b').test(P.clause.u))",b:"if(!held&&P.clause&&!new RegExp('^CLAUSE\\\\s*:\\\\s*'+tag+'\\\\b').test(P.clause.u))"},
];
const files=fs.readdirSync(B).filter(f=>f.endsWith('.js')).sort();const hits=R.map(()=>0);const plan={};
for(const f of files){let s=fs.readFileSync(B+f,'utf8');const base=sha(s);R.forEach((r,i)=>{const k=s.split(r.a).length-1;if(!k)return;if(k>1&&!r.all)throw new Error(f+': anchor '+i+' x'+k);s=s.split(r.a).join(r.b);hits[i]+=k;});
 fs.writeFileSync(D+'/patched/'+f,s);plan[f]={base_sha:base,final_sha:sha(s),changed:base!==sha(s)};}
R.forEach((r,i)=>{const want=Array.isArray(r.n)?r.n:[r.n];if(!want.includes(hits[i]))throw new Error('anchor '+i+' hit '+hits[i]+' times, want '+want);});
fs.writeFileSync(D+'/plan_RC.json',JSON.stringify(plan,null,1));console.log('anchors',hits.join(' '),'| changed nodes',Object.values(plan).filter(x=>x.changed).length);
