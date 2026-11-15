const fs=require('fs'),zlib=require('zlib');const W=JSON.parse(fs.readFileSync(process.argv[2]));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const l=L[1754];const f=new Function(l.slice(l.indexOf('function gateVnv2024'))+';return gateVnv2024;')();
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
];for(const [nm,t,w] of C){const r=f(t);console.log((w==='?'?'?? ':(r.length>0)===!!w?'ok ':'BAD'),nm,'|',r.length);}
const J=JSON.parse(zlib.gunzipSync(fs.readFileSync(process.argv[3])));const jt=t=>{const i=String(t).indexOf('\n[AUDIT');return i>0?t.slice(0,i):t;};let h=0,vv=0,nv=0;for(const j of J){const t=jt(j.verdict_raw);if(/\bVOID\b/.test(t))vv++;if(/not\s+VOID/i.test(t))nv++;const r=f(t);if(r.length){h++;console.log(' hit',j.id,j.judge_seat,r.map(x=>x.key).join(','));}}
console.log('judgments',J.length,'hits',h,'with VOID',vv,'with not VOID',nv);
