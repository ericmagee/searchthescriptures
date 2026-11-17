// ASK 379: new Next Alternate? vs live s259 Second Alternate? on stored inputs (no accumulated pass): a2r must be equal.
const fs=require('fs');const W=JSON.parse(fs.readFileSync('../rdf/fetchback_s259.json'));const LIVE=W.nodes.find(n=>n.name==='Second Alternate?').parameters.jsCode;const NEW=fs.readFileSync('next_alternate_new.js','utf8');
const load=f=>{const d=JSON.parse(fs.readFileSync(f));return d.data.resultData.runData;};
const mk=RD=>over=>nm=>{const it=(over&&over[nm])||(RD[nm]&&RD[nm][RD[nm].length-1].data.main[0]);if(!it)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)}};return {isExecuted:true,first:()=>it[0],all:()=>it};};
const run=(code,$,inp)=>new Function('$','$input',code)($,{first:()=>inp[0],all:()=>inp})[0].json;
const js=JSON.stringify;let ok=0,bad=0;const chk=(n,a,b)=>{if(js(a)===js(b)){ok++;console.log('PASS',n,js(a).slice(0,200));}else{bad++;console.log('FAIL',n,'\n  live',js(a),'\n  new ',js(b));}};
for(const [tag,f] of [['38450','../run/exec_38450.json'],['37372','../run/sa_37372.json'],['37510','../run/sa_37510.json'],['35296','../run/sa_35296.json'],['35379','../run/exec_35379.json'],['38226','../run/exec_38226.json']]){
 let RD;try{RD=load(f);}catch(e){console.log('skip',tag,e.message);continue;}if(!RD['Alternate Merge 1']){console.log('skip',tag,'no Alternate Merge 1');continue;}
 const $=mk(RD)();const inp=RD['Alternate Merge 1'][RD['Alternate Merge 1'].length-1].data.main[0];
 const L=run(LIVE,$,inp),N=run(NEW,$,inp);chk(tag+' a2r (s259 code on stored inputs)',L.a2r,N.a2r);
 const stored=RD['Second Alternate?']?RD['Second Alternate?'][RD['Second Alternate?'].length-1].data.main[0][0].json.a2r:null;console.log('   stored a2r (code of its own day):',String(js(stored)).slice(0,200));
 const {a2r:_a,__a379:_s,...restN}=N;const {a2r:_b,...restL}=L;chk(tag+' rest of the item',restL,restN);}
// synthetic: retry once only, cap
const RD=load('../run/exec_38450.json');const $=mk(RD)();const R1=RD['Alternate Merge 1'][0].data.main[0][0].json;
const T0=R1.alternates_tried[0];const nov={...T0,alternate:'sonnet',api_model:'anthropic/claude-sonnet-5.5',result:'NOT SEATED',why:'seat "sonnet" returned content null'};
const a=run(NEW,$,[{json:{...R1,alternates_tried:[T0,nov]}}]).a2r;chk('one no-verdict try: retried',[a.retry,a.free],[['anthropic/claude-sonnet-5.5'],['ernie','sonnet']]);
const b=run(NEW,$,[{json:{...R1,alternates_tried:[T0,nov,{...nov,why:'seat "sonnet" returned no JSON object'}],__a379:{passes:[1]}}}]).a2r;chk('failed retry: no third pick',[b.retry,b.free],[[],['ernie']]);
const c=run(NEW,$,[{json:{...R1,__a379:{passes:[1,2,3,4,5,6]}}}]).a2r;chk('cap reached',[c.run,c.why],[false,'the cap of 6 further alternate passes is reached']);
console.log('pass',ok,'fail',bad);
