// pkgCLR dry replay. Run from wall2024/ after build_CLR.cjs:  node pkgCLR/replay_CLR.cjs
// Part 1: the real Send Back Build and Send Back Record nodes on run 33218's saved inputs, pkgKSCL code (base) vs pkgCLR code. As run, the same items.
// Fired with gemini's own count shape (the premise on the line after "CONCEDED LINKS: 1"), only pkgCLR raises the item; KEEP, CHANGE TO and keystone
// cures behave. Part 2: the 12 verdicts of 33175, 33197, 33218. Part 3: the 201 stored panel judgments, through the built node library.
const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');let ok=0,bad=0;const out=[];
const T=(n,c,d)=>{const l=(c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:'');console.log(l);out.push(l);c?ok++:bad++;};
function harness(RUN,over){const cache={};const saved=n=>{if(over&&n in over)return over[n];if(n in cache)return cache[n];const f=D+RUN+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[n]=null;const d=JSON.parse(rd(f));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return cache[n]=(m&&m[0])||[];};
 const cl=x=>JSON.parse(JSON.stringify(x));const mk=n=>{const it=saved(n);if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
 return (code,inputNode)=>{const inp=saved(inputNode)||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
  const RD=Date,FIX=new RD('2026-11-07T02:00:00Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
  try{return new Function('$','$input','$json','$execution','$workflow',code)(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};}
const B=f=>rd('pkgCLR/base/'+f),P=f=>rd('pkgCLR/patched/'+f);
const L=(RUN,n)=>{const d=JSON.parse(rd(D+RUN+'_'+n.replace(/ /g,'_')+'.json'));const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];};
const kscOf=o=>(o||[]).flatMap(x=>(x.json.items||[]).filter(i=>i&&i.rule==='E-KSC').map(i=>({seat:x.json.seat,i})));
const pred=n=>{let W=JSON.parse(rd('/mnt/project-files/wall2024/fetchback_live_s12.json'));W=W.nodes?W:(W.data||W);for(const [s,c] of Object.entries(W.connections))for(const o of (c.main||[]))for(const e of (o||[]))if(e.node===n)return s;};
const SBBin=pred('Send Back Build'),SBRin=pred('Send Back Record');

// ---- Part 1 (a): as run, pkgKSCL code (base) and pkgCLR code raise the same items ----
const m=x=>JSON.stringify((x||[]).map(y=>y.json.items));
{const h=harness('33218');const a=h(B('Send_Back_Build.js'),SBBin),b=h(P('Send_Back_Build.js'),SBBin);
 T('33218 Send Back Build as run: pkgKSCL and pkgCLR code each raise 0 E-KSC items ('+kscOf(a).length+', '+kscOf(b).length+')',kscOf(a).length===0&&kscOf(b).length===0);
 T('33218 Send Back Build as run: pkgCLR items equal pkgKSCL items for every seat',m(a)===m(b));}
// ---- Part 1 (b): gemini's real count shape (the premise on the NEXT line), with Premise 5 changed to Premise 6 ([DR2] premise 6 = LINK 6) ----
const PCC=L('33218','Panel Cure Check');const pcc=JSON.parse(JSON.stringify(PCC));const j=pcc[0].json;let injected=false;
j.bodies=j.bodies.map(x=>{const s=typeof x==='string';const o=s?JSON.parse(x):x;if(o.payload.judge_seat==='gemini'){const t=o.payload.verdict_raw;const A='CONCEDED LINKS: 1\\nPremise 5: UNEXHIBITED',A2='CONCEDED LINKS: 1\nPremise 5: UNEXHIBITED';
 const a=t.includes(A)?A:A2;if(t.split(a).length===2){o.payload.verdict_raw=t.replace(a,a.replace('Premise 5','Premise 6'));injected=true;}}return s?JSON.stringify(o):o;});
T('injection landed once in gemini\'s first verdict (continuation line "Premise 6: UNEXHIBITED")',injected);
const over={'Panel Cure Check':pcc};const h=harness('33218',over);const a=h(B('Send_Back_Build.js'),SBBin),b=h(P('Send_Back_Build.js'),SBBin);const ka=kscOf(a),kb=kscOf(b);
T('fired: pkgKSCL code raises 0 E-KSC items (it reads the label line only), pkgCLR code raises exactly 1, for gemini ('+ka.map(x=>x.seat).join()+' | '+kb.map(x=>x.seat).join()+')',ka.length===0&&kb.length===1&&kb[0].seat==='gemini',kb[0]?'item: '+JSON.stringify(kb[0].i).slice(0,420):'');
T('fired: the item names KEYSTONE D6 and Premise 6 = LINK 6 UNEXHIBITED',kb[0]&&/KEYSTONE D6 on/.test(kb[0].i.item)&&/Premise 6 = LINK 6/.test(JSON.stringify(kb[0].i))&&/UNEXHIBITED/.test(kb[0].i.item));
const others=x=>JSON.stringify((x||[]).filter(y=>y.json.seat!=='gemini').map(y=>y.json.items));T('fired: the other seats\' items are unchanged',others(a)===others(b));
const drv=(o)=>{const r=o&&o[0]&&o[0].json;const bb=(r&&r.bodies||[]).map(x=>typeof x==='string'?JSON.parse(x):x);return Object.fromEntries(bb.map(x=>[x.payload.judge_seat,x.payload.drv_uncured||0]));};
const v48=(o)=>{const r=o&&o[0]&&o[0].json;return (r&&r.bodies||[]).map(x=>typeof x==='string'?JSON.parse(x):x).map(x=>(String(x.payload.verdict_raw).match(/\[AUDIT v48[^\]]*\]/g)||[]).join(' ')).filter(Boolean);};
const r0=harness('33218')(P('Send_Back_Record.js'),'Send Back Call openrouter');const d0=drv(r0);
const gi=(b||[]).filter(y=>!y.json.sb_skip).findIndex(y=>y.json.seat==='gemini');const SBC=L('33218','Send Back Call openrouter');
const withReply=line=>{const c=JSON.parse(JSON.stringify(SBC));const mm=c[gi].json.choices[0].message;mm.content=String(mm.content)+'\n'+line;return c;};
const hr=(code,sbb,line)=>harness('33218',{'Panel Cure Check':pcc,'Send Back Build':sbb,'Send Back Call openrouter':withReply(line)})(code,'Send Back Call openrouter');
T('Send Back Record as run (pkgCLR code): drv_uncured '+JSON.stringify(d0)+', no AUDIT v48 line',v48(r0).length===0);
const sid=kb[0]?String(kb[0].i.id||kb[0].i.sid||'S22'):'S22';
const KEEP='SENDBACK: '+sid+' || KEEP || my keystone stands';
const C0='SENDBACK: '+sid+' || CHANGE TO: CONCEDED LINKS: 0 -- Premise 6 is spared on re-reading the [CR3] answer || the count was wrong';
const C1='SENDBACK: '+sid+' || CHANGE TO: CONCEDED LINKS: 1 -- Premise 6: UNEXHIBITED || I keep the count';
const C2='SENDBACK: '+sid+' || CHANGE TO: KEYSTONE: D6 -- WITHDRAWN -- my count names Premise 6 = LINK 6 UNEXHIBITED || the keystone cannot stand on it';
const k1=hr(P('Send_Back_Record.js'),b,KEEP),k2=hr(P('Send_Back_Record.js'),b,C0),k3=hr(P('Send_Back_Record.js'),b,C1),k4=hr(P('Send_Back_Record.js'),b,C2);
T('KEEP: gemini drv_uncured +1, others unchanged '+JSON.stringify(drv(k1)),drv(k1).gemini===(d0.gemini||0)+1&&Object.keys(d0).every(k=>k==='gemini'||drv(k1)[k]===d0[k])&&v48(k1).length===1,v48(k1)[0]);
T('CHANGE TO a count line that no longer counts Premise 6: CURED, drv_uncured unchanged '+JSON.stringify(drv(k2)),JSON.stringify(drv(k2))===JSON.stringify(d0)&&!v48(k2).length);
T('CHANGE TO a count line that still counts Premise 6 (= LINK 6 by [DR2]): UNCURED, gemini +1 '+JSON.stringify(drv(k3)),drv(k3).gemini===(d0.gemini||0)+1&&v48(k3).length===1,v48(k3)[0]);
T('CHANGE TO KEYSTONE D6 WITHDRAWN: CURED, drv_uncured unchanged '+JSON.stringify(drv(k4)),JSON.stringify(drv(k4))===JSON.stringify(d0)&&!v48(k4).length);
// ---- Part 2: the library on the 12 verdicts of 33175, 33197, 33218: pkgKSCL vs pkgCLR ----
const lib=code=>{const i=code.indexOf('const CLR=(()=>{')>=0?code.indexOf('const CLR=(()=>{'):code.indexOf('const KSC=(()=>{');const k=code.indexOf('const KSC=(()=>{');return new Function(code.slice(i,code.indexOf('})();',k)+5)+';return KSC;')();};
const KB=lib(B('Send_Back_Build.js')),KP=lib(P('Send_Back_Build.js'));
const V=JSON.parse(rd('pkgKSCL/data/verdicts_3runs.json'));
for(const v of V){const x=KB.items(v.text,v.dr2),y=KP.items(v.text,v.dr2);const f=z=>z.map(i=>'D'+i.n+' '+i.via+' '+i.tag).join('; ')||'quiet';
 T(v.run+' '+v.seat.padEnd(8)+': pkgKSCL '+f(x)+' | pkgCLR '+f(y),x.length===y.length||(y.length>x.length),y.length!==x.length?'DIFFERS: count line '+(KP.conceded(v.text)||{}).line:'');}
// ---- Part 3: 201 stored panel judgments, KSC rule through the built nodes (pkgCLR library inside the node code) ----
const X=JSON.parse(rd('pkgCLR/data/count_chunks.json'));const DD={};for(const x of JSON.parse(rd('pkgKSC/data/dr2_lists.json')))DD[x.run]=x.dr2;
let nb=0,np=0;const add=[],lost=[];
for(const v of X){const t=(v.chunks||[]).map(c=>String(c).replace(/\\n/g,'\n')).join('\n');const ks=(v.ks||[]).map(c=>String(c).replace(/\\n/g,'\n')).join('\n');const k=KP.keystone(ks);if(!k||k.state!=='STANDS')continue;
 const tt=t.split('\n').filter(l=>!/^\s*\[/.test(l)).join('\n').replace(/KEYSTONE[^\n]*/g,'')+'\n'+k.line;const x=KB.items(tt,DD[v.run]).length>0,y=KP.items(tt,DD[v.run]).length>0;nb+=x;np+=y;if(y&&!x)add.push(v.run.slice(5,10)+' '+v.seat);if(x&&!y)lost.push(v.run.slice(5,10)+' '+v.seat);}
const HAND=['29199 grok','30268 gemini','31360 qwen','32905 gemini','33014 gemini','33040 grok'];
T('201 stored judgments: pkgKSCL '+nb+' hits, pkgCLR '+np+'; lost none ('+(lost.join(', ')||'none')+'); added = the 6 hand-checked true breaches ('+add.join(', ')+')',lost.length===0&&add.length===6&&HAND.every(h=>add.includes(h)));
fs.writeFileSync('pkgCLR/replay_CLR.txt',out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n');console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
