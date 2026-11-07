// pkgEAM (W3 Wall 2868 item 3 follow-up). DeepSeek enforcer fix, side-neutral. The E-ANS item's THE ANSWER IN FULL also reads the MEANS-header
// form (eawBlockMeans, pkgEAH): "**MEANS [CR3] P5.4: "<press meaning>"**", a blank line, then the answer's bullets. pkgEAW's eawBlock looks for the
// pressed verse's line only, so an answer written under a MEANS header got no full answer. Same gate as pkgEAW (a grant or a short quoted answer,
// and the round says more); the block goes on ids[0].eaw_blk as before, so the pkgEAW record hold reads it unchanged.
// Base: the Build nodes of pkgEAH/patched (pkgECQ v2 changes only the Records). Run from wall2024/: node pkgEAM/build_EAM.cjs [--out dir] [--base dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const BASE=arg('--base','pkgEAH/patched');const OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const A0="(eawBlock(R,(__in.length?__in:__rk),g.verse,g.answer));";
const A1="(eawBlock(R,(__in.length?__in:__rk),g.verse,g.answer)||eawBlockMeans(R,(__in.length?__in:__rk),g.means,g.answer)); /* pkgEAM (W3 2868): or the answer under its MEANS header */";
const plan={source:'W2 pkgEAM, W3 2868 item 3 (fold eawBlockMeans into E-ANS)',base:BASE,nodes:[]};
for(const name of ['Judge Enforcer Build','Alt Judge Enforcer Build']){const f=name.replace(/ /g,'_')+'.js';const s0=fs.readFileSync(BASE+'/'+f,'utf8');
 const c=s0.split(A0).length-1;if(c!==1)throw new Error(name+' anchor x'+c);if(!/function eawBlockMeans\(/.test(s0))throw new Error(name+': no eawBlockMeans (base must carry pkgEAH)');
 const s=s0.replace(A0,()=>A1);new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base_sha:sha(s0),final_sha:sha(s),bytes:[s0.length,s.length]});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(JSON.stringify(plan));
