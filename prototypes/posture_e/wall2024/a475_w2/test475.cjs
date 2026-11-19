// ASK 475 test: run each B-round Build and Extract under the base and the target on the same mock inputs, and compare the outputs byte for byte.
// The mock $ answers 'Shared Library' with its params (the loader reads it), the round's prior Extract and Build, and every Verse Sheet node
// (LAY's sheet() reads them through $), so the path that needs the passed $ is exercised.
// usage: node a475_w2/test475.cjs BASE.json TARGET.json
const fs=require('fs');const L=p=>{const w=JSON.parse(fs.readFileSync(p));return w.data||w};
const B=L(process.argv[2]),T=L(process.argv[3]);
const SHEET=[{book:'Matthew',chapter:1,verse:18,text:'Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost.'},
 {book:'Matthew',chapter:1,verse:25,text:'And knew her not till she had brought forth her firstborn son: and he called his name JESUS.'},
 {book:'Isaiah',chapter:28,verse:10,text:'For precept must be upon precept, precept upon precept; line upon line, line upon line; here a little, and there a little:'}];
const RAWS={
 plain:'I hold the verse as written.\n\nNothing more is pressed here.',
 layered:'LINK 1: Matthew 1:18 "before they came together, she was found with child" [L1] -- MEANS: the conception came before the union only.\nPREMISE 1: the record alone governs the order of events.\nD2: SUPPORTED -- Matthew 1:25 "knew her not till she had brought forth" [L1] shows no union at all before the birth, never.',
 quoted:'The challenger says Matthew 1:18 "she was found with child of the Holy Ghost" settles it. It does not, since Isaiah 28:10 "precept upon precept" requires the whole record.\nMEANS: only the collective scripture decides -- not one verse.\nPoint 1: KEPT. The text states nothing else.',
 misquote:'Matthew 1:18 "she was found with child by the Spirit" [L1] proves the claim entirely and exclusively; Matthew 1:25 "knew her not" means no union at all, without exception.',
 empty:''};
function run(code,map,input,lib){const $=n=>{if(n==='Shared Library')return {params:{jsCode:lib},isExecuted:false,first:()=>{throw new Error('lib not run')},all:()=>[]};
  if(/Verse Sheet$/.test(n))return {isExecuted:true,first:()=>({json:SHEET[0]}),all:()=>SHEET.map(j=>({json:j})),params:{}};
  return {first:()=>({json:map[n]||{}}),isExecuted:!!map[n],all:()=>[{json:map[n]||{}}],params:{}};};
 const f=new Function('$','$input','return (async()=>{'+code+'\n})()');return f($,{first:()=>({json:input||{}}),all:()=>[{json:input||{}}]});}
(async()=>{let bad=0,n=0;
 const NB=Object.fromEntries(B.nodes.map(x=>[x.name,x])),NT=Object.fromEntries(T.nodes.map(x=>[x.name,x]));
 const libB=NB['Shared Library'].parameters.jsCode,libT=NT['Shared Library'].parameters.jsCode;
 for(const [tag,RAW] of Object.entries(RAWS))for(const r of ['D2B','C2B','D3B','C3B','D4B','C4B']){const prev=r.slice(0,2);
  const mk=()=>({[prev+' Extract']:{raw:RAW,run_token:'t',fam:'openrouter',model:'m'},[prev+' Build']:{call:{fam:'openrouter',model:'m',body:{x:1}}}});
  const res={};for(const [side,N,lib] of [['base',NB,libB],['target',NT,libT]]){const map=mk();let bo,eo;
   try{bo=await run(N[r+' Build'].parameters.jsCode,map,{},lib);}catch(e){bo='THREW '+e.message;}
   if(Array.isArray(bo))map[r+' Build']=bo[0].json;
   try{eo=await run(N[r+' Extract'].parameters.jsCode,map,{raw:RAW+'\n\nResent: '+RAW},lib);}catch(e){eo='THREW '+e.message;}
   res[side]=JSON.stringify([bo,eo]);}
  n++;const same=res.base===res.target;if(!same)bad++;const lc=(()=>{try{return JSON.parse(res.target)[0][0].json.lay_check}catch(e){return null}})();
  console.log(tag.padEnd(9),r,'| equal',same,'| out',res.base.length,'chars | lay items',lc&&lc.items?lc.items.length:'-',/THREW/.test(res.base)?'| base threw: '+res.base.match(/THREW[^"]*/)[0].slice(0,80):'');}
 console.log(bad?'OUTPUTS DIFFER: '+bad+' of '+n:'ALL '+n+' NODE PAIRS BYTE-EQUAL (base vs target)');process.exit(bad?1:0);})();
