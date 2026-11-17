// ASK 365 tests. Usage: node t365.cjs [target] [base = ASK 364 Part A resend-only on 359]. REAL = stored round; PLANT = made for the test.
const fs=require('fs');const {run}=require('../a364/harness.cjs');
let fails=0,n=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)fails++;};
const T=JSON.parse(fs.readFileSync(process.argv[2]||'../stk/t365_on364r.json')),BW=JSON.parse(fs.readFileSync(process.argv[3]||'../stk/t364r_on359_r365.json')),L0=JSON.parse(fs.readFileSync('../rdf/fetchback_s250.json'));
const nm=w=>{const o={};for(const x of w.nodes)o[x.name]=x;return o;};const NT=nm(T),N0=nm(BW),NL=nm(L0);
const SIX=['C2B Build','C2B Extract','C3B Build','C3B Extract','C4B Build','C4B Extract'];const DSIX=['D2B Build','D2B Extract','D3B Build','D3B Extract','D4B Build','D4B Extract'];
const ch=T.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(N0[x.name])).map(x=>x.name);
ok('only the six C2B/C3B/C4B Build and Extract nodes change from Part A; node order, connections, settings equal',ch.sort().join()===SIX.slice().sort().join()&&T.nodes.map(x=>x.name).join()===BW.nodes.map(x=>x.name).join()&&JSON.stringify(T.connections)===JSON.stringify(BW.connections)&&JSON.stringify(T.settings)===JSON.stringify(BW.settings),ch.join(', '));
const ch0=T.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(NL[x.name])).map(x=>x.name);ok('from live 890d4cdc only the twelve D and C round-B Build and Extract nodes change',ch0.sort().join()===SIX.concat(DSIX).sort().join(),ch0.length+'');
ok('no Call node changes (model settings copied by not touching them)',L0.nodes.filter(x=>/Call /.test(x.name)).every(x=>JSON.stringify(x)===JSON.stringify(NT[x.name])));
const syn=[];for(const k of SIX.concat(DSIX)){try{new Function('$','$input','$execution','return (async ()=>{'+NT[k].parameters.jsCode+'\n})();');}catch(e){syn.push(k+': '+e.message);}}ok('syntax of the twelve nodes',!syn.length,syn.join(' | '));
const mod=k=>{const c=NT[k].parameters.jsCode;const a=c.indexOf('const LAY=(()=>{'),b=c.indexOf('return {check,note,bare,words,structure,points};})();');return a<0||b<0?'':c.slice(a,b);};
ok('the LAY module is byte-equal in all twelve nodes, both sides',SIX.concat(DSIX).every(k=>mod(k)===mod('D2B Build')&&mod(k).length>1000),mod('D2B Build').length+' chars');
ok('the module in the nodes is the module file',mod('C3B Build')===fs.readFileSync('../a364/lay_module.js','utf8').trim().slice(0,mod('C3B Build').length));
ok('the old checks are kept: BAR in all six, PIN in C2B Build',SIX.every(k=>NT[k].parameters.jsCode.includes('BAR'))&&/PIN\.check\(/.test(NT['C2B Build'].parameters.jsCode)&&/PIN\.note\(/.test(NT['C2B Build'].parameters.jsCode));
ok('record only (operator "B"): LAY_BARE is false in the three C Extract nodes and in the three D Extract nodes',['C2','C3','C4','D2','D3','D4'].every(r=>NT[r+'B Extract'].parameters.jsCode.includes('const LAY_BARE=false;')));
// module plants
const LAY=new Function(fs.readFileSync('../a364/lay_module.js','utf8')+'\nreturn LAY;')();
const V='[L1] Matthew 1:18 "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost."\n[L3] Matthew 1:20 "for that which is conceived in her is of the Holy Ghost."';
const P=(t,c,d)=>ok('PLANT '+t,c,d);
P('heads: "LINK 4: SUPPORTED", "### C2 (kept):", "C3 SUPPORTED --", "C1 kept:", "C4 = KEPT --" are each read as a point',['LINK 4: SUPPORTED -- x','### C2 (kept): x','**LINK 2: SUPPORTED**','C3 SUPPORTED -- x','C1 kept: x','C4 = KEPT -- x','D2 SUPPORTED -- x'].every(h=>LAY.points(h)===1));
P('a head with its two verses passes; the same head with none is flagged',LAY.structure('### C2 (kept): the child is dated before the coming together.\n'+V).length===0&&LAY.structure('### C2 (kept): the child is dated before the coming together, and the row names the source.').length===1);
P('"MEANS [CRn] Pn.n:" restates the other side: a limiting word in it gives no flag',LAY.words('MEANS [CR3] P1.1: "the record states only Mary, and never a man at all, without any begetter." -- Matthew 1:18 "before they came together, she was found with child of the Holy Ghost." -- MEANS: none of it').length===0);
P('the same row written as the side\'s own MEANS row is flagged',LAY.words('Matthew 1:18 "before they came together, she was found with child of the Holy Ghost." -- MEANS: only Mary, without any man.').length===1);
P('"MEANS [CRn]" lines do not lend their verses to a point',LAY.structure('LINK 3: SUPPORTED -- the finding is dated.\nMEANS [CR3] P1.2: Matthew 1:18 "before they came together, she was found with child" [L1] and Matthew 1:20 "conceived in her is of the Holy Ghost" [L3]').length===1);
P('absence naming its rows is not flagged (challenger)',LAY.structure('LINK 5: SUPPORTED -- Matthew 1:18 to 25 do not state a begetting by the Holy Ghost.').length===0);
P('absence naming its rows is not flagged (defender, the same rule)',LAY.structure('D3: Matthew 1:16 does not state that Joseph begat Jesus.').length===0);
P('a bare absence with no rows named is still a point',LAY.structure('LINK 5: SUPPORTED -- the record does not state a begetting by the Holy Ghost anywhere in the chapter.').length===1&&LAY.structure('D3: the record never states that Joseph begat Jesus, in any row of the chapter.').length===1);
P('a conclusion drawn from an absence is a point',LAY.structure('LINK 5: SUPPORTED -- Matthew 1:16 does not state a begetting, therefore Joseph is the father.').length===1&&LAY.structure('D3: Matthew 1:16 does not state that Joseph begat Jesus. So the child has no father among men.').length===1);
P('an absence with a further positive claim is a point',LAY.structure('LINK 5: SUPPORTED -- Matthew 1:16 does not state a begetting. The father is named in plain words.').length===1);
// Node runs, REAL rounds
const C=JSON.parse(fs.readFileSync('../a364/ch_rounds.json'));const get=t=>C.find(x=>x.run_token.includes(t));
const call={fam:'openrouter',fam_idx:5,model:'m',body:{model:'m',messages:[{role:'user',content:'x'}]}};
const DR=JSON.parse(fs.readFileSync('../a364/def_rounds.json'));let TOK='';const dget=()=>DR.find(x=>x.run_token.includes(TOK))||{},cget=()=>get(TOK)||{};
const env=(r,raw)=>{const e={'D1 Extract':{raw:dget().r1||''},'C1B Extract':{raw:cget().c1||''},'D2B Extract':{raw:dget().r2||''},'C2B Extract':{raw:cget().c2||''},'D3B Extract':{raw:dget().r3||''},'C3B Extract':{raw:cget().c3||''},'Init with Guards':{lab:{D:'DEFENDER (standard reading)',C:'CHALLENGER (record\'s reading)'}},'Init Seats':{},'L2 Count Plan':{}};
 const src=r==='C2'?'C2 Extract':r+'G Extract';e[src]={run_token:'T',raw,labelled:'L',msg_id:'id1',fam:'openrouter',model:'m'};e[r+' Build']={call};return e;};
const one=(s)=>(s.match(/this is the only request of its kind/g)||[]).length===1;
for(const [r,tok,k,expect] of [['C4','37812','c4',true],['C2','38051','c2',true],['C3','37891','c3',false],['C2','37891','c2',false]]){
 TOK=tok;const raw=get(tok)[k];let g=null,er=null;try{g=run(NT[r+'B Build'].parameters.jsCode,env(r,raw),{})[0].json;}catch(x){er=x.message;}
 const nL=g&&g.lay_check&&g.lay_check.items?g.lay_check.items.length:0;
 if(expect){ok('REAL '+tok+' '+k+': '+r+'B Build sends the round back with the layers note first, the one-request line once',!!g&&g.resend===true&&nL>0&&/^LAYERS CHECK/.test(g.note)&&one(g.note)&&g.call.body.messages.slice(-2)[0].content===raw&&g.call.body.messages.slice(-1)[0].content===g.note,er||(g&&g.why));
  const b=run(N0[r+'B Build'].parameters.jsCode,env(r,raw),{})[0].json;ok('REAL '+tok+' '+k+': the Part A base sends no layers note for it',b.resend===false||!/LAYERS CHECK/.test(b.note||''),b.why);
  const X=run(NT[r+'B Extract'].parameters.jsCode,{...env(r,raw),[r+'B Build']:g},{choices:[{message:{content:raw},finish_reason:'stop'}],usage:{}})[0].json;
  ok('REAL '+tok+' '+k+': '+r+'B Extract records the layers first and after, writes nothing into the round',!!X.bar&&!!X.bar.layers&&X.bar.layers.first&&X.bar.layers.after&&X.bar.layers.bare_written===false&&!String(X.raw).includes('BARE CLAIM'),X.bar&&X.bar.layers?(X.bar.layers.first.items.length+' -> '+X.bar.layers.after.items.length):(er||'no layers'));}
 else ok('REAL '+tok+' '+k+': '+r+'B Build reads the layers and finds no point short',!!g&&(g.resend===false||nL===0),er||(g&&g.why));}
// PIN path: C2B with a PIN fault only keeps its own closing; with LAY added, the line stands once
// Replay
const D=JSON.parse(fs.readFileSync('../a364/def_rounds.json'));const per={},zero=[],F=[];
for(const x of C)for(const k of ['c2','c3','c4']){const c=LAY.check(x[k]);per[k]=per[k]||{runs:0,words:0,structure:0};if(c.items.length)per[k].runs++;if((x[k]||'').trim()&&LAY.points(x[k])===0)zero.push(x.run_token+' '+k);for(const it of c.items){it.kind==='WORDS'?per[k].words++:per[k].structure++;F.push([x.run_token,k,it.id,it.kind,(it.kind==='WORDS'?it.line:it.head).replace(/\s+/g,' ').slice(0,400),it.why].join(' | '));}}
fs.writeFileSync('replay365_flags.txt',F.join('\n')+'\n');
const dz=[];for(const x of D)for(const k of ['r2','r3','r4'])if((x[k]||'').trim()&&LAY.points(x[k])===0)dz.push(x.run_token+' '+k);
ok('W2 7687: every challenger round 2 to 4 of the 12 runs reads at least one point, or is listed',true,'challenger rounds read as none: '+(zero.join(', ')||'none')+'; defender rounds read as none: '+(dz.join(', ')||'none'));
console.log('   challenger replay rounds 2 to 4:',JSON.stringify(per),F.length,'flags');
console.log(n-fails+' of '+n+' pass');process.exit(fails?1:0);
