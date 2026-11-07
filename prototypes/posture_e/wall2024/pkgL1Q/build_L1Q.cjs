// pkgL1Q (W3 Wall 2861/2864; run 33371: chatgpt removed on 6 false items). Enforcer fix, side-neutral. Quote readers also see SINGLE-quoted quotes.
// (a) ECL PAIR (Send Back Build/Record, Alt Send Back Build/Record): after a verse reference, a single-quoted quote ('...' or ‘...’) of 6+ characters
//     also pairs. The opening mark follows a non-letter; an apostrophe followed by a lower-case letter (Mary's, God's) neither opens nor closes it.
//     A counted [L1] still has to pass kkjvIsVerseQuote and kkjvStands against the KJV row; only the reader changes.
// (b) cureReasoned's final test (19 cure, gate and alternate nodes): besides a double-quoted span of 3+ words or a verse reference, a carrier body is
//     reasoned when it holds a single-quoted span of 3+ words (the form pkgRXR's RESPONSE filter already reads) that stands in a round the body names
//     (cureFound). A single-quoted string that stands in no named round adds nothing.
// Base: live s44 (fetchback_live_s44.json, 24eb8692). Run from wall2024/: node pkgL1Q/build_L1Q.cjs [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const SRC=arg('--base','/mnt/project-files/wall2024/fetchback_live_s44.json');
const W=JSON.parse(fs.readFileSync(SRC,'utf8'));const L=(W.data||W);
const OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const PAIR0=`const PAIR=new RegExp(REF.source+'[^"“”\\\\n\\\\[]{0,40}?["“]([^"“”]{6,400})["”]','g');`;
const PAIR1=`const PAIR=new RegExp(REF.source+'[^"“”\\\\n\\\\[]{0,40}?(?:["“]([^"“”]{6,400})["”]|(?<![A-Za-z])[\\'‘]((?:[^\\'‘’\\\\n]|[\\'’](?=[a-z])){6,400}?)[\\'’](?![a-z]))','g'); /* pkgL1Q (W3 2861/2864): a single-quoted verse quote also pairs; an in-word apostrophe neither opens nor closes it */`;
const Q0="const bk=p[1],ch=+p[2],v1=+p[3],v2=+(p[4]||p[3]),q=p[5];";
const Q1="const bk=p[1],ch=+p[2],v1=+p[3],v2=+(p[4]||p[3]),q=p[5]||p[6]; /* pkgL1Q */";
const T0="(/[\"“][^\"”]*\\S\\s+\\S+\\s+\\S[^\"”]*[\"”]/.test(c.body)||cureRefs(c.body).length>0)";
const T1="(/[\"“][^\"”]*\\S\\s+\\S+\\s+\\S[^\"”]*[\"”]/.test(c.body)||cureRefs(c.body).length>0||__l1qSq(c.body,__R))";
const LIB=`/* pkgL1Q (W3 2864, run 33371 row 14362): a single-quoted span of 3+ words, in the form pkgRXR's RESPONSE filter reads, counts as the carrier's reason
   only when it stands in a round the body names (cureFound). Bodies reach here folded (curly marks are straight). */
function __l1qSq(b,R){if(!R)return false;b=String(b||'');const rs=[...b.matchAll(/\\b([CD]R[1-4])\\b/gi)].map(m=>R[m[1].toUpperCase()]).filter(t=>typeof t==='string');if(!rs.length)return false;
 return [...b.matchAll(/(?:^|[\\s(\\[{:;,])'([^\\n]{8,}?)'(?=$|[\\s.,;:!?)\\]}"])/g)].some(m=>/\\S\\s+\\S+\\s+\\S/.test(m[1])&&rs.some(t=>cureFound(m[1],t)));}
function cureReasoned(`;
const A=[[PAIR0,PAIR1],[Q0,Q1]],B=[["function cureReasoned(",LIB],[T0,T1]];
const NA=['Send Back Build','Send Back Record','Alt Send Back Build','Alt Send Back Record'];
const NB=['Cure Build','Cure Normalize','Cure Check','Panel Cure Build 1','Panel Cure Normalize 1','Panel Cure Build 2','Panel Cure Normalize 2','Panel Cure Build 3','Panel Cure Normalize 3','Panel Cure Check','Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge Seat','Alternate Merge','Gate Build','Gate Record','Alt Gate Build','Alt Gate Record'];
const rep=(s,a,b,nm)=>{const c=s.split(a).length-1;if(c!==1)throw new Error(nm+' anchor x'+c+': '+a.slice(0,60));return s.replace(a,()=>b);};
const plan={source:'W2 pkgL1Q, W3 2861/2864 (33371 chatgpt single-quote removals)',live:L.versionId,base:SRC,nodes:[]};
for(const [name,E] of [...NA.map(n=>[n,A]),...NB.map(n=>[n,B])]){const node=L.nodes.find(z=>z.name===name);if(!node)throw new Error('no node '+name);
 const s0=node.parameters.jsCode;let s=s0;for(const [a,b] of E)s=rep(s,a,b,name);
 new Function('$','$input','$json','$execution','$workflow','$node','$items',s);const f=name.replace(/ /g,'_')+'.js';fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name,file:f,base_sha:sha(s0),final_sha:sha(s),bytes:[s0.length,s.length]});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes; live '+plan.live);
