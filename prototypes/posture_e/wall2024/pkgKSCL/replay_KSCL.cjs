// pkgKSCL dry replay (W3 2693/grade_33218: "show the firing path raises only true items"). Run from wall2024/ after build_KSCL.cjs:
//   node pkgKSCL/replay_KSCL.cjs
// Part 1, the real nodes on run 33218's saved inputs (inputs/33218_*): Send Back Build and Send Back Record, live code (s12, LIVE=false) and
// pkgKSCL code (LIVE=true). (a) As run: both reproduce 0 E-KSC items. (b) Fired: gemini's first verdict gets one true breach written in (its
// CONCEDED LINKS line counts LINK 6 UNEXHIBITED under KEYSTONE D6 STANDS). Send Back Build must raise exactly one E-KSC item, for gemini only;
// Send Back Record, with no answer to it, must record it UNCURED: TRIAL leaves drv_uncured alone, LIVE adds 1 for gemini only.
// Part 2, the library on every verdict of 33175, 33197 and 33218 (first verdicts where saved, else stored), each item checked by hand rule.
const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');let ok=0,bad=0;const out=[];
const T=(n,c,d)=>{const l=(c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:'');console.log(l);out.push(l);c?ok++:bad++;};
function harness(RUN,over){const cache={};const saved=n=>{if(over&&n in over)return over[n];if(n in cache)return cache[n];const f=D+RUN+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[n]=null;const d=JSON.parse(rd(f));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return cache[n]=(m&&m[0])||[];};
 const cl=x=>JSON.parse(JSON.stringify(x));const mk=n=>{const it=saved(n);if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
 return (code,inputNode)=>{const inp=saved(inputNode)||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
  const RD=Date,FIX=new RD('2026-11-07T02:00:00Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
  try{return new Function('$','$input','$json','$execution','$workflow',code)(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};}
const B=f=>rd('pkgKSCL/base/'+f),P=f=>rd('pkgKSCL/patched/'+f);
const L=(RUN,n)=>{const d=JSON.parse(rd(D+RUN+'_'+n.replace(/ /g,'_')+'.json'));const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];};
const kscOf=o=>(o||[]).flatMap(x=>(x.json.items||[]).filter(i=>i&&i.rule==='E-KSC').map(i=>({seat:x.json.seat,i})));
const pred=n=>{let W=JSON.parse(rd('/mnt/project-files/wall2024/fetchback_live_s12.json'));W=W.nodes?W:(W.data||W);for(const [s,c] of Object.entries(W.connections))for(const o of (c.main||[]))for(const e of (o||[]))if(e.node===n)return s;};
const SBBin=pred('Send Back Build'),SBRin=pred('Send Back Record');
// ---- Part 1 (a): as run ----
{const h=harness('33218');const a=h(B('Send_Back_Build.js'),SBBin),b=h(P('Send_Back_Build.js'),SBBin);const sv=L('33218','Send Back Build');
 T('33218 Send Back Build as run: live and pkgKSCL code each raise 0 E-KSC items ('+kscOf(a).length+', '+kscOf(b).length+'; saved output '+kscOf(sv).length+')',kscOf(a).length===0&&kscOf(b).length===0&&kscOf(sv).length===0);
 const m=x=>JSON.stringify((x||[]).map(y=>y.json.items));T('33218 Send Back Build as run: pkgKSCL items equal the saved output\'s items',m(b)===m(sv));}
// ---- Part 1 (b): one true breach written into gemini's first verdict ----
const PCC=L('33218','Panel Cure Check');const pcc=JSON.parse(JSON.stringify(PCC));const j=pcc[0].json;
j.bodies=j.bodies.map(x=>{const s=typeof x==='string';const o=s?JSON.parse(x):x;if(o.payload.judge_seat==='gemini'){const t=o.payload.verdict_raw;const k=t.indexOf('CONCEDED LINKS: 1');o.payload.verdict_raw=t.slice(0,k)+'CONCEDED LINKS: 1 -- LINK 6: UNEXHIBITED (injected for the dry replay)'+t.slice(k+'CONCEDED LINKS: 1'.length);}return s?JSON.stringify(o):o;});
{const g=JSON.parse(typeof j.bodies[0]==='string'?j.bodies[0]:JSON.stringify(j.bodies[0]));}
const over={'Panel Cure Check':pcc};const h=harness('33218',over);const a=h(B('Send_Back_Build.js'),SBBin),b=h(P('Send_Back_Build.js'),SBBin);const ka=kscOf(a),kb=kscOf(b);
T('fired: Send Back Build raises exactly 1 E-KSC item, for gemini only, in live and pkgKSCL code ('+ka.map(x=>x.seat).join()+' | '+kb.map(x=>x.seat).join()+')',ka.length===1&&kb.length===1&&ka[0].seat==='gemini'&&kb[0].seat==='gemini',kb[0]?'item: '+JSON.stringify(kb[0].i).slice(0,400):'');
const gm=o=>JSON.stringify((o||[]).find(y=>y.json.seat==='gemini').json);const W1=gm(a).match(/THE KEYSTONE CONSISTENCY RULE \(E-KSC, ([A-Z]+)/),W2=gm(b).match(/THE KEYSTONE CONSISTENCY RULE \(E-KSC, ([A-Z]+)/);
T('fired: the item names D6 and LINK 6 UNEXHIBITED; the message to gemini says '+(W1&&W1[1])+' (live) and '+(W2&&W2[1])+' (pkgKSCL)',kb[0]&&/KEYSTONE D6 on LINK 6 UNEXHIBITED/.test(kb[0].i.item)&&W1&&W1[1]==='TRIAL'&&W2&&W2[1]==='ENFORCED');
const others=x=>JSON.stringify((x||[]).filter(y=>y.json.seat!=='gemini').map(y=>y.json.items));const sv=L('33218','Send Back Build');
T('fired: the other seats\' items are unchanged from the saved output',others(b)===others(sv));
// Send Back Record on the fired Send Back Build (no answer exists for the injected item)
const drv=(o)=>{const r=o&&o[0]&&o[0].json;const bb=(r&&r.bodies||[]).map(x=>typeof x==='string'?JSON.parse(x):x);return Object.fromEntries(bb.map(x=>[x.payload.judge_seat,x.payload.drv_uncured||0]));};
const v48=(o)=>{const r=o&&o[0]&&o[0].json;return (r&&r.bodies||[]).map(x=>typeof x==='string'?JSON.parse(x):x).map(x=>(String(x.payload.verdict_raw).match(/\[AUDIT v48[^\]]*\]/g)||[]).join(' ')).filter(Boolean);};
const r0=harness('33218')(P('Send_Back_Record.js'),'Send Back Call openrouter');
const gi=(b||[]).filter(y=>!y.json.sb_skip).findIndex(y=>y.json.seat==='gemini');const SBC=L('33218','Send Back Call openrouter');
const withReply=line=>{const c=JSON.parse(JSON.stringify(SBC));const m=c[gi].json.choices[0].message;m.content=String(m.content)+'\n'+line;return c;};
const hr=(code,sbb,line)=>harness('33218',{'Panel Cure Check':pcc,'Send Back Build':sbb,'Send Back Call openrouter':withReply(line)})(code,'Send Back Call openrouter');
const d0=drv(r0);T('Send Back Record as run (pkgKSCL code): drv_uncured '+JSON.stringify(d0)+', no AUDIT v48 line',v48(r0).length===0);
const KEEP='SENDBACK: S22 || KEEP || my keystone stands',CURE='SENDBACK: S22 || CHANGE TO: KEYSTONE: D6 -- WITHDRAWN -- my CONCEDED LINKS line counts LINK 6 UNEXHIBITED || the keystone cannot stand on a link I count';
const ka2=hr(B('Send_Back_Record.js'),a,KEEP),kb2=hr(P('Send_Back_Record.js'),b,KEEP),ca=hr(B('Send_Back_Record.js'),a,CURE),cb=hr(P('Send_Back_Record.js'),b,CURE);
T('fired, gemini KEEPs, live TRIAL code: recorded (AUDIT v48 TRIAL), drv_uncured unchanged '+JSON.stringify(drv(ka2)),JSON.stringify(drv(ka2))===JSON.stringify(d0)&&v48(ka2).length===1&&/TRIAL/.test(v48(ka2)[0]),v48(ka2)[0]);
T('fired, gemini KEEPs, pkgKSCL LIVE code: gemini drv_uncured +1, others unchanged '+JSON.stringify(drv(kb2)),drv(kb2).gemini===(d0.gemini||0)+1&&Object.keys(d0).every(k=>k==='gemini'||drv(kb2)[k]===d0[k])&&v48(kb2).length===1&&/counted in drv_uncured/.test(v48(kb2)[0]),v48(kb2)[0]);
T('fired, gemini CHANGEs its KEYSTONE to WITHDRAWN: CURED in both, drv_uncured unchanged, no AUDIT v48 line ('+JSON.stringify(drv(ca))+', '+JSON.stringify(drv(cb))+')',JSON.stringify(drv(ca))===JSON.stringify(d0)&&JSON.stringify(drv(cb))===JSON.stringify(d0)&&!v48(ca).length&&!v48(cb).length);
// ---- Part 2: the library on every verdict of 33175, 33197, 33218 ----
const K=(()=>{const s=P('Send_Back_Build.js');const i=s.indexOf('const KSC=(()=>{');return new Function(s.slice(i,s.indexOf('})();',i)+5)+';return KSC;')();})();
const V=JSON.parse(rd('pkgKSCL/data/verdicts_3runs.json'));// the hand rule, written apart from the library's TAG reader: on the last defender CONCEDED LINKS line, any "LINK n" or "Premise p" followed within 40
// characters (no other number, no sentence end) by UNEXHIBITED, CONCEDED or WITHDRAWN; p mapped through the [DR2] list; the keystone D must STAND
const hand=(t,dr2)=>{const k=K.keystone(t),c=K.conceded(t);if(!k||k.state!=='STANDS'||!c)return false;const pm=K.premiseMap(dr2)||{};const l=c.line.replace(/[*_`]/g,'').replace(/^.*?CONCEDED LINKS\s*:\s*\d*/i,'');
 const hits=[...l.matchAll(/\b(LINK|Premise)\s+(\d+)\b([^.;\d]{0,40}?)\b(UNEXHIBITED|CONCEDED|WITHDRAWN)\b/gi)].filter(m=>!/\bspared\b|\bnot\b/i.test(m[3])).map(m=>/^LINK$/i.test(m[1])?+m[2]:pm[+m[2]]);return hits.includes(k.n);};
for(const v of V){const its=K.items(v.text,v.dr2);const exp=hand(v.text,v.dr2);const c=K.conceded(v.text),k=K.keystone(v.text);
 T(v.run+' '+v.seat.padEnd(8)+' ('+v.src+'): '+(its.length?'FIRES: '+its.map(i=>'D'+i.n+' STANDS, '+i.via+' '+i.tag).join('; '):'quiet')+' | KEYSTONE '+(k?'D'+k.n+' '+k.state:'none')+' | '+(c?c.line.slice(0,110):'no CONCEDED LINKS line'),(its.length>0)===exp);}
const must=V.find(v=>v.run==='33175'&&v.seat==='single');T('33175 single judge (LINK 6 UNEXHIBITED, keystone D6 STANDS) fires',must&&K.items(must.text,must.dr2).length===1);
fs.writeFileSync('pkgKSCL/replay_KSCL.txt',out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n');console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
