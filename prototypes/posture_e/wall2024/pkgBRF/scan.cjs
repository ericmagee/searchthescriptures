// pkgBRF scan: REFP scoped parse, s114 against pkgBRF, on every distinct long string of the stored executions and on the judge corpus;
// and the close-round press notes (C4P of Build Synthesis) on every stored F that holds [DR4].
const fs=require('fs');const fb=f=>JSON.parse(fs.readFileSync(f,'utf8'));const node=(w,n)=>((w.data||w).workflow||(w.data||w)).nodes.find(x=>x.name===n).parameters.jsCode;
const S0=node(fb('/mnt/project-files/wall2024/fetchback_live_s114.json'),'Build Synthesis'),S1=node(fb(''+(process.env.CAND||'pkgBRF/parent_s114_BRF.json')+''),'Build Synthesis');
const mk=s=>{const a=s.indexOf('const REFP=');const b=s.indexOf('const C4P=');const e=s.indexOf('\n',s.indexOf('const noteD=')+1);
 return new Function(s.slice(a,b)+s.slice(b,s.indexOf('})();',s.indexOf('const noteD='))+5)+'\nreturn {REFP,C4P};')();};
let R0,R1;try{R0=mk(S0);R1=mk(S1);}catch(e){console.log('mk fail',e.message);process.exit(1);}
const P=(R,t)=>R.REFP.parse(t,{scoped:true}).map(r=>(r.book||r.ctx||'?')+' '+r.label);
const texts=new Map();const add=(id,t)=>{if(typeof t==='string'&&t.length>=200&&/\d:\d/.test(t)&&!texts.has(t))texts.set(t,id);};
const Fs=[];const walk=(id,v,d)=>{if(d>12||v==null)return;if(typeof v==='string'){add(id,v);return;}if(Array.isArray(v)){v.forEach(x=>walk(id,x,d+1));return;}if(typeof v==='object'){if(typeof v.dr4==='string'&&typeof v.gr1==='string')Fs.push({id,F:v});for(const k in v)walk(id,v[k],d+1);}};
for(const e of '33149 33371 33490 34299 34626 34703 34726'.split(' ')){const X=fb('/mnt/project-files/wall2024/ex'+e+'_full.json');const rd=(X.data||X).resultData.runData;for(const n in rd)walk(e+' '+n,rd[n],0);}
for(const l of fs.readFileSync('corpus/texts.jsonl','utf8').split('\n'))if(l.trim()){const r=JSON.parse(l);add('corpus '+r.run+' '+r.seat,r.jtext||r.text);}
let refs=0,chg=0,tch=0;const ex=new Map();
for(const [t,id] of texts){const a=P(R0,t),b=P(R1,t);refs+=a.length;if(a.length!==b.length)throw new Error('length differs '+id);let c=0;
 for(let i=0;i<a.length;i++)if(a[i]!==b[i]){c++;const k=a[i]+' -> '+b[i];if(!ex.has(k)){const r=R0.REFP.parse(t,{scoped:true})[i];ex.set(k,{id,ctx:t.slice(Math.max(0,r.pos-90),r.pos+12).replace(/\s+/g,' ')});}}
 if(c){tch++;chg+=c;}}
console.log('texts',texts.size,'references',refs,'changed',chg,'in texts',tch,'distinct changes',ex.size);
for(const [k,v] of ex)console.log(' ',k,'|',v.id,'| ...'+v.ctx);
const seen=new Set();let nd=0;for(const {id,F} of Fs){const k=F.dr4.length+'|'+id.split(' ')[0];if(seen.has(k))continue;seen.add(k);const a=R0.C4P.note(F),b=R1.C4P.note(F);console.log('press note',id.split(' ')[0],a===b?'same':'DIFFERS');if(a!==b){nd++;console.log('   s114:',a.slice(0,300));console.log('   BRF :',b.slice(0,300));}}
console.log('distinct F with DR4:',seen.size,'notes differing',nd);
