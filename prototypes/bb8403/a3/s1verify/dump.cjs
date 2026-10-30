const fs=require('fs');const dir=process.argv[2];const r=f=>fs.readFileSync(dir+'/'+f,'utf8');
const LF='\n';let s=fs.readFileSync(__dirname+'/pwl_new.js','utf8').replace('const PWL=','globalThis.PWL=').replace('return {ledger,','return {refs,items,lastHead,ledger,');eval(s);
const F={cr1:r('claude_r1.txt'),cr2:r('claude_r2.txt'),cr3:r('engine_r3.txt'),gr1:r('engine_r1.txt'),gr2:r('engine_r2.txt'),dr3:r('challenger_r3.txt')};
const i=PWL.lastHead(F.cr3,/CHALLENGER.S UNSUPPORTED-L4 PREMISES/gi);const list=F.cr3.slice(i);
PWL.items(list).forEach((x,k)=>console.log('P'+(k+1)+': '+PWL.refs(x).map(q=>(q.book||('~'+q.ctx))+' '+q.label+' ['+q.cvs.join(',')+']').join(' | ')));
const j=PWL.lastHead(F.gr2,/UNSUPPORTED-L4 PREMISES/gi);console.log('DEF list at',j);PWL.items(F.gr2.slice(j)).forEach((x,k)=>console.log('D'+(k+1)+': '+x.slice(0,160).replace(/\n/g,' ')));
