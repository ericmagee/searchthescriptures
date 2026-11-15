-- ASK (pending number) DG-8 text fixes (W3 6680 draft, c800aef0) + glm row log (W2 6703 gaps). Guarded: writes only if live DG-8 md5 = 9e75e3ed4a25d589a6a4a97760743779 (3,366 chars). Target md5 6bc9bf5083e007b62a55f3347e9b6e94 (4,548 chars).
SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
update drift_guards set rule = replace(replace(rule,
 $a$Joseph and Mary were husband and wife in law from the espousal ("Joseph her husband," Matt 1:19; "Mary thy wife," Matt 1:20)$a$,
 $a$Joseph and Mary were husband and wife from the espousal, as the rows themselves name them ("Joseph her husband," Matt 1:19; "Mary thy wife," Matt 1:20; "Mary his espoused wife," Luke 2:5)$a$),
 $a$Also forbidden: resolving the genealogy$a$,
 $a$MATT 1:18-19, THE COMING TOGETHER AND THE PUTTING AWAY. The row's "before they came together" (Matt 1:18) is the coming under one roof at the taking, "took unto him his wife" (Matt 1:24); it is never the union, whose word is "knew" (Matt 1:25). Joseph's grounds are the two the verse gives: "being a just [man], and not willing to make her a publick example" (Matt 1:19). The scorn he would spare her is the scorn of men's tradition, not a sentence of God's law: "teaching [for] doctrines the commandments of men" (Mark 7:7); "laying aside the commandment of God, ye hold the tradition of men" (Mark 7:8); "Full well ye reject the commandment of God, that ye may keep your own tradition" (Mark 7:9); "after the tradition of men ... and not after Christ" (Col 2:8). The record holds at L4 that the child is Joseph's and that he knew it; a wife found with child before the taking is what that tradition would scorn. Forbidden: legal framing of the espousal or of the putting away (Deuteronomy 22:23-24 or 24:1 as footing, "wife in law", "legal husband"), and reading Joseph's intent as a judgment on who begat the child.
Also forbidden: resolving the genealogy$a$), updated_at = now()
where rule_num=8 and md5(rule)='9e75e3ed4a25d589a6a4a97760743779'
returning rule_num, length(rule) len, md5(rule) md5, updated_at;
update model_config set notes = coalesce(notes,'') || E'\n2026-11-14 23:45 CST: active false -> true on Eric "enable glm for debating" (W4, Wall 6702); debater only.', updated_at = now() where seat='glm' returning seat, active, updated_at;
-- REVERT: revert_dg8.sql (reverse replace, guarded).
