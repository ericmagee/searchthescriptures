// W2 grade of pkgCDR rev 1: Close Enforcer Build on run 34108 with sentences added per case (cases.json); BASE live s102, CAND pkgCDR.
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const BASE=g(process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s102.json'),CAND=g(process.env.CAND||'pkgCDR/parent_s102_CDR.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const cl=x=>JSON.parse(JSON.stringify(x));
const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];const F0=FO[0].json;
const build=async(W,F)=>{const fo=cl(FO);fo[0].json=F;return (await harness('34108',{'Final Output':fo})('return (async()=>{\n'+code(W,'Close Enforcer Build')+'\n})();','Quote Report'))[0].json;};
const N=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();const C=JSON.parse(fs.readFileSync(__dirname+'/cases.json','utf8')).cases;
(async()=>{const b0=await build(CAND,F0);const base=b0.cands.map(x=>x.closing_q).join('|');let ok=0,bad=0;
 for(const c of C){const F=cl(F0);for(const [r,s] of c.adds){if(!(r in F))throw new Error('no round '+r);F[r]=F[r]+'\n'+s;}
  const B=await build(CAND,F),L=await build(BASE,F);const hit=B.cands.filter(x=>x.side===c.side&&N(x.closing_q)===N(c.closing));
  const extra=B.cands.filter(x=>!(x.side===c.side&&N(x.closing_q)===N(c.closing))).map(x=>x.closing_q).join('|');
  const W=process.env.STD7?(c.want7||c.want):c.want;const good=(W==='ANY'?hit.length<=1:W==='LISTED'?hit.length===1:hit.length===0)&&extra===base;good?ok++:bad++;
  console.log((good?'OK   ':'MISS ')+c.id+' want '+(process.env.STD7?(c.want7||c.want):c.want)+' | live cands '+L.cands.length+' | CDR cands '+B.cands.length+(extra!==base?' | OTHER CANDIDATES CHANGED':'')+' | '+c.closing+(hit.length?'\n       hit: '+hit.map(x=>x.id+' ['+x.earlier_round+'] '+x.earlier_q.slice(0,100)).join(' ; '):''));}
 console.log(ok+' of '+C.length+' as labeled');})();
