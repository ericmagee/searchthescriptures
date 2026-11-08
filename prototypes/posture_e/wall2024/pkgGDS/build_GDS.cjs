// pkgGDS (W1, 11-08; Eric approved ASK 1, 19:47Z; W3 ruling 3362, class gate_reply_dash_separator): the gate and send-back readers accept "--"
// (or an em/en dash) between the item id and KEEP / CHANGE TO, as 33798 terra wrote: "GATE: G1 -- CHANGE TO: <line> -- [CR3] <reason>".
// Such a line is rewritten to the form before it is read: the first dash after the id becomes "||", and the LAST " -- " that is followed by a round
// tag (CR1-4, DR1-4, in brackets or not) or a quote mark becomes the "||" before the reason; the rest is the CHANGE TO line. A line that already
// has "||" is never touched. The reply gets a FORM NOTE: gate (library, 10 nodes) on the reason the audit prints; send-back (Send Back Record x3)
// on the logged line, so no cure check reads it.
// Library: base strip (default pkgLIB/strip_RTB3, the s67 library) -> pkgLIB/strip_GDS. Send Back Record x3: base workflow (default s67c/target_s67.json) -> pkgGDS/patched.
// Run from wall2024/: node pkgGDS/build_GDS.cjs [base strip] [dest strip] [base workflow]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RTB3')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_GDS')+'/patched/',WF=process.argv[4]||'/mnt/project-files/wall2024/s67c/target_s67.json';
const PLAN='pkgGDS/plan_GDS.json';fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});fs.mkdirSync('pkgGDS/patched',{recursive:true});
const FN=String.raw`/* pkgGDS (W3 3362, Eric ASK 1): a gate or send-back reply line written with "--" where the form needs "||" is rewritten to the form; null when the line already has "||" or is not such a line */
function gdsDash2024(l){const s=String(l==null?'':l);if(/\|\|/.test(s))return null;const m=s.match(/^(\s*(?:[-•>]\s+)?(?:(?:SENDBACK|GATE)\s*:?\s*)?(?:ITEM\s*)?#?\s*[SG]\s*\d+\s*:?)\s*(?:--|—|–|-(?=\s))\s*(KEEP\b|CHANGE\s+TO\b)([\s\S]*)$/i);if(!m)return null;
 const rest=m[3];let at=-1,len=0;for(const x of rest.matchAll(/\s*(?:--|—|–)\s*(?=\[\s*(?:CR|DR)[1-4]|\(\s*(?:CR|DR)[1-4]|(?:CR|DR)[1-4]\b|["“‘'])/gi)){at=x.index;len=x[0].length;}
 return m[1].replace(/\s+$/,'')+' || '+m[2]+(at>=0?rest.slice(0,at)+' || '+rest.slice(at+len):rest);}
const GDS_NOTE='[FORM NOTE: this reply line used a dash where the form needs the double bar; the engine read it as the form (pkgGDS)]';
`;
const LIB=[
 ['gate line',"for(const l0 of T2.split('\\n')){const l=l0.replace(/[*_`]+/g,'').trim();{const r=__sbRL(l);if(r&&r.form==='REPLY'&&r.f&&r.f.kind==='GATE'){",
  "const __gds=new Set();for(const l0 of T2.split('\\n')){const __l0=l0.replace(/[*_`]+/g,'').trim();const __gd=gdsDash2024(__l0);const l=__gd||__l0;if(__gd)__gds.add(l); /* pkgGDS */{const r=__sbRL(l);if(r&&r.form==='REPLY'&&r.f&&r.f.kind==='GATE'){"],
 ['gate note',"line:l};}\n return A;}","line:l};}\n for(const k in A)if(__gds.has(A[k].line)){A[k].form='DASH';A[k].why=(A[k].why?A[k].why+' ':'')+GDS_NOTE;} /* pkgGDS */\n return A;}"]];
const SBR=[
 ['send-back line',"for(const l0 of T2.split('\\n')){const l=l0.replace(/[*_`]+/g,'').trim();",
  "const __gds=new Set();for(const l0 of T2.split('\\n')){const __l0=l0.replace(/[*_`]+/g,'').trim();const __gd=gdsDash2024(__l0);const l=__gd||__l0;if(__gd)__gds.add(l); /* pkgGDS */"],
 ['send-back note',"line:l};}\n (b.items||[]).forEach((it,k)=>{const a=A[it.sid];","line:l};}\n for(const k in A)if(__gds.has(A[k].line)){A[k].form='DASH';A[k].line=GDS_NOTE+' '+A[k].line;} /* pkgGDS */\n (b.items||[]).forEach((it,k)=>{const a=A[it.sid];"]];
const one=(s,a,b,where)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(where+': anchor x'+n+': '+a.slice(0,60));return s.replace(a,()=>b);};
const plan={library:{base:SRC,nodes:{}},workflow:{base:WF,nodes:{}}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;
 if(s.includes('function gateRead2024(')){const i=s.indexOf('function gateRead2024(');const j=s.indexOf('\nfunction ',i+10);let b=s.slice(i,j);for(const [k,a,r] of LIB)b=one(b,a,r,f+' '+k);s=s.slice(0,i)+FN+b+s.slice(j);
  new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.library.nodes[f]={base:h(s0),patched:h(s)};}
 fs.writeFileSync(DST+f,s);}
const W=JSON.parse(fs.readFileSync(WF,'utf8'));
for(const n of ['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record']){const s0=W.nodes.find(x=>x.name===n).parameters.jsCode;let s=s0;for(const [k,a,r] of SBR)s=one(s,a,r,n+' '+k);s=FN+s;
 new (Object.getPrototypeOf(async function(){}).constructor)('$','$input',s);fs.writeFileSync('pkgGDS/patched/'+n.replace(/ /g,'_')+'.js',s);plan.workflow.nodes[n]={base:h(s0),patched:h(s)};}
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log('library',Object.keys(plan.library.nodes).length,'workflow',Object.keys(plan.workflow.nodes).length);
