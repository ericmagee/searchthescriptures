// pkgEANS test. Run from wall2024/: node pkgEANS/test_EANS.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const X=require('../pkgALT/sol_ctx.cjs');
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const old=JSON.parse(rd('pkgALT/base_nodes_68fe.json'))['Judge Enforcer Build'].parameters.jsCode;const neu=rd('pkgEANS/patched/Judge_Enforcer_Build.js');
const oldAlt=rd('pkgALT/patched/Alt_Judge_Enforcer_Build.js');const neuAlt=rd('pkgEANS/patched/Alt_Judge_Enforcer_Build.js');
// the clone stays the clone: the same edit on both
const NJ=JSON.parse(rd('pkgALT/nodes_ALT.json'));const MAP=NJ.substitutions.names,LIT=NJ.substitutions.literals;const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const names=[...new Set(Object.keys(MAP).concat(Object.values(MAP)))].sort((a,b)=>b.length-a.length);
const mask=t=>{let s=String(t);for(const [a,b] of LIT){s=s.split(a).join('<LIT>').split(b).join('<LIT>');}return s.replace(new RegExp('([\'"])('+names.map(esc).join('|')+')\\1','g'),'$1<NODE>$1');};
T('Alt Judge Enforcer Build is still the clone of Judge Enforcer Build under the mask',mask(neuAlt)===mask(neu));
T('only the E-ANS reader changed (4 edits)',neu.length>old.length&&old.split('\n').length===neu.split('\n').length-1);
// run a Judge Enforcer Build on given judge texts; returns its E-ANS items
const R0=(()=>{const AM=rd('pkgTG/patched/Alternate_Merge.js');const lib=AM.slice(0,AM.indexOf("let PP=$('Panel Cure Check')"));return new Function('$','$input',lib+'\nreturn ciRounds;')(()=>{throw 0;},null)(X.ptext(X.solReq));})();
const FO={cr1:R0.CR1,cr2:R0.CR2,cr3:R0.CR3,cr4:R0.CR4,gr1:R0.DR1,gr2:R0.DR2,dr3:R0.DR3,dr4:R0.DR4,synthesis:''};
function je(code,bodies,R){const N={'Panel Cure Check':{first:()=>({json:{bodies}})},'Init Seats':{first:()=>({json:{run_token:'t'}})},'Resolve Seats':{first:()=>({json:{deepseek:{api_model:'d'}}})},
 'Regrade Load':{isExecuted:false},'Final Output':{first:()=>({json:R})},'Alt Seated':{isExecuted:true,first:()=>({json:{bodies,f:R}})}};
 const $=n=>N[n]||{isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};
 const out=new Function('$','$input',code)($,{first:()=>({json:{}})});return out.flatMap(o=>(o.json.items||[]).length?o.json:[]).length?out:out;}
const items=(out)=>out.flatMap(o=>{const j=o.json;return j.ids||[];});const texts=out=>out.map(o=>o.json.msgs||o.json.body&&JSON.stringify(o.json.body)||'').join('\n');
const body=(seat,raw)=>JSON.stringify({payload:{judge_seat:seat,verdict_raw:raw}});
// 1. 32980 sol through the clone: the Romans 1:3 line is now read
{const o=je(oldAlt,[X.solBody],FO),n=je(neuAlt,[X.solBody],FO);const ro=items(o).filter(x=>/^ANSWER CHECK '?Romans 1:3/.test(x.item)||/^ANSWER CHECK Romans 1:3/.test(x.item)),rn=items(n).filter(x=>/^ANSWER CHECK Romans 1:3/.test(x.item));
 T('32980 sol: before, no Romans 1:3 E-ANS item; after, one item [CR3; CR4]',ro.length===0&&rn.length===1&&rn[0].item==='ANSWER CHECK Romans 1:3 [CR3; CR4]',JSON.stringify(rn.map(x=>x.item)));
 const tx=JSON.stringify(n.map(x=>x.json));const m=tx.match(/E-ANS; the answering side wrote this in \[CR3; CR4\][^)]*\)/);
 T('the item tells the enforcer where the answer stands, after looking in both listed rounds',!!m,m&&m[0]);console.log('   '+(m?m[0]:'(not found)'));
 T('sol: every other item is unchanged (old items are a subset of new)',items(o).every(a=>items(n).some(b=>b.item===a.item&&b.flagged_line===a.flagged_line)));}
// 2. every panel and alternate seat on the stored runs: lines the old reader skipped
const seats=[];const B80=JSON.parse(rd('pkgSBP/fixture_bodies_32980.json'));B80.forEach(b=>seats.push(['32980',b.seat,b.verdict_raw]));
const c80=JSON.parse(rd('pkgR2/fixture_32980_chatgpt.json'));seats.push(['32980',c80.seat,c80.verdict_raw]);
JSON.parse(rd('pkgAPPLY/fixture_bodies.json')).forEach(b=>seats.push([b.run,b.seat,b.verdict_raw]));
JSON.parse(rd('pkgR/fixture_32949_judgments.json')).forEach(b=>{if(!seats.some(s=>s[0]==='32949'&&s[1]===b.seat))seats.push(['32949',b.seat,typeof b.v==='string'?b.v:JSON.stringify(b.v)]);});
let gained=0,still=0;
for(const [run,seat,raw] of seats){const o=je(old,[body(seat,raw)],FO),n=je(neu,[body(seat,raw)],FO);const io=items(o).filter(x=>x.rule==='E-ANS'),inw=items(n).filter(x=>x.rule==='E-ANS');
 const g=inw.filter(b=>!io.some(a=>a.flagged_line===b.flagged_line));gained+=g.length;
 const t=String(raw).replace(/\\n/g,'\n').replace(/\\"/g,'"'); /* as Judge Enforcer Build's textOf */const all=t.split('\n').map(l=>l.replace(/^[\s*\-•]+/,'')).filter(l=>/^ANSWER CHECK:/.test(l));
 const unread=all.filter(l=>!inw.some(x=>x.flagged_line===l.slice(0,1500))&&!/MEANS:\s*NONE\b/i.test(l));still+=unread.length;const why=l=>/MEANS:\s*'/.test(l)?'single-quoted MEANS':/ANSWER:\s*NONE/.test(l)?'ANSWER: NONE':/\[(?:CR|DR)[1-4]\s*[;,]/.test(l)?'round list':/--\s*(?:MEETS|MISSES)\b/.test(l)?'other':'no MEETS or MISSES grade';const byw={};unread.forEach(l=>{const k=why(l);byw[k]=(byw[k]||0)+1;});
 console.log('   '+run+' '+seat+': ANSWER CHECK lines '+all.length+'; E-ANS before '+io.length+', after '+inw.length+(g.length?'; now read: '+g.map(x=>x.item).join(' | '):'')+(unread.length?'; still unread '+unread.length+' '+JSON.stringify(byw)+(byw.other?': '+unread.filter(l=>why(l)==='other').map(l=>l.slice(0,160)).join(' | '):''):''));}
T('the new reader only adds items: no seat loses an E-ANS item',seats.every(([r,s,raw])=>{const o=items(je(old,[body(s,raw)],FO)),n=items(je(neu,[body(s,raw)],FO));return o.every(a=>n.some(b=>b.flagged_line===a.flagged_line&&b.rule===a.rule));}));
console.log('   lines newly read: '+gained+'; lines still unread (other forms, listed above): '+still);
console.log(ok+' OK '+bad+' FAIL');process.exitCode=bad?1:0;
