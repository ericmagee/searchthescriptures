// test_KNC: plants for the key-word reader cap, live s164 against pkgKNC (variant A) and variant B.
// Usage: node test_KNC.cjs <live json> <pkg A json> <pkg B json>
const fs=require('fs');
const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const lib=w=>{const T=w.nodes.find(z=>z.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
 return M['Panel Payloads'].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');};
const fn=(S,name)=>{const i=S.indexOf('\nfunction '+name+'(');const j=S.indexOf('\nfunction ',i+1);return S.slice(i+1,j);};
const mk=S=>new Function('const wpLines2024=()=>({items:[],marks:[]}),kconLines2024=()=>({items:[],marks:[]}),kcmtLines2024=()=>({items:[],marks:[]});\n'+fn(S,'kwiCut2024')+'\n'+fn(S,'kwiSq2024')+'\n'+fn(S,'kwLines421')+'\nreturn kwLines421;')();
const [L,A,B]=process.argv.slice(2,5).map(p=>mk(lib(un(p))));
const kw=(f,R)=>f('',R).items.filter(x=>x.rule==='K-W').map(x=>x.line);
const G=k=>Array.from({length:k},(_,i)=>`I grant that verse ${i+1} names Joseph.`).join(' ');
const C=k=>Array.from({length:k},(_,i)=>`I concede point ${i+1} of the challenger.`).join(' ');
const W=k=>Array.from({length:k},(_,i)=>`I withdraw limb ${i+1} of D4.`).join(' ');
// [name, R, expected count live, A, B]
const P=[
 ['10 plain grants, then a withdrawal',{CR3:G(10)+' I withdraw Jeremiah 31:22 from D4.'},10,11,11],
 ['12 plain grants',{CR3:G(12)},10,10,12],
 ['6 grants, 6 concessions',{CR3:G(6)+' '+C(6)},10,10,12],
 ['12 withdrawals',{CR3:W(12)},10,12,12],
 ['10 grants, then "I drop", "I no longer claim", "I do not claim", "I retract", "I give up"',{CR3:G(10)+' I drop Galatians 4:4. I no longer claim the house is hers. I do not claim a row names Heli. I retract the dating of 1:25. I give up "till" as an end point.'},10,15,15],
 ['10 grants, then an adverb grant and "I admit"',{CR3:G(10)+' I readily grant that Joseph is her husband. I admit that no verse says so.'},10,12,12],
 ['withdrawal in round 4 after 10 grants in round 3',{CR3:G(10),CR4:'I withdraw the register limb.'},10,11,11],
 ['10 skipped matches (questions), then a withdrawal',{CR3:Array.from({length:10},(_,i)=>`Do I grant point ${i+1}?`).join(' ')+' I withdraw D3.'},0,1,1],
 ['10 skipped grants (questions), then a grant',{CR3:Array.from({length:10},(_,i)=>`Do I grant point ${i+1}?`).join(' ')+' I grant D3 stands on Joseph.'},0,1,1],
 ['sides counted apart: 10 defender grants, 1 challenger grant',{CR3:G(10),DR3:'I grant the verse names Mary.'},11,11,11],
 ['negated and conditional withdrawals stay unread',{CR3:G(10)+' I never withdraw D4. If I withdraw D4 the chain falls.'},10,10,10],
];
let ok=0;for(const [nm,R,el,ea,eb] of P){const l=kw(L,R).length,a=kw(A,R).length,b=kw(B,R).length;const pass=l===el&&a===ea&&b===eb;if(pass)ok++;
 console.log((pass?'AS EXPECTED ':'NOT AS EXPECTED ')+`live ${l} (${el}) A ${a} (${ea}) B ${b} (${eb}) | ${nm}`);}
// numbering: items before the cap keep the live id
{const R={CR3:G(10)+' I withdraw D3.'};const li=L('',R).items.map(x=>x.link),ai=A('',R).items.map(x=>x.link);const same=li.every((x,i)=>x===ai[i]);console.log((same?'AS EXPECTED ':'NOT AS EXPECTED ')+'live item ids kept in A: '+ai.slice(-2).join(' | '));if(same)ok++;}
console.log('plants '+ok+' of '+(P.length+1));
