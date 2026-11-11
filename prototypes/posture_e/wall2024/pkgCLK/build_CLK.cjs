// pkgCLK rev 3 (W1, fault D of run 34852): the closing enforcer's link is set by the code from the closing block that holds the closing quotation.
// Close Enforcer Record only. The prompt rule ("the link whose closing block holds the sentence, else the link the earlier sentence supports") is unchanged;
// the code now applies its first half where a heading of the side's own close names exactly one link; otherwise DeepSeek's link stands.
// Usage (from wall2024/): node pkgCLK/build_CLK.cjs <fetchback> <out.json>
const fs=require('fs'),crypto=require('crypto');const [FB,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;
const out=JSON.parse(JSON.stringify(d));const n=out.nodes.find(x=>x.name==='Close Enforcer Record');let c=n.parameters.jsCode;
const one=(s,a)=>{const k=s.split(a).length-1;if(k!==1)throw new Error('anchor count '+k+': '+a.slice(0,80));};
// 1. the block finder, after cecStands
const A1="const cecDeclared=F=>{";one(c,A1);
const BLK="const cecBlk=(sd,q,raw)=>{const L=String(raw||'').split(/\\r?\\n/);const x=cecN(String(q).split(/\\.\\.\\.|…/)[0]);if(x.split(' ').length<3)return null;const I=L.map((l,i)=>cecN(l).includes(x)?i:-1).filter(i=>i>=0);if(I.length!==1)return null;for(let j=I[0]-1;j>=0;j--){const h=L[j].match(/^\\s*(?:#{1,4}\\s*[*_]*|[*_]{2})(.*)$/);if(h&&/^\\s*[*_]{2}\\s*ANSWER\\b/i.test(L[j]))continue;if(!h){if(/^\\s*-{3,}\\s*$/.test(L[j]))return null;continue;}const R=sd==='DEFENDER'?/\\b(?:D|LINK\\s+)(\\d+)\\b/gi:/\\b(?:C|LINK\\s+)(\\d+)\\b/gi;const N=new Set([...h[1].matchAll(R)].map(m=>+m[1]));return N.size===1&&R.test(h[1].slice(0,12))?[...N][0]:null;}return null;}; /* pkgCLK */\n";
c=c.replace(A1,BLK+A1);
// 2. apply after the conflicting-answers check (rev 2: the group key stays on the reply's own link), before the confirmed list
const A2="const seen=new Set();const confirmed=[];";one(c,A2);
const APP="rows.forEach(row=>{if(row.status!=='CONFIRMED')return;if(rows.some(o=>o!==row&&o.side===row.side&&o.answer==='NOT A CONTRADICTION'&&cecN(o.earlier_q)===cecN(row.earlier_q)&&cecN(o.closing_q)===cecN(row.closing_q)))return;const b=CEC_RK[row.closing_round]?cecBlk(row.side,row.closing_q,F[CEC_RK[row.closing_round]]):null;if(b==null||b===row.link||!(links[row.side]||[]).includes(b))return;row.link_named=row.link;row.link=b;row.note=(row.note?row.note+'; ':'')+'LINK '+b+' set by the code: the closing quotation stands in the block headed for link '+b+' (the reply named LINK '+row.link_named+'; pkgCLK)';});\n";
c=c.replace(A2,APP+A2);
// 3. rev 3 (W4 N1a): a NEW pair is keyed by side and its two quotations, not by link, so CONFIRMED on one link and NOT A CONTRADICTION on another is a conflict
const A3="const gk=x=>/^NEW/.test(x.id)?'P|'+x.side+'|'+x.link+'|'+cecN(x.earlier_q)";one(c,A3);
c=c.replace(A3,"const gk=x=>/^NEW/.test(x.id)?'P|'+x.side+'|'+cecN(x.earlier_q)");
n.parameters.jsCode=c;
const old=d.nodes.find(x=>x.name==='Close Enforcer Record').parameters.jsCode;
const code=w=>w.nodes.reduce((a,x)=>a+((x.parameters&&x.parameters.jsCode)||'').length,0);
const prm=w=>w.nodes.reduce((a,x)=>{const p=Object.assign({},x.parameters||{});delete p.jsCode;return a+JSON.stringify(p).length;},0);
console.log('Close Enforcer Record '+old.length+' -> '+c.length+'; Code '+code(d)+' -> '+code(out)+' = '+(code(out)-code(d))+'; non-code parameters '+(prm(out)-prm(d))+'; nodes changed '+out.nodes.filter((x,i)=>JSON.stringify(x)!==JSON.stringify(d.nodes[i])).length);
const s=JSON.stringify(out);fs.writeFileSync(OUT,s);fs.writeFileSync(__dirname+'/Close_Enforcer_Record.js',c);console.log('sha256 '+crypto.createHash('sha256').update(s).digest('hex').slice(0,16)+' '+OUT);
