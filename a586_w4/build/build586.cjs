// ASK 586 build (W4): live 196402d0 -> target_engine_586.json. node build586.cjs
const fs=require('fs');const {apply,cut,md5}=require('./libpatch.js');
const W=JSON.parse(fs.readFileSync('live_eng.json','utf8'));
const {L,M}=cut(W);
const RXA=/(flagged_line:)([^,]*?)\.slice\(0,1500\)/g;
// A1: no cap on any stored or checked flagged line
const A1=[];L.forEach((l,i)=>{RXA.lastIndex=0;if(RXA.test(l))A1.push({line:i,a:l,b:l.replace(RXA,'$1$2'),what:'A1 no cap on flagged_line, LIB '+i});});
const A1M=[];for(const [k,v] of Object.entries(M)){if(!v||!v.p)continue;v.p.forEach((x,j)=>{if(Array.isArray(x)&&typeof x[0]==='string'){RXA.lastIndex=0;if(RXA.test(x[0]))A1M.push({map:k,a:x[0],b:x[0].replace(RXA,'$1$2'),what:'A1 no cap, MAP '+k+' part '+j});}});}
const S=(line,a,b,what)=>({line,a,b,what});
const A2=[S(3057,"THE LINE: '+cut(g.line,1600)","THE LINE: '+String(g.line||'')",'A2 enforcer sees the whole E-COL line'),
 S(3086,"cut(g.line,1600)","String(g.line||'')",'A2 enforcer sees the whole E-HOLD line'),
 S(2956,"YOUR LINE: '+cut(i.line,1500)","YOUR LINE: '+String(i.line||'')",'A2 send-back shows the judge its whole line'),
 S(2397,"LINE: '+cut(l,1500)","LINE: '+String(l||'')",'A2 gate shows the whole line'),
 S(3487,"LINE: '+cut(l,1500)","LINE: '+String(l||'')",'A2 late gate shows the whole line')];
const A3=[S(2880,"const __c=ECL.check(__x.flagged_line,","if(/\\s\\[\\.\\.\\.\\]\\s*$/.test(String(__x.flagged_line||'')))continue; /* ASK 586 A3: a line that reaches the layer check cut is NOT READ: no fault is raised on it */const __c=ECL.check(__x.flagged_line,",'A3 cut line is NOT READ')];
const B=[S(2679,"PRS=KS.filter(k=>side(k)===ps).map(k=>String(R[k]||''));","PRS=KS.filter(k=>side(k)===ps).map(k=>String(R[k]||'')),OWNT=KS.filter(k=>side(k)===fs).map(own); /* ASK 586 B: the answering side's own words outside its quotation marks, all its rounds */",'B1 OWNT'),
 S(2680,"if(ROWN.includes(' '+r+' '))continue;","if(ROWN.includes(' '+r+' ')&&!OWNT.some(x=>hasIn(x,r)))continue;",'B2 a quoted run that the answering side also wrote as its own words counts')];
const C1=[S(3497,"const f=[];const lb=k?new RegExp('\\\\b'+k[1]+'\\\\s+vs\\\\.?\\\\s+C\\\\d+\\\\b','i'):LBL;",
  "const f=[];const __nc=!!k&&!String(text||'').split('\\n').some(x=>new RegExp('^\\\\s*(?:FORCED(?:\\\\s*\\\\(\\\\s*Commitment\\\\s+\\\\d+\\\\s*\\\\))?\\\\s*:\\\\s*)?'+k[1]+'\\\\s+vs\\\\.?\\\\s+C\\\\d+\\\\b','i').test(x.replace(/[*_`]+/g,''))); /* ASK 586 C1: a keystone link with no collision line of its own has no label to name */const lb=k&&__nc?/(?:)/:k?new RegExp('\\\\b'+k[1]+'\\\\s+vs\\\\.?\\\\s+C\\\\d+\\\\b','i'):LBL;",'C1 scan'),
 S(3497,"out.push({kind:k?'KEYSTONE':'RESULT',trial:false,","out.push({kind:k?'KEYSTONE':'RESULT',nocol:__nc,trial:false,",'C1 carry nocol'),
 S(3497,"=y.kind==='KEYSTONE'?new RegExp('\\\\b'+y.label","=y.kind==='KEYSTONE'&&y.nocol?/(?:)/:y.kind==='KEYSTONE'?new RegExp('\\\\b'+y.label",'C1 cure')];
