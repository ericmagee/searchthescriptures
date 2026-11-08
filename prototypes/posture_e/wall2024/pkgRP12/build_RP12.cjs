// pkgRP12 (reader phase 2, item 12 CONCEDED/STANDING, W4): the CONCEDED LINKS and STANDING form reads ask the shared reader first.
//  - stand (Judge Enforcer Build x3, which carry __RL since pkgRP10): the STANDING word, its c=, and the CONCEDED LINKS count.
//  - g in __eplOK / the pkgEPL fan-out (Judge Enforcer Record x3, Judge Enforcer Retry Build x3): "CONCEDED LINKS: 0" on the flagged line.
//    These 6 nodes get the reader block (the same embedded text Send Back Build carries, as pkgRP10 did).
// A line the reader does not read as that form (refused, RESTATED, another form) keeps the old read.
// Run from wall2024/: node pkgRP12/build_RP12.cjs <fetchback or composed target>
const fs=require('fs'),cr=require('crypto');const sha=s=>cr.createHash('sha256').update(String(s)).digest('hex').slice(0,12);
const F=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s65.json';const W=JSON.parse(fs.readFileSync(F,'utf8'));
const node=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const SBB=node('Send Back Build');const i=SBB.indexOf('const __RL=');const END='return module.exports;})();';const j=SBB.indexOf(END,i)+END.length;
if(i<0||j<END.length)throw new Error('reader block not found in Send Back Build');const RL=SBB.slice(i,j);
const RD="const __ri12=(l,form)=>{try{const r=__RL.readLine(String(l==null?'':l).trim());return r&&r.form===form&&r.f&&!r.f.restated&&!r.f.why?r:null;}catch(e){return null;}};\n";
const C0=String.raw`const g=x=>x.rule==='E-PREM'?(/CONCEDED LINKS\s*:\s*0\b/i.test(String(x.flagged_line||''))?'SPARED':null)`;
const C1=String.raw`const g=x=>x.rule==='E-PREM'?((()=>{const r=__ri12(x.flagged_line,'CONCEDED');return r?r.f.n===0:/CONCEDED LINKS\s*:\s*0\b/i.test(String(x.flagged_line||''));})()?'SPARED':null) /* pkgRP12 */`;
const S0=String.raw` const stand=(st,cn,side)=>{const s0=(st.match(/STANDING\s*:\s*([A-Z-]+)/)||[])[1];const nn=cn.match(/CONCEDED LINKS\s*:\s*(\d+)/);if(!s0||!nn)return;`;
const S1=String.raw` const stand=(st,cn,side)=>{const __s=__ri12(st,'STANDING'),__c=__ri12(cn,'CONCEDED');const s0=__s?__s.f.standing:(st.match(/STANDING\s*:\s*([A-Z-]+)/)||[])[1];const nn=__c?[cn,String(__c.f.n)]:cn.match(/CONCEDED LINKS\s*:\s*(\d+)/);if(!s0||!nn)return; /* pkgRP12 */`;
const K0=String.raw`  const cc0=(st.match(/\bc\s*=\s*(\d+)/)||[])[1];`;
const K1=String.raw`  const cc0=__s?(__s.f.c==null?undefined:String(__s.f.c)):(st.match(/\bc\s*=\s*(\d+)/)||[])[1]; /* pkgRP12 */`;
const HEAD='/* pkgRP12 (reader item 12): the shared reader (the same embedded text Send Back Build carries) reads the CONCEDED LINKS line; a refused or RESTATED line keeps the old read */\n'+RL+'\n'+RD;
const one=(c,a,z,n)=>{const k=c.split(a).length-1;if(k!==1)throw new Error(n+': anchor x'+k+': '+a.slice(0,70));return c.replace(a,()=>z);};
const plan={base:F,base_versionId:W.versionId,nodes:{}};fs.mkdirSync('pkgRP12/patched',{recursive:true});const AF=Object.getPrototypeOf(async function(){}).constructor;
const put=(n,c,b)=>{new AF(c);fs.writeFileSync('pkgRP12/patched/'+n.replace(/[ ?]/g,'_')+'.js',c);plan.nodes[n]={base:b,patched:sha(c)};};
for(const p of ['','Alt ','R2 Alt ']){
 {const n=p+'Judge Enforcer Build';let c=node(n);const b=sha(c);if(!c.includes('const __RL='))throw new Error(n+': no reader (pkgRP10)');
  c=one(c,S0,RD+S1,n);c=one(c,K0,K1,n);put(n,c,b);}
 for(const n of [p+'Judge Enforcer Record',p+'Judge Enforcer Retry Build']){let c=node(n);const b=sha(c);if(c.includes('const __RL='))throw new Error(n+' already has a reader');
  c=one(c,C0,C1,n);c=HEAD+c;put(n,c,b);}}
fs.writeFileSync('pkgRP12/plan_RP12.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan,null,1));
