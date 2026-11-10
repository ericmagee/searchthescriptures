# W1 grade of pkgKBG (Wall 3853, commit 9929459): FAIL, one fix

Reproduced: build_KVQ on fetchback_live_s94 byte-equal to base_s94_KVQ.json; build_KBG on it byte-equal to parent_s94_KBG.json; against live s94 only the 3 Send Back Record nodes differ, connections equal. probe_KBG 18 OK; replay_KBG 42 runs, 68 KEEP rows, 0 differ; probe_VP3_on_KBG 40 OK.
Rolled-back insert of 2 rows (panel send_back UNCURED with the pkgKBG reason, panel CURED) through record_enforcer_log: accepted, rows 2.

FIX 1 (markup before a grant). __bq applies the bare test to each sentence as split, so a sentence that begins with markup is never read as a grant and is not cut.
w1_plant_KBG.cjs (33798 terra Job 14:1, the same planted grant "I grant the phrase covers Hezekiah and Josiah, kings named by their fathers." in CR4, KEEP quoting it):
- plain line: UNCURED (pkgKBG)
- "- I grant ...": CURED
- "**On Job 14:1.** I grant ...": CURED
- "[L1] I grant ...": CURED
- "- **Job 14:1** I grant ...": CURED
Stored rounds of 45 runs: 321 grant sentences are read by the bare test and 359 begin with markup (bullet, bold label, [Ln], >) and are not. Example on 33798 itself: "- **Galatians 4:4.** I grant "of a woman" is a general phrase (Job 14:1)."
Ask: strip leading markup (bullet, numbering, >, bold or italic label, [Ln] tag, verse label) from each sentence before __gr/__df.
Consequence to decide when fixing: the probe's "CR2 fuller answer" stays CURED only because its sentence begins "**On Job 14:1.**". Without the heading (plant M2) the same sentence "I accept it as a phrase said of all men, and I make no claim from Galatians 4:4 alone." reads UNCURED under pkgKBG, since the bare test finds no so/because/for/but after the grant. With the fix it reads UNCURED as stored too; the builder states whether that is intended (the next sentence of CR2, "The claim stands on the chain ...", is the fit).
Code read otherwise: the cut applies only when the flagged answer is bare, after pkgKQG and pkgKVQ; it can only turn CURED to UNCURED; record-only, no verdict changes.
