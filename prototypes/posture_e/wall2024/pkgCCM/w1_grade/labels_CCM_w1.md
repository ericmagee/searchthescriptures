# W1 grade labels for pkgCCM (W2, Wall 4448, parent_s115_CCM.json sha256 d46203673e1d0d07), written before any run.
PASS needs all of:
- K1 Diff: 418 nodes, connections equal, only C2 Build, C3 Build, C4 Build differ, code only; total -327; prompt 0.
- K2 Markers, every stored C2/C3/C4 body rebuilt with the candidate: C2 carries a message marker on message 0 only; C3 and C4 carry no message marker; the system marker is unchanged; at most 4 breakpoints per body.
- K3 C2 prefix identity with C1 (so the read hits C1's entry): model, system, tools/thinking/other top-level request fields that form the cache prefix, and message 0 are byte-equal to the stored C1 body, every stored run.
- K4 Every non-Claude branch of bodyFor (other providers) returns the same body on live and candidate.
- K5 The text the debaters read (system text, every message text, order) is unchanged on every stored body.
RECORD (no pass/fail): K6 stored CACHE DIAG: tokens written by C2/C3/C4 that the change stops, against reads lost by C3G/C4G; K7 whether C3/C4 message 0 equals C1 message 0 (a further read the change does not take).
