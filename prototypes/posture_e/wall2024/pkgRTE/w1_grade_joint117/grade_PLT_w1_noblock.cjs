// W1 grade of pkgPLT: my 20 stored "no block" items (w1_plants/scan_noblock_out.txt), replayed on live s116 and the candidate where the node input is stored.
const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');const S=JSON.stringify;
const W='/mnt/project-files/wall2024/';const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=wf(W+'fetchback_live_s117.json'),B=wf(W+'joint_s117_RTE3_PLT.json');const ld=d=>{const by={};d.nodes.forEach(n=>by[n.name]=n);return n=>rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode);};const LA=ld(A),LB=ld(B);
const preds=n=>{const p=[];for(const [k,v] of Object.entries(A.connections))for(const outs of (v.main||[]))for(const c of (outs||[]))if(c.node===n)p.push(k);return p;};
const U=s=>S(s).replace(/\\\\n/g,'\n').replace(/\\n/g,'\n').replace(/\\"/g,'"');
const P=t=>{const o={};for(const m of t.matchAll(/ITEM (P\d+) \(E-PREM[^\n]*?number (\d+)\):\nTHE LIST ENTRY: ([^\n]{0,80})[\s\S]*?THE ANSWERING SIDE'S LINK-ROUND BLOCK FOR IT[^:]*: ([^\n]{0,60})/g))o[m[1]]={n:+m[2],e:m[3],b:m[4]};return o;};
const rows=fs.readFileSync('w1_plants/scan_noblock_out.txt','utf8').split('\n').filter(l=>l.startsWith('{')).map(JSON.parse);
(async()=>{let ok=0,bad=0,nr=0;for(const r of rows){const [run,kind,p]=r.key.split(' ');const n=(kind==='Alt_'?'Alt ':'')+'Judge Enforcer Build';const ip=preds(n).find(q=>H.out(run,q));
 if(!ip){nr++;const m=(r.entry.match(/^\W*\d+[.)]\W*LINK\s+(\d+)/i)||[])[1];console.log(r.key,'NOT REPLAYABLE (node input not stored) | candidate reads entry tag',m||'none','| stored scan: untagged LINK',r.tag,'block in round',r.tagUntagged);continue;}
 const a=P(U(await H.run(LA(n),run,ip,{}))),b=P(U(await H.run(LB(n),run,ip,{})));const lv=a[p],cd=b[p];if(!lv||!cd){nr++;console.log(r.key,'item not in replay');continue;}
 const good=new RegExp('^\\W*LINK '+r.tag+'\\b').test(cd.b);good?ok++:bad++;console.log(r.key,'n',r.n,'tag',r.tag,'| live:',lv.b.slice(0,30),'| cand:',cd.b.slice(0,26),good?'OK':'WRONG');}
 console.log('NO-BLOCK items',rows.length,'| candidate shows tagged block',ok,'| wrong',bad,'| not replayable',nr);})();
