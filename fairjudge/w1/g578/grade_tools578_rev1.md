# GRADE: ASK 578 TOOLS REV 1 (W4, Wall 11868, commit 52fbad9e)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 2026-11-24 CST.

GRADE: PASS
COMMIT: 52fbad9e (W4). Graded files: tools/libw.py md5 260a3d8e (same in /mnt/project-files/ask578/w4/tools), a385_w4/registry_578.json md5 40349791.
RULES READ: Build rule (fresh live readback; touched nodes only); ASK 385 one-copy rule; ASK 422(a) one writer; my N1 and N2 of Wall 11864.
OBJECTIVE MET: yes. N1 (pre-existing reg385 FAIL from the ASK 573 loader) is closed by an accepted pair with its reason; N2 (libw cannot write the engine alone when the child is served the library) is closed by --engine-only.
STANDARD (ASK 599): met for the changed lines; each refusal prints its reason and exits non-zero; no silent pass.

## Registry diff (registry.json -> registry_578.json)
Three __RL pairs added, each with a reason and a Wall reference: 2be75845b4d7/0f0fa74632df and 2be75845b4d7/3be38199f953 (child Retry Build copy, argument differs only), 0f0fa74632df/3be38199f953 (ASK 573 loader). Nothing removed. Note: the first two pairs still say "to be graded by W1"; this grade is that grade.

## reg385 runs (my seat, my copies)
| pair | with registry_578 | without |
|---|---|---|
| live 578 (912dd47a / aad0ad9c) | PASS | FAIL (3) |
| 628 (634afc23 / 85515391) | PASS | FAIL (1) |
| 624.5 targets | PASS | FAIL (3) |
The "without" FAILs are the pre-existing ASK 573 finding, so the registry is what turns them; no other failing check remains.

## libw.py --engine-only, offline harness (OFF_ENG/OFF_CHILD = 578 fetchbacks)
| control | input | result | expected |
|---|---|---|---|
| A | 624.5 engine target, child base | DRY; engine sends lib True; MAPEXTRA equal | DRY |
| B | same, without --engine-only | IndexError | refuse (see N1 below) |
| C | 628 engine (does not send lib) | REFUSED | REFUSED |
| D | A with --write | "OFFLINE: a PUT was attempted; nothing sent" | PUT attempted |
| E | child target = target_child_624.json | DRY | DRY: that file is node-equal to the 578 child base (155/155 nodes, 0 differ, connections equal) |
| E2 | child target with one node changed (Alternate Pass Check jsCode + comment) | REFUSED: the child target must equal the child base | REFUSED |

## Notes (not blocking)
N1. Control B ends in an IndexError, not a printed refusal. The old route is not the route to use, but under ASK 599 a refusal should name itself. Fix when the file is next touched.
N2. The live dry run: W4's session was refused it by its permission check. I have not run it from my seat, because running a step another seat was refused would go around that check. It needs Eric's word, either for W4's retry or for my seat to run it.
