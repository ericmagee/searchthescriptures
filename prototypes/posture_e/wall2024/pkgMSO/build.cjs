// pkgMSO (W1; run 35379, W4 Wall 5168, second seat W1): the alternate Merge Seat runs once per delivery from "FUM Needed? ...".
// When the R1 alternates split (one needs a follow-up, one does not), it is delivered twice and everything below it runs twice
// (a second R2 judge call, a second Write Judgment). Change: a guard after the pkgFLR line. It goes on only when no alternate still
// waits on a follow-up AND this delivery holds an item whose latest Normalize state is in the last Normalize run; otherwise it
// returns no item, so the branch stops. Applies to Alternate Merge Seat and R2 Alternate Merge Seat. Prompt 0.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(z=>z.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
const G=nm=>"try{if($('"+nm+"').isExecuted){const __lr=new Map();let __rm=-1;for(let __r=0;__r<20;__r++){let __a;try{__a=$('"+nm+"').all(0,__r);}catch(e){break;}if(!Array.isArray(__a)||!__a.length)break;__rm=__r;for(const x of __a){const j=x&&x.json;if(j&&j.cure&&j.cure.k!=null)__lr.set(String(j.cure.who)+'|'+j.cure.k,{r:__r,f:!!j.fum});}}const __in=$input.all().map(x=>x&&x.json).filter(j=>j&&j.cure&&j.cure.k!=null).map(j=>String(j.cure.who)+'|'+j.cure.k);if(__in.length&&([...__lr.values()].some(v=>v.f)||!__in.some(k=>(__lr.get(k)||{}).r===__rm)))return [];}}catch(e){} /* pkgMSO: run the seat chain once; a delivery goes on only when no alternate waits on a follow-up and it holds an item from the last Normalize run */";
for(const [seat,nm] of [['Alternate Merge Seat','Alternate Cure Normalize'],['R2 Alternate Merge Seat','R2 Alternate Cure Normalize']]){
 const P=M[seat].p;const idx=P.findIndex(x=>Array.isArray(x)&&typeof x[0]==='string'&&x[0].includes('pkgFLR'));if(idx<0)throw new Error('no FLR line in '+seat);
 if(!P[idx][0].includes("$('"+nm+"').all(0,__r)"))throw new Error('FLR line names another node in '+seat);
 P[idx]=[P[idx][0]+'\n'+G(nm)];}
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
for(const [seat,nm] of [['Alternate Merge Seat','Alternate Cure Normalize'],['R2 Alternate Merge Seat','R2 Alternate Cure Normalize']]){const st=W.nodes.find(z=>z.name===seat).parameters.jsCode;if(!st.includes('$("'+nm+'")'))throw new Error('stub of '+seat+' does not name '+nm);}
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
