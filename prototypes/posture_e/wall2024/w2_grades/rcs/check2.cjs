// W2 grade of pkgRCS: Plain Rule Lines old vs new on 35067 (prefix), failure cases; Panel Tokens old fields and call list on 35067/34852/33490; malformed items.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const ld=f=>{let D=JSON.parse(fs.readFileSync(f,'utf8'));D=D.data||D;return D.workflow||D;};
const A=ld(W+'fetchback_live_s139.json'),B=ld(W+'parent_s139_RCS2.json');const code=(D,n)=>D.nodes.find(x=>x.name===n).parameters.jsCode;
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','$json','return (async()=>{\n'+src+'\n})();')($,$input,inp[0]&&inp[0].json);};
const mk=(rd,D,over)=>{const lo=n=>{if(n in over){if(over[n]==='THROW')throw new Error('no data');return over[n];}const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return n=>{const o=lo(n)||[];const nd=D.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!lo(n),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};};};
const strip=s=>JSON.stringify(s).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d+Z/g,'T');
(async()=>{
for(const r of ['35067','34852','33490']){const X=JSON.parse(fs.readFileSync(W+'ex'+r+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
 const inP=rd['Panel Tokens']?null:null;
 const pin=(()=>{for(const [k,v] of Object.entries(B.connections))for(const o of (v.main||[]))for(const e of (o||[]))if(e.node==='Panel Tokens'){const x=rd[k];return x?x[x.length-1].data.main[0]:[];}return [];})();
 const o=await runSrc(code(A,'Panel Tokens'),mk(rd,A,{}),pin),n=await runSrc(code(B,'Panel Tokens'),mk(rd,B,{}),pin);
 const nj={...n[0].json};const calls=nj.calls;delete nj.calls;
 const fam={};calls.forEach(c=>fam[c.f]=(fam[c.f]||0)+1);const billed=calls.filter(c=>'b' in c).reduce((a,c)=>a+c.b,0);
 console.log(r,'Panel Tokens old fields equal:',strip(o[0].json)===strip(nj),'| calls',calls.length,JSON.stringify(fam),'| billed $'+billed.toFixed(4),'| unnamed',calls.filter(c=>c.n==='?').length);
 if(r!=='35067')continue;
 const row0=rd['Get Row'][0].data.main[0][0].json;const priced=calls.map(c=>({...c,usd:'b' in c?c.b:null,src:'b' in c?'billed':'no price'}));
 const cases=[['priced list (OpenRouter billed, others no price)',{...row0,call_costs:priced,run_cost_usd:billed}],['row without call_costs',{...row0}],['Get Row throws','THROW'],['call_costs not an array',{...row0,call_costs:{x:1}}],['entry with junk fields',{...row0,call_costs:[{n:null,m:null,i:'x',usd:'abc',src:null}],run_cost_usd:null}]];
 const po=await runSrc(code(A,'Plain Rule Lines'),mk(rd,A,{}),rd['Format Markdown'][0].data.main[0]);const oldMd=JSON.stringify(po[0].json);
 for(const [lab,row] of cases){let res;try{const pn=await runSrc(code(B,'Plain Rule Lines'),mk(rd,B,{'Get Row':row==='THROW'?'THROW':[{json:row}]}),rd['Format Markdown'][0].data.main[0]);
   const a=po[0].json,b=pn[0].json;const ks=Object.keys(b);const diffs=ks.filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));
   const prefix=String(b.md).startsWith(String(a.md))&&diffs.every(k=>k==='md'||k==='chars');const tail=diffs.length?String(b[diffs[0]]).slice(String(a[diffs[0]]).length):'';
   res='ok | fields changed '+JSON.stringify(diffs)+' | old is exact prefix: '+prefix+' | added '+tail.length+' chars: '+JSON.stringify(tail.slice(0,160));}catch(e){res='THREW '+e.message;}
  console.log('  PRL',lab.padEnd(48),res);}
}
// malformed call items through the new Panel Tokens __CU (null json, usage with strings)
})().catch(e=>{console.error(e);process.exit(1);});
