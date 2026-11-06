// pkgKC2 test. Run from wall2024/: node pkgKC2/test_KC2.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{console.log((c?'OK  ':'FAIL')+' '+n);c?ok++:bad++;};
const plan=JSON.parse(rd('pkgKC2/plan_KC2.json'));
T('22 nodes; base shas = plan.base (pkgACR/patched, 5ff59ac), final shas = pkgKC2/patched',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(''+plan.base+'/'+n.file))===n.base_sha&&sha(rd('pkgKC2/patched/'+n.file))===n.final_sha));
T('every node: K-CON LIVE, no K-CON TRIAL left, K-CON item text says LIVE',plan.nodes.every(n=>{const t=rd('pkgKC2/patched/'+n.file);return t.includes("'K-CON':'LIVE'")&&!t.includes("'K-CON':'TRIAL'")&&t.includes('REASSERTED IN with the quote. LIVE rule: left uncured after the cure, it removes the seat.')&&!t.includes('REASSERTED IN with the quote. TRIAL rule');}));
T('reversing the edits gives the base byte for byte',plan.nodes.every(n=>{let t=rd('pkgKC2/patched/'+n.file).replace("'K-CON':'LIVE'","'K-CON':'TRIAL'").split('REASSERTED IN with the quote. LIVE rule: left uncured after the cure, it removes the seat.').join('REASSERTED IN with the quote. TRIAL rule: answer it in the cure; it removes no seat.').replace(' return [...V.values()].filter(v=>new Set(v.by).size>=2); /* pkgKC2 (a): a VC needs two seats that wrote the pair */}',' return [...V.values()];}');return t===rd(''+plan.base+'/'+n.file);}));
// unit: vcBuild2024 of the patched Panel Payloads, one seat vs two seats writing the pair
{const S=rd('pkgKC2/patched/Panel_Payloads.js');const grab=n=>{const i=S.indexOf('function '+n+'(');let d=0,j=S.indexOf('{',i);for(;j<S.length;j++){if(S[j]==='{')d++;else if(S[j]==='}'){d--;if(!d)break;}}return S.slice(i,j+1);};
 const KV=S.match(/const kvNorm=[^\n;]*;?/)[0];const OW=S.match(/const PW_ORD=[^\n;]*;/);
 const L=new Function(KV+'\n'+(OW?OW[0]:"const PW_ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];")+'\n'+grab('vcParse2024')+'\n'+grab('vcBuild2024')+'\nreturn {vcBuild2024};')();
 const R={CR2:'I drop both verses as stand-alone proofs inside D3.',CR4:'The two rows name the woman and God where a father would stand.'};
 const line='CONTRADICTION -- DEFENDER -- EARLIER ([CR2], "I drop both verses as stand-alone proofs inside D3.") -- LATER ([CR4], "The two rows name the woman and God where a father would stand.")';
 const kw=()=>({items:[{rule:'K-W',side:'DEFENDER',link:'DEFENDER CR2 LINK 3 #1',line:'[CR2] DEFENDER LINK 3: "I drop both verses as stand-alone proofs inside D3."'}]});
 const one=L.vcBuild2024([{seat:'grok',WT:line,R,RV:[]},{seat:'gemini',WT:'CONTRADICTIONS: NONE FOUND',R,RV:[]}],kw);
 const two=L.vcBuild2024([{seat:'grok',WT:line,R,RV:[]},{seat:'chatgpt',WT:line,R,RV:[]},{seat:'gemini',WT:'CONTRADICTIONS: NONE FOUND',R,RV:[]}],kw);
 const same=L.vcBuild2024([{seat:'grok',WT:line+'\n'+line,R,RV:[]},{seat:'gemini',WT:'NONE FOUND',R,RV:[]}],kw);
 T('unit: one seat writes the pair -> no VC',one.length===0);T('unit: two seats write the pair -> one VC, by both',two.length===1&&two[0].by.join()==='grok,chatgpt');T('unit: one seat writing the pair twice is still one seat -> no VC',same.length===0);}
// corpus: every VC fire of the stored Panel Payloads, with the seats that wrote its pair
{const out=require('./vc_seats.cjs');const kept=out.filter(l=>/-> KEPT/.test(l)),drop=out.filter(l=>/-> DROPPED/.test(l));
 T('corpus: 6 VC charges; 5 dropped (32998 x3 grok alone, read FALSE; 33014 x2 chatgpt alone, read doubtful), 1 kept (33020 single judge, written by gemini, chatgpt, grok)',out.length===6&&drop.length===5&&kept.length===1&&/^33020 charged single judge/.test(kept[0]));}
// cure replay: pkgKC2 equals its base (pkgACR) row for row
{const {execSync}=require('child_process');const a=execSync('node corpus/replay_cure_node.cjs pkgACR',{encoding:'utf8'}).replace(/pkgACR/g,'P'),b=execSync('node corpus/replay_cure_node.cjs pkgKC2',{encoding:'utf8'}).replace(/pkgKC2/g,'P');
 T('cure replay: pkgKC2 equals pkgACR on every row and every LIVE uncured count (K-CON rows in the corpus are all CURED)',a===b);}
// gate: pkgKC2 equals its base (pkgACR) on every fixture seat
{const mk=p=>{const AM=rd(p+'/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024};')(()=>{throw 0},null);};
 const G=(Lb,X,seat)=>{const b=X.bodies.find(b=>b.seat===seat);const its=X.sb_items.filter(x=>x.seat===seat&&x.rule!=='E-GATE');if(!b||!its.length)return null;const PT=Lb.gatePromptText2024(X.PB.judges.find(q=>q.seat===seat).body);const ctx={R:Lb.ciRounds(PT),DL:Lb.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
  const R=Lb.gateItems2024(seat,b.verdict_raw,b.fields,its,ctx);const rep=(X.gate_replies||{})[seat];const c=rep&&R.items.length?Lb.gateCure2024(seat,b.verdict_raw,b.fields,its,R.items,rep,ctx):{res:[],uncured:0};return JSON.stringify({G:R.items.map(g=>g.gid+g.kind+g.src+g.live),c:c.res.map(r=>r&&r.cured),n:c.uncured});};
 const A=mk('pkgACR/patched'),B=mk('pkgKC2/patched');let seats=0,diff=0;for(const f of fs.readdirSync('corpus').filter(f=>/^fix_\d+\.json$/.test(f))){const X=JSON.parse(rd('corpus/'+f));for(const s of [...new Set(X.sb_items.map(x=>x.seat))]){seats++;if(G(A,X,s)!==G(B,X,s)){diff++;console.log('   gate differs '+f+' '+s);}}}
 T('gate: pkgKC2 equals pkgACR on all '+seats+' fixture seats',diff===0);}
console.log(ok+' OK, '+bad+' FAIL');
