# ASK 419 run-start check (W4 plans and builds; W1 and W2 grade). A tool in git; it changes no system.

Assignment (W3 Wall 8826): "nothing running, the live versions are the readback-matched ones, and the body file is right; it refuses on
any mismatch". ASK 422(a) plan rev 2 items 8 and 9 add the two-sha library check (W2 8912 N2, W1 8914 item 7).

## OBJECTIVE
No run starts on a version that was not read back, on engine and child libraries that differ, while another execution runs, or with
a body other than the one released. Expected effect: the run report can name the exact versions, library sha and body the run used.

## Use (before every run start)
    python3 runstart.py --engine <versionId> --child <versionId> --body <body.json> --body-sha <prefix released>
The two versionIds are the ones of the last write whose readback MATCHED. Exit 0 prints GO; exit 1 prints REFUSED and every failed item.
The start (the POST of the body to the oracle-debate-v1 webhook) is sent only after GO, and only on the operator's release. The run report
names the GO output and the body sha.

## Checks
0. Live guards: when anything is read live, --body-sha is required and --no385 is refused.
1. Nothing running: no execution running or new (queued) in any workflow; none waiting in the engine, the child, Early Alternate or Cure Call.
   Waiting executions of other workflows are listed, not refused (two of "Post a Directive" have waited since 2026-08-18 until the year 3000).
2. Versions: live engine and child versionIds equal the expected ones; each is active and published (activeVersionId equals versionId).
3. Library: lib_sha (first 16 hex of SHA-256 over JSON.stringify of the /*LIB*/ line array) equal on engine and child, and each equals
   the sha its own header names.
4. ASK 385 one-copy check (a385 reg385.cjs) on the live pair.
5. Body: parses; keys exactly defender {engine, profile}, challenger {engine, profile}, topic (non-empty); its sha256 starts with the
   released prefix. Which seats may debate is the webhook's own check and is not repeated.

## DONE WHEN
1. Live: on the live pair it prints every check, and refuses while any execution runs (shown at build time: the ASK 410 test).
2. Offline (t419.sh, t419_out.txt): GO on the live pair with nothing running; REFUSED on each plant: a running execution, a waiting
   execution in the child, an older expected version, an unpublished child, a drifted child library line, a body with an extra key,
   a body with no topic, a body that does not parse, a body whose sha differs. A waiting execution of another workflow gives GO.

## Limits
It reads the execution list once, up to 250 per status. It does not stop a run that someone starts after the check.
