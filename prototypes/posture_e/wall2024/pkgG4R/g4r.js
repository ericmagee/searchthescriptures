/* pkgG4R (W2, 11-08; W3 3106 stacked engine item; W2 3107 item 2). (a) K-G4 witness: when the judge's quotation stands in a PRESSED WITH row
   ("<verse> ... -- MEANS: ..."), the pressed witness is that row's own verse, not an [L3] ground of the line. (b) The gate K-G4 item shows the
   engine's unanswered-false reading up front, so the judge sees that only a FORCED line cures a break whose witness a later round named. */
function kg4RowHead2024(q,P){const out=[];if(!q||typeof P!=='string')return out;
 for(const row of P.split('\n')){const m=row.search(/\s--\s*MEANS\s*:/i);if(m<0||!cureFound(q,row.slice(m)))continue;for(const r of cureRefs(row.slice(0,m)))if(!out.includes(r.key))out.push(r.key);if(out.length)break;}
 return out;}
function g4GateNote2024(x,ctx){try{const R=(ctx&&ctx.R)||{};const side=String(x.key||'').split('|')[2]||'';const link=String(x.key||'').split('|')[3]||'';const line=String((x.lines&&x.lines[0])||'');
 if(!CURE_PRESS[side]||!g4Unans2024(line))return '';const hits=[];
 for(const seg of line.split(/(?=\[(?:CR|DR)[1-4]\])/)){const rm=seg.match(/^\[((?:CR|DR)[1-4])\]/);if(!rm||!CURE_PRESS[side].includes(rm[1])||typeof R[rm[1]]!=='string')continue;
  for(const m of seg.matchAll(/["“]([^"”]{8,})["”]/g))if(cureFoundAll(m[1],R[rm[1]]))hits.push({round:rm[1],q:m[1],line:seg.trim()});}
 if(!hits.length)return '';const ks=kg4Split(side,line,hits,R);if(!ks.rests.length||ks.open.length)return '';
 const rds=[...new Set(hits.map(p=>'['+p.round+']'))].join(', ');
 return ' THE ENGINE READS THIS LINE: "unanswered" is false. The pressing quotation stands in '+rds+', and a later '+side.toLowerCase()+' round names every pressed witness the line rests on: '+kg4Txt(ks.answered)+'. So the break rests on meaning (ruling 421): a KEEP, or a CHANGE TO that still says the witness was left unanswered, stays uncured. Cure it with one FORCED line: FORCED: '+(link?link.replace(/ VS /,' vs '):'D<i> vs C<j>')+' -- MEANS [<round>]: "<the MEANS sentence>" -- ANSWER [<round>]: "<the holding side\'s answer>" -- FAILS: "<why that answer cannot take the meaning>", or with a CHANGE TO that no longer breaks the link.';}catch(e){return '';}}
