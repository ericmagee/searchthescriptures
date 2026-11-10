// (b): each stored gate CHANGE that cured an "E-APPLY Sn" item, read by the send-back rule of Sn (s110 Send Back Record readers, offline).
// Control: the same reader on the judge's original send-back answer, against the stored send-back cure_status.
const L=require('./lib.cjs');const st=n=>({isExecuted:false,first:()=>({json:{}}),all:()=>[],last:()=>({json:{}}),item:{json:{}}});const {enf428Cure,UND,ECL}=L(st);
const G=require('./gate_rows.json'),RD={};for(const r of require('./rounds.json'))RD[r.id]=r;const KJV=require('./kjv.json');const ctx={rows:KJV,ow:[],lex:[]};
const parse=(l,tag)=>{const p=String(l||'').split(' || ');if(p.length<2)return null;const m=p[1].match(/^\s*CHANGE TO:\s*([\s\S]*)$/);return m?{ans:'CHANGE',to:m[1].trim(),why:(p.slice(2).join(' || ')||'').trim(),line:l}:(/^\s*KEEP/.test(p[1])?{ans:'KEEP',why:p.slice(2).join(' || '),line:l}:null);};
const reason=s=>{const m=String(s||'').match(/\| ENFORCER: ([\s\S]*?)(?: \(ruling 428|$)/);return m?m[1]:'';};
const out=[];const T={};const add=(k)=>T[k]=(T[k]||0)+1;
for(const x of G){const R=RD[x.debate_id];if(!R){out.push(x.gid+' NO ROUNDS');continue;}const rounds={};for(const k of ['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'])rounds[k]=R[k]||'';
 const it={rule:x.rule,item:x.item,line:x.line,reason:reason(x.sbcr),ecl:null,sid:(x.gitem.match(/E-APPLY (S\d+)/)||[])[1]};
 const enforced=x.rule==='E-COL'||(x.rule==='E-HOLD'&&/pkgUND/.test(x.sbcr||''));
 const read=a=>{if(x.rule==='E-HOLD'&&/pkgUND/.test(x.sbcr||''))return UND.cure(it,a,ctx);if(['E-ANS','E-PREM','E-COL'].includes(x.rule))return enf428Cure(it,a,rounds,null);return null;};
 const ga=parse(x.grl),sa=parse(x.sbrl);let g=null,s=null;try{g=ga?read(ga):{status:'UNREAD',why:'gate line not parsed'};}catch(e){g={status:'ERROR',why:e.message};}try{s=sa?read(sa):null;}catch(e){s={status:'ERROR',why:e.message};}
 const kind=(x.gcr.match(/\| (the gate change was applied[^|]*|the later gate change[^|]*|the gate change is already[^|]*)$/)||[])[1]||'?';
 const k=x.rule+(enforced?' (ENFORCED)':g?' (record-only reader)':' (no code reader)');
 add(k+' :: '+(g?g.status:'NOT READ'));if(s&&enforced)add('CONTROL '+x.rule+' send-back answer :: reader '+s.status+' vs stored '+x.sbst);
 out.push([x.gid,x.seat,x.gitem,it.sid,k,'GATE LINE: '+(g?g.status+' -- '+String(g.why).slice(0,200):'NOT READ'),'SEND-BACK ANSWER: '+(s?s.status:'-')+' (stored '+x.sbst+')',kind.slice(0,60)].join(' | '));}
console.log(out.join('\n'));console.log('\nTALLY');for(const k of Object.keys(T).sort())console.log(T[k]+'  '+k);
