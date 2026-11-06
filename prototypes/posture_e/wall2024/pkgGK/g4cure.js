// pkgGK (W3 2302 (a); run 32998 chatgpt G5, sol G1): a K-G4 item that the gate's re-read raises on a changed LINK BROKEN line is decided by the
// panel cure check's own K-G4 test, read from the gate change itself: ruling 421 (a meaning break is cured only by a FORCED line), ruling 392 (a
// quoted pressing sentence found in a round that presses the side), and judge_fix7 J1 (unanswered-false when a later round of the side names
// every pressed witness the line rests on). Before, a BROKEN line always re-raised K-G4, so no CHANGE TO could cure it.
function gateG4Cure2024(x,z,to,ctx){const R=(ctx&&ctx.R)||{};const side=String(x.key||'').split('|')[2]||'';const line=String((z&&z.lines&&z.lines[0])||(x.lines&&x.lines[0])||'');
 if(!CURE_PRESS[side])return {cured:false,why:'the corrected text still raises it'};
 if(!g4Unans2024(line))return {cured:false,why:'the corrected text still raises it: its GROUND names no pressed witness left unanswered, so the break rests on meaning, and only a FORCED line cures it (ruling 421)'};
 const T=String(to||'').replace(/\\+"/g,'"');const hits=[];
 for(const seg of T.split(/(?=\[(?:CR|DR)[1-4]\])/)){const rm=seg.match(/^\[((?:CR|DR)[1-4])\]/);if(!rm||!CURE_PRESS[side].includes(rm[1])||typeof R[rm[1]]!=='string')continue;
  for(const m of seg.matchAll(/["\u201c]([^"\u201d]{8,})["\u201d]/g))if(cureFoundAll(m[1],R[rm[1]]))hits.push({round:rm[1],q:m[1],line:seg.trim()});}
 if(!hits.length)return {cured:false,why:'the corrected text still raises it, and the change quotes no pressing sentence found in a round that presses the '+side.toLowerCase()+' (ruling 392)'};
 const rds=[...new Set(hits.map(p=>p.round))].join(', ');const ks=kg4Split(side,line,hits,R);
 if(ks.rests.length&&!ks.open.length)return {cured:false,why:'unanswered-false: the pressing quotation is found in '+rds+', but a later '+side.toLowerCase()+' round names every pressed witness the line rests on: '+kg4Txt(ks.answered)};
 return {cured:true,why:kg4Why(ks,side,'pressed: quotation found in '+rds)};}
