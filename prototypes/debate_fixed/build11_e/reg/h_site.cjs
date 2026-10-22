// Probe harness (Worker_A3, drift BB-7414; 2c: the parsed judge object v passed in, here with no counted_premises fields): the build's call sites run from each node's own source, so a probe that undoes one call
// site changes this output. Usage: node h_site.cjs <dir> <report27665.md>
const fs=require('fs');const [dir,rep]=process.argv.slice(2);const md=fs.readFileSync(rep,'utf8');
const rd=n=>fs.readFileSync(dir+'/'+n+'.js','utf8');
const sec=h=>{const i=md.indexOf(h);const j=md.indexOf('\n## ',i+5);return md.slice(i,j);};
const sent=md.slice(md.indexOf('## What the judges were sent'));
const T1=sent.slice(sent.indexOf('### Text 1'),sent.indexOf('### Text 2'));const T2=sent.slice(sent.indexOf('### Text 2'),sent.indexOf('### Cure call'));
const hdr=t=>({d:+(t.match(/\*\*Defense standing:\*\* [A-Z-]+, (\d+)/)||[0,0])[1],c:+(t.match(/\*\*Challenge standing:\*\* [A-Z-]+, (\d+)/)||[0,0])[1],
 ds:(t.match(/\*\*Defense standing:\*\* ([A-Z-]+)/)||[0,'SELF-SUPPORTED'])[1],cs:(t.match(/\*\*Challenge standing:\*\* ([A-Z-]+)/)||[0,'PROP-DEPENDENT'])[1]});
const stub=nodes=>n=>{if(!(n in nodes))return {first(){throw new Error('not run: '+n)},all(){throw new Error('not run: '+n)},get isExecuted(){return false;}};return {first:()=>({json:nodes[n][0]}),all:()=>nodes[n].map(j=>({json:j})),isExecuted:true};};
const out=[];
// 1. ledger call sites in Panel Payloads and Alternate Payloads: the node's own lines from "let drvAsk" to "p.drv_uncured", with the
// node's own drv definitions, on Gemini's stored text and the panel's sent text.
for(const n of ['Panel_Payloads','Alternate_Payloads']){const s=rd(n);const a=s.indexOf('const DRV_REF=');const c=s.indexOf('function drvCheck(');
 let e=s.indexOf('\n',c);while(true){const nx=s.indexOf('\n',e+1);const line=s.slice(e+1,nx);if(/^[^\s}+\/]/.test(line))break;e=nx;}
 const i=s.indexOf('let drvAsk=false;');const j=s.indexOf('p.drv_uncured=DRV.items.length;',i);
 const t=sec('## Panel judge 1: Gemini');const h=hdr(t);
 const f=new Function('WT','jd','a','p','marks','v',s.slice(a,e)+'\n'+s.slice(i,j)+'\nreturn DRV.items.map(x=>x.rule+" "+x.link);');
 try{out.push(n+' items: '+f(t,{body:{messages:[{role:'user',content:T2}]}},{body:{messages:[{role:'user',content:T2}]}},{conceded_links:h.d,challenger_conceded_links:h.c,defense_standing:h.ds,challenge_standing:h.cs},[],{}).join(', '));}catch(x){out.push(n+' ERROR '+x.message);}}
// 2. Extract Independent Verdict, whole node, on the single judge's stored text and Text 1.
{const s=rd('Extract_Independent_Verdict');const t=sec('## Single judge: DeepSeek');const body=t.slice(t.indexOf('\n')+1);
 const $=stub({'Build Independent Verdict':[{verdictBody:{messages:[{role:'user',content:T1}]}}]});
 try{const r=new Function('$','$input',s)($,{first:()=>({json:{choices:[{message:{content:body},finish_reason:'stop'}]}})});
  out.push('Extract items: '+((r[0].json.debate_rule_violations||[]).filter(x=>x.rule==='K-G6').map(x=>x.link).join(', ')||'none'));}catch(x){out.push('Extract ERROR '+x.message);}}
// 3. the cure tails, whole node: one K-G6 item counted by the cure reply; the row's columns must carry the count and standing.
const K={rule:'K-G6',side:'DEFENDER',link:'DEFENDER premise 1',line:'premise 1: ... NOT NAMED: Psalm 132:11',conc:0,st:'SELF-SUPPORTED',L:6};
const reply={ok:true,text:'CORRECTED COUNT: DEFENDER 1\nCORRECTED STANDING: DEFENDER PROP-DEPENDENT'};const cure={idx:0,who:'alternate',k:0,broken:{DEFENDER:[],CHALLENGER:[]},rounds:{}};
const pay={verdict_raw:'{}',verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:1,drv_uncured:1};
const cols=p=>p.defense_standing+','+p.conceded_links+' | '+p.challenge_standing+','+p.challenger_conceded_links;
try{const r=new Function('$','$input',rd('Panel_Cure_Check'))(stub({'Panel Payloads':[{bodies:[JSON.stringify({payload:pay})],summary:[{seat:'gemini',drv:[K]}]}],'Panel Cure Normalize 1':[{cure,reply}],'Init Seats':[{}]}),null);
 out.push('Panel_Cure_Check columns: '+cols(JSON.parse(r[0].json.bodies[0]).payload));}catch(x){out.push('Panel_Cure_Check ERROR '+x.message);}
try{const r=new Function('$','$input',rd('Cure_Check'))(stub({'Extract Independent Verdict':[{...pay,independent_verdict_raw:'{}',debate_rule_violations:[K]}],'Cure Normalize':[{cure,reply}]}),null);
 out.push('Cure_Check columns: '+cols(r[0].json));}catch(x){out.push('Cure_Check ERROR '+x.message);}
try{const r=new Function('$','$input',rd('Alternate_Merge'))(stub({'Panel Cure Check':[{bodies:[JSON.stringify({payload:{...pay,judge_seat:'gemini'}})],summary:[{seat:'gemini'}]}],'Init Seats':[{}],
  'Alternate Payloads':[{alt:{seat:'alt1',idx:0,removed_seat:'gemini',qualify:false,api_model:'m'},ok:true,body:JSON.stringify({payload:pay}),drv:[K],summary:{seat:'alt1'}}],'Alternate Cure Normalize':[{cure,reply}]}),null);
 out.push('Alternate_Merge columns: '+cols(JSON.parse(r[0].json.bodies[0]).payload)+' | seated '+r[0].json.alternates_seated.length);}catch(x){out.push('Alternate_Merge ERROR '+x.message);}
console.log(out.join('\n'));
