// ASK 578 re-cut 2 (W4, from W3's t578b.js draft 2): the 14 readers and Library Check carry an ASK 578 comment (ASK 599 rule 10; W1 F1 Wall 11842).
// ASK 578 prototype, draft 2 (W3). Method test only. Writes nothing to n8n. Draft 2: the readers are found on the base given, not assumed to be 13 (W1 D1, Wall 11144): after ASK 573 the child node R2 Alt Judge Enforcer Retry Build reads the library too.
// usage: node t578.js <engine.json> <child.json>   (needs acorn; set NODE_PATH)
const fs=require('fs'),crypto=require('crypto'),acorn=require('acorn');
const E=JSON.parse(fs.readFileSync(process.argv[2])),C=JSON.parse(fs.readFileSync(process.argv[3]));
const md=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);let ok=true,cnt=0;const say=(c,m)=>{cnt++;if(!c)ok=false;console.log((c?'PASS ':'FAIL ')+m);};
const node=(W,n)=>W.nodes.find(x=>x.name===n);const TE=node(E,'Shared Library').parameters.jsCode,TC=node(C,'Shared Library').parameters.jsCode;
const parts=T=>({L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))});
const reb=(P,k)=>P.M[k].p.map(e=>typeof e==='number'?P.L[e]:typeof e[0]==='string'?e[0]:P.L.slice(e[0],e[1]+1).join('\n')).join('\n');
const PE=parts(TE),PC=parts(TC);
// ---- A. the engine's text serves the child the same modules as the child's own copy does today
const OLD="$('Shared Library').params.jsCode",NEW="$('Alternate Pass In').first().json.pass.lib/* ASK 578: the engine library text, passed in the call */";
const stubs=C.nodes.filter(n=>n.parameters.jsCode&&n.name!=='Shared Library'&&!n.name.startsWith('Library Check')&&n.parameters.jsCode.includes(OLD));
const NAMED=['R2 Alternate Build','R2 Alternate Merge Seat','R2 Alt Judge Enforcer Build','R2 Alt Judge Enforcer Record','R2 Alt Send Back Build','R2 Alt Send Back Record','R2 Alt Gate Build','R2 Alt Gate Record','R2 Alt Late Gate Build','R2 Alternate Payloads','R2 Alternate Cure Build','R2 Alternate Cure Normalize','R2 Alternate Merge'];const RB='R2 Alt Judge Enforcer Retry Build';const rbReads=!!(node(C,RB)&&node(C,RB).parameters.jsCode.includes(OLD));const EXP=NAMED.concat(rbReads?[RB]:[]);const NR=EXP.length;
say(stubs.length===NR&&EXP.every(x=>stubs.some(s=>s.name===x)),'child readers of the library: '+stubs.length+' = the 13 named stubs'+(rbReads?' and '+RB+' (ASK 573 live on this base)':' ('+RB+' does not read the library on this base)'));
say(C.nodes.every(n=>n.name==='Shared Library'||stubs.some(s=>s.name===n.name)||n.name.startsWith('Library Check')||!JSON.stringify(n.parameters||{}).includes('Shared Library')),'no other child node names the Shared Library node anywhere in its parameters');
const keys=stubs.map(n=>{const m=n.parameters.jsCode.match(/\/\*END\*\/'\)\)\)\[("(?:[^"\\]|\\.)*")\]/);if(m)return JSON.parse(m[1]);const m2=n.parameters.jsCode.match(/\/\*END\*\/'\)\)\)\.([A-Za-z_$][\w$]*);/);return m2?m2[1]:null;});
say(keys.every(Boolean)&&new Set(keys).size===NR,'each reader asks for one key, '+NR+' different keys: '+keys.join(', '));
say(keys.every(k=>PE.M[k]&&PC.M[k]&&reb(PE,k)===reb(PC,k)&&reb(PE,k).length===PE.M[k].n&&PE.M[k].n===PC.M[k].n),'for all '+NR+' keys the engine library rebuilds the same text, of the same n, as the child library');
say(keys.every(k=>!reb(PE,k).includes('Shared Library')),'none of the '+NR+' served texts names the Shared Library node (so nothing inside them reads the child node)');
// ---- B. the child target
const C2=JSON.parse(JSON.stringify(C));C2.nodes=C2.nodes.filter(n=>n.name!=='Shared Library');
say(!C.connections['Shared Library']&&!JSON.stringify(C.connections).includes('"Shared Library"'),'the child Shared Library node has no connection in or out');
for(const n of C2.nodes){if(stubs.some(s=>s.name===n.name)){const s=n.parameters.jsCode;if(s.split(OLD).length!==2)say(false,n.name+': the read stands once');n.parameters.jsCode=s.replace(OLD,NEW);}}
const lcN=C2.nodes.find(n=>n.name.startsWith('Library Check'));const lsN=E.nodes.find(n=>n.name.startsWith('Library Sha'));
const xl=s=>s.match(/const __MAPEXTRA422=\[[^\]]*\];/)[0];
const oldTail=lcN.parameters.jsCode.slice(lcN.parameters.jsCode.indexOf('const __it=$input.all();'));
const newTail="/* ASK 578: the child has no Shared Library node; it checks the engine library text passed in the call, then drops it from pass */\nconst __it=$input.all();const __p=(__it[0]&&__it[0].json&&__it[0].json.pass)||{};const __eng=(typeof __p.lib_sha==='string'&&__p.lib_sha)?__p.lib_sha:null;const __engm=(typeof __p.map_sha==='string'&&__p.map_sha)?__p.map_sha:null;const __lc=(typeof __p.lib==='string'&&__p.lib)?__p.lib:null;\nif(!__lc)throw new Error('pkgLIB1: the call carries no library text (ASK 578)');const __own=__LIBSHA422(__lc),__ownm=__MAPSHA422(__lc,'engine');\nif(!__eng||!__own||__eng!==__own||!__engm||!__ownm||__engm!==__ownm)throw new Error('pkgLIB1: the library text received differs from the engine library, engine lib '+(__eng||'none')+' map '+(__engm||'none')+', received lib '+(__own||'none')+' map '+(__ownm||'none'));\nreturn __it.map((i,k)=>{const {lib:__x,...__rest}=i.json.pass;return {json:{...i.json,pass:__rest,lib422:{engine:__eng,child:__own,engine_map:__engm,child_map:__ownm,same:true}},pairedItem:{item:k}};});";
lcN.parameters.jsCode=lcN.parameters.jsCode.slice(0,lcN.parameters.jsCode.indexOf('const __it=$input.all();')).replace(xl(lcN.parameters.jsCode),xl(lsN.parameters.jsCode))+newTail;
say(oldTail.startsWith("const __it=$input.all();")&&oldTail.includes("__MAPSHA422(__lc,'child')"),'child Library Check: the tail replaced is the one read (md5 '+md(oldTail)+', '+oldTail.length+' characters)');
say(!JSON.stringify(C2.nodes).includes(OLD),'child target: no node reads $(\'Shared Library\')');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const chg=C.nodes.filter(n=>{const m=C2.nodes.find(x=>x.name===n.name);return !m||!same(m,n);}).map(n=>n.name);
say(chg.length===NR+2,'child nodes changed or removed: '+chg.length+' ('+NR+' readers, Library Check, Shared Library); every other node identical');
say(same(C.connections,C2.connections),'child connections unchanged');
for(const n of C2.nodes)if(stubs.some(s=>s.name===n.name)||n===lcN){let p=true;try{acorn.parse('(async()=>{'+n.parameters.jsCode+'\n})()',{ecmaVersion:2022});}catch(e){p=false;}if(!p)say(false,n.name+' parses');}
say(true,'the '+(NR+1)+' changed child nodes parse');
// ---- C. the engine target: one expression grows by one field
const E2=JSON.parse(JSON.stringify(E));const apc=node(E2,'Alternate Pass Call');const ex=apc.parameters.workflowInputs.value.pass;const A="lib_sha: $json.__lib422,";
say(ex.split(A).length===2,'engine Alternate Pass Call: the anchor "'+A+'" stands once');
apc.parameters.workflowInputs.value.pass=ex.replace(A,"lib: $('Shared Library').params.jsCode, "+A);
const ex2=apc.parameters.workflowInputs.value.pass;let pe=true;try{acorn.parse(ex2.replace(/^=\{\{/,'(').replace(/\}\}\s*$/,')'),{ecmaVersion:2022});}catch(e){pe=false;}say(pe,'the changed expression parses ('+ex.length+' to '+ex2.length+')');
say(E.nodes.filter(n=>!same(n,node(E2,n.name))).map(n=>n.name).join()==='Alternate Pass Call'&&same(E.connections,E2.connections),'engine: only Alternate Pass Call changes');
// ---- D. the new child Library Check, run offline on what the engine would send
const lsCode=lsN.parameters.jsCode;const shaE=new Function(lsCode.slice(0,lsCode.indexOf('const __lc='))+"\nreturn {l:__LIBSHA422(arguments[0]),m:__MAPSHA422(arguments[0],'engine')};")(TE);
const run=(pass)=>new Function('$input','$',lcN.parameters.jsCode)({all:()=>[{json:{pass}}]},()=>{throw new Error('no node may be read');});
const good={sa:{a2r:1},parent_exec:'1',h:{x:1},lib_sha:shaE.l,map_sha:shaE.m,lib:TE};
let o=null,er='';try{o=run(good);}catch(e){er=e.message;}
say(o&&o[0].json.lib422.same===true&&!('lib' in o[0].json.pass)&&same(o[0].json.pass,{sa:{a2r:1},parent_exec:'1',h:{x:1},lib_sha:shaE.l,map_sha:shaE.m})&&JSON.stringify(o).length<2000,'known-good: the check passes on the engine text (lib '+shaE.l+', map '+shaE.m+'); its output keeps pass without the library text '+er);
const thr=(p,re)=>{try{run(p);return false;}catch(e){return re.test(e.message);}};
say(thr({...good,lib:undefined},/carries no library text/),'control: no library text in the call throws');
say(thr({...good,lib:TE.slice(0,TE.length-5000)},/pkgLIB1/),'control: a text cut short throws');
const i=TE.indexOf('\n/*LIB*/')+5000;say(thr({...good,lib:TE.slice(0,i)+'#'+TE.slice(i+1)},/pkgLIB1/),'control: one changed character in LIB throws');
const j=TE.lastIndexOf('\n/*MAP*/')+3000;const tm=TE.slice(0,j)+(TE[j]==='1'?'2':'1')+TE.slice(j+1);say(thr({...good,lib:tm},/pkgLIB1/),'control: one changed character in MAP throws');
say(thr({...good,lib_sha:undefined},/pkgLIB1/),'control: no engine sha throws');
{const o3=JSON.parse(JSON.stringify(C2));const l3=o3.nodes.find(n=>n.name.startsWith('Library Check'));l3.parameters.jsCode=l3.parameters.jsCode.replace(xl(lsN.parameters.jsCode),xl(node(C,lcN.name).parameters.jsCode));let t=false;try{new Function('$input','$',l3.parameters.jsCode)({all:()=>[{json:{pass:good}}]},()=>{});}catch(e){t=/pkgLIB1/.test(e.message);}
 say(xl(lsN.parameters.jsCode)===xl(node(C,lcN.name).parameters.jsCode)||t,'control: with the child\'s old __MAPEXTRA422 list the check throws (the list must equal the engine\'s): engine '+xl(lsN.parameters.jsCode)+' child today '+xl(node(C,lcN.name).parameters.jsCode));}
