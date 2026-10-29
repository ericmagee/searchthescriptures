// P1 harness (BB-7994 step 2): falsifiers F7a-F7g of p1/FALSIFIERS.md. Runs Citation Scan + Quote Compare (+ Quote Report)
// for live (fix7/live_*), fix7 (fix7/new_*) and p1 (p1/new_*), and four single-site mutants of p1 Quote Compare.
// Round texts: fix7/test.cjs excerpts (rows e6253a01, 8a510163) plus one added round carrying the WALL-1862 altered quotes,
// the eleven true quotes of testA/wrongif.cjs, a margin-words quote and a reversed Luke 1:35. KJV rows pulled from kjv_verses.
const fs=require('fs'),path=require('path');const D=__dirname,F7=path.join(D,'..','fix7');
const T=fs.readFileSync(path.join(F7,'test.cjs'),'utf8');
const R=eval('('+T.slice(T.indexOf('const R = {')+10,T.indexOf('};',T.indexOf('const R = {'))+1)+')');
const KJV=eval(T.slice(T.indexOf('const KJV = [')+12,T.indexOf('].map(',T.indexOf('const KJV = ['))+1)).map(([book,chapter,verse,text])=>({book,chapter,verse,text}));
const ALT=[['Genesis 16:10','I will multiply thy daughters',0],['Luke 3:23','being (as was never supposed) the son of Joseph',0],['Galatians 4:4','made of a virgin',0],['Galatians 4:4','God sent forth his Son, born without a father',0],
 ['Galatians 4:4','made of a woman',1],['Romans 1:3','made of the seed of David according to the flesh',1],['Job 25:4','how can he be clean that is born of a woman?',1],['Matthew 11:11','among them that are born of women',1],
 ['Acts 16:13','where prayer was wont to be made',1],['Acts 16:13','wont to be made',1],['Luke 3:23','(as was supposed)',1],['John 6:42','Is not this Jesus, the son of Joseph',1],['John 1:45','Jesus of Nazareth, the son of Joseph',1],
 ['Genesis 16:10','I will multiply thy seed',1],['Luke 1:35','The Holy Ghost shall come upon thee... therefore also that holy thing which shall be born of thee shall be called the Son of God',1],
 ['Acts 16:13','Gr. sabbath day',0],['Luke 1:35','therefore also that holy thing which shall be born of thee shall be called the Son of God... The Holy Ghost shall come upon thee',0]];
const EXTRA=[['Luke 1:34','The Holy Ghost shall come upon thee',2]];
const R2={...R,gr2:ALT.concat(EXTRA).map(([r,q])=>'- [L1] "'+q+'" ('+r+').').join('\n')};
function run(cs,qc,qr,rounds){const nodes={};const $=n=>{if(n==='Regrade Load')return {isExecuted:false};if(n==='Final Output')return {first:()=>({json:rounds})};
 if(n==='Citation Scan')return {first:()=>({json:nodes.cs})};if(n==='Cited Verses')return {all:()=>KJV.map(json=>({json}))};
 if(n==='Quote Compare')return {first:()=>({json:nodes.qc})};if(n==='Find Words')return {all:()=>KJV.map(json=>({json}))};throw new Error('no node '+n);};
 nodes.cs=new Function('$',cs)($)[0].json;nodes.qc=new Function('$',qc)($)[0].json;const rep=qr?new Function('$',qr)($)[0].json:null;return {items:nodes.qc.items,rep};}
