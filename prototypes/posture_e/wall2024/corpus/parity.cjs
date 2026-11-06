// Phase 1 reader parity (W3 line_form_spec.md s.4; interface agreed with W1). Run from wall2024/:
//   node corpus/parity.cjs [readerDir]      readerDir defaults to reader/ (W1); use corpus/stub to test the driver.
// readerDir/readLines.cjs exports readLines(text) -> [{n, form, fields} | {n, form:null, why}]
// readerDir/adapters/*.cjs export {name, form, scope:'line'|'text', read}: line -> fields|null; text -> [{n, fields}]
// Each reader gets t.jtext (verdicts: the engine's own cureJText(raw,true), already unescaped once; replies: as stored). n indexes jtext.split('\n').
// Output: corpus/out/disagreements.tsv (tid run seat src n form adapter field old new line) and corpus/out/parity_summary.txt
const fs=require('fs'),path=require('path');const dir=path.resolve(process.argv[2]||'reader');
const {readLines}=require(path.join(dir,'readLines.cjs'));
const ad=fs.readdirSync(path.join(dir,'adapters')).filter(f=>f.endsWith('.cjs')).sort().map(f=>require(path.join(dir,'adapters',f))).filter(a=>a&&typeof a.read==='function'); /* W1: helper modules (_lib, _util, index) export no read */
const T=fs.readFileSync('corpus/texts.jsonl','utf8').trim().split('\n').map(JSON.parse);
const esc=v=>v==null?'':String(typeof v==='object'?JSON.stringify(v):v).replace(/[\t\n\r]/g,' ').slice(0,300);
const eq=(a,b)=>JSON.stringify(a===undefined?null:a)===JSON.stringify(b===undefined?null:b);
const rows=[],cnt={},err=[];const bump=(k)=>cnt[k]=(cnt[k]||0)+1;
const REPLY_SRC=/_reply$/; /* W1: a stored reply is read by the live reply readers (gateRead2024, Send Back Record) after their own one unescape of \\n and \\" (spec 0.1: once); every reader here gets that same text, so line numbers agree */
for(const t of T){const X=REPLY_SRC.test(t.src)?String(t.jtext).replace(/\\n/g,'\n').replace(/\\"/g,'"'):t.jtext;const lines=X.split('\n');let NEW=[];try{NEW=readLines(X)||[];}catch(e){err.push(t.tid+' readLines: '+e.message);}
 const newBy=new Map();for(const r of NEW)if(r&&r.form){const k=r.form+'|'+r.n;if(!newBy.has(k))newBy.set(k,r);}
 const oldSeen=new Set();
 for(const A of ad){let OLD=[];try{if(A.scope==='text')OLD=(A.read(X)||[]);else lines.forEach((l,n)=>{const f=A.read(l);if(f)OLD.push({n,fields:f});});}catch(e){err.push(t.tid+' '+A.name+': '+e.message);continue;}
  for(const o of OLD){const fm=(o.fields&&o.fields.form)||A.form;const k=fm+'|'+o.n; /* W1: a reader of several forms names the row's form in fields.form */oldSeen.add(k);const nw=fm==='ANY'?NEW.find(r=>r&&r.form&&r.n===o.n):newBy.get(k); /* W1: a form-free old test (SB_FORM, K-CMT) matches any new form on the line */const line=lines[o.n];bump('old '+A.name);
   const base=[t.tid,t.run,t.seat,t.src,o.n,fm,A.name];
   if(!nw){rows.push([...base,'*','read','not read',line]);bump('DIS old-only '+A.name);continue;}
   if(fm==='ANY')continue;for(const f of Object.keys(o.fields)){if(f==='form')continue;if(!eq(o.fields[f],nw.fields&&nw.fields[f])){rows.push([...base,f,o.fields[f],nw.fields&&nw.fields[f],line]);bump('DIS field '+A.name+'.'+f);}}}}
 const forms=new Set(ad.flatMap(a=>String(a.form).split('|')));
 for(const [k,r] of newBy){if(!forms.has(r.form)){bump('new form without an old reader '+r.form);continue;}if(!oldSeen.has(k)){rows.push([t.tid,t.run,t.seat,t.src,r.n,r.form,'(none)','*','not read','read',lines[r.n]]);bump('DIS new-only '+r.form);}}}
fs.writeFileSync('corpus/out/disagreements.tsv',['tid\trun\tseat\tsrc\tn\tform\tadapter\tfield\told\tnew\tline'].concat(rows.map(r=>r.map(esc).join('\t'))).join('\n')+'\n');
const sum=['texts '+T.length+', adapters '+ad.length+' ('+ad.map(a=>a.name).join(', ')+'), disagreement rows '+rows.length].concat(Object.keys(cnt).sort().map(k=>k+': '+cnt[k])).concat(err.length?['ERRORS '+err.length].concat(err.slice(0,20)):[]);
fs.writeFileSync('corpus/out/parity_summary.txt',sum.join('\n')+'\n');console.log(sum.join('\n'));
