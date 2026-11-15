const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const l=L[1754];const f=new Function(l.slice(l.indexOf('function gateVnv2024'))+';return gateVnv2024;')();
// strip engine audit tail: judge text only (before the first "\n[AUDIT")
const J=JSON.parse(fs.readFileSync('jall.json'));const jt=t=>{const i=String(t).indexOf('\n[AUDIT');return i>0?t.slice(0,i):t;};
let hits=0;for(const j of J){const r=f(jt(j.verdict_raw));if(r.length){hits++;console.log(j.id,j.judge_seat,r.map(x=>x.key+' :: '+x.lines.map(z=>z.slice(0,160)).join(' || ')).join('\n   '));}}
console.log('judgments',J.length,'with an item',hits,'id range',J[J.length-1].id,'-',J[0].id);
// controls
const C=[['CTRL VOID only',"CHALLENGE STANDING: SELF-SUPPORTED -- Premise 1 of [CR3] is VOID (adds 'only').\nCHALLENGER CONCEDED LINKS: 0 -- Premise 1 is VOID, and Premises 2 to 6 are supported.",0],
['CTRL other side',"CHALLENGE STANDING: x -- Premise 1 is VOID.\nCONCEDED LINKS: 0 -- Premise 1 is not VOID.",0],
['CTRL different premise',"CHALLENGE STANDING: x -- Premise 1 is VOID.\nCHALLENGER CONCEDED LINKS: 0 -- Premise 2 is not VOID.",0],
['MUST RULING card vs line',"RULING -- challenger premise 2 -- VOID\nCHALLENGER CONCEDED LINKS: 0 -- Premise 2 is not VOID.",1],
['CTRL conditional',"CHALLENGE STANDING: x -- Premise 1 would be VOID if it added a word.\nCHALLENGER CONCEDED LINKS: 0 -- Premise 1 is not VOID.",0]];
for(const [nm,t,w] of C){const r=f(t);console.log((r.length===w?'ok ':'BAD'),nm,r.length);}
