// ASK 591 engine build (W4): the judge order is read from the table odv1_judge_order at run start.
// Plan ask591/w3/plan591.md rev 4 (S3, S4, S5). Base: live engine 489b977b (ask586/w4/j2/write/fetchback_eng586j2.json).
// Touched: one new node "Judge Order Read" (and its connections), Accept Build, Init Seats, Build Save Body. Child untouched.
// usage: node build591.cjs <engine in> <engine out>
const fs=require('fs');const crypto=require('crypto');
const [ein,eout]=process.argv.slice(2);
const W=JSON.parse(fs.readFileSync(ein,'utf8'));const N=n=>{const x=W.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);return x;};
const once=(s,a,b,what)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(what+': anchor occurs '+k+' times');return s.replace(a,()=>b);};
const md5=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const rep={};

// 1. the read node (same type, credential and retry as the engine's other rpc nodes; no onError: a failed read stops the run)
if(W.nodes.some(n=>n.name==='Judge Order Read'))throw new Error('Judge Order Read already exists');
const WT=N('Write Tokens');const AM=N('Accept Models');
const JOR={id:crypto.createHash('md5').update('ASK591 Judge Order Read').digest('hex').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*/,'$1-$2-$3-$4-$5'),
 name:'Judge Order Read',type:WT.type,typeVersion:WT.typeVersion,executeOnce:true,retryOnFail:true,maxTries:3,waitBetweenTries:3000,
 position:[AM.position[0]-240,AM.position[1]],
 parameters:{method:'POST',url:'https://bhffmkginddovmdcpnty.supabase.co/rest/v1/rpc/odv1_judge_order_read',authentication:'predefinedCredentialType',nodeCredentialType:'supabaseApi',sendBody:true,specifyBody:'json',jsonBody:'={{ {} }}',options:{}},
 credentials:JSON.parse(JSON.stringify(WT.credentials))};
W.nodes.push(JOR);
// connections: every start path that reached Accept Models now reaches Judge Order Read, which reaches Accept Models
let moved=0;
for(const [src,v] of Object.entries(W.connections)){for(const outs of (v.main||[])){for(const o of (outs||[])){if(o.node==='Accept Models'){o.node='Judge Order Read';moved++;}}}}
if(moved!==2)throw new Error('expected 2 links into Accept Models, found '+moved);
W.connections['Judge Order Read']={main:[[{node:'Accept Models',type:'main',index:0}]]};
rep['Judge Order Read']='added; '+moved+' links moved (Library Check, Dry Run Config)';

const JO="const __JO=(()=>{let j=null;try{j=$('Judge Order Read').first().json;}catch(e){}const ok=a=>Array.isArray(a)&&a.every(x=>typeof x==='string'&&x);if(!j||!ok(j.panel)||!ok(j.alternate)||j.panel.length<3)throw new Error('JUDGE ORDER: the order table could not be read (the read node gave no usable order); no call was made.');return j;})();";

// 2. Accept Build: the order it asks the agreement of comes from the table
{const n=N('Accept Build');let s=n.parameters.jsCode;const b=md5(s);
 s=once(s,"const ORDER=['chatgpt','sol','sol62','gemini','spark','qwen4max','argon','sonnet'];",JO+"\nconst ORDER=__JO.panel.concat(__JO.alternate); /* ASK 591: the order is the table odv1_judge_order */",'Accept Build ORDER');
 n.parameters.jsCode=s;rep['Accept Build']=b+'->'+md5(s);}

// 3. Init Seats: ORDER0 and __ALT come from the table; the output carries the order and its version
{const n=N('Init Seats');let s=n.parameters.jsCode;const b=md5(s);
 s=once(s,"const ORDER0=['chatgpt','sol','sol62','gemini','spark','qwen4max','argon','sonnet'];",JO+"\nconst ORDER0=__JO.panel.concat(__JO.alternate); /* ASK 591: the order is the table odv1_judge_order */",'Init Seats ORDER0');
 s=once(s,"const __ALT=['gemini','spark','qwen4max','argon','sonnet'];","const __ALT=__JO.alternate.slice(); /* ASK 591 */",'Init Seats __ALT');
 s=once(s,"return [{json:{run_token:TOK,variant:'ORACLE_DEBATE_V1',","return [{json:{run_token:TOK,variant:'ORACLE_DEBATE_V1',judge_order:{version:__JO.version,panel:__JO.panel,alternate:__JO.alternate},",'Init Seats output');
 n.parameters.jsCode=s;rep['Init Seats']=b+'->'+md5(s);}

// 4. Build Save Body: one review_notes line with the order used and the seats drawn
{const n=N('Build Save Body');let s=n.parameters.jsCode;const b=md5(s);
 s=once(s,"saveBody:{engine:S.challenger.engine,review_notes:RN+","saveBody:{engine:S.challenger.engine,review_notes:RN+(()=>{try{const I=$('Init Seats').first().json;const o=I.judge_order;if(!o)return '';const L=a=>(a&&a.length?a.join(', '):'none');return '\\n\\n[JUDGE ORDER v'+o.version+': panel list '+L(o.panel)+'; alternates list '+L(o.alternate)+' | SEATED: panel '+L(I.panel_order)+'; reserve '+(I.panel_reserve||'none')+'; alternates '+L(I.alt_order)+'; single judge '+(I.single_judge||'none')+']';}catch(e){return '';}})()+",'Build Save Body review_notes');
 n.parameters.jsCode=s;rep['Build Save Body']=b+'->'+md5(s);}

fs.writeFileSync(eout,JSON.stringify(W));
console.log(JSON.stringify(rep,null,1));
