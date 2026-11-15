const fs=require('fs');const D='/home/claude/searchthescriptures/prototypes/posture_e/wall2024/';
const c=JSON.parse(fs.readFileSync(D+'r383/f2/target_F2.json','utf8')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const a=c.indexOf('const cecNar='),b=c.indexOf('\n',a);const nar=new Function(c.slice(a,b)+';return cecNar;')();
const T=[
['plain',{cr2:'Grant x. I withdraw the claim that Joseph is excluded. Then y.'},1],
['we narrow',{cr1:'We narrow the ground to Matthew 1:20.'},1],
['conditional if',{cr2:'If the text says so, I withdraw it.'},0],
['quoted',{cr2:'The challenger wrote "I withdraw nothing" in DR2.'},0],
['bold markdown',{cr3:'**I narrow** premise 3 to the angel.'},1],
['drop in other word (dropped)',{cr2:'I dropped nothing.'},0],
['I do not rest',{cr2:'I do not rest the exclusion on Galatians 4:4.'},1],
['challenger side',{dr3:'I retract the claim about Luke 3:23.'},1,'CHALLENGER'],
['wrong side key',{cr2:'I retract it.'},0,'CHALLENGER'],
['round 4 ignored',{cr4:'I narrow it.'},0],
['would before',{cr2:'One would say I withdraw.'},0],
['I set aside',{cr1:'I set aside the margin note.'},1],
['negation "I do not withdraw"',{cr2:'I do not withdraw premise 2.'},0],
['"I will not drop"',{cr2:'I will not drop the claim.'},0],
];let bad=0;for(const [nm,F,w,sd] of T){const L=nar(F,sd||'DEFENDER');const ok=(L.length>0)===!!w;if(!ok)bad++;console.log(ok?'ok ':'BAD',nm,'|',L[0]?L[0].slice(0,100):'none');}
// cap
const big={cr1:Array.from({length:20},(_,i)=>'I narrow item '+i+'.').join(' ')};console.log('cap',nar(big,'DEFENDER').length);
// a287 runs
const R=JSON.parse(fs.readFileSync(D+'a287/runs.json','utf8'));let n=0,t=0,mx=0;for(const x of Object.values(R)){const r=x.r;if(!r)continue;n++;const F={cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3};for(const s of['DEFENDER','CHALLENGER']){const L=nar(F,s);t+=L.length;mx=Math.max(mx,L.length);}}
console.log('a287 debates',n,'lines',t,'max',mx,'bad',bad,'of',T.length);
const F7=JSON.parse(fs.readFileSync(D+'r383/f2/F37203.json'));console.log('37203 D',nar(F7,'DEFENDER').length,'C',nar(F7,'CHALLENGER').length);
