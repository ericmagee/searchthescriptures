const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const l=L[461];const src=l.slice(0,l.indexOf('function kunxLines('));const mk=f=>new Function('$',src+';return bkcKeep2024;')(n=>({isExecuted:true,first:()=>({json:{acx:{facts:f}}})}));const UA={a:'ASSUMES',asm:''};
const F=[{side:'DEFENDER',n:1,both_not_stated:true,fact:'Mary is of the house of David'}];
const C=[
['clause starts with capital common word',"Premise 1: UNEXHIBITED -- ASSUMES: House of David runs through Mary -- ROWS GIVE: x",'?'],
['Mary bore David seed (names only)',"Premise 1: UNEXHIBITED -- ASSUMES: Mary bore David's seed -- ROWS GIVE: x",'keep'],
['two premises in one segment, clause for other',"Premises 1 and 3: UNEXHIBITED -- ASSUMES: Mary is of David's house -- ROWS GIVE: x",'close'],
['ASSUMES with em dash end',"Premise 1: UNEXHIBITED — ASSUMES: Mary of the house of David — ROWS GIVE: x",'close'],
['fact not BNS',null,'keep'],
];for(const [nm,seg,w] of C){const f=nm==='fact not BNS'?mk([{...F[0],both_not_stated:false}]):mk(F);const r=f('DEFENDER',1,[{seg:seg||"Premise 1: UNEXHIBITED -- ASSUMES: Mary is of David's house -- ROWS GIVE: x"}],UA);const got=r===null?'close':'keep';console.log(w==='?'?'?? ':got===w?'ok ':'BAD',nm,'|',got);}
