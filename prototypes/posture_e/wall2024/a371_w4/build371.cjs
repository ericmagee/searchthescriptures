// ASK 371 rev 5 (W1 7788, 7799, 7805): the carry word check in the ECW module (LIB entry 3500). Usage: node build371.cjs <base.json> <base versionId> <out.json>
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync(process.argv[2]));const BASEV=process.argv[3];if(w.versionId!==BASEV)throw new Error('base moved: '+w.versionId);
const u=unpack(w);const L=u.L.slice();const I=L.findIndex(e=>e.startsWith('const ECW=(()=>{ /* pkgECW'));if(I<0)throw new Error('ECW entry not found');
const rep=(o,n)=>{const c=L[I].split(o).length-1;if(c!==1)throw new Error('anchor count '+c+': '+o.slice(0,60));L[I]=L[I].replace(o,()=>n);};
const BLOCK=fs.readFileSync(__dirname+'/cw_block.js','utf8').replace(/\n$/,'');
rep(" /* gate: {applies:false} | {send:true,note,cb} | {send:false,why} */",BLOCK+"\n /* gate: {applies:false} | {send:true,note,cb} | {send:false,why} */");
rep("  if(c.kind==='ROW'){const n=N(c.words).split(' ').filter(Boolean).length;if(n<6)return {applies:true,send:false,why:'its CARRIED BY quotes '+n+' words of '+c.ref+', fewer than 6'};",
    "  if(c.kind==='ROW'){const n=N(c.words).split(' ').filter(Boolean).length;if(n<6)return {applies:true,send:false,why:'its CARRIED BY quotes '+n+' words of '+c.ref+', fewer than 6'};\n   const cw=cwCheck(x.flagged_line,c.words);if(cw&&!cw.pass)return {applies:true,send:false,why:cw.why};const cwn=cw?'; '+cw.note:'; carry word check (ASK 371) NOT CHECKED: the line quotes no answer words';");
rep("note:'CARRIED BY '+c.ref+' \"'+c.words.slice(0,200)+'\"; NOT CHECKED against the verse: '+c.ref+' was not read this run'};","note:'CARRIED BY '+c.ref+' \"'+c.words.slice(0,200)+'\"; NOT CHECKED against the verse: '+c.ref+' was not read this run'+cwn};");
rep("note:'CARRIED BY '+c.ref+' \"'+c.words.slice(0,200)+'\": the words stand in the verse and the answering round cites it'};}","note:'CARRIED BY '+c.ref+' \"'+c.words.slice(0,200)+'\": the words stand in the verse and the answering round cites it'+cwn};}");
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync(process.argv[4],JSON.stringify(w));fs.writeFileSync(__dirname+'/ecw_new.js',L[I]);console.log('ECW entry',I,u.L[I].length,'->',L[I].length,'| MAP n updated',fixed.length,fixed.join(', '));
