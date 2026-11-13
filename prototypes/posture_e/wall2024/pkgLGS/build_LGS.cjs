// pkgLGS (W1; ASK 191 option 1, chosen by the operator 01:46 CST 2026-11-13; plan Wall 5735).
// One more gate send-back for a LATE item: a new LIVE item raised by a gate change (W3 2341 marks that change UNCURED and counts it once).
// For each gate path P ('', 'Alt ', 'R2 Alt '):
//  1. New Code stub "<P>Late Gate Build": runs gateCure2024 on the gate replies as Gate Record will, takes the late items of each change that
//     stays UNCURED only because of them, and builds one call per seat: the gate conversation + the judge's gate reply + the late items.
//  2. New IF "<P>Late Gate Needed?" and new HTTP "<P>Late Gate Call openrouter" (copies of the gate IF and call).
//  3. Wiring: <P>Gate Call openrouter -> <P>Late Gate Build -> <P>Late Gate Needed? -> (true) <P>Late Gate Call openrouter -> <P>Gate Record;
//     (false) -> <P>Gate Record. "<P>Gate Needed?" false still goes straight to <P>Gate Record.
//  4. <P>Gate Record reads the gate replies by name (not $input), then the late reply: when every late item a change raised is cured,
//     that change is CURED and its count comes off; otherwise it stays UNCURED, counted once, as before. No second late round.
//  5. Shared Library: gateCure2024 also returns its late items (kby). Panel Tokens costs the three new calls.
// Usage: node build_LGS.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');
const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const byN=n=>{const x=W.nodes.find(z=>z.name===n);if(!x)throw new Error('no node '+n);return x;};
const one=(s,o,n,what)=>{const c=s.split(o).length-1;if(c!==1)throw new Error('anchor count '+c+': '+what);return s.replace(o,()=>n);};
const cl=o=>JSON.parse(JSON.stringify(o));const C=W.connections;
const LN=byN('Shared Library');const T=LN.parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');
let Lb=JSON.parse(T.slice(a+8,b));const M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
const reb=(e,L)=>M[e].p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
const before={};for(const e in M)before[e]=reb(e,Lb);
for(const e in M)if(before[e].length!==M[e].n)throw new Error('live MAP length differs: '+e);

// ---- the shared edit: gateCure2024 returns its late items
const RET="return {res,its2,add,fresh,uncured:res.filter(r=>!r.cured&&r.live).length,R2};}";
const RET2="return {res,its2,add,fresh,uncured:res.filter(r=>!r.cured&&r.live).length,R2,late:[...kby].map(([g,l])=>({g,items:l}))};} /* pkgLGS: the late items of each change */";

