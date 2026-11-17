// ASK 355 builder. Usage: node build355.cjs <base.json> <out.json> <lib.cjs>
const fs=require('fs');const {unpack,rb}=require(process.argv[4]);
const W=JSON.parse(fs.readFileSync(process.argv[2]));const U=unpack(W);const L=U.L.slice();
const rep=(i,a,b)=>{const n=L[i].split(a).length-1;if(n!==1)throw new Error('line '+i+': anchor found '+n+' times: '+a.slice(0,80));L[i]=L[i].replace(a,()=>b);};
// 1. ECW (line 3500): pressed-verse reader
rep(3500," /* gate: {applies:false} | {send:true,note,cb} | {send:false,why} */",
" /* ASK 355 (Wall 7487/7490; reviews W3 7489, W2 7492): the line's own pressed verse = the references at the head of the collision line and the GROUND's [L1] verse; a FORCED item reads them from the same seat's collision line for the pair */\n"+
" function pressed(x,sib){let L=String(x&&x.flagged_line||'').replace(/\\\\+\"/g,'\"');let from='line';const fm=L.match(/^\\s*(?:[-•]\\s*|\\d+[.)]\\s*)?FORCED\\s*:\\s*(D\\d+)\\s+vs\\.?\\s+(C\\d+)\\b/i);\n"+
"  if(fm){const re=new RegExp('^\\\\s*(?:[-•]\\\\s*|\\\\d+[.)]\\\\s*)?'+fm[1]+'\\\\s+vs\\\\.?\\\\s+'+fm[2]+'\\\\b','i');const s=(sib||[]).find(y=>y&&y!==x&&y.rule===x.rule&&y.item===x.item&&String(y.seat||'')===String(x.seat||'')&&re.test(String(y.flagged_line||'')));if(!s)return {refs:[],from:null};L=String(s.flagged_line).replace(/\\\\+\"/g,'\"');from='collision line';}\n"+
"  const out=[];const add=t=>{for(const m of String(t||'').matchAll(new RegExp(REF.source,'g')))out.push({book:m[1],ch:+m[2],v1:+m[3],v2:+(m[4]||m[3])});};\n"+
"  const h=L.match(/^\\s*(?:[-•]\\s*|\\d+[.)]\\s*)?D\\d+\\s+vs\\.?\\s+C\\d+\\s*\\(([^)]*)\\)/i);if(h)add(h[1]);\n"+
"  const gi=L.search(/GROUND\\s*:/i);if(gi>=0)for(const g of L.slice(gi).matchAll(/\\[L1\\]([\\s\\S]*?)(?=\\[L[1-4]\\]|\\s\\|\\s|\\s--\\s|$)/gi))add(g[1].replace(/\"[^\"]*\"|“[^”]*”/g,' ')); /* rev 2 (W3 7502 F1): every [L1] segment of the GROUND */\n"+
"  return {refs:out,from};}\n"+
" function onPressed(c,pv){return (pv&&pv.refs||[]).some(p=>p.book===c.book&&p.ch===c.ch&&c.v1<=p.v2&&c.v2>=p.v1);}\n"+
" function pvHeld(x,c,ctx){const pv=pressed(x,ctx&&ctx.sib);return onPressed(c,pv)?{applies:true,send:false,why:'its CARRIED BY '+c.ref+' is the line\\'s own pressed verse'+(pv.from==='collision line'?', read from its collision line':'')+'; the words in dispute cannot carry a rival reading of themselves; a rival reading is carried by another row read with it (Commitment 16; ASK 355)'}:null;}\n"+
" /* gate: {applies:false} | {send:true,note,cb} | {send:false,why} */");
rep(3500,"if(EX.test(why))return {applies:false,exempt:true};","if(EX.test(why)&&!field(why))return {applies:false,exempt:true}; /* ASK 355: a reply line that names CARRIED BY offers a rival reading and goes through the gate */");
rep(3500,"if(c.kind==='BAD')return {applies:true,send:false,why:'its CARRIED BY is not in a form the code reads: '+c.raw.slice(0,120)};",
"if(c.kind==='BAD')return {applies:true,send:false,why:'its CARRIED BY is not in a form the code reads: '+c.raw.slice(0,120)};\n"+
"  {const ph=pvHeld(x,c,ctx);if(ph)return ph;}");
rep(3500,"const R=ctx&&ctx.R;const sd=side(x.flagged_line,x.item);if(!R||!sd.s)return {applies:true,send:true,note:",
"const R=ctx&&ctx.R;const sd=side(x.flagged_line,x.item);if(!R||!sd.s){const c0=field(why);const ph=c0&&c0.kind!=='BAD'?pvHeld(x,c0,ctx):null;if(ph)return ph;} /* rev 2: the pressed-verse check runs before the NOT CHECKED path too */\n  if(!R||!sd.s)return {applies:true,send:true,note:");
rep(3500,"const g=gate(x,v,{R,rows:cv,words:ow});","const g=gate(x,v,{R,rows:cv,words:ow,sib:ids});");
rep(3500,"return {LIVE,N,field,gate,","return {LIVE,N,field,pressed,onPressed,pvHeld,gate,");
// 2. Enforcer prompts (Judge Enforcer Build, Alt and R2 Alt)
rep(3198,"a word that verse holds. Without it the STANDS is recorded and not sent back.",
"a word that verse holds. Without it the STANDS is recorded and not sent back. The CARRIED BY row is never the line\\'s own pressed verse (a verse named at the head of the line, or the GROUND\\'s [L1] verse; for a FORCED line, those of its collision line): that verse holds the words in dispute, and quoting it again shows no rival reading. Read the answer with every other verse either side quoted on the subject (Isaiah 28:10). A CARRIED BY on the pressed verse is recorded and not sent back (ASK 355). When you AGREE that a link is BROKEN, end that same reply line with -- CARRIED BY: <reference> \"<at least 6 words in a row of that verse, as the record holds it>\", the row whose words the rival reading cannot also hold (ASK 355, TRIAL: recorded only; the pressed-verse rule does not apply to an AGREE).");
rep(3200,"a word that verse holds. Without it the push is recorded and not sent back.",
"a word that verse holds. Without it the push is recorded and not sent back. The CARRIED BY row is never the line\\'s own pressed verse (a verse named at the head of the line, or the GROUND\\'s [L1] verse): that verse holds the words in dispute (Isaiah 28:10); a CARRIED BY on it is recorded and not sent back (ASK 355).");
// MAP
const M=JSON.parse(JSON.stringify(U.M));for(const k of Object.keys(M))M[k].n=rb(L,M[k]).length;
const T=U.hdr+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const out=JSON.parse(JSON.stringify(W));out.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T;
fs.writeFileSync(process.argv[3],JSON.stringify(out));
// byte-equal self check: rebuilding the base with no edits
const T0=U.hdr+'\n/*LIB*/'+JSON.stringify(U.L)+'\n/*MAP*/'+JSON.stringify(U.M)+U.tail;console.log('base rebuild byte-equal',T0===U.T);
