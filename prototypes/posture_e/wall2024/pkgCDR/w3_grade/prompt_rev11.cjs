// W3 grade of pkgCDR rev 11: Close Enforcer Build on 34108 (write file vs live s103): prompt differences, candidate lines, word-for-word check of every candidate on all stored debates.
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const BASE=g('/mnt/project-files/wall2024/fetchback_live_s103.json'),CAND=g('pkgCDR/parent_s103_CDR.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const m=new Map(BASE.nodes.map(n=>[n.name,JSON.stringify(n)]));console.log('nodes',BASE.nodes.length,CAND.nodes.length,'differ:',CAND.nodes.filter(n=>m.get(n.name)!==JSON.stringify(n)).map(n=>n.name).join(', '),'| connections equal',JSON.stringify(BASE.connections)===JSON.stringify(CAND.connections));
const IN='/mnt/project-files/wall2024/inputs/';const FOof=r=>{const x=JSON.parse(fs.readFileSync(IN+r+'_Final_Output.json','utf8'));let F;for(const e of (Array.isArray(x)?x:[x])){const c=(e.data&&e.data.main&&e.data.main[0])||(e.main&&e.main[0]);if(c&&c[0]&&c[0].json)F=c[0].json;}return F;};
const build=async(W,r,F)=>(await harness(r,{'Final Output':[{json:F}],'Resolve Seats':[{json:{deepseek:{api_model:'deepseek-flash'}}}],'Init Seats':[{json:{run_token:r}}]})('return (async()=>{\n'+code(W,'Close Enforcer Build')+'\n})();','Quote Report'))[0].json;
(async()=>{const F=FOof('34108');const a=await build(BASE,'34108',F),b=await build(CAND,'34108',F);
 const pick=o=>{const s=JSON.stringify(o);const k=Object.keys(o);return k;};console.log('keys',pick(b).join(','));
 const txt=o=>{const B=o.body||o.request||o;const ms=(B.messages||[]);return ms.map(x=>'<<'+x.role+'>>\n'+x.content).join('\n');};
 const ta=txt(a),tb=txt(b);console.log('prompt chars live',ta.length,'rev9',tb.length);
 const la=new Set(ta.split('\n'));const add=tb.split('\n').filter(l=>!la.has(l));const lb=new Set(tb.split('\n'));const gone=ta.split('\n').filter(l=>!lb.has(l));
 console.log('--- lines in rev 11 prompt not in live ('+add.length+'):');for(const l of add)console.log('+ '+l.slice(0,900));console.log('--- lines in live prompt not in rev 11 ('+gone.length+'):');for(const l of gone)console.log('- '+l.slice(0,900));
 let n=0,miss=0,max=0;for(const f of fs.readdirSync(IN).filter(f=>f.endsWith('_Final_Output.json')).sort()){const r=f.split('_')[0];let Fx;try{Fx=FOof(r);}catch(e){continue;}if(!Fx)continue;let B;try{B=await build(CAND,r,Fx);}catch(e){console.log(r,'error',e.message.slice(0,80));continue;}if(B.cec_skip)continue;
  const P=(B.cands||[]).filter(c=>/^P\d/.test(c.id));const per={};for(const c of P){n++;per[c.side]=(per[c.side]||0)+1;const key={CR1:'cr1',CR2:'cr2',CR3:'cr3',DR1:'gr1',DR2:'gr2',DR3:'dr3'}[c.earlier_round];const ok=String(Fx[key]||'').includes(c.earlier_q);const sideOk=(c.side==='DEFENDER')===/^CR/.test(c.earlier_round);if(!ok||!sideOk){miss++;console.log('NOT WORD FOR WORD or side wrong',r,c.id,c.side,c.earlier_round,c.earlier_q.slice(0,120));}}
  max=Math.max(max,...Object.values(per),0);}
 console.log(n+' candidates on stored debates; '+miss+' not found word for word in the round named or on the wrong side; most for one side in one debate '+max);})();
