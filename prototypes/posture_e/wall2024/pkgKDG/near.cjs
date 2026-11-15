// pkgKDG rev 2: a link with both grounds carries both sentences (W3 6493)
const fs=require('fs');const src=fs.readFileSync(__dirname+'/../a301/kda.js','utf8')+'\n'+fs.readFileSync(__dirname+'/kdg.js','utf8');
const F={cr2:'### PREMISE 3 (D3)\n- [L2] gennaō with ek (out of) names the begetter in Matthew 1:20.\n- [L4] Luke 1:35: dio kai (therefore also) ties the title to the Holy Ghost coming.\n'};
const $=nm=>{if(nm==='Final Output')return {isExecuted:true,first:()=>({json:F})};return {isExecuted:false,first:()=>{throw 0},all:()=>[]};};
const f=new Function('$',src+'\nreturn {kdgPush2024,kdgLinks2024};')($);const items=[],marks=[];f.kdgPush2024('D3 vs C2 (Luke 1:34): UNDERDETERMINED -- x\nD3: STANDS\nD4 vs C1 (Isaiah 7:14): UNDERDETERMINED -- x',items,marks);
console.log(JSON.stringify(f.kdgLinks2024(F)[3].map(z=>z.ty)));for(const i of items)console.log(i.link,'|',i.line.slice(0,900),'\n');console.log('items',items.length);
