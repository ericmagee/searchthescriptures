// pkgECG (W1; run 35296, W3 Wall 5107, W4 Wall 5108 item 2): the gate rules K-B, K-G4 and K-G7 are not asked on a link the
// engine broke on a confirmed closing contradiction (Close Enforcer Record cec.confirmed, Judge Contradiction Record
// jcc.confirmed). pkgECB keeps such links out of the DeepSeek send-back; the cure items built at the Payloads stage were not
// covered. In run 35296 haiku (R2 alternate) was asked K-B on D3 vs C3 and K-G4 and K-G7 on D4 vs C4, all on confirmed links
// 3 and 4, and the asks pushed it to retract correct breaks.
// Change:
//  1. New library line (appended, index 3471): function ecgSplit2024(items) -> {keep, ecg}. An item moves to ecg when its rule
//     is K-B, K-G4 or K-G7 and its line is "Dn vs Cm (...): DEFENDER|CHALLENGER LINK BROKEN" on a link in cec or jcc confirmed.
//  2. Panel Payloads (own lines), Alternate Payloads and R2 Alternate Payloads (library line 2439): before drv_uncured is
//     counted, the ecg items leave DRV.items (not asked, not counted); they ride on the summary (panel) or the result (alternate).
//  3. Records: Panel Cure Check and the two Alternate Merge Seats write one enforcer_check row per ecg item, cure_status null,
//     cure_reason "NOT ASKED (code, pkgECG): ...", as pkgECS does for collision lines.
//  4. The three Payloads stubs name Close Enforcer Record and Judge Contradiction Record in their read lists.
// Prompt 0. Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const byN=n=>{const x=W.nodes.find(z=>z.name===n);if(!x)throw new Error('no node '+n);return x;};
const one=(s,o,n,what)=>{if(s.split(o).length!==2)throw new Error('anchor not found once: '+what);return s.replace(o,()=>n);};
const N=byN('Shared Library');const T=N.parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
if(Lb.length!==3471)throw new Error('library length '+Lb.length);
// 1. the function
Lb.push("function ecgSplit2024(items){const L=new Set();for(const [n,k] of [['Close Enforcer Record','cec'],['Judge Contradiction Record','jcc']]){try{const x=$(n);if(!x||!x.isExecuted)continue;const j=x.first().json;((j&&j[k]&&j[k].confirmed)||[]).forEach(y=>L.add(y.side+' '+(+y.link)));}catch(e){}} /* pkgECG: K-B, K-G4 and K-G7 are not asked on a link the engine broke on a confirmed closing contradiction (the gate-rule side of pkgECB) */\n"+
 " const keep=[],ecg=[];for(const x of (items||[])){const t=String(x&&x.line||'').replace(/[*_`]+/g,'').trim();const m=/^K-(?:B|G4|G7)$/.test(String(x&&x.rule||''))?t.match(/^D(\\d+)\\s+vs\\.?\\s+C(\\d+)\\b\\s*(?:\\([^)]*\\))?\\s*:\\s*(DEFENDER|CHALLENGER) LINK BROKEN\\b/):null;const n=m&&(m[3]==='DEFENDER'?m[1]:m[2]);\n"+
 "  if(n&&L.has(m[3]+' '+(+n)))ecg.push(Object.assign({},x,{ecg:'NOT ASKED (code, pkgECG): the line grades '+m[3]+' link '+n+', which the engine broke on a confirmed closing contradiction; '+x.rule+' does not apply to that break, as the send-back does not send it (pkgECB)'}));else keep.push(x);}return {keep,ecg};}");
const FN=Lb.length-1;
const SPLIT="{const __g=ecgSplit2024(DRV.items);DRV.items.splice(0,DRV.items.length,...__g.keep);DRV.ecg=__g.ecg;} /* pkgECG */";
// 2a. alternates: library line 2439
if(Lb[2439]!=="  p.drv_uncured=DRV.items.filter(enfLive).length;")throw new Error('line 2439 differs');
Lb[2439]="  "+SPLIT+"res.ecg=DRV.ecg;p.drv_uncured=DRV.items.filter(enfLive).length;";
// 2b. panel: own lines
const own=(node,pred,f,what)=>{let h=0;M[node].p=M[node].p.map(e=>{if(Array.isArray(e)&&typeof e[0]==='string'&&pred(e[0])){h++;return [f(e[0])];}return e;});if(h!==1)throw new Error(what+' hits '+h);};
own('Panel Payloads',s=>s===" p.drv_uncured=DRV.items.filter(enfLive).length;",s=>" "+SPLIT+"p.drv_uncured=DRV.items.filter(enfLive).length;",'PP 245');
own('Panel Payloads',s=>s.startsWith("bodies.push(JSON.stringify({payload:p}));summary.push("),s=>one(s,"drv:DRV.items,","drv:DRV.items,ecg:DRV.ecg||[],",'PP 247'),'PP 247');
// function at the head of each Payloads source (declarations hoist; placed after the own __L map line)
for(const n of ['Panel Payloads','Alternate Payloads','R2 Alternate Payloads']){M[n].p.splice(1,0,FN);}
// 3. records
const ROW=(seat,role,model,run)=>"{run_token:"+run+",seat:"+seat+",seat_role:"+role+",judge_model:"+model+",kind:'enforcer_check',rule:x.rule,item:String(x.link==null?'':x.link),flagged_line:String(x.line||'').slice(0,1500),prompt_sent:null,full_reply:null,reply_error:null,response_line:String(x.line||'').slice(0,700),cure_status:null,cure_reason:x.ecg,at:new Date().toISOString()}";
own('Panel Cure Check',s=>s.startsWith("const enforcer_log=[];summary.forEach((s,i)=>{const all=s.drv||[];if(!all.length)return;"),s=>one(s,"const enforcer_log=[];summary.forEach((s,i)=>{const all=s.drv||[];","const enforcer_log=[];summary.forEach((s,i)=>{(s.ecg||[]).forEach(x=>enforcer_log.push("+ROW('s.seat',"s.substitute?'reserve':'panel'",'s.api_model||null','altS.run_token')+")); /* pkgECG */const all=s.drv||[];",'PCC'),'PCC');
const L1635=Lb[1635];Lb[1635]=one(L1635,"forEach(x=>enforcer_log.push(x));}});","forEach(x=>enforcer_log.push(x));}if(r.ok)(r.ecg||[]).forEach(x=>enforcer_log.push("+ROW('a.seat',"'alternate'",'a.api_model','S.run_token')+")); /* pkgECG */});",'1635');
// 4. stub read lists
for(const n of ['Panel Payloads','Alternate Payloads','R2 Alternate Payloads']){const st=byN(n);st.parameters.jsCode=one(st.parameters.jsCode,'if(false){','if(false){$("Close Enforcer Record");$("Judge Contradiction Record");',n+' stub');}
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}(, )\d+( lines)/,(x,h,s2,s3)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16)+s2+Lb.length+s3);
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