const rd=f=>fs.readFileSync(f,'utf8');
const LIVE=[rd(path.join(F7,'live_Citation_Scan.js')),rd(path.join(F7,'live_Quote_Compare.js'))];
const FIX7=[rd(path.join(F7,'new_Citation_Scan.js')),rd(path.join(F7,'new_Quote_Compare.js'))];
const P1=[rd(path.join(D,'new_Citation_Scan.js')),rd(path.join(D,'new_Quote_Compare.js'))];
const QR=rd(path.join(D,'live_Quote_Report.js'));
const mut=(s,a,b)=>{if(s.split(a).length!==2)throw new Error('mutant anchor not once: '+a);return s.replace(a,b);};
const M={
 'i no split':mut(P1[1],'(Array.isArray(i.segs)&&i.segs.length?i.segs:[i.quote])','[i.quote]'),
 'ii no margin drop':mut(P1[1],"const noMargin=s=>String(s||'').replace(/\\[[^\\]]*:[^\\]]*\\]/g,' ');","const noMargin=s=>String(s||'');"),
 'iii contiguity off':mut(P1[1],"const contig=(i,cited)=>{if(!cited)return false;","const contig=(i,cited)=>{return !!cited;"),
 'iv order off':mut(P1[1],"const k=cv.indexOf(' '+g+' ',at);","const k=cv.indexOf(' '+g+' ',0);"),
};
const key=i=>i.ref+' "'+String(i.quote).slice(0,40)+'"';
function score(items){const by=new Map(items.filter(i=>i.side&&i.round==='R2'||true).map(i=>[i.quote,i]));
 const res={alt:0,trueNot:0,detail:[]};
 for(const [r,q,ok] of ALT){const qq=q.replace(/…|\.\.\./g,' ').replace(/\*+/g,'').trim();const it=items.find(i=>i.quote===qq&&i.round&&/2/.test(String(i.round)))||items.find(i=>i.quote===qq);
  const st=it?it.status:'NOT FOUND BY SCAN';res.detail.push((ok?'true ':'bad  ')+r.padEnd(14)+' '+st.padEnd(12)+' "'+q.slice(0,44)+'"');
  if(!ok&&st==='MATCHES')res.alt++;if(ok&&st!=='MATCHES')res.trueNot++;}return res;}
const out=[];
const live=run(...LIVE,null,R),fix=run(...FIX7,null,R),p1=run(...P1,null,R);
out.push('F7c (fix7 test.cjs rows): NOT CHECKED live '+live.items.filter(i=>i.status==='NOT CHECKED').length+', fix7 '+fix.items.filter(i=>i.status==='NOT CHECKED').length+', p1 '+p1.items.filter(i=>i.status==='NOT CHECKED').length);
for(const [name,s] of [['live',LIVE],['fix7',FIX7],['p1',P1]]){const r=run(...s,null,R2);const sc=score(r.items);out.push(name.padEnd(6)+' altered MATCHES '+sc.alt+' | true not MATCHES '+sc.trueNot);if(name==='p1')out.push(...sc.detail.map(x=>'   '+x));}
for(const [name,qc] of Object.entries(M)){const r=run(P1[0],qc,null,R2);const sc=score(r.items);out.push('mutant '+name.padEnd(20)+' altered MATCHES '+sc.alt+' | true not MATCHES '+sc.trueNot);}
const rep=run(...P1,QR,R2).rep;out.push('F7g Quote Report on p1:');for(const [r,q,ok] of ALT){const qq=q.replace(/…|\.\.\./g,' ').trim();const it=rep.items.find(i=>i.quote===qq);out.push('   '+(ok?'true ':'bad  ')+r.padEnd(14)+' '+(it?it.status:'(left out of report)').padEnd(34)+' "'+q.slice(0,40)+'"');}
// Amendment 1 (BB-8010): F7h, F7h2, F7h3 through the new Quote Report.
const QRN=rd(path.join(D,'new_Quote_Report.js'));
const QRM=mut(QRN,"const inRange=best&&best.book===i.book&&+best.chapter===+i.chapter&&+best.verse>=+i.v1&&+best.verse<=+i.v2;","const inRange=!!best;");
for(const [label,qr] of [['F7h new Quote Report',QRN],['F7h3 mutant, range test removed',QRM]]){const rp=run(...P1,qr,R2).rep;out.push(label+':');
 for(const [r,q,ok] of ALT.concat(EXTRA)){const qq=q.replace(/…|\.\.\./g,' ').trim();const it=rp.items.find(i=>i.quote===qq&&i.ref===r)||rp.items.find(i=>i.quote===qq);out.push('   '+(ok===1?'true ':ok===2?'wrong':'bad  ')+' '+r.padEnd(14)+' '+(it?it.status:'(left out of report)').padEnd(34)+' "'+q.slice(0,40)+'"');}}
console.log(out.join('\n'));
