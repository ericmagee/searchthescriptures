const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const A=n=>fs.readFileSync('pkgLIB/strip_RI2/patched/'+n+'.js','utf8'),B=n=>fs.readFileSync('pkgLIB/strip_FCW/patched/'+n+'.js','utf8');
const cut=t=>{const i=t.indexOf('\n\n[AUDIT');return i>=0?t.slice(0,i):t;};
const loadSBR=(R,f)=>{const j=JSON.parse(fs.readFileSync(D+R+'_'+f+'.json'));return j[0].data?j[0].data.main[0]:j[0].main[0];};
function run(R,cureFile,cureFd,sbrName,gateFile){
 const byOf=src=>{const o={};(harness(R)(src(cureFile),cureFd)[0].json.bodies||[]).forEach(s=>{const b=JSON.parse(s);o[b.payload.judge_seat]=b.payload.verdict_raw;});return o;};
 const ba=byOf(A),bb=byOf(B);const seats=Object.keys(bb).filter(k=>ba[k]!==bb[k]);
 const sbr=loadSBR(R,sbrName.replace(/ /g,'_'));
 const mk=by=>sbr.map(it=>{const j=JSON.parse(JSON.stringify(it.json));j.bodies=(j.bodies||[]).map(s=>{const b=JSON.parse(s);const seat=b.payload.judge_seat;if(seats.includes(seat)){const old=b.payload.verdict_raw;const tail=old.indexOf('\n\n[AUDIT')>=0?old.slice(old.indexOf('\n\n[AUDIT')):'';b.payload.verdict_raw=cut(by[seat])+tail;}return JSON.stringify(b);});return {json:j};});
 const ga=harness(R,{[sbrName]:mk(ba)})(A(gateFile),sbrName),gb=harness(R,{[sbrName]:mk(bb)})(B(gateFile),sbrName);
 const items=x=>{const out=[];const walk=o=>{if(Array.isArray(o))o.forEach(walk);else if(o&&typeof o==='object'){if(o.kind&&('why' in o||'src' in o))out.push([o.kind,o.why||'',o.to||'',o.seat||''].join(' | ').replace(/\b[SG]\d+\b/g,'#'));Object.values(o).forEach(walk);}};walk(x);return out;};const la=items(ga),lb=items(gb);const sa=new Set(la),sbb=new Set(lb);
 const gone=la.filter(x=>!sbb.has(x)),added=lb.filter(x=>!sa.has(x));
 console.log('== '+R+' '+gateFile+' seats changed: '+seats.join(',')+' | lines only in base '+gone.length+', only in FCW '+added.length);
 gone.slice(0,40).forEach(x=>console.log('  - '+x.slice(0,200)));added.slice(0,40).forEach(x=>console.log('  + '+x.slice(0,200)));
}
for(const R of ['33222','33261','33592','33506'])try{run(R,'Panel_Cure_Check','Panel Cure Normalize 3','Send Back Record','Gate_Build');}catch(e){console.log(R,'ERR',e.stack.slice(0,300));}
try{run('33461','Alternate_Merge_Seat','Alternate Cure Normalize','Alt Send Back Record','Alt_Gate_Build');}catch(e){console.log('33461 ERR',e.stack.slice(0,300));}
