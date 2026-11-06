const fs=require('fs'),cr=require('crypto');
const live=JSON.parse(fs.readFileSync(process.argv[2]));
const nodes=live.workflow.nodes;
const byName={};for(const n of nodes)byName[n.name]=n;
const m=JSON.parse(fs.readFileSync('merged_DVCK/manifest.json'));
const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,16);
let bad=0;
for(const e of m.nodes){
 const ln=byName[e.name]; const lc=ln&&ln.parameters.jsCode;
 const f='merged_DVCK/'+e.name.replace(/ /g,'_')+'.js'; const fc=fs.readFileSync(f,'utf8');
 let parse='ok';try{new Function(fc)}catch(err){try{new Function('return (async()=>{'+fc+'\n})')}catch(e2){parse='FAIL '+e2.message;bad++}}
 const okL=lc&&h(lc)===e.live_sha, okF=h(fc)===e.final_sha;
 if(!okL||!okF)bad++;
 console.log(e.name.padEnd(30),okL?'live=7599':'LIVE MISMATCH',okF?'final ok':'FINAL MISMATCH',parse);
}
console.log(bad?'BAD '+bad:'ALL OK');
