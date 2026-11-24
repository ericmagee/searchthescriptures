// ASK 611 build (W4): stop four extra copies of the debate in the judging. Base: live engine 21316a8e (after ASK 601), child ecdc6218 (env B611E/B611C to re-cut).
// Every request sent stays byte-equal; the copies are rebuilt at the point of use instead of kept as a step's output.
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const lp=require('/mnt/project-files/ask588/w4/build/libpatch.js');
const BE=process.env.B611E||'/mnt/project-files/ask611/w4/base/base_eng_21316a8e.json',BC=process.env.B611C||'/mnt/project-files/ask611/w4/base/base_child_ecdc6218.json';
const E=JSON.parse(fs.readFileSync(BE,'utf8')),C=JSON.parse(fs.readFileSync(BC,'utf8'));
const once=(s,a,b,what)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(what+': anchor occurs '+k+' times');return s.replace(a,()=>b);};
const node=(W,n)=>{const x=W.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);return x;};
// QRA: QR Merge's own qrAdd, as one expression (same text, same QR_AT).
const QM=node(E,'QR Merge').parameters.jsCode;
const QRAT=(()=>{const m=QM.match(/const QR_AT='[^']*';/g);if(!m||m.length!==1)throw new Error('QR_AT not once in QR Merge');return m[0];})();
const QRA=(()=>{const h='function qrAdd(body,TXT){';const a=QM.indexOf(h);if(a<0||QM.indexOf(h,a+1)>=0)throw new Error('qrAdd not once');let d=0,i=a+h.length-1;for(;i<QM.length;i++){if(QM[i]==='{')d++;else if(QM[i]==='}'){d--;if(d===0)break;}}return '(function(body,TXT){'+QRAT+QM.slice(a+h.length,i)+'})';})();
const CH=[];
// 1. QR Merge: put out the judges without body (qrAdd still runs, so a missing anchor still fails the merge as before).
{const n=node(E,'QR Merge');n.parameters.jsCode=once(n.parameters.jsCode,'const judges=__PB.judges.map(j=>({...j,body:qrAdd(j.body,TXT)}));','const judges=__PB.judges.map(j=>{qrAdd(j.body,TXT);const o={...j};delete o.body;return o;}); /* ASK 611: no second copy of the judge requests; readers rebuild with the same qrAdd */','QR Merge');CH.push('QR Merge');}
// 1b. Readers of QR Merge judges: the one snippet, everywhere it stands.
const S_OLD='{judges:__m.judges,qa588:__m.qa_text}';
const S_NEW='{judges:__m.judges.map((j,i)=>(j&&j.body)?j:Object.assign({},__p.judges[i],j,{body:'+QRA+'(__p.judges[i].body,__m.qa_text)})),qa588:__m.qa_text}';
function libEdits(W){const {L}=lp.cut(W);const eds=[];L.forEach((l,i)=>{const k=l.split(S_OLD).length-1;if(k>1)throw new Error('snippet '+k+' times on LIB '+i);if(k===1)eds.push({line:i,a:S_OLD,b:S_NEW,what:'ASK 611 QR judges rebuild'});});return eds;}
const eE=libEdits(E),eC=libEdits(C);if(eE.map(x=>x.line).join()!==eC.map(x=>x.line).join())throw new Error('engine and child LIB differ in snippet lines');
lp.apply(E,eE);lp.apply(C,eC);CH.push('Shared Library (LIB lines '+eE.map(x=>x.line).join(', ')+')');
for(const nm of ['Panel Check','Reserve Build']){const n=node(E,nm);n.parameters.jsCode=once(n.parameters.jsCode,S_OLD,S_NEW,nm);CH.push(nm);}
// 1c. Alternate Pass Call: the child input's "Panel Build" judges are rebuilt the same way, so the child receives what it receives today.
{const n=node(E,'Alternate Pass Call');const v=n.parameters.workflowInputs.value;const a='{ judges: $("QR Merge").first().json.judges, qa588: $("QR Merge").first().json.qa_text }';
 v.pass=once(v.pass,a,'{ judges: $("QR Merge").first().json.judges.map((j, x) => (j && j.body) ? j : Object.assign({}, i.json.judges[x], j, { body: '+QRA+'(i.json.judges[x].body, $("QR Merge").first().json.qa_text) })), qa588: $("QR Merge").first().json.qa_text }','Alternate Pass Call');CH.push('Alternate Pass Call');}
// 2. Panel Judges Prep: put out everything but the body; Panel Judges Parallel builds the body at the send by Prep's own steps.
{const n=node(E,'Panel Judges Prep');let c=n.parameters.jsCode;
 const selOld="let body=(()=>{try{if(qt&&$('QR Merge').isExecuted){const __m=$('QR Merge').first().json;if(__m&&__m.qr_ok===true&&Array.isArray(__m.judges)&&__m.judges[k-1]&&__m.judges[k-1].body)return __m.judges[k-1].body;}}catch(e){}return PB.judges[k-1].body;})(); /* ASK 588 D5 */";
 const sendOld=" if(provider==='openrouter')body=ORF[k](body);\n out.push({json:{ppj_slot:k,ppj_provider:provider,seat:jd.seat,api_model:PB.judges[k-1].api_model,conv_id:\"odv1-\" + $execution.id,ppj_nonce:nonce,ppj_t0:t0,body}});}";
 if(c.split(selOld).length!==2||c.split(sendOld).length!==2)throw new Error('Prep anchors');
 const defsEnd=c.indexOf('\nconst qt=');const orfAt=c.indexOf('\nconst ORF=');if(orfAt<0||orfAt>defsEnd||c.indexOf('\nconst ORF=',orfAt+1)>=0)throw new Error('ORF anchor');
 const ORFDEF=c.slice(orfAt+1,defsEnd); // ORF exactly as today; it moves to the send, Prep keeps P1 and P23 for the provider
 const qtOld="\nconst qt=$('Init Seats').first().json.question_trial === true;const PB=";if(c.split(qtOld).length!==2)throw new Error('qt anchor');
 c=c.slice(0,orfAt)+c.slice(defsEnd);c=c.replace(qtOld,()=>"\nconst PB=");
 c=c.replace(selOld,()=>'/* ASK 611: the body is built at the send (Panel Judges Parallel), by these same steps */').replace(sendOld,()=>"\n out.push({json:{ppj_slot:k,ppj_provider:provider,seat:jd.seat,api_model:PB.judges[k-1].api_model,conv_id:\"odv1-\" + $execution.id,ppj_nonce:nonce,ppj_t0:t0}});}");
 n.parameters.jsCode=c;CH.push('Panel Judges Prep');
 const SEL="let body=(()=>{try{if(qt&&$('QR Merge').isExecuted){const __m=$('QR Merge').first().json;if(__m&&__m.qr_ok===true&&Array.isArray(__m.judges)&&__m.judges[k-1]){if(__m.judges[k-1].body)return __m.judges[k-1].body;return "+QRA+"(PB.judges[k-1].body,__m.qa_text);}}}catch(e){}return PB.judges[k-1].body;})();";
 const EXPR="={{ (()=>{/* ASK 611: the judge body is built here at the send, by Panel Judges Prep's former steps, so no step output keeps a copy */\n"+ORFDEF+"\nconst qt=$('Init Seats').first().json.question_trial === true;const PB=$('Panel Build').first().json;const k=$json.ppj_slot;const provider=$json.ppj_provider;\n"+SEL+"\nif(provider==='openrouter')body=ORF[k](body);const o=Object.assign({},$json);o.body=body;return o;})() }}";
 const p=node(E,'Panel Judges Parallel');if(p.parameters.jsonBody!=='={{ $json }}')throw new Error('Parallel jsonBody is not $json');p.parameters.jsonBody=EXPR;CH.push('Panel Judges Parallel (jsonBody)');}
// 3 and 4. Close Enforcer Build copy 2 carries no body; Close Group Batch Build carries {bt,k}; the send and retry steps fetch the body at send time.
const RES="((bt,k)=>{const n=bt==='C'?'Close Enforcer Build':'Assume Check Build';const s=bt==='C'?'cec_skip':'acx_skip';const a=$(n).all().map(x=>x.json).filter(j=>j&&j[s]!==true);const j=a[k];if(!j)return undefined;if(j.body)return j.body;if(j.copy===2&&a[k-1]&&a[k-1].side===j.side&&a[k-1].body)return Object.assign({},a[k-1].body,{temperature:j.temperature});return undefined;})";
{const n=node(E,'Close Enforcer Build');n.parameters.jsCode=once(n.parameters.jsCode,"out.push({json:{cec_skip:false,side:sd,body:{...body,temperature:0.6},links,","out.push({json:{cec_skip:false,side:sd,temperature:0.6,body_from_copy:1,links,",'Close Enforcer Build copy 2');CH.push('Close Enforcer Build');}
{const n=node(E,'Close Enforcer Record');n.parameters.jsCode=once(n.parameters.jsCode,"const BA=$('Close Enforcer Build').all().map(x=>x.json);","const BA=(A=>A.map((b,i)=>(b&&b.copy===2&&!b.body&&A[i-1]&&A[i-1].side===b.side&&A[i-1].body)?Object.assign({},b,{body:Object.assign({},A[i-1].body,{temperature:b.temperature})}):b))($('Close Enforcer Build').all().map(x=>x.json)); /* ASK 611: copy 2 is copy 1 at temperature 0.6 */",'Close Enforcer Record');CH.push('Close Enforcer Record');}
{const n=node(E,'Close Group Batch Build');n.parameters.jsCode=once(n.parameters.jsCode,"out.push({json:{bt:t,k,body:j.body}})","out.push({json:{bt:t,k}})",'Close Group Batch Build');CH.push('Close Group Batch Build');}
{const n=node(E,'Close Group Batch Call openrouter');if(n.parameters.jsonBody!=='={{ $json.body }}')throw new Error('Batch Call jsonBody');n.parameters.jsonBody='={{ /* ASK 611: the close or assume request is fetched here at the send, so no step output keeps a copy */ '+RES+'($json.bt, $json.k) }}';CH.push('Close Group Batch Call openrouter (jsonBody)');}
{const n=node(E,'Close Group Retry Build');n.parameters.jsCode=once(n.parameters.jsCode,"R.forEach((r,i)=>{if(r&&r.error&&P[i]&&P[i].body)out.push({json:{rt:i,body:P[i].body}});});","const __RB="+RES+";R.forEach((r,i)=>{const __b=P[i]?(P[i].body||__RB(P[i].bt,P[i].k)):undefined;if(r&&r.error&&P[i]&&__b)out.push({json:{rt:i,body:__b}});}); /* ASK 611 */",'Close Group Retry Build');CH.push('Close Group Retry Build');}
const oE=process.env.T611E||__dirname+'/target_engine_611.json',oC=process.env.T611C||__dirname+'/target_child_611.json';
fs.writeFileSync(oE,JSON.stringify(E));fs.writeFileSync(oC,JSON.stringify(C));
const {N:NE}=lp.cut(E),{N:NC}=lp.cut(C);
console.log('changed:',CH.join('; '));console.log('engine',md5(JSON.stringify(E)).slice(0,8),'child',md5(JSON.stringify(C)).slice(0,8));
