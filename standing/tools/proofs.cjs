// ASK 596 proofs 5 and 7 (W4): changed copies are written to a scratch folder, run, and deleted. Usage: node tools/proofs.cjs <engine> <child> <scratchdir>
const fs=require('fs');const path=require('path');const cp=require('child_process');const lp=require('/mnt/project-files/ask588/w4/build/libpatch.js');
const [ef,cf,tmp]=process.argv.slice(2);const run=(e,c)=>cp.spawnSync('node',[path.join(__dirname,'..','run.cjs'),e,c],{encoding:'utf8'}).stdout;
const W=()=>JSON.parse(fs.readFileSync(ef,'utf8'));const out=[];
// proof 7a: a new builder node that cuts flagged_line in the value
{const E=W();E.nodes.push({name:'Proof7 New Builder',type:'n8n-nodes-base.code',parameters:{jsCode:"const dis=[];for(const __q of $input.all().map(i=>i.json))dis.push({seat:__q.seat,rule:'E-NEW',flagged_line:__q.line.slice(0,1500),response_line:__q.line});return dis.map(json=>({json}));"},position:[0,0]});
 const f=path.join(tmp,'p7a_eng.json');fs.writeFileSync(f,JSON.stringify(E));const r=run(f,cf);fs.unlinkSync(f);out.push(['7a new builder, cut in the value',r.split('\n').filter(l=>/^FAIL|^STANDING/.test(l)).join('\n')]);}
// proof 7b: a new builder whose producer function cuts the line it hands on
{const E=W();E.nodes.push({name:'Proof7 Producer Builder',type:'n8n-nodes-base.code',parameters:{jsCode:"const hits=(t)=>{const out=[];for(const l of String(t).split('\\n'))out.push({line:l.slice(0,1200),hit:true});return out;};const dis=[];for(const __h of hits($json.verdict_raw))dis.push({seat:'x',rule:'E-NEW2',flagged_line:__h.line,response_line:__h.line});return dis.map(json=>({json}));"},position:[0,0]});
 const f=path.join(tmp,'p7b_eng.json');fs.writeFileSync(f,JSON.stringify(E));const r=run(f,cf);fs.unlinkSync(f);out.push(['7b new builder, cut in the producer',r.split('\n').filter(l=>/^FAIL|^STANDING/.test(l)).join('\n')]);}
// proof 7c: a new untraceable place (value from another node)
{const E=W();E.nodes.push({name:'Proof7 Untraced',type:'n8n-nodes-base.code',parameters:{jsCode:"const z=$('Somewhere').first().json;return [{json:{flagged_line:z.line}}];"},position:[0,0]});
 const f=path.join(tmp,'p7c_eng.json');fs.writeFileSync(f,JSON.stringify(E));const r=run(f,cf);fs.unlinkSync(f);out.push(['7c new untraced place',r.split('\n').filter(l=>/^FAIL|^STANDING/.test(l)).join('\n')]);}
// proof 7d (W1 F2): a new node makes items whose line is cut, and another node stores that line as flagged_line
{const E=W();E.nodes.push({name:'Proof7d Item Maker',type:'n8n-nodes-base.code',parameters:{jsCode:"const items=[];for(const t of String($json.verdict_raw).split('\\n'))items.push({rule:'K-NEW',line:t.trim().slice(0,333)});return [{json:{items}}];"},position:[0,0]});
 E.nodes.push({name:'Proof7d Recorder',type:'n8n-nodes-base.code',parameters:{jsCode:"const rows=[];for(const it of $('Proof7d Item Maker').first().json.items)rows.push({kind:'send_back',flagged_line:it.line});return rows.map(json=>({json}));"},position:[0,0]});
 const f=path.join(tmp,'p7d_eng.json');fs.writeFileSync(f,JSON.stringify(E));const r=run(f,cf);fs.unlinkSync(f);out.push(['7d cut in another node (item maker), stored by a recorder',r.split('\n').filter(l=>/^FAIL|^STANDING/.test(l)).join('\n')]);}
// proof 5: a marker renamed in a copy of the library (cureSafe, LIB line of ert386)
{const E=W();const {L}=lp.cut(E);const i=L.findIndex(l=>l.includes('const cureSafe=s=>String(s).replace(/[\\r'));lp.apply(E,[{line:i,a:'const cureSafe=s=>String(s).replace(',b:'const cureSafeRENAMED=s=>String(s).replace(',what:'proof 5'}]);
 const f=path.join(tmp,'p5_eng.json');fs.writeFileSync(f,JSON.stringify(E));const r=run(f,cf);fs.unlinkSync(f);out.push(['5 marker renamed (LIB '+i+')',r.split('\n').filter(l=>/^FAIL|^STANDING/.test(l)).join('\n')]);}
for(const [k,v] of out)console.log('== PROOF '+k+'\n'+v);
