// ASK 394 6.3, part 1: shape counts over stored judgments (a389/jud.json: debate_judgments verdict_raw), read line by line through text L and text I.
const fs=require('fs');const J=require(process.env.JUD||'../a389/jud.json');const mk=t=>new Function(t+';return __RL;')();
const RL=mk(fs.readFileSync(__dirname+'/rl_1.js','utf8')),RI=mk(fs.readFileSync(__dirname+'/rl_0.js','utf8'));
const txt=raw=>{const s=String(raw||'');const a=s.indexOf('{'),b=s.lastIndexOf('}');try{const o=JSON.parse(s.slice(a,b+1));return String(o.reasoning||o.reason||'');}catch(e){return null;}};
const rows={stands:[],wa:[],nonForced:[],f8D:[],diff:{},restI:[],un:0};const seats=k=>new Set(rows[k].map(x=>x.id)).size;
const NF=/^[\s>*_\-•\d.)]*FORCED[^:\n]{0,40}:\s*\**\s*D\d+\s+vs\.?\s+C\d+\b[^\n]*?:\s*\**\s*(DEFENDER|CHALLENGER) LINK BROKEN/i;
for(const j of J){const t=txt(j.verdict_raw);if(t==null){rows.un++;continue;}
 for(const l of t.split('\n')){if(!l.trim())continue;let a,b;try{a=RL.readLine(l);}catch(e){a={err:1};}try{b=RI.readLine(l);}catch(e){b={err:1};}
  if(a&&a.form==='COLLISION'&&a.f.grade==='STANDS')rows.stands.push({id:j.id,seat:j.judge_seat,l});
  if(a&&a.form==='COLLISION'&&/^WITHDRAWN/.test(a.f.grade||''))rows.wa.push({id:j.id,seat:j.judge_seat,l});
  if(NF.test(l))rows.nonForced.push({id:j.id,seat:j.judge_seat,l});
  if(a&&a.form==='FORCED'&&a.f.breaks==='DEFENDER')rows.f8D.push({id:j.id,seat:j.judge_seat,l});
  const sa=JSON.stringify(a&&{form:a.form,code:a.code,f:a.f}),sb=JSON.stringify(b&&{form:b.form,code:b.code,f:b.f});
  if(sa!==sb){const k=/^\W*RETRACTED/i.test(l)?'RETRACTED':/^\W*RESTATED/i.test(l)?'RESTATED':/^\W*PRESSED/i.test(l)?'PRESSED':/^\W*SHORT/i.test(l)?'SHORT':'other';(rows.diff[k]=rows.diff[k]||[]).push({id:j.id,seat:j.judge_seat,l,L:sa.slice(0,160),I:sb.slice(0,160)});}}}
console.log('judgments',J.length,'unparsed',rows.un);
console.log('ROW vs-line STANDS (reader: COLLISION STANDS): lines',rows.stands.length,'judgments',seats('stands'));
console.log('ROW vs-line WITHDRAWN (AFTER): lines',rows.wa.length,'judgments',seats('wa'));
console.log('ROW non-§8 graded FORCED ("FORCED...: D vs C ...: X LINK BROKEN"): lines',rows.nonForced.length,'judgments',seats('nonForced'));
console.log('ROW §8 FORCED with breaks DEFENDER (record only): lines',rows.f8D.length,'judgments',seats('f8D'));
for(const k of ['RETRACTED','RESTATED','PRESSED','SHORT','other'])console.log('ROW text L vs text I differ,',k+':',(rows.diff[k]||[]).length,'lines',new Set((rows.diff[k]||[]).map(x=>x.id)).size,'judgments');
fs.writeFileSync(__dirname+'/'+(process.env.OUT||'pop394.json'),JSON.stringify(rows,null,1));
for(const k of ['nonForced','f8D'])rows[k].slice(0,4).forEach(x=>console.log('  e.g.',k,x.id,x.seat,x.l.slice(0,150)));
Object.entries(rows.diff).forEach(([k,v])=>v.slice(0,3).forEach(x=>console.log('  e.g. diff',k,x.id,x.seat,x.l.slice(0,120),'\n     L',x.L,'\n     I',x.I)));
