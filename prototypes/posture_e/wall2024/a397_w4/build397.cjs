// ASK 397 build (plan rev 3, Wall 8258/8265/8268): LINK STATE "D<i>: STANDS" lay check (STANDS-FIT), TRIAL, recorded only, never sent. Built on ASK 394 live.
// (frame from ASK 394 build (plan rev 9, site table Wall 8224, settled calls Wall 8230): moved grade sites read collision lines through the shared reader
// (ri6Col2024 / ri5Rd2024 over the stub's own __RL text), with the §8 grade list and no own-regex fallback. Shared Library only. Offline.
// Usage: node build394.cjs IN OUT   (IN = engine or child workflow JSON whose library holds the s262 site texts)
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const U=T.unpack(d);const L=U.L,M=U.M;
const NO='/(?!)/';const DLB="'DEFENDER LINK BROKEN'",CLB="'CHALLENGER LINK BROKEN'",UND="'UNDERDETERMINED'";
const E=[ // [site, find, old, new]
 ['scan LS','if(DERIVED.test(l))continue;',"\n   if(DERIVED.test(l))continue;",
  "\n   {const __r=ri5Rd2024(l.replace(/[*_`]+/g,''));if(__r&&__r.form==='LINK STATE'&&/^D\\d+$/i.test(String(__r.f.link||''))&&__r.f.grade==='STANDS'&&!run6(l,S.C+' | '+S.D))out.push({kind:'STANDS-FIT',trial:true,ls397:true,label:String(__r.f.link).toUpperCase(),line:l,why:'a LINK STATE STANDS line that quotes no 6 words in a row of the answer that fit (Commitment 13)'});} /* ASK 397: LINK STATE \"D<i>: STANDS\" lay check, TRIAL, recorded only */\n   if(DERIVED.test(l))continue;"],
 ['decl','const __ctx=ECL.ctxLive(); /* pkgLAY (ASK 346) */',"try{const __tx=r=>String(r||'').replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"');const __ctx=ECL.ctxLive(); /* pkgLAY (ASK 346) */",
  "const __l397=[]; /* ASK 397: LINK STATE STANDS-FIT items, recorded only, never sent */try{const __tx=r=>String(r||'').replace(/\\\\n/g,'\\n').replace(/\\\\\"/g,'\"');const __ctx=ECL.ctxLive(); /* pkgLAY (ASK 346) */"],
 ['loop','for(const __y of LAY.scan(','for(const __y of LAY.scan(__t,UND.rounds(__pt),__ctx)){',
  "for(const __y of LAY.scan(__t,UND.rounds(__pt),__ctx)){if(__y.ls397){__l397.push({seat:__p.judge_seat,rule:'E-LAY',item:'LAYERS STANDS-FIT '+__y.label+' (LINK STATE)',line:__y.line,t397:true,why:'TRIAL rule (recorded only, not sent; it removes no seat): LAYERS (pkgLAY, Commitment 13, TRIAL, ASK 397): '+__y.why});continue;}"],
 ['skip none',"return skip('no enforcer reported a violation in a panel judge line');","if(!dis.length)return skip('no enforcer reported a violation in a panel judge line');",
  "if(!dis.length)return skip('no enforcer reported a violation in a panel judge line',__l397); /* ASK 397 */"],
 ['skip PB',"panel requests not read'})));","return skip('the panel judges\\' requests could not be read',dis.map(x=>({seat:x.seat,rule:x.rule,item:x.item,why:'panel requests not read'})));",
  "return skip('the panel judges\\' requests could not be read',dis.map(x=>({seat:x.seat,rule:x.rule,item:x.item,why:'panel requests not read'})).concat(__l397)); /* ASK 397 */"],
 ['skip out',"no disagreement could be sent","if(!out.length)return skip('no disagreement could be sent',not_sent);",
  "if(!out.length)return skip('no disagreement could be sent',not_sent.concat(__l397)); /* ASK 397 */"],
 ['ns out','out[0].json.sb_not_sent=not_sent;',"out[0].json.sb_not_sent=not_sent;return out;",
  "out[0].json.sb_not_sent=not_sent.concat(__l397);return out; /* ASK 397: appended after every existing not-sent entry */"],
 ['record',"reply_error:'NOT SENT: '+x.why","flagged_line:null,prompt_sent:null,full_reply:null,reply_error:'NOT SENT: '+x.why,response_line:null,cure_status:null,cure_reason:'SEND-BACK NOT SENT: '+x.why+' (ruling 428)',at:T}));",
  "flagged_line:x.t397?(x.line||null):null,prompt_sent:null,full_reply:null,reply_error:'NOT SENT: '+x.why,response_line:null,cure_status:null,cure_reason:x.t397?x.why:'SEND-BACK NOT SENT: '+x.why+' (ruling 428)',at:T})); /* ASK 397: a TRIAL row's reason begins \"TRIAL rule (recorded only, not sent; it removes no seat):\" */"],
];
const touched=new Set(),log=[];
for(const [site,find,old,nu] of E){const lines=[];L.forEach((x,i)=>{const k=x.split(old).length-1;if(k)lines.push([i,k]);});
 if(lines.length!==1||lines[0][1]!==1)throw new Error(site+': old text found '+JSON.stringify(lines));const li=lines[0][0];L[li]=L[li].replace(old,()=>nu);touched.add(li);log.push(site+' L'+li);}
