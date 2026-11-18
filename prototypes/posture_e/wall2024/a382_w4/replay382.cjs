// ASK 382 replay and plants. Run 38593's stored inputs through L2 Gloss Plan, L2 Gloss Pages Plan and L2 Count Plan (target code), with the H1 and H1121
// reads served from the full kjv_word_map rows in id order (a382/H1_rows_by_id.json, H1121_rows_by_id.json, read from the database 11-18), and compare the
// gloss answers against the live code on the stored reads. Then the WRONG-IF plants.
const fs=require('fs');const [EX,LIVE,TGT]=process.argv.slice(2);const E=JSON.parse(fs.readFileSync(EX));const RD=E.data.resultData.runData;
const W=f=>{const d=JSON.parse(fs.readFileSync(f));return d.data||d;};const L=W(LIVE),T=W(TGT);const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
const sOut=n=>{const r=RD[n];return r?r[r.length-1].data.main[0]:null;};
const FULL={H1:JSON.parse(fs.readFileSync(__dirname+'/H1_rows_by_id.json')),H1121:JSON.parse(fs.readFileSync(__dirname+'/H1121_rows_by_id.json'))};
const resp=(rows,off,total,status)=>({json:{statusCode:status||(rows.length<total?206:200),headers:{'content-range':(rows.length?off+'-'+(off+rows.length-1):'*')+'/'+total},body:rows}});
const run=(src,over)=>{const $=nm=>{if(over&&nm in over){const it=over[nm];return it?{isExecuted:true,all:()=>it,first:()=>it[0]}:{isExecuted:false,all:()=>{throw new Error('not run')},first:()=>{throw new Error('not run')}};}
  const it=sOut(nm);if(!it)return {isExecuted:false,all:()=>{throw new Error('not run '+nm)},first:()=>{throw new Error('not run '+nm)}};return {isExecuted:true,all:()=>it,first:()=>it[0]};};
 const inp=[];const f=new Function('$','$input','$execution','$workflow','require',src);return f($,{all:()=>inp,first:()=>inp[0],item:inp[0]},{id:'38593',customData:{set(){},get(){}}},{id:'moMxiV4Irg1uRBZN'},require);};
const glf=out=>JSON.stringify(out[0].json.e340.gloss);const gl=out=>{const o=out[0].json.e340;return (o&&o.gloss||[]).map(g=>g.num+' | '+g.part+' | '+g.status+(g.why?' | '+g.why:''));};
// base: live code, stored reads
const base=gl(run(code(L,'L2 Count Plan'),{}));
// target chain
const plan=run(code(T,'L2 Gloss Plan'),{});const P=plan.map(i=>i.json);const storedP=sOut('L2 Gloss Plan').map(i=>i.json),storedR=sOut('L2 Gloss Read');
if(P.length!==storedP.length||P.some((p,i)=>p.k!==storedP[i].k||p.num!==storedP[i].num))throw new Error('target plan differs in items from the stored plan');
const renUrls=P.filter(p=>p.k==='ren').map(p=>p.url);console.log('target ren urls carry order=id:',renUrls.every(u=>/&order=id&limit=1000$/.test(u)),'| e.g.',renUrls.find(u=>/H1121/.test(u)));
const serve=(p,i,mut)=>{if(p.k==='ren'&&FULL[p.num]){const rows=FULL[p.num];return resp(rows.slice(0,1000),0,rows.length);}return storedR[i];};
const chain=(opts={})=>{const R=P.map((p,i)=>serve(p,i));const pp=run(code(T,'L2 Gloss Pages Plan'),{'L2 Gloss Plan':plan,'L2 Gloss Read':opts.R||R});const PP=pp.map(i=>i.json);
 let PR=null;if(!PP[0].none)PR=PP.map((q,k)=>{const rows=FULL[q.num]||opts.full&&opts.full[q.num];let pg=rows.slice(q.offset,q.offset+1000);if(opts.page)pg=opts.page(q,pg);return opts.fail&&opts.fail(q)?{json:{statusCode:500,headers:{},body:{message:'fail'},error:{message:'fail'}}}:resp(pg,q.offset,q.total);});
 const out=run(code(T,'L2 Count Plan'),{'L2 Gloss Plan':plan,'L2 Gloss Read':opts.R||R,'L2 Gloss Pages Plan':pp,'L2 Gloss Pages Read':PR});return {PP,out,g:gl(out)};};
