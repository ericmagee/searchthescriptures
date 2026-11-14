const fs=require('fs');const W=JSON.parse(fs.readFileSync(__dirname+'/target.json','utf8'));const a=W.nodes.find(n=>n.name==='Alternate Merge').parameters.jsCode;
const tail=a.slice(a.indexOf('\n})();\n')+7);const R=JSON.parse(fs.readFileSync(__dirname+'/runs.json','utf8'));
for(const [tok,{r,j}] of Object.entries(R)){
 const d={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4,dr4:r.challenger_r4};
 const bodies=j.map(x=>JSON.stringify({payload:{judge_seat:x.judge_seat,verdict_raw:x.verdict_raw}}));
 const $=n=>{if(n!=='Build Save Body')throw new Error('read '+n);return {first:()=>({json:d})};};
 const out=new Function('$','__AMOUT',tail)($,[{json:{bodies,other:1}}]);
 const nb=out[0].json.bodies;let tot=0;
 nb.forEach((s,i)=>{const p=JSON.parse(s).payload;const add=p.verdict_raw.slice(j[i].verdict_raw.length);const n=(add.match(/AUDIT v51/g)||[]).length;tot+=n;console.log(tok,p.judge_seat,'v51 lines',n,'prefix kept',p.verdict_raw.startsWith(j[i].verdict_raw));if(n&&process.argv[2])console.log(add.slice(0,600));});
 // label coverage
 for(const x of j){const ls=String(x.verdict_raw).replace(/\\n/g,'\n').split('\n').map(l=>l.replace(/[*_`]+/g,'').replace(/^\s*(?:[-•]\s*)?/,'')).filter(l=>/^ANSWER CHECK\s*:/i.test(l));
  const old=ls.filter(l=>/^ANSWER CHECK\s*:\s*(.+?)\s*(?:--|—)\s*\[\s*([CD]R[1-4])\s*\]/i.test(l)).length,nw=ls.filter(l=>/^ANSWER CHECK\s*:\s*(.+?)\s*(?:--|—)\s*[\[(]\s*([CD]R[1-4])\b[^\]\)\n]*[\])]/i.test(l)).length;console.log('  labels',x.judge_seat,'lines',ls.length,'old',old,'new',nw);}
 console.log(tok,'TOTAL',tot,'other key kept',out[0].json.other===1);}
