// pkgWLA (D57; W2, 11-08; W3 assigned; approved redesign item 2, witness ledger): the PRESSED-WITNESS LEDGER counts a proven press against the
// challenger as named when the challenger's [DR3] answers it BY PRESS ID: a header line `MEANS [CR3] P<n>.<k>: "<the press's MEANS>"` for the same premise n,
// whose quoted MEANS equals the press's own MEANS sentence, followed by an answer block holding an [L1], [L2] or [L3] tag before the next MEANS header.
// 33731: [DR3] answered Genesis 3:15 (premises 3, 4) as MEANS [CR3] P3.5 / P4.4 without the reference; the ledger read NOT NAMED; sol counted 2 Oracle concedes.
// Defender side unchanged (no saved [CR3] answers by id: 0 in 21 runs). Nodes: Panel Build, Build Independent Verdict (the two judge ledgers).
// Usage (from wall2024/): node pkgWLA/build_WLA.cjs [fetchback, default s63 live]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const F=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s63.json';const W=JSON.parse(fs.readFileSync(F,'utf8'));
const OUT='pkgWLA/out/';fs.mkdirSync(OUT,{recursive:true});
const A1="const premises=items(list).map((x,k)=>{";
const A1N="const __wla=headRe===CH_RE?wlaById2024(answering):null; /* pkgWLA */\n  "+A1;
const A2="if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)||";
const A2N="if((__wla&&PRSP&&wlaNamed2024(__wla,k+1,PRSP,r.cvs.map(cv=>(r.book||r.ctx||'')+' '+cv)))||r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)||";
const A3=" const side=(pressing,answering,headRe,";
const FN=" /* pkgWLA (D57): the challenger's [DR3] answers a press by its id: MEANS [CR3] P<n>.<k>: \"<MEANS>\" plus an answer block with a layer tag */\n"
+" const wlaNorm2024=s=>String(s==null?'':s).toLowerCase().replace(/[\"'\\u2018\\u2019\\u201c\\u201d*_`]+/g,'').replace(/[^a-z0-9\\u0370-\\u03ff\\u0590-\\u05ff]+/g,' ').trim();\n"
+" const wlaById2024=ans=>{const L=String(ans==null?'':ans).split('\\n');const H=[];for(let i=0;i<L.length;i++){const m=L[i].match(/^\\s*[*_-]*\\s*MEANS\\s*\\[CR3\\]\\s*P(\\d+)\\.(\\d+)\\s*[*_]*\\s*:\\s*(.+)$/i);if(!m)continue;\n"
+"   let lay=false;for(let j=i+1;j<L.length;j++){if(/^\\s*[*_-]*\\s*MEANS\\s*\\[/i.test(L[j])||/^\\s*-{3,}\\s*$/.test(L[j])||/^\\s*[*#]*\\s*LINK\\s+\\d+\\s*:/i.test(L[j]))break;if(/\\[L[123]\\]/.test(L[j])){lay=true;break;}}\n"
+"   H.push({n:+m[1],k:+m[2],means:wlaNorm2024(m[3]),lay});}return H;};\n"
+" const wlaNamed2024=(H,n,P,ks)=>{const v=P.verses.filter(z=>ks.includes(z.key)&&z.cls!=='UNPROVEN'&&z.means);return v.some(z=>{const w=wlaNorm2024(z.means);return w.length>=8&&H.some(h=>h.n===n&&h.lay&&h.means===w);});};\n";
const plan={base:F,base_versionId:W.versionId,nodes:{}};
for(const nm of ['Panel Build','Build Independent Verdict']){const n=W.nodes.find(x=>x.name===nm);let s=n.parameters.jsCode;const s0=s;
 for(const [a,b] of [[A3,FN+A3],[A1,A1N],[A2,A2N]]){if(s.split(a).length!==2)throw new Error(nm+': anchor not once: '+a.slice(0,50));s=s.replace(a,()=>b);}
 fs.writeFileSync(OUT+nm.replace(/ /g,'_')+'.js',s);plan.nodes[nm]={from:sha(s0),to:sha(s)};}
fs.writeFileSync(OUT+'plan_WLA.json',JSON.stringify(plan,null,1));console.log(JSON.stringify(plan.nodes));
