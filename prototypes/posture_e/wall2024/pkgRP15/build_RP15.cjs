// pkgRP15 (reader phase 2, item 15, W4): the judge-line reads in the two report/save nodes ask the shared reader first.
//  Format Markdown  beforeCure: a line is one of the judge's own RESULT / CLAUSE / KEYSTONE lines when the reader reads it in that form,
//                   else the old regex decides.  seatReason: the reason of the first line the reader reads as RESULT with one of the three
//                   results and a non-empty reason that does not start with punctuation ("RESULT: DEFENDER WINS. The ..." has no reason form); else the old regex decides.
//  Build Save Body  block(): a line is the side's CONCEDED LINKS line, and its count, when the reader reads it as CONCEDED for that side
//                   (bare CONCEDED LINKS = DEFENDER); else the old regex decides. The text after the label is the old regex's slice when it
//                   matches, else everything after the label's colon and count.
// Both nodes get the reader block (the same embedded text Send Back Build carries, as pkgRP10/12/13).
// Run from wall2024/: node pkgRP15/build_RP15.cjs <fetchback or composed target>
const fs=require('fs'),cr=require('crypto');const sha=s=>cr.createHash('sha256').update(String(s)).digest('hex').slice(0,12);
const F=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s66.json';const W=JSON.parse(fs.readFileSync(F,'utf8'));
const node=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const SBB=node('Send Back Build');const i=SBB.indexOf('const __RL=');const END='return module.exports;})();';const j=SBB.indexOf(END,i)+END.length;
if(i<0||j<END.length)throw new Error('reader block not found in Send Back Build');const RL=SBB.slice(i,j);
const one=(c,a,z)=>{const k=c.split(a).length-1;if(k!==1)throw new Error('anchor x'+k+': '+a.slice(0,70));return c.replace(a,()=>z);};
const RD="const __rl15=l=>{try{return __RL.readLine(String(l==null?'':l));}catch(e){return null;}};";
const head=n=>'/* pkgRP15 (reader item 15): the shared reader block, the same embedded text Send Back Build carries */\n'+RD.replace('const __rl15',"const __rl15")+'\n';
const plan={base:F,base_versionId:W.versionId,nodes:{}};fs.mkdirSync('pkgRP15/patched',{recursive:true});
// Format Markdown
{const n='Format Markdown';let c=node(n);const b=sha(c);if(c.includes('const __RL='))throw new Error(n+' already has a reader');
 c=one(c,"const own = /^[ \\t*_]*(RESULT|CLAUSE|KEYSTONE)[ \\t*_]*:/;",
  "const own0 = /^[ \\t*_]*(RESULT|CLAUSE|KEYSTONE)[ \\t*_]*:/; const own = { test: l => { const r = __rl15(l); return !!(r && (r.form === 'RESULT' || r.form === 'CLAUSE' || r.form === 'KEYSTONE')) || own0.test(l); } }; /* pkgRP15 */");
 c=one(c,"const seatReason = raw => { const m =",
  "const seatReason = raw => { for (const l of String(raw || '').replace(/\\\\n/g, '\\n').split('\\n')) { const r = __rl15(l); if (r && r.form === 'RESULT' && r.f && /^(?:DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)$/.test(r.f.result) && String(r.f.reason || '').trim() && !/^[.,;:!?]/.test(String(r.f.reason).trim())) return String(r.f.reason).trim(); } /* pkgRP15: the reader first; the old read below decides when no line reads as RESULT with a reason */ const m =");
 c=RL+'\n'+head(n)+c;new (Object.getPrototypeOf(async function(){}).constructor)(c);
 fs.writeFileSync('pkgRP15/patched/Format_Markdown.js',c);plan.nodes[n]={base:b,patched:sha(c)};}
// Build Save Body
{const n='Build Save Body';let c=node(n);const b=sha(c);if(c.includes('const __RL='))throw new Error(n+' already has a reader');
 c=one(c,"let at=-1,cnt=null;L.forEach((l,i)=>{const m=l.match(lab);if(m){at=i;cnt=m[1]!=null?+m[1]:null;}});if(at<0)return null;\n  const parts=[L[at].replace(lab,'')];",
  "let at=-1,cnt=null;L.forEach((l,i)=>{const r=__rl15(l);if(r&&r.form==='CONCEDED'&&r.f&&r.f.side===side&&Number.isInteger(r.f.n)){at=i;cnt=r.f.n;return;}const m=l.match(lab);if(m){at=i;cnt=m[1]!=null?+m[1]:null;}});if(at<0)return null; /* pkgRP15: the reader first */\n  const parts=[lab.test(L[at])?L[at].replace(lab,''):L[at].replace(/^[^:]*:\\s*\\**\\s*(?:\\d+)?/,'')];");
 c=RL+'\n'+head(n)+c;new (Object.getPrototypeOf(async function(){}).constructor)(c);
 fs.writeFileSync('pkgRP15/patched/Build_Save_Body.js',c);plan.nodes[n]={base:b,patched:sha(c)};}
fs.writeFileSync('pkgRP15/plan_RP15.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan,null,1));
