// ASK 390 edge plant rev 2: the quote is 6 words in a row of the round's OWN words (outside quotes, as LAY reads them), 3 before a mark edge and 3 after it. Checked on the unmarked and the marked round through LAY.scan (ASK 397 LINK STATE STANDS-FIT) and through the library-level N word-window test the send-back cure check uses (L2683 hasIn).
const fs=require('fs');const T=require('../tools/lib.cjs');let __src=fs.readFileSync(__dirname+'/wn390.js','utf8');if(process.env.SYM)__src=__src.replace("'[working note: '+t.slice(x.s,x.e)+']'","'\u27e6'+t.slice(x.s,x.e)+'\u27e7'");const wn390=new Function(__src+';return wn390;')();
const U=T.unpack(JSON.parse(fs.readFileSync('a397/t397.json')));const G=T.load(T.rb(U.L,U.M['Send Back Build']));const LAY=G.LAY;const LN=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’“”"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff ]+/g,' ').replace(/\s+/g,' ').trim(); /* library L2649 N, the send-back cure check's hasIn (L2683) */
const R=JSON.parse(fs.readFileSync(__dirname+'/rounds.json'));
const N=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’ʼ`]/g,"'").replace(/\[(?:l[1-4]|[cd]r[1-4])\]/g,' ').replace(/[\[\]]/g,'').replace(/'/g,'').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿]+/g,' ').replace(/\s+/g,' ').trim();
const QR=/"[^"\n]{8,}?"|“[^”\n]{8,}?”/g;const own=t=>N(String(t||'').replace(/[*_`]+/g,'').replace(QR,' | '));
const W=s=>own(s).split(' ').filter(w=>w&&w!=='|');
for(const [tok,col,key] of [['ODV1-38593','engine_r2','CR2'],['ODV1-37812','defender_r4','DR4']]){const r=R.find(x=>x.run_token.startsWith(tok));const t=r[col];const w=wn390(t);
 for(const x of w.notes)for(const [side,e] of [['start',x.span[0]],['end',x.span[1]]]){
  const a=W(t.slice(0,e)).slice(-3),b=W(t.slice(e)).slice(0,3);if(a.length<3||b.length<3){console.log(tok,side,'edge: fewer than 3 own words on one side, skipped');continue;}
  const q=a.concat(b).join(' ');const fitsU=(' '+own(t)+' ').includes(' '+q+' ');
  const line='D1: STANDS -- GROUND: the answer says "'+q+'"',line2='D1 vs C1: STANDS -- GROUND: [L1] Genesis 1:1 "In the beginning God created the heaven and the earth." and the answer says "'+q+'"';
  const f=(l,txt)=>LAY.scan(l,{[key]:txt},{}).filter(y=>y.kind==='STANDS-FIT').length;const lu=f(line,t)+'/'+f(line2,t),lm=f(line,w.text)+'/'+f(line2,w.text);
  const q2=LN(t.slice(0,e)).split(' ').filter(Boolean).slice(-3).concat(LN(t.slice(e)).split(' ').filter(Boolean).slice(0,3)).join(' '); /* the cure check reads the whole round, quotes included, so its plant is 6 whole-text words */
  const hu=(' '+LN(t)+' ').includes(' '+q2+' '),hm=(' '+LN(w.text)+' ').includes(' '+q2+' ');
  console.log(tok,col,side,'edge of mark "'+x.marker+'" | quote "'+q+'" | in own words unmarked:',fitsU,'| LAY STANDS-FIT items (LINK STATE/COLLISION) unmarked:',lu,'marked:',lm,'| L2683 hasIn quote "'+q2+'" unmarked:',hu,'marked:',hm);
  const mi=w.text.indexOf(process.env.SYM?'\u27e6':'[working note:',Math.max(0,e-5));console.log('   marked text near the edge:',JSON.stringify(w.text.slice(Math.max(0,(side==='start'?mi:w.text.indexOf(']',mi))-50),(side==='start'?mi:w.text.indexOf(']',mi))+60)));}}
