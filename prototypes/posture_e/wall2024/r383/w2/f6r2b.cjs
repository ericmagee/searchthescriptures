const fs=require('fs'),zlib=require('zlib');const W=JSON.parse(fs.readFileSync(process.env.TF,'utf8'));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),MAP=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const rb=(m,L)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');const src=rb(MAP['Gate Build'],LIB);
const $=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]});
const f=new Function('$','$input','items','$json','$node','$execution','$workflow','require','return gateVnv2024;\n'+src)($,null,[],{},{},{},{},require);
const P=(a,b)=>"CHALLENGE STANDING: x -- "+a+"\nCHALLENGER CONCEDED LINKS: 0 -- "+b;
const C=[
['plural "Premises 1 and 2 are VOID"',"CHALLENGE STANDING: x -- Premises 1 and 2 are VOID.\nCHALLENGER CONCEDED LINKS: 0 -- Premise 1 is not VOID.",'?'],
['charge fails phrasing',"CHALLENGE STANDING: x -- the charge that Premise 1 is VOID fails.\nCHALLENGER CONCEDED LINKS: 0 -- Premise 1 is not VOID.",'?'],
['lowercase void',"CHALLENGE STANDING: x -- Premise 1 is void.\nCHALLENGER CONCEDED LINKS: 0 -- Premise 1 is not VOID.",'?'],
['no longer VOID',"CHALLENGE STANDING: x -- Premise 3 is VOID.\nCHALLENGER CONCEDED LINKS: 0 -- Premise 3 is no longer VOID.",1],
['same line both',"CHALLENGER CONCEDED LINKS: 0 -- Premise 1 is VOID; Premise 1 is not VOID on review.",1],
['bold labels',"**CHALLENGE STANDING:** x -- Premise 2 is **VOID**.\n**CHALLENGER CONCEDED LINKS:** 0 -- Premise 2 is not VOID.",1],
['defender side pair',"DEFENSE STANDING: x -- Premise 4 is VOID.\nCONCEDED LINKS: 1 -- Premise 4 is not VOID.",1],
['unless before VOID',"CHALLENGE STANDING: x -- Premise 1 is sound unless read as VOID.\nCHALLENGER CONCEDED LINKS: 0 -- Premise 1 is not VOID.",0],
['escaped newlines',"CHALLENGE STANDING: x -- Premise 1 is VOID.\\nCHALLENGER CONCEDED LINKS: 0 -- Premise 1 is not VOID.",1],
['VOID in a non-label line',"Reasoning: Premise 1 is VOID.\nCHALLENGER CONCEDED LINKS: 0 -- Premise 1 is not VOID.",0],
];for(const [nm,t,w] of C){const r=f(t);console.log((w==="?"?"?? ":(r.length>0)===!!w?"ok ":"BAD"),nm,"|",r.length);}
