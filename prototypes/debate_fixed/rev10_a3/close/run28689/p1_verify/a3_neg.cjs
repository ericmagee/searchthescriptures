// A3 verify of P1 (BB-8008/8011): my own quotes, not in E's set. Same node wiring as test_p1.cjs.
const fs=require('fs'),path=require('path');const D=__dirname,F7=path.join(D,'..','fix7');
const T=fs.readFileSync(path.join(F7,'test.cjs'),'utf8');
const R=eval('('+T.slice(T.indexOf('const R = {')+10,T.indexOf('};',T.indexOf('const R = {'))+1)+')');
const KJV=eval(T.slice(T.indexOf('const KJV = [')+12,T.indexOf('].map(',T.indexOf('const KJV = ['))+1)).map(([book,chapter,verse,text])=>({book,chapter,verse,text}));
const Q=[
['Luke 1:35','The Holy Ghost shall come upon her',0],['Romans 1:3','made of the seed of Mary according to the flesh',0],
['John 6:42','Is not this Jesus, the son of Mary',0],['Matthew 11:11','among them that are born of virgins',0],
['Luke 3:23','being the son of Joseph',0],['Job 25:4','how can he be clean that is born of a virgin',0],
['Galatians 4:4','God sent forth his Son, made of a woman, made under grace',0],['John 1:45','Jesus of Nazareth, the Joseph of son',0],
['Romans 1:3','made of the holy seed of David according to the flesh',0],['Luke 1:35','The Holy Ghost ... begotten of thee',0],
['Job 25:4','how can he be clean [that is] born of a woman',1],['Luke 1:35','the power of the Highest shall overshadow thee',1],
['Acts 16:13','spake unto the women which resorted thither',1],['Luke 3:23','being (as was supposed) the son of Joseph',1],
['Genesis 16:10','I will multiply thy seed exceedingly, that it shall not be numbered for multitude',1],
['Romans 1:3','Jesus Christ our Lord… made of the seed of David',1],['John 6:42','whose father and mother we know',1],
['Matthew 11:11','Among them that are born of women there hath not risen a greater than John the Baptist',1]];
const R2={...R,gr2:Q.map(([r,q])=>'- [L1] "'+q+'" ('+r+').').join('\n')};
function run(cs,qc,qr,rounds){const nodes={};const $=n=>{if(n==='Regrade Load')return {isExecuted:false};if(n==='Final Output')return {first:()=>({json:rounds})};
 if(n==='Citation Scan')return {first:()=>({json:nodes.cs})};if(n==='Cited Verses')return {all:()=>KJV.map(json=>({json}))};
 if(n==='Quote Compare')return {first:()=>({json:nodes.qc})};if(n==='Find Words')return {all:()=>KJV.map(json=>({json}))};throw new Error('no node '+n);};
 nodes.cs=new Function('$',cs)($)[0].json;nodes.qc=new Function('$',qc)($)[0].json;const rep=qr?new Function('$',qr)($)[0].json:null;return {items:nodes.qc.items,rep};}
const rd=f=>fs.readFileSync(f,'utf8');
const r=run(rd(path.join(D,'new_Citation_Scan.js')),rd(path.join(D,'new_Quote_Compare.js')),rd(path.join(D,'new_Quote_Report.js')),R2);
let badM=0,trueNot=0,trueNC=0;
for(const [ref,q,ok] of Q){const qq=q.replace(/…|\.\.\./g,' ').replace(/\*+/g,'').trim();
 const it=r.items.find(i=>i.quote===qq&&i.ref===ref)||r.items.find(i=>i.quote===qq);const rp=r.rep.items.find(i=>i.quote===qq&&i.ref===ref)||r.rep.items.find(i=>i.quote===qq);
 const st=it?it.status:'NOT FOUND BY SCAN';if(!ok&&st==='MATCHES')badM++;if(ok&&st!=='MATCHES')trueNot++;if(ok&&st==='NOT CHECKED')trueNC++;
 console.log((ok?'true ':'bad  ')+ref.padEnd(14)+' '+st.padEnd(12)+' '+(rp?rp.status:'(not in report)').padEnd(34)+' "'+q.slice(0,50)+'"');}
console.log('bad MATCHES '+badM+' | true not MATCHES '+trueNot+' | true NOT CHECKED '+trueNC);
