// ASK 651/652 ledger replay (W4): runs the PWL.judgeBlock of Panel Build and Build Independent Verdict from an engine file on a stored run's rounds. node ledger652.cjs engine.json fx/rNNNNN.json "Panel Build"|"Build Independent Verdict"
const fs=require('fs');const [,,EF,FX,NODE]=process.argv;
const E=JSON.parse(fs.readFileSync(EF,'utf8'));const X=JSON.parse(fs.readFileSync(FX,'utf8'));
const LIB=E.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const s=E.nodes.find(n=>n.name===NODE).parameters.jsCode;
const i=s.indexOf('const judgeBlock=F=>');const j=s.indexOf('})();',i);const k=s.indexOf('\n',s.indexOf('PRS_L2BAD=',j));
const A0=s.indexOf('const __R=await (async()=>{');if(A0<0||A0>k)throw new Error('wrapper not found');const pre=s.slice(0,A0)+s.slice(A0+'const __R=await (async()=>{'.length,k);
const $=n=>n==='Shared Library'?{params:{jsCode:LIB}}:n==='Quote Report'?{first:()=>({json:X.qr})}:{first:()=>({json:{}}),all:()=>[]};
const PRE=pre.split('if(T.length<2000)throw').join('if(false)throw'); /* harness only: the stored rounds are passed to the ledger directly, not as node inputs */
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('$','__F',PRE+'\nreturn PWL.judgeBlock(__F);')($,{...X.F,cr4:X.F.cr4||null}).then(out=>process.stdout.write(out),e=>{console.error('ERR',e.message);process.exit(1);});
