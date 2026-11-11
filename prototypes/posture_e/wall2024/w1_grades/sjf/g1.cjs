// W1 grade of pkgSJF: planted single-judge replies through s136 Verdict Normalizer and Extract Independent Verdict (35067 inputs),
// then the SJ Re-ask? expression and SJ Re-ask Build of s136 and of SJF.
const fs=require('fs');const LIB=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../../pkgKSR/run_node.cjs');
const L=LIB('/tmp/claude-0/fb136.json');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const S6=un('/tmp/claude-0/fb136.json'),SJ=un('/mnt/project-files/wall2024/parent_s136_SJF.json');
const node=(W,n)=>W.nodes.find(x=>x.name===n);
const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));const rd=ex.data.resultData.runData;
const stored=rd['Verdict Call openrouter'][0].data.main[0][0].json;const full=String(stored.choices[0].message.content);
const r74=JSON.parse(fs.readFileSync('/mnt/project-files/w4/ask74/reply.json','utf8'));const t74=String((r74.body||r74).choices[0].message.content);
const ex26=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34726_full.json','utf8'));const t26=String(ex26.data.resultData.runData['Verdict Call openrouter'][0].data.main[0][0].json.choices[0].message.content);
const ex52=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json','utf8'));const t52=String(ex52.data.resultData.runData['Verdict Call openrouter'][0].data.main[0][0].json.choices[0].message.content);
const cpIdx=full.indexOf('COLLISION POINTS:');
const P={
 'stored 35067 full':full,'stored 34852 full (on 35067 inputs)':t52,'stored 34726 partial (on 35067 inputs)':t26,'ASK 74 decline':t74,
 'W1-a lower-case "Collision points:"':full.replace('COLLISION POINTS:','Collision points:'),
 'W1-b "COLLISION POINTS -" dash':full.replace('COLLISION POINTS:','COLLISION POINTS -'),
 'W1-c "### 3) COLLISION POINTS"':full.replace('COLLISION POINTS:','### 3) COLLISION POINTS'),
 'W1-d heading present, body empty':full.slice(0,cpIdx)+'COLLISION POINTS:\n\n'+full.slice(full.indexOf('\n\n',cpIdx+20)),
 'W1-e full judgment quoting the audit wording':full+'\n\nNote: COLLISION MAP: NO COLLISION POINTS SECTION does not apply here.',
 'W1-f HELD verdict-word decline, no marks':'**Provisional result: HELD.** I cannot certify the full judgment in the requested form; the checks are not complete.',
 'W1-g no verdict word, no marks':'I cannot determine a verdict from this record.',
 'W1-h "COLLISION POINTS" in a table cell':full.replace('COLLISION POINTS:','| COLLISION POINTS |\n|---|'),
};
const gate=(W,j,reaskDone)=>{const lv=node(W,'SJ Re-ask?').parameters.conditions.conditions[0].leftValue.replace(/^=\{\{/,'').replace(/\}\}$/,'');
 const $=n=>n==='SJ Re-ask Build'?{isExecuted:!!reaskDone}:n==='Build Independent Verdict'?{first:()=>({json:{jidx:5}})}:{isExecuted:false};const $json=j;return eval(lv);};
(async()=>{for(const [k,t] of Object.entries(P)){const rep=JSON.parse(JSON.stringify(stored));rep.choices[0].message.content=t;
 const over={'Verdict Call openrouter':[[{json:rep}]]};const vn=await run(L.code('Verdict Normalizer'),'Verdict Normalizer',rd,over,[{json:rep}]);if(vn.err){console.log(k,'VN ERR',vn.err);continue}
 over['Verdict Normalizer']=[vn.map(j=>({json:j}))];const ev=await run(L.code('Extract Independent Verdict'),'Extract Independent Verdict',rd,over,vn.map(j=>({json:j})));if(ev.err){console.log(k,'EIV ERR',ev.err);continue}
 const j=ev[0];const flag=/COLLISION MAP: NO COLLISION POINTS SECTION/.test(String(j.independent_verdict_raw||''));
 const res=[];for(const [lab,W] of [['s136',S6],['SJF',SJ]]){const g=gate(W,j,false);let mode='-',miss='';if(g){over['Extract Independent Verdict']=[ev.map(x=>({json:x}))];const b=await run(node(W,'SJ Re-ask Build').parameters.jsCode,'SJ Re-ask Build',{...rd,'SJ Re-ask Build':rd['Extract Independent Verdict']},over,ev.map(x=>({json:x})));if(b.err)mode='ERR '+b.err;else{const s=JSON.stringify(b);mode=(s.match(/"mode":"(\w+)"/)||[])[1]||'?';const m=s.match(/Your (?:reply|judgment) above (?:cannot be read as a judgment: it has|has) ([^.]*)\./);miss=m?m[1]:'';}}
  res.push(lab+': '+(g?'FIRE '+mode:'none')+(g&&lab==='SJF'?' ['+miss+']':'')+(g?' | again after re-ask: '+(gate(W,j,true)?'FIRES':'shut'):''));}
 const cp=Object.keys(j).filter(x=>/collision/i.test(x)).map(x=>x+'='+JSON.stringify(j[x]).slice(0,40));
 console.log(k,'| tag',j.verdict_tag,'| marks',j.defender_chain_mark||'null',j.challenger_chain_mark||'null','| no-CP flag',flag,'|',res.join(' || '));}})();
