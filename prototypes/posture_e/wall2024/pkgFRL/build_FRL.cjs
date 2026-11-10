// pkgFRL rev 1 (W1; coordinator 03:16Z 11-10; W4 Wall 3975): six plain refusals W4 found read CURED by live and by pkgFUN rev 6. Stacks on pkgFUN rev 7.
// Adds to the K-S3 COUNTED reader's closed lists (rev 7 rule unchanged: a listed sentence is enforced only as the whole answer):
//   P: "Nope." / "I decline." / "Scratch that|this." / "I take it|that|this back." / "Disregard this|that (line)."
//   B: "My answer stays|stands|remains as before|as it was|unchanged."
//   node pkgFRL/build_FRL.cjs   -> pkgLIB/strip_FRL from pkgLIB/strip_FUN7
const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'..');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const PA=String.raw`const P=[/^(?:that|this|it)\s+(?:is|would\s+be|seems)\s+(?:not\s+(?:right`,PB=String.raw`const P=[/^nope$/i,/^I\s+decline$/i,/^scratch\s+(?:that|this)$/i,/^I\s+take\s+(?:it|that|this)\s+back$/i,/^disregard\s+(?:this|that)(?:\s+line)?$/i,/^(?:that|this|it)\s+(?:is|would\s+be|seems)\s+(?:not\s+(?:right`;
const BA=String.raw`const B=[/^(?:the\s+count|that\s+count`,BB=String.raw`const B=[/^my\s+answer\s+(?:stays|stands|remains)\s+(?:as\s+(?:before|it\s+was)|unchanged)$/i,/^(?:the\s+count|that\s+count`;
const A=W+'/pkgLIB/strip_FUN7',B=W+'/pkgLIB/strip_FRL';if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});let n=0;
for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){let s=fs.readFileSync(A+'/patched/'+f,'utf8');
 if(s.includes("if(x.rule==='K-S3'){const rp=respOf(x)")){if(!s.includes('/* pkgFUN rev 7'))die(f+' lacks pkgFUN rev 7');for(const [a,b] of [[PA,PB],[BA,BB]]){const k=s.split(a).length-1;if(k!==1)die(f+': '+k+' hits for '+a.slice(0,40));s=s.replace(a,()=>b);}
  {const k=s.split('/* pkgFUN rev 7').length-1;if(k!==1)die(f+': '+k+' rev 7 markers');s=s.replace('/* pkgFUN rev 7','/* pkgFRL (W4 3975): six plain refusals added to the lists *//* pkgFUN rev 7');}n++;}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync(B+'/patched/'+f,s);}
console.log('strip_FRL: '+n+' files changed');
