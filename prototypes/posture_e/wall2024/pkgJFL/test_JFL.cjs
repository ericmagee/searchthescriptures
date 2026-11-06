// pkgJFL node test. Run from wall2024/: node pkgJFL/test_JFL.cjs   (reads the repo only)
//  A. Init Seats (whole node, mocked inputs): no move = base result; a moved seat leaves the panel, is not the reserve, stays an alternate.
//  B. The block helper: Panel Build's prefix, Reserve and Alternate's strip-and-add, nothing when a seat has no block.
//  C. The block never adds a round header: cureRounds / ciRounds read the same rounds with and without it.
//  D. Each patched node differs from its base only by the planned edits, and compiles.
const fs=require('fs');const P='pkgJFL/patched/',B='pkgJFL/base/',BAR='pkgBAR/patched/';let ok=0,bad=0;
const t=(name,c)=>{if(c){ok++;console.log('OK  ',name);}else{bad++;console.log('FAIL',name);}};
// ---- A ----
const runInit=(code,moved)=>{const custom={};const exe={id:'99999',customData:{set:(k,v)=>custom[k]=v}};
 const seats=['gemini','chatgpt','qwen','sol','grok','deepseek'].map(s=>({seat:s,placed:true,status:'ACCEPTED'}));
 const body={topic:'T',defender:{engine:'mimo',profile:'oracle'},challenger:{engine:'claude',profile:'plain'}};
 const rows=['gemini','chatgpt','qwen','sol','grok'].map(s=>({seat:s,api_model:'m/'+s,jfl_move:moved.includes(s)}));
 const $=n=>{if(n==='Accept Models')return{all:()=>rows.map(r=>({json:r}))};throw new Error('no node '+n);};
 const $input={first:()=>({json:{acc:{seats},src:{body}}})};
 return new Function('$','$input','$json','$execution',code)($,$input,{}, exe)[0].json;};
