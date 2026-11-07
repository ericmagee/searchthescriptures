// pkgPMR replay: Citation Scan, base vs patched, on stored rounds. R3 rounds of 33040-33197 (pkgUNX/replay_rows.json: e3 = [CR3], c3 = [DR3]),
// and the whole debate of 33197 and 33218 (inputs/<run>_Final_Output.json). Prints every item whose fields differ (only alt may differ).
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');
const scan=(file,F)=>{const $=n=>{if(n==='Regrade Load')return {isExecuted:false,first:()=>({json:{}})};if(n==='Final Output')return {first:()=>({json:F})};throw new Error('unexpected '+n);};
 return new Function('$','$input',rd(file))($,null)[0].json.items;};
const runs=[];for(const r of JSON.parse(rd('pkgUNX/replay_rows.json')))runs.push({run:r.run.slice(5,10)+' (R3 only)',F:{cr3:r.e3||'',dr3:r.c3||''}});
for(const n of ['33197','33218']){const d=JSON.parse(rd('/mnt/project-files/wall2024/inputs/'+n+'_Final_Output.json'))[0];runs.push({run:n+' (whole)',F:(d.main||d.data.main)[0][0].json});}
const out=[];let tot=0;
for(const {run,F} of runs){const a=scan('pkgPMR/base/Citation_Scan.js',F),b=scan('pkgPMR/patched/Citation_Scan.js',F);tot+=a.length;
 if(a.length!==b.length){out.push(run+': ITEM COUNT '+a.length+' -> '+b.length);continue;}
 a.forEach((x,i)=>{const y=b[i];const {alt:xa,...xr}=x,{alt:ya,...yr}=y;if(JSON.stringify(xr)!==JSON.stringify(yr))out.push(run+' #'+i+': OTHER FIELD CHANGED');else if(JSON.stringify(xa)!==JSON.stringify(ya))out.push(run+' '+x.side+' '+x.round+' '+x.ref+' alt '+(xa?xa.ref:'none')+' -> '+(ya?ya.ref:'none')+' | "'+String(x.quote).slice(0,90)+'"');});}
console.log('items scanned (base): '+tot+'\n'+(out.join('\n')||'no change'));fs.writeFileSync('pkgPMR/scan_PMR.txt','items '+tot+'\n'+(out.join('\n')||'no change')+'\n');
