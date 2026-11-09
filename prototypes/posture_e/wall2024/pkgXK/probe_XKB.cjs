// pkgXK stage B probe: JSON cure answers read through the same line reader. Run from wall2024/: node pkgXK/probe_XKB.cjs
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const A='pkgLIB/strip_XK/patched/',B='pkgLIB/strip_XKB/patched/';const R=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);c?ok++:bad++;};
const grab=(s,n)=>{const i=s.indexOf('function '+n+'(');if(i<0)throw new Error('no '+n);return s.slice(i,s.indexOf('\nfunction ',i+10)>0?s.indexOf('\nfunction ',i+10):undefined);};
const lib=(D,names,pre)=>{const s=R(D+'Cure_Build.js');return new Function((pre||'')+names.map(n=>grab(s,n)).join('\n')+';return {'+names.join(',')+'};')();};
// 1-3. cureBody
{const a=lib(A,['cureBody']),b=lib(B,['cureBody','xkJsonModels','xkJsonNote','xkRF']);const body=m=>({model:m,messages:[{role:'system',content:'S'},{role:'user',content:'U'}],response_format:{type:'json_object'},temperature:0});
 for(const m of ['openai/gpt-6.1-terra','openai/gpt-6.1-sol','openai/gpt-6-luna','anthropic/claude-haiku-5.5']){const x=b.cureBody('openrouter',body(m),'ANS','ASK'),y=a.cureBody('openrouter',body(m),'ANS','ASK');
  T(x.response_format&&x.response_format.type==='json_schema'&&x.response_format.json_schema.name==='cure_lines'&&x.messages.length===y.messages.length&&x.messages.at(-1).content==='ASK'+b.xkJsonNote()&&JSON.stringify(x.messages.slice(0,-1))===JSON.stringify(y.messages.slice(0,-1)),m+': cure call carries the cure_lines schema and the format note; every other message as stage A');}
 T(JSON.stringify(b.cureBody('openrouter',body('x-ai/grok-4.7'),'ANS','ASK'))===JSON.stringify(a.cureBody('openrouter',body('x-ai/grok-4.7'),'ANS','ASK')),'a model not on the list (grok): request byte-equal to stage A');
 const g={contents:[{role:'user',parts:[{text:'U'}]}]};T(JSON.stringify(b.cureBody('gemini',g,'ANS','ASK'))===JSON.stringify(a.cureBody('gemini',g,'ANS','ASK')),'Gemini: request byte-equal to stage A');}
// 4-7. real data: terra's 34016 Panel 2 cure reply, sent back as cure_lines JSON, reads the same as the stored line reply
const c0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Call_2_openrouter.json'))[0].data.main[0][0].json;const t0=c0.choices[0].message.content;
const r0=JSON.parse(t0.trim().replace(/^```(?:json)?\s*|\s*```$/g,'')).reasoning;
const toJ=txt=>JSON.stringify({cure_lines:txt.split('\n').filter(l=>l.trim()).map(l=>{const m=l.match(/^\s*(RESPONSE|STATEMENT)\s*:\s*(.*?)\s*\|\s*(.*)$/i);return m?{kind:m[1].toUpperCase(),item:m[2],text:m[3]}:{kind:'OTHER',item:'',text:l.trim()};})});
const run=(D,content)=>{const c=JSON.parse(JSON.stringify(c0));c.choices[0].message.content=content;const H=harness('34016',{'Panel Cure Call 2 openrouter':[{json:c}]});
 const n=H(R(D+'Panel_Cure_Normalize_2.js'),'Panel Cure Call 2 openrouter');return harness('34016',{'Panel Cure Normalize 2':n})(R(D+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6.1-terra');};
const sr=x=>JSON.stringify(x,(k,v)=>(k==='at'||k==='full_reply')?undefined:v);
{const a=run(A,t0),b=run(B,t0);T(sr(a)===sr(b)&&JSON.stringify(a.map(r=>r.full_reply))===JSON.stringify(b.map(r=>r.full_reply)),'stored reply (no cure_lines): every row byte-equal to stage A ('+a.length+' rows)');}
{const a=run(A,r0),b=run(B,toJ(r0));const st=L=>L.map(r=>r.item+'='+r.cure_status).join(', ');console.log('  '+st(b));
 T(sr(a)===sr(b),'the same answers sent as cure_lines JSON read item for item as the line reply ('+b.length+' rows; full_reply aside)');}
{const J=JSON.parse(toJ(r0));const one=J.cure_lines.find(e=>e.kind==='RESPONSE');const nl=JSON.stringify({cure_lines:J.cure_lines.map(e=>e===one?Object.assign({},e,{text:e.text.replace(/ /,'\n')}):e)});
 const a=run(A,r0),b=run(B,'```json\n'+nl+'\n```');T(sr(a)===sr(b),'cure_lines in a json code fence, with a line break inside one answer: same reading');}
{/* rev 3: a reply cut off inside entry n keeps entries 0..n-1; it must read exactly as the line reply holding those same lines */
 const J=JSON.parse(toJ(r0)).cure_lines;const full=toJ(r0);const ix=[Math.floor(J.length/2),J.length-1,1];
 for(const n of ix){const pre=JSON.stringify({cure_lines:J.slice(0,n)}).slice(0,-2);const ent=JSON.stringify(J[n]);const cut=pre+(n?',':'')+ent.slice(0,Math.max(5,Math.floor(ent.length/2)));
  const lines=J.slice(0,n).map(e=>e.kind==='OTHER'?e.text:e.kind+': '+e.item+' | '+e.text).join('\n');const a=run(A,lines),b=run(B,cut);
  T(sr(a)===sr(b)&&b.length>0,'cut-off cure_lines JSON inside entry '+n+' of '+J.length+': keeps the '+n+' complete entries and reads as the line reply holding them');}
 const head='{"cure_lines":[{"kind":"RESP';const a=run(A,head),b=run(B,head);T(sr(a)===sr(b),'cut-off before any complete entry: left as text, read as stage A reads it');}
// 8. fumAsk follow-up repeats the note only when the first call carried the schema
{const s=R(B+'Panel_Cure_Normalize_2.js');const f=new Function('const cureVerdicts=()=>[{rule:"K-W",side:"DEFENDER",link:"D2 #2",status:"UNCURED",why:"no written response",silent:true}];'+['fumAsk2024','xkJsonNote','xkRF'].map(n=>grab(s,n)).join('\n')+';return {fumAsk2024,xkJsonNote,xkRF};')();
 const src=rf=>({body:Object.assign({model:'openai/gpt-6.1-terra',messages:[{role:'user',content:'ASK'}]},rf?{response_format:rf}:{}),items:[{rule:'K-W'}]});const rep={ok:true,text:'x'};
 const y=f.fumAsk2024(src(f.xkRF()),rep,true),n=f.fumAsk2024(src(null),rep,true);
 T(y&&y.body.messages.at(-1).content.endsWith(f.xkJsonNote())&&y.body.response_format.type==='json_schema'&&n&&!n.body.messages.at(-1).content.includes('cure_lines'),'FUM follow-up: format note added when the first call carried the schema, not otherwise');}
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
