// R16: QR Check of live and candidate on the first questions of execution 34626
process.chdir(__dirname+'/../..');const fs=require('fs');const RM=require('../../pkgLIB/runner_model.cjs');
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const L=Ld('/mnt/project-files/wall2024/fetchback_live_s110.json'),N=Ld(process.argv[2]||'pkgQRD/parent_s110_QRD.json');const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;const S=JSON.stringify;const cl=x=>JSON.parse(S(x));
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8')).data.resultData.runData;const out=n=>X[n]?X[n][0].data.main[0]:null;const AF=Object.getPrototypeOf(async function(){}).constructor;
async function go(w,name,input){const c=code(w,name);const mk=n=>{const it=out(n);if(!it){const no=()=>{throw new Error('unexecuted '+n);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};const $input={first:()=>cl(input[0]),last:()=>cl(input[input.length-1]),all:()=>cl(input)};return (await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,input[0]&&input[0].json,{id:'34626'})).map(x=>x.json);}
(async()=>{const ask=out('QR Ask');const a=await go(L,'QR Check',ask),b=await go(N,'QR Check',ask);
 b.forEach(j=>console.log(j.seat+': defender ['+j.qs.defender.earlier_round+'] "'+j.qs.defender.earlier_quote+'" / ['+j.qs.defender.round+'] "'+j.qs.defender.quote+'" | challenger earlier_quote '+S(j.qs.challenger.earlier_quote||null)+' | retry '+j.retry+' redirect '+S(j.redirect)));
 const core=x=>S(x.map(j=>({seat:j.seat,qs:j.qs,faults:j.faults,why:j.why})));console.log('live returns: '+a.map(j=>j.seat+':'+j.retry).join(', ')+'; questions and faults equal to live: '+(core(a)===core(b)));
 const stored=out('QR Check').map(x=>x.json);console.log('live QR Check rerun equals the stored output of the execution (qs, faults): '+(core(a)===core(stored)));
})().catch(e=>console.log('ERROR '+e.stack));