// ---- E. each changed stub, run offline up to the rebuilt source, old against new
let bad578=0;for(const n of stubs){const k=keys[stubs.indexOf(n)];const A1='return await new Function(',A2="return new Function(S+'\\nreturn "+k+";')();";const c0=n.parameters.jsCode;const shape=c0.includes(A1)?1:c0.split(A2).length===2?2:0;if(!shape){say(false,n.name+': the reader has a loader shape this test does not know');bad578++;continue;}const cut=s=>shape===1?s.slice(0,s.indexOf(A1))+'\nreturn __S;':'return '+s.slice(s.indexOf('(T=>{'),s.indexOf('\n',s.indexOf('(T=>{'))).replace(/;\s*$/,'').replace(A2,'return S;')+';';
 const oldS=new Function('$',cut(n.parameters.jsCode))(x=>x==='Shared Library'?{params:{jsCode:TC}}:{});
 const newS=new Function('$',cut(node(C2,n.name).parameters.jsCode))(x=>x==='Alternate Pass In'?{first:()=>({json:{pass:{lib:TE}}})}:{});
 if(!(typeof oldS==='string'&&oldS===newS&&oldS.length===PC.M[k].n)){say(false,n.name+': rebuilt source old equals new');bad578++;}}
say(!bad578,NR+' readers: the source each rebuilds from the passed engine text equals the source it rebuilds today from the child node');
// ---- F. sizes
const js=x=>JSON.stringify(x).length;const cn=js(C.nodes),cn2=js(C2.nodes);
console.log('MEASURED child nodes as JSON: '+cn+' to '+cn2+' (saved '+(cn-cn2)+'); child Shared Library node as JSON '+js(node(C,'Shared Library'))+'; engine nodes grow by '+(js(E2.nodes)-js(E.nodes))+'; text passed in the call: '+TE.length+' characters ('+Buffer.byteLength(TE)+' bytes UTF-8, '+JSON.stringify(TE).length+' as a JSON string)');
const lines=new Set();for(const k of keys)for(const e of PC.M[k].p){if(typeof e==='number')lines.add(e);else if(typeof e[0]==='number')for(let q=e[0];q<=e[1];q++)lines.add(q);}
console.log('the child asks for '+NR+' keys of '+Object.keys(PC.M).length+'; they serve '+lines.size+' of '+PC.L.length+' lines, '+[...lines].reduce((a,q)=>a+JSON.stringify(PC.L[q]).length+1,0)+' characters as stored');
console.log('engine MAP keys '+Object.keys(PE.M).length+', child MAP keys '+Object.keys(PC.M).length+'; LIB equal: '+same(PE.L,PC.L));
if(process.argv[4]){fs.writeFileSync(process.argv[4]+'/target_child_578.json',JSON.stringify(C2));fs.writeFileSync(process.argv[4]+'/target_engine_578.json',JSON.stringify(E2));}
console.log((ok?'ALL PASS':'SOME FAIL')+' ('+cnt+' checks)');
