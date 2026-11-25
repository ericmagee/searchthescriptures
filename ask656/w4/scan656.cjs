// ASK 656 read-only: PRESSED WITH lines in stored rounds; what PRESSL reads against REFP keys. node scan656.cjs
const fs=require('fs');const W4='/mnt/project-files/ask654/w4/';
const E=JSON.parse(fs.readFileSync(W4+'b2/tg/live_a5c3001d.json','utf8'));const T=E.nodes.find(k=>k.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const reb=p=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
const P=new Function(reb(M['PRESS LIST'].p)+'\n;return PRESSL;')();const R=new Function(reb(M.REFP.p)+'\n;return REFP;')();
const texts=[];const a=JSON.parse(fs.readFileSync(W4+'rounds42528.json','utf8'));for(const k of ['DR1','DR2','DR3','CR1','CR2','CR3','CR4'])texts.push(['42528 '+k,a[k]]);
for(const x of ['42517','42373']){const r=JSON.parse(fs.readFileSync(W4+'r'+x+'.json','utf8'));for(const [k,v] of Object.entries(r))texts.push([x+' '+k,v&&v.raw]);}
const RF=/((?:[1-3] )?[A-Z][a-z]+(?: (?:of )?[A-Z][a-z]+)* \d+:\d+)/;
let lines=0,rng=0,multi=0,short=0,keysMore=0;
for(const [nm,t] of texts){if(!t)continue;const ls=String(t).split('\n');let on=false;const sec=[];
 for(const l of ls){if(/PRESSED WITH\s*:/i.test(l)){on=true;sec.push(l);continue;}if(on&&new RegExp('^[\\s>*_#-]*(?:\\[L[1-4]\\][\\s*:]*)?'+RF.source).test(l)){sec.push(l);continue;}on=false;}
 if(!sec.length)continue;const pr=P.pressed([t]);let rk=[];try{rk=[...new Set(R.keys(sec.join('\n'),{cap:12}).map(k=>k.key))];}catch(e){rk=['ERR '+e.message];}
 for(const l of sec){lines++;if(/\d+:\d+\s*[-–]\s*\d+/.test(l))rng++;const q=l.search(/["“]/);if(q>=0&&RF.test(l.slice(q)))multi++;if(/\b(Matt|Gen|Ex|Lev|Num|Deut|Ps|Prov|Isa|Jer|Rom|Cor|Gal|Eph|Heb|Rev)\.? \d/.test(l))short++;}
 const miss=rk.filter(k=>!pr.includes(k));if(miss.length)keysMore++;
 console.log(nm+': lines '+sec.length+', PRESSL '+pr.length+', REFP keys '+rk.length+(miss.length?', REFP-only: '+miss.slice(0,8).join('; '):''));}
console.log('TOTAL lines '+lines+', with range '+rng+', with a reference after the first quote '+multi+', short names '+short+', texts where REFP reads more '+keysMore);
