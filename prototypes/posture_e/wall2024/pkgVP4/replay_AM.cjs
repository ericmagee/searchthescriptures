// pkgVP4: Alternate Merge, base (pkgVP1 on s85) against VP4, on every saved run that has the node's input. No Assume Check Record exists in them.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const code=(f,n)=>JSON.parse(fs.readFileSync(f,'utf8')).nodes.find(x=>x.name===n).parameters.jsCode;
const A=code(__dirname+'/../pkgVP1/parent_s85_VP1.json','Alternate Merge'),B=code(__dirname+'/parent_s85_VP1_VP4.json','Alternate Merge');
(async()=>{let n=0,eq=0,err=0,diff=[];for(const f of fs.readdirSync(D).filter(f=>/^\d+_Alternate_Merge\.json$/.test(f))){const RUN=f.split('_')[0];
 const go=async c=>{try{return JSON.stringify(await harness(RUN,{})('return (async()=>{\n'+c+'\n})();','Alternate Merge'));}catch(e){return 'ERR '+String(e.message).slice(0,120);}};
 const a=await go(A),b=await go(B);n++;if(a===b){eq++;if(a.startsWith('ERR'))err++;}else diff.push(RUN);}
 console.log('Alternate Merge runs '+n+', equal '+eq+' (same error '+err+'), differ '+diff.length+(diff.length?': '+diff.join(', '):''));})();