const I0=fs.readFileSync(B+'Init_Seats.js','utf8'),I1=fs.readFileSync(P+'Init_Seats.js','utf8');
const r0=runInit(I0,[]),r1=runInit(I1,[]);
t('A1 no move: panel, reserve, alternates as base ('+r0.panel_order+' | '+r0.panel_reserve+' | '+r0.alt_order+')',JSON.stringify([r0.panel_order,r0.panel_reserve,r0.alt_order])===JSON.stringify([r1.panel_order,r1.panel_reserve,r1.alt_order])&&r1.jfl_moved.length===0);
const mv=r0.panel_order[0];const r2=runInit(I1,[mv]);
t('A2 '+mv+' moved: not on the panel ('+r2.panel_order+')',r2.panel_order.indexOf(mv)<0&&r2.panel_order.length===3);
t('A3 '+mv+' moved: not the reserve ('+r2.panel_reserve+')',r2.panel_reserve!==mv);
t('A4 jfl_moved reports it',JSON.stringify(r2.jfl_moved)===JSON.stringify([mv]));
const oa=r0.panel_order.find(s=>s==='sol'||s==='chatgpt'||s==='grok');
if(oa){const r3=runInit(I1,[oa]);t('A5 '+oa+' (openrouter) moved: in the alternate pool ('+r3.alt_order+')',r3.alt_order.indexOf(oa)>=0&&r3.panel_order.indexOf(oa)<0);}
// ---- B ----
const PB=fs.readFileSync(P+'Panel_Build.js','utf8');const h0=PB.indexOf('/* pkgJFL');const h1=PB.indexOf('const judges=RS.judges.map(j0=>{');const H=PB.slice(h0,h1);
const BLK=fs.readFileSync('pkgJFL/fixture_block_sol.txt','utf8');
const mk=rows=>new Function('$',H+'return {__JFL,__JFLX};')(n=>{if(n==='Fetch Models')return{all:()=>rows.map(r=>({json:r}))};throw new Error(n);});
const F=mk([{seat:'sol',jfl_block:BLK},{seat:'gemini',jfl_block:null},{seat:'grok',jfl_block:BLK.replace(/gpt-6\.1-sol/g,'grok-4.7')}]);
const T0='DEBATE TRANSCRIPT\n\n=== [DR1] ===\nx';
t('B1 Panel: sol gets its block first',(F.__JFL('sol')+T0).startsWith('[[JUDGE FAULT LEDGER]]')&&(F.__JFL('sol')+T0).endsWith(T0));
t('B2 Panel: gemini (no block) gets the plain transcript',F.__JFL('gemini')+T0===T0&&F.__JFL('nosuch')==='');
t('B3 Reserve/Alternate: sol\'s turn copied to gemini loses sol\'s block',F.__JFLX(BLK+T0,'gemini')===T0);
t('B4 Reserve/Alternate: sol\'s turn copied to grok carries grok\'s block only',F.__JFLX(BLK+T0,'grok')===BLK.replace(/gpt-6\.1-sol/g,'grok-4.7')+T0);
t('B5 Fetch Models unreadable: no block, no throw',new Function('$',H+'return __JFLX("u","sol");')(()=>{throw new Error('x');})==='u');
t('B6 Panel Build user turn is built with the block',PB.includes("const user=__JFL(j.seat)+'DEBATE TRANSCRIPT\\n\\n'+T;"));
const RB=fs.readFileSync(P+'Reserve_Build.js','utf8'),AB=fs.readFileSync(P+'Alternate_Build.js','utf8');
t('B7 Reserve swaps the block after it reads the slot\'s turn',RB.indexOf('user=__JFLX(user,RS.reserve.seat);')>RB.indexOf("user=__tx(b0.messages[b0.messages.length-1].content);"));
t('B8 Alternate swaps the block after it reads the slot\'s turn',AB.indexOf('used.push(a.api_model);user=__JFLX(user,a.seat);')>AB.indexOf("user=__tx(b0.messages[b0.messages.length-1].content);"));
// ---- C ----
const CR=/^(?:===[ \t]+)?\[(CR1|DR1|CR2|DR2|CR3|DR3|CR4|DR4)(?:\]|[ \t]--[^\n]*\])(?:[^\n]*===)?[ \t]*$/gm,CI=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;
const heads=(re,s)=>[...s.matchAll(re)].map(m=>m[1]+'@'+(m.index));
t('C1 the block holds no cureRounds header line',heads(CR,BLK).length===0);
t('C2 the block holds no ciRounds header line',heads(CI,BLK).length===0);
t('C3 no block line starts with "["CR/DR',!BLK.split('\n').some(l=>/^\s*(?:===\s*)?\[(?:CR|DR)\d/.test(l)));
// ---- D ----
const dl=(a,b)=>{const A=a.split('\n'),Bb=b.split('\n');let i=0;while(i<A.length&&A[i]===Bb[i])i++;let j=0;while(j<A.length-i&&A[A.length-1-j]===Bb[Bb.length-1-j])j++;return {base:A.slice(i,A.length-j).join('\n'),patched:Bb.slice(i,Bb.length-j).join('\n')};};
const strip=s=>s.split(H).join('').replace("const user=__JFL(j.seat)+'DEBATE","const user='DEBATE").replace('user=__JFLX(user,RS.reserve.seat);\n','').replace('used.push(a.api_model);user=__JFLX(user,a.seat);','used.push(a.api_model);');
for(const f of ['Panel_Build.js','Reserve_Build.js','Alternate_Build.js'])t('D1 '+f+' = pkgBAR/patched + the block edits only',strip(fs.readFileSync(P+f,'utf8'))===fs.readFileSync(BAR+f,'utf8'));
const Hi=I1.slice(I1.indexOf('/* pkgJFL'),I1.indexOf('const pfree0='));
const si=I1.replace(Hi,'').replace('const pfree0=free.filter(s=>NOT_PANEL.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0));const pfree=pfree0.filter(s=>!JFL_MOVED.has(s)).concat(pfree0.filter(s=>JFL_MOVED.has(s)));','const pfree=free.filter(s=>NOT_PANEL.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0));').replace('&&!JFL_MOVED.has(pfree[3])','').replace('jfl_moved:[...JFL_MOVED],','');
t('D2 Init_Seats.js = base + the 3 edits only',si===I0);
for(const f of ['Panel_Build.js','Reserve_Build.js','Alternate_Build.js','Init_Seats.js']){let c=true;try{new Function('$','$input','$json','$execution',fs.readFileSync(P+f,'utf8'));}catch(e){c=false;}t('D3 '+f+' compiles',c);}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
