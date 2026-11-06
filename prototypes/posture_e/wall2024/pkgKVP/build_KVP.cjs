// pkgKVP (W3 grade_33083, LIVE false charge): K-V binds a VOID ruling to the premise it names.
// Run from wall2024/: node pkgKVP/build_KVP.cjs [base, default pkgKCMF] [out, default pkgKVP].
// kvSegments cuts the count section and the standing line into one segment per premise mention (PW_SEG). PW_SEG starts a segment only after a
// line start, ". ", "; ", "--" or ": ", so a clause such as ", and premise 6 is VOID." stays inside the segment of the premise before it.
// Run 33083 sol, CHALLENGE STANDING: "Premise 3 is UNEXHIBITED because ... NOT COUNTED; premises 1, 2, 4 and 5 exhibit their footing, and premise
// 6 is VOID." The segment of premise 3 held "VOID", so K-V read premise 3 as ruled VOID, found no charge words quoted for it, and charged
// "CHALLENGER premise 3" (LIVE, UNCURED: sol not counted). Premise 6 has its own, valid VOID ruling in the count section.
// Fix: inside a segment, a "premise(s) N ... is/are VOID" clause that names none of the segment's own premises is taken out before the VOID test,
// and becomes a segment of the premises it names (the first segment of a premise still decides, as before).
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const HELP="function kvpOwn2024(seg,ns,out){try{const S=String(seg);let t=S,m;const RX=/(^|[\\s,;(])(premises?\\s+(\\d+(?:(?:\\s*,\\s*(?:and\\s+)?|\\s+and\\s+|\\s*&\\s*)\\d+)*)\\s+(?:is|are|was|were)\\s+(?:also\\s+|ruled\\s+|thus\\s+)?VOID\\b)/gi;\n"
+" while((m=RX.exec(S))){const nn=m[3].split(/\\s*(?:,|and|&)\\s*/).map(Number).filter(n=>n>0);if(!nn.length||nn.some(n=>(ns||[]).includes(n)))continue;t=t.replace(m[2],' ');out.push({ns:nn,seg:S.slice(m.index+m[1].length).trim()});}\n"
+" return t;}catch(e){return String(seg);}} /* pkgKVP (W3 grade_33083): a VOID clause naming another premise is that premise's */\n";
const OLD="at.forEach((x,k)=>{const seg=src.slice(x.i,k+1<at.length?at[k+1].i:src.length);if(!/\\bVOID\\b/.test(seg)||";
const NEW="at.forEach((x,k)=>{const seg=src.slice(x.i,k+1<at.length?at[k+1].i:src.length);if(!/\\bVOID\\b/.test(kvpOwn2024(seg,x.ns,out))||";
const BASE=(process.argv[2]||'pkgKCMF')+'/patched';const OUT=process.argv[3]||'pkgKVP';const plan={base:BASE,nodes:[]};fs.rmSync(OUT+'/patched',{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;
 if(t.split(OLD).length!==2)throw new Error(f+' anchor');const i=t.indexOf('function kvSegments(');if(i<0)throw new Error(f+' kvSegments');
 t=t.slice(0,i)+HELP+t.slice(i);t=t.replace(OLD,()=>NEW);new Function('$','$input','$json',t);fs.writeFileSync(OUT+'/patched/'+f,t);plan.nodes.push({file:f,base_sha:sha(b),final_sha:sha(t),edits:['kvpOwn2024 in kvSegments']});}
fs.writeFileSync(OUT+'/plan_KVP.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes edited');
