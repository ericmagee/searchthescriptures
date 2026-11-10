// W2: run one node of a stored execution on its own stored inputs, with the node source rebuilt from each given fetch-back.
// usage: node w2_grades/stored/node_replay.cjs <exec id> "<node>" <fetchback>...
const fs=require('fs');const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
const [,,EX,NODE,...FBS]=process.argv;const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+EX+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const out=n=>rd[n]?rd[n][rd[n].length-1].data.main:null;
const src=(fb,node)=>{let D=JSON.parse(fs.readFileSync(fb,'utf8'));D=D.data||D;const W=D.workflow||D;const by={};W.nodes.forEach(n=>by[n.name]=n);const stub=by[node].parameters.jsCode,lib=by['Shared Library'].parameters.jsCode;
 let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)return stub;const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const mk=name=>{const m=out(name);const it=m?m.find(o=>o&&o.length)||m[0]||[]:null;if(!it){const no=()=>{throw new Error('unexecuted: '+name)};return {isExecuted:false,first:no,all:no,last:no};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0])}};};
const run=async(code,node)=>{const s=rd[node][rd[node].length-1].source[0];const fo=out(s.previousNode)[s.previousNodeOutput||0]||[];const $input={first:()=>cl(fo[0]),all:()=>cl(fo),last:()=>cl(fo[fo.length-1]),get item(){return cl(fo[0])}};
 const FX=rd[node][rd[node].length-1].startTime;const RD=Date;global.Date=class extends RD{constructor(...a){a.length?super(...a):super(FX)}static now(){return FX}};
 try{return await new AF('$','$input','$json','$execution',code)(mk,$input,fo[0]&&fo[0].json,{id:EX});}finally{global.Date=RD;}};
module.exports={run,src,out,rd};
if(require.main===module)(async()=>{if(!rd[NODE]){console.log(NODE,'not in run',EX);return;}const S=out(NODE)[0];const dv=j=>(j.bodies||[]).map(s=>{const p=JSON.parse(s).payload;return p.judge_seat+':'+p.drv_uncured}).join(' ');
 console.log(EX+' '+NODE+'\n  stored: '+dv(S[0].json));for(const fb of FBS){const r=await run(src(fb,NODE),NODE);const j=r[0].json;const tags=(j.bodies||[]).flatMap(s=>(JSON.parse(s).payload.verdict_raw.match(/\[AUDIT v52:[^\]]*\]|[^\n]*send-back count comes off[^\n]*|[^\n]*pkgGUB[^\n]*/g)||[]).map(x=>x.slice(0,220)));
 console.log('  '+fb.replace(/.*fetchback_live_/,'').replace('.json','')+': '+dv(j)+(tags.length?'\n     '+tags.join('\n     '):''));}})().catch(e=>{console.error(e.stack);process.exit(1)});
