// pkgCDR rev 1 (W1): runs the labeled cases (cases.json, labels fixed before the run) on the live node (BASE) and the pkgCDR node (CAND).
// Pre-panel: Close Enforcer Build on run 34108's stored outputs, with the closing round changed per case. Post-panel: Judge Contradiction Build on
// execution 34299's stored node outputs (/mnt/project-files/wall2024/ex34299_full.json).
process.chdir(__dirname+'/..');const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const BASE=g(process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s102.json'),CAND=g(process.env.CAND||'pkgCDR/parent_s102_CDR.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];const F0=FO[0].json;
const C=JSON.parse(fs.readFileSync(__dirname+'/cases.json','utf8'));const D6C='Christ had no biological father.';
const build=async(W,F)=>{const fo=cl(FO);fo[0].json=F;return (await harness('34108',{'Final Output':fo})('return (async()=>{\n'+code(W,'Close Enforcer Build')+'\n})();','Quote Report'))[0].json;};
const N=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();let ok=0,bad=0;const T=(n,c,i)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'MISS ')+n+(i?'\n       '+i:''));};
(async()=>{
 const b0=await build(CAND,F0),l0=await build(BASE,F0);console.log('34108 as stored: live candidates '+l0.cands.length+'; pkgCDR candidates '+b0.cands.length);b0.cands.forEach(c=>console.log('   '+c.id+' '+c.side+' LINK '+c.n+' | ['+c.earlier_round+'] '+c.earlier_q.slice(0,110)+' | ['+c.closing_round+'] '+c.closing_q.slice(0,110)));
 for(const c of C.cases){const F=cl(F0);if(c.op==='add')F[c.round]=F[c.round]+'\n'+c.s;if(c.op==='replace'){if(!F.cr4.includes(D6C))throw new Error('no D6 close');F.cr4=F.cr4.replace(D6C,c.s);}
  const B=await build(CAND,F);const cs=c.op==='none'?c.closing:c.s;
  const hit=cs?B.cands.filter(x=>x.side===c.side&&N(x.closing_q)===N(cs)):[];const hitE=c.earlier?hit.filter(x=>N(x.earlier_q)===N(c.earlier)):hit;
  let good;if(c.want==='LISTED')good=hitE.length===1;else if(c.id==='C9')good=!B.cands.some(x=>x.side==='DEFENDER'&&/biological father/i.test(x.closing_q));else good=hit.length===0;
  T(c.id+' want '+c.want+' | '+(cs||'(D6 close removed)'),good,'listed: '+B.cands.length+(hit.length?' | hit '+hit.map(x=>x.id+' ['+x.earlier_round+'] '+x.earlier_q.slice(0,80)).join(' ; '):''));}
 // post-panel, execution 34299
 const EX=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34299_full.json','utf8')).data.resultData.runData;
 const mk=()=>name=>{const r=EX[name];const items=r&&r[0]&&r[0].data?r[0].data.main[0]:[];return {isExecuted:!!(r&&r.length),first:()=>{if(!items||!items.length)throw new Error('no data '+name);return items[0];},all:()=>items,item:items&&items[0]};};
 const jc=async W=>{const $=mk();return (await new Function('$','$input','return (async()=>{\n'+code(W,'Judge Contradiction Build')+'\n})();')($,$('Panel Payloads')))[0].json;};
 const jl=await jc(BASE),jn=await jc(CAND);console.log('34299 Judge Contradiction Build: live candidates '+(jl.cands||[]).length+(jl.cec_skip?' (skip: '+jl.why+')':'')+'; pkgCDR candidates '+(jn.cands||[]).length+(jn.cec_skip?' (skip: '+jn.why+')':''));
 (jn.cands||[]).forEach(c=>console.log('   '+c.id+' '+c.side+' | ['+c.earlier_round+'] '+c.earlier_q.slice(0,100)+' | ['+c.closing_round+'] '+c.closing_q.slice(0,100)+' | by '+c.by));
 const P=C.post_panel.cases;const JN=jn.cands||[];
 const r1=JN.filter(x=>x.side==='DEFENDER'&&x.earlier_round==='CR3'&&N(x.earlier_q).includes(N(P[0].earlier))&&N(x.closing_q).includes(N('Genesis 4:1 therefore cannot supply the sequence for Matthew')));T('J-R1 the "ordinary means" pair listed after the panel',r1.length===1,r1.map(x=>x.id+' by '+x.by).join(' ; '));
 const a1=JN.filter(x=>x.side==='DEFENDER'&&/not knowing at each stage/.test(N(x.closing_q)));T('J-A1 the Luke 1:34 pair listed once, joined with the judges\' pair',a1.length===1&&/ANTI-CHEAT/.test(a1[0].by),a1.map(x=>x.id+' by '+x.by).join(' ; '));
 T('J-0 no other new candidate than J-R1 and J-A1',JN.length===(jl.cands||[]).length+1,'live '+(jl.cands||[]).length+', pkgCDR '+JN.length);
 console.log(ok+' OK, '+bad+' MISS');fs.writeFileSync(__dirname+'/jc_34299_CDR.json',JSON.stringify(jn,null,1));
})();
