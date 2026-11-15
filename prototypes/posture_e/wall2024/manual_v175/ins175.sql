SET LOCAL truth.session_id = 'session_01H1X3ANsGiMnhnbkfphocmo';
DO $do$ DECLARE c text; BEGIN
 IF (SELECT max(version) FROM engine_manual)<>174 THEN RAISE EXCEPTION 'max version not 174'; END IF;
 IF (SELECT md5(content) FROM engine_manual WHERE version=174)<>'d79d469e48895a063bccc5e233828bd7' THEN RAISE EXCEPTION 'v174 md5 changed'; END IF;
 SELECT replace(content,$q$  - Limits: the defender's own citation of Deuteronomy 22 is not touched.

## 6. Rounds$q$,$q$  - Limits: the defender's own citation of Deuteronomy 22 is not touched.
- THE DG-8 GUARD NAMES THE ESPOUSED HUSBAND AND WIFE FROM THE ROWS, NOT "IN LAW", AND STATES MATTHEW 1:18-19 (DG-8 edits; drift_guards rule_num 8; ASK 315; Oracle seat only):
  - Why: in run 37281 the Oracle took up the defender's Deuteronomy 22:24 as its own footing ("MEANS: the betrothed is a wife in law from the espousal", its round 2 list; "the espoused woman is called wife in the law", its close). The source was the guard's own words, DG-8 (b): "Joseph and Mary were husband and wife in law from the espousal". On Matthew 1:19 the Oracle answered only with exposure and never named the source of the scorn, so the defender's close ("A husband who had himself begotten the child would not need to be told an origin") stood unanswered.
  - What it does: Edit 1 replaces "husband and wife in law from the espousal" with "husband and wife from the espousal, as the rows themselves name them" and adds Luke 2:5, "Mary his espoused wife". Edit 2 adds one paragraph before "Also forbidden: resolving the genealogy": the row's "before they came together" (Matthew 1:18) is the coming under one roof at the taking (Matthew 1:24), never the union, whose word is "knew" (Matthew 1:25); Joseph's grounds are the two Matthew 1:19 gives; the scorn he would spare her is men's tradition, not a sentence of God's law (Mark 7:7, 7:8, 7:9; Colossians 2:8, quoted); at L4 the child is Joseph's and he knew it; forbidden are legal framing of the espousal or the putting away (Deuteronomy 22:23-24 or 24:1 as footing, "wife in law", "legal husband") and reading Joseph's intent as a judgment on who begat the child.
  - Reach: DG-8 text enters only the Oracle seat's prompt (GUARDHOLD, on the profile oracle branch of Init with Guards) and the analyst prompts (Build Synthesis, which runs before the panel, and Build Diagnostic Prompt); the panel takes from Synthesis only close_graded, which is code over the rounds, not the analyst's text. Two code checks also read it (the served-text check in Init with Guards, and Regrade Load); they read labels, not prompts. The plain seat, the judges and the enforcers do not see it (Ruling 383).
  - Size: DG-8 3,366 to 4,548 characters (md5 9e75e3ed to 6bc9bf50); no node changes.
  - Limits: a database row, so the n8n version does not change; the defender's own citation of Deuteronomy 22 is not touched; not shown by a run.

## 6. Rounds$q$) INTO c FROM engine_manual WHERE version=174;
 IF md5(c)<>'2e322fd3fdfc85f7e1d043fe27206438' THEN RAISE EXCEPTION 'md5 %', md5(c); END IF;
 INSERT INTO engine_manual(version,content,summary) VALUES(175,c,'v175 = v174 + DG-8 edits entry (ASK 315): espoused husband and wife from the rows, not in law; Matthew 1:18-19 paragraph; Oracle seat only');
 INSERT INTO engine_manual_log(version,entry_date,title,content,char_len) VALUES(175,'2026-11-15','DG-8 row edits (ASK 315, database row, no node change)','Section 5 gains one entry after pkgD22: DG-8 Edit 1 drops in law and adds Luke 2:5; Edit 2 adds the Matthew 1:18-19 paragraph (one roof, tradition of men, legal framing barred). Reach Oracle seat only. Live flow unchanged.',length(c));
END $do$;
SELECT version, length(content) len, md5(content) m FROM engine_manual WHERE version>=174 ORDER BY version;