const PATHS=[['','panel','Send Back Record','Panel Cure Check'],['Alt ','alternate','Alt Send Back Record','Alt Seated'],['R2 Alt ','alternate','R2 Alt Send Back Record','R2 Alt Seated']];
const want={};
for(const [P,ROLE,SBR,FALLB] of PATHS){
 const GR=P+'Gate Record';let S=before[GR];
 S=one(S,RET,RET2,GR+' gateCure2024 return');
 S=one(S,"fresh=(R2.items||[]).filter(z=>!keys0.has(z.key)).map(z=>({kind:z.kind,","fresh=(R2.items||[]).filter(z=>!keys0.has(z.key)).map(z=>({key:z.key,kind:z.kind,",GR+' fresh key (W3 F2)');
 // replies by name; late build and late call read by name
 S=one(S,"const R=$input.all().map(x=>x.json);",
  "const R=$('"+P+"Gate Call openrouter').all().map(x=>x.json);const __LRL='"+ROLE+"'; /* pkgLGS: the gate replies by name; $input is now the late call */\n"+
  "const LGB=(()=>{try{return $('"+P+"Late Gate Build').isExecuted?$('"+P+"Late Gate Build').all().map(x=>x.json):[];}catch(e){return [];}})(),LGR=(()=>{try{return $('"+P+"Late Gate Call openrouter').isExecuted?$('"+P+"Late Gate Call openrouter').all().map(x=>x.json):[];}catch(e){return [];}})();",GR+' R');
 // the late pass, right after the first cure
 const CUR="let C=null,cerr=null;if(!err){try{C=gateCure2024(g.seat,p.verdict_raw,g.F,its,g.items,txt,ctx);}catch(e){cerr=String(e&&e.message||e).slice(0,300);}}";
 S=one(S,CUR,CUR+"\n let LG=null;{const __k=LGB.findIndex(x=>x&&x.lgs_send===true&&x.seat===g.seat);if(C&&__k>=0){const L=LGB[__k];let lt='',le=null,C2=null;try{lt=String(LGR[__k].choices[0].message.content||'');}catch(e){le=String((LGR[__k]&&LGR[__k].error&&(LGR[__k].error.message||LGR[__k].error))||'no reply').slice(0,200);} /* pkgLGS (ASK 191): one late answer */\n"+
  "  if(!le){try{C2=gateCure2024(g.seat,p.verdict_raw,g.F,its.concat(C.add),L.items,lt,ctx);}catch(e){le=String(e&&e.message||e).slice(0,300);}}LG={L,lt,le,C2,off:0};{const __kn=new Set([...(g.items||[]),...((C.R2&&C.R2.items)||[]),...L.items].map(x=>x&&x.key));LG.nf=C2?C2.fresh.filter(f=>!__kn.has(f.key)):[];} /* W3 F2: only items no pass raised before */const done=new Set();\n"+
  "  for(const r of C.res){const mine=L.items.filter(x=>(x.hang||[]).includes(r.gid));if(!mine.length)continue;const st=mine.map(x=>{const q=C2?C2.res.find(z=>z.gid===x.gid):null;return {x,q};});\n"+
  "   if(C2&&st.every(o=>o.q&&o.q.cured)){r.cured=true;r.why='the gate change was applied; the new LIVE item it raised ('+mine.map(x=>x.gid).join(', ')+') was cured at the late gate (pkgLGS, ASK 191)';done.add(r.gid);if(r.live)LG.off++;}\n"+
  "   else r.why=String(r.why)+' [late gate (pkgLGS): '+(le?'no late answer read: '+le:'not cured: '+st.map(o=>o.x.gid+' '+(o.q?o.q.why:'not read')).join('; ')).slice(0,700)+']';}\n"+
  "  for(const f of C.fresh)if(f.by&&f.by.split(', ').every(h=>done.has(h)))f.lgs='answered at the late gate (pkgLGS): '+f.by+' is CURED, no count';}}",GR+' late pass');
 S=one(S,"const u=C?C.uncured:0;","const u=C?Math.max(0,C.uncured-(LG?LG.off:0)):0;",GR+' u');
 S=one(S,"'raised by the gate change of '+f.by+', which stays UNCURED and is counted there once'","'raised by the gate change of '+f.by+(f.lgs?'; '+f.lgs:', which stays UNCURED and is counted there once')",GR+' fresh audit');
 S=one(S,"' (raised by the gate change of '+f.by+', which stays UNCURED and is counted there once; W3 2341)'","' (raised by the gate change of '+f.by+(f.lgs?'; '+f.lgs+')':', which stays UNCURED and is counted there once; W3 2341)')",GR+' fresh row');
 S=one(S,"item:'NEW '+f.kind+' ('+f.src+')',flagged_line:null,prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:'UNCURED',","item:'NEW '+f.kind+' ('+f.src+')',flagged_line:null,prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:f.lgs?'CURED':'UNCURED',",GR+' fresh row status (W2 5745)');
 S=one(S," bodies[g.idx]=JSON.stringify(b);if(C)C.add.forEach(x=>add.push(x));",
  " if(LG)p.verdict_raw+='\\n'+(LG.C2?LG.C2.res.map(r=>'[AUDIT v38: E-GATE LATE (pkgLGS) -- SEAT: '+g.seat+'; '+r.gid+' '+r.kind+' ('+r.src+'; raised by '+((LG.L.items.find(x=>x.gid===r.gid)||{}).hang||[]).join(', ')+'); ANSWER: '+r.ans+'; '+(r.cured?'CURED':'UNCURED')+': '+safe(r.why)+'; RECORD-ONLY: the count stays on the gate change that raised it]').join('\\n')+(LG.nf.length?'\\n'+LG.nf.map(f=>'[AUDIT v38: E-GATE LATE NEW ITEM (pkgLGS) -- SEAT: '+g.seat+'; '+f.kind+' ('+f.src+'): '+safe(f.why).slice(0,300)+'; RECORD-ONLY, no further gate]').join('\\n'):''):'[AUDIT v38: E-GATE LATE (pkgLGS) -- SEAT: '+g.seat+'; no late answer read: '+safe(LG.le)+'; the gate changes stay as graded]');\n"+
  " bodies[g.idx]=JSON.stringify(b);if(C)C.add.forEach(x=>add.push(x));if(LG&&LG.C2)LG.C2.add.forEach(x=>add.push(x));",GR+' late audit and add');
 S=one(S,",fresh:C?C.fresh.length:0,error:err||cerr||null});",",fresh:C?C.fresh.length:0,error:err||cerr||null,...(LG?{late:{items:LG.L.items.length,cured_changes:LG.off,error:LG.le||null}}:{})});",GR+' seats');
 // late rows: after the fresh rows of this seat
 S=one(S,"(raised by the gate change of '+f.by+(f.lgs?'; '+f.lgs+')':', which stays UNCURED and is counted there once; W3 2341)'):' (RECORD-ONLY)'),at:T}));});",
  "(raised by the gate change of '+f.by+(f.lgs?'; '+f.lgs+')':', which stays UNCURED and is counted there once; W3 2341)'):' (RECORD-ONLY)'),at:T}));\n"+
  " if(LG&&!LG.C2)rows.push({run_token:g.run_token,seat:g.seat,seat_role:__LRL,judge_model:g.api_model,kind:'send_back',rule:'E-GATE',item:'LATE (no answer read)',flagged_line:null,prompt_sent:LG.L.msg,full_reply:LG.lt||null,reply_error:LG.le,response_line:null,cure_status:'UNCURED',cure_reason:'LATE GATE: no late answer read; the gate changes stay as graded (pkgLGS)',at:T});\n"+
 " if(LG)(LG.C2?LG.C2.res:[]).forEach((r,k)=>rows.push({run_token:g.run_token,seat:g.seat,seat_role:__LRL,judge_model:g.api_model,kind:'send_back',rule:'E-GATE',item:'LATE '+r.gid+' '+r.kind+' ('+r.src+')',flagged_line:String(((LG.L.items.find(x=>x.gid===r.gid)||{}).lines||[]).join('\\n')).slice(0,1500)||null,prompt_sent:k===0?LG.L.msg:null,full_reply:k===0?(LG.lt||null):null,reply_error:LG.le,response_line:r.line?String(r.line).slice(0,1500):null,cure_status:r.cured?'CURED':'UNCURED',cure_reason:'LATE GATE '+r.ans+(r.to?' TO: '+String(r.to).slice(0,600):'')+(r.reason?' -- '+String(r.reason).slice(0,400):'')+' | '+r.why+' (pkgLGS; RECORD-ONLY here, the count is on the change that raised it)',at:T}));});",GR+' late rows');
 want[GR]=S;
 // ---- the new Late Gate Build: Gate Record's helper lines + its own main
 const cut=S.lastIndexOf("\nconst PASS=$('"+SBR+"').first().json;");if(cut<0)throw new Error('main start '+GR);
 const MAIN=[
 "const PASS=$('"+SBR+"').first().json; /* pkgLGS (W1, ASK 191 option 1): the late gate. Same reads as "+GR+" */",
 "const GB=$('"+P+"Gate Build').all().map(x=>x.json);const first=GB[0]||{};const skip=w=>[{json:{lgs_send:false,lgs_why:w}}];if(first.gate_skip)return skip('no gate call');",
 "const PB0=(()=>{try{return $('"+(P?FALLB:'Panel Build')+"').first().json;}catch(e){return null;}})();const bodies=Array.isArray(PASS.bodies)?PASS.bodies:$('"+FALLB+"').first().json.bodies;",
 "const R=$input.all().map(x=>x.json);const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+' [...]':s;};const out=[];",
 "GB.forEach((g,ci)=>{let txt='';try{txt=String(R[ci].choices[0].message.content||'');}catch(e){return;}if(!txt.trim()||!g.body||!Array.isArray(g.body.messages))return;",
 " const b=JSON.parse(bodies[g.idx]);const p=b.payload;const its=(PASS.sb_items||[]).filter(x=>x.seat===g.seat);",
 " const j=PB0&&(PB0.judges||[]).find(q=>q.seat===g.seat);const PT=j?gatePromptText2024(j.body):'';const ctx={R:PT?ciRounds(PT):null,DL:PT?drvLinks(PT):[],ask:PT.includes('CITATION CHECK')};",
 " let C;try{C=gateCure2024(g.seat,p.verdict_raw,g.F,its,g.items,txt,ctx);}catch(e){return;}",
 " const hang=new Set(C.res.filter(r=>!r.cured&&r.live&&/^the gate change raised a new LIVE item/.test(String(r.why))).map(r=>r.gid));if(!hang.size)return;",
 " let n=0;for(const x of g.items){const m=String(x.gid||'').match(/^G(\\d+)$/);if(m)n=Math.max(n,+m[1]);}const byKey=new Map();",
 " for(const {g:h,items:L} of (C.late||[]))if(hang.has(h))for(const z of L){const o=byKey.get(z.key);if(o){if(!o.hang.includes(h))o.hang.push(h);continue;}byKey.set(z.key,{...z,gid:'G'+(++n),hang:[h]});}",
 " const items=[...byKey.values()];if(!items.length)return;const __hs=[...hang].filter(h=>items.some(x=>x.hang.includes(h)));",
 " const msg='The engine applied your gate answers and read your judgment again. Your gate change'+(__hs.length>1?'s ':' ')+__hs.join(', ')+' raised the new item'+(items.length>1?'s':'')+' below, which the engine could read only after those answers. This is one further answer on them, under the same rules and line forms as the gate message above. An item left uncured keeps the gate change that raised it UNCURED, and that change counts against your seat once, as before. There is no further round after this one.\\n'",
 "  +items.map(x=>'ITEM '+x.gid+' ('+x.kind+'; '+x.src+'; raised by your change '+x.hang.join(', ')+'):\\nTHE ENGINE: '+cut(x.why,900)+(x.lines&&x.lines.length?x.lines.map(l=>'\\nLINE: '+cut(l,1500)).join(''):'')).join('\\n\\n')",
 "  +'\\n\\nThis reply is not a judgment and is not JSON: write plain lines only.\\nReply with exactly one line per item, and nothing else, in this form (the fields are separated by two vertical bars):\\nGATE: <item id> || KEEP || <one sentence quoting the words that decide it>\\nGATE: <item id> || CHANGE TO: <your corrected line> || <one sentence quoting the words that decide it>'+(items.some(x=>x.src==='E-GATE B')?'\\nGATE: <item id> || DIFFERENT POINT: the press holds \"<words of the verse>\"; my ground uses \"<other words of the verse>\" || <one sentence>':'');",
 " const body={...g.body,messages:[...g.body.messages,{role:'assistant',content:txt},{role:'user',content:msg}]};",
 " out.push({json:{lgs_send:true,seat:g.seat,ci,idx:g.idx,api_model:g.api_model||null,run_token:g.run_token||null,items,msg,body}});});",
 "return out.length?out:skip('no late item');"].join('\n');
 want[P+'Late Gate Build']=S.slice(0,cut)+'\n'+MAIN;
}
// ---- repack: lines already in the library keep their index; a new line used by two or more nodes is added once; others are own lines
const idx=new Map();Lb.forEach((l,i)=>{if(!idx.has(l))idx.set(l,i);});
const cnt=new Map();for(const e in want)for(const l of new Set(want[e].split('\n')))if(!idx.has(l))cnt.set(l,(cnt.get(l)||0)+1);
for(const [l,k] of cnt)if(k>=2){idx.set(l,Lb.length);Lb.push(l);}
const pack=S=>{const p=[];for(const l of S.split('\n')){if(idx.has(l)){const i=idx.get(l);const t=p[p.length-1];
  if(typeof t==='number'&&t+1===i)p[p.length-1]=[t,i];else if(Array.isArray(t)&&typeof t[0]==='number'&&t[1]+1===i)t[1]=i;else p.push(i);}
 else{const t=p[p.length-1];if(Array.isArray(t)&&typeof t[0]==='string')t[0]+='\n'+l;else p.push([l]);}}return p;};
