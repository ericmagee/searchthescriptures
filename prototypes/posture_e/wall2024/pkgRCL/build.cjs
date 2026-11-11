// W2 pkgRCL: Close Enforcer Build names a code candidate when a closing round keeps the chain "as declared" after an earlier round narrowed, conceded or withdrew a link (run 34852 open item). Close Enforcer Build only (plain node).
// usage: node pkgRCL/build.cjs <parent in> <parent out>
const fs=require('fs');const [,,fin,fout]=process.argv;
const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const N=W.nodes.find(n=>n.name==='Close Enforcer Build');const s=N.parameters.jsCode;
const OLD="const links=cecLinks(F);const cands=cecOracle(F);";
const NEW="const links=cecLinks(F);const cands=cecOracle(F);cands.push(...cecReclaim(F,links,cands));";
const FN=String.raw`const cecReclaim=(F,links,prev)=>{/* pkgRCL rev 2: a close keeps links "as declared" after a narrowing; names from the clause "as declared" closes; no negation, no other side, not inside a quotation */const out=[],st=x=>x.replace(/[*_]+/g,'').replace(/^[\s>#-]+/,'').trim(),SE=/(?<=[.!?]["”’')\]]*)\s+/;let k=Math.max(0,...prev.map(c=>+String(c.id).slice(1)||0));
 for(const [sd,P,r,O] of [['DEFENDER','CR',['cr2','cr3','cr4'],/\b(?:challenger|opponent|other side)/i],['CHALLENGER','DR',['gr2','dr3','dr4'],/\b(?:defender|opponent|other side)/i]]){let q=null,cl='';
  for(const x of String(F[r[2]]||'').split(/\n+/).flatMap(l=>l.split(SE)).map(st)){const m=x.match(/\bas declared\b/i);if(!m)continue;const c=x.slice(0,m.index+11).split(/[;:]|\bbut\b|\bas narrowed\b/i).pop()+x.slice(m.index+11).split(/\band\b|[;:.]|\bbut\b/i)[0];
   if(/\b(?:stands?|keep|kept|holds?|remains?)\b/i.test(c)&&!/\b(?:not|never|no longer|cannot)\b|n[’']t\b/i.test(c)&&!O.test(c)&&(x.slice(0,m.index).match(/["“”]/g)||[]).length%2===0){q=x;cl=c;break;}}
  if(!q)continue;const T=sd[0],nm=new Set();for(const m of cl.matchAll(new RegExp('\\b'+T+'(\\d+)(?:\\s*(?:to|through|-|–)\\s*'+T+'?(\\d+))?','gi')))for(let i=+m[1];i<=+(m[2]||m[1]);i++)nm.add(i);
  const last={};r.slice(0,2).forEach((key,j)=>{for(const l of String(F[key]||'').split('\n')){const m=st(l).match(/^LINK\s+(\d+)\s*:\s*(NARROWED TO|CONCEDED?|WITHDRAWN|DROPPED)\b.*$/i);if(m)last[+m[1]]=[P+(j+2),m[0].split(SE)[0],m[2].toLowerCase().replace(/ to$/,'')];}});
  for(const n of (links[sd]||[]).filter(n=>last[n]&&(!nm.size||nm.has(n)))){const e=last[n];out.push({id:'X'+(++k),side:sd,by:'the code (pkgRCL)',kind:'LINK',n,earlier_round:e[0],earlier_q:e[1],closing_round:P+'4',closing_q:q,why:'the code found a closing sentence that keeps LINK '+n+' "as declared" and a line in ['+e[0]+'] that '+e[2]+' it; decide whether the close asserts again a part the earlier line left out (a part left out of a narrowed restatement counts as dropped)'});}}
 return out;};
`;
if(!s.includes(OLD))throw new Error('anchor not found');
const ns=s.replace("const S=$('Init Seats')",FN+"const S=$('Init Seats')").replace(OLD,NEW);
if(ns===s||!ns.includes('cecReclaim(F,links,cands)'))throw new Error('no change');
new Function('$','$input','return (async()=>{'+ns+'})');N.parameters.jsCode=ns;
const code=w=>w.nodes.reduce((a,n)=>a+(typeof n.parameters.jsCode==='string'?n.parameters.jsCode.length:0),0);
const W0=(JSON.parse(fs.readFileSync(fin,'utf8')).data||{}).workflow||JSON.parse(fs.readFileSync(fin,'utf8'));
fs.writeFileSync(fout,JSON.stringify(raw));console.log('SIZE (measured): Close Enforcer Build',s.length,'->',ns.length,'=',ns.length-s.length,'| fixed prompt text 0');
