// ASK 426 build (plan W3 9003 rev 1, 9005 rev 2, 9008; graded W1 9004 9007, W2 9006): luna replaces deepseek-flash as the ENFORCER MODEL.
// Usage: node a426/build426.cjs ENG CHILD ENG_BASEV CHILD_BASEV ENG_OUT CHILD_OUT
// 1. Resolve Seats (engine) adds RS.enforcer from the ACTIVE model_config row of seat luna (refuses the run when the row is missing, as need() does).
//    RS.deepseek is kept unchanged: the synthesis, diagnostic, independent verdict and accept judges read it.
// 2. The enforcer seat line "const ds=RS&&RS.deepseek..." reads RS.enforcer: 5 engine nodes inline, and one Shared Library line (engine and child,
//    used by MAP entries Judge Enforcer Build, Alt Judge Enforcer Build, R2 Alt Judge Enforcer Build).
// 3. The 13 engine and 4 child HTTP nodes whose bodies come only from those builds: url api.deepseek.com -> openrouter.ai, credential DeepSeek Key -> OpenRouter.
// Prompts, code checks, record nodes, node names and every other deepseek use are unchanged. No reasoning, effort, temperature or max_tokens text changes.
const fs=require('fs'),path=require('path'),cp=require('child_process');const acorn=require(path.join(__dirname,'../tools/node_modules/acorn'));
const [EI,CI,EV,CV,EO,CO]=process.argv.slice(2);const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data||d;};
if(ld(EI).versionId!==EV)throw new Error('engine base moved');if(ld(CI).versionId!==CV)throw new Error('child base moved');
const DS_OLD="const ds=RS&&RS.deepseek&&RS.deepseek.api_model?RS.deepseek:null;";
const DS_NEW="const ds=RS&&RS.enforcer&&RS.enforcer.api_model?RS.enforcer:null; /* ASK 426: the enforcer model (seat luna) */";
const RS_OLD1="const ds=need('deepseek');";
const RS_NEW1="const ds=need('deepseek');const enf=need('luna'); /* ASK 426: luna is the enforcer model */";
const RS_OLD2="deepseek:{api_model:ds.api_model,max_tokens:Number(ds.max_tokens)},";
const RS_NEW2="deepseek:{api_model:ds.api_model,max_tokens:Number(ds.max_tokens)},enforcer:{seat:'luna',api_model:enf.api_model,max_tokens:Number(enf.max_tokens)},";
const URL_OLD='https://api.deepseek.com/v1/chat/completions',URL_NEW='https://openrouter.ai/api/v1/chat/completions';
const CRED_OLD={httpHeaderAuth:{id:'R3waesZPK7vpsV8E',name:'DeepSeek Key'}},CRED_NEW={httpHeaderAuth:{id:'3KOXDCYCjkii6i56',name:'OpenRouter'}};
const H_E=['Enforcer Group Batch Call deepseek','Close Group Batch Call deepseek','Close Group Retry Call deepseek','Enforcer Retry Call deepseek','Enforcer Resend Call deepseek',
 'Judge Enforcer Retry Call deepseek','Judge Enforcer Resend Call deepseek','Alt Judge Enforcer Call deepseek','Alt Judge Enforcer Retry Call deepseek','Alt Judge Enforcer Resend Call deepseek',
 'Judge Contradiction Call deepseek','Reread Call deepseek','Alt Reread Call deepseek'];
const H_C=['R2 Alt Judge Enforcer Call deepseek','R2 Alt Judge Enforcer Retry Call deepseek','R2 Alt Judge Enforcer Resend Call deepseek','R2 Alt Reread Call deepseek'];
const B_E=['Enforcer Build','Anticheat Build','Close Enforcer Build','Judge Contradiction Build','Assume Check Build'];
const once=(s,a,b,who)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(who+': old text occurs '+k+' times');return s.replace(a,()=>b);};
const parse=(c,who)=>{try{acorn.parse('(async function(){'+c+'\n})',{ecmaVersion:'latest'});}catch(e){throw new Error(who+': '+e.message);}};
const P=[{old:DS_OLD,new:DS_NEW}];fs.writeFileSync(path.join(__dirname,'pairs_426.json'),JSON.stringify(P));
cp.execFileSync('node',[path.join(__dirname,'../a422a/lib_apply.cjs'),EI,CI,path.join(__dirname,'pairs_426.json'),EO+'.lib',CO+'.lib'],{stdio:'inherit'});
const http=(w,names,who)=>{const N={};w.nodes.forEach(n=>N[n.name]=n);for(const nm of names){const n=N[nm];if(!n)throw new Error(who+': no node '+nm);
 if(!/httpRequest$/.test(n.type))throw new Error(nm+': not http');if(n.parameters.url!==URL_OLD)throw new Error(nm+': url '+n.parameters.url);
 if(JSON.stringify(n.credentials)!==JSON.stringify(CRED_OLD))throw new Error(nm+': credential '+JSON.stringify(n.credentials));
 n.parameters.url=URL_NEW;n.credentials=JSON.parse(JSON.stringify(CRED_NEW));}
 const left=w.nodes.filter(n=>/httpRequest$/.test(n.type)&&n.parameters.url===URL_OLD).map(n=>n.name);return left;};
const E=ld(EO+'.lib');fs.unlinkSync(EO+'.lib');const C=ld(CO+'.lib');fs.unlinkSync(CO+'.lib');
const EN={};E.nodes.forEach(n=>EN[n.name]=n);
for(const nm of B_E){EN[nm].parameters.jsCode=once(EN[nm].parameters.jsCode,DS_OLD,DS_NEW,nm);parse(EN[nm].parameters.jsCode,nm);}
let rs=EN['Resolve Seats'].parameters.jsCode;rs=once(rs,RS_OLD1,RS_NEW1,'Resolve Seats 1');rs=once(rs,RS_OLD2,RS_NEW2,'Resolve Seats 2');parse(rs,'Resolve Seats');EN['Resolve Seats'].parameters.jsCode=rs;
const leftE=http(E,H_E,'engine'),leftC=http(C,H_C,'child');
// no node outside the lists still reads the enforcer seat from RS.deepseek
for(const [w,who] of [[E,'engine'],[C,'child']])for(const n of w.nodes){const s=n.parameters.jsCode;if(typeof s==='string'&&s.includes(DS_OLD))throw new Error(who+' '+n.name+': old ds line left');}
console.log('engine: library line 1, builds',B_E.length,', Resolve Seats 1, http',H_E.length,'| deepseek http left',leftE.length);
console.log('child: library line 1, http',H_C.length,'| deepseek http left',leftC.length);
fs.writeFileSync(path.join(__dirname,'left_deepseek_http.json'),JSON.stringify({engine:leftE,child:leftC},null,1));
fs.writeFileSync(EO,JSON.stringify(E));fs.writeFileSync(CO,JSON.stringify(C));
