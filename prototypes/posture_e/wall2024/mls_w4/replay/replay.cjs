// ASK 351 replay: debate_judgments created on or after 2026-11-14 (42 rows, 14 debates) + 37891 E-COL rows 42663/42664 (text in ../build/tmls.cjs). Rows = verses the debate cited (citation_check), as the live Cited Verses fetch reads.
const fs=require('fs');const {unpack,rb,load}=require('../../tools/lib.cjs');
const tu=unpack(JSON.parse(fs.readFileSync('../build/target_mls.json')));const P=load(rb(tu.L,tu.M['Panel Payloads']),()=>({all:()=>[],first:()=>({json:{}})}));
const J=require('./judg.json'),D={};require('./deb.json').forEach(d=>D[d.id]=d);const V=require('./verses.json');const VI={};V.forEach(r=>VI[r.book+'|'+r.chapter+'|'+r.verse]=r);
const rowsFor=d=>{const cc=typeof d.citation_check==='string'?JSON.parse(d.citation_check):d.citation_check;const out=new Map();for(const it of ((cc&&cc.items)||[])){const m=String(it.ref).match(/^((?:[1-3] )?[A-Z][A-Za-z ]+?) (\d+):(\d+)(?:[-–](\d+))?/);if(!m)continue;for(let v=+m[3];v<=+(m[4]||m[3]);v++){const r=VI[m[1]+'|'+m[2]+'|'+v];if(r)out.set(m[1]+'|'+m[2]+'|'+v,r);}}return [...out.values()];};
const RND=d=>({CR1:d.claude_r1,DR1:d.engine_r1,CR2:d.claude_r2,DR2:d.engine_r2,CR3:d.engine_r3,DR3:d.challenger_r3,CR4:d.defender_r4,DR4:d.challenger_r4});
const hits=[],ncs=[];let nF=0,nB=0;const byWord={};
const scan=(tag,seat,text,d)=>{const o=P.mlsLines2024(text,RND(d),rowsFor(d));for(const x of o.items){hits.push({tag,seat,debate:d.id.slice(0,8),...x});if(x.rule==='K-ML')x.add.forEach(w=>byWord[w]=(byWord[w]||0)+1);}o.marks.filter(m=>/NOT CHECKED/.test(m)).forEach(m=>ncs.push(tag+' '+seat+' '+m));
 const T=String(text||'');nF+=(T.match(/FORCED:\s*D\d/g)||[]).length;nB+=(T.match(/LINK BROKEN/g)||[]).length;};
for(const j of J)scan('judgment '+j.id,j.judge_seat,j.verdict_raw,D[j.debate_id]);
const src=fs.readFileSync('../build/tmls.cjs','utf8');const g=n=>{const i=src.indexOf('const '+n+'=\'');return eval(src.slice(i+n.length+7,src.indexOf("';",i)+1));};
for(const [n,id] of [['L42663',42663],['L42664',42664]])scan('E-COL row '+id,'grok',g(n),D['1148ee77-0e6e-4142-b5f4-a871bbc3a5cc']);
console.log('population: 42 judgments, 2 E-COL rows; FORCED lines',nF,'LINK BROKEN mentions',nB);
console.log('HITS',hits.length,'K-ML',hits.filter(h=>h.rule==='K-ML').length,'K-SU',hits.filter(h=>h.rule==='K-SU').length);console.log('K-ML by word',JSON.stringify(byWord));
hits.forEach((h,i)=>console.log('\n#'+(i+1)+' '+h.tag+' '+h.seat+' debate '+h.debate+' '+h.rule+' '+h.pair+' unit '+h.ref+(h.add?' adds '+JSON.stringify(h.add)+' MEANS ['+h.mround+'] "'+h.q+'"':' answer ['+h.around+']')));
console.log('\nNOT CHECKED',ncs.length);ncs.slice(0,40).forEach(x=>console.log('  '+x.slice(0,260)));
fs.writeFileSync('hits.json',JSON.stringify(hits,null,1));
