// W2 plants for pkgKCQ (labels written before the run). EXPECT = what a right detector does; we print live and candidate.
const lib=require('./kc_lib.cjs');const A=lib('/mnt/project-files/wall2024/fetchback_live_s113.json'),B=lib(process.argv[2]);
const P=[
['K1 sol 34726 form (Commitment 6 VOID, "quotation ... does not assert")','NO RAISE','CHALLENGER CONCEDED LINKS: 0 -- Premise 4 is VOID (Commitment 6): the charge adds "only" to the [DR2] sentence. That quotation limits its observation to those rows and does not assert the added exclusion.'],
['K2 same with "quote" (stored form 5a92e92d CHALLENGE STANDING)','NO RAISE','CHALLENGE STANDING: PROP-DEPENDENT -- defender premise 1 is VOID: its quote \'the positive rows name the father in four registers\' does not assert that the speeches establish Joseph as the begetter.'],
['K3 same with "quotations" plural','NO RAISE','CHALLENGER CONCEDED LINKS: 0 -- Premises 4 and 5 are VOID (Commitment 6): those quotations limit their observation to those rows and do not assert the added exclusion.'],
['K4 same with "quoted sentence"','NO RAISE','CHALLENGER CONCEDED LINKS: 0 -- Premise 4 is VOID (Commitment 6): the quoted sentence limits its observation to those rows and does not assert the added exclusion.'],
['T1 true K-C, plain (stored shape)','RAISE','D4 vs C2 (Luke 2:48): UNDERDETERMINED -- the rows state an address and a household word but in their own words state no begetting, and none of them names the father as begetter.'],
['T2 true K-C, "quotation" named before the hit in the same clause','RAISE','D4 vs C2 (Luke 2:48): UNDERDETERMINED -- the challenger\'s quotation of the rows does not state the begetting in their own words, and no verse states it.'],
['T3 true K-C, "quotation" after the hit','RAISE','D4 vs C2 (Luke 2:48): UNDERDETERMINED -- no verse states the begetting in its own words, whatever the challenger\'s quotation of the rows claims.'],
['T4 true K-C, "quotation" in an earlier clause','RAISE','D4 vs C2 (Luke 2:48): UNDERDETERMINED -- the challenger\'s quotation is exact; the rows do not state the begetting, and none of them names a begetter.'],
['T5 true K-C on the keystone, "quotation" before the hit','RAISE','KEYSTONE: D6 -- UNDERDETERMINED -- the defender\'s quotation of Matthew 1:16 and those rows does not state the conclusion; no verse names the absence of a father.'],
];
for(const [lab,exp,t] of P){const a=A.netLines(t,null,null).length>0,b=B.netLines(t,null,null).length>0;const got=b?'RAISE':'NO RAISE';console.log((got===exp?'OK  ':'MISS')+' '+lab+' | expected '+exp+' | live '+(a?'RAISE':'NO RAISE')+' cand '+got);}
