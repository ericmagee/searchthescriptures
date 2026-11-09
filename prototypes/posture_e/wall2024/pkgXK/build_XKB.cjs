// pkgXK stage B (WALL-3617 final list item 1, approved by the operator 16:27Z 11-09): JSON cure answers for checked models; the line reader stays the one reader and the fallback.
// 1. cureBody: for an OpenRouter cure call whose model is on the JSON list, the request carries response_format json_schema "cure_lines" and a format note on the last user message.
//    Every other model (and Gemini) is sent exactly as live.
// 2. cureText: a reply that parses as {cure_lines:[{kind,item,text},...]} is turned back into the lines the line reader already reads, in the model's order:
//    RESPONSE -> "RESPONSE: <item> | <text>", STATEMENT -> "STATEMENT: <item> | <text>", OTHER -> "<text>". Any other reply (plain lines, bad JSON, other JSON) is returned unchanged,
//    so a model that ignores the format falls back to the line reader with no loss.
// 3. fumAsk2024: the follow-up repeats the format note when the first cure call carried the schema.
// The JSON list is set at build time: XK_JSON_MODELS="id1,id2" node pkgXK/build_XKB.cjs. W4's check calls decide it; a model that fails its check is left off.
// Run from wall2024/: node pkgXK/build_XKB.cjs [base strip] [out strip]
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'pkgLIB/strip_XK',OUT=process.argv[3]||'pkgLIB/strip_XKB';
const MODELS=(process.env.XK_JSON_MODELS!=null?process.env.XK_JSON_MODELS:'openai/gpt-6.1-terra,openai/gpt-6.1-sol,openai/gpt-6-luna,anthropic/claude-haiku-5.5').split(',').map(s=>s.trim()).filter(Boolean);
const sub=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': '+n+' hits for '+a.slice(0,70));return s.split(a).join(b);};
const NOTE="\n\nANSWER FORMAT: return one JSON object with one key, cure_lines: an array holding, in order, every line the request above asks for. Each entry is {\"kind\": \"RESPONSE\" or \"STATEMENT\" or \"OTHER\", \"item\": the item exactly as labelled above (\"\" for OTHER), \"text\": for RESPONSE and STATEMENT what you would write after the | sign, for OTHER the whole line}. A K-RUL card is five OTHER entries (RULING, CLAIM, NAMED BY, RULE, APPLIED, each a whole line) placed right after that item's RESPONSE entry. Write nothing outside the JSON.";
const FNS="/* pkgXK stage B: JSON cure answers. Functions, so they are hoisted wherever cureBody, cureText or fumAsk2024 runs. */\n"+
 "function xkJsonModels(){return "+JSON.stringify(MODELS)+";}\n"+
 "function xkJsonNote(){return "+JSON.stringify(NOTE)+";}\n"+
 "function xkRF(){return {type:'json_schema',json_schema:{name:'cure_lines',strict:true,schema:{type:'object',additionalProperties:false,required:['cure_lines'],properties:{cure_lines:{type:'array',items:{type:'object',additionalProperties:false,required:['kind','item','text'],properties:{kind:{type:'string',enum:['RESPONSE','STATEMENT','OTHER']},item:{type:'string'},text:{type:'string'}}}}}}}};}\n"+
 "function xkJson2024(t){if(typeof t!=='string')return t;const s=t.trim().replace(/^```(?:json)?\\s*/i,'').replace(/\\s*```$/,'');if(!/^\\{[\\s\\S]*\\}$/.test(s)||s.indexOf('cure_lines')<0)return t;let o;try{o=JSON.parse(s);}catch(e){return t;}\n"+
 " if(!o||!Array.isArray(o.cure_lines)||!o.cure_lines.length||!o.cure_lines.every(e=>e&&typeof e==='object'&&typeof e.kind==='string'&&typeof e.text==='string'))return t;\n"+
 " const one=v=>String(v==null?'':v).replace(/\\s*\\n\\s*/g,' ').trim();\n"+
 " return o.cure_lines.map(e=>{const k=e.kind.toUpperCase();return (k==='RESPONSE'||k==='STATEMENT')?k+': '+one(e.item)+' | '+one(e.text):one(e.text);}).join('\\n');}\n";
const TXT0=" if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {ok:true,text:j.choices[0].message.content,finish:j.choices[0].finish_reason||null};";
const TXT1=" if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {ok:true,text:xkJson2024(j.choices[0].message.content),finish:j.choices[0].finish_reason||null}; /* pkgXK B */";
const BOD0="if(b.response_format)delete b.response_format;";
const BOD1=BOD0+"\n if(fam!=='gemini'&&xkJsonModels().includes(String(b.model||''))&&b.messages.length){b.response_format=xkRF();const L=b.messages[b.messages.length-1];b.messages[b.messages.length-1]=Object.assign({},L,{content:String(L.content==null?'':L.content)+xkJsonNote()});} /* pkgXK B */";
const FUM0="{role:'user',content:P.join('\\n')}])})};";
const FUM1="{role:'user',content:P.join('\\n')+((src.body.response_format&&src.body.response_format.type==='json_schema')?xkJsonNote():'')}])})}; /* pkgXK B */";
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,json_models:MODELS,library:{}};let nB=0,nT=0,nF=0;
for(const f of fs.readdirSync(BASE+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(BASE+'/patched/'+f,'utf8');let s=s0;
 const hasT=s.includes('function cureText(j){'),hasB=s.includes('function cureBody(fam,body,answer,ask){'),hasF=s.includes(FUM0);
 if((hasT||hasB||hasF)&&!(hasT&&hasB))throw new Error(f+': cureText and cureBody not both present');
 if(hasT){s=sub(s,'function cureText(j){\n'+TXT0,FNS+'function cureText(j){\n'+TXT1,f);nT++;}
 if(hasB){s=sub(s,'function cureBody(fam,body,answer,ask){',"function cureBody(fam,body,answer,ask){",f);const i=s.indexOf('function cureBody(fam,body,answer,ask){');const j=s.indexOf(BOD0,i);if(j<0||j-i>600)throw new Error(f+': delete line not in cureBody');s=s.slice(0,j)+BOD1+s.slice(j+BOD0.length);if(s.split(BOD0).length-1!==1)throw new Error(f+': delete line count');nB++;}
 if(hasF){s=sub(s,FUM0,FUM1,f);nF++;}
 if(s!==s0)new Function('$','$input','return (async()=>{\n'+s+'\n})();');
 fs.writeFileSync(OUT+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgXK/plan_XKB.json',JSON.stringify(plan,null,1)+'\n');console.log('library',Object.keys(plan.library).length,'changed',Object.values(plan.library).filter(x=>x.base!==x.patched).length,'cureText',nT,'cureBody',nB,'fumAsk',nF,'models',MODELS.join(','));
