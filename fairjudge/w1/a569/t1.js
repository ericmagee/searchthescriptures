const fs=require('fs');const S=fs.readFileSync(__dirname+'/lay569.js','utf8');
const S2=S.replace('return {check,note,bare,words,structure,points};','return {check,note,bare,words,structure,points,verses};');const LL=new Function(S2+'\nreturn LAY;')();const LAY={LAY:LL,verses:LL.verses};const R=require('/mnt/project-files/ask557/w4/build/rounds41822.json');
const E=require('../a568/env.js');const L2C=E.mkL2C(E.l2cSrc('D2 Build'));
const sumRe=/^[\s>*_#-]*\**\s*D\d\b/;
const Q=k=>LAY.verses(R[k],null,new Map()).refs;
for(const k of ['CR1','DR1','CR4']){const q=Q(k);const lines=R[k].split('\n').filter(l=>sumRe.test(l));console.log('==',k,'refs credited in round:',q.size);
 for(const l of lines){const rs=L2C.refsIn(l);console.log('  ',l.slice(0,40),'| refs',rs.join(', ')||'(none)','| quoted+tagged elsewhere:',rs.map(r=>q.has(r)?'Y':'n').join(''));}}
// by-reference rewrite test
const rw=(k,o)=>{const t=R[k].split('\n').map(l=>{if(!sumRe.test(l))return l;const rs=L2C.refsIn(l);return l+(rs.length?' '+rs.map((r,i)=>'['+(i?'L3':'L1')+'] '+r+', quoted above').join('; '):'')+((o&&o.oracle)?' [L2] see above [L4] see above':'');}).join('\n');return LAY.LAY.check(t,undefined,o);};
for(const [k,o] of [['CR1',undefined],['CR1',{oracle:true}],['DR1',undefined]]){const c=rw(k,o);console.log('rewrite',k,JSON.stringify(o),'items',c.items.length,c.items.map(x=>x.head.slice(0,20)+'|'+x.why.slice(0,60)).join(' ;; '));}
