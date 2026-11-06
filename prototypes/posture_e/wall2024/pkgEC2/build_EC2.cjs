// pkgEC2 build: the E-ANS / E-PREM cure reading (W3 Wall 2446) in Send Back Record and Alt Send Back Record, RECORD-ONLY.
// Each E-ANS and E-PREM send-back row gets " | CURE (record-only until promoted): CURED|UNCURED -- why" on cure_reason; cure_status stays null,
// counts and results do not change. Base: the live nodes from the saved workflow (pkgEC2/base). Anchors are asserted once each.
const fs=require('fs'),cr=require('crypto');const D=__dirname;
const LIB=fs.readFileSync(D+'/../pkgPS/psGrades.js','utf8').trim()+'\n'+fs.readFileSync(D+'/enf428Cure.js','utf8').trim()+'\n';
const ROUNDS="let __RD=null;for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){try{if($(n).isExecuted)for(const it of $(n).all()){const c=it.json&&it.json.cure;if(c&&c.rounds){__RD=c.rounds;break;}}}catch(e){}if(__RD)break;} /* pkgEC2: the rounds, read as Judge Enforcer Build reads them */\n";
const one=(s,a,b)=>{const k=s.split(a).length-1;if(k!==1)throw new Error('anchor x'+k+': '+a.slice(0,60));return s.replace(a,()=>b);};
const sha=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,16);const plan={};
for(const f of ['Send_Back_Record.js','Alt_Send_Back_Record.js']){let s=fs.readFileSync(D+'/base/'+f,'utf8');const base=sha(s);
 s=one(s,"B.forEach((b,ci)=>{let txt=''",LIB+ROUNDS+"B.forEach((b,ci)=>{let txt=''");
 s=one(s," (b.items||[]).forEach((it,k)=>{const a=A[it.sid];const ans=a?a.ans:'NO ANSWER';tally[ans]++;",
  " (b.items||[]).forEach((it,k)=>{const a=A[it.sid];const ans=a?a.ans:'NO ANSWER';tally[ans]++;\n  let __ec=null;if(it.rule==='E-ANS'||it.rule==='E-PREM'){try{const nm=it.rule==='E-PREM'?new Set((b.items||[]).filter(y=>y.rule==='E-PREM'&&String(y.line)===String(it.line)).map(y=>+((String(y.item||'').match(/(\\d+)\\s*$/)||[])[1]))):null;\n   __ec=__RD?enf428Cure({rule:it.rule,item:it.item,line:it.line,reason:it.reason},a||{ans:'NO ANSWER'},__RD,nm):{status:'UNREAD',why:'no rounds found in the Panel Cure Normalize nodes'};}catch(e){__ec={status:'UNREAD',why:'cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* pkgEC2 (W3 2446): record-only */");
 s=one(s,"named?' | WRITTEN, NOT READ: the reply names '+it.sid+' but no SENDBACK line could be read; not silence, not counted':''),at:T});",
  "named?' | WRITTEN, NOT READ: the reply names '+it.sid+' but no SENDBACK line could be read; not silence, not counted':'')+(__ec?' | CURE (record-only until promoted): '+__ec.status+' -- '+String(__ec.why).slice(0,400):''),at:T});");
 fs.writeFileSync(D+'/patched/'+f,s);plan[f.replace('.js','').replace(/_/g,' ')]={file:'pkgEC2/patched/'+f,base_sha:base,final_sha:sha(s)};}
fs.writeFileSync(D+'/plan_EC2.json',JSON.stringify(plan,null,1));console.log(JSON.stringify(plan));
