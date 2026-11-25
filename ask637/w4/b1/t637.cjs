// ASK 637 tests (W4): C1 replay over every pairing, C2 synthetic, C3 map, C4 node diff, C5 tags. Usage: node t637.cjs base.json target.json fx/seats_fx.json
const fs=require('fs');const [,,BA,TG,FX]=process.argv;
const B=JSON.parse(fs.readFileSync(BA,'utf8')),T=JSON.parse(fs.readFileSync(TG,'utf8')),X=JSON.parse(fs.readFileSync(FX,'utf8'));
let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL',m);}};
const N=E=>Object.fromEntries(E.nodes.map(n=>[n.name,n]));const NB=N(B),NT=N(T);
const JO={version:6,panel:X.jo.filter(r=>r.list==='panel').sort((a,b)=>a.ord-b.ord).map(r=>r.seat),alternate:X.jo.filter(r=>r.list==='alternate').sort((a,b)=>a.ord-b.ord).map(r=>r.seat)};
const LIBTXT=NB['Shared Library'].parameters.jsCode;
const mk=(map,input)=>{const $=k=>{if(k==='Shared Library')return {params:{jsCode:LIBTXT}};if(!(k in map))return {isExecuted:false,first:()=>{throw new Error('no '+k)},all:()=>{throw new Error('no '+k)}};const v=map[k];return {isExecuted:true,first:()=>({json:v[0]}),all:()=>v.map(json=>({json}))};};
 const $input={first:()=>({json:input[0]}),all:()=>input.map(json=>({json}))};const $execution={id:'T637',mode:'manual',customData:{set(){}}};return {$,$input,$execution};};
const run=(code,ctx)=>new Function('$','$input','$execution',code)(ctx.$,ctx.$input,ctx.$execution);
const asked=(E,body,rows)=>{const c=mk({'Debate Start':[{body}],'Judge Order Read':[JO]},rows);return run(N(E)['Accept Build'].parameters.jsCode,c).map(o=>o.json.acc.seat);};
const seat=(body,seats,rows)=>{const AGR={seats:seats.map(s=>({seat:s,role:'judge',status:'ACCEPT',placed:true}))};const c=mk({'Judge Order Read':[JO],'Accept Models':rows},[{acc:AGR,src:{body}}]);
 const j=run(NB['Init Seats'].parameters.jsCode,c)[0].json;return {panel_order:j.panel_order,panel_reserve:j.panel_reserve,alt_order:j.alt_order,single_judge:j.single_judge};};
