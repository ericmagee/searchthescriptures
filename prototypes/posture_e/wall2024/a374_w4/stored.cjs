// ASK 374 replay (W3 8798 B 4b): every stored CHANGE TO text (debate_enforcer_log.response_line holding "CHANGE TO"), live against target, under three fact sets:
// (a) DEFENDER facts BOTH NOT STATED on links 1..99 (a superset of every stored defender fact): refused sets must be identical;
// (b) CHALLENGER facts BOTH NOT STATED on premises 1..99: the lines the mirror would refuse (the exact count W3 asked for);
// (c) the stored E-ASSUME rows: no CHALLENGER fact exists, so (a) covers them.
const fs=require('fs');const P=JSON.parse(fs.readFileSync(__dirname+'/pop.json'));const [OLD,NEW]=process.argv.slice(2);
const load=require('./loadbns.cjs');
const tos=P.ct.map(([id,rt,t])=>{const i=String(t).search(/CHANGE TO\s*:/i);return [id,rt,String(t).slice(i).replace(/^CHANGE TO\s*:\s*/i,'')];});
const DFa=Array.from({length:99},(_,i)=>({side:'DEFENDER',link:i+1,n:i+1,fact:'F'+(i+1),both_not_stated:true}));
const CFa=Array.from({length:99},(_,i)=>({side:'CHALLENGER',link:i+1,n:i+1,fact:'F'+(i+1),both_not_stated:true}));
const res={};for(const [nm,F] of [['a_defender',DFa],['b_challenger',CFa]]){const O=load(OLD,F),N=load(NEW,F);let ro=0,rn=0,diff=[];for(const [id,rt,t] of tos){const o=!!O.bnsRefuse2024(t),n=!!N.bnsRefuse2024(t);if(o)ro++;if(n)rn++;if(o!==n)diff.push(id);}res[nm]={refused_old:ro,refused_new:rn,differ:diff.length,ids:diff};}
const sides={};for(const x of P.ea){const m=String(x[2]||'').match(/^\s*ASSUME-CHECK:\s*(\w+)/);const k=m?m[1]:'no side';sides[k]=(sides[k]||0)+1;}
const out={change_to_texts:tos.length,e_assume_rows:P.ea.length,e_assume_sides:sides,...res};
console.log(JSON.stringify({...out,b_challenger:{...out.b_challenger,ids:out.b_challenger.ids.length+' ids'}},null,1));fs.writeFileSync(__dirname+'/stored_out.json',JSON.stringify(out,null,1));
