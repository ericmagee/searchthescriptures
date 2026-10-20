// 6936 narrowing, measured: the node counter (narrow Latin range) against kb.cjs 29caa5c (wide) on probe lines built around one source word each.
const fs=require('fs');const {execFileSync}=require('child_process');
const drvKinds=new Function(fs.readFileSync(__dirname+'/drv_block.js','utf8')+'\nreturn drvKinds;')();
const W=['café','naïve','×2','résumé','ā (alef)','ē','ḥesed','ʿalmah','bêt','ēmet','γέννησις','חסד','H2617','plain dei'];
const L=W.map(w=>['probe '+w,'D1 vs C1 (Genesis 1:1): DEFENDER LINK BROKEN -- [L1] "in the beginning" and [L2] '+w+' contradict it.']);
const out=execFileSync('node',[__dirname+'/kb.cjs'],{input:JSON.stringify(L)}).toString().trim().split('\n');
L.forEach(([n,l],i)=>console.log(n.padEnd(18),'kb 29caa5c (wide):',+out[i].match(/C distinct layers:\s*(\d+)/)[1],' node (narrow):',drvKinds(l).length));