const A=chain();console.log('pages planned:',A.PP.none?'none':A.PP.map(q=>q.num+'@'+q.offset).join(' '));
const bset=new Set(base),tset=new Set(A.g);console.log('gloss answers: live',base.length,'| target',A.g.length);
for(const x of base)if(!tset.has(x))console.log('  - live  :',x);for(const x of A.g)if(!bset.has(x))console.log('  + target:',x);
// plants
const remH1=o=>o.g.filter(x=>/^H1 /.test(x)).join(' || ');
const single=(()=>{const R=P.map((p,i)=>p.k==='ren'&&p.num==='H1'?resp(FULL.H1,0,1212,200):serve(p,i));const pp=run(code(T,'L2 Gloss Pages Plan'),{'L2 Gloss Plan':plan,'L2 Gloss Read':R});const PP=pp.map(i=>i.json);
 const PR=PP[0].none?null:PP.map(q=>resp(FULL[q.num].slice(q.offset,q.offset+1000),q.offset,q.total));return {out:run(code(T,'L2 Count Plan'),{'L2 Gloss Plan':plan,'L2 Gloss Read':R,'L2 Gloss Pages Plan':pp,'L2 Gloss Pages Read':PR}),PP};})();
const S={g:gl(single.out)};console.log('PLANT 1 (1,212 rows as two pages = one read of all 1,212; whole gloss records, kjv lists included):',glf(A.out)===glf(single.out),'| single-read H1 pages planned:',single.PP.filter(q=>q.num==='H1').length,'|',remH1(S));
const B=chain({page:(q,pg)=>q.num==='H1'?pg.slice(0,pg.length-1):pg});console.log('PLANT 2 (short page keeps the refusal):',remH1(B));
console.log('PLANT 3 (1,000 rows or fewer: one page, as today): numbers given pages',[...new Set(A.PP.map(q=>q.num))].join(','),'| every other ren number gets none:',P.filter(p=>p.k==='ren'&&!FULL[p.num]).length,'numbers, 0 pages');
const C=chain({page:(q,pg)=>q.num==='H1121'?pg.slice().sort(()=>0.5-Math.random()).reverse():pg});console.log('PLANT 4 (shuffled pages give the same REN; whole gloss records):',glf(C.out)===glf(A.out));
const D=chain({fail:q=>q.num==='H1121'&&q.offset===3000});console.log('PLANT 5 (a failed page keeps the refusal):',D.g.filter(x=>/^H1121 /.test(x)).join(' || '));
// ceiling: a planted number of 12,000 rows
const big=Array.from({length:12000},(_,k)=>({kjv_word:k%2?'son':'sons',book:'Genesis',chapter:1+Math.floor(k/50),verse:1+(k%50),word_position:1}));
const P6=P.map(p=>p.num==='H1121'?{...p}:p);FULL.H1121B=big;const R6=P.map((p,i)=>p.num==='H1121'?resp(big.slice(0,1000),0,12000):serve(p,i));
const pp6=run(code(T,'L2 Gloss Pages Plan'),{'L2 Gloss Plan':plan,'L2 Gloss Read':R6}).map(i=>i.json);const n6=pp6.filter(q=>q.num==='H1121');
const PR6=pp6.map(q=>resp((q.num==='H1121'?big:FULL[q.num]).slice(q.offset,q.offset+1000),q.offset,q.total));
const o6=run(code(T,'L2 Count Plan'),{'L2 Gloss Plan':plan,'L2 Gloss Read':R6,'L2 Gloss Pages Plan':pp6.map(j=>({json:j})),'L2 Gloss Pages Read':PR6});
console.log('PLANT 6 (ceiling, 12,000 rows): pages planned',n6.length,'offsets',n6[0].offset+'..'+n6[n6.length-1].offset,'|',gl(o6).filter(x=>/^H1121 /.test(x)).join(' || '));
// bound: reads and rows
const readsWorst=30*10,rowsPeak=A.PP.length*1000;console.log('BOUND: at most 30 numbers x 10 pages = '+readsWorst+' ren reads a run; this replay: '+P.filter(p=>p.k==='ren').length+' first pages + '+A.PP.length+' further pages; rows held in L2 Count Plan for H1 and H1121: '+(FULL.H1.length+4836));
// DoD 5 evidence (W1 8392, W2 8393): the whole gloss record for H1 and H1121, live and target, and the rendering rows behind each FOUND
const rec=(out,n)=>out[0].json.e340.gloss.filter(g=>g.num===n);
for(const n of ['H1','H1121']){console.log('EVIDENCE',n,'live  :',JSON.stringify(rec(run(code(L,'L2 Count Plan'),{}),n)));console.log('EVIDENCE',n,'target:',JSON.stringify(rec(A.out,n)));
 const rows=FULL[n];const by={};for(const r of rows){const w=String(r.kjv_word||'').toLowerCase().replace(/[^a-z' -]/g,'');by[w]=(by[w]||0)+1;}
 console.log('EVIDENCE',n,'renderings over all',rows.length,'rows (word: rows):',Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([w,c])=>w+': '+c).join(', '));
 const part=n==='H1'?'father':'son';const hits=rows.filter(r=>String(r.kjv_word).toLowerCase()===part);console.log('EVIDENCE',n,'rows rendered "'+part+'":',hits.length,'| first in id order:',hits.slice(0,3).map(r=>r.book+' '+r.chapter+':'+r.verse+' w'+r.word_position).join('; '),'| rows of it in the first page alone:',rows.slice(0,1000).filter(r=>String(r.kjv_word).toLowerCase()===part).length);}
