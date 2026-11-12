// pkgPDS (W1; ASK 93, Eric "1": build and measure parallel DeepSeek enforcer calls offline). Measured first (Wall 5094): the calls inside
// one DeepSeek HTTP node already run side by side (every reply's "created" is within 1 s of the node's start); the NODES run one after
// another. This package sends two groups of independent DeepSeek calls as one HTTP node each, so each group takes its longest call's time.
// Group 1 (at Close Enforcer's place, right after Quote Report): Close Enforcer, Anticheat, Assume Check. Their Build nodes read only
//   Init Seats, Resolve Seats, Regrade Load and Final Output, which exist at that point, so Anticheat Build and Assume Check Build run there.
// Group 2 (at Enforcer's place, right after Panel Cure Check): Enforcer and Judge Enforcer. Judge Enforcer Build does not read Enforcer
//   Record or Enforcer Call (it was only wired after them), so it runs right after Enforcer Build.
// For each group G: new Code "G Batch Build" (every non-skipped item of the member Builds, tagged), IF "G Batch Needed?", HTTP
//   "G Batch Call deepseek" (a copy of Close Enforcer Call deepseek). Each member's "X Call deepseek" becomes a Code node of the same name
//   that hands back its own replies from the batch, in order, so the Records, the retry paths (and pkgERS's resend) and Panel Tokens read
//   the same items as before. Each member's old entry point now feeds a new Code "X Resume" that hands on X Build's items to X Needed?.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const byN=n=>{const x=W.nodes.find(z=>z.name===n);if(!x)throw new Error('no node '+n);return x;};const C=W.connections;const cl=o=>JSON.parse(JSON.stringify(o));
const eq=(a,b,what)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw new Error('wiring differs: '+what+' '+JSON.stringify(a));};
const link=(n)=>({node:n,type:'main',index:0});
const code=(name,js,pos)=>({id:crypto.randomUUID(),name,type:'n8n-nodes-base.code',typeVersion:2,position:pos,parameters:{jsCode:js}});
const TPL=cl(byN('Close Enforcer Call deepseek'));if(TPL.type!=='n8n-nodes-base.httpRequest')throw new Error('template is not HTTP');
const GROUPS=[
 {g:'Close Group',after:'Quote Report',members:[['Close Enforcer','cec_skip','C'],['Anticheat','acx_skip','A'],['Assume Check','acx_skip','S']]},
 {g:'Enforcer Group',after:'Panel Cure Check',members:[['Enforcer','enf_skip','E'],['Judge Enforcer','je_skip','J']]}];
// the old entry points of the members that move: Anticheat (Check Save #0, Regrade After Quotes? #0), Assume Check (Judge Contradiction Record #0), Judge Enforcer (Enforcer Record #0)
for(const G of GROUPS){
 const M=G.members;const first=M[0][0];const B0=byN(first+' Build');const x0=B0.position[0],y0=B0.position[1]-260;
 // 1. chain the member Builds after the first one: first Build -> Build 2 -> ... -> Batch Build
 const BB=G.g+' Batch Build',BN=G.g+' Batch Needed?',BC=G.g+' Batch Call deepseek';
 const firstOut=cl(C[first+' Build'].main);eq(firstOut,[[link(first+' Needed?')]],first+' Build out');
 // entry points of the later members move to their Resume nodes
 const resumes=[];
 for(let i=1;i<M.length;i++){const X=M[i][0];const ins=[];for(const [s,o] of Object.entries(C))(o.main||[]).forEach((a,oi)=>(a||[]).forEach((c,ci)=>{if(c.node===X+' Build')ins.push([s,oi,ci]);}));
  if(!ins.length)throw new Error('no input to '+X+' Build');for(const [s,oi,ci] of ins)C[s].main[oi][ci]={...C[s].main[oi][ci],node:X+' Resume'};resumes.push(X);}
 C[first+' Build'].main=[[link(M.length>1?M[1][0]+' Build':BB)]];
 for(let i=1;i<M.length;i++){const X=M[i][0];eq(C[X+' Build'].main,[[link(X+' Needed?')]],X+' Build out');C[X+' Build'].main=[[link(i+1<M.length?M[i+1][0]+' Build':BB)]];}
 // 2. Batch Build, Needed?, Call
 const reads=M.map(([X])=>"$('"+X+" Build')").join(',');
 W.nodes.push(code(BB,"/* pkgPDS: one DeepSeek HTTP node for the group; its calls run side by side */\nconst out=[];for(const [t,n,s] of "+JSON.stringify(M.map(([X,s,t])=>[t,X+' Build',s]))+"){let a=[];try{a=$(n).all().map(x=>x.json);}catch(e){a=[];}a.filter(j=>j&&j[s]!==true).forEach((j,k)=>out.push({json:{bt:t,k,body:j.body}}));}\nif(false){"+reads+";}\nreturn out.length?out:[{json:{bt_skip:true}}];",[x0,y0]));
 const nd=cl(byN(first+' Needed?'));Object.assign(nd,{id:crypto.randomUUID(),name:BN,position:[x0+110,y0]});nd.parameters.conditions.conditions[0].id=crypto.randomUUID();nd.parameters.conditions.conditions[0].leftValue='={{ $json.bt_skip !== true }}';W.nodes.push(nd);
 W.nodes.push(Object.assign(cl(TPL),{id:crypto.randomUUID(),name:BC,position:[x0+220,y0]}));
 // 3. after the batch: resume the first member
 const R1=first+' Resume';W.nodes.push(code(R1,"return $('"+first+" Build').all(); /* pkgPDS: the batch call ran; hand on this Build's items */",[x0+330,y0]));
 C[BB]={main:[[link(BN)]]};C[BN]={main:[[link(BC)],[link(R1)]]};C[BC]={main:[[link(R1)]]};C[R1]={main:[[link(first+' Needed?')]]};
 for(const X of resumes){W.nodes.push(code(X+' Resume',"return $('"+X+" Build').all(); /* pkgPDS: this Build ran with its group's batch; hand on its items */",[byN(X+' Build').position[0],byN(X+' Build').position[1]+200]));C[X+' Resume']={main:[[link(X+' Needed?')]]};}
 // 4. each member Call becomes a Code node of the same name
 for(const [X,s,t] of M){const n=byN(X+' Call deepseek');if(n.type!=='n8n-nodes-base.httpRequest')throw new Error(X+' Call is not HTTP');
  const js="/* pkgPDS: this check's replies from "+BC+", in order; the call ran in the group's batch */\nconst P=$('"+BB+"').all().map(x=>x.json);let R=[];try{if($('"+BC+"').isExecuted)R=$('"+BC+"').all().map(x=>x.json);}catch(e){R=[];}\nreturn $input.all().map((x,i)=>{const k=P.findIndex(p=>p.bt==='"+t+"'&&p.k===i);return {json:(k>=0&&R[k])?R[k]:{error:'pkgPDS: no reply in the batch call'}};});";
  const keep={id:n.id,name:n.name,position:n.position};for(const k of Object.keys(n))delete n[k];Object.assign(n,keep,{type:'n8n-nodes-base.code',typeVersion:2,parameters:{jsCode:js}});}
}
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
