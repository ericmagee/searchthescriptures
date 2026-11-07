// pkgDPT (W1 2830 ask 2; W3 ruling 2832), ENFORCER fix, side-neutral, TRIAL for one run and then LIVE: the DIFFERENT POINT answer to an E-GATE B item.
// E-GATE B raises a contradiction when an ANSWER CHECK on verse V grades MISSES (the press stands) and a collision graded against the pressing side
// cites V. It never compares meanings, so a ground that uses another point of V is charged (screen_EGB.md: 8 of 15 stored items, 3 counted).
// The gate prompt (only when the seat has an E-GATE B item) offers: GATE: Gn || DIFFERENT POINT: the press holds "<P>"; my ground uses "<G>" || <sentence>
// Cured (LIVE) only when all hold (W3 2832 b): P and G are each 4 words or more and each is a run of words of V as this run read it (Cited Verses,
// kjv_verses; margin notes, case and punctuation do not count); P stands in that ANSWER CHECK's MEANS or in a round of the other letter than the
// check's round (the pressing side's rounds, which hold its quotation of V); G stands in a quotation of the collision line; P and G do not overlap in V.
// Added guard 2 (W1): P also overlaps no run of V that the collision line quotes (3 words or more), so a judge cannot shrink G to dodge an overlap.
// Added guard (W1, for W3 to keep or strike): P shares a content word (4 letters or more) with the MEANS, so a judge cannot pick an unrelated clause of V.
// A verse the run did not read cannot be checked: not cured. A failed DIFFERENT POINT stays UNCURED as today (2832 e). KEEP is not a cure.
// TRIAL (DPT_STATUS 'TRIAL'): the cure verdict is written into the item's reason only; cured is unchanged. LIVE: an uncured E-GATE B item with a
// passing DIFFERENT POINT is cured.
// Base: live ae5636d0 + pkgEGB-1. Run from wall2024/: node pkgDPT/build_DPT.cjs [--fb f] [--on dirs] [--out dir] [--status TRIAL|LIVE]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const FB=arg('--fb','/mnt/project-files/wall2024/fetchback_live_s39.json');const OUT=arg('--out','pkgDPT/patched');const ON=arg('--on','pkgEGB/patched');const ST=arg('--status','TRIAL');
const w=JSON.parse(fs.readFileSync(FB,'utf8'));const W=w.data||w;const NS=(W.nodes||W.workflow.nodes);
if(ON)for(const d of ON.split(','))for(const n of NS){const f=d+'/'+n.name.replace(/ /g,'_')+'.js';if(n.parameters&&typeof n.parameters.jsCode==='string'&&fs.existsSync(f))n.parameters.jsCode=fs.readFileSync(f,'utf8');}
const LIB=`// pkgDPT (W1 2830; W3 2832): the DIFFERENT POINT answer to an E-GATE B item.
const DPT_STATUS='${ST}';
function dptRead(txt){const A={};const T2=String(txt||'').replace(/\\\\n/g,'\\n').replace(/\\\\"/g,'"');
 for(const l0 of T2.split('\\n')){const l=l0.replace(/[*_\`]+/g,'').trim();const m=l.match(/GATE\\s*:?\\s*(?:ITEM\\s*)?#?\\s*(G\\s*\\d+)\\s*:?\\s*\\|\\|\\s*DIFFERENT\\s+POINT\\s*:?\\s*([\\s\\S]*)$/i);if(!m)continue;
  const id=m[1].replace(/\\s+/g,'').toUpperCase();if(A[id])continue;const q=m[2].match(/press\\s+holds\\s*:?\\s*["\\u201c]([^"\\u201c\\u201d]+)["\\u201d][\\s\\S]*?ground\\s+uses\\s*:?\\s*["\\u201c]([^"\\u201c\\u201d]+)["\\u201d]/i);
  A[id]={p:q?q[1]:null,g:q?q[2]:null,line:l};}
 return A;}
function dptCheck(x,d,ctx){const no=w=>({ok:false,why:'DIFFERENT POINT not accepted: '+w});if(!d||!d.p||!d.g)return no('the line does not give the press holds "<words>" and my ground uses "<words>" quotations');
 const L0=String((x.lines||[])[0]||'').replace(/[*_\`]+/g,'');const L1=String((x.lines||[])[1]||'').replace(/[*_\`]+/g,'');
 const am=L0.match(/ANSWER CHECK\\s*:\\s*((?:[1-3]\\s)?[A-Za-z][A-Za-z ]*?)\\s+(\\d+):(\\d+)\\s*(?:--|\\u2014)\\s*\\[\\s*([CD]R[1-4])\\s*\\]/i);if(!am)return no('the ANSWER CHECK line was not read');
 const ref=am[1]+' '+am[2]+':'+am[3];const vt=kfcText({book:am[1],ch:+am[2],v1:+am[3],v2:+am[3]},kkjvRows());if(!vt)return no(ref+' was not read this run (Cited Verses), so the spans cannot be checked');
 const f=s=>krulNorm(kkjvNoMargin(s));const V=f(vt).split(' ').filter(Boolean);const P=f(d.p).split(' ').filter(Boolean),G=f(d.g).split(' ').filter(Boolean);
 if(P.length<4||G.length<4)return no('each span must be 4 words or more of '+ref+' (press '+P.length+', ground '+G.length+')');
 const at=S=>{const o=[];for(let i=0;i+S.length<=V.length;i++)if(S.every((w,k)=>V[i+k]===w))o.push([i,i+S.length-1]);return o;};const pa=at(P),ga=at(G);
 if(!pa.length)return no('"'+d.p+'" is not a run of words of '+ref);if(!ga.length)return no('"'+d.g+'" is not a run of words of '+ref);
 const has=(hay,S)=>(' '+f(hay)+' ').includes(' '+S.join(' ')+' ');
 const mm=L0.match(/MEANS\\s*:\\s*([\\s\\S]*?)(?:\\s(?:--|\\u2014)\\s*ANSWER\\s*:|$)/i);const MEANS=mm?mm[1]:'';
 const R=(ctx&&ctx.R)||{};const other=am[4].toUpperCase().startsWith('C')?'DR':'CR';const rk=Object.keys(R).filter(k=>k.toUpperCase().startsWith(other)&&typeof R[k]==='string');
 if(!(has(MEANS,P)||rk.some(k=>has(R[k],P))))return no('"'+d.p+'" stands neither in the ANSWER CHECK\\'s MEANS nor in a ['+other+'n] round');
 const cw=s=>new Set(f(s).split(' ').filter(w=>w.length>=4));const mw=cw(MEANS);if(!P.some(w=>w.length>=4&&mw.has(w)))return no('"'+d.p+'" shares no word with the press MEANS, so it is not shown to be what the press holds');
 const at2=L1.toUpperCase().search(/LINK BROKEN/);const tail=at2>=0?L1.slice(at2):L1;const qs=[...tail.matchAll(/["\\u201c]([^"\\u201c\\u201d]{6,})["\\u201d]/g)].map(m=>m[1]);
 if(!qs.some(q=>has(q,G)))return no('"'+d.g+'" is not inside a quotation of the collision line');
 if(pa.some(a=>ga.some(b=>a[0]<=b[1]&&b[0]<=a[1])))return no('the two spans overlap in '+ref+', so the press and the ground read the same words');
 const gq=[];for(const q of qs)for(const part of q.split(/\\.\\.\\.|\\u2026/)){const W=f(part).split(' ').filter(Boolean);if(W.length>=3)at(W).forEach(r=>gq.push(r));} /* every run of V the collision line quotes */
 if(pa.some(a=>gq.some(b=>a[0]<=b[1]&&b[0]<=a[1])))return no('"'+d.p+'" overlaps words of '+ref+' that the collision line itself quotes, so the press and the ground read the same words');
 return {ok:true,why:'DIFFERENT POINT accepted (pkgDPT, W3 2832): the press holds "'+d.p+'" and the ground uses "'+d.g+'", two separate runs of '+ref};}
`;
const R1=["  if(cured&&kby.has(x.gid)){","  {const __d=__dpt[x.gid];if(__d&&x.src==='E-GATE B'&&x.kind==='CONTRADICTION'){const __r=dptCheck(x,__d,ctx);if(DPT_STATUS==='LIVE'){if(!cured){cured=__r.ok;why=__r.why;}}else why=String(why||'')+' [pkgDPT TRIAL, record-only: '+(__r.ok?'would cure: ':'would not cure: ')+__r.why+']';}} /* pkgDPT (W3 2832) */\n  if(cured&&kby.has(x.gid)){"];
const R2=["function gateCure2024(seat,raw,F,its,G,reply,ctx){const A=gateRead2024(reply||'');","function gateCure2024(seat,raw,F,its,G,reply,ctx){const A=gateRead2024(reply||'');const __dpt=dptRead(reply||''); /* pkgDPT */"];
const P1=["  +'\\n\\nThis reply is not a judgment and is not JSON","  +(G.items.some(x=>x.src==='E-GATE B')?'\\n\\nAn E-GATE B item (ANSWER GROUND) may instead be answered DIFFERENT POINT, when the press and your ground use different words of the verse: give the words of the verse the press holds and the words of the verse your ground uses. It is cured only when each is 4 words or more of that verse in the 1611 KJV, word for word, the first stands in the press (its MEANS or its round\\'s quotation of the verse) and shares a word with the press MEANS, the second stands in a quotation of your collision line, and the first overlaps neither the second nor any words of that verse your collision line quotes. If they overlap, the press and your ground read the same words: CHANGE one of the two lines.':'') /* pkgDPT (W3 2832) */\n  +'\\n\\nThis reply is not a judgment and is not JSON"];
const P2=["GATE: <item id> || CHANGE TO: <your corrected line> || <one sentence quoting the words that decide it>';","GATE: <item id> || CHANGE TO: <your corrected line> || <one sentence quoting the words that decide it>'+(G.items.some(x=>x.src==='E-GATE B')?'\\nGATE: <item id> || DIFFERENT POINT: the press holds \"<words of the verse>\"; my ground uses \"<other words of the verse>\" || <one sentence>':'');"];
const rep=(s,[a,b],f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
const BASE=ON?OUT+'_base':OUT.replace(/patched[^/]*$/,'base');fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(BASE,{recursive:true});const plan={base:FB+(ON?' + '+ON:''),status:ST,nodes:[]};
for(const n of NS){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string'||!s0.includes('function gateCure2024('))continue;const ed=['lib','read','cure'];
 let s=rep(s0,R2,n.name+' read');s=rep(s,R1,n.name+' cure');s=rep(s,['function gateCure2024(',LIB+'function gateCure2024('],n.name+' lib');
 if(s.includes("This reply is not a judgment and is not JSON")){s=rep(s,P1,n.name+' prompt');s=rep(s,P2,n.name+' form');ed.push('prompt','form');}
 new Function('$','$input','$json','$execution','$workflow',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync(BASE+'/'+f,s0);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name:n.name,file:f,base_sha:sha(s0),final_sha:sha(s),edits:ed});console.log(n.name.padEnd(28),sha(s0),'->',sha(s),ed.join(','));}
fs.writeFileSync(OUT+'/../plan_'+OUT.split('/').pop()+'.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes, status',ST);
