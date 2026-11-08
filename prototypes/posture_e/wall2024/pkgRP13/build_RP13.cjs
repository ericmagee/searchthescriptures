// pkgRP13 (reader phase 2, item 13, W4): Main Enforcer Build's __estOf reads the judge's "STATEMENT: K-W|K-S3 <item> | <text>" line from the
// cure reply. It now asks the shared reader first (STATEMENT form: item before the first "|", text after); the reader's item must start with
// K-W or K-S3. A line the reader does not read as STATEMENT keeps the old regex. Enforcer Build gets the reader block (the same embedded text
// Send Back Build carries, as pkgRP10/pkgRP12). Run from wall2024/: node pkgRP13/build_RP13.cjs <fetchback or composed target>
const fs=require('fs'),cr=require('crypto');const sha=s=>cr.createHash('sha256').update(String(s)).digest('hex').slice(0,12);
const F=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s66.json';const W=JSON.parse(fs.readFileSync(F,'utf8'));
const node=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const SBB=node('Send Back Build');const i=SBB.indexOf('const __RL=');const END='return module.exports;})();';const j=SBB.indexOf(END,i)+END.length;
if(i<0||j<END.length)throw new Error('reader block not found in Send Back Build');const RL=SBB.slice(i,j);
const A0=String.raw`const m=l.match(/^STATEMENT\s*:\s*(K-W|K-S3)\s+(.+?)\s*\|\s*([\s\S]*)$/i);`;
const A1=String.raw`const m=__ri13(l)||l.match(/^STATEMENT\s*:\s*(K-W|K-S3)\s+(.+?)\s*\|\s*([\s\S]*)$/i); /* pkgRP13 */`;
const H0='const __estOf=r=>{';
const H1='/* pkgRP13 (reader item 13): the STATEMENT line as the shared reader reads it, in the old match shape [line, rule, item, text], or null (another form, RESPONSE, no "|", or an item that is not K-W/K-S3): the old read decides on null */\n'
 +"const __ri13=l=>{let r=null;try{r=__RL.readLine(String(l==null?'':l));}catch(e){r=null;}if(!r||r.form!=='STATEMENT'||!r.f||r.f.which!=='STATEMENT'||r.f.item==null)return null;const im=String(r.f.item).match(/^(K-W|K-S3)\\s+(.+)$/i);return im?[l,im[1],im[2],String(r.f.text)]:null;};\n"
 +'const __estOf=r=>{';
const n='Enforcer Build';let c=node(n);const b=sha(c);if(c.includes('const __RL='))throw new Error('already has a reader');
const one=(c,a,z)=>{const k=c.split(a).length-1;if(k!==1)throw new Error('anchor x'+k+': '+a.slice(0,70));return c.replace(a,()=>z);};
c=one(c,A0,A1);c=one(c,H0,H1);c='/* pkgRP13 (reader item 13): the shared reader block, the same embedded text Send Back Build carries */\n'+RL+'\n'+c;
new (Object.getPrototypeOf(async function(){}).constructor)(c);fs.mkdirSync('pkgRP13/patched',{recursive:true});fs.writeFileSync('pkgRP13/patched/Enforcer_Build.js',c);
const plan={base:F,base_versionId:W.versionId,nodes:{[n]:{base:b,patched:sha(c)}}};fs.writeFileSync('pkgRP13/plan_RP13.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan,null,1));
