// pkgP72 rev 4 plants: void372 and the exact MEANS test, cut from the joint parent's library line 3122.
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const T=un(process.argv[2]).nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const l=L[3122];const v=new Function(l.match(/const void372=[^]*?return false;};/)[0]+';return void372;')();

const mk=new Function(l.match(/const NM=[^;]*;/)[0]+l.match(/const __mok=[^]*?===a\);};/)[0]+';return __mok;')();
const V=[['Premise 6 VOID (Commitment 6): the charge adds ONLY',6,1],['Premise 1 VOID (Commitment 6): ... Premise 6 VOID (Commitment 6)',6,1],['Premises 1 and 6 VOID',6,1],['Premises 1, 4 and 6 are VOID',4,1],['Premise 6 is VOID, so this is not counted',6,1],['Premise 6: VOID',6,1],['Premise 16 VOID',6,0],['Premise 6 is spared',6,0],['Premises 2, 3, 4 and 5 are spared',5,0],['Premise 6 not VOID',6,0],['Premise 1 VOID. Premise 6 is spared.',6,0]];
const V4=[["Premise 2 of the challenger's [DR2] list is VOID because the quote lacks it",2,1],['premises 2, 4 and 5 remain VOID as charged',4,1],["CONCEDED LINKS: 0 -- VOID: Premise 3 adds 'alone'",3,1],['Premise 6 is ruled VOID',6,1],['Premise 6 was VOID',6,1],['Premise 6 is voided',6,1],['Premise 6 — VOID',6,1],['VOID: Premises 1 and 3',3,1],['Premise 6 is spared, premise 1 VOID',6,0],['Premise 6 is not VOID',6,0],['Premise 6 was never voided',6,0],['premises 2, 4 and 5 remain VOID as charged',3,0],['Premise 6 stands; the charge on premise 1 is VOID',6,0],['Premise 6 avoids the charge',6,0]];V.push(...V4);
const A='ANSWER CHECK: Matthew 1:19 -- [CR3] -- MEANS: X -- ANSWER: "y" -- MISSES';
const M=[['Joseph is her husband',['Joseph is her husband in the espousal, before the taking.'],0],['“the stated grounds are equity.”',['the stated grounds are equity'],1],['**Joseph is her husband.**',['Joseph is her husband'],1],['the',['the knowing is withheld','the verb'],0],['',['x'],0],['x',[''],0]];
let ok=0,n=0;for(const [t,k,w] of V){n++;const g=v(t,k)?1:0;if(g===w)ok++;console.log(g===w?'OK  ':'FAIL','void372',k,g,'|',t);}
for(const [am,ps,w] of M){n++;const g=mk(ps,A.replace('X',am))?1:0;if(g===w)ok++;console.log(g===w?'OK  ':'FAIL','means',g,'|',JSON.stringify(am),'vs',JSON.stringify(ps));}
console.log('plants',n,'right',ok);
