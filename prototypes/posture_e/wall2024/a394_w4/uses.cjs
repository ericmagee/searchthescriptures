const fs=require('fs');const {unpack}=require('../tools/lib.cjs');const w=JSON.parse(fs.readFileSync(__dirname+'/../rdf/fetchback_s262.json'));const {L,M}=unpack(w);
const show=(name,defLi,span)=>{const re=new RegExp('(?<![\\w$.])'+name.replace(/\$/g,'\\$')+'(?![\\w$])','g');console.log('==== '+name+' def L'+defLi);
 for(let li=defLi;li<Math.min(L.length,defLi+span);li++){const l=L[li];for(const m of l.matchAll(re)){if(li===defLi&&/const\s*$/.test(l.slice(0,m.index)))continue;console.log('  L'+li+' @'+m.index+': '+l.slice(Math.max(0,m.index-260),m.index+260).replace(/\n/g,' '));}}};
const args=process.argv.slice(2);for(let i=0;i<args.length;i+=3)show(args[i],+args[i+1],+args[i+2]);
