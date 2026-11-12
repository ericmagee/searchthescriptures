// pkgOPC: a close-contradiction pair whose earlier or closing quotation is about the
// OPPONENT's contradictions (e.g. the close form line "OPPONENT'S CONTRADICTIONS: NONE.",
// or "The defender's own contradiction: ..." written by the challenger) is not a claim of
// the debater's own link; it is NOT CONFIRMED (form). Applied in Close Enforcer Record and
// Judge Contradiction Record (same CONFIRMED form-check block).
// usage: node build_OPC.cjs <in.json> <out.json>
const fs=require('fs');const [,,IN,OUT]=process.argv;
const w=JSON.parse(fs.readFileSync(IN,'utf8'));
const ANCHOR="if(!(links[side]||[]).includes(row.link))f.push('LINK '+row.link+' is not one of the '+side.toLowerCase()+'\\'s declared links ('+((links[side]||[]).join(', ')||'none read')+')');";
const ADD="\n  if([row.earlier_q,row.closing_q].some(q=>new RegExp(\"\\\\b(?:OPPONENT|\"+(side==='DEFENDER'?'CHALLENGER':'DEFENDER')+\")['’]?S\\\\s+(?:OWN\\\\s+)?CONTRADICTION\",'i').test(String(q||''))))f.push('a quotation is about the opponent\\'s contradictions, not a claim of the '+side.toLowerCase()+'\\'s own link (pkgOPC)');";
const sizes={};
for(const name of ['Close Enforcer Record','Judge Contradiction Record']){
  const n=w.nodes.find(x=>x.name===name);const c=n.parameters.jsCode;
  const k=c.split(ANCHOR).length-1;if(k!==1)throw new Error(name+': anchor count '+k);
  n.parameters.jsCode=c.replace(ANCHOR,ANCHOR+ADD);sizes[name]=n.parameters.jsCode.length-c.length;}
fs.writeFileSync(OUT,JSON.stringify(w));
console.log(JSON.stringify(sizes));
