// ASK 645 tests (W4). node t645.cjs base_eng.json target_engine_645.json fx/follow_fx.json
const fs=require('fs');const [,,BA,TG,FX]=process.argv;const B=JSON.parse(fs.readFileSync(BA,'utf8')),T=JSON.parse(fs.readFileSync(TG,'utf8')),X=JSON.parse(fs.readFileSync(FX,'utf8'));
let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL',m);}};
const NM=['QR Merge','QR Follow Build','QR Follow Final'];
const grab=(c,a,b)=>{const i=c.indexOf(a);const j=c.indexOf(b,i);if(i<0||j<0)throw new Error('missing '+a);return c.slice(i,j+b.length);};
const qf=(E,nm)=>{const c=E.nodes.find(n=>n.name===nm).parameters.jsCode;return {src:grab(c,'function qfCheck(','return {faults:fl,n,x};}'),fn:new Function(grab(c,'const qrNorm=','\n')+'\n'+grab(c,'const qrEmpty=','\n')+'\n'+grab(c,'function qfCheck(','return {faults:fl,n,x};}')+'\nreturn qfCheck;')()};};
const O=qf(B,'QR Merge').fn;const Ns=NM.map(nm=>qf(T,nm));const N=Ns[0].fn;
ok(Ns.every(x=>x.src===Ns[0].src),'C3 the three qfCheck texts are equal');ok(NM.every(nm=>qf(B,nm).src===qf(B,'QR Merge').src),'C3 the three base texts were equal');
const st=r=>r.none?'NONE':r.faults.length?'DROPPED':'PASSED';
// C1
let changed=0;for(const c of X.cases){const o=O(c.f,c.side,c.qa,c.judge),n=N(c.f,c.side,c.qa,c.judge);console.log('C1 row',c.row,c.judge,'of Q'+c.f.q,'open "'+c.f.open+'": stored',c.status,'| old',st(o),'| new',st(n),n.faults.join('; '));
 ok(st(o)===c.status,'C1 old equals stored for '+c.judge);if(st(o)!==st(n))changed++;
 const whole=c.f.open===c.qa[0].question;ok(whole?(st(n)==='DROPPED'&&/the open words are the whole of Q2; a follow-up names the part its answer left open/.test(n.faults.join())):st(n)===st(o),'C1 '+c.judge+(whole?' dropped':' unchanged'));}
console.log('C1 over all rows: '+X.cases.length+' follow-ups not NONE, '+X.none_count+' NONE; '+changed+' change (PASSED to DROPPED)');ok(changed===1,'C1 exactly one changes');
ok(st(N('none','defender',[],'s'))==='NONE'&&st(O('none','defender',[],'s'))==='NONE','C2 NONE unchanged');
// C2
const qa=[{n:4,of:null,side:'defender',judge:'a',answer:'x',question:'What does "the seed of David" in this passage mean?',quote:'He was made of the seed of David according to the flesh.',earlier_quote:null}];
const t=(open,exp,m)=>{const n=N({q:4,open},'defender',qa,'b');ok(st(n)===exp,m+' -> '+st(n));};
t('what does   “the seed of David” in this passage MEAN?','DROPPED','C2 case, spacing and curly quotes');
t('What does "the seed of David" in this passage mean','DROPPED','C2 trailing "?" dropped (W1 N1)');
t('What does "the seed of David" in this passage mean.','DROPPED','C2 trailing "." in place of "?"');
t('"the seed of David"','PASSED','C2 a part of the question passes');
t('He was made of the seed of David according to the flesh.','PASSED','C2 the whole quoted passage passes');
t('He was made of the seed of David according to the flesh','PASSED','C2 the passage without its period passes');
t('in this passage mean?','PASSED','C2 the tail of the question passes');
// C3 structure
const P=d=>Object.fromEntries(d.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const pb=P(B),pt=P(T);const ch=Object.keys(pb).filter(k=>pb[k]!==pt[k]).sort();
ok(JSON.stringify(ch)===JSON.stringify(NM.slice().sort())&&Object.keys(pt).length===Object.keys(pb).length,'C3 only the three QR nodes change: '+ch);ok(JSON.stringify(B.connections)===JSON.stringify(T.connections),'C3 connections equal');
for(const nm of NM){const b=B.nodes.find(n=>n.name===nm).parameters.jsCode,a=T.nodes.find(n=>n.name===nm).parameters.jsCode;let i=0;while(b[i]===a[i])i++;let j=0;while(b[b.length-1-j]===a[a.length-1-j]&&j<b.length-i)j++;const add=a.slice(i,a.length-j);ok(b.length+add.length===a.length&&/^else if\(x&&o\.replace/.test(add)&&/ASK 645/.test(add)&&!/catch/.test(add),'C3/C4 '+nm+': one inserted statement, tagged, no catch');}
console.log(pass+' pass, '+fail+' fail');console.log(fail?'FAILED':'ALL PASS');
