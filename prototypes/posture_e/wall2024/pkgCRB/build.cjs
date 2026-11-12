const fs=require('fs'),crypto=require('crypto');
const [,,base,out]=process.argv;const w=JSON.parse(fs.readFileSync(base));
const n=w.nodes.find(x=>x.name==='Close Enforcer Build');let c=n.parameters.jsCode;const c0=c;
function rep(a,b){if(c.split(a).length!==2)throw 'anchor: '+a.slice(0,60);c=c.replace(a,()=>b);}
// 1. helper: the closing sentence's block (pkgCRB)
function cecBlock(T,q){/* pkgCRB rev 2: the block of the close that holds the WHOLE closing quote, from its heading to the next heading, at most 1500 characters before the sentence and 300 after it; a heading is a # line, a line opening with a bold phrase that is not a row label ([Ln]), or an ANSWER, LINK or C/D/X label, except that a bold lead-in on the closing sentence's own line does not open its block; no block when the whole quote is not found */T=String(T||'');const U=T.replace(/[\u2018\u2019]/g,"'");const ws=String(q||'').replace(/[\u2018\u2019]/g,"'").replace(/[*_]+/g,'').match(/[A-Za-z0-9\u00C0-\u024F\u1E00-\u1FFF']+/g)||[];if(ws.length<3)return '';const re=new RegExp(ws.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('[^A-Za-z0-9\u00C0-\u024F\u1E00-\u1FFF\']+'),'g');const hs=[...U.matchAll(re)];if(!hs.length)return '';const m=hs.find(h=>!/["\u201C']\s*[*_]*\s*$/.test(U.slice(Math.max(0,h.index-3),h.index)))||hs[0];const i=m.index;const H=/^[ \t>]*(?:#{1,6}\s|\*\*(?!\s*\[L\d)[^\n]{2,}?\*\*[ \t]*:?[ \t]*$|(?:\*\*)?(?:LINK\s+\d|ANSWER\s*:|(?:[CD]\d+|X\d+)\s*[:.-]))/,G=/^[ \t>]*\*\*(?!\s*\[L\d)[^\n]{2,}?\*\*/;
 const L=T.split('\n');let p=0,s=0,e=T.length,li=0;for(let k=0;k<L.length;k++){const a=p,b=p+L[k].length;if(b>=i&&a<=i){li=k;break;}p=b+1;}
 p=0;for(let k=0;k<L.length;k++){if((k<=li&&H.test(L[k]))||(k<li&&G.test(L[k])))s=p;if(k>li&&(H.test(L[k])||G.test(L[k]))){e=p;break;}p+=L[k].length+1;}
 s=Math.max(s,i-1500);e=Math.min(e,i+m[0].length+300);return T.slice(s,e).trim();}
rep("const PROMPT=","const cecBlock="+cecBlock.toString().replace(/^function cecBlock/,'function')+";\nconst PROMPT=");
// 2. candidate line carries the block
rep("\" -- named by '+c.by+(c.why?': '+c.why:'')).join('\\n'):'none';",
 "\" -- named by '+c.by+(c.why?': '+c.why:'')+(()=>{const k=c.closing_round+'|'+c.closing_q;if(__cb.has(k))return '\\n   CLOSING BLOCK: as under '+__cb.get(k)+'.';const b=cecBlock(F[CEC_RK[c.closing_round]],c.closing_q);if(b)__cb.set(k,c.id);return b?'\\n   CLOSING BLOCK (the closing sentence with the rows of its block, ['+c.closing_round+']):\\n   '+b.replace(/\\n/g,'\\n   '):'';})()).join('\\n'):'none';");
// 3. one prompt sentence
rep("Quote both sentences word for word and name the link:",
 "Read each candidate's closing sentence together with the rows of its CLOSING BLOCK: a closing sentence that draws its point from a row (\\\"So\\\", \\\"Therefore\\\", \\\"Thus\\\") asserts what that row says, so if the earlier sentence withdrew, dropped or rested nothing on that row, the close asserts it again.\\nQuote both sentences word for word and name the link:");
rep("const cl=cs.length?cs.map(","const __cb=new Map();const cl=cs.length?cs.map(");
n.parameters.jsCode=c;fs.writeFileSync(out,JSON.stringify(w));
console.log('code delta',c.length-c0.length,'sha',crypto.createHash('sha256').update(fs.readFileSync(out)).digest('hex').slice(0,16));
