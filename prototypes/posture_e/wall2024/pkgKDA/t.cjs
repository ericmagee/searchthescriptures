// ASKs 301-303 test: kagLines2024 from the rebuilt Panel Payloads library part (stub line order; own lines left out; each top-level const in its own try) on the stored 37113 and 37032 judgments; $ gives Final Output (stored rounds) and L2 Words (rows fetched with the run's own l2_urls, l2words.json). Then kagCure on sample replies.
const fs=require('fs');const st=require(__dirname+'/stub.cjs');const R=require('../a287/runs.json');const LW=require('./l2words.json');
const load=(f,node,names)=>{const d=st(f,node);const skip=new Set();d.own.forEach(([a,n])=>{for(let i=a;i<a+n;i++)skip.add(i);});const S=d.S.map((l,i)=>skip.has(i)?'':l);const keep=[];
 for(let i=0;i<S.length;i++){const l=S[i];if(!/^(?:function |const |let )/.test(l))continue;for(let k=i;k<Math.min(S.length,i+150);k++){const s=S.slice(i,k+1).join('\n');try{new Function(s);keep.push(/^function /.test(l)?s:'try{eval('+JSON.stringify(s.replace(/^(?:const|let) /,'var '))+')}catch(e){}');i=k;break;}catch(e){}}}
 return keep.join('\n')+'\nreturn {'+names.join(',')+'};';};
for(const [lab,f] of [['OLD',process.argv[2]],['NEW',process.argv[3]]]){const src=load(f,'Panel Payloads',['kagLines2024']);
 for(const [tok,{r,j}] of Object.entries(R)){const F={...r,cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4,dr4:r.challenger_r4};
  const $=nm=>nm==='Final Output'?{isExecuted:true,first:()=>({json:F}),all:()=>[{json:F}]}:nm==='L2 Words'?{isExecuted:true,first:()=>({json:LW[tok].rows[0]}),all:()=>LW[tok].rows.map(x=>({json:x}))}:{isExecuted:false,first:()=>{throw new Error('no '+nm)},all:()=>[]};
  const fx=new Function('$','$input',src)($,null);
  for(const x of j){const o=fx.kagLines2024(x.verdict_raw);const d=o.items.filter(i=>i.doc);console.log(lab,tok.slice(5,10),x.judge_seat.padEnd(8),'K-AG items',o.items.length,'doctrine',d.length);for(const i of d)console.log('    ',i.doc.padEnd(26),i.link.slice(0,60),'|',i.line.split(', but ')[1].slice(0,170));}}}
// kagCure
{const src=load(process.argv[3],'Panel Cure Check',['kagCure']);const fx=new Function('$','$input',src)(()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]}),null);
 const x={rule:'K-AG',verse:'Proverbs 30:19',rk:'CR3',doc:'DG-57 (Strong\'s mismatch)'};
 for(const rep of ['ANSWER CHECK: Proverbs 30:19 -- [CR3] -- MEANS: "x" -- ANSWER: "y" -- UNPROVEN -- Genesis 24:16 carries H1330.','ANSWER CHECK: Proverbs 30:19 -- [CR3] -- MEANS: "x" -- ANSWER: "y" -- MEETS -- still.','NOT HELD: the answer is sound.','ANSWER CHECK: Proverbs 30:19 -- [CR3] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- z'])console.log('cure',JSON.stringify(fx.kagCure(x,rep,'')).slice(0,140));
 console.log('cure non-doc',JSON.stringify(fx.kagCure({rule:'K-AG',verse:'Luke 1:35',rk:'CR3',none:true},'NOT HELD','NOT HELD x')).slice(0,100));}
