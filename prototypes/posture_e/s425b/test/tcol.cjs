// usage: node tcol.cjs <colblock.js> <exec.json> : runs the COLLISION POINTS read of Extract Independent Verdict on the stored single-judge text
const fs=require('fs');const [,,bf,ef]=process.argv;let blk=fs.readFileSync(bf,'utf8');
const o=JSON.parse(fs.readFileSync(ef,'utf8')).data.resultData.runData['Build Save Body'][0].data.main[0][0].json;
let src=String(o.independent_verdict_raw||'');const cut=src.search(/\n\n\[(?:AUDIT|EXTRACTOR|REVIEW|TRUNCATED)/);if(cut>0)src=src.slice(0,cut);
const opens=(blk.match(/\{/g)||[]).length-(blk.match(/\}/g)||[]).length;blk+='}'.repeat(Math.max(0,opens));
const f=new Function('upper','n','w',"let raw='';"+blk+";for(const u of colUnparsed)raw+='[AUDIT v18: COLLISION POINTS ENTRY NOT READ: '+u+']';return {raw,colMap,colUnparsed};");
const r=f(src.toUpperCase(),null,null);
console.log('NOT READ',(r.raw.match(/ENTRY NOT READ/g)||[]).length,'| entries read',Object.keys(r.colMap).length,'| other v18 lines',(r.raw.match(/\[AUDIT v18/g)||[]).length-(r.raw.match(/ENTRY NOT READ/g)||[]).length);
