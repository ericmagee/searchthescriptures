// W2 grade of pkgCDF: hints whose link CDF resolves from a D/C mark (rev 11 printed LINK ?): sentence, link, and the mark's context, for reading.
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const {harness}=require('../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const code=f=>g(f).nodes.find(z=>z.name==='Close Enforcer Build').parameters.jsCode;
const A=code('pkgCDR/parent_s103_CDR.json'),B=code('pkgCDF/parent_s103_CDR11_CDF.json');const RK={CR1:'cr1',CR2:'cr2',CR3:'cr3',DR1:'gr1',DR2:'gr2',DR3:'dr3'};
const runs=fs.readdirSync(H.IN).filter(f=>f.endsWith('_Final_Output.json')).map(f=>f.split('_')[0]).sort();
(async()=>{let n=0;for(const r of runs){let F;try{const o=H.out(r,'Final Output');F=o.flat().filter(Boolean)[0].json;}catch(e){try{const x=JSON.parse(fs.readFileSync(H.IN+'/'+r+'_Final_Output.json','utf8'));F=x[x.length-1].main[0][0].json;}catch(e2){continue;}}
 const go=async c=>{try{return (await harness(r,{'Final Output':[{json:F}],'Resolve Seats':[{json:{deepseek:{api_model:'deepseek-flash'}}}],'Init Seats':[{json:{run_token:r}}]})('return (async()=>{\n'+c+'\n})();','Quote Report'))[0].json;}catch(e){return null;}};
 const a=await go(A),b=await go(B);if(!a||!b||a.cec_skip)continue;
 for(const h of (b.cands||[]).filter(c=>/^P/.test(c.id))){const o=(a.cands||[]).find(c=>c.side===h.side&&c.earlier_q===h.earlier_q);if(!o||o.n!=='?'||h.n==='?')continue;n++;
  const t=String(F[RK[h.earlier_round]]||'');const i=t.indexOf(h.earlier_q);const L=h.side==='CHALLENGER'?'C':'D';const re=new RegExp('\\b'+L+'(\\d{1,2})\\b','g');
  const inS=[...h.earlier_q.matchAll(re)].length>0;let last=-1;for(const m of t.slice(0,i).matchAll(re))last=m.index;
  console.log(r+' '+h.side+' ['+h.earlier_round+'] LINK '+h.n+' ('+(inS?'mark in sentence':'last mark before, '+(i-last)+' chars back')+')\n   S: '+h.earlier_q.slice(0,200)+(inS?'':'\n   MARK: ...'+t.slice(Math.max(0,last-120),last+40).replace(/\n/g,' / ')));}}
 console.log(n+' resolved');})();
