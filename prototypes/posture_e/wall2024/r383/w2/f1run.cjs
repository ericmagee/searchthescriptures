const {mk}=require('./f1t.cjs');
const F=[{side:'DEFENDER',n:1,link:5,k:1,fact:'Mary is of the house of David',both_not_stated:true},{side:'DEFENDER',n:'3',link:2,k:1,fact:'x y',both_not_stated:true},{side:'DEFENDER',n:4,fact:'z',both_not_stated:false}];
const o=mk(F),o0=mk([]);
const OLDC="CONCEDED LINKS: 2 -- Premise 1, LINK 5: UNEXHIBITED (assumed given fact). STEP: a -- ASSUMES: b. Premise 2, LINK 5: UNEXHIBITED (assumed given fact). STEP: c.";
const C=[
['W4 S2 count to 0',"CONCEDED LINKS: 0 -- Premises 1 through 6 are spared.",OLDC,1],
['W4 G3 SUPPORTED',"RULING -- defender premise 1 -- SUPPORTED",'RULING -- defender premise 1 -- UNEXHIBITED',1],
['W4 drop 1 keep 2',"CONCEDED LINKS: 1 -- Premise 2, LINK 5: UNEXHIBITED (assumed given fact).",OLDC,1],
['W4 G4 premise 2',"RULING -- defender premise 2 -- SUPPORTED",'RULING -- defender premise 2 -- UNEXHIBITED',0],
['W4 drop 2 keep 1',"CONCEDED LINKS: 1 -- Premise 1, LINK 5: UNEXHIBITED (assumed given fact).",OLDC,0],
['W4 raise to counted',"RULING -- defender premise 1 -- UNEXHIBITED",'RULING -- defender premise 1 -- SUPPORTED',0],
['W4 challenger',"CHALLENGER CONCEDED LINKS: 0 -- none.","CHALLENGER CONCEDED LINKS: 1 -- Premise 1: VOID (adds 'only').",0],
['W4 collision',"D5 vs C1 (Luke 1:27): STANDS -- x","D5 vs C1 (Luke 1:27): DEFENDER LINK BROKEN -- y",0],
['W2 bold markdown',"**RULING** -- DEFENDER premise 1 -- **SPARED**","RULING -- DEFENDER premise 1 -- COUNTED",1],
['W2 em dash, mixed case',"- RULING — Defender premise 1 — SPARED (restated)","RULING: DEFENDER premise 1: VOID",1],
['W2 UNEXHIBITED to VOID',"RULING -- DEFENDER premise 1 -- VOID","RULING -- DEFENDER premise 1 -- UNEXHIBITED",0],
['W2 fact n as string',"RULING -- DEFENDER premise 3 -- SUPPORTED","RULING -- DEFENDER premise 3 -- COUNTED",1],
['W2 fact not BNS',"RULING -- DEFENDER premise 4 -- SUPPORTED","RULING -- DEFENDER premise 4 -- COUNTED",0],
['W2 same count, reworded',"CONCEDED LINKS: 2 -- Premise 1, LINK 5: UNEXHIBITED (no verse). Premise 2, LINK 5: UNEXHIBITED (no verse).",OLDC,0],
['W2 premise 1 to VOID in count',"CONCEDED LINKS: 2 -- Premise 1, LINK 5: VOID (adds). Premise 2, LINK 5: UNEXHIBITED.",OLDC,0],
['W2 different premise numbers',"RULING -- DEFENDER premise 2 -- SUPPORTED","RULING -- DEFENDER premise 1 -- UNEXHIBITED",0],
['W2 side switch',"RULING -- CHALLENGER premise 1 -- SUPPORTED","RULING -- DEFENDER premise 1 -- UNEXHIBITED",0],
['W2 escaped quotes/backslash',"RULING -- defender premise 1 -- SPARED \\\"x\\\"","RULING -- defender premise 1 -- UNEXHIBITED",1],
];let bad=0;for(const [nm,to,ol,want] of C){const r=o.nsg(to,ol),r0=o0.nsg(to,ol);const ok=(!!r)===!!want&&!r0;if(!ok)bad++;console.log(ok?'ok ':'BAD',nm,'|',r?r.slice(0,90):'null');}
console.log(process.env.NODE||'Gate Build','bad',bad,'of',C.length);
