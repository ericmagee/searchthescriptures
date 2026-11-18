// ASK 386 rev 2 (W2 8474 defects 1 and 2, W3 8473 item 3, W1 2f to 2h): edits build386.cjs (rev 1 kept as build386_rev1.cjs).
const fs=require('fs');const p=__dirname+'/build386.cjs';let s=fs.readFileSync(p,'utf8');
const R=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));s=s.replace(a,()=>b);};
// 2h: the tie needs both standings present and both counts numeric
R("const tie=!col.some(z=>!z.grade)&&!col.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))&&i.dst===i.cst&&i.cd===i.cc;",
  "const tie=!!i.dst&&!!i.cst&&typeof i.cd==='number'&&typeof i.cc==='number'&&!col.some(z=>!z.grade)&&!col.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))&&i.dst===i.cst&&i.cd===i.cc;");
R("equal standings and counts) turns","equal standings and counts, every one present; a missing field is not equal) turns");
// 2f: one retracted list (ret386) for ert386, v25 and v37
const a=s.indexOf("const ret=[];for(const m of s.matchAll(");const b=s.indexOf("const P=rcLines(cureJText(s,true));",a);if(a<0||b<0)throw new Error('ret anchor');
s=s.slice(0,a)+"const ret=ret386(s,seat);"+s.slice(b);
R("L[1286]=L[1286]+' '+RD+' '+ERT;","L[1286]=L[1286]+' '+RD+' '+RET+' '+ERT;");
R("// 1. library:",`function ret386(s,seat,add){/* ASK 386 rev 2 (W3 8473 item 3; W1 2f): one retracted list for ert386, v25 and v37: the links named by the seat's AUDIT v21 CORRECTED RESULT tags, plus the links the caller has just retracted. */const K=x=>String(x||'').toUpperCase().replace(/\\s+VS\\.?\\s+/,' VS ').trim();const ret=[];const put=y=>{y=String(y||'').trim();if(/^D\\d+\\s+vs\\.?\\s+C\\d+$/i.test(y)&&!ret.some(z=>K(z)===K(y)))ret.push(y);};for(const m of String(s==null?'':s).matchAll(/\\[AUDIT v21: CORRECTED RESULT -- SEAT: ([^;\\]]*); ORIGINAL: \\w+; COUNTED: \\w+ \\([A-Z]+-\\d\\)(?:; RETRACTED: ([^\\]]*))?\\]/g)){if(m[1]!==seat||!m[2])continue;for(const x of m[2].split(/\\s*,\\s*/))put(x);}for(const x of (add||[]))put(x);return ret;}
const RET=ret386.toString();
// 1. library:`);
// v25: pass the retracted list (this cure's own retractions plus earlier v21 tags)
R("const __d386=rd386({verdict:word,cst,dst,cd:c.DEFENDER,cc:c.CHALLENGER,col});if(__d386.tie",
  "const __d386=rd386({verdict:word,cst,dst,cd:c.DEFENDER,cc:c.CHALLENGER,col,retracted:ret386(text,seat,rp.filter(r=>/^RETRACTED /.test(String(r[2]||''))).map(r=>String(r[2]).slice(10)))});if(__d386.tie");
// v37
R("\" const __d386=rd386({verdict:word,cst,dst,cd:c.DEFENDER,cc:c.CHALLENGER,col});let res=__d386.word;",
  "\" const __d386=rd386({verdict:word,cst,dst,cd:c.DEFENDER,cc:c.CHALLENGER,col,retracted:ret386(raw,seat)});let res=__d386.word;");
// 2h at 1336 and in v37 (1491)
R("// 3. v37",`rep(1336,"&&a1===a2&&n1===n2&&","&&!!a1&&!!a2&&typeof n1==='number'&&typeof n2==='number'&&a1===a2&&n1===n2&&");
// 3. v37`);
R("rep(1493,",`rep(1491,"&&dst===cst&&c.DEFENDER===c.CHALLENGER;","&&!!dst&&!!cst&&typeof c.DEFENDER==='number'&&typeof c.CHALLENGER==='number'&&dst===cst&&c.DEFENDER===c.CHALLENGER;");
rep(1493,`);
// 2g: MAP entry gains cjrLoose2024 (904 to 905)
R("p:[[240,328],903,1286,","p:[[240,328],903,[904,905],1286,");
// 2g: per-body and per-record failures recorded
R("const o=__AMOUT&&__AMOUT[0]&&__AMOUT[0].json;\\n if(o&&Array.isArray(o.bodies))o.bodies=o.bodies.map(s=>{try{const j=JSON.parse(s);",
  "const o=__AMOUT&&__AMOUT[0]&&__AMOUT[0].json;const __er=[];\\n if(o&&Array.isArray(o.bodies))o.bodies=o.bodies.map((s,bi)=>{let __st='body '+bi;try{const j=JSON.parse(s);");
R("const p=j.payload||{};if(!p.judge_seat||typeof p.verdict_raw!=='string')return s;","const p=j.payload||{};if(p.judge_seat)__st+=' seat '+p.judge_seat;if(!p.judge_seat||typeof p.verdict_raw!=='string')return s;");
R("return JSON.stringify(j);}catch(e){return s;}});","return JSON.stringify(j);}catch(e){__er.push(__st+': '+String(e&&e.message||e));return s;}});");
R("o.drv_removed=o.drv_removed.map(x=>{try{","o.drv_removed=o.drv_removed.map((x,ri)=>{try{");
R("return {...x,verdict_raw:__E(x.verdict_raw,x.seat,x)};}catch(e){return x;}});","return {...x,verdict_raw:__E(x.verdict_raw,x.seat,x)};}catch(e){__er.push('removed '+ri+(x&&x.seat?' seat '+x.seat:'')+': '+String(e&&e.message||e));return x;}});\\n if(o&&__er.length)o.ert386_error=__er.join(' | ');");
fs.writeFileSync(p,s);console.log('rev 2 edits applied');
