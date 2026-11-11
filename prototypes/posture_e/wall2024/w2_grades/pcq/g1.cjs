// W2 grade of pkgPCQ: preCheckSide from base (b6d0d27a) and parent, both nodes, on the 12 exports; node diff; plants
const fs=require('fs');const ld=f=>{const D=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8'));return (D.data||D).workflow||(D.data||D);};
const B=ld('parent_s142_JOINT_A21_SRH.json'),P=ld('parent_s143_PCQ.json');
const by=w=>Object.fromEntries(w.nodes.map(n=>[n.name,n]));const Bb=by(B),Pb=by(P);
console.log('nodes differing',Object.keys(Bb).filter(k=>JSON.stringify(Bb[k].parameters)!==JSON.stringify((Pb[k]||{}).parameters)),'conn equal',JSON.stringify(B.connections)===JSON.stringify(P.connections),B.nodes.length,P.nodes.length);
const fn=(w,node)=>{const c=w.find(n=>n.name===node).parameters.jsCode;const s=c.indexOf('function preCheckSide'),e=c.indexOf('function preCheckBlock');return {f:new Function(c.slice(s,e)+';return preCheckSide;')(),len:c.length};};
const nodes=['Panel Build','Build Independent Verdict'];const F={};for(const n of nodes){F[n]={o:fn(B.nodes,n),n:fn(P.nodes,n)};console.log(n,'code',F[n].n.len-F[n].o.len);}
const findR=v=>{if(v&&typeof v==='object'){if(typeof v.gr2==='string'&&typeof v.cr1==='string')return v;for(const k in v){const r=findR(v[k]);if(r)return r;}}return null;};
let items=0,ch=0;for(const f of fs.readdirSync('/mnt/project-files/wall2024/').filter(x=>/^ex3\d+_full\.json$/.test(x))){const r=findR(JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).data.resultData.runData);
 const run=g=>[].concat(g(r.gr2,[r.cr1,r.cr2],'CHALLENGER LIST [DR2]'),g(r.cr3,[r.gr1,r.gr2],'DEFENDER LIST [CR3]'));
 const pn=run(F['Panel Build'].n.f),bn=run(F['Build Independent Verdict'].n.f),po=run(F['Panel Build'].o.f);items+=pn.length;
 if(JSON.stringify(pn)!==JSON.stringify(bn))console.log(f,'NODES DIFFER');
 po.forEach((x,i)=>{if(x!==pn[i]){ch++;console.log(f.slice(2,7),'\n   OLD',x.slice(0,200),'\n   NEW',pn[i].slice(0,260));}});}
console.log('items',items,'changed',ch);
const g=F['Panel Build'].n.f,go=F['Panel Build'].o.f;const OPP=['The defender said: "The pregnancy is dated before any union, so Joseph cannot be the source of it." Also "found with child" and "took unto him his wife".'];
const T=(item)=>'UNSUPPORTED [L4] PREMISES:\n'+item+'\nPREMISE COUNT: 1';
const P2=[['W2a quote marked "words:" after ASSUMES','1. LINK 1: The dating inference. ASSUMES: X -- ROWS GIVE: "found with child" (Matthew 1:18). The defender\'s words: "The pregnancy is dated before any union, so Joseph cannot be the source of it."','found'],
['W2b only ROWS GIVE verse quotes that stand in opp','1. LINK 1: The dating inference. ASSUMES: X -- ROWS GIVE: "found with child" (Matthew 1:18), "took unto him his wife" (Matthew 1:24).','none'],
['W2c marker "Quote:" after ASSUMES (limit)','1. LINK 1: The dating inference. ASSUMES: X -- ROWS GIVE: "y" (Matthew 1:18). Quote: "The pregnancy is dated before any union, so Joseph cannot be the source of it."','?'],
['W2d "Defender:" quote in the ROWS GIVE list position','1. LINK 1: The dating inference. ASSUMES: X -- ROWS GIVE: Defender: "found with child" (Matthew 1:18).','?'],
['W2e marker words: with charge word only then','1. LINK 1: The only dating inference. ASSUMES: X -- ROWS GIVE: "z". words: "The pregnancy is dated before any union, so Joseph cannot be the source of it."','found+ONLY']];
for(const [k,it,e] of P2){const a=go(T(it),OPP,'C')[0],b=g(T(it),OPP,'C')[0];console.log('PLANT',k,'| expect',e,'\n   OLD',a.slice(0,160),'\n   NEW',b.slice(0,220));}
