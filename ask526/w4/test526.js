// ASK 526 (W4): runs the final pass exactly as built into Alternate Merge (the added block, cut from the target node) on
// (a) the 37 stored rows whose array length differs from the count (W3's cpd37.json) and (b) the recorded Alternate Merge output of 41418.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const t=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const am=W.nodes.find(n=>n.name==='Alternate Merge').parameters.jsCode;const a=am.indexOf('\ntry{ /* ASK 526');const b=am.lastIndexOf('\nreturn __AMOUT;');const ADD=am.slice(a,b);
const $=n=>{if(n==='Shared Library')return {params:{jsCode:t}};throw new Error('unexpected $('+n+')');};
const pass=AM=>{const X=JSON.parse(JSON.stringify(AM));new Function('$','__AMOUT',ADD)($,X);return X;};
const out=[];
// (a) the 37
const D=JSON.parse(fs.readFileSync('/mnt/project-files/ask526/w3/cpd37.json','utf8'));let nd=0,nn=0,np=0;
for(const r of D){const body=JSON.stringify({payload:{judge_seat:r.seat,verdict_raw:r.raw}});const X=pass([{json:{bodies:[body]}}]);const nb=X[0].json.bodies[0];
 if(X[0].json.cpd526_error)out.push(r.id+' ERROR '+X[0].json.cpd526_error);
 if(nb===body){let ok=true;try{JSON.parse(r.raw.slice(0,r.raw.indexOf('}\n')+1));}catch(e){}out.push(r.id+' '+r.seat+' UNCHANGED (byte-equal)');nn++;continue;}
 nd++;const v0=r.raw,v1=JSON.parse(nb).payload.verdict_raw;
 // differences: arrays + appended lines only
 const A0=JSON.parse(v0.slice(v0.indexOf('{'),v0.indexOf('{')+require('vm').runInNewContext('0')||0)||'{}');
 const lines=v1.slice(v0.length>v1.length?0:0).split('\n');const added=v1.split('\n').filter(l=>!v0.split('\n').includes(l));
 const strip=s=>s.replace(/("counted_premises_(?:defender|challenger)"\s*:\s*)\[[^\]]*\]/g,'$1[]').replace(/\n\[AUDIT v50: COUNTED PREMISES DERIVED \(pkgCPD\) -- [^\n]*COUNT: FINAL PASS to [^\n]*/g,'');
 out.push(r.id+' '+r.seat+' DERIVED | '+added.filter(l=>/AUDIT v50/.test(l)).map(l=>(l.match(/SIDE: (\w+)/)||[])[1]+' '+(l.match(/WAS: (\[[^\]]*\]); NOW: (\[[^\]]*\])/)||[]).slice(1).join(' -> ')).join(' | ')+' | rest equal apart from arrays and DERIVED lines: '+(strip(v0)===strip(v1)));}
out.push('37 rows: derived '+nd+', unchanged '+nn);
// (b) 41418 recorded Alternate Merge output
const R=JSON.parse(fs.readFileSync('/mnt/project-files/ask524/w4/41418_part9.json','utf8')).runData['Alternate Merge'];const AM=R[R.length-1].data.main[0];
const X=pass(AM);const b0=AM[0].json.bodies,b1=X[0].json.bodies;out.push('41418 Alternate Merge: bodies '+b0.length+', error '+(X[0].json.cpd526_error||'none'));
b0.forEach((s,i)=>{const p0=JSON.parse(s).payload,p1=JSON.parse(b1[i]).payload;if(s===b1[i]){out.push('  '+p0.judge_seat+' byte-equal');return;}const add=p1.verdict_raw.split('\n').filter(l=>!p0.verdict_raw.split('\n').includes(l));const g=v=>{const m=v.match(/"counted_premises_defender"\s*:\s*(\[[^\]]*\])[\s\S]*?"counted_premises_challenger"\s*:\s*(\[[^\]]*\])/);return m?m.slice(1).join(' '):'?';};
 const strip=v=>v.replace(/("counted_premises_(?:defender|challenger)"\s*:\s*)\[[^\]]*\]/g,'$1[]').replace(/\n\[AUDIT v50: COUNTED PREMISES DERIVED \(pkgCPD\) -- [^\n]*COUNT: FINAL PASS to [^\n]*/g,'');
 const other=Object.keys({...p0,...p1}).filter(k=>k!=='verdict_raw'&&JSON.stringify(p0[k])!==JSON.stringify(p1[k]));
 out.push('  '+p0.judge_seat+' CHANGED: arrays '+g(p0.verdict_raw)+' -> '+g(p1.verdict_raw)+'; other payload fields changed: '+(other.join(',')||'none')+'; rest of verdict_raw equal: '+(strip(p0.verdict_raw)===strip(p1.verdict_raw))+'\n    ADDED: '+add.join('\n    ADDED: '));});
const other=Object.keys(AM[0].json).filter(k=>k!=='bodies'&&JSON.stringify(AM[0].json[k])!==JSON.stringify(X[0].json[k]));out.push('41418 other output keys changed: '+(other.join(',')||'none'));
console.log(out.join('\n'));
