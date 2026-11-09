// pkgFUK: every stored cure reply (all runs, all 6 Normalize nodes) through live s89 (strip_VP1_s84) and strip_FUK. Output must be byte-equal except where FUK adds a NO REASON ask.
process.chdir(require('path').resolve(__dirname,'..'));const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');const D='/mnt/project-files/wall2024/inputs/';
const NODES=['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3','Alternate Cure Normalize','R2 Alternate Cure Normalize','Cure Normalize'];
let eq=0,asks=0,other=0,n=0;const out=[];
for(const f of fs.readdirSync(D).sort()){const m=f.match(/^(\d+)_(.+)_openrouter\.json$/);if(!m)continue;const nm=NODES.find(x=>x.replace('Normalize','Call').replace(/ /g,'_')===m[2]);if(!nm)continue;const run=m[1],inp=nm.replace('Normalize','Call')+' openrouter',file=nm.replace(/ /g,'_')+'.js';n++;
 let a,b;try{a=harness(run,{})(R('pkgLIB/strip_VP1_s84/patched/'+file),inp);}catch(e){a={err:e.message};}try{b=harness(run,{})(R('pkgLIB/strip_FUK2/patched/'+file),inp);}catch(e){b={err:e.message};}
 const A=JSON.stringify(a),B=JSON.stringify(b);if(A===B){eq++;out.push('EQUAL '+run+' '+nm+(a&&a[0]&&a[0].json&&a[0].json.fum?' (live asks '+a[0].json.fum.asked.length+')':''));continue;}
 // allowed difference: FUK asks NO REASON items in addition; the reply and cure are equal; earlier asks unchanged
 const fa=(a[0].json.fum&&a[0].json.fum.asked)||[],fb=(b[0].json.fum&&b[0].json.fum.asked)||[];const nr=fb.filter(x=>x.startsWith('NO REASON '));
 const same=JSON.stringify(a[0].json.reply)===JSON.stringify(b[0].json.reply)&&JSON.stringify(a[0].json.cure)===JSON.stringify(b[0].json.cure)&&JSON.stringify(fb.filter(x=>!x.startsWith('NO REASON ')))===JSON.stringify(fa)&&nr.length>0;
 if(same){asks++;out.push('ASKS  '+run+' '+nm+': '+nr.join(' ; ').slice(0,300));}else{other++;out.push('OTHER '+run+' '+nm);}}
console.log(out.join('\n'));console.log(n+' stored cure replies: '+eq+' byte-equal, '+asks+' differ only by an added NO REASON ask, '+other+' other differences');process.exit(other?1:0);
