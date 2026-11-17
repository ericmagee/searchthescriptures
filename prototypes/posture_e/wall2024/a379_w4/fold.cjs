// ASK 379: does the live Alternate Merge logic fold? (1) new path (Pass Accumulate fold + new Alternate Merge) == live Alternate Merge on a stored pass-2 run; (2) synthetic pass 3.
const fs=require('fs');const W=JSON.parse(fs.readFileSync('../rdf/fetchback_s259.json'));const code=n=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const EX=process.argv[2]||'../run/exec_38450.json';const E=JSON.parse(fs.readFileSync(EX));const RD=E.data.resultData.runData;
const items=(nm,over)=>{if(over&&nm in over)return over[nm];const r=RD[nm];if(!r)return null;const last=r[r.length-1];return ((last.data&&last.data.main&&last.data.main[0])||[]);};
const mk$=over=>nm=>{const it=items(nm,over);if(!it)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};return {isExecuted:true,first:()=>it[0]||{json:{}},all:()=>it,params:{}};};
const runCode=(c,over,input)=>new Function('$','$input','require',c)(mk$(over),{all:()=>input||[],first:()=>(input||[{json:{}}])[0]},require);
// live Alternate Merge
const AMc=code('Alternate Merge');const live=runCode(AMc,{})[0].json;
// Pass Accumulate core = live __AMOUT merge with R1 from the pass decision item, R2 from the child output, without the cec log (added once at the end)
const amHead="const __AMOUT=(()=>{\nconst R1=$('Alternate Merge 1').first().json;\nlet R2=null;try{if($('R2 Alternate Merge').isExecuted)R2=$('R2 Alternate Merge').first().json;}catch(e){R2=null;}\n";
if(AMc.indexOf(amHead)!==0)throw new Error('head anchor');
const coreEnd=AMc.indexOf('\n})();\n');const core=AMc.slice(amHead.length,coreEnd);
const ACC="const __SA=$('Second Alternate?').first().json;const R1=__SA.__a379&&__SA.__a379.R?__SA.__a379.R:$('Alternate Merge 1').first().json;const R2=$input.first().json;\n"+core.replace("const __cecL=","const __cecL0=").replace(/if\(!R2\)return[^\n]*\n/,"const __cecL=[];\n")+"\n";
fs.writeFileSync('pass_accumulate_core.js',ACC);
const NEWAM=AMc.replace(amHead,"const __AMOUT=(()=>{\nconst R1=(()=>{try{if($('Pass Accumulate').isExecuted)return $('Pass Accumulate').first().json;}catch(e){}return $('Alternate Merge 1').first().json;})();\nlet R2=null; /* ASK 379: Pass Accumulate folds every pass */\n");
fs.writeFileSync('alternate_merge_new.js',NEWAM);
// pass 2 via fold
const SA2=items('Second Alternate?');const R2out=items('R2 Alternate Merge');
const f1=runCode(ACC,{'Second Alternate?':[{json:{...SA2[0].json,__a379:{R:items('Alternate Merge 1')[0].json,passes:[]}}}]},R2out)[0].json;
const neu=runCode(NEWAM,{'Pass Accumulate':[{json:f1}]})[0].json;
const js=x=>JSON.stringify(x);console.log('PASS 2: new path == live Alternate Merge:',js(neu)===js(live),'(bytes',js(live).length,')');
if(js(neu)!==js(live)){for(const k of new Set([...Object.keys(live),...Object.keys(neu)]))if(js(live[k])!==js(neu[k]))console.log('  differs:',k);}
// synthetic pass 3: same seat, a different alternate model name in the R2 output, decision a2r for pass 3
const sub=(o,a,b)=>JSON.parse(JSON.stringify(o).split(a).join(b));
const alt2=(R2out[0].json.alternates_tried||[]).find(x=>x.alternate&&x.alternate!=='none');
const R3=[{json:sub(R2out[0].json,alt2.api_model,'synthetic/pass3-model').valueOf()}];const R3j=sub(R3[0].json,'"'+alt2.alternate+'"','"pass3alt"');R3j.alternates_tried=R3j.alternates_tried.map(x=>({...x,alternate:x.alternate===alt2.alternate?'pass3alt':x.alternate}));
const SA3={...SA2[0].json,a2r:{...SA2[0].json.a2r,tried:[...SA2[0].json.a2r.tried,alt2.api_model]},__a379:{R:f1,passes:[1]}};
const f2=runCode(ACC,{'Second Alternate?':[{json:SA3}]},[{json:R3j}])[0].json;
const neu3=runCode(NEWAM,{'Pass Accumulate':[{json:f2}]})[0].json;
console.log('PASS 3 synthetic: errors in result:',js((f2.alternate_round2||{}).result));
console.log('  alternates_tried:',f2.alternates_tried.map(x=>x.removed_seat+'>'+x.alternate+':'+x.result).join(', '));
for(const b of neu3.bodies){const p=JSON.parse(b).payload;const L=String(p.verdict_raw||'').split('\n').filter(l=>/ALTERNATE TRIED/.test(l));const d=L.length-new Set(L).size;if(L.length)console.log('  seat',p.judge_seat,'tried lines',L.length,'duplicates',d,'| REMOVED FOR count',L.filter(l=>/REMOVED FOR/.test(l)).length);L.forEach(l=>console.log('     ',l.slice(0,170)));}
