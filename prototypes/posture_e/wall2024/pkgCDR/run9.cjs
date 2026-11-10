// pkgCDR rev 9 (W1): for every labeled case (my cases.json rev2 set, W2's cases.json, W3's case files), the case's earlier-round sentences are added to
// run 34108 and Close Enforcer Build is run. A case's drop REACHES the enforcer when a P candidate of the case's side holds the added sentence whole.
// Under rev 9 every label LISTED must reach the enforcer (no true drop hidden); a label NOT LISTED that reaches it is a candidate the enforcer rules on.
process.chdir(__dirname+'/..');const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const CAND=g(process.env.CAND||'pkgCDR/parent_s103_CDR.json');
const code=CAND.nodes.find(z=>z.name==='Close Enforcer Build').parameters.jsCode;const cl=x=>JSON.parse(JSON.stringify(x));
const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];const F0=FO[0].json;
const build=async F=>{const fo=cl(FO);fo[0].json=F;return (await harness('34108',{'Final Output':fo})('return (async()=>{\n'+code+'\n})();','Quote Report'))[0].json;};
const N=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();const SIDE={cr1:'DEFENDER',cr2:'DEFENDER',cr3:'DEFENDER',gr1:'CHALLENGER',gr2:'CHALLENGER',dr3:'CHALLENGER'};
const SETS=[['W1 cases.json (rev2..rev8 sets)',x=>x.rev2.cases,'pkgCDR/cases.json'],['W2 cases.json',x=>x.cases||x,'pkgCDR/w2_grade/cases.json'],
 ...['cases','cases_rev3','cases_rev4','cases_rev5','cases_rev6','cases_rev7','cases_rev8'].map(f=>['W3 '+f+'.json',x=>x.cases,'pkgCDR/w3_grade/'+f+'.json'])];
(async()=>{let TT=0,TH=0,NN=0,NH=0;
 for(const [name,get,f] of SETS){if(!fs.existsSync(f)){console.log(name+': missing');continue;}const C=get(JSON.parse(fs.readFileSync(f,'utf8')));let t=0,th=0,n=0,nh=0;const miss=[];
  for(const c of C){if(!c.adds)continue;const F=cl(F0);const early=[];for(const [r,s] of c.adds){F[r]=F[r]+'\n'+s;if(SIDE[r])early.push([r,s]);}if(!early.length)continue;
   const B=await build(F);const P=B.cands.filter(x=>/^P/.test(x.id));
   const reach=early.every(([r,s])=>{const ss=s.split(/\n+|(?<=[.!?]["”’')\]]*)\s+/).map(N).filter(Boolean);return ss.some(z=>P.some(x=>x.side===SIDE[r]&&N(x.earlier_q)===z.replace(/^(?:[-•>]\s+|\d{1,2}[.)]\s+)/,'')));});
   if(c.want==='LISTED'){t++;if(reach)th++;else miss.push(c.id+' | '+early.map(e=>e[1]).join(' / ').slice(0,160));}else{n++;if(reach)nh++;}}
  TT+=t;TH+=th;NN+=n;NH+=nh;console.log(name+': true drops reach the enforcer '+th+' of '+t+'; other labeled sentences that reach it '+nh+' of '+n);for(const m of miss)console.log('   NOT REACHED '+m);}
 console.log('ALL: true drops reach the enforcer '+TH+' of '+TT+'; other labeled sentences that reach it '+NH+' of '+NN);})();
