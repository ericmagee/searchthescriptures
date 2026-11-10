const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const fn=(W,nm)=>{const s=W.nodes.find(n=>n.name===nm).parameters.jsCode;const i=s.indexOf('const __df=');const j=s.indexOf('<=15;',i);const k=s.indexOf('const __lm=');const e=s.indexOf('return y.trim();};',k)+18;
 const df=new Function('return '+s.slice(i+11,j+4))(),lm=new Function(s.slice(k,e)+'return __lm;')();return x=>df(lm(x));};
const F=fn(g(process.argv[2]),'Send Back Record');
const T=[['Matthew 17:5 is answered under Luke 9:34.',1],['It is answered with Isaiah 7:14.',1],['**Isaiah 8:3** is answered with **Isaiah 7:14**.',1],['That is answered as under 1 John 4:2.',1],['The same is answered under Luke 1:35.',1],
['- **[L2] Luke 1:34:** It is answered with Luke 1:35.',1],
['Mary\'s question is answered by Luke 1:35.',0],['The objection is answered under Matthew 1:20.',0],['D6 is answered with Isaiah 7:14.',0],
['It is answered by Luke 1:35, which names the Holy Ghost as the power.',0],['Luke 1:34 is answered in Luke 1:35: the Holy Ghost shall come upon thee.',0],['It was answered in CR3 at length.',0],['The verse is answered by its own words.',0]];
let ok=0;for(const [t,e] of T){const r=F(t)?1:0;console.log((r===e?'OK  ':'DIFF')+' '+(r?'deferral':'not     ')+' '+t);if(r===e)ok++;}console.log(ok+'/'+T.length);
