// pkgL2B (W3 Wall 2876 item 5; outside review of 33345: "CR1 begat ... map: begat in none of them"). The [L2] check (L2C.tags, in all 55 nodes that
// carry L2C) reads an [L2] tag's words from the text AFTER the tag. A debater may write the tag AFTER the words it labels, as in a DECLARED CHAIN
// entry: "... with *ek* (out of, source) and *gennēthen* (begotten) [L2], and Matthew 1:2's "begat" pattern [L3]." The check then read the next
// clause and took the quoted English "begat" as a transliteration. Now: when the tag is followed at once by , ; . or ) and the text before it on the
// same line (back to the previous [Ln] tag) names source words, and the text after it names none (no Strong's number, no Greek or Hebrew
// script, no italic word), the words before it are the tag's segment. Every other tag is read as before.
// Base: live s44. Run from wall2024/: node pkgL2B/build_L2B.cjs [--base file] [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const SRC=arg('--base','/mnt/project-files/wall2024/fetchback_live_s44.json');
const W=JSON.parse(fs.readFileSync(SRC,'utf8'));const L=(W.data||W);const OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const A0="let seg=t.slice(i+4,Math.min(e,i+4+500));";
const A1=A0+"{const __pa=t.slice(i+4,i+12);if(/^\\s*[,;.)]/.test(__pa)&&!/\\b[GH]0*\\d{1,5}\\b|[\\u0370-\\u03ff\\u1f00-\\u1fff\\u0590-\\u05ff]|(?:^|[^*\\w])[*_][^*_\\n]{2,60}[*_]/.test(seg)){const __ls=t.lastIndexOf('\\n',i-1)+1;let __ps=__ls;for(const __m of t.slice(__ls,i).matchAll(/\\[L[1-4]\\]/g))__ps=__ls+__m.index+4;const __pre=t.slice(Math.max(__ps,i-500),i);if(tagWords(__pre).length)seg=__pre;}} /* pkgL2B (W3 2876): a tag written after its words ([L2], or [L2].) reads the words before it */";
const plan={source:'W2 pkgL2B, W3 2876 item 5 (begat back-reference [L2])',live:L.versionId,base:SRC,nodes:[]};
for(const node of L.nodes){const s0=node.parameters&&node.parameters.jsCode;if(!s0||!s0.includes('L2C=(()=>'))continue;const c=s0.split(A0).length-1;if(c!==1)throw new Error(node.name+' anchor x'+c);
 const s=s0.replace(A0,()=>A1);new Function('$','$input','$json','$execution','$workflow','$node','$items',s);const f=node.name.replace(/[ ?\/]/g,'_')+'.js';fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name:node.name,file:f,base_sha:sha(s0),final_sha:sha(s),bytes:[s0.length,s.length]});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes; live '+plan.live);
