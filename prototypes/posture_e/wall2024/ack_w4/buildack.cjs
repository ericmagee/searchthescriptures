// ASK 353 build rev 1b (W2 7492: the judge's grade form gates both parts; live cure reason kept on non-FORCED withdrawals) (plan Wall 7484; W3 7485, W1 7488): footing pushes and footing withdrawals on E-COL. Base: fresh s239 fetch live.json (87f6d416).
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync(process.argv[2]||'live.json'));const BASEV=process.argv[3]||'87f6d416-1a0a-4552-8d2a-eedd1968d19a';if(w.versionId!==BASEV)throw new Error('base moved: '+w.versionId);
const u=unpack(w);const L=u.L.slice();
const rep=(i,o,n)=>{const c=L[i].split(o).length-1;if(c!==1)throw new Error('line '+i+' anchor count '+c);L[i]=L[i].replace(o,()=>n);};
const pre=(i,startsWith,p)=>{if(!L[i].startsWith(startsWith))throw new Error('line '+i+' start anchor');L[i]=p+L[i];};
/* the footing reader (W3 7485 condition 2): a footing phrase outside quotations, not negated within the three words before it. A bare "assumed" or "unexhibited" is not read. */
const FOOT=String.raw`function ackFoot2024(t){const s=String(t||'').replace(/\\+"/g,'"').replace(/"[^"]*"|“[^”]*”/g,' ');const re=/\b(?:missing|borrowed|no)\s+footing\b|\bfooting\s+(?:defect|fault|gap)\b|\bassumed[\s-]+fact\b|\brather\s+than\s+exhibit\w*|\bunexhibited\s+(?:\w+\s+){0,2}fact\b/ig;let m;while((m=re.exec(s))){const pre=s.slice(Math.max(0,m.index-40),m.index);if(/\b(?:not|never|nor|no longer|isn't|is not|without)\s+(?:\w+\s+){0,2}$/i.test(pre))continue;return m[0].replace(/\s+/g,' ');}return null;} function ackForm2024(l){return !!(ackFoot2024(l)||/\bASSUMES\s*:/.test(String(l||'').replace(/\\+"/g,'"').replace(/"[^"]*"|“[^”]*”/g,' ')));} /* ASK 353: footing reader (a footing phrase outside quotations, not negated; bare "assumed" or "unexhibited" not read); the judge's grade form (7484 item 3d) */ `;
// Judge Enforcer Record x3: the reader, and Part A in ETC
pre(3354,"const ETC=(rule,tag,why)=>{",FOOT);
rep(3354,"const ETC=(rule,tag,why)=>{","const ETC=(rule,tag,why,fl)=>{");
rep(3406,"ETC(x.rule,v.right,v.why)","ETC(x.rule,v.right,v.why,x.flagged_line)");
rep(3361," let c=null;for(const p of P){"," if(rule==='E-COL'&&/^(?:STANDS|UNDERDETERMINED)$/.test(String(tag).toUpperCase().trim())){const __af=ackForm2024(fl)?ackFoot2024(why):null;if(__af)return 'BROKEN (its own reason names a footing defect, \"'+__af+'\": a missing fact is not a meaning that can agree, so the push to '+String(tag).toUpperCase().trim()+' is not sent; ASK 353)';} let c=null;for(const p of P){");
// Send Back Record x3: the reader, and Part B at the withdrawal cure
pre(2647,"function enf428Cure(it,a,R,named){",FOOT);
rep(2688,"   if(!/\\b(?:BROKEN|FORCED)\\b/.test(to)&&(!pr||pr.test(to)||/^\\s*RETRACTED\\b/i.test(to)))return res(true,'CHANGE TO a line that does not grade the pair BROKEN or FORCED');",
"   const __rt=/^\\s*RETRACTED\\b/i.test(to);if(__rt||(!/\\b(?:BROKEN|FORCED)\\b/.test(to)&&(!pr||pr.test(to)))){const __af=it.grt2||!ackForm2024(it.line)?null:ackFoot2024(to+' '+(a.why||''));if(__af)return res(false,'withdrawn, but its own words name a footing defect (\"'+__af+'\"): a missing fact is not cured by withdrawing the break (ASK 353)');return res(true,__rt&&/\\b(?:BROKEN|FORCED)\\b/.test(to)?'CHANGE TO RETRACTED':'CHANGE TO a line that does not grade the pair BROKEN or FORCED');} /* ASK 353: RETRACTED is a withdrawal even when its text holds FORCED */");
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k+' '+M[k].n+'->'+len);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync(process.argv[4]||'target_ack.json',JSON.stringify(w));console.log('MAP n updated',fixed.length,fixed.join('; '));
