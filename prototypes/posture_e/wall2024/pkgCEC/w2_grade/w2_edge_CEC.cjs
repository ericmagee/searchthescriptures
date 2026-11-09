// W2 grade of pkgCEC: own edge tests on run 34108 (written enforcer replies; no DeepSeek call).
//   node pkgCEC/w2_grade/w2_edge_CEC.cjs   (from wall2024/)
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const PAR=JSON.parse(fs.readFileSync(__dirname+'/../parent_s83_CEC.json','utf8'));
const code=(d,n)=>d.nodes.find(x=>x.name===n).parameters.jsCode;const J=x=>({json:x});
const run=async(c,over,inp)=>await harness('34108',over||{})('return (async()=>{\n'+c+'\n})();',inp||'Quote Report');
const F=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0][0].json;
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];
let ok=0,bad=0;const T=(n,c,i)=>{if(c){ok++;console.log('OK   '+n+(i?': '+i:''));}else{bad++;console.log('FAIL '+n+(i?': '+i:''));}};
const sent=s=>String(s).split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>x.split(' ').length>=7&&!/["“”]/.test(x));
(async()=>{
const B=(await run(code(PAR,'Close Enforcer Build'),{}))[0].json;
const rec=async(txt)=>(await run(code(PAR,'Close Enforcer Record'),{'Close Enforcer Build':[J(B)],'Close Enforcer Call deepseek':reply(txt)},'Close Enforcer Call deepseek'))[0].json;
const line=(id,sd,lk,ans,er,eq,cr,cq)=>`CLOSE-CONTRADICTION: ${id} -- ${sd} -- LINK ${lk} -- ${ans} -- EARLIER [${er}] "${eq}" -- CLOSING [${cr}] "${cq}" -- why.`;
// E1 challenger path: real sentences of DR3 and DR4 on a declared link
const d3=sent(F.dr3),d4=sent(F.dr4);
let r=await rec(line('NEW','CHALLENGER',2,'CONFIRMED','DR3',d3[3],'DR4',d4[3]));
T('E1 a challenger line with real [DR3] and [DR4] sentences on declared LINK 2 is CONFIRMED for the challenger',r.cec.confirmed.length===1&&r.cec.confirmed[0].side==='CHALLENGER'&&r.cec.confirmed[0].link===2,r.cec.rows[0].status+' '+(r.cec.rows[0].note||''));
// E2 a 2-word quote is refused; a 3-word fragment that stands is accepted (record)
r=await rec(line('NEW','DEFENDER',6,'CONFIRMED','CR3','biological father','CR4','Christ had no biological father.'));
T('E2 a 2-word earlier quote is refused',r.cec.confirmed.length===0&&/earlier quotation/.test(r.cec.rows[0].note||''),r.cec.rows[0].note);
r=await rec(line('NEW','DEFENDER',6,'CONFIRMED','CR3','no biological father','CR4','Christ had no biological father.'));
T('E3 (record) a 3-word earlier fragment that stands in [CR3] passes the form check',r.cec.confirmed.length===1,r.cec.rows[0].status);
// E4 splice: two real 5+ word parts of [CR4] from different sentences joined by "..."
const c4=sent(F.cr4);const sp=c4[1].split(' ').slice(0,6).join(' ')+' ... '+c4[c4.length-2].split(' ').slice(-6).join(' ');
r=await rec(line('NEW','DEFENDER',6,'CONFIRMED','CR3','no biological father','CR4',sp));
T('E4 (record) a closing quote spliced with "..." from two separate [CR4] sentences passes the word-for-word check',r.cec.confirmed.length===1,JSON.stringify(sp));
// E5 the same candidate answered twice: first CONFIRMED, then NOT A CONTRADICTION
const L1=line('X1','DEFENDER',6,'CONFIRMED','CR3','I drop the wording "no biological father" as a bare statement.','CR4','Christ had no biological father.');
r=await rec(L1+'\n'+L1.replace('CONFIRMED','NOT A CONTRADICTION'));
T('E5 one candidate answered both CONFIRMED and NOT A CONTRADICTION: the CONFIRMED line still breaks (no conflict check)',r.cec.confirmed.length===1,r.cec.rows.map(x=>x.status).join(' | '));
// E6 prose around the lines and a markdown bullet
r=await rec('Here is my review.\n- '+L1+'\nThat is all.');
T('E6 prose around a bulleted line: the line is read, prose ignored',r.cec.confirmed.length===1&&r.cec.rows.length===1);
// E7 NONE plus a CONFIRMED line in one reply
r=await rec('CLOSE-CONTRADICTION: NONE\n'+L1);
T('E7 (record) NONE and a CONFIRMED line in one reply: the CONFIRMED line stands',r.cec.confirmed.length===1);
// E8 a closing quote taken from [CR3] but labelled [CR4]
r=await rec(line('NEW','DEFENDER',6,'CONFIRMED','CR3','no biological father',"CR4",sent(F.cr3)[2]));
T('E8 a closing quote that stands only in [CR3] but is labelled [CR4] is refused',r.cec.confirmed.length===0||F.cr4.includes(sent(F.cr3)[2]),r.cec.rows[0].note);
console.log('\n'+ok+' OK, '+bad+' FAIL');})();
