const fs=require('fs');
const rows={'30091':JSON.parse(fs.readFileSync('row_49774304-6140-4ac7-953d-e0577caf83a9.json','utf8')),'B':JSON.parse(fs.readFileSync('row_d1c76ad8-c1da-4790-ad19-9e62d6ea9f5d.json','utf8'))};
for(const k in rows){if(Array.isArray(rows[k]))rows[k]=rows[k][0];}
function grab(src,start,endMark){const i=src.indexOf(start);if(i<0)throw new Error('anchor '+start);const j=src.indexOf(endMark,i);return src.slice(i,j+endMark.length);}
const out=[];
for(const ver of ['base','new']){
 const pb=fs.readFileSync(ver==='base'?'Panel_Build.base.js':'e/new/Panel_Build.js','utf8');
 const itemsSrc=grab(pb,'const items=t=>',';');  // first statement terminator after regex literal
 // the arrow ends at the first ';' after '.test(x))' -> grab to '.test(x));'
 const itemsFull=grab(pb,'const items=t=>','.test(x));');
 const items=eval('('+itemsFull.replace('const items=','').replace(/;$/,'')+')');
 const ex=fs.readFileSync(ver==='base'?'Extract_Independent_Verdict.base.js':'e/new/Extract_Independent_Verdict.js','utf8');
 const sc=grab(ex,'const seqCount=','return c;};');
 const seqCount=eval('('+sc.replace('const seqCount=','').replace(/;$/,'')+')');
 const head=/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i;
 for(const r of ['30091','B']){
  const t=rows[r].engine_r2; const h=t.search(/UNSUPPORTED-?\s*L4\s*PREMISES/i); const list=t.slice(h);
  const d=rows[r].engine_r3; const hd=d.search(/CHALLENGER.S UNSUPPORTED/i); const dlist=d.slice(hd);
  out.push(`${ver} run ${r}: items(chal list)=${items(list).length} items(def list)=${items(dlist).length} seqCount(gr2)=${seqCount(t,head)}`);
 }
}
console.log(out.join('\n'));
