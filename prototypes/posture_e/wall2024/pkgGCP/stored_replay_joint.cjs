// pkgGCP on stored runs: Gate Record and Alt Gate Record run on the run's own stored inputs (W4 exports), live s111 source against the candidate source.
// usage: node pkgGCP/stored_replay.cjs <run id>
const fs=require('fs');const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+process.argv[2]+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const out=n=>rd[n]?rd[n][rd[n].length-1].data.main:null;
const mk=name=>{const m=out(name);const it=m?m.find(o=>o&&o.length)||m[0]||[]:null;if(!it){const no=()=>{throw new Error('unexecuted: '+name)};return {isExecuted:false,first:no,all:no,last:no};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0])}};};
const run=async(src,node)=>{const s=rd[node][rd[node].length-1].source[0];const fo=out(s.previousNode)[s.previousNodeOutput||0]||[];const $input={first:()=>cl(fo[0]),all:()=>cl(fo),last:()=>cl(fo[fo.length-1]),get item(){return cl(fo[0])}};
 const FX=rd[node][rd[node].length-1].startTime;const RD=Date;global.Date=class extends RD{constructor(...a){a.length?super(...a):super(FX)}static now(){return FX}};
 try{return (await new AF('$','$input','$json','$execution',src)(mk,$input,fo[0]&&fo[0].json,{id:process.argv[2]}))[0].json;}finally{global.Date=RD;}};
(async()=>{for(const node of ['Gate Record','Alt Gate Record']){if(!rd[node]){console.log(node,'not in run');continue;}const f=node.replace(/ /g,'_')+'.js';
 const A=await run(fs.readFileSync('pkgLIB/strip_GUB2/patched/'+f,'utf8'),node),B=await run(fs.readFileSync('pkgLIB/strip_GCPL_on_GUB2/patched/'+f,'utf8'),node);
 const S=out(node)[0][0].json;const dv=j=>(j.bodies||[]).map(s=>{const p=JSON.parse(s).payload;return p.judge_seat+':'+p.drv_uncured}).join(' ');
 console.log('\n'+process.argv[2]+' '+node+'\n  stored    : '+dv(S)+'\n  live s111 : '+dv(A)+'\n  candidate : '+dv(B));
 const marks=(B.bodies||[]).flatMap(s=>(JSON.parse(s).payload.verdict_raw.match(/\[AUDIT v52:[^\]]*\]/g)||[]));console.log('  pkgGCP marks: '+(marks.length?marks.join('\n    '):'none'));
 const nt=x=>JSON.stringify(x).replace(/\[AUDIT v52:[^\]]*\]/g,'');const eqB=(A.bodies||[]).map((s,i)=>{const a=JSON.parse(s),b=JSON.parse(B.bodies[i]);a.payload.drv_uncured=0;b.payload.drv_uncured=0;b.payload.verdict_raw=b.payload.verdict_raw.replace(/\n\[AUDIT v52:[^\]]*\]/g,'');return JSON.stringify(a)===JSON.stringify(b);});
 const ra=cl(A),rb=cl(B);delete ra.bodies;delete rb.bodies;console.log('  bodies equal apart from the count and the marks: '+eqB.join(',')+'; other output fields equal: '+(JSON.stringify(ra)===JSON.stringify(rb)));
 // diagnostics: counted cure lines per seat
 for(const s of A.bodies||[]){const p=JSON.parse(s).payload;const L=(p.verdict_raw.match(/\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: [^;]*; ITEM: [^;]*; RULE: [^;]*; RESULT: (?!CURED)[^\n]{0,140}/g)||[]);if(L.length)console.log('  '+p.judge_seat+' not-cured cure lines: '+L.length+'\n    '+L.map(x=>x.slice(44,200)).join('\n    '));}}
})().catch(e=>{console.error(e);process.exit(1)});
