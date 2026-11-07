// pkgEAI (W3 grade_33389 fault 2). DeepSeek enforcer fix, side-neutral. THE ANSWER IN FULL (E-ANS, pkgEAW/pkgEAM; E-HOLD, pkgEAH) also comes from
// eaiBlock: the paragraph of the listed round that holds the answer's opening words. It is the last finder tried, after the verse line and the MEANS
// header, under the same gate (a grant or a short quoted answer, and the round says more). The record holds read the same eaw_blk / eah_blk.
// Base: live s45 (d813c20d) Builds = pkgEFG/patched_live_on_pkgEAM (EAH, EAM, EFG). Run from wall2024/: node pkgEAI/build_EAI.cjs [--base dir] [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const BASE=arg('--base','pkgEFG/patched_live_on_pkgEAM');const OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const LIB=fs.readFileSync(__dirname+'/eai_lib.js','utf8').trim();
const E=[["const items=[];let gi=0;",LIB+"\nconst items=[];let gi=0;"],
 ["const __eb=(b=>b&&(/^\\s*(?:i\\s+grant|i\\s+concede|i\\s+accept|granted)\\b/i.test(N(g.answer))||N(g.answer).length<60)&&N(b.t).length>N(g.answer).length+60?b:null)(eawBlock(R,(__in.length?__in:__rk),g.verse,g.answer)||eawBlockMeans(R,(__in.length?__in:__rk),g.means,g.answer));",
  "const __eg=b=>b&&(/^\\s*(?:(?:i\\s+)?grant|i\\s+concede|i\\s+accept|granted)\\b/i.test(N(g.answer))||N(g.answer).length<60)&&N(b.t).length>N(g.answer).length+60?b:null;const __erk=(__in.length?__in:__rk);const __eb=__eg(eawBlock(R,__erk,g.verse,g.answer))||__eg(eawBlockMeans(R,__erk,g.means,g.answer))||__eg(eaiBlock(R,__erk,g.answer)); /* pkgEAI: each finder passes the gate on its own (a refused verse-line block no longer hides a later finder); a bare 'Grant ...' opening counts as a grant; the paragraph that holds the answer is the last finder */"],
 ["const b=eawBlock(R,__rk,m[1],ans)||eawBlockMeans(R,__rk,m[3],ans);if(!b||N(b.t).length<=N(ans).length+60)return null;return b;};",
  "const __hg=x=>x&&N(x.t).length>N(ans).length+60?x:null;const b=__hg(eawBlock(R,__rk,m[1],ans))||__hg(eawBlockMeans(R,__rk,m[3],ans))||__hg(eaiBlock(R,__rk,ans)); /* pkgEAI: each finder gated on its own; paragraph finder last */return b||null;};"]];
/* (4) Record holds (pkgEAW / pkgEAH): the push's quote and the block are compared with quote marks folded out, so a push quoting "Grant it: 'before ...'"
   matches a round that wrote Grant it: "before ..." (33389 chatgpt Matthew 1:18 and Luke 1:31 [DR3], W1 Wall FYI). */
const RA="const lb=blk.toLowerCase();const at=lb.indexOf(q.toLowerCase());if(at<0)return null;\n const after=blk.slice(at+q.length);";
const RB="const __qf=s=>String(s).replace(/[\"\\u201c\\u201d'\\u2018\\u2019`]/g,''); /* pkgEAI: quote marks folded out on both sides */const __bf=__qf(blk);const lb=__bf.toLowerCase();const __q=__qf(q).trim().toLowerCase();const at=__q.length>=2&&lb.length===__bf.length?lb.indexOf(__q):-1;if(at<0)return null;\n const after=__bf.slice(at+__q.length);";
const RBASE=arg('--rbase','live');const LW=RBASE==='live'?JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s45.json','utf8')):null;
const recSrc=n=>LW?LW.nodes.find(z=>z.name===n).parameters.jsCode:fs.readFileSync(RBASE+'/'+n.replace(/ /g,'_')+'.js','utf8');
const plan={source:'W2 pkgEAI, W3 grade_33389 fault 2 (answer written inline in a paragraph)',base:BASE,nodes:[]};
for(const name of ['Judge Enforcer Build','Alt Judge Enforcer Build']){const f=name.replace(/ /g,'_')+'.js';const s0=fs.readFileSync(BASE+'/'+f,'utf8');let s=s0;
 for(const [a,b] of E){const c=s.split(a).length-1;if(c!==1)throw new Error(name+' anchor x'+c+': '+a.slice(0,60));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base_sha:sha(s0),final_sha:sha(s),bytes:[s0.length,s.length]});}
for(const name of ['Judge Enforcer Record','Alt Judge Enforcer Record']){const f=name.replace(/ /g,'_')+'.js';const s0=recSrc(name);const c=s0.split(RA).length-1;if(c!==1)throw new Error(name+' record anchor x'+c);const s=s0.replace(RA,()=>RB);
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base_sha:sha(s0),final_sha:sha(s),bytes:[s0.length,s.length]});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(JSON.stringify(plan.nodes));
