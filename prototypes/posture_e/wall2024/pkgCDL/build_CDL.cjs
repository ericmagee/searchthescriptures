// pkgCDL rev 2 (W1; W2 FAIL of rev 1, coordinator 05:24Z): the LINK word has no length limit (any text reads as ? and is marked); a second CONFIRMED
//   line on one candidate (not NEW) naming another link is refused, NOT CONFIRMED (second link), RECORD-ONLY FOR REVIEW; the first keeps its break.
// pkgCDL rev 1 (W1; W2's note on pkgCDF rev 2, coordinator 05:20Z). Record-only follow-on to pkgCDF rev 2; Close Enforcer Record only.
// The enforcer's own LINK word is read, never a guess from the round text (unlike pkgCDF rev 1 change 2):
//  - "LINK D<n>" on a DEFENDER line and "LINK C<n>" on a CHALLENGER line are read as LINK n; the note says so;
//  - any other non-number form ("LINK N/A", "LINK C6" on a DEFENDER line, "LINK 6 (D6)") is read as LINK ? with a note quoting it, so the line
//    is read by its id instead of being UNREADABLE and leaving the candidate NO ANSWER; a CONFIRMED with both quotations standing then carries
//    pkgCDF's RECORD-ONLY FOR REVIEW note and breaks nothing.
//   node pkgCDL/build_CDL.cjs <pkgCDF rev 2 write file> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const [,,IN,OUT]=process.argv;if(!IN||!OUT)die('usage: build_CDL.cjs <pkgCDF write file> <out>');
const d=JSON.parse(fs.readFileSync(IN,'utf8'));if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const E={'Close Enforcer Record':[
  [String.raw`--\s*LINK\s*(\d+|\?|[A-Za-z][A-Za-z ]{0,20}?)\s*--`,String.raw`--\s*LINK\s*([^\n]+?)\s*--`],
  ["const rows=[],errors=[];",
   "/* pkgCDL: the enforcer's own LINK word: a number; D<n> on a defender line or C<n> on a challenger line as n; anything else ? */\nconst cdlLink=(raw,side)=>{const t=String(raw||'').replace(/[*_`]/g,'').trim();if(/^\\d+$/.test(t))return +t;const k=t.match(/^([DC])\\s*-?\\s*(\\d+)$/i);if(k&&k[1].toUpperCase()===(side==='DEFENDER'?'D':'C'))return +k[2];return '?';};\nconst rows=[],errors=[];"],
  ["link:(/^\\d+$/.test(m[3])?+m[3]:'?')","link:cdlLink(m[3],side),link_raw:String(m[3]).trim()"],
  ["const seen=new Set();const confirmed=[];for(const x of rows){if(x.status!=='CONFIRMED')continue;",
   "const seen=new Set();const confirmed=[];const cdlId=new Map();for(const x of rows){if(x.status!=='CONFIRMED')continue;\n /* pkgCDL rev 2 (W2): one candidate breaks one link; a second CONFIRMED line on the same candidate naming another link is refused and marked */\n if(!/^NEW/.test(x.id)&&cdlId.has(x.id)&&cdlId.get(x.id)!==x.link){x.status='NOT CONFIRMED (second link)';x.note=(x.note?x.note+'; ':'')+'candidate '+x.id+' is already confirmed on LINK '+cdlId.get(x.id)+'; one candidate breaks one link; RECORD-ONLY FOR REVIEW (pkgCDL)';continue;}\n if(!/^NEW/.test(x.id)&&!cdlId.has(x.id))cdlId.set(x.id,x.link);"],
  [" else row.status='NOT A CONTRADICTION';\n rows.push(row);}",
   " else row.status='NOT A CONTRADICTION';\n {const t=row.link_raw.replace(/[*_`]/g,'').trim();if(t!=='?'&&!/^\\d+$/.test(t)){const ln=row.link==='?'?'the enforcer wrote LINK '+t+', not a link number'+(/^[DC]\\s*-?\\s*\\d+$/i.test(t)?' (the side letter does not match the '+side.toLowerCase()+')':'')+', read as LINK ?':'the enforcer wrote LINK '+t+', read as LINK '+row.link;row.note=(row.note?row.note+'; ':'')+ln+' (pkgCDL)';}}\n rows.push(row);}"]]};
for(const [nm,L] of Object.entries(E)){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;if(s.includes('pkgCDL'))die(nm+' already has pkgCDL');if(!s.includes('pkgCDF'))die(nm+' lacks pkgCDF');
 for(const [a,b] of L){const k=s.split(a).length-1;if(k!==1)die(nm+': '+k+' hits for '+a.slice(0,80));const i=s.indexOf(a);s=s.slice(0,i)+b+s.slice(i+a.length);}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');n.parameters.jsCode=s;}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(OUT+': 418 nodes; changed '+Object.keys(E).join(', '));
