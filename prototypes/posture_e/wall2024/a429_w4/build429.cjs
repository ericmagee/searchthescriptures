// ASK 429 (plan a429_w3/plan_rev2.md): the enforcer model sees judges as "Judge k", never by seat id.
// Usage: node a429/build429.cjs ENG_BASE CHILD_BASE ENG_BASEV CHILD_BASEV ENG_OUT CHILD_OUT
// Labels are made once in Resolve Seats (RS.jlabel: panel slot k -> "Judge k"). __jl(seat) reads that map; an alternate takes the label of
// the seat it replaced (alt_seats.removed_seat, followed when that seat was itself the reserve or an alternate); the reserve takes the label of the failed seat (Panel Payloads substitution); the single
// judge stays "single judge"; any other seat is "a judge". Applied only to text placed in a model request (the send boundary).
const fs=require('fs'),path=require('path'),cp=require('child_process');
const [EB,CB,EV,CV,EO,CO]=process.argv.slice(2);
const load=f=>{let w=JSON.parse(fs.readFileSync(f));return w.data&&w.data.nodes?w.data:w;};
const E=load(EB),C=load(CB);
if(E.versionId!==EV||C.versionId!==CV)throw new Error('base versionId mismatch: '+E.versionId+' / '+C.versionId);
const HELPER="const __jl=(s,d)=>{let M={};try{M=(RS&&RS.jlabel)||{};}catch(e){M={};}if(s&&Object.prototype.hasOwnProperty.call(M,s))return M[s];if(s==='single judge')return s;const g=n=>{try{if(typeof __L!=='undefined'&&__L&&typeof __L[n]==='function')return __L[n]();}catch(e){}return null;};for(const n of ['Alt Seated','R2 Alt Seated']){try{const x=g(n);if(x&&x.isExecuted){const a=(((x.first()||{}).json||{}).alt_seats||[]).find(y=>y&&y.seat===s);if(a&&a.removed_seat&&a.removed_seat!==s&&(d||0)<3){const r=__jl(a.removed_seat,(d||0)+1);if(r!=='a judge')return r;}}}catch(e){}}try{const x=g('Panel Payloads');if(x&&x.isExecuted){const sb=((x.first()||{}).json||{}).substitution;if(sb&&sb.substitute===s&&M[sb.failed_seat])return M[sb.failed_seat];}}catch(e){}return 'a judge';};";
const DS="const ds=RS&&RS.enforcer&&RS.enforcer.api_model?RS.enforcer:null;";
const PPL="\"Panel Payloads\":()=>$('Panel Payloads')";
const node=(w,n)=>{const x=w.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);return x;};
const once=(w,n,o,v)=>{const x=node(w,n);const c=x.parameters.jsCode;const k=c.split(o).length-1;if(k!==1)throw new Error(n+': "'+o.slice(0,60)+'" occurs '+k+' times');x.parameters.jsCode=c.replace(o,()=>v);};
// 1. Resolve Seats (engine; the child takes the engine's items whole, ASK 379)
once(E,'Resolve Seats',"gt,tt,gl:gsrc.length}}];","gt,tt,gl:gsrc.length,jlabel:Object.fromEntries((judges||[]).map((j,i)=>[j&&j.seat,'Judge '+(i+1)]).filter(x=>x[0]))}}];");
// 2. Enforcer Build (own code): Panel Payloads into its __L, the helper after the enforcer line, the label site
once(E,'Enforcer Build',"\"Resolve Seats\":()=>$('Resolve Seats')};","\"Resolve Seats\":()=>$('Resolve Seats'),"+PPL+"};");
once(E,'Enforcer Build',DS,DS+HELPER);
once(E,'Enforcer Build',"'- '+id+' ('+r.seat+'): RESPONSE: '","'- '+id+' ('+__jl(r.seat)+'): RESPONSE: '");
// 3. Judge Contradiction Build (own code; it already names Panel Payloads)
once(E,'Judge Contradiction Build',DS,DS+"const __L={"+PPL+"};"+HELPER);
// the candidate's "by" field keeps the seats (it reaches the record); only the request text shows the labels
once(E,'Judge Contradiction Build',"-- named by '+c.by+(c.why","-- named by '+String(c.by||'').replace(/\\(([^()]*)\\)$/,(m,g)=>'('+g.split(', ').map(x=>__jl(x)).join(', ')+')')+(c.why");
// 4. Reread builders: the id already points at the labelled line in the block above; the seat is dropped from the request text
const RR_O="' ('+x.seat+'), written after the send-back",RR_N="', written after the send-back";
once(E,'Reread Build',RR_O,RR_N);once(E,'Alt Reread Build',RR_O,RR_N);once(C,'R2 Alt Reread Build',RR_O,RR_N);
// 5. Stubs of the library Judge Enforcer builders: Panel Payloads in their refs line
const REF_O='$("Resolve Seats");}',REF_N='$("Resolve Seats");$("Panel Payloads");}';
once(E,'Judge Enforcer Build',REF_O,REF_N);once(E,'Alt Judge Enforcer Build',REF_O,REF_N);once(C,'R2 Alt Judge Enforcer Build',REF_O,REF_N);
// 6. Library pairs (both workflows alike, by lib_apply.cjs)
const P=[{old:DS,new:DS+HELPER},
 {old:"ids.map((x,k)=>'- '+x.id+' ('+x.seat+'): '+cut(x.response_line,400)",new:"ids.map((x,k)=>'- '+x.id+' ('+__jl(x.seat)+'): '+cut(x.response_line,400)"},
 {old:"ids.map(x=>'- '+x.id+' ('+x.seat+'): '+cut(x.response_line,500)",new:"ids.map(x=>'- '+x.id+' ('+__jl(x.seat)+'): '+cut(x.response_line,500)"},
 {old:"ids.map(x=>x.id+' ('+x.seat+')').join(",new:"ids.map(x=>x.id+' ('+__jl(x.seat)+')').join("},
 {old:"(E-HOLD, a collision line graded '+g.grade+'):\\nTHE LINE ('+id+', '+g.seat+'): '",new:"(E-HOLD, a collision line graded '+g.grade+'):\\nTHE LINE ('+id+', '+__jl(g.seat)+'): '"},
 {old:"(E-KEY, the keystone line):\\nTHE LINE ('+id+', '+g.seat+'): '",new:"(E-KEY, the keystone line):\\nTHE LINE ('+id+', '+__jl(g.seat)+'): '"},
 {old:"ids.map((x,k)=>'- '+x.id+' ('+x.seat+'): '+__show(",new:"ids.map((x,k)=>'- '+x.id+' ('+__jl(x.seat)+'): '+__show("},
 {old:"(E-RES, the RESULT line of '+j.seat+'):",new:"(E-RES, the RESULT line of '+__jl(j.seat)+'):"},
 {old:"THIS JUDGE\\'S COUNT ('+id+', '+j.seat+'): '",new:"THIS JUDGE\\'S COUNT ('+id+', '+__jl(j.seat)+'): '"},
 {old:"return '- '+id+' ('+r.seat+'): RESPONSE: '",new:"return '- '+id+' ('+__jl(r.seat)+'): RESPONSE: '"}];
for(const k of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'])P.push({map:k,old:"\"Resolve Seats\":()=>$('Resolve Seats')};",new:"\"Resolve Seats\":()=>$('Resolve Seats'),"+PPL+"};"});
fs.writeFileSync(path.join(__dirname,'pairs_429.json'),JSON.stringify(P,null,1));
const EI=EO+'.pre',CI=CO+'.pre';fs.writeFileSync(EI,JSON.stringify(E));fs.writeFileSync(CI,JSON.stringify(C));
cp.execFileSync('node',[path.join(__dirname,'lib_apply.cjs'),EI,CI,path.join(__dirname,'pairs_429.json'),EO,CO],{stdio:'inherit'});
console.log('BUILT',EO,CO,'pairs',P.length);
