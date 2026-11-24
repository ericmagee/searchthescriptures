// ASK 608 build (W4): ruling 537, the enforcer is never of a debater's family. Resolve Seats only. Base: live engine fbc09389 (ask611/w4/write/fetchback_eng611.json).
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const BE=process.env.B608E||'/mnt/project-files/ask611/w4/write/fetchback_eng611.json';
const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const once=(s,a,b,what)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(what+': anchor occurs '+k+' times');return s.replace(a,()=>b);};
const n=E.nodes.find(x=>x.name==='Resolve Seats');let c=n.parameters.jsCode;
// 1. After the debaters' families (debFam) and the reserve are known, before the alternates: pick the enforcer.
const A1="const alternates=(S.alt_order||[])";
const BK=process.env.B608K||'hy4'; // the operator's backup enforcer seat (card cmsg_017ZQamDMHrS6fqMHnQDVo583Yf5QjhZGmhXT6VgaKq3Yr)
const PICK="const __EF608=(()=>{const fo=k=>{const x=M[k];return x&&x.family?String(x.family).trim().toLowerCase():'';};if(debFam.indexOf(fo('luna'))<0)return {seat:'luna',x:enf};"
 +"const k='"+BK+"';const x=M[k];const why='luna is of family '+fo('luna')+', which debates in this debate';"
 +"if(!x||!x.api_model||!(Number(x.max_tokens)>0)||JFAM[k]!=='openrouter')fail('ENFORCER: '+why+', and the backup enforcer seat \""+BK+"\" has no active OpenRouter model_config row with api_model and max_tokens (ASK 608).');"
 +"if(!fo(k)||debFam.indexOf(fo(k))>=0)fail('ENFORCER: '+why+', and the backup enforcer seat \""+BK+"\" is of family '+(fo(k)||'(none)')+', which may not enforce here (ASK 608).');"
 +"if([...(S.panel_order||[]),S.panel_reserve,S.single_judge].indexOf(k)>=0)fail('ENFORCER: '+why+', and the backup enforcer seat \""+BK+"\" is seated as a judge in this run (ASK 608).');"
 +"return {seat:k,x,barred:why};})(); /* ASK 608: ruling 537, the enforcer is never of a debater's family; luna stays unless barred, else the operator's backup seat */\n"
 +"if(__EF608.barred)$execution.customData.set('enforcer_seat',__EF608.seat); /* ASK 608 */\n";
c=once(c,A1,PICK+A1,'debaters line');
// 2. The chosen enforcer never also stands as an alternate in this run.
const ALT_END=".filter(a=>!__SM601(a.api_model));";
c=once(c,ALT_END,".filter(a=>!__SM601(a.api_model)).filter(a=>a.seat!==__EF608.seat); /* ASK 608: the enforcer is not an alternate */",'alternates line');
// 3. Output
const O="enforcer:{seat:'luna',api_model:enf.api_model,max_tokens:Number(enf.max_tokens)}";
c=once(c,O,"enforcer:{seat:__EF608.seat,api_model:__EF608.x.api_model,max_tokens:Number(__EF608.x.max_tokens)},...(__EF608.barred?{enforcer_barred:{seat:'luna',why:__EF608.barred}}:{})",'output');
n.parameters.jsCode=c;
const s=JSON.stringify(E);fs.writeFileSync(__dirname+'/target_engine_608.json',s);console.log('engine',md5(s).slice(0,8));
