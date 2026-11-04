
 // S7 (journal 2044; FINAL_32510_CONSOLIDATED_v3 P7): the DG-18 rule "never quote Psalm 2:7 without its three NT occasions", counted by code over
 // the Debate Oracle seat's own rounds (the only seat the guards bind, ruling 383); a check of the synthesis's guard test, it changes no verdict.
 {const P27=/\bPs(?:a|alm|alms)?\.?\s+2\s*:\s*7(?!\d)/i;const NT=[['Acts 13:33',/\bActs\.?\s+13\s*:\s*33(?!\d)/i],['Hebrews 5:5',/\bHeb(?:rews)?\.?\s+5\s*:\s*5(?!\d)/i],['Hebrews 1:5',/\bHeb(?:rews)?\.?\s+1\s*:\s*5(?!\d)/i]];
  const OR=[];try{if(S.defender&&S.defender.profile==='oracle')OR.push(['defender',[d.cr1,d.cr2,d.cr3,d.cr4]]);if(S.challenger&&S.challenger.profile==='oracle')OR.push(['challenger',[d.gr1,d.gr2,d.dr3,d.dr4]]);}catch(e){}
  for(const [side,rs] of OR){const T=rs.filter(Boolean).join('\n');if(!P27.test(T))continue;const miss=NT.filter(x=>!x[1].test(T)).map(x=>x[0]);
   if(miss.length)SX.push('(S-G) -- guard DG-18: the Debate Oracle seat (the '+side+') quotes Psalm 2:7 in its rounds without its three New Testament occasions; missing: '+miss.join(', ')+'; the synthesis guard test is checked against this count');}}
