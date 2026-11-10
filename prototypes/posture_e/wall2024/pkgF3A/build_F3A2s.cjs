// pkgF3A rev 2s (W2): the smallest retry form meeting W3's closing condition (Wall 4231). SET=RETRY|ALL (ALL adds the family exemption, +46).
// Second Alternate? (plain): retry the same model once after an unusable reply. Alternate Merge (plain): round 2 lines are read against round 2's
// own base, so a retry's line equal to round 1's is kept; alternate_round2 names the retry. No library change.
const fs=require('fs');const SET=process.env.SET||'ALL';const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;d=d.workflow||d;
const by={};d.nodes.forEach(n=>by[n.name]=n);const L0={};['Second Alternate?','Alternate Merge'].forEach(n=>L0[n]=by[n].parameters.jsCode.length);
const edit=(n,a,b)=>{const s=by[n].parameters.jsCode;if(s.split(a).length!==2)throw new Error(n+': anchor not unique');by[n].parameters.jsCode=s.replace(a,b);};
edit('Second Alternate?',"const a2r={run:false,seats:[],tried:[],free:[],why:null};","const a2r={run:false,seats:[],tried:[],free:[],retry:[],why:null};");
edit('Second Alternate?',"const failed=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)).map(x=>x.removed_seat))];",
 "const failed=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)).map(x=>x.removed_seat))];\n a2r.retry=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)&&/returned content null|returned no JSON object|JSON did not parse/.test(x.why)).map(x=>x.api_model))];a2r.tried=a2r.tried.filter(m=>a2r.retry.indexOf(m)<0); /* pkgF3A: one retry after an unusable reply */");
if(SET==='ALL')edit('Second Alternate?',"const free=(RS.alternates||[]).filter(a=>!deb.some(d=>d.model===a.api_model||d.family===a.family)","const free=(RS.alternates||[]).filter(a=>!deb.some(d=>d.model===a.api_model||(d.family===a.family&&a.api_model!=='anthropic/claude-haiku-5.5'))");
edit('Alternate Merge',"const nl=k2>=0?newLines(rawOf(R2.bodies[k2]),r1raw):[];","const nl=k2>=0?newLines(rawOf(R2.bodies[k2]),rawOf(($('Second Alternate?').first().json.bodies||[]).find(b=>seatOf(b)===rs))):[]; /* pkgF3A: against round 2's base */");
edit('Alternate Merge',"free:(SA&&SA.free)||[],result}};","free:(SA&&SA.free)||[],retry:(SA&&SA.retry)||[],result}};");
const t=Object.keys(L0).map(n=>n+' '+(by[n].parameters.jsCode.length-L0[n])).join(', ');console.log(SET+': '+t+'; total +'+Object.keys(L0).reduce((a,n)=>a+by[n].parameters.jsCode.length-L0[n],0)+' (measured); prompt none');
fs.writeFileSync(OUT,JSON.stringify(d));