// own-entry site: the main "Send Back Record" holds its not-sent row map as its own text (MAP string entry), not library L2641
{const OLDO="flagged_line:null,prompt_sent:null,full_reply:null,reply_error:'NOT SENT: '+x.why,response_line:null,cure_status:null,cure_reason:'SEND-BACK NOT SENT: '+x.why+' (ruling 428)',at:T}));";
 const NEWO="flagged_line:x.t397?(x.line||null):null,prompt_sent:null,full_reply:null,reply_error:'NOT SENT: '+x.why,response_line:null,cure_status:null,cure_reason:x.t397?x.why:'SEND-BACK NOT SENT: '+x.why+' (ruling 428)',at:T})); /* ASK 397: a TRIAL row's reason begins \"TRIAL rule (recorded only, not sent; it removes no seat):\" */";
 const hits=[];for(const [k,m] of Object.entries(M))m.p.forEach((e,j)=>{if(Array.isArray(e)&&typeof e[0]==='string'){const c=e[0].split(OLDO).length-1;if(c)hits.push([k,j,c]);}});
 if(hits.length!==1||hits[0][0]!=='Send Back Record'||hits[0][2]!==1)throw new Error('record own: '+JSON.stringify(hits));
 const e=M['Send Back Record'].p[hits[0][1]];e[0]=e[0].replace(OLDO,()=>NEWO);log.push('record own Send Back Record #'+hits[0][1]);}
// wrappers: every stub whose rebuilt source now calls ri6Col2024/ri5Rd2024 must hold their definitions (library lines, byte-equal), at top level after its __RL
const LI5=L.findIndex(x=>/^function ri5Rd2024\(/.test(x)),LI6=L.findIndex(x=>/^function ri6Col2024\(/.test(x));if(LI5<0||LI6<0)throw new Error('wrappers not found');
const has=(m,li)=>m.p.some(e=>typeof e==='number'?e===li:(typeof e[0]!=='string'&&li>=e[0]&&li<=e[1]));
const isRL=(e)=>{const t=typeof e==='number'?L[e]:(typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n'));return /const __RL=\(function/.test(t);};
const added=[];
for(const [k,m] of Object.entries(M)){const usesT=m.p.some(e=>{const ids=typeof e==='number'?[e]:(typeof e[0]==='string'?[]:Array.from({length:e[1]-e[0]+1},(_,j)=>e[0]+j));return ids.some(i=>touched.has(i));});if(!usesT)continue;
 const need=[];if(!has(m,LI5))need.push(LI5);if(!has(m,LI6))need.push(LI6);if(!need.length)continue;
 let at;const i5=m.p.findIndex(e=>typeof e==='number'?e===LI5:(typeof e[0]!=='string'&&LI5>=e[0]&&LI5<=e[1]));
 if(i5>=0)at=i5; // after ri5Rd2024, in its own container
 else{ // after the statement that declares __RL, in the same container: the p entry where that statement ends must end exactly there
  const src=T.rb(L,m);const ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});let decl=null;
  (function walk(n){if(!n||typeof n.type!=='string'||decl)return;if(n.type==='VariableDeclaration'&&n.declarations.some(d=>d.id&&d.id.name==='__RL'))decl=n;for(const key of Object.keys(n)){const v=n[key];if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v.type==='string')walk(v);}})(ast);
  if(!decl)throw new Error(k+': no __RL declaration');let off=0;at=-1;for(let j=0;j<m.p.length;j++){const e=m.p[j];const t=typeof e==='number'?L[e]:(typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n'));off+=t.length;if(off>=decl.end){if(src.slice(decl.end,off).trim()!=='')throw new Error(k+': __RL statement ends inside p['+j+'] with text after it: '+JSON.stringify(src.slice(decl.end,off).slice(0,80)));at=j;break;}off+=1;}
  if(at<0)throw new Error(k+': __RL end not mapped');}
 m.p.splice(at+1,0,...need);added.push(k+' +'+need.map(x=>'L'+x).join(','));}
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('sites',log.join(' | '));console.log('wrappers added',added.length,added.join('; '));console.log('MAP lengths changed',ch.length,'| lib sha',lsha);
