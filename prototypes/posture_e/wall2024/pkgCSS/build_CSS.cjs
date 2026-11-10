// pkgCSS rev 1 (W1; operator approved 23:45 CST 11-09, thread msg cmsg_017ZQamDMHrS6fqMHnQDVo58MBjAta9iDdbo7hSU2rhpZ2). Item A gap: one prompt held
// both sides and DeepSeek read only the challenger (W3 dry regrade 34299, finding 1). The closing enforcer is now called once per side:
//  - Close Enforcer Build: the instruction is replaced by a shorter one-side instruction (pkgCSS/prompt_side.txt; same rules, the live
//    "differs only in wording" exception kept); it returns one item per side whose closing round has text, each holding that side's
//    candidates and that side's four rounds only. The Call node already runs once per item.
//  - Close Enforcer Record: reads every Build item and every reply (paired by position), joins the reply lines, and logs both prompts and
//    both replies in the first row as before. One output item, same shape, so Panel Build, BIV and Judge Contradiction Build are unchanged.
//   node pkgCSS/build_CSS.cjs <live fetch-back> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const [,,IN,OUT]=process.argv;if(!IN||!OUT)die('usage');
let d=JSON.parse(fs.readFileSync(IN,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const P=fs.readFileSync(__dirname+'/prompt_side.txt','utf8').replace(/\n$/,'');
const cut=(s,a,b,rep,what)=>{const i=s.indexOf(a);if(i<0||s.indexOf(a,i+1)>=0)die(what+': start not unique');const j=s.indexOf(b,i);if(j<0)die(what+': end');return s.slice(0,i)+rep+s.slice(j);};
const one=(s,a,b,what)=>{const k=s.split(a).length-1;if(k!==1)die(what+': '+k+' hits');return s.replace(a,()=>b);};
const nb=d.nodes.find(z=>z.name==='Close Enforcer Build');let s=nb.parameters.jsCode;if(s.includes('pkgCSS'))die('Build already has pkgCSS');
s=cut(s,'const PROMPT="','const R=(lab,k)','const PROMPT='+JSON.stringify(P)+'; /* pkgCSS: one side per call */\n','PROMPT');
const SYSm=s.match(/messages:\[\{role:'system',content:('(?:[^'\\]|\\.)*')\}/);if(!SYSm)die('system text');
s=cut(s,'const cl=cands.length?','return [{json:{cec_skip:false','const SYS='+SYSm[1]+';\n',' user');
s=one(s,"return [{json:{cec_skip:false,body,links,cands,missing_rounds:miss,model:ds.api_model,run_token:S.run_token}}];",
 "const SD={DEFENDER:{src:'its DECLARED CHAIN in [CR1]',close:'CR4',r:[['CR1','cr1'],['CR2','cr2'],['CR3','cr3'],['CR4 -- THE DEFENDER\\'S CLOSING ROUND','cr4']]},CHALLENGER:{src:'its LINK blocks in [DR3]',close:'DR4',r:[['DR1','gr1'],['DR2','gr2'],['DR3','dr3'],['DR4 -- THE CHALLENGER\\'S CLOSING ROUND','dr4']]}};\n"+
 "const out=[];for(const sd of ['DEFENDER','CHALLENGER']){const X=SD[sd];if(!String(F[X.r[3][1]]||'').trim())continue;const cs=cands.filter(c=>c.side===sd);\n"+
 " const cl=cs.length?cs.map(c=>c.id+' -- '+c.side+' -- '+c.kind+' '+c.n+' -- EARLIER ['+c.earlier_round+'] \"'+c.earlier_q+'\" -- CLOSING ['+c.closing_round+'] \"'+c.closing_q+'\" -- named by '+c.by+(c.why?': '+c.why:'')).join('\\n'):'none';\n"+
 " const user=PROMPT+'\\n\\nCANDIDATES ALREADY NAMED (answer each one by its id):\\n'+cl+'\\n\\n######## THE '+sd+' ########\\nThe '+sd.toLowerCase()+'\\'s links: '+lk(sd)+' ('+X.src+'). Its closing round is ['+X.close+'].\\n\\n'+X.r.map(x=>R(x[0],x[1])).join('\\n\\n');\n"+
 " const body={model:ds.api_model,max_tokens:Math.max(Number(ds.max_tokens)||0,16000),temperature:0,messages:[{role:'system',content:SYS},{role:'user',content:user}]};\n"+
 " out.push({json:{cec_skip:false,side:sd,body,links,cands:cs,missing_rounds:miss,model:ds.api_model,run_token:S.run_token}});}\n"+
 "return out;",'return');
new Function('$','$input','return (async()=>{\n'+s+'\n})();');nb.parameters.jsCode=s;
const nr=d.nodes.find(z=>z.name==='Close Enforcer Record');let t=nr.parameters.jsCode;if(t.includes('pkgCSS'))die('Record already has pkgCSS');
t=one(t,"const B=$('Close Enforcer Build').first().json;","const BA=$('Close Enforcer Build').all().map(x=>x.json);const B=BA[0]; /* pkgCSS: one Build item per side */",'B');
t=one(t,"const links=B.links||cecLinks(F);const cands=B.cands||[];const prompt=(((B.body||{}).messages||[])[1]||{}).content||null;",
 "const links=B.links||cecLinks(F);const cands=BA.flatMap(b=>b.cands||[]);const prompt=BA.map(b=>(((b.body||{}).messages||[])[1]||{}).content||'').filter(Boolean).join('\\n\\n######## NEXT CALL (pkgCSS) ########\\n\\n')||null;",'links');
t=one(t,"const r=$input.first().json||{};let txt=null,err=null;try{txt=String(r.choices[0].message.content||'');}catch(e){err='no reply ('+String((r.error&&(r.error.message||r.error))||r.message||'unknown').slice(0,200)+')';}",
 "let txt=null,err=null;{const TX=[],ER=[];$input.all().forEach((it,k)=>{const r=it.json||{};const sd=(BA[k]||{}).side||('call '+(k+1));try{TX.push(String(r.choices[0].message.content||''));}catch(e){ER.push(sd+': no reply ('+String((r.error&&(r.error.message||r.error))||r.message||'unknown').slice(0,200)+')');}});if(TX.length)txt=TX.join('\\n');if(ER.length)err=ER.join('; ');}",'reply');
new Function('$','$input','return (async()=>{\n'+t+'\n})();');nr.parameters.jsCode=t;
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(OUT+': 418 nodes; changed Close Enforcer Build ('+(s.length)+'), Close Enforcer Record ('+t.length+')');
