# W3 grade of W1's rebuilt joint: pkgOON rev 2 + pkgGK1 rev 1 + pkgKCQ rev 2 + pkgKWQ rev 2 (Wall 4412): PASS with limits

Graded on two files. (1) joint_s113_OON2_GK1_KCQ2_KWQ2.json against live s113. (2) joint_s113_OON2_GK1_KCQ2_KWQ2_EAD.json (sha256 starting ed0985508c10c586) against live s114: since pkgEAD rev 3b was written (s114, W4 Wall 4423), this second file is the four fixes on the live engine. Offline; nothing written. Claim Wall 4420. Labels committed before any run (commit 2f0076a2). Harness pkgJ4/w3_grade (j2.cjs, b.cjs, kc.cjs, kw.cjs, gc.cjs). MEASURED.

## Size and composition
- File (2) against live s114: 418 nodes, connections equal, only the Shared Library differs, +267 code, prompt 0 added (pkgOON rev 2 makes each "not found verbatim" send-back item 17 characters shorter). Five library lines differ, and each is one of the five lines of file (1).
- File (1) against s113: +267; five lines, each equal to exactly one single package's line (pkgOON rev 2 two lines, pkgGK1 one, pkgKCQ rev 2 one, pkgKWQ rev 2 one); none touched twice.
- Source check of file (2): of 41 library nodes, 38 are equal to file (1) and 3 (the send-back build nodes) are equal to pkgEAD on s113, which is s114. Those 3 are untouched by the four fixes. So every test below on file (1) holds for file (2); the K-C plants and the gate chain were also run on file (2) itself, with the same results.

## pkgKCQ rev 2: the silent drop of Wall 4403 is closed
- Stored 34726 at Panel Payloads: sol's K-C is not raised; luna and terra equal to live.
- Plants on sol's CHALLENGER CONCEDED LINKS line. Raised by live and by the joint: my four lines of Wall 4403 (both that rev 1 dropped are raised again); "that quotation of Matthew 1:16 does not assert the added begetting, and none of the verses states the link in its own words"; "That quotation does not assert the added exclusion; none of the challenger's verses states the begetting in its own words, so the rows are set aside"; "the rows are set aside because that quotation does not assert the begetting the challenger added". Not raised by either (so no change): four lines live does not raise today.
- One plant differs, the builder's stated limit: "The challenger's rows are set aside: that quotation does not assert the added link in its own words." Live raises K-C; the joint does not, and nothing records it. It takes all three parts together (a quotation as subject, "does not assert", "the added ..." as object). Read by hand, those words are the Commitment 6 comparison of a charge with a quotation; I had to add "in its own words" and a setting-aside clause to make a K-C of them. I pass it as a LIMIT, not as the fault of rev 1, which dropped ordinary K-C sentences on one word. It remains a silent path.

## pkgKWQ rev 2
- Reader pattern from the joint's library line: Haiku's two stored answers read; curly single marks read; double marks read as before; a quotation holding an apostrophe and then closed reads; an opening single mark with no closing mark is REFUSED (rev 1 accepted it); no marks refused; under 6 characters refused.
- LIMIT (the builder's): an unclosed opening single mark is accepted when a later apostrophe stands before a non-letter ("'the readings' meaning is kept").
- The reader checks form only, in live as in the joint: whether the quotation stands in the round named is a hand reading at each run grade.

## pkgOON rev 2 and pkgGK1 rev 1 in the joint
- Gate chain on stored 34726 (Gate Build, the stored gate reply renumbered by item identity, Gate Record): live luna 15 items, 12 uncured; joint luna 4 items, 4 cured, 0 uncured; the K-G1 row written RECORD-ONLY. terra and sol rows equal to live.
- Single grades: /mnt/project-files/w3/grade_OON_w3.md, grade_GK1_w3.md.

## NOT SHOWN by me
1. That the struck rows leave the final saved verdict. At Gate Record the saved verdict still holds all 25 out-of-round rows in the judge's own text, in live and in the joint alike; the engine writes applied changes into the verdict at the alternate merge nodes, which I did not run. The count is 0; whether the rows are gone from the stored text is for the builder's chain output to show (count of out-of-round rows in luna's final verdict; the "SEND-BACK APPLIED" line naming S12 to S24).
2. The Haiku path end to end, and sol at 0 from Panel Payloads onward as a chain (W1 ran both, Wall 4412). In my gate chain alt_needed stays true because sol's stored count comes from upstream of where I start.
3. quorum_met, and any run.
4. That a judge told the strike form writes it.

## Limits carried from the singles
pkgOON: any out-of-round answer beginning NONE strikes; three other out-of-round reasons do not tell the strike form. pkgGK1: the verdict keeps BROKEN on an unanswered witness with a conceded count of 0; the exemption is not tied to the link the item names; the K-G1 row reads UNCURED with RECORD-ONLY in its reason.
