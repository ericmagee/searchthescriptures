const fs=require('fs');let bad=0;
for(const n of ['Panel_Payloads','Alternate_Payloads','Extract_Independent_Verdict']){const s=fs.readFileSync('new10/'+n+'.js','utf8');const a=s.indexOf('function drvPromptText(');const b=s.indexOf('function drvCheck(');
const F=new Function(s.slice(a,b)+';return {drvLedger,drvBroken};')();
const L=(nn)=>'AGAINST THE DEFENDER, answered in [CR3]:\n'+[1,2,3,4,5,6].map(i=>'premise '+i+' (LINK '+i+'): x; '+(nn.includes(i)?'NOT NAMED: V '+i:'NOT NAMED: none')).join('\n')+'\nAGAINST THE CHALLENGER, answered in [DR3]:\n'+[1,2,3,4,5,6].map(i=>'premise '+i+': x; NOT NAMED: none').join('\n')+'\nA verse marked NOT NAMED is unanswered';
const T=(d,c,br)=>['DEFENSE STANDING: X -- L=6 c='+d,'CONCEDED LINKS: '+d,'CHALLENGE STANDING: X -- L=6 c='+c,'CHALLENGER CONCEDED LINKS: '+c,'COLLISION POINTS:',br||''].join('\n');
const run=(k,d,c,dv,cv,exp,br)=>{const pt=L([1,3]);const t=T(d,c,br);const CPV={DEFENDER:dv,CHALLENGER:cv};const A=F.drvLedger(t,pt,d,c,'X','Y',CPV);const B=F.drvBroken(t,d,'X',A.items,c,'Y',pt,CPV);
 const got=A.items.concat(B.items).map(x=>x.rule+' '+x.link).join(', ')||'none';const ok=got===exp;if(!ok)bad++;console.log((ok?'ok  ':'FAIL')+' '+n.slice(0,9)+' '+k.padEnd(26)+' '+got+(ok?'':'  | want '+exp)+' | marks: '+A.marks.concat(B.marks).filter(m=>/FIELD/.test(m)).map(m=>m.slice(37,90)).join(' ; '));};
run('valid covering',2,0,[1,3],[],'none');
run('string member',2,0,[1,'3'],[],'none');
run('boolean member',2,0,[true],[],'none');
run('object',2,0,{a:1},[],'none');
run('boundary 6 ok',3,0,[1,3,6],[],'none');
run('7 out of range',3,0,[1,3,7],[],'none');
run('dup [1,1,3] c3',3,0,[1,1,3],[],'K-G8 DEFENDER COUNTED PREMISES');
run('missing 3 c1',1,0,[1],[],'K-G6 DEFENDER premise 3');
run('absent c0 + BROKEN',0,0,undefined,[],'K-G6 DEFENDER premise 1, K-G6 DEFENDER premise 3, K-G7 D6 vs C3','D6 vs C3 (Matthew 1:18): DEFENDER LINK BROKEN -- x');
run('[1,3] c2 + BROKEN D6',2,0,[1,3],[],'K-G7 D6 vs C3','D6 vs C3 (Matthew 1:18): DEFENDER LINK BROKEN -- x');
}
console.log('fails',bad);
