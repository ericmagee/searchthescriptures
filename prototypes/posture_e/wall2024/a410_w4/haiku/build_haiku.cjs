// ASK 410 harness, step 1: build every request body. Usage: node build.cjs <a410 dir> <out requests.json>
// E-ASSUME: system line and body form of the live Assume Check Build; user = stored prompt_sent, unchanged.
// Plants: PROMPT of the live Assume Check Build + five built premise blocks (verse words from kjv_verses).
// D4: system = SYS + __JAGR of the live Judge Enforcer Build; user = stored prompt_sent, unchanged.
// Body: {model, max_tokens: max(model_config max_tokens 64000, 8000 or 16000) = 64000, temperature: 0, messages}. Only model differs. No reasoning or effort field.
const fs=require('fs'),path=require('path');
const D=process.argv[2],OUT=process.argv[3];
const acb=fs.readFileSync(path.join(D,'src_Assume_Check_Build.js'),'utf8');
const jeb=fs.readFileSync(path.join(D,'src_Judge_Enforcer_Build.js'),'utf8');
const grab=(src,name)=>{const i=src.indexOf('const '+name+'=');if(i<0)throw new Error('no '+name);const j=src.indexOf(';\n',i);return new Function(src.slice(i,j+1)+'\nreturn '+name+';')();};
const PROMPT=grab(acb,'PROMPT');
const SYS_A=(acb.match(/role:'system',content:'(You check whether quoted scripture states a fact\.[^']*)'/)||[])[1];
if(!SYS_A)throw new Error('no ACB system line');
const SYS_J=grab(jeb,'SYS')+grab(jeb,'__JAGR');
const MODELS=[{seat:'deepseek',api:'deepseek-flash',route:'deepseek'},{seat:'ember',api:'meta/muse-ember',route:'openrouter'},{seat:'hy4',api:'tencent/hy4',route:'openrouter'},{seat:'hy4_flash',api:'tencent/hy4-flash',route:'openrouter'},{seat:'haiku',api:'anthropic/claude-haiku-5.5',route:'openrouter'}];
const MT=64000;
const body=(api,sys,user)=>({model:api,max_tokens:MT,temperature:0,messages:[{role:'system',content:sys},{role:'user',content:user}]});
// plants
const V={m116:'And Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ.',m118:'Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost.',l24:'And Joseph also went up from Galilee, out of the city of Nazareth, into Judaea, unto the city of David, which is called Bethlehem; (because he was of the house and lineage of David:)'};
const PL=[
 {n:1,gold:'STATED',assumes:'Joseph was the husband of Mary.',block:'LINK 1: SUPPORTED\n- [L1] Matthew 1:16 "'+V.m116+'"\n- [L4] The genealogy names Joseph as Mary\'s husband.'},
 {n:2,gold:'NOT STATED',assumes:'Joseph was older than Mary.',block:'LINK 2: SUPPORTED\n- [L1] Matthew 1:16 "'+V.m116+'"\n- [L1] Luke 2:4 "'+V.l24+'"\n- [L4] A man of the house of David who travels to be taxed was the elder of the two.'},
 {n:3,gold:'INFERRED ACT',assumes:'Joseph begat Jesus.',block:'LINK 3: SUPPORTED\n- [L1] Matthew 1:16 "'+V.m116+'"\n- [L4] The line runs through Joseph, so the begetting runs through him.'},
 {n:4,gold:'NOT STATED',assumes:'Joseph was the husband of Mary and Joseph was older than Mary.',block:'LINK 4: SUPPORTED\n- [L1] Matthew 1:16 "'+V.m116+'"\n- [L4] The husband named in the genealogy was the elder.'},
 {n:5,gold:'STATED',assumes:'the husband of Mary was of the house of David.',block:'LINK 5: SUPPORTED\n- [L1] Matthew 1:16 "'+V.m116+'"\n- [L1] Luke 2:4 "'+V.l24+'"\n- [L4] Read together, the husband of Mary is the Joseph who was of the house and lineage of David.'}];
const plantUser=PROMPT+'\n\n'+PL.map(p=>'######## CHALLENGER PREMISE '+p.n+' (listed against the challenger, LINK '+p.n+') ########\nASSUMES: '+p.assumes+'\nROWS GIVE (as the lister wrote them): (none)\n\nTHE ANSWERING BLOCK, [DR3] LINK '+p.n+':\n'+p.block).join('\n\n');
const EA=JSON.parse(fs.readFileSync(path.join(D,'eassume_prompts.json'))).filter(x=>x.prompt_sent&&x.prompt_sent.length>200);
const D4=JSON.parse(fs.readFileSync(path.join(D,'d4_items.json')));
const D4ID=JSON.parse(fs.readFileSync(path.join(D,'d4_item_ids.json')));
const items=[];
for(const x of EA)items.push({set:'EA',src:x.id,run_token:x.run_token,sys:SYS_A,user:x.prompt_sent});
items.push({set:'PL',src:'plants',sys:SYS_A,user:plantUser,plants:PL.map(p=>({n:p.n,gold:p.gold,assumes:p.assumes}))});
// D4: one call per distinct prompt; items sharing a prompt are scored from the same reply
const seen={};for(const x of D4){const k=x.prompt_sent;if(!seen[k]){seen[k]={set:'D4',src:x.id,sys:SYS_J,user:k,rows:[]};items.push(seen[k]);}seen[k].rows.push({row:x.id,rule:x.rule,item_id:D4ID[x.id],seat:x.seat});}
const reqs=[];
for(const it of items)for(const m of MODELS)for(const rep of [1,2])reqs.push({key:it.set+'_'+it.src+'_'+m.seat+'_r'+rep,set:it.set,src:it.src,seat:m.seat,route:m.route,rep,rows:it.rows,plants:it.plants,body:body(m.api,it.sys,it.user)});
fs.writeFileSync(OUT,JSON.stringify(reqs));
const ch=reqs.reduce((a,r)=>a+r.body.messages.reduce((b,m)=>b+m.content.length,0),0);
console.log('items',items.length,'(EA',EA.length,'PL 1, D4 calls',items.filter(i=>i.set==='D4').length,') requests',reqs.length,'input chars',ch,'~tokens',Math.round(ch/3.6));
console.log('SYS_A',SYS_A.length,'SYS_J',SYS_J.length,'PROMPT',PROMPT.length,'plant user',plantUser.length);
