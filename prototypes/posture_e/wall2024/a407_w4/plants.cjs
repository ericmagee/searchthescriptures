// ASK 407 plants: Init Seats live 697b9f79 (fetchback_w404) against t407, on stored run 38661 inputs (Accept Final, Accept Models) with planted debaters and planted model rows.
const fs=require('fs');const code=(f,nm)=>{let d=JSON.parse(fs.readFileSync(f));if(d.data&&d.data.nodes)d=d.data;return d.nodes.find(n=>n.name===nm).parameters.jsCode;};
const A=code(__dirname+'/../rdf/fetchback_w404.json','Init Seats'),B=code(__dirname+'/t407.json','Init Seats');
const run=(src,inp,am)=>{const M=Object.create(Math);M.random=()=>0.123456789;const $=nm=>{if(nm==='Accept Models')return{all:()=>am.map(json=>({json}))};throw new Error('no '+nm);};
 const T0=Date;class FD extends T0{constructor(...a){if(a.length)super(...a);else super('2026-11-18T18:40:00.000Z');}static now(){return new T0('2026-11-18T18:40:00.000Z').getTime();}}
 return new Function('$','$input','$execution','Math','Date',src)($,{first:()=>({json:inp})},{id:'X',customData:{set:()=>{}}},M,FD)[0].json;};
const d=JSON.parse(fs.readFileSync(__dirname+'/../a393/ex38661_acc.json'));const rd=d.data.resultData.runData;const g=n=>rd[n][rd[n].length-1].data.main[0].map(i=>i.json);
const inp0=g('Accept Final')[0];const am0=g('Accept Models');
const row=(seat,api,fam)=>({seat,provider:'openrouter',role:'engine',api_model:api,endpoint:'https://openrouter.ai/api/v1/chat/completions',max_tokens:64000,recommended_model:null,needs_upgrade:false,active:true,family:fam});
const amNew=am0.concat([row('glm_legal','z-ai/glm-5.3-flashx-legal','zhipu'),row('hy4','tencent/hy4','tencent'),row('hy4_flash','tencent/hy4-flash','tencent')]);
const withDeb=(D,Cc)=>{const x=JSON.parse(JSON.stringify(inp0));const bd=x.src?(x.src.body||x.src):(x.body||x);bd.defender={...bd.defender,engine:D};bd.challenger={...bd.challenger,engine:Cc};return x;};
const show=(tag,inp,am)=>{let a,b;try{a=run(A,inp,am0);}catch(e){a={ERR:e.message};}try{b=run(B,inp,am);}catch(e){b={ERR:e.message};}
 console.log('== '+tag);for(const [nm,o] of [['live',a],['t407',b]]){if(o.ERR){console.log('  '+nm+' ERROR: '+o.ERR.slice(0,300));continue;}
  console.log('  '+nm+' panel '+JSON.stringify(o.panel_order)+' reserve '+o.panel_reserve+' | alternates '+JSON.stringify(o.alt_order)+(o.alt_dropped?' | dropped '+o.alt_dropped.map(x=>x.seat+'('+x.family+')').join(' '):''));}
 return {a,b};};
show('stored 38661 inputs (spark vs gemini)',inp0,amNew);
for(const [D,Cc] of [['qwen','gemini'],['qwen4max','spark'],['glm','gemini'],['chatgpt','gemini'],['chatgpt','sonnet'],['claude','opus'],['deepseek_debate','mimo']])show('plant: '+D+' vs '+Cc,withDeb(D,Cc),amNew);
// Accept Build fail-closed: run with stored rows only (no glm_legal, hy4)
show('plant: t407 with none of the three new model rows',inp0,am0);
