// W1 second-seat check of W2's HELD study (Wall 4541): first judge texts in 5 stored executions, verdict, RESULT, collision grades; E-HOLD agreement.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const content=x=>{if(typeof x==='string')return x;if(x&&x.choices&&x.choices[0])return x.choices[0].message.content;return null;};
let held=0,broken=0,other=0,heldUD=0,heldDW=0;const allUD={};let ag=0,tot=0;const rows=[];
for(const id of ['34299','34626','34703','34726','34780']){const ex=JSON.parse(fs.readFileSync(W+'ex'+id+'_full.json'));const r=(ex.data||ex).resultData.runData;
 for(const k of [1,2,3]){const node=r['Panel Judge '+k+' openrouter'];if(!node){console.log(id,'no Panel Judge',k);continue;}const j=node[0].data.main[0][0].json;let t=content(j.response!==undefined?j.response:j);if(!t){console.log(id,k,'no text');continue;}
  const model=(j.model||(j.response&&j.response.model)||'?');const vt=(t.match(/"verdict_tag"\s*:\s*"([A-Z-]+)"/)||[])[1]||'?';const res=(t.match(/RESULT:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||'?';
  const T=t.replace(/\\n/g,'\n');const col=[...T.matchAll(/(?:^|\n)\s*\**D\d+\s+vs\.?\s+C\d+[^\n]*?:\s*\**\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/g)].map(m=>m[1]);
  const ud=col.length&&col.every(g=>g==='UNDERDETERMINED');if(vt==='HELD'){held++;if(res==='UNDERDETERMINED')heldUD++;if(res==='DEFENDER WINS')heldDW++;}else if(vt==='BROKEN')broken++;else other++;
  rows.push(id+' J'+k+' '+model+' | verdict '+vt+' | RESULT '+res+' | collision grades '+col.length+' ('+[...new Set(col)].join('/')+')'+(ud?' ALL UD':''));}
 const jer=r['Judge Enforcer Record'];if(jer){for(const z of (jer.slice(-1)[0].data.main[0][0].json.enf428_rows||[]))if(z.rule==='E-HOLD'&&z.kind==='enforcer_check'&&z.response_line){tot++;if(/^\s*AGREE/i.test(z.response_line))ag++;}}}
rows.forEach(x=>console.log(x));console.log('HELD',held,'| BROKEN',broken,'| other',other,'| HELD with RESULT UNDERDETERMINED',heldUD,'| HELD with DEFENDER WINS',heldDW);console.log('E-HOLD rows with a response line',tot,'| AGREE',ag);
