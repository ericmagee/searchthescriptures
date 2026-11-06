// pkgOGR test. Run from wall2024/: node pkgOGR/test_OGR.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgOGR/plan_OGR.json'));
T('9 nodes; base and final shas match',plan.nodes.length===9&&plan.nodes.every(n=>sha(rd((n.base==='pkgUND/patched'?'pkgUND/patched':'pkgOGR/base')+'/'+n.file))===n.base_sha&&sha(rd('pkgOGR/patched/'+n.file))===n.final_sha));
const OGR=new Function(rd('pkgOGR/src_OGR.js')+';return OGR;')();const UND=new Function(rd('pkgUNL/src_UNL.js')+';return UND;')();
const roundsOf=run=>{const PB=JSON.parse(rd('corpus/raw/gate_'+run+'.json'))['Panel Build'].slice(-1)[0][0];const J=PB.judges[0];return UND.rounds(J.body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c&&c.text||'').join('\n')).join('\n'));};
// (1) harvest
const R7=roundsOf('33107'),R9=roundsOf('33149');const G7=OGR.harvest(R7),G9=OGR.harvest(R9);
T('33107: Eric\'s example "I grant these state David\'s descent for the promised king." is harvested from [CR3]',G7.some(x=>x.round==='CR3'&&/^I grant these state David's descent for the promised king\./.test(x.text)));
T('every harvested grant stands word for word in its round',[[G7,R7],[G9,R9]].every(([G,R])=>G.every(x=>OGR.check('OPPONENT\'S GRANTS:\nG+ ['+x.round+'] "'+x.text+'" -- SUPPORTS: x',[],R)&&R[x.round].replace(/[*_`]+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,' ').includes(x.text.replace(/\s+/g,' ')))));
T('unit: a quoted grant, a heading and "I grant nothing" are not harvested',OGR.harvest({CR2:'## I grant\nHe wrote "I grant the point." here.\nI grant nothing to the challenger.\nI grant that the verse names the mother.'}).map(x=>x.text).join('|')==='I grant that the verse names the mother.');
// (2) the check
const good=G=>"OPPONENT'S GRANTS:\n"+G.map(x=>'G'+x.g+' ['+x.round+'] "'+x.text+'" -- SUPPORTS: the challenged claim (Acts 2:30)').join('\n')+'\n\nMy close.';
const c1=OGR.check(good(G9),G9,R9);T('33149: a DR4 that lists every grant word for word passes ('+c1.ok.length+' of '+G9.length+')',c1.pass);
const om=good(G9).split('\n').filter(l=>!/^G3 /.test(l)).join('\n');const c2=OGR.check(om,G9,R9);T('33149: an omitted grant is caught: '+c2.missing.join(','),!c2.pass&&c2.missing.join()==='G3');
const mq=good(G9).replace(/^G2 \[CR2\] "I grant/m,'G2 [CR2] "I fully grant');const c3=OGR.check(mq,G9,R9);T('33149: a misquoted grant is caught: '+c3.misquoted.join(','),!c3.pass&&c3.misquoted.some(x=>/^G2 /.test(x)));
const wr=good(G9).replace(/^G2 \[CR2\]/m,'G2 [CR3]');const c4=OGR.check(wr,G9,R9);T('33149: a grant under the wrong round is caught: '+c4.misquoted.join(','),!c4.pass&&c4.misquoted.some(x=>/^G2 /.test(x)));
const ex=good(G9)+'';const ex1=ex.replace('\n\nMy close.','\nG+ [CR4] "No quoted row states that Joseph begat Jesus." -- SUPPORTS: x\n\nMy close.');const c5=OGR.check(ex1,G9,R9);T('33149: a G+ line whose quotation the round does not hold is caught',!c5.pass&&c5.misquoted.some(x=>/^G\+/.test(x)));
const nos=OGR.check('My close, no section.',G9,R9);T('33149: no section: every grant missing',!nos.section&&nos.missing.length===G9.length);
// (3) the new-verse check does not read the section's quotations
const bs=rd('pkgOGR/patched/Build_Synthesis.js');const stripSrc=bs.match(/const __ogrS=[^\n]*?\/\* pkgOGR \(3\)/)[0].replace(/\/\* pkgOGR \(3\)$/,'');const S=new Function(stripSrc+';return __ogrS;')();
const dr4="OPPONENT'S GRANTS:\nG1 [CR2] \"I grant that the betrothed was already a wife in law (Deuteronomy 22:24).\" -- SUPPORTS: the marriage-knowing claim (Matthew 1:19)\n\nMy close names Exodus 3:14 anew.";
const out=S(dr4);T('strip: the section quotation (Deuteronomy 22:24) is removed; the SUPPORTS verse and the text after the section are kept',!/Deuteronomy 22:24/.test(out)&&/Matthew 1:19/.test(out)&&/Exodus 3:14/.test(out),out.replace(/\n/g,' | '));
T('strip: a DR4 with no section is unchanged',S('My close names Exodus 3:14.')==='My close names Exodus 3:14.');
for(const n of plan.nodes)T(n.file+': C4P.of reads the stripped [DR4]',rd('pkgOGR/patched/'+n.file).includes('const of=F=>F&&F.dr4?fresh([F.gr1,F.gr2,F.dr3],__ogrS(F.dr4)):[];'));
// (4) C4 Build: the request carries the list (run whole on 33149 rounds, with stand-in seats)
const msg=(()=>{const R=R9;const mk=v=>({isExecuted:true,first:()=>({json:v}),all:()=>[{json:v}]});const nodes={'Init Seats':{run_token:'t',cpos:'the record\'s reading'},'Init with Guards':{csys:'sys',topic:'topic',lab:{C:'CHALLENGER'}},'Resolve Seats':{challenger:{fam:'openai',model:'m',tok:1000},defender:{fam:'openai',model:'d',tok:1000}},
 'C1 Extract':{raw:R.DR1},'C2 Extract':{raw:R.DR2},'C3 Extract':{raw:R.DR3},'D1 Extract':{raw:R.CR1},'D2 Extract':{raw:R.CR2},'D3 Extract':{raw:R.CR3},'D4 Extract':{raw:R.CR4}};
 const $=n=>nodes[n]?mk(nodes[n]):{isExecuted:false,first:()=>{throw new Error('no '+n);},all:()=>[]};
 try{const o=new Function('$','$input','$json',rd('pkgOGR/patched/C4_Build.js'))($,{first:()=>({json:{}}),all:()=>[]},{});return o;}catch(e){return e;}})();
if(msg instanceof Error)T('C4 Build runs on 33149 rounds',false,String(msg.stack).slice(0,400));else{const j=msg[0].json;const u=j.call.body.messages.filter(m=>m.role==='user').map(m=>m.content).join('\n');
 T('C4 Build: '+j.grants.length+' grants on the item; the request carries the list and the OPPONENT\'S GRANTS instruction before CLOSE ROUND',j.grants.length===G9.length&&u.indexOf("THE DEFENDER'S GRANTS")>0&&u.indexOf("THE DEFENDER'S GRANTS")<u.indexOf('CLOSE ROUND -- your final words')&&/OPEN YOUR CLOSE ROUND WITH THIS SECTION/.test(u));}
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
