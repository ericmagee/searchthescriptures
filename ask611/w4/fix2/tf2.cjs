// ASK 611 fix 2 tests. usage: node tf2.cjs <base_eng> <base_child> <target_eng> <target_child>
const fs=require('fs');const [BE,BC,TE,TC]=process.argv.slice(2).map(f=>JSON.parse(fs.readFileSync(f)));let ok=true,n=0;const say=(c,m)=>{n++;if(!c)ok=false;console.log((c?'PASS ':'FAIL ')+m);};
const split=T=>({L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))});
const SL=W=>W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;
const src=(p,k)=>p.M[k].p.map(e=>typeof e==='number'?p.L[e]:typeof e[0]==='string'?e[0]:p.L.slice(e[0],e[1]+1).join('\n')).join('\n');
const S_OLD='{judges:__m.judges,qa588:__m.qa_text}';const KEYS=['Send Back Build','Late Gate Build'];
for(const [nm,B,T] of [['engine',BE,TE],['child',BC,TC]]){
 const diff=B.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(T.nodes.find(y=>y.name===x.name))).map(x=>x.name);
 say(diff.join()==='Shared Library'&&JSON.stringify(B.connections)===JSON.stringify(T.connections)&&B.nodes.length===T.nodes.length,nm+': only the Shared Library changes; connections equal');
 const pb=split(SL(B)),pt=split(SL(T));say(JSON.stringify(pb.L)===JSON.stringify(pt.L),nm+': LIB unchanged ('+pb.L.length+' lines)');
 const chg=Object.keys(pb.M).filter(k=>JSON.stringify(pb.M[k])!==JSON.stringify(pt.M[k]));say(chg.sort().join()===KEYS.slice().sort().join()&&Object.keys(pb.M).length===Object.keys(pt.M).length,nm+': MAP entries changed: '+chg.join(', '));
 const NEW=pt.L[620].slice(pt.L[620].indexOf('{judges:__m.judges.map('),pt.L[620].indexOf(',qa588:__m.qa_text}')+19);
 for(const k of KEYS){const a=src(pb,k),b=src(pt,k);say(b===a.replace(S_OLD,()=>NEW)&&a.split(S_OLD).length===2&&b.length===pt.M[k].n&&!b.includes(S_OLD),nm+' '+k+': text is the old text with the one snippet replaced by the live LIB 620 form; n '+pb.M[k].n+' to '+pt.M[k].n);}
 for(const k of Object.keys(pt.M)){const s=src(pt,k);if(s.length!==pt.M[k].n){say(false,nm+' '+k+' n mismatch');}}
 say(!Object.keys(pt.M).some(k=>src(pt,k).includes(S_OLD)),nm+': no MAP entry holds the old snippet any more');}
// Behaviour: the PB statement of Send Back Build and of Late Gate Build, run with QR Merge judges WITHOUT body (as live since 611).
const QM=TE.nodes.find(x=>x.name==='QR Merge').parameters.jsCode;const QR_AT=eval(QM.match(/const QR_AT=('[^']*');/)[1]);
const h='function qrAdd(body,TXT){';const a0=QM.indexOf(h);let d=0,i=a0+h.length-1;for(;i<QM.length;i++){if(QM[i]==='{')d++;else if(QM[i]==='}'){d--;if(d===0)break;}}const qrAdd=new Function('QR_AT','return '+QM.slice(a0,i+1))(QR_AT);
const mk=s=>({model:'m'+s,messages:[{role:'system',content:'sys '+s},{role:'user',content:'Judge '+s+'\n'+QR_AT+'CR1] text '+s}]});
const PBJ={judges:[1,2,3].map(s=>({seat:'s'+s,fam:s===2?'openrouter':'anthropic',api_model:'a'+s,body:mk(s)}))};const TXT='QUESTION ROUND TEXT';
const QRM={qr_ok:true,qa_text:TXT,judges:PBJ.judges.map(j=>{const o={...j};delete o.body;return o;})};
const QRM_OLD={qr_ok:true,qa_text:TXT,judges:PBJ.judges.map(j=>({...j,body:qrAdd(j.body,TXT)}))};
const stub=q=>n=>{if(n==='Panel Build')return{isExecuted:true,first:()=>({json:PBJ})};if(n==='QR Merge')return{isExecuted:true,first:()=>({json:q})};return{isExecuted:false,first:()=>{throw new Error('not run')},all:()=>[]};};
// Send Back Build: let PB=null;try{PB=...}catch(e){PB=null;}   Late Gate Build: const PB0=(()=>{try{return ...}catch(e){return null;}})();
const pbStmt=s=>{let a=s.indexOf('let PB=null;try{PB='),e='catch(e){PB=null;}',r='PB';if(a<0){a=s.indexOf('const PB0=(()=>{try{return ');e='catch(e){return null;}})();';r='PB0';}const b=s.indexOf(e,a);if(a<0||b<0)throw new Error('no PB statement');return s.slice(a,b+e.length)+'\nreturn '+r+';';};
const runPB=(s,q)=>new Function('$',pbStmt(s))(stub(q));
for(const k of KEYS){const pt=split(SL(TE)),pb=split(SL(BE));const sNew=src(pt,k),sOld=src(pb,k);
 const now=runPB(sNew,QRM),was=runPB(sOld,QRM_OLD),broken=runPB(sOld,QRM);
 say(now.judges.every(j=>j&&j.body)&&JSON.stringify(now.judges)===JSON.stringify(was.judges)&&now.qa588===TXT,k+': with bodyless QR judges the fixed text gives each judge the same request as before ASK 611 (the QR body), byte-equal');
 say(broken.judges.every(j=>!j.body),k+': control: the live text with bodyless QR judges gives no body (the 42373 defect reproduced)');
 const noqr=runPB(sNew,{qr_ok:false,judges:[]});say(JSON.stringify(noqr.judges)===JSON.stringify(PBJ.judges),k+': QR not run: the Panel Build judges, as today');}
console.log((ok?'ALL PASS':'SOME FAIL')+' ('+n+' checks)');
