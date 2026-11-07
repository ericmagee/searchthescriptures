// pkgCLS (W2, run 33411 gemini; W4 report "Oracle concedes"). Engine fix in the send-back rewrite, 3 nodes: Alternate Merge Seat, Gate Record, Alt Gate Record.
// A send-back change replaces a judge's line. The rewrite counted the old line as a SUBSTRING of the text and replaced the first substring hit, so
// gemini's S7 change of its defender line "CONCEDED LINKS: 0" (to "CONCEDED LINKS: 1 -- Premise 2 CONCEDED (stated): ...") was also written into
// "CHALLENGER CONCEDED LINKS: 0". The counted text then showed an Oracle concede that the stored count (0) and the judge never had.
// pkgPS (b) fixed the same fault in build() (the derived standings); this fixes the text rewrite: (1) the count of a line is its whole-line
// occurrences; (2) cureRewrite replaces only a whole line (in the JSON reasoning string and in plain text), never a part of a longer line.
// Base: pkgLIB/orig_stack/patched (unstripped gap stack, W1 pkgLIB v4); W1 strips and repacks. Run from wall2024/: node pkgCLS/build_CLS.cjs [--base dir] [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const BASE=arg('--base','pkgLIB/orig_stack/patched'),OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const A=[
 ["const k=Math.max(1,text.split(o).length-1);","const k=Math.max(1,text.split('\\n').filter(l=>l===o).length); /* pkgCLS: whole-line count */"],
 ["if(j.includes(e))j=j.replace(e,()=>enc(n0));else miss=true;","{const __j=__clsLine(j,e,enc(n0),true);if(__j!=null)j=__j;else miss=true;} /* pkgCLS */"],
 ["for(const [o0,n0] of R.rp)t=t.replace(o0,()=>n0);ob.reasoning=t;","for(const [o0,n0] of R.rp){const __t=__clsLine(t,o0,n0,false);if(__t!=null)t=__t;}ob.reasoning=t; /* pkgCLS */"],
 ["for(const [o0,n0] of R.rp)t=t.replace(o0,()=>n0);s=t+rest;","for(const [o0,n0] of R.rp){const __t=__clsLine(t,o0,n0,false);if(__t!=null)t=__t;}s=t+rest; /* pkgCLS */"],
 ["function cureRewrite(raw,panel,R,seat,F0){",`/* pkgCLS (run 33411 gemini): replace the first WHOLE-line occurrence of o by n; null when o stands only inside a longer line. In a JSON string
   (js=true) a line ends at an encoded \\n or the string's quote. */
function __clsLine(s,o,n,js){if(!o)return null;let f=0,i;while((i=s.indexOf(o,f))>=0){const a=s.slice(0,i),b=s.slice(i+o.length);
  const st=js?(/(?:^|\\\\n|[^\\\\]")$/.test(a)||a===''):(i===0||a.endsWith('\\n'));const en=js?/^(?:\\\\n|"|$)/.test(b):(b===''||b[0]==='\\n');
  if(st&&en)return a+n+b;f=i+1;}return null;}
function cureRewrite(raw,panel,R,seat,F0){`]];
const plan={source:'W2 pkgCLS (33411 gemini concede line)',base:BASE,nodes:[]};
for(const name of ['Alternate Merge Seat','Gate Record','Alt Gate Record']){const f=name.replace(/ /g,'_')+'.js';const s0=fs.readFileSync(BASE+'/'+f,'utf8');let s=s0;
 for(const [a,b] of A){const c=s.split(a).length-1;if(c!==1)throw new Error(name+' anchor x'+c+': '+a.slice(0,50));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution','$workflow','$node','$items',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base_sha:sha(s0),final_sha:sha(s)});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(plan.nodes.map(n=>n.name+' '+n.base_sha+'->'+n.final_sha).join('\n'));
