// W1 pkgOWR (ASK 169, the operator's card choice "List them"): each close request lists the side's own record, computed by the
// system: the lines of its earlier rounds that narrow, concede, withdraw or drop one of its links, and its grant sentences
// (the pkgGAV/pkgSGJ grants finder OGR.harvest, run on the side's own rounds 1 to 3). D4 Build (defender close) and C4 Build
// (challenger close). No other node. usage: node pkgOWR/build.cjs <parent in> <parent out>
const fs=require('fs'),crypto=require('crypto');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const node=nm=>W.nodes.find(n=>n.name===nm);const sub=(n,A,B,what)=>{const c=n.parameters.jsCode;if(c.split(A).length!==2)throw new Error('anchor '+what+' x'+(c.split(A).length-1));n.parameters.jsCode=c.replace(A,()=>B);};
const C4=node('C4 Build'),D4=node('D4 Build');const c0=C4.parameters.jsCode.length,d0=D4.parameters.jsCode.length;
// the grants finder, copied from C4 Build (OGR head to the end of harvest) into D4 Build, which runs before C4 Build
const cc=C4.parameters.jsCode;const a=cc.indexOf('const OGR=(()=>{');const b=cc.indexOf(' function block(G)',a);if(a<0||b<0)throw new Error('OGR');
const OGRH=cc.slice(a,b).replace('const OGR=(()=>{','const OGR=(()=>{')+' return {harvest};})();';
// the block, shared text (same in both nodes)
const OWRF="const OWR=(R,G)=>{try{const st=x=>String(x).replace(/[*_`]+/g,'').replace(/^[\\s>#-]+/,'').trim();const MK=/^(?:LINK\\s+|[DC])(\\d+)\\s*(?:\\[[^\\]\\n]*\\]|\\([^)\\n]*\\))?\\s*:\\s*(?:NARROWED TO|CONCEDED?|WITHDRAWN|DROPPED)\\b/i;const out=[];"
 +"for(const [rk,t] of R)for(const l of String(t||'').split('\\n')){const s=st(l);if(MK.test(s))out.push('['+rk+'] '+s.slice(0,260));}"
 +"for(const g of (G||[]))out.push('['+R[+String(g.round).slice(2)-1][0]+'] \"'+g.text+'\"');"
 +"return out.length?'YOUR OWN RECORD -- computed by the system from the transcript, not by a model: each line of your earlier rounds that narrows, concedes, withdraws or drops one of your links, and each sentence in which you grant, concede, withdraw or drop footing, word for word with its round. Your close may keep these or go further; it may not deny any of them, or restore what they narrowed, conceded, withdrew or dropped:\\n'+out.join('\\n'):'';}catch(e){return '';}}; /* pkgOWR */";
// D4 Build: rounds CR1..CR3 of the defender
sub(D4,"const sys=I.dsys;const msgs=",OGRH+"\n"+OWRF+"\nconst __OWB=(()=>{try{const R=[['CR1',$('D1 Extract').first().json.raw],['CR2',$('D2B Extract').first().json.raw],['CR3',$('D3B Extract').first().json.raw]];return OWR(R,OGR.harvest({CR1:R[0][1],CR2:R[1][1],CR3:R[2][1]}));}catch(e){return '';}})();\nconst sys=I.dsys;const msgs=",'D4 sys');
sub(D4,"+OPEN+'\\n\\nCLOSE ROUND -- your final defense.","+OPEN+(__OWB?'\\n\\n'+__OWB:'')+'\\n\\nCLOSE ROUND -- your final defense.",'D4 close');
// C4 Build: rounds DR1..DR3 of the challenger (RW), grants finder already present
sub(C4,"const sys=I.csys;const msgs=",OWRF+"\nconst __OWB=(()=>{try{const R=[['DR1',RW.gr1],['DR2',RW.gr2],['DR3',RW.dr3]];return OWR(R,OGR.harvest({CR1:R[0][1],CR2:R[1][1],CR3:R[2][1]}));}catch(e){return '';}})();\nconst sys=I.csys;const msgs=",'C4 sys');
sub(C4,"+(__OCB2?'\\n\\n'+__OCB2:'')+'\\n\\nCLOSE ROUND -- your final words.","+(__OCB2?'\\n\\n'+__OCB2:'')+(__OWB?'\\n\\n'+__OWB:'')+'\\n\\nCLOSE ROUND -- your final words.",'C4 close');
fs.writeFileSync(fout,JSON.stringify(raw));
console.log('D4 Build +'+(D4.parameters.jsCode.length-d0),'C4 Build +'+(C4.parameters.jsCode.length-c0),'total +'+(D4.parameters.jsCode.length-d0+C4.parameters.jsCode.length-c0),'sha',crypto.createHash('sha256').update(fs.readFileSync(fout)).digest('hex').slice(0,16));
