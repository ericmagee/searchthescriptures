// ASK 626 tests (W4). node t626.cjs base_eng.json target_engine_626.json r42373.json [stored_rounds.json]
// Nothing is fetched and nothing is written. Every reader is run from the workflow text itself (old = base, new = target).
const fs=require('fs');const G=require('/mnt/project-files/standing/tools/gatefn.cjs');const lib=require('/mnt/project-files/standing/lib.cjs');
const [,,BE,TE,FX,ST]=process.argv;const B=lib.load(BE),T=lib.load(TE);const r=JSON.parse(fs.readFileSync(FX,'utf8'));
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};
const R0={CR1:r.cr1,DR1:r.gr1,CR2:r.cr2,DR2:r.gr2,CR3:r.cr3,DR3:r.dr3,CR4:r.cr4,DR4:r.dr4};
const CHH=/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi,DFH=/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi;
const lastAt=(t,re)=>{let i=-1;for(const m of String(t).matchAll(re))i=m.index;return i;};
// ---- fixtures: the 42373 challenger list (bold "**k.**") rewritten into every head form of plan (a)
const cr3=r.cr3;const at=lastAt(cr3,CHH);const pre=cr3.slice(0,at),lst=cr3.slice(at);
const form=f=>pre+lst.replace(/^\*\*(\d+)\.\*\* /gm,(m,k)=>f(k));
const FORMS={bold:x=>'**'+x+'.** ',plain:x=>x+'. ',paren:x=>x+') ',h3:x=>'### '+x+'. ',h4bold:x=>'#### **'+x+'.** ',boldopen:x=>'**'+x+'. ',numbold:x=>x+'. **'};
const FX6=Object.fromEntries(Object.entries(FORMS).map(([k,f])=>[k,form(f)]));
const UNREAD=pre+lst.replace(/^\*\*(\d+)\.\*\* /gm,(m,k)=>'Premise '+['one','two','three','four','five','six'][k-1]+' -- ');
const EMPTY=pre+"# CHALLENGER'S UNSUPPORTED-L4 PREMISES\n\nPREMISE COUNT: 0\n";const NOHEAD=pre;
ok(Object.values(FX6).every(t=>t!==cr3||true)&&(lst.match(/^\*\*\d+\.\*\* /gm)||[]).length===6,'fixture: the 42373 [CR3] list carries six "**k.**" heads');
// ---- statement-level readers: the exact line from each node / Library line, old and new
const nodeLine=(W,n,re)=>{const c=lib.code(W,n).split('\n');const h=c.filter(l=>re.test(l));if(h.length!==1)throw new Error(n+': '+h.length+' lines for '+re);return h[0];};
const libLine=(W,i)=>lib.cut(W).L[i];
const mkItems=src=>{src=src.trim().replace(/\s*\/\* ASK 626 \*\/$/,'');if(/^const items=/.test(src))return new Function('return ('+src.replace(/^const items=/,'').replace(/;\s*$/,'')+')')();const s=src.replace(/const out=\[\];.*$/,'').replace(/ \/\* ASK 626 \*\/$/,'');return new Function('t','i',s+';return its;');};
const SITES=[['D3 Build',/^\s*const items=t=>/],['D4 Build',/^\s*const items=t=>/],['Panel Build',/^\s*const items=t=>String\(t\|\|''\)\.split\(\/\\n\(\?=\\s\*/],['Build Independent Verdict',/^\s*const items=t=>String\(t\|\|''\)\.split\(\/\\n\(\?=\\s\*/],['Build Save Body',/^\s*const its=t\.slice\(i\)\.split/],['Assume Check Build',/^\s*const its=t\.slice\(i\)\.split/],['C3 Build',/^\s*const items=t=>/],['C3 Build',/^\s*const its=t\.slice\(i\)\.split/],['C3 Extract',/^\s*const its=t\.slice\(i\)\.split/],['C4 Build',/^\s*const items=t=>/]];
const LIBS=[[998,'pwList/kvCharges/kvUni items'],[1672,'gate PL items'],[2035,'premiseMap/pressed items'],[2550,'send-back ledger items'],[437,'unxPresses items'],[3716,'OAN harvest items']];
const run=(f,t)=>{const i=lastAt(t,CHH);return i<0?null:(f.length===1?f(t.slice(i)):f(t,i));};
const readers=[];for(const [n,re] of SITES)readers.push([n,mkItems(nodeLine(B,n,re)),mkItems(nodeLine(T,n,re))]);
for(const [i,w] of LIBS){const o=libLine(B,i).trim(),nw=libLine(T,i).trim();const s=x=>x.replace(/^const its=i<0\?\[\]:/,'const its=');readers.push(['LIB '+i+' ('+w+')',mkItems(s(o)),mkItems(s(nw))]);}
for(const [n,o,nw] of readers){const a=run(o,cr3),b=run(nw,cr3);ok(a.length===0&&b.length===6,'C2 '+n+': live reads '+a.length+' premises of the 42373 [CR3] list, new reads '+b.length);
 for(const [k,t] of Object.entries(FX6)){const y=run(nw,t);ok(y.length===6&&y.every((x,j)=>new RegExp('^\\s*(?:#+\\s*)?\\**\\s*'+(j+1)+'[.)]').test(x)),'C2 '+n+': form '+k+' reads 6 premises in order');}
 ok(run(nw,UNREAD).length===0,'C4 '+n+': a list with no numbered head reads 0 (LIST NOT READ case)');}
// should-not-read lines
{const f=readers[0][2];const t="# CHALLENGER'S UNSUPPORTED-L4 PREMISES\n\n**1.** A premise.\nPRESSED WITH:\n- Luke 1:27 \"x\"\n1 Corinthians 15:38 \"to every seed\"\n- 1. Luke 2:4\n";ok(f(t).length===1,'C2 head: "1 Corinthians 15:38", "- Luke 1:27" and "- 1. Luke 2:4" are not read as premises');}
// ---- function-level: pwList, premiseMap, unxPresses (Library, MAP-built code), K-G10
const keyFor=(W,fn)=>Object.keys(lib.cut(W).M).find(k=>{try{return new RegExp('function '+fn+'\\(').test(lib.code(W,k));}catch(e){return false;}});
const F=(W,k,names)=>G(W,k,null,names);
{const k=keyFor(B,'drvPressWith');const o=F(B,k,['pwList','drvPressWith']),n=F(T,k,['pwList','drvPressWith']);
 const po=o.pwList(R0,'CHALLENGER'),pn=n.pwList(R0,'CHALLENGER');ok(po&&po.length===0&&pn&&pn.length===6,'C2 pwList ('+k+'): CHALLENGER live '+(po&&po.length)+', new '+(pn&&pn.length));
 const k5=[...(pn[4].keys||[])],k6=[...(pn[5].keys||[])];ok(k5.some(x=>/Hebrews 7:14/.test(x))&&k5.some(x=>/Hebrews 7:5/.test(x))&&k6.some(x=>/Ruth 4:13/.test(x)),'C2 premise 5 carries Hebrews 7:14 and 7:5 ('+k5.join(', ')+'); premise 6 carries Ruth 4:13 ('+k6.join(', ')+')');
 const dn=n.pwList(R0,'DEFENDER'),do0=o.pwList(R0,'DEFENDER');ok(JSON.stringify(dn)===JSON.stringify(do0),'C3 pwList DEFENDER (the [DR2] list, "1." heads) is byte-equal');
 ok(n.pwList({...R0,CR3:UNREAD},'CHALLENGER')===null&&Array.isArray(o.pwList({...R0,CR3:UNREAD},'CHALLENGER')),'C4 pwList: heading with an unreadable list gives null (no list to the K checks); live gave []');
 ok(Array.isArray(n.pwList({...R0,CR3:EMPTY},'CHALLENGER'))&&n.pwList({...R0,CR3:EMPTY},'CHALLENGER').length===0,'C4 pwList: "PREMISE COUNT: 0" stays an empty list ([]), not LIST NOT READ');
 ok(n.pwList({...R0,CR3:NOHEAD},'CHALLENGER')===null,'C4 pwList: no heading stays null');
 const J=JSON.parse(fs.readFileSync(__dirname+'/../../../ask624/w4/b1/fx/j42373.json','utf8'));const pt=Object.entries(R0).map(([k,v])=>'=== ['+k+'] '+k+' ===\n'+v).join('\n\n');
 const kg=(f,R,txt)=>{const p=Object.entries(R).map(([k,v])=>'=== ['+k+'] '+k+' ===\n'+v).join('\n\n');const x=f.drvPressWith(txt,p,2,2,'PROP-DEPENDENT','PROP-DEPENDENT',null);return x.items.filter(y=>y.side==='CHALLENGER'&&(y.rule==='K-G10'||y.rule==='K-P'));};
 let lo=0,ln=0,lu=0,hit=[];for(const j of J){const a=kg(o,R0,j.verdict_raw),b=kg(n,R0,j.verdict_raw),c=kg(n,{...R0,CR3:UNREAD},j.verdict_raw);lo+=a.length;ln+=b.length;lu+=c.length;a.forEach(x=>hit.push(j.judge_seat+' '+x.link+' '+x.verses.join('/')));}
 ok(lo>0,'C2 live K-G10/K-P on the 42373 judgments, CHALLENGER: '+lo+' ('+hit.join('; ')+')');ok(ln===0,'C2 new K-G10/K-P on the same judgments, CHALLENGER: '+ln);ok(lu===0,'C4 LIST NOT READ: no K-G10/K-P item on that side ('+lu+')');}
{const k=keyFor(B,'premiseMap');const o=F(B,k,['premiseMap']),n=F(T,k,['premiseMap']);if(typeof o.premiseMap!=='function')console.log('NOTE premiseMap is inside a module in '+k+'; its item line (LIB 2035) is tested above');else ok(JSON.stringify(o.premiseMap(r.gr2))===JSON.stringify(n.premiseMap(r.gr2)),'C3 premiseMap ('+k+') on the 42373 [DR2] list is byte-equal');}
{const k=keyFor(B,'unxPresses');const o=F(B,k,['unxPresses']),n=F(T,k,['unxPresses']);if(typeof o.unxPresses!=='function')console.log('NOTE unxPresses not top-level in '+k);else{const a=o.unxPresses(cr3),b=n.unxPresses(cr3);ok(b.length>a.length,'C2 unxPresses ('+k+') on 42373 [CR3]: live '+a.length+' presses, new '+b.length);ok(JSON.stringify(o.unxPresses(r.dr3))===JSON.stringify(n.unxPresses(r.dr3)),'C3 unxPresses on [DR3] byte-equal');}}
// ---- listCount and the FORFEITED / LIST NOT READ lines (Build Save Body, Format Markdown)
for(const n of ['Build Save Body','Format Markdown']){const lc=W=>{const c=lib.code(W,n).split('\n');const i=c.findIndex(l=>/^const listCount=/.test(l));const j=c.findIndex((l,k)=>k>i&&/if\(vsCh\.n===0\)/.test(l));const body=c.slice(i,j+1).join('\n');return new Function('d0','const r={engine_r2:d0.gr2,engine_r3:d0.cr3};'+(/const d=/.test(body)?'':'const d=d0;')+'return (()=>{'+body+'\nreturn {vsDef,vsCh,FF};})()');};
 const o=lc(B),w=lc(T);const a=o({gr2:r.gr2,cr3}),b=w({gr2:r.gr2,cr3});
 ok(a.FF.some(x=>/forfeit/i.test(x))&&!b.FF.length&&b.vsCh.n===6,n+' C2: live writes '+a.FF.length+' FORFEITED line(s); new writes none (vsCh.n='+b.vsCh.n+')');
 const u=w({gr2:r.gr2,cr3:UNREAD});ok(u.FF.length===1&&u.FF[0]==='LIST NOT READ: DEFENDER -- the heading is present but the system read no premise under it; grade the list from the round text','C4 '+n+': unreadable list gives the LIST NOT READ line');
 ok(/FORFEITED|forfeited/.test(w({gr2:r.gr2,cr3:NOHEAD}).FF.join(''))&&/FORFEITED|forfeited/.test(w({gr2:r.gr2,cr3:EMPTY}).FF.join('')),'C4 '+n+': no heading, and PREMISE COUNT: 0, still give the forfeit line');
 ok(JSON.stringify(o({gr2:r.gr2,cr3:FX6.plain}))===JSON.stringify(w({gr2:r.gr2,cr3:FX6.plain})).replace(/,"unread":false/g,''),'C3 '+n+': a "1." list gives the same counts and lines');
 for(const [k,t] of Object.entries(FX6))ok(w({gr2:r.gr2,cr3:t}).vsCh.n===6,'C2 '+n+' listCount form '+k+' = 6');}
// ---- judges' ledger line (sideLines), lnr626, preCheckSide
for(const n of ['Panel Build','Build Independent Verdict']){const c=lib.code(T,n);const a=c.indexOf('const sideLines='),b=c.indexOf('const judgeBlock=',a);const sl=new Function('const citedLine=()=>"";'+c.slice(a,b)+';return sideLines;')();
 const x=sl({list:true,premises:[],unread:true},'AGAINST THE CHALLENGER, answered in [DR1], [DR2] or [DR3]'),y=sl({list:true,premises:[],unread:true},'AGAINST THE DEFENDER, answered in [CR2], [CR3] or [CR4]');
 ok(x.length===1&&/: LIST NOT READ: DEFENDER -- the heading is present/.test(x[0])&&/: LIST NOT READ: CHALLENGER --/.test(y[0]),'C4 '+n+' ledger: an unread list gives one LIST NOT READ line naming the side that wrote it, never an empty side');
 const lnr=new Function(c.match(/const lnr626=s=>\{.*?\};/)[0]+';return lnr626;')();const tl=t=>t.slice(lastAt(t,CHH));
 ok(lnr(tl(UNREAD))&&!lnr(tl(EMPTY))&&!lnr("# CHALLENGER'S UNSUPPORTED-L4 PREMISES\n\nnone\n"),'C4 '+n+' lnr626: text under the heading is unread; PREMISE COUNT: 0 and "none" are empty');
 ok(/return \{list:true,premises,unread:!premises\.length&&lnr626\(list\)\};\};/.test(c),'C4 '+n+' ledger side() carries unread');
 const pc=W=>{const s=lib.code(W,n);const a=s.indexOf('function preCheckSide(');const e=s.indexOf('\nfunction ',a+10);return new Function(s.slice(a,e)+';return preCheckSide;')();};
 const po=pc(B),pn=pc(T);let same=true;for(const k of ['bold','plain','h3','h4bold'])if(JSON.stringify(pn(FX6[k],[r.dr3],'CHALLENGER'))!==JSON.stringify(pn(FX6.plain,[r.dr3],'CHALLENGER')))same=false;
 ok(JSON.stringify(po(FX6.plain,[r.dr3],'CHALLENGER'))===JSON.stringify(pn(FX6.plain,[r.dr3],'CHALLENGER')),'C3 '+n+' preCheckSide: a "1." list gives the same lines');
 ok(same,'C2 '+n+' preCheckSide: bold, "### 1." and "#### **1.**" lists give the same lines as the "1." list');}
// ---- Assume Check Build: vp4All, vp4List, vp525R2
{const ac=W=>{const c=lib.code(W,'Assume Check Build').split('\n');const a=c.findIndex(l=>/^const VP4_STOP=|^\s*const VP4_STOP=/.test(l));let e=24;while(e<c.length&&/^\s/.test(c[e]))e++;const s=c.slice(2,12).concat(c.slice(18,e)).join('\n');return new Function(s+';return {vp4All,vp4List,vp525R2};')();};
 let o,n;try{o=ac(B);n=ac(T);}catch(e){ok(false,'Assume Check Build: load '+e.message);}
 if(o){const g=t=>t.replace(/CHALLENGER'S UNSUPPORTED/,'UNSUPPORTED');ok(o.vp4All(g(cr3)).length===0&&n.vp4All(g(cr3)).length===6,'C2 Assume Check vp4All: live '+o.vp4All(g(cr3)).length+', new '+n.vp4All(g(cr3)).length);
  for(const [k,t] of Object.entries(FX6))ok(n.vp4All(g(t)).length===6&&n.vp4List(g(t),'CHALLENGER').length===n.vp4List(g(FX6.plain),'CHALLENGER').length,'C2 Assume Check form '+k+': vp4All 6, vp4List as for "1."');
  ok(JSON.stringify(o.vp4All(r.gr2))===JSON.stringify(n.vp4All(r.gr2))&&JSON.stringify(o.vp4List(r.gr2,'DEFENDER'))===JSON.stringify(n.vp4List(r.gr2,'DEFENDER'))&&JSON.stringify(o.vp525R2(r.gr2,cr3))===JSON.stringify(n.vp525R2(r.gr2,FX6.plain)),'C3 Assume Check on the 42373 [DR2] list: byte-equal');}}
// ---- __LC423 (C2B, D3B, C3B Extract)
for(const nn of ['C2B Extract','D3B Extract','C3B Extract']){const o=G(B,nn,null,['__LC423']).__LC423,n=G(T,nn,null,['__LC423']).__LC423;ok(o(cr3)===null&&n(cr3)===6&&Object.values(FX6).every(t=>n(t)===6)&&o(FX6.plain)===n(FX6.plain),'C2/C3 '+nn+' __LC423: live '+o(cr3)+', new '+n(cr3)+'; every form 6; "1." unchanged');}
// ---- C3 stored rounds (all runs): every list the live readers read, the new read byte-equal
if(ST){const S=JSON.parse(fs.readFileSync(ST,'utf8'));let n=0,eq=0,newly=[],diff=[];
 for(const row of S)for(const [col,re] of [['engine_r2',DFH],['engine_r3',CHH]]){const t=row[col];if(!t)continue;const i=lastAt(t,re);if(i<0)continue;
  for(const [nm,o,w] of readers){const a=(o.length===1?o(t.slice(i)):o(t,i)),b=(w.length===1?w(t.slice(i)):w(t,i));n++;if(JSON.stringify(a)===JSON.stringify(b))eq++;else if(a.length===0&&b.length>0)newly.push(row.id+' '+col+' '+nm);else diff.push(row.id+' '+col+' '+nm+' '+a.length+'->'+b.length);}}
 ok(diff.length===0,'C3 stored rounds: '+S.length+' debates, '+n+' reader runs, '+eq+' byte-equal; newly read (live read 0): '+newly.length+'; changed: '+diff.length+(diff.length?' '+diff.slice(0,12).join('; '):''));
 if(newly.length)console.log('  newly read: '+[...new Set(newly.map(x=>x.split(' ').slice(0,2).join(' ')))].join(', '));}
console.log(fail?'RESULT: '+fail+' FAIL':'RESULT: ALL PASS');process.exit(fail?1:0);
