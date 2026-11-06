// pkgJEC test. Run from wall2024/: node pkgJEC/test_JEC.cjs   (needs /mnt/project-files/wall2024/inputs/33060_*.json)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(fs.readFileSync('pkgJEC/plan_JEC.json','utf8'));
T('4 nodes; base and final shas match',plan.nodes.length===4&&plan.nodes.every(n=>sha(fs.readFileSync(n.base+'/'+n.file,'utf8'))===n.base_sha&&sha(fs.readFileSync('pkgJEC/patched/'+n.file,'utf8'))===n.final_sha));
// 33060 inputs -> Judge Enforcer Build (base pkgEF at 60K, pkgJEC at 40K)
const I=n=>{const f='/mnt/project-files/wall2024/inputs/33060_'+n+'.json';if(!fs.existsSync(f))return null;return JSON.parse(fs.readFileSync(f,'utf8'))[0].main[0].map(x=>x.json);};
const nodes={'Panel Cure Check':I('Panel_Cure_Check'),'Init Seats':I('Init_Seats')||[{run_token:'r'}],'Resolve Seats':[{deepseek:{api_model:'stub'}}],'Enforcer Record':[{pass:1}],'Alt Seated':[{pass:1}]};
for(const k of [1,2,3]){const v=I('Panel_Cure_Normalize_'+k);if(v)nodes['Panel Cure Normalize '+k]=v;}
const mk=extra=>n=>{const it=extra[n]||nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
const run=(file,$,inp)=>new Function('$','$input','$json',fs.readFileSync(file,'utf8'))($,inp||{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{});
const build=pkg=>{const o=run(pkg+'/patched/Judge_Enforcer_Build.js',mk({}));return o.map(x=>x.json);};
const A=build('pkgEF'),B=build('pkgJEC');const len=c=>c.body?c.body.messages[1].content.length:0;const key=x=>x.rule+' '+x.seat+' '+x.item;
const ka=A.flatMap(c=>c.ids||[]).map(key).sort(),kb=B.flatMap(c=>c.ids||[]).map(key).sort();
T('33060 at 60K (pkgEF): '+A.length+' calls, prompt chars '+A.map(len).join(', '),A.length===3);
T('33060 at 40K (pkgJEC): '+B.length+' calls, prompt chars '+B.map(len).join(', ')+'; every call within 40000 plus one item',B.length>A.length&&B.length<=8&&B.every(c=>len(c)<=40000+20000));
T('33060: the same '+ka.length+' items at 40K, none lost or added',ka.length===kb.length&&ka.every((k,i)=>k===kb[i]));
const cr=c=>JSON.stringify((c[0].code_rows||[]).map(({at,...r})=>r));T('33060: code_rows (ruling 443) identical apart from the time stamp ('+(A[0].code_rows||[]).length+' rows)',cr(A)===cr(B));
// Record: the 33060 shape (call 1 ok, calls 2 and 3 timed out) on the pkgJEC build's calls, plus an empty-content call
const okReply=c=>({choices:[{message:{content:(c.ids||[]).map(x=>'ENFORCER: '+x.id+' -- AGREE -- ok').join('\n')},finish_reason:'stop'}]});
const tmo={error:{message:'Response body timed out after 300000ms without data'}};
for(const [file,bn] of [['Judge_Enforcer_Record.js','Judge Enforcer Build'],['Alt_Judge_Enforcer_Record.js','Alt Judge Enforcer Build']]){
 const calls=B.slice(0,4);const replies=[okReply(calls[0]),tmo,{},{choices:[{message:{content:''},finish_reason:'length'}]}];
 const recIn=r=>({all:()=>r.map(j=>({json:j})),first:()=>({json:r[0]})});
 const go=(pkg,r)=>run(pkg+'/patched/'+file,mk({[bn]:calls}),recIn(r))[0].json;
 const o=go('pkgJEC',replies);const rows=o.enf428_rows.filter(x=>x.kind==='enforcer_check');const by=ci=>{const ids=new Set((calls[ci].ids||[]).map(x=>x.id));return rows.filter(x=>[...ids].some(()=>true)&&calls[ci].ids.some(y=>y.item===x.item&&y.rule===x.rule&&y.seat===x.seat));};
 const e=ci=>[...new Set(by(ci).map(x=>x.reply_error))];
 T(file+': call 1 rows have no error; AGREE recorded',e(0).length===1&&e(0)[0]===null&&by(0).every(x=>/^ENFORCER AGREE/.test(x.cure_reason)),JSON.stringify(e(0)));
 T(file+': call 2 rows read "call 2: no reply (Response body timed out ...)"',e(1).length===1&&/^call 2: no reply \(Response body timed out/.test(e(1)[0]),JSON.stringify(e(1)));
 T(file+': call 3 rows (no choices, no message) read "call 3: no reply (no message; reply keys: none)"',e(2).length===1&&/^call 3: no reply \(no message; reply keys: none\)$/.test(e(2)[0]),JSON.stringify(e(2)));
 T(file+': call 4 rows read "call 4: empty content (finish_reason length)"',e(3).length===1&&e(3)[0]==='call 4: empty content (finish_reason length)',JSON.stringify(e(3)));
 T(file+': enf428.errors lists calls 2, 3, 4 in order',o.enf428.errors.length===3&&o.enf428.errors.every((w,i)=>w.startsWith('call '+(i+2)+':')),JSON.stringify(o.enf428.errors));
}
// base Record reproduces the shift (shown, not required by the fix)
{const calls=B.slice(0,3);const src=fs.readFileSync('pkgCM/base/Judge_Enforcer_Record.js','utf8');const o=new Function('$','$input','$json',src)(mk({'Judge Enforcer Build':calls}),{all:()=>[okReply(calls[0]),tmo,tmo].map(j=>({json:j}))},{})[0].json;
 const r1=o.enf428_rows.find(x=>x.kind==='enforcer_check'&&calls[0].ids.some(y=>y.item===x.item&&y.rule===x.rule&&y.seat===x.seat));
 T('base Record (pkgCM/base) on the 33060 shape: call 1 rows wrongly read "'+(r1&&r1.reply_error)+'" (the fault reproduces)',r1&&/^call 2:/.test(r1.reply_error||''));}
console.log(ok+' OK, '+bad+' FAIL');
