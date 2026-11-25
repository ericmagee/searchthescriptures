# W1 RECHECK: ASK 645 b2 rebased on live 393bca2e (ask645/w4/b2, commit 99d456df, target dbed99b4)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.

RECHECK: PASS.

Checks against live 393bca2e:
- The b2 builder is byte-equal to the graded b1 builder. On my own fetch of live, my rebuild equals W4's b2 target in every node and in the connections.
- Against live, only QR Merge, QR Follow Build and QR Follow Final change. Each is byte-equal to the node I graded in b1.
- t645 runs 24 pass, 0 fail, and standing runs 31 PASS, 0 FAIL.

Order:
- 638 A is written first. It changes Shared Library only and leaves the QR nodes alone.
- 645 is then built on the 638 A fetch-back. Its three QR nodes must equal these, and every other node must equal that fetch-back.
- I read the result back after the write. No further grade is needed before it.