for(const e in want)M[e]={...(M[e]||{}),p:pack(want[e])};
// ---- prune library lines no node uses, and re-index
const used=new Set();for(const e in M)for(const x of M[e].p){if(typeof x==='number')used.add(x);else if(typeof x[0]==='number')for(let i=x[0];i<=x[1];i++)used.add(i);}
const map=new Map();const L2=[];Lb.forEach((l,i)=>{if(used.has(i)){map.set(i,L2.length);L2.push(l);}});
for(const e in M)M[e].p=M[e].p.map(x=>typeof x==='number'?map.get(x):typeof x[0]==='number'?[map.get(x[0]),map.get(x[1])]:x);
const dropped=Lb.length-L2.length;Lb=L2;
for(const e in M){const s=reb(e,Lb);M[e].n=s.length;const w=want[e]!==undefined?want[e]:before[e];if(s!==w)throw new Error('rebuild differs: '+e);}
const LJ=JSON.stringify(Lb);
LN.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}(, )\d+( lines)/,(x,h,s1,s2)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16)+s1+Lb.length+s2);
// ---- stubs, IF, HTTP, wiring
for(const [P] of PATHS){
 const GR=byN(P+'Gate Record');const g0=GR.parameters.jsCode;
 const head=g0.match(/if\(false\)\{([^}]*)\$\(String\(\)\);\}/);if(!head)throw new Error('stub list '+GR.name);
 GR.parameters.jsCode=one(g0,head[0],'if(false){'+head[1]+'$("'+P+'Gate Call openrouter");$("'+P+'Late Gate Build");$("'+P+'Late Gate Call openrouter");$(String());}',GR.name+' stub list');
 const IFg=byN(P+'Gate Needed?'),CALL=byN(P+'Gate Call openrouter');const [x0,y0]=CALL.position;
 const LB={...cl(GR),id:crypto.randomUUID(),name:P+'Late Gate Build',position:[x0+110,y0+200]};
 let st=one(g0,'form 3: "'+P+'Gate Record".','form 3: "'+P+'Late Gate Build".',P+'LGB stub title');st=one(st,'["'+P+'Gate Record"]','["'+P+'Late Gate Build"]',P+'LGB stub map key');
 st=one(st,head[0],'if(false){'+head[1]+'$("'+P+'Gate Build");$(String());}',P+'LGB stub list');
 st=st.replace(/'pkgLIB: the Shared Library holds no entry for [^']*'/,"'pkgLIB: the Shared Library holds no entry for "+P+"Late Gate Build'");LB.parameters={jsCode:st};
 const LI=cl(IFg);Object.assign(LI,{id:crypto.randomUUID(),name:P+'Late Gate Needed?',position:[x0+220,y0+200]});LI.parameters.conditions.conditions[0].id='late-gate-needed';LI.parameters.conditions.conditions[0].leftValue='={{ $json.lgs_send === true }}';
 const LC=cl(CALL);Object.assign(LC,{id:crypto.randomUUID(),name:P+'Late Gate Call openrouter',position:[x0+330,y0+200]});
 W.nodes.push(LB,LI,LC);
 if(JSON.stringify(C[CALL.name].main)!==JSON.stringify([[{node:GR.name,type:'main',index:0}]]))throw new Error(P+' gate call wiring differs');
 C[CALL.name].main=[[{node:LB.name,type:'main',index:0}]];C[LB.name]={main:[[{node:LI.name,type:'main',index:0}]]};
 C[LI.name]={main:[[{node:LC.name,type:'main',index:0}],[{node:GR.name,type:'main',index:0}]]};C[LC.name]={main:[[{node:GR.name,type:'main',index:0}]]};
}
const PT=byN('Panel Tokens');let pt=PT.parameters.jsCode;
for(const [P] of PATHS)pt=one(pt,"()=>$('"+P+"Gate Call openrouter'),","()=>$('"+P+"Gate Call openrouter'),()=>$('"+P+"Late Gate Call openrouter'),",'Panel Tokens '+P);
PT.parameters.jsCode=pt;
fs.writeFileSync(process.argv[3],JSON.stringify(W));
console.log('written',process.argv[3],'library lines',Lb.length,'dropped',dropped,'new shared',[...cnt].filter(([l,k])=>k>=2).length);
