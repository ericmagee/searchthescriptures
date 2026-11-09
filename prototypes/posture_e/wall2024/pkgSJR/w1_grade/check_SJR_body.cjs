// W1 grade of pkgSJR (78b82af): which conversation does SJ Re-ask Call openrouter send? Run from wall2024/.
const P=require('../parent_s82_SJR.json');const b=P.nodes.find(x=>x.name==='SJ Re-ask Call openrouter').parameters.jsonBody;
const tail=b.slice(b.lastIndexOf('})(')+3);console.log('SJ Re-ask Call openrouter body argument: '+tail);
console.log(/\$\('Build Independent Verdict'\)\.first\(\)\.json\.verdictBody/.test(tail)?'DEFECT: it sends Build Independent Verdict\'s ORIGINAL conversation; SJ Re-ask Build\'s added reply and ask are never sent.':'OK: it sends the re-ask conversation.');