const IS=NB['Init Seats'].parameters.jsCode;
const ENG=new Function('return '+IS.match(/const ENG=(\{[^;]*\});/)[1])();const FAM=new Function('return '+IS.match(/const FAM_PANEL=(\{[^;]*\});/)[1])();
const ROWS=X.jfl;const R=Object.fromEntries(ROWS.map(r=>[r.seat,r]));
const MN=m=>String(m||'').trim().toLowerCase().replace(/^anthropic\//,'').replace(/\./g,'-');
// C1
const engines=Object.keys(ENG).filter(e=>e!=='deepseek');let pairs=0,cut=0,errs=[];let r42528=null;
for(const d of engines)for(const ch of engines){if(d===ch)continue;const body={topic:'t',defender:{engine:d,profile:'oracle'},challenger:{engine:ch,profile:'plain'}};
 let o,nw;try{o=asked(B,body,ROWS);nw=asked(T,body,ROWS);}catch(e){errs.push(d+'/'+ch+': '+e.message);continue;}pairs++;
 const gone=o.filter(s=>!nw.includes(s));ok(nw.every(s=>o.includes(s)),d+'/'+ch+' new asks a seat old did not');cut+=gone.length;
 const df=[FAM[d],FAM[ch]].filter(Boolean),both=FAM[d]==='anthropic'&&FAM[ch]==='anthropic',dm=[ENG[d].mc,ENG[ch].mc].map(k=>R[k]&&R[k].api_model).filter(Boolean).map(MN);
 gone.forEach(s=>ok((FAM[s]&&df.includes(FAM[s])&&!(FAM[s]==='anthropic'&&both))||(R[s]&&dm.includes(MN(R[s].api_model))),d+'/'+ch+' '+s+' cut without an Init Seats family or model drop'));
 let so,sn;try{so=JSON.stringify(seat(body,o,ROWS));sn=JSON.stringify(seat(body,nw,ROWS));}catch(e){so='ERR '+e.message;try{seat(body,nw,ROWS);sn='OK';}catch(e2){sn='ERR '+e2.message;}}
 ok(so===sn,d+'/'+ch+' seating differs: '+so+' vs '+sn);
 if(d==='hydrogen'&&ch==='spark')r42528={old:o,new:nw,gone,seat:sn};}
console.log('C1 pairings',pairs,'seats no longer asked (sum)',cut,'refused by both (Accept Build throws)',errs.length,errs.slice(0,3));
ok(pairs>100,'pairings run');
console.log('C1 42528 pairing',JSON.stringify(r42528));
ok(r42528&&JSON.stringify(r42528.gone.sort())===JSON.stringify(['argon','gemini','neon'])&&r42528.new.includes('sonnet'),'42528: gemini, argon, neon cut; sonnet asked');
// C2
{const body={topic:'t',defender:{engine:'claude',profile:'oracle'},challenger:{engine:'opus',profile:'plain'}};const o=asked(B,body,ROWS),nw=asked(T,body,ROWS);
 console.log('C2 claude/opus old',o.join(','),'new',nw.join(','));ok(o.includes('sonnet')&&!nw.includes('sonnet'),'C2 both anthropic: sonnet (claude_synthesis model) not asked');
 ok(nw.filter(s=>FAM[s]==='anthropic').length===o.filter(s=>FAM[s]==='anthropic'&&s!=='sonnet').length,'C2 both anthropic: other anthropic seats still asked');}
{const body={topic:'t',defender:{engine:'grok',profile:'oracle'},challenger:{engine:'glm',profile:'plain'}};const o=asked(B,body,ROWS),nw=asked(T,body,ROWS);ok(JSON.stringify(o)===JSON.stringify(nw),'C2 no barred seat in the order: asked set unchanged');}
{const body={topic:'t',defender:{engine:'hydrogen',profile:'oracle'},challenger:{engine:'spark',profile:'plain'}};
 const rows0=ROWS.map(r=>r.seat==='argon'?{...r,family:null}:r);const nw=asked(T,body,rows0);
 ok(nw.includes('argon'),'N1: a seat with no family (argon) is asked');
 const rows1=ROWS.map(r=>r.seat==='neon'?{...r,family:null,api_model:null}:r);
 const rows2=ROWS.filter(r=>r.seat!=='gemini');let t2=null,t1=null;try{asked(T,body,rows2);}catch(e){t2=e.message;}try{asked(B,body,rows2);}catch(e){t1=e.message;}
 console.log('N1 no-row case old:',t1,'| new:',t2);ok(t1&&t2&&t1===t2,'N1: a seat with no row fails closed as before');
 let t3=null,t4=null;try{asked(B,body,rows1);}catch(e){t3=e.message;}try{asked(T,body,rows1);}catch(e){t4=e.message;}console.log('N1 no-model case (neon) old:',t3,'| new:',t4);ok(t3===t4,'N1: a seat with no model behaves as before');}
// C3
const DS={claude:'claude_synthesis',deepseek:'deepseek_debate'};Object.keys(ENG).forEach(e=>ok((DS[e]||e)===ENG[e].mc,'C3 map for '+e));
// C4
const P=E=>Object.fromEntries(E.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const pb=P(B),pt=P(T);
const ch=Object.keys(pb).filter(k=>pb[k]!==pt[k]);ok(JSON.stringify(ch)===JSON.stringify(['Accept Build']),'C4 only Accept Build changes: '+ch);
ok(JSON.stringify(Object.keys(pb).sort())===JSON.stringify(Object.keys(pt).sort()),'C4 node set equal');ok(JSON.stringify(B.connections)===JSON.stringify(T.connections),'C4 connections equal');
try{new Function('$','$input','$execution',NT['Accept Build'].parameters.jsCode);ok(true);}catch(e){ok(false,'C4 compile '+e.message);}
// C5
const nt=NT['Accept Build'].parameters.jsCode,nb=NB['Accept Build'].parameters.jsCode;ok((nt.match(/ASK 637/g)||[]).length===1&&!/catch/.test(nt.replace(nb.slice(0,0),'').split('ASK 637')[0].slice(nb.indexOf("const seats")))&&(nt.match(/catch/g)||[]).length===(nb.match(/catch/g)||[]).length,'C5 one tag, no new catch');
console.log(pass+' pass, '+fail+' fail');console.log(fail?'FAILED':'ALL PASS');
