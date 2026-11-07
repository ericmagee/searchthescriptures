# pkgGRA: grok may serve as an alternate (W3 ruling B2; Eric approved 00:03Z 11-07)

**Node:** Init Seats, jsCode. One edit: `s!=='grok'&&` is dropped from the ALT_ORDER filter, which came from judge_fix5 G12.

**Bases:** two copies are built. Write the one that matches the live Init Seats at the gap.
- `patched/Init_Seats.js` is built on live 1b49671d, which has no pkgJFL. base_sha 5251c79619e13485, final_sha deb4e359a96fda0f.
- `patched_on_JFL/Init_Seats.js` is built on pkgJFL's patched Init Seats, for when pkgJFL's n8n part is in. base_sha d2f5b219d9039f89, final_sha 717ed6aebedc7a04.

**Test:** `node pkgGRA/test_GRA.cjs` gives 15 OK.
- On the 33175 seat set, and two smaller sets, the panel and reserve are unchanged. Grok is the reserve, and the alternate pool goes from [] to [grok].
- With pkgJFL moving gemini, grok takes the panel place and gemini is the alternate.

**Note:** grok can be both the reserve and an alternate, as ruling 421 allows. Alternate Build's G3 refuses it as an alternate when it already sits on the panel as the reserve.

**Revert:** put back the matching base.
