// pkgVPD rev 2 (W2; W3 3919: a named round that answers the verse without writing the exact reference was read as holding no answer).
// Rev 2 adds: before a named same-side round is read as holding no answer, the verse is looked for there by other marks (the reference written
//   another way: "1:34", "Luke 1, verse 34", "verse 34", "v. 34"; or a run of 3 words of the verse's KJV text (Cited Verses), not all common words;
//   the item's quoted words are not used: its ANSWER quote is the bare grant itself and matched every grant line). Each line found that way goes through the same bare check; one that is not bare makes the answer substance.
// Rev 1 header follows.
// pkgVPD (W2; coordinator 01:26Z 11-10, from W1's notes in the pkgVP3 rev 3 grade, Wall 3830). RECORD-ONLY: changes only the pkgVP3 TRIAL code check.
// Misses: a bare answer whose deferral names (C) a LINK no round of the side holds, (D) its own round, or (E) a round with nothing on the press, is read
// "not bare" because rev 3 counts any named round with text, and any LINK it cannot find, as an answer.
// Fix (vp3Code2024 in Send Back Record, Alt Send Back Record, R2 Alt Send Back Record):
//  - a deferral to a LINK no round of the side holds defers to nothing: it no longer makes the answer substance;
//  - a deferral to a round of the same side that the check already reads (the item's round and the later rounds) adds nothing: those rounds are
//    already searched for every line naming the verse;
//  - a deferral to another round of the same side is followed once: that round is read for the verse by the same check; it makes the answer
//    substance only when that round answers the verse with substance (a deferral there that names a further round is substance, no second hop);
//  - a deferral to the other side's round is unchanged (substance when that round holds text).
// It can only add "bare" readings; a listing still needs the DeepSeek DISAGREE and a live UNCURED reading (pkgVP3 rev 2 (a)).
//   node pkgVPD/build_VPD.cjs <base> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const [,,FB,OUT]=process.argv;if(!FB||!OUT)die('usage: build_VPD.cjs <base> <out>');
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const VO=String.raw`function vp3Other2024(T,verse,skip){const vm=String(verse).match(/^(.*?)\s*(\d+):(\d+)/);if(!vm)return [];const bk=vm[1].trim(),ch=vm[2],vs=vm[3];
 const esc=x=>x.replace(/[.*+?^$\x7b\x7d()|[\]\\]/g,'\\$&');const RF=[new RegExp('(?<![0-9:])'+ch+'\\s*[:.]\\s*'+vs+'(?![0-9])'),new RegExp(esc(bk)+'\\s+'+ch+'\\s*,\\s*(?:verse|v\\.?)\\s*'+vs+'(?![0-9])','i'),new RegExp('\\b(?:verse|vv?\\.)\\s*'+vs+'(?![0-9])','i')];
 const NW=x=>String(x||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();const ST=new Set('the a an of and to in that is it be this for not i he she his her unto shall was with as by on which have him them they but or at from all said thou thee ye my me we our you your are so no'.split(' '));
 const W3=t=>{const w=NW(t).split(' ').filter(Boolean),o=[];for(let i=0;i+3<=w.length;i++){const g=w.slice(i,i+3);if(g.some(z=>!ST.has(z)))o.push(' '+g.join(' ')+' ');}return o;};
 let G=[];try{const cv=(typeof $==='function'?$('Cited Verses').all():[]).map(i=>i&&i.json).filter(r=>r&&r.book&&String(r.book).toLowerCase()===bk.toLowerCase()&&String(r.chapter)===ch&&String(r.verse)===vs);for(const r of cv)G=G.concat(W3(String(r.text).replace(/\[[^\]]*\]/g,' ')));}catch(e){}
 const out=[];String(T||'').split('\n').forEach((l,k)=>{if(skip&&skip(k,l))return;if(/--\s*MEANS\s*:/i.test(l))return;const n=' '+NW(l)+' ';if(RF.some(r=>r.test(l))||G.some(g=>n.includes(g)))out.push({at:k,text:l});});return out;}
`;
const E=[
 
 ["function vp3Code2024(R,rounds,verse){","function vp3Code2024(R,rounds,verse,dp){"],
 ["if(blk==null)return {ok:false,why:'['+rd+'] the deferral to LINK '+m[1]+' names a block no round of the side holds, so it is not read as bare'};",
  "if(blk==null){x.dv=(x.dv||'')+'; its deferral to LINK '+m[1]+' names a block no round of the side holds (pkgVPD: defers to nothing)';continue;}"],
 ["for(const m of x.text.matchAll(/\\[?\\b([CD]R[1-4])\\b\\]?/g)){if(String(R[m[1]]||'').trim())return {ok:false,why:'['+rd+'] the answer defers to ['+m[1]+'], a round that holds text'};}",
  "for(const m of x.text.matchAll(/\\[?\\b([CD]R[1-4])\\b\\]?/g)){const rr=m[1]; /* pkgVPD (W1 3830): a deferral to a round of the same side is followed */\n"+
  "    if(rr.slice(0,2)===rd.slice(0,2)&&String(R[rr]||'').trim()){const VRx=new RegExp(verse.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&')+'(?![0-9])','i');const om=vp3Other2024(R[rr],verse,(k,l)=>VRx.test(l)||(rr===rd&&k>=x.at&&k<=x.at+((x.text.match(/\\n/g)||[]).length)));\n"+
  "     for(const o of om){const tb=vp3Bare2024(o.text.replace(/^\\s*(?:[-*•>]|\\d+[.)])\\s*/,''));if(!tb.bare)return {ok:false,why:'['+rd+'] the answer defers to ['+rr+'], which answers '+verse+' without its exact reference (line '+o.at+': \\\"'+o.text.trim().slice(0,90)+'\\\"; pkgVPD rev 2)'};}}\n"+
  "    if(rr.slice(0,2)!==rd.slice(0,2)){if(String(R[rr]||'').trim())return {ok:false,why:'['+rd+'] the answer defers to ['+rr+'], a round that holds text'};continue;}\n"+
  "    if(rounds.includes(rr)){x.dv=(x.dv||'')+'; its deferral to ['+rr+']'+(rr===rd?' (its own round)':'')+' names a round already read (pkgVPD)';continue;}\n"+
  "    if(!String(R[rr]||'').trim())continue;if(dp)return {ok:false,why:'['+rd+'] the answer defers to ['+rr+'], a further round (pkgVPD: one hop only)'};\n"+
  "    const c2=vp3Code2024(R,[rr],verse,1);if(c2.ok||/^no answer to /.test(c2.why)){x.dv=(x.dv||'')+'; its deferral to ['+rr+'] finds '+(c2.ok?'only a bare answer':'no answer to '+verse)+' there (pkgVPD)';continue;}\n"+
  "    return {ok:false,why:'['+rd+'] the answer defers to ['+rr+'], which answers '+verse+' ('+c2.why+')'};}"],
 ["found.push({rd,why:t.why});}","found.push({rd,why:t.why+(x.dv||'')});}"]];
const NODES=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'];
for(const nm of NODES){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;
 if(!s.includes('pkgVP3'))die(nm+' lacks pkgVP3');if(s.includes('pkgVPD'))die(nm+' already has pkgVPD');
 const VA='function vp3Code2024(R,rounds,verse){';if(s.split(VA).length!==2)die(nm+': vp3Code anchor');s=s.replace(VA,()=>VO+VA);
 for(const [a,b] of E){if(s.split(a).length!==2)die(nm+': anchor '+(s.split(a).length-1)+' hits: '+a.slice(0,60));s=s.replace(a,()=>b);}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');n.parameters.jsCode=s;}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(OUT+': 418 nodes; changed '+NODES.join(', '));
