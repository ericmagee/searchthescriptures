# pkgESS (W1, 11-07): DeepSeek enforcer retry also fires on a SHORT reply (33430 call 5: 1 line for 26 items, finish_reason stop)

pkgESR split-retried a call only on no reply, an error, empty content or finish_reason "length". 33430 call 5 (24 E-PREM + E-RES + E-SYN) stopped normally after
one line ("ENFORCER: Y1.1 ..."; 2,587 completion tokens, 2,504 reasoning), so 25 checks went NO VERDICT and the retry did not fire.
Change (Retry Build nodes only): why(r,b) also returns "short reply: n ENFORCER line(s) for N item ids" when the reply has 2 or more fewer ENFORCER lines than
the call's ids; the call is then split into two halves of whole items and sent once, exactly as a failed call. The Record already merges any retried
call by esr_of (halves replace the original call), so it is unchanged.
| Node | live s47 | patched |
|---|---|---|
| Judge Enforcer Retry Build | cfa5ec5750ad | a14a44ae02a8 |
| Alt Judge Enforcer Retry Build | d7eef3d79009 | 35a4b2f6ec74 |
replay_ESS.txt: 32 saved enforcer calls sets OK (every pkgESR retry kept); the only new retry is 33430 main call 5 (halves of 15 and 11 ids). No other saved call is short.
