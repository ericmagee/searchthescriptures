// test_KAG: plants for "I accept that" / "I agree that" in the key-word reader, live s164 against pkgKAG.
// Classes A-E are W3's (Wall 5446, /mnt/project-files/w3/grade_d_accept/stored_forms_w3.md). Usage: node test_KAG.cjs <live json> <pkg json>
const fs=require('fs');
const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const lib=w=>{const T=w.nodes.find(z=>z.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
 return M['Panel Payloads'].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');};
const fn=(S,name)=>{const i=S.indexOf('\nfunction '+name+'(');const j=S.indexOf('\nfunction ',i+1);return S.slice(i+1,j);};
const mk=S=>new Function('const wpLines2024=()=>({items:[],marks:[]}),kconLines2024=()=>({items:[],marks:[]}),kcmtLines2024=()=>({items:[],marks:[]});\n'+fn(S,'kwiCut2024')+'\n'+fn(S,'kwiSq2024')+'\n'+fn(S,'kwLines421')+'\nreturn kwLines421;')();
const [L,K]=process.argv.slice(2,4).map(p=>mk(lib(un(p))));
const kw=(f,t)=>f('',{CR3:t}).items.filter(x=>x.rule==='K-W').map(x=>x.line.replace(/^\[CR3\] [^:]*: /,''));
// [class, text, expected new count, a word the listed line must hold (or '')]
const P=[
['A','I accept that the child is counted in Joseph\'s house.',1,'counted'],
['A','I agree that adoption produces no body-seed.',1,'adoption'],
['A','I accept that *ek* (G1537), "out of," plus God does not by itself exclude a fleshly father in believers\' cases.',1,'fleshly'],
['A','Matthew 1:25 with heos: I accept that the "till" bounds the time after the taking, and I rest on it only as part of the narrowed chain.',1,'bounds'],
['A','I also accept that Joseph is called her husband.',1,'husband'],
['A','I readily agree that the verb is passive.',1,'passive'],
['A','I accept that Joseph and Mary were espoused.',1,'espoused'],
['B','I accept that standard -- and apply it to the challenger.',0,''],
['B','I accept that definition and hold them to it.',0,''],
['B','I accept that equation and press it.',0,''],
['B','I accept that order.',0,''],
['B','I accept that interlocking in the legal sense.',0,''],
['B','I accept that correction and adjust.',0,''],
['B','I accept that correction against any overexclusive formulation of my position.',0,''],
['B','I accept that floor.',0,''],
['B','I accept that grant.',0,''],
['B','I accept that standard — and apply it.',0,''],
['C','They give Joseph\'s house, and I accept that.',1,'Joseph\'s house'],
['C','The challenger reads the verb as asking for the manner. I accept that.',1,'manner'],
['C','The challenger says heos limits the clause it governs. I accept that, and that is what the link needs.',1,'limits'],
['C','The defender says the loins name a line over generations. I accept that -- but the move still works for my side.',1,'loins'],
['C','Matthew 1:20 says "Joseph, thou son of David", and I accept that as Joseph\'s own descent.',1,'thou son'],
['D','The defender writes: "I accept that the child is counted in Joseph\'s house."',0,''],
['D','You wrote: "I accept that the morphology alone does not force the distinct-referent reading."',0,''],
['D','He concedes: "**I accept that Ephesians 2 describes a reversible covenant condition."',0,''],
['E','I accept that Isaiah 56:6-8 is the defender\'s best row, but it does not reach the link.',1,'best row'],
['neg','I do not accept that Joseph begat the child.',0,''],
['neg','I cannot agree that the verse names Mary\'s father.',0,''],
['neg','I never accept that the house is hers.',0,''],
['neg','I would accept that only if a row said so.',0,''],
['cond','If I accept that the verb is passive, the chain falls.',0,''],
['cond','Unless I agree that the house is hers, D3 fails.',0,''],
['cond','If pressed, I accept that the verb is passive.',1,'passive'],
['q','Do I accept that the verb is passive? No.',0,''],
['scope','I accept the challenger\'s reading of Luke 3:23.',0,''],
['scope','I agree with the challenger that the verb is passive.',0,''],
['scope','I accepted that point in round 2.',0,''],
['scope','I agree that.',0,''], // nothing before it to point to: dropped, as live drops a bare "I grant it."
];
let ok=0,old0=0;for(const [cl,t,en,w] of P){const n=kw(K,t),o=kw(L,t);if(o.length===0)old0++;const pass=n.length===en&&(!w||n.some(x=>x.includes(w)));if(pass)ok++;
 console.log((pass?'AS EXPECTED ':'NOT AS EXPECTED ')+cl+' new '+n.length+' old '+o.length+' | '+t+(n.length?'  =>  '+n.join(' / '):''));}
console.log('plants '+ok+' of '+P.length+'; live reads none of them: '+(old0===P.length));
