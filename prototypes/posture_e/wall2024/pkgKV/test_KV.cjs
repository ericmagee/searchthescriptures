// pkgKV test. Run from wall2024/: node pkgKV/test_KV.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{console.log((c?'OK  ':'FAIL')+' '+n);c?ok++:bad++;};
const plan=JSON.parse(rd('pkgKV/plan_KV.json'));
T('22 nodes; base shas = '+plan.base+', final shas = pkgKV/patched',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(plan.base+'/'+n.file))===n.base_sha&&sha(rd('pkgKV/patched/'+n.file))===n.final_sha));
T('every node: K-V LIVE, K-V item and PASS marks say LIVE, no K-V TRIAL left in the marks',plan.nodes.every(n=>{const t=rd('pkgKV/patched/'+n.file);return t.includes("'K-V':'LIVE'")&&!t.includes("'K-V':'TRIAL'")&&t.includes('names the kind. LIVE rule: left uncured after the cure, it removes the seat.')&&t.includes('names the kind; LIVE rule]')&&!t.includes('names the kind. TRIAL rule');}));
const mk=p=>{const AM=rd(p+'/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {drvVoid,kvRulingOk,kvCharges,kvUni,kvQuotes,kvSegments,ciRounds,gatePromptText2024,gateItems2024,gateCure2024,drvLinks};')(()=>{throw 0},null);};
const A=mk('pkgKW/patched'),B=mk('pkgKV/patched');
// raise side: every corpus seat's stored verdict, fixture prompt
{const gone=[],add=[],kept=[];for(const f of fs.readdirSync('corpus').filter(f=>/^fix_\d+\.json$/.test(f)).sort()){const X=JSON.parse(rd('corpus/'+f));
 for(const G of [X,X.alt]){if(!G||!G.bodies)continue;const PT=A.gatePromptText2024(G.PB.judges[0].body);for(const b of G.bodies){const a=A.drvVoid(b.verdict_raw,PT).items,c=B.drvVoid(b.verdict_raw,PT).items;const id=x=>f.slice(4,9)+' '+b.seat+' '+x.link;
  a.forEach(x=>(c.some(y=>y.link===x.link)?kept:gone).push(id(x)));c.filter(x=>!a.some(y=>y.link===x.link)).forEach(x=>add.push(id(x)));}}}
 console.log('   gone: '+gone.join('; ')+' | kept: '+kept.join('; '));
 T('raise: the 3 false K-V raises go (33020 grok premise 6, 33040 chatgpt premises 1 and 6); the true one stays (33021 grok premise 5); none added',gone.length===3&&gone.includes('33020 grok CHALLENGER premise 6')&&gone.includes('33040 chatgpt CHALLENGER premise 1')&&gone.includes('33040 chatgpt CHALLENGER premise 6')&&kept.length===1&&kept[0]==='33021 grok CHALLENGER premise 5'&&add.length===0);}
// units
{const s='premise 6 UNEXHIBITED (John 1:12 misses). Spared: 3 and 4. VOID, excluded: 1 (ONLY) and 5 (ONLY).';const seg=t=>B.kvSegments('CHALLENGER COUNT\n'+t,'CHALLENGER');
 T('unit (a): a premise graded UNEXHIBITED in its first sentence is not read as ruled VOID',!B.kvSegments('x\nCHALLENGE STANDING: '+s,'CHALLENGER').some(z=>z.ns.includes(6)));
 T('unit (a): "Premise 3 is VOID: ..." is still read as ruled VOID',B.kvSegments('x\nCHALLENGE STANDING: premise 3 is VOID: the charge adds ONLY.','CHALLENGER').some(z=>z.ns.includes(3)));
 T('unit (b): a single-quoted span with an apostrophe inside a word is read whole',B.kvQuotes("the claim 'through Joseph's begetting' goes beyond").includes("through Joseph's begetting")&&!A.kvQuotes("the claim 'through Joseph's begetting' goes beyond").includes("through Joseph's begetting"));
 const X=JSON.parse(rd('corpus/fix_33040.json'));const R=B.ciRounds(B.gatePromptText2024(X.PB.judges[0].body));const CH=B.kvCharges(R,'CHALLENGER'),U=B.kvUni(R,'CHALLENGER');
 const st1="VOID (Commitment 6): The charge asserts 'the line of fathers reaches the child through Joseph's begetting', a claim the quotation 'So the loins of David reach Christ through a line of fathers' does not itself make.";
 T('unit (c, c2): the 33040 chatgpt cure STATEMENT for premise 1 passes (quote with an apostrophe; long quotation before "does not itself make")',B.kvRulingOk(st1,1,CH,U).ok&&!A.kvRulingOk(st1,1,CH,U).ok);
 T('unit (c): "goes beyond the quoted ..." names the kind',B.kvRulingOk("Premise 1 is VOID: the charge's claim 'through Joseph's begetting' goes beyond the quoted 'through a line of fathers'.",1,CH,U).ok);
 T('unit: a VOID ruling that quotes no charge words and names no kind still fails',!B.kvRulingOk('Premise 1 is VOID and excluded from L.',1,CH,U).ok);}
// gate: pkgKV equals pkgKW on every fixture seat
{const G=(Lb,X,seat)=>{const b=X.bodies.find(b=>b.seat===seat);const its=X.sb_items.filter(x=>x.seat===seat&&x.rule!=='E-GATE');if(!b||!its.length)return null;const PT=Lb.gatePromptText2024(X.PB.judges.find(q=>q.seat===seat).body);const ctx={R:Lb.ciRounds(PT),DL:Lb.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
  const R=Lb.gateItems2024(seat,b.verdict_raw,b.fields,its,ctx);const rep=(X.gate_replies||{})[seat];const c=rep&&R.items.length?Lb.gateCure2024(seat,b.verdict_raw,b.fields,its,R.items,rep,ctx):{res:[],uncured:0};return JSON.stringify({G:R.items.map(g=>g.gid+g.kind+g.src+g.live),c:c.res.map(r=>r&&r.cured),n:c.uncured});};
 let seats=0,diff=0;for(const f of fs.readdirSync('corpus').filter(f=>/^fix_\d+\.json$/.test(f))){const X=JSON.parse(rd('corpus/'+f));for(const s of [...new Set(X.sb_items.map(x=>x.seat))]){seats++;if(G(A,X,s)!==G(B,X,s)){diff++;console.log('   gate differs '+f+' '+s);}}}
 T('gate: pkgKV equals pkgKW on all '+seats+' fixture seats',diff===0);}
console.log(ok+' OK, '+bad+' FAIL');