const D=[S(1345,"const L=Lof(k),n=c[sd];","const L=Lof(k),n=typeof c[sd]==='number'?Math.max(c[sd],brk[sd]||0):c[sd]; /* ASK 586 D: a counted break of the side (collision lines and closing contradictions) enters its standing */",'D1 standing counts the side\'s counted breaks'),
 S(1363,"+'; RULE: engine_manual section 8","+'; STANDING INPUTS: DEFENDER conceded '+c.DEFENDER+', counted breaks '+brk.DEFENDER+'; CHALLENGER conceded '+c.CHALLENGER+', counted breaks '+brk.CHALLENGER+'; RULE: engine_manual section 8",'D2 the recompute prints its standing inputs')];
const E=[S(1588,"add('UNREAD COUNTED LINE',1);","if(/^\\s*\\[AUDIT v\\d+:/.test(l))add('UNREAD COUNTED LINE',1); /* ASK 586 E: a send-back item line that only mentions drv_uncured is not an unread counted line */",'E removal reason')];
const edits=[...A1M,...A1,...A2,...A3,...B,...C1,...D,...E];
const T=JSON.parse(JSON.stringify(W));const r=apply(T,edits);
// C2 and A1 in Reread Record / Alt Reread Record (plain Code nodes)
const once=(s,a,b,w)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(w+': '+k);return s.replace(a,()=>b);};
const nodeCh=[];
const REREAD=(T,nm)=>{const n=T.nodes.find(x=>x.name===nm);let s=n.parameters.jsCode;const s0=s;
 s=once(s,"flagged_line:String(x.to).slice(0,1500)","flagged_line:String(x.to)",nm+' A1');
 s=once(s,"(st==='DISAGREE'&&(x.rule==='E-RES'||x.rule==='E-KEY')?'DECIDING","(st==='DISAGREE'&&(x.rule==='E-RES'||x.rule==='E-KEY')&&!__fr(x)?'DECIDING",nm+' C2 label');
 s=once(s,"if(st==='DISAGREE'&&(x.rule==='E-RES'||x.rule==='E-KEY'))DLU.push","if(st==='DISAGREE'&&(x.rule==='E-RES'||x.rule==='E-KEY')&&!__fr(x))DLU.push",nm+' C2 count');
 s="/* ASK 586 C2: a line the judge changed to the enforcer's own first reading is not counted against the judge on the second reading */\nconst __fr=x=>{try{const r=(String(x.reason||'').match(/\\(right:\\s*([A-Z ]+?)\\)/)||[])[1];if(!r)return false;const t=String(x.to||'').replace(/[*_`]+/g,'').trim();const m=x.rule==='E-KEY'?t.match(/^KEYSTONE\\s*:\\s*D\\d+\\s*(?:--|\\u2014|\\u2013|-|:)\\s*([A-Z]+)/):t.match(/^RESULT\\s*:\\s*([A-Z ]+?)\\s*(?:--|\\u2014|\\u2013|\\(|$)/);return !!m&&m[1].trim()===r.trim();}catch(e){return false;}};\n"+s;
 n.parameters.jsCode=s;nodeCh.push(nm+' '+md5(s0).slice(0,8)+'->'+md5(s).slice(0,8));};
for(const nm of ['Reread Record','Alt Reread Record'])REREAD(T,nm);
fs.writeFileSync('target_engine_586.json',JSON.stringify(T));
const {L:L2,M:M2}=cut(T);let left=0;L2.forEach(l=>{if(/flagged_line:[^,]*?\.slice\(0,1500\)/.test(l))left++;});for(const v of Object.values(M2))if(v&&v.p)v.p.forEach(x=>{if(Array.isArray(x)&&typeof x[0]==='string'&&/flagged_line:[^,]*?\.slice\(0,1500\)/.test(x[0]))left++;});
console.log(JSON.stringify({edits:edits.length,A1_lib:A1.length,A1_map:A1M.length,...r,nodes:nodeCh,caps_left:left},null,1));
// Child: the same LIB edits (Library Check requires the same LIB); MAP string edits only where the child holds the key with the same string
const C=JSON.parse(fs.readFileSync('live_child.json','utf8'));const {M:MC}=cut(C);
const cedits=edits.filter(e=>!e.map||(MC[e.map]&&MC[e.map].p.some(x=>Array.isArray(x)&&x[0]===e.a)));
const CT=JSON.parse(JSON.stringify(C));const rc=apply(CT,cedits);
REREAD(CT,'R2 Alt Reread Record');const ownC=nodeCh.slice();
fs.writeFileSync('target_child_586.json',JSON.stringify(CT));
console.log(JSON.stringify({child_edits:cedits.length,child_map_edits:cedits.filter(e=>e.map).length,newsha:rc.newsha,map_touched:rc.map_touched,node:rc.node,child_reread_nodes:ownC}));
