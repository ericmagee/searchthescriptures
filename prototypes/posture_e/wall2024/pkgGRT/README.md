# pkgGRT: the E-COL send-back option offers RETRACTED only on a FORCED line (33627)

Nodes (base pkgEHF/patched = live s59 + pkgEHF, so GRT rides on EHF): Send Back Build 3b0b1c0487e0 -> 91baefb37252; Alt Send Back Build 499f2893ae5c -> e3387f775787.

Fault: the E-COL asks (pkgECF __ecfR and pkgECL __eclR) said "Otherwise CHANGE TO: RETRACTED: <pair>" on every flagged line. The apply step reads
RETRACTED only against a FORCED line, so on a collision line it refused the cure it offered ("no line form the engine reads"). 33627: gemini
S4/S6/S8/S10 and grok S7/S9/S11/S13/S14/S16, 10 refusals, each costing a gate round.

Change, wording only: on a FORCED line the option stays "CHANGE TO: RETRACTED: <pair>" and adds that it applies only once the pair's collision
line is no longer LINK BROKEN (ruling 411, pkgRFL), so regrade that line where it is asked. On a collision line the option is the line with the
pair regraded (UNDERDETERMINED or STANDS, with its GROUND), and the ask says a collision line is regraded, never retracted.

Test (node pkgGRT/test_GRT.cjs): 4 OK. 50 node runs over every saved run, 26 change, only E-COL ask blocks differ. 72 collision-line asks offer
RETRACTED 0 times; 77 FORCED-line asks all keep it. In 33627 all 10 refused asks now read as collision-line asks (regrade).
Live bar: 0 "no line form" refusals of a RETRACTED answer on a collision line.
Not a DeepSeek fix; it rides with one.
