// W2 plants for pkgKCQ rev 2 (labels before the run). Adds W3's 4403 lines and the rev 2 limit forms.
const lib=require('./kc_lib.cjs');const A=lib('/mnt/project-files/wall2024/fetchback_live_s113.json'),B=lib(process.argv[2]);
const P=[
['K1 sol 34726 stored form','NO RAISE','CHALLENGER CONCEDED LINKS: 0 -- Premise 4 is VOID (Commitment 6): the charge adds "only" to the [DR2] sentence. That quotation limits its observation to those rows and does not assert the added exclusion.'],
['K2 "its quote ... does not assert that" (stored 5a92e92d)','NO RAISE','CHALLENGE STANDING: PROP-DEPENDENT -- defender premise 1 is VOID: its quote \'the positive rows name the father in four registers\' does not assert that the speeches establish Joseph as the begetter.'],
['K3 plural "those quotations ... do not assert the added"','NO RAISE','CHALLENGER CONCEDED LINKS: 0 -- Premises 4 and 5 are VOID (Commitment 6): those quotations limit their observation to those rows and do not assert the added exclusion.'],
['T1 true K-C plain','RAISE','D4 vs C2 (Luke 2:48): UNDERDETERMINED -- the rows state an address and a household word but in their own words state no begetting, and none of them names the father as begetter.'],
['T2 true K-C, "quotation" before "does not state"','RAISE','D4 vs C2 (Luke 2:48): UNDERDETERMINED -- the challenger\'s quotation of the rows does not state the begetting in their own words, and no verse states it.'],
['T2b W3 4403 form 1','RAISE','CHALLENGER CONCEDED LINKS: 0 -- each quotation in the challenger\'s rows names a house and none of the verses states the begetting in its own words.'],
['T2c W3 4403 form 2','RAISE','CHALLENGER CONCEDED LINKS: 0 -- the rows of quotation the challenger gathers are set aside because none of the verses states the begetting in its own words.'],
['T6 true K-C, "the quotation of <verse> does not assert the begetting"','RAISE','D4 vs C2 (Luke 2:48): UNDERDETERMINED -- the quotation of Luke 2:48 does not assert the begetting, and the rows are set aside.'],
['L1 rev 2 limit: verse quotation, "does not assert the added begetting", one clause','EITHER','D4 vs C2 (Luke 2:48): UNDERDETERMINED -- the quotation of Luke 2:48 and those rows does not assert the added begetting.'],
['L2 rev 2 limit with a second clause that sets the rows aside','RAISE','D4 vs C2 (Luke 2:48): UNDERDETERMINED -- that quotation does not assert the added begetting; no verse states it in its own words.'],
];
for(const [lab,exp,t] of P){const a=A.netLines(t,null,null).length>0,b=B.netLines(t,null,null).length>0;const got=b?'RAISE':'NO RAISE';console.log(((exp==='EITHER'||got===exp)?'OK  ':'MISS')+' '+lab+' | expected '+exp+' | live '+(a?'RAISE':'NO RAISE')+' cand '+got);}
