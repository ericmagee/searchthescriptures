# ASK 561: DR1 is not checked by LAY (W1, PLAN draft 1a)

Draft 1a folds W3's note on the PASS (Wall 10995) and W4's C1B Extract anchors (Wall 10992); no code text changed.

DRAFT ONLY. Nothing is written. Grading by W3, anchor check by W4, then the operator's approval of exact text. Nothing goes to the operator until the open ASK 557/558 card is answered.
Basis: rulings 397 to 400 (PROVEN STRUCTURE, binding on both sides); W1 Wall 10988 (found at the ASK 559/560 read); coordinator 17:07 CST 11-23.
Read: fetch-back of engine 5bc57e2a: C1B Build, C2B Build, C1B Extract, C2B Extract in full at the lines quoted; LAY rebuilt from the Shared Library (11,691 characters).
Scope: DR1 gets the LAY check the later challenger rounds get (C2B to C4B), and nothing else. PIN (pkgPIN) is not added: it is not in this issue. No prompt, model setting, corpus or ruling text changes.

## What the record shows
1. C1B Build runs BAR only: `let c;try{c=BAR.check('DR1',X.raw,__RD(X.raw));}...`. It holds no LAY loader and no `lay_check`.
2. C2B, C3B, C4B Build load LAY from the Shared Library, run `try{__lc=LAY.check(X.raw);}catch(e){__lc=null;}`, count `__ln`, resend when there are layer points, and put `LAY.note(__lc,true)` into the one note.
3. C1B Extract records no layers. C2B Extract records `layers:{first:...}` in its keep path and `layers:{first,after,bare_written}` after a re-call, with `LAY_BARE=false` (no bare mark is written today).
4. Offline, live LAY on DR1 of run 41822: 4 STRUCTURE items, the challenger's summary lines "**D1.** The seed and loins named are David's ...", "**D2.** The \"father\" rows are Mary's word ...", "**D3.** The stated means in Luke 1:35 is the Holy Ghost ...", "**D4.** Romans 1:3 gives the line ...". BAR on DR1: 0 hits. So in run 41822 this change would have sent DR1 back once, for those four lines.

## Change 1. C1B Build runs LAY as C2B Build does
(a) After the BAR block and before `const __RD=`, insert the LAY loader line exactly as it stands in C2B Build: `const LAY=(T=>{const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/'))).LAY;if(!M)throw new Error('pkgLAYB: the Shared Library holds no LAY entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(S.length!==M.n)throw new Error('pkgLAYB: rebuilt LAY is '+S.length+', expected '+M.n);return new Function('$',S+'\nreturn LAY;')($);})($('Shared Library').params.jsCode);`
(b) The tail, from `const X=$('C1 Extract')` to the end, takes C2B Build's form without PIN:
- `let __lc=null;const pass=(why,c)=>[{json:{run_token:X.run_token,round:'C1B',resend:false,why,bar_check:c||null,lay_check:__lc}}];`
- after the BAR check: `try{__lc=LAY.check(X.raw);}catch(e){__lc=null;}const __ln=__lc&&__lc.items?__lc.items.length:0;`
- the pass test: `if(c.pass&&!__ln)return pass(...same two reasons...,c);`
- the note: `const note=[__ln?LAY.note(__lc,true):null,c.pass?null:BAR.note(c)].filter(Boolean).join('\n\n')+(c.pass?'\nReturn the whole round; this is the only request of its kind.':'');`
- the resend item: `why:[c.hits.length?c.hits.length+' barred sentence(s)':null,__ln?__ln+' layer point(s)':null].filter(Boolean).join('; ')`, and `lay_check:__lc` added beside `bar_check:c`.
Anchors for W4: `const X=$('C1 Extract').first().json;const C=$('C1 Build').first().json;let B=C.call,__base='C1 Build';` and `const pass=(why,c)=>[{json:{run_token:X.run_token,round:'C1B',resend:false,why,bar_check:c||null}}];` (one each, C1B Build).
Still one send-back: the resend counts all points in one note, as in C2B.

## Change 2. C1B Extract records the layers as C2B Extract does
(a) Insert the same LAY loader line and `const LAY_BARE=false;` where C2B Extract has them (before `const __RD=`).
(b) `__keep` gains `layers:{first:(__G&&__G.lay_check)||null}` as in C2B Extract.
(c) After a re-call: `const __L2=(()=>{try{return LAY.check(__S.raw);}catch(e){return null;}})();const __BC=LAY_BARE&&__L2&&__L2.items&&__L2.items.length?LAY.bare(__L2.items):'';`, and the returned item takes `raw:__S.raw+__BC`, `labelled:...__SL.raw+__BC...`, and `layers:{first:(__G&&__G.lay_check)||null,after:__L2,bare_written:!!__BC}` in `bar`, as in C2B Extract.
The keep rule (`const __k2=...`) is the same text in C1B and C2B Extract and is not changed.
C1B Extract's anchors are quoted by W4 at Wall 10992 (its `const __keep=` line and its final return line, one each). It has no LAY loader and no LAY_BARE today, so (a) to (c) are all needed.

## Revert
Restore C1B Build and C1B Extract from the pre-write export; compare md5 per node. The Shared Library is read, not changed, so no sha header changes.

## Test
1. Offline on run 41822 DR1 with the new C1B Build: lay_check at least 4 STRUCTURE items (the offline count ran with no Verse Sheet rows; a verse not on the sheet gets credit with no quote test, W4 10990), resend true, why "<n> layer point(s)", note opens with LAY's note. Control: a DR1 with no layer points and no barred sentence passes with resend false, as today.
2. Offline C1B Extract with resend false: the kept item carries `bar.layers.first` equal to the C1B Build lay_check; everything else identical to today.
3. Every other node: pre-write md5 unchanged.
4. Live run: DR1's lay_check is stored, and any send-back carries the layer note.

## For the team before release
The four DR1 items in run 41822 are summary lines that state each point with no verse on an [L1] or [L3] line. The same question stands for CR1 under ASK 560: are an opening's summary lines critical points under rulings 397 to 400? If the team rules they are not, LAY's block reader should exempt them on both sides by one rule (a separate ASK), not by leaving DR1 unchecked.
