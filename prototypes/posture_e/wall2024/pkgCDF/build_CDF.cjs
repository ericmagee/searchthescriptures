// pkgCDF rev 2 (W1; W2 FAIL of rev 1, Wall: the link read from D/C marks was wrong and Record broke that link; that change is removed, the hint's
//   link stays as in pkgCDR (LINK n before it, else ?).
// pkgCDF rev 1 (W1; follow-on to pkgCDR rev 11, coordinator 05:10Z; W2 and W3 notes on rev 11). Record-only and hint-only: no ruling changes.
// (1) Close Enforcer Build, hints: the cap of 30 per side fills from the latest earlier round first (round 3, then 2, then 1), so padding in round 1
//     cannot take hints away from round 3 (W3). (Rev 1 also read a hint's link from D/C marks; removed in rev 2.)
// (2) Close Enforcer Record: an answer with any word after LINK ("LINK unknown", "LINK none") is read as LINK ? instead of being unreadable and
//     leaving the hint NO ANSWER (W3). A CONFIRMED answer refused only because its link is ? (both quotations found word for word) stays
//     NOT CONFIRMED (form) and breaks nothing, and its note says so, record-only, for review (W2).
//   node pkgCDF/build_CDF.cjs <pkgCDR rev 11 write file> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const [,,IN,OUT]=process.argv;if(!IN||!OUT)die('usage: build_CDF.cjs <pkgCDR write file> <out>');
const d=JSON.parse(fs.readFileSync(IN,'utf8'));if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const E={'Close Enforcer Build':[
  ["for(const [er,ek] of early)for(const ds of cdrSentsRaw(F[ek])){","for(const [er,ek] of [...early].reverse())for(const ds of cdrSentsRaw(F[ek])){ /* pkgCDF: the cap fills from the latest round */"]],
 'Close Enforcer Record':[
  [String.raw`--\s*LINK\s*(\d+|\?)\s*--`,String.raw`--\s*LINK\s*(\d+|\?|[A-Za-z][A-Za-z ]{0,20}?)\s*--`],
  ["link:(m[3]==='?'?'?':+m[3])","link:(/^\\d+$/.test(m[3])?+m[3]:'?')"],
  ["row.status=f.length?'NOT CONFIRMED (form)':'CONFIRMED';if(f.length)row.note=f.join('; ');",
   "row.status=f.length?'NOT CONFIRMED (form)':'CONFIRMED';if(f.length)row.note=f.join('; ');if(f.length===1&&row.link==='?')row.note+='; RECORD-ONLY FOR REVIEW: both quotations stand word for word; the enforcer confirmed a contradiction it could not tie to a link, so nothing is broken (pkgCDF)';"]]};
for(const [nm,L] of Object.entries(E)){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;if(s.includes('pkgCDF'))die(nm+' already has pkgCDF');if(!s.includes('pkgCDR'))die(nm+' lacks pkgCDR');
 for(const [a,b] of L){const k=s.split(a).length-1;if(k!==1)die(nm+': '+k+' hits for '+a.slice(0,80));const i=s.indexOf(a);s=s.slice(0,i)+b+s.slice(i+a.length);}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');n.parameters.jsCode=s;}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(OUT+': 418 nodes; changed '+Object.keys(E).join(', '));
