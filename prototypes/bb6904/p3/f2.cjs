// F2: the node counter (drv_block.js) against kb.cjs (git 29caa5c) form C distinct, line by line. Usage: node f2.cjs <lines.json>...
const fs=require('fs');const {execFileSync}=require('child_process');
const blk=fs.readFileSync(__dirname+'/drv_block.js','utf8');const drvKinds=new Function(blk+'\nreturn drvKinds;')();
let n=0,bad=0;
for(const f of process.argv.slice(2)){const L=JSON.parse(fs.readFileSync(f,'utf8'));
 const out=execFileSync('node',[__dirname+'/kb.cjs'],{input:JSON.stringify(L)}).toString().trim().split('\n');
 L.forEach(([name,line],i)=>{const kb=+out[i].match(/C distinct layers:\s*(\d+)/)[1];const nd=drvKinds(line).length;n++;if(kb!==nd){bad++;console.log('DIFF',f,name,'kb',kb,'node',nd);}});}
console.log('lines',n,'differences',bad);
