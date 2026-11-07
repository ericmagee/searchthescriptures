const C=require('./clr.cjs');const t=[
['CONCEDED LINKS: 1\nPremise 5: UNEXHIBITED (narrowed link keeps words)\nCHALLENGE STANDING: X','PREMISE 5'],
['CONCEDED LINKS: 2 -- Premise 2 (LINK 6, "If the flesh comes only through the woman") UNEXHIBITED; premise 4 CONCEDED (stated).','PREMISE 2(L6); PREMISE 4'],
['CONCEDED LINKS: 3 -- Premises 2, 4 and 5 are UNEXHIBITED (unanswered witnesses). Against premise 2, [DR1] presses Matthew 1:18.','PREMISE 2; PREMISE 4; PREMISE 5'],
['CONCEDED LINKS: 1 -- counted premise 6 as CONCEDED (stated); premises 1-5 are SUPPORTED and spared.','PREMISE 6'],
['CHALLENGER CONCEDED LINKS: 2 -- C1 UNEXHIBITED (Matthew 1:25 left unanswered in [DR3]); C2 UNEXHIBITED (Luke 2:49 left unanswered)','C 1; C 2'],
['CONCEDED LINKS: 2 -- counted: 2 UNEXHIBITED (rival begetter); 4 UNEXHIBITED (came together).','PREMISE 2; PREMISE 4'],
['CONCEDED LINKS: 3 -- CONCEDED (stated): DR2 item 1 (defender CR3 drops x), DR2 item 2 (drops y), DR2 item 4 (z).','PREMISE 1; PREMISE 2; PREMISE 4'],
['CHALLENGER CONCEDED LINKS: 3 -- (1) UNEXHIBITED: "Joseph knew Mary", because x; (2) UNEXHIBITED: y; (4) CONCEDED (stated): z.','PREMISE 1; PREMISE 2; PREMISE 4'],
['CONCEDED LINKS: 0 -- Premises 1, 2, 3, 4, 5, and 6 are spared: each exhibits layers.',''],
['CHALLENGER CONCEDED LINKS: 0 -- Premise 2 is NOT VOID and is spared: x. Premise 6 is VOID (Commitment 6): y.',''],
['CONCEDED LINKS: 1 -- Premise 6 is UNEXHIBITED (no footing offered to prove Mary s house by direct row).','PREMISE 6'],
['CONCEDED LINKS: 2 -- Premise 4, UNEXHIBITED: the proven Ezra 2:62 press was not met. Premise 5, UNEXHIBITED: x. Premises 1, 2, 3 and 6 are spared.','PREMISE 4; PREMISE 5'],
['CONCEDED LINKS: 2 -- LINK 1: UNEXHIBITED (kept words); LINK 6: UNEXHIBITED (no row).','LINK 1; LINK 6'],
['CONCEDED LINKS: 1 -- Premise 3 is tagged CONCEDED (stated) because the defender conceded in [CR3] that Deuteronomy 25:6 x','PREMISE 3']];
let ok=0;for(const [s,want] of t){const side=/^CHALLENGER/.test(s)?'CHALLENGER':'DEFENDER';const r=C.read(s,side);const got=r.counted.map(x=>x.ref+' '+x.num+(x.link!=null?'(L'+x.link+')':'')).join('; ');const g=got===want;ok+=g;console.log((g?'OK  ':'FAIL'),r.count,'named',r.named,'|',got,g?'':'  WANT '+want);}console.log(ok+'/'+t.length);
