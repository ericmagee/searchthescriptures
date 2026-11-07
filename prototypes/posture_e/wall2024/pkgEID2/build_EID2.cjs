// pkgEID2 (W2, 33411 report: 13 grok items NO VERDICT on 33430's stack). DeepSeek enforcer fix, 2 nodes (Judge Enforcer Record, Alt).
// pkgEID reads "ID (seat)", "ID, seat", seat-only lines (mapped by order) and a bare "Y8". It does not read the seat-first form that 33411 Alt call 2
// wrote: "ENFORCER: grok (H1) -- AGREE -- ...". Such a line is now read as "ENFORCER: H1 -- ...": the id inside the brackets is the label, and the
// name before it is dropped. A bare id then goes through pkgEID's bare-number rule (read only when the call has exactly one item with that number).
// Base: pkgEB7/patched_full (the 33430 stack). Run from wall2024/: node pkgEID2/build_EID2.cjs [--base dir] [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const BASE=arg('--base','pkgEB7/patched_full'),OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const A0="const __t=l.replace(/[*_`]+/g,'').trim();";
const A1="const __t=l.replace(/[*_`]+/g,'').trim().replace(/^(ENFORCER\\s*:\\s*)(?:(?:JUDGE|SEAT)\\s+)?[A-Za-z][\\w.-]*\\s*\\(\\s*([BVKYHZPRS]\\d+(?:\\.\\d+)?)\\s*\\)/i,(x,a,b)=>{__eid.seat_first=(__eid.seat_first||0)+1;return a+b;}); /* pkgEID2: \"ENFORCER: grok (H1) --\" is read as \"ENFORCER: H1 --\" */";
const plan={source:'W2 pkgEID2 (33411 seat-first labels)',base:BASE,nodes:[]};
for(const name of ['Judge Enforcer Record','Alt Judge Enforcer Record']){const f=name.replace(/ /g,'_')+'.js';const s0=fs.readFileSync(BASE+'/'+f,'utf8');const c=s0.split(A0).length-1;if(c!==1)throw new Error(name+' anchor x'+c);
 if(s0.indexOf('__eid')<0||s0.indexOf('__eid')>s0.indexOf(A0)&&!/(?:const|let) __eid/.test(s0))throw new Error(name+': no __eid');
 const s=s0.replace(A0,()=>A1);new Function('$','$input','$json','$execution','$workflow','$node','$items',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base_sha:sha(s0),final_sha:sha(s)});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(plan.nodes.map(n=>n.name+' '+n.base_sha+'->'+n.final_sha).join('\n'));
