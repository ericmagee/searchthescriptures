// W2 grade of pkgCDR rev 9: a case REACHES when a P candidate of the case's side holds the dropped wording "register stops at joseph" (content reaches the enforcer).
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const CAND=g(process.env.CAND||'pkgCDR/parent_s103_CDR.json');
const code=CAND.nodes.find(z=>z.name==='Close Enforcer Build').parameters.jsCode;const cl=x=>JSON.parse(JSON.stringify(x));
const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];const F0=FO[0].json;
const build=async F=>{const fo=cl(FO);fo[0].json=F;return (await harness('34108',{'Final Output':fo})('return (async()=>{\n'+code+'\n})();','Quote Report'))[0].json;};
const N=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const C=JSON.parse(fs.readFileSync(__dirname+'/cases.json','utf8')).cases.filter(c=>!process.env.ONLY9||c.want9);
(async()=>{let ok=0,bad=0;for(const c of C){const F=cl(F0);for(const [r,s] of c.adds)F[r]=F[r]+'\n'+s;const B=await build(F);const P=B.cands.filter(x=>/^P/.test(x.id));
 const hold=s=>P.filter(x=>x.side===s&&N(x.earlier_q).includes('register stops at joseph'));
 let good,txt;if(c.want9==='NOREACH_DEF'){const h=hold('DEFENDER');good=h.length===0&&hold('CHALLENGER').length===1;txt='def '+h.length+' chal '+hold('CHALLENGER').length;}
 else{const h=hold(c.side);good=c.want==='LISTED'?h.length>=1:true;txt=h.map(x=>x.id+' ['+x.earlier_round+'] '+x.earlier_q.slice(0,90)).join(' ; ')||'-';}
 if(good)ok++;else bad++;console.log((good?'OK   ':'MISS ')+c.id+' '+c.side+' want '+(c.want9||c.want)+' | P '+P.length+' | '+txt+' | '+c.note);}
 console.log(ok+' OK, '+bad+' MISS of '+C.length);})();
