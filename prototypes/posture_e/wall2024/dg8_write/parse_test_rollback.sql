SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
DO $do$ DECLARE a int; b int; m text; BEGIN
update drift_guards set rule = replace(replace(rule,
 $a$Joseph and Mary were husband and wife in law from the espousal ("Joseph her husband," Matt 1:19; "Mary thy wife," Matt 1:20)$a$,
 $a$Joseph and Mary were husband and wife from the espousal, as the rows themselves name them ("Joseph her husband," Matt 1:19; "Mary thy wife," Matt 1:20; "Mary his espoused wife," Luke 2:5)$a$),
 $a$Also forbidden: resolving the genealogy$a$,
 $a$MATT 1:18-19, THE COMING TOGETHER AND THE PUTTING AWAY. The row's "before they came together" (Matt 1:18) is the coming under one roof at the taking, "took unto him his wife" (Matt 1:24); it is never the union, whose word is "knew" (Matt 1:25). Joseph's grounds are the two the verse gives: "being a just [man], and not willing to make her a publick example" (Matt 1:19). The scorn he would spare her is the scorn of men's tradition, not a sentence of God's law: "teaching [for] doctrines the commandments of men" (Mark 7:7); "laying aside the commandment of God, ye hold the tradition of men" (Mark 7:8); "Full well ye reject the commandment of God, that ye may keep your own tradition" (Mark 7:9); "after the tradition of men ... and not after Christ" (Col 2:8). The record holds at L4 that the child is Joseph's and that he knew it; a wife found with child before the taking is what that tradition would scorn. Forbidden: legal framing of the espousal or of the putting away (Deuteronomy 22:23-24 or 24:1 as footing, "wife in law", "legal husband"), and reading Joseph's intent as a judgment on who begat the child.
Also forbidden: resolving the genealogy$a$), updated_at = now()
where rule_num=8 and md5(rule)='9e75e3ed4a25d589a6a4a97760743779'
;
GET DIAGNOSTICS a = ROW_COUNT;
update model_config set notes = coalesce(notes,'') || $n$
2026-11-14 23:45 CST: active false -> true on the operator's "enable glm for debating" (W4, Wall 6702); debater only.$n$, updated_at = now() where seat='glm' ;
GET DIAGNOSTICS b = ROW_COUNT;
select md5(rule)||' '||length(rule) into m from drift_guards where rule_num=8;
RAISE EXCEPTION 'PARSE TEST ROLLBACK: dg8 rows % glm rows % new %', a, b, m;
END $do$;
