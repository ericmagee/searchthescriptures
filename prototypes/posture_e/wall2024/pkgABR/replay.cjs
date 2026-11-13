// pkgABR replay: every stored E-ANS MEETS line the absence check reads (pkgAJN pop_check, 8,651 rows), run through ABS.check of the
// parent and the target "Send Back Build". Reports raises old/new and every difference. node replay.cjs <parent json> <target json>
const fs=require('fs');const {load}=require(__dirname+'/mods.cjs');const [,,P,T]=process.argv;
const wf=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));return (W.nodes||W.workflow.nodes).find(n=>n.name==='Shared Library').parameters.jsCode;};
const O=load(wf(P),'Send Back Build'),N=load(wf(T),'Send Back Build');const D='/mnt/project-files/wall2024/pkgAJN/';
const ctx={rows:JSON.parse(fs.readFileSync(D+'kjv_rows.json','utf8')),ow:[],lex:[]};const chk=JSON.parse(fs.readFileSync(D+'pop_check.json','utf8'));
let n=0,nul=0,ro=0,rn=0;const d=[];
for(const r of chk){if(r.fl==null){nul++;continue;}n++;const id={rule:'E-ANS',grade:'MEETS',flagged_line:r.fl};const a=O.ABS.check(id,ctx),b=N.ABS.check(id,ctx);if(a.raise)ro++;if(b.raise)rn++;
 if(a.raise!==b.raise||a.fit!==b.fit||a.absence!==b.absence)d.push({id:r.id,run:r.run,seat:r.seat,old:a.raise?'RAISE':'no',new:b.raise?'RAISE':'no',why:b.why});}
console.log('E-ANS MEETS lines read',n,'| NULL',nul,'| raises old',ro,'new',rn,'| differences',d.length);d.forEach(x=>console.log('  ',JSON.stringify(x)));
