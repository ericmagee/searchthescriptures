const R1=(({__a379,...r})=>r)($input.first().json);const __P=(($input.first().json.__a379||{}).passes||[]);const __CAP=6; /* ASK 379: the pass state travels in the item; __CAP is the operator's number of further passes */const G=$('Gate Record').first().json;const S=$('Init Seats').first().json;const RS=$('Resolve Seats').first().json;
const QA=S.dry===true&&S.qualify_alternate?S.qualify_alternate:null;
const a2r={run:false,seats:[],tried:[],free:[],retry:[],why:null};
if(QA)a2r.why='the qualify path makes no second round';
else{const seated=R1.alternates_seated||[];const filled=new Set(seated.map(x=>x.removed_seat));
 const T=(R1.alternates_tried||[]).filter(x=>x&&x.alternate&&x.api_model);a2r.tried=[...new Set(T.map(x=>x.api_model))];
 const failed=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)).map(x=>x.removed_seat))];
 a2r.retry=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)&&/returned content null|returned no JSON object|JSON did not parse/.test(x.why)&&T.filter(y=>y.api_model===x.api_model).length===1).map(x=>x.api_model))]; /* ASK 379 (W1 7959): one retry, never a third try */a2r.tried=a2r.tried.filter(m=>a2r.retry.indexOf(m)<0);
 a2r.seats=failed.slice(0,Math.max(0,2-seated.length));
 const pay=(G.bodies||[]).map(b=>{try{return JSON.parse(b).payload;}catch(e){return null;}}).filter(Boolean);const deb=RS.debaters||[];
 const free=(RS.alternates||[]).filter(a=>!deb.some(d=>d.model===a.api_model||(d.family===a.family&&!(a.family==='anthropic'&&deb.every(x=>x.family==='anthropic'))))&&!pay.some(q=>q.judge_api_model===a.api_model)&&a2r.tried.indexOf(a.api_model)<0);
 a2r.free=free.map(a=>a.seat);a2r.run=a2r.seats.length>0&&free.length>0&&__P.length<__CAP;
 a2r.why=a2r.run?'round 2 for '+a2r.seats.join(', ')+'; free: '+a2r.free.join(', ')
  :(a2r.seats.length>0&&free.length>0&&__P.length>=__CAP)?'the cap of '+__CAP+' further alternate pass'+(__CAP===1?'':'es')+' is reached'
  :!T.length?'no alternate was tried in round 1'
  :!failed.length?'every tried alternate is seated'
  :!a2r.seats.length?'two alternates already sit'
  :'no pool model is left after round 1 (pool: '+((RS.alternates||[]).map(a=>a.seat).join(', ')||'empty')+'; tried: '+a2r.tried.join(', ')+')';}
return [{json:{...G,a2r,__a379:{R:R1,passes:__P,pass:__P.length+2}}}]; /* ASK 379 */