# pkgERC: DeepSeek E-PREM reads an engine-recounted CONCEDED LINKS line with the judge's stored counted premises (W3 3087 ruling 3)

Nodes: Judge Enforcer Build e764809d5d09 -> caba029517dd; Alt Judge Enforcer Build 2a507c2ed24f -> 14736afdc9ae (live s56 bases; same edits).

Fault (33592 grok): after the cure the engine rewrote grok's line as "CONCEDED LINKS: 3 -- recomputed after the cure from the cured lines
(CORRECTED COUNT DEFENDER 3)". The line names no premise; the E-PREM rule reads an unnamed premise as SPARED, so DeepSeek wrote AGREE SPARED on
all six, while the stored counted_premises_defender is [2, 5, 6]. Saved runs: a recounted line reached E-PREM in 33299, 33345, 33442, 33506,
33592 (Judge) and 33461, 33482 (Alt).

Change: (1) each judge keeps its stored counted_premises_defender/_challenger (read from verdict_raw) and its own pre-recount line
(AUDIT v27 SUPERSEDED); (2) an E-PREM judge line that says "recomputed after the cure" is shown with STORED COUNTED PREMISES, whether premise N
is COUNTED in it, the judge's own line before the recount, and its own collision lines on LINK N; (3) one rule passage, "RULE E-PREM, A
RECOUNTED LINE": the ruling is COUNTED when N is stored as counted, else SPARED; silence is not a SPARED ruling; a counted premise with no ground in
the shown lines is called "counted with no stated ground". A line not recounted is shown as before.

Test (node pkgERC/test_ERC.cjs): 5 OK. 73 node runs; every run builds the same items (compared as a set across calls, since a grown prompt
moves items between size-packed calls), differing only in recounted E-PREM lines; 33592 grok P1-P6 show stored 2, 5, 6 with 2/5/6 COUNTED
and 1/3/4 not, the pre-recount "CONCEDED LINKS: 1 -- LINK 6 UNEXHIBITED", and D2 vs C4 / D5 vs C5 collision lines.
Not testable offline: DeepSeek's new answers. Live bar: no recounted premise stored as counted is ruled from the line's silence as SPARED.
Note for W3: E-PREM's own rule says a ground of fit (a collision break) "is not COUNTED", while K-G7 required grok to count premises 2 and 5.
With this change DeepSeek will likely DISAGREE with grok's COUNTED on 2 and 5. That conflict is a ruling question, not a code one.
