// W2 grade of W1's pkgCLG (Close Enforcer Record). Plants G0-G9 (Wall 4663).
const fs=require('fs');const H=require(process.cwd()+'/pkgRCL/rev3_regrade/h.cjs');const {load,build,record}=H;
const W='/mnt/project-files/wall2024/';const S120=W+'fetchback_live_s125.json',CLG=W+'fetchback_live_s125.json',RCL3=W+'parent_s125_RCL3.json';
const cl=x=>JSON.parse(JSON.stringify(x));
const base=rd=>rd['Close Enforcer Call deepseek'][0].data.main[0][0].json.choices[0].message.content;
const E2='I drop the claim that a father would never have thought of putting her away.',C2='A man who knew himself the father would have no cause to put her away, and the verse shows Joseph with that cause.';
const line=(id,sd,n,st,e,c,er='CR3')=>'CLOSE-CONTRADICTION: '+id+' -- '+sd+' -- LINK '+n+' -- '+st+' -- EARLIER ['+er+'] "'+e+'" -- CLOSING [CR4] "'+c+'" -- planted.';
const both=async(name,rd,bj,rep)=>{const a=await record(S120,rd,bj,rep),b=await record(CLG,rd,bj,rep);console.log('##',name,'\n  s120 ',JSON.stringify(a.confirmed),a.err||'','\n  CLG  ',JSON.stringify(b.confirmed),b.err||'','\n  CLG rows',JSON.stringify(b.rows));return [a,b];};
(async()=>{
// G0 stored
for(const r of ['34299','34626','34703','34726','34780','34852']){const rd=load(r);const bj=rd['Close Enforcer Build'][0].data.main[0][0].json;const a=await record(S120,rd,bj),b=await record(CLG,rd,bj);console.log('G0',r,JSON.stringify(a)===JSON.stringify(b)?'EQUAL':'DIFFER',JSON.stringify(b.confirmed));}
const rd0=load('34852');const B=rd0['Close Enforcer Build'][0].data.main[0][0].json;
// G1 CROSS: RCL3 build, X3 CONFIRMED + NEW NOT A CONTRADICTION same quotes
{const bj=await build(RCL3,rd0);const x3=bj.cands.find(c=>c.id==='X3');const rep=base(rd0)+'\n'+line('X3','DEFENDER',1,'CONFIRMED',x3.earlier_q,x3.closing_q)+'\n'+line('NEW','DEFENDER',1,'NOT A CONTRADICTION',x3.earlier_q,x3.closing_q);await both('G1 CROSS',rd0,bj,rep);}
// G2 union R9 / R9b with RCL3
for(const [nm,mod] of [['G2 R9 (D6 block)',F=>{const o='My chain stands as declared, D1 to D6.';F.cr4=F.cr4.split(o).join('').replace(/(\n## D6[^\n]*\n)/,'$1'+o+'\n');}],['G2 R9b (under D3)',F=>{const o='My chain stands as declared, D1 to D6.';F.cr4=F.cr4.split(o).join('').split('I keep D1 to D6 as declared.').join('Each link is answered.').replace(/(\n## D3[^\n]*\n)/,'$1'+o+'\n');}]]){
 const rd=cl(rd0);const F=rd['Final Output'][0].data.main[0][0].json;mod(F);const bj=await build(RCL3,rd);const rc=(bj.cands||[]).filter(c=>/pkgRCL/.test(c.by||''));
 const rep=base(rd)+'\n'+rc.map(c=>line(c.id,'DEFENDER',c.n,'CONFIRMED',c.earlier_q,c.closing_q)).join('\n');console.log('  code cands',rc.map(c=>c.id+' L'+c.n));await both(nm,rd,bj,rep);}
// G3 other side same quotations
await both('G3 challenger NOT A CONTRADICTION on defender pair',rd0,B,base(rd0)+'\n'+line('NEW','CHALLENGER',2,'NOT A CONTRADICTION',E2,C2));
// G4 Oracle X2 CONFIRMED + NEW CONFIRMED same pair
await both('G4 X2 + NEW both CONFIRMED',rd0,B,base(rd0)+'\n'+line('NEW','DEFENDER',3,'CONFIRMED',E2,C2));
// G5 two NEW lines on a new pair
{const e='I drop any claim that the verses by themselves trace Mary\'s own pedigree.',c='the child\'s descent from David stands through Mary';
 await both('G5 two NEW, CONFIRMED and NOT A CONTRADICTION',rd0,B,base(rd0)+'\n'+line('NEW','DEFENDER',2,'CONFIRMED',e,c)+'\n'+line('NEW','DEFENDER',2,'NOT A CONTRADICTION',e,c));}
// G6 punctuation/case difference
await both('G6 X2 CONFIRMED + NEW NOT A CONTRADICTION, quotes differ in case/punctuation',rd0,B,base(rd0)+'\n'+line('NEW','DEFENDER',3,'NOT A CONTRADICTION',E2.toUpperCase().replace(/\./,''),C2.replace(/,/g,'')));
// G7 Oracle candidate whose closing names D1 to D6, sentence in D6 block
{const rd=cl(rd0);const F=rd['Final Output'][0].data.main[0][0].json;const o='My chain stands as declared, D1 to D6.';F.cr4=F.cr4.split(o).join('').replace(/(\n## D6[^\n]*\n)/,'$1'+o+'\n');
 const bj=cl(B);bj.cands=bj.cands.concat([{id:'X3',side:'DEFENDER',by:'the Oracle (OPPONENT\'S CONTRADICTIONS, [DR4])',kind:'LINK',n:1,earlier_round:'CR3',earlier_q:'planted',closing_round:'CR4',closing_q:o,why:''}]);
 const x=(await build(RCL3,rd0)).cands.find(c=>c.id==='X3').earlier_q;bj.cands[bj.cands.length-1].earlier_q=x;
 await both('G7 Oracle cand naming D1 to D6 in D6 block',rd,bj,base(rd)+'\n'+line('X3','DEFENDER',1,'CONFIRMED',x||'planted',o));}
// G8 code candidate answered twice by id
{const bj=await build(RCL3,rd0);const x3=bj.cands.find(c=>c.id==='X3');await both('G8 X3 CONFIRMED and NOT A CONTRADICTION by id',rd0,bj,base(rd0)+'\n'+line('X3','DEFENDER',1,'CONFIRMED',x3.earlier_q,x3.closing_q)+'\n'+line('X3','DEFENDER',1,'NOT A CONTRADICTION',x3.earlier_q,x3.closing_q));}
// G9 NEW quoting bare "as declared" sentence in D6 block
{const rd=cl(rd0);const F=rd['Final Output'][0].data.main[0][0].json;const o='My chain stands as declared, D1 to D6.';F.cr4=F.cr4.split(o).join('').replace(/(\n## D6[^\n]*\n)/,'$1My chain stands as declared.\n');
 await both('G9 NEW quoting bare "My chain stands as declared." in D6 block, reply LINK 1',rd,B,base(rd)+'\n'+line('NEW','DEFENDER',1,'CONFIRMED',(await build(RCL3,rd0)).cands.find(c=>c.id==='X3').earlier_q,'My chain stands as declared.'));}
})();
