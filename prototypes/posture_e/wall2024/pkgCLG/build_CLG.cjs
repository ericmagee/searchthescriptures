// pkgCLG (W1): follow-up to pkgCLK rev 3, Close Enforcer Record only. Built on parent_s119_CLK3.json.
// 1. Conflicting-answers grouping: every row joins its candidate group (I|id, candidates only) AND its pair group (side + both quotations),
//    so a candidate row CONFIRMED and a NEW row NOT A CONTRADICTION on the same two quotations conflict (W4 limit (a), Wall 4611; W2 Wall 4627).
//    The pkgCLK rev 3 relink guard (same quotations answered NOT A CONTRADICTION) is now covered by the grouping and is removed.
// 2. No relink when the closing quotation itself names a link of its side ("D1 to D6", "LINK 2"): W1 Wall 4626 item 4, W3 Wall 4631 P2;
//    and no relink of a code-built candidate (by "the code ...", e.g. pkgRCL): its link is the code's own (W4 R9, W2 Wall 4643).
// Usage (from wall2024/): node pkgCLG/build_CLG.cjs <parent_s119_CLK3.json> <live fetchback> <out.json>
const fs=require('fs'),crypto=require('crypto');const [PB,FB,OUT]=process.argv.slice(2);
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const d=g(PB),live=g(FB);
const out=JSON.parse(JSON.stringify(d));const n=out.nodes.find(x=>x.name==='Close Enforcer Record');let c=n.parameters.jsCode;
const one=(s,a)=>{const k=s.split(a).length-1;if(k!==1)throw new Error('anchor count '+k+': '+a.slice(0,80));};
const A1="{const gk=x=>/^NEW/.test(x.id)?'P|'+x.side+'|'+cecN(x.earlier_q)+'|'+cecN(x.closing_q):'I|'+x.id;const G={};rows.forEach(x=>{if(x.side==null)return;(G[gk(x)]=G[gk(x)]||[]).push(x);});";one(c,A1);
c=c.replace(A1,"{const G={};rows.forEach(x=>{if(x.side==null)return;const a=cecN(x.earlier_q),b=cecN(x.closing_q);[/^NEW/.test(x.id)?'':'I|'+x.id,a&&b?'P|'+x.side+'|'+a+'|'+b:''].forEach(k=>{if(k)(G[k]=G[k]||[]).push(x);});}); /* pkgCLG */");
const A2="if(rows.some(o=>o!==row&&o.side===row.side&&o.answer==='NOT A CONTRADICTION'&&cecN(o.earlier_q)===cecN(row.earlier_q)&&cecN(o.closing_q)===cecN(row.closing_q)))return;";one(c,A2);
c=c.replace(A2,"if((cands||[]).some(k=>k.id===row.id&&/^the code/.test(k.by||'')))return;if((row.side==='DEFENDER'?/\\b(?:D|LINK\\s+)\\d+\\b/i:/\\b(?:C|LINK\\s+)\\d+\\b/i).test(row.closing_q||''))return; /* pkgCLG */");
n.parameters.jsCode=c;
const code=w=>w.nodes.reduce((a,x)=>a+((x.parameters&&x.parameters.jsCode)||'').length,0);
const prm=w=>w.nodes.reduce((a,x)=>{const p=Object.assign({},x.parameters||{});delete p.jsCode;return a+JSON.stringify(p).length;},0);
const rec=w=>w.nodes.find(x=>x.name==='Close Enforcer Record').parameters.jsCode.length;
console.log('Close Enforcer Record: live '+rec(live)+', rev 3 '+rec(d)+', pkgCLG '+c.length+' | Code vs rev 3 '+(code(out)-code(d))+'; vs live s119 '+(code(out)-code(live))+'; non-code parameters vs live '+(prm(out)-prm(live)));
new Function('$','$input','return (async()=>{\n'+c+'\n})')
const s=JSON.stringify(out);fs.writeFileSync(OUT,s);fs.writeFileSync(__dirname+'/Close_Enforcer_Record.js',c);console.log('sha256 '+crypto.createHash('sha256').update(s).digest('hex').slice(0,16)+' '+OUT+' / parses');
