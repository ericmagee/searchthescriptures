// W3: scan stored rounds of 34726 for bare chapter:verse references (no book name directly before) and print each with the nearest earlier full reference.
const r=require('../../grade_34726_w3/rounds.json');
const BOOK='(?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?';
const full=new RegExp('('+BOOK+') (\\d+):(\\d+)','g');
const out=[];
for(const k in r){const s=String(r[k]);const re=/(^|[^\d:])(\d{1,3}):(\d{1,3})(?![\d:])/g;let m;
 while((m=re.exec(s))){const at=m.index+m[1].length;const before=s.slice(Math.max(0,at-30),at);
  if(new RegExp(BOOK+' $').test(before)&&!/\b(?:So|And|But|At|In|As|Then|That|Of|From|With|By|To|On|See|Cf|Verse|Verses|Chapter|Thus|Since|Because|Here|Both|Where|When|While|If|Its|The|This) $/.test(before))continue;
  if(/[;,\-–] ?$/.test(before)&&/\d ?[;,\-–] ?$/.test(before)){out.push({k,kind:'list',ctx:s.slice(Math.max(0,at-70),at+12).replace(/\n/g,' ')});continue;}
  let last=null,f;full.lastIndex=0;const pre=s.slice(0,at);while((f=full.exec(pre)))last=f[1];
  out.push({k,kind:/[A-Z][a-z]+ $/.test(before)?'capword':'bare',ref:m[2]+':'+m[3],nearest:last,ctx:s.slice(Math.max(0,at-70),at+12).replace(/\n/g,' ')});}}
const c={};out.forEach(o=>c[o.kind]=(c[o.kind]||0)+1);console.log(JSON.stringify(c));
require('fs').writeFileSync(__dirname+'/bare_refs_34726.json',JSON.stringify(out,null,1));
for(const kind of ['capword','bare','list'])out.filter(o=>o.kind===kind).slice(0,7).forEach(o=>console.log(kind,o.k,o.ref||'',o.nearest||'','|',o.ctx));
