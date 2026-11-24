SET LOCAL truth.session_id='session_01H1X3ANsGiMnhnbkfphocmo';
SET LOCAL truth.card='@@CARD@@';
DO $cut$
DECLARE c text; v int; f record; n int; mx int; lg text;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('engine_manual_version'));
  SELECT version, content INTO v, c FROM engine_manual ORDER BY version DESC, id DESC LIMIT 1;
  IF v <> 241 OR md5(c) <> 'd0e9efda3280624ce987050bc9568197' OR length(c) <> 707670 THEN
    RAISE EXCEPTION 'cut583: the base is not version 241 d0e9efda (found v% %)', v, md5(c); END IF;
  IF EXISTS (SELECT 1 FROM engine_manual_parts) THEN RAISE EXCEPTION 'cut583: engine_manual_parts already holds rows'; END IF;
  INSERT INTO engine_manual_parts (part, order_index, title, version, content, summary)
    SELECT x.part, x.oi, x.title, v + 1, substr(c, x.s, x.n), 'ASK 583 cut: this part is characters ' || x.s || ' to ' || (x.s + x.n - 1) || ' of engine_manual version 241, unchanged.'
    FROM (VALUES
('00.0',100,'Preamble (title and notice before section 0)',1,1230),
('00.1',200,'0. How to read this manual',1231,2204),
('01.0',300,'1. What the engine is',3435,961),
('02.0',400,'2. Firing a run and reading it',4396,1791),
('03.0',500,'3. Request rules (Init Seats, in this order)',6187,2775),
('04.0',600,'4. Seats, models, tokens, caching',8962,13743),
('05.0',700,'5. What each seat is given',22705,14317),
('06.0',800,'6. Rounds',37022,24197),
('07.0',900,'7. Synthesis, single judge, diagnostic',61219,14737),
('08.0',1000,'8. The judges'' rulebook',75956,39149),
('09.0',1100,'9. Enforcers (part 1 of 9)',115105,38944),
('09.1',1200,'9. Enforcers (part 2 of 9)',154049,38916),
('09.2',1300,'9. Enforcers (part 3 of 9)',192965,39649),
('09.3',1400,'9. Enforcers (part 4 of 9)',232614,38740),
('09.4',1500,'9. Enforcers (part 5 of 9)',271354,36613),
('09.5',1600,'9. Enforcers (part 6 of 9)',307967,39934),
('09.6',1700,'9. Enforcers (part 7 of 9)',347901,38990),
('09.7',1800,'9. Enforcers (part 8 of 9)',386891,38546),
('09.8',1900,'9. Enforcers (part 9 of 9)',425437,28517),
('10.0',2000,'10. The panel',453954,39835),
('11.0',2100,'11. Persistence and the column map (crossed columns: read before any query) (part 1 of 3)',493789,38945),
('11.1',2200,'11. Persistence and the column map (crossed columns: read before any query) (part 2 of 3)',532734,35620),
('11.2',2300,'11. Persistence and the column map (crossed columns: read before any query) (part 3 of 3)',568354,14690),
('12.0',2400,'12. Citation check against the KJV',583044,38117),
('13.0',2500,'13. Debate documents',621161,14945),
('14.0',2600,'14. Regrade and dry regrade',636106,2968),
('15.0',2700,'15. Verifying a change',639074,6023),
('16.0',2800,'16. Troubleshooting (symptom -> cause -> what to do)',645097,2087),
('17.0',2900,'17. Known open items (verify live before acting) (part 1 of 2)',647184,39590),
('17.1',3000,'17. Known open items (verify live before acting) (part 2 of 2)',686774,20347),
('18.0',3100,'18. Write register',707121,550)
    ) AS x(part, oi, title, s, n) ORDER BY x.oi;
  -- C1: lossless, before any change of text
  SELECT * INTO f FROM engine_manual_full();
  IF md5(f.content) <> 'd0e9efda3280624ce987050bc9568197' OR length(f.content) <> 707670 OR f.version <> v + 1 THEN
    RAISE EXCEPTION 'cut583 C1 FAILED: joined parts give % length % version %', md5(f.content), length(f.content), f.version; END IF;
  -- C2 (first cut only; not a standing limit) and the count
  SELECT count(*), max(length(content)) INTO n, mx FROM engine_manual_parts;
  IF n <> 31 OR mx > 40000 THEN RAISE EXCEPTION 'cut583 C2 FAILED: % parts, largest %', n, mx; END IF;
  -- the pointer row and the log row of the cut
  INSERT INTO engine_manual (version, content, summary)
    VALUES (v + 1, $q$# TRUTH engine manual: held in parts
- The engine manual is held in parts since this version. This row is a pointer, not the manual.
- The list of parts: SELECT engine_manual_toc();
- One part: SELECT engine_manual_part('<part>');
- The whole text and its version: SELECT * FROM engine_manual_full();
$q$, 'ASK 583: the engine manual is held in parts (engine_manual_parts) from this version; this row is a pointer. No text of the manual changed at the cut.');
  SELECT string_agg(part || ' | order ' || order_index || ' | ' || title || ' | ' || length(content) || ' | ' || md5(content), E'\n' ORDER BY order_index) INTO lg FROM engine_manual_parts;
  INSERT INTO engine_manual_log (version, entry_date, title, content, char_len, part)
    VALUES (v + 1, (now() at time zone 'America/Chicago')::date, 'ASK 583: the engine manual cut into 31 parts',
      'Writer W3 (seat 33). Card: ' || coalesce(current_setting('truth.card', true), 'NONE') || E'\nBase: engine_manual version 241, md5 d0e9efda3280624ce987050bc9568197, 707,670 characters. The 31 parts joined in order give that md5 and length (checked inside the write). No text changed. Plan manual1123/w3/a583/ASK583_plan.md draft 2c d0c99b47 (W1 PASS Wall 11224); operator approval for build 20:50 CST 2026-11-23; ruling 20:52 CST: no cap on size. The engine_manual row of this version is a pointer.\npart | order_index | title | characters | md5\n' || lg,
      707670, NULL);
END $cut$;
DO $s0$
DECLARE r jsonb;
BEGIN
  r := engine_manual_part_apply('00.1', 242, '9e331d8233e4467247f48da8b77e19b8', $q$[{"old": "- The active version is `SELECT max(version) FROM engine_manual`. `SELECT engine_manual_toc()` gives the live map. The revision history is `engine_manual_log`.", "new": "- The manual is held in parts: table `engine_manual_parts`, one row per part per version of that part. `SELECT engine_manual_toc()` lists the parts. `SELECT engine_manual_part('<part>')` gives one part; `SELECT * FROM engine_manual_full()` gives the whole text and its version. The manual's version is the highest part version. The revision history is `engine_manual_log`; its column `part` names the part a version changed. The parts are read in the order `engine_manual_toc()` gives. The table `engine_manual` holds the whole-text versions up to the cut and is not written again."}, {"old": "To revise: call engine_manual_apply (ASK 421) in the same batch as", "new": "To revise: call engine_manual_part_apply on the one part (engine_manual_apply refuses now that the manual is in parts) in the same batch as"}, {"old": "it refuses unless the base is the max version and has the given md5", "new": "it refuses unless the base is that part's latest version and has the given md5"}, {"old": "it inserts version+1 with its summary", "new": "it inserts that part at the manual's highest version + 1 with its summary"}, {"old": "the readback is mrb.cjs (ASK 420(b))", "new": "the readback is mrb.cjs with the part as its fourth argument, node mrb.cjs <base> <new> <pairs.json> <part> (ASK 420(b))"}, {"old": "Limit: an old text that overlaps itself is counted once.\n", "new": "Limit: an old text that overlaps itself is counted once.\n- New text enters only through engine_manual_part_apply on an existing part. A part that has grown is divided in two with engine_manual_part_split, at a text that occurs once in it, with no change of text; no part and no size is refused.\n"}]$q$::jsonb, '8717b03fe7e16a9bc03808c0aa516f0e', 3068, 'ASK 583: section 0 names the parts and their read and write calls', 'Section 0: the manual is held in parts; read calls engine_manual_toc, engine_manual_part, engine_manual_full; revise with engine_manual_part_apply; divide a grown part with engine_manual_part_split. No other section changed.', $q$Writer W3 (seat 33). Part 00.1 (section 0), base version 242 md5 9e331d8233e4467247f48da8b77e19b8. Six pairs (manual1123/w3/a583/cut/section0_pairs.json): bullet 1 replaced; four phrases of the To revise bullet; one bullet added after it. Wording: section0_new_text.md 5b96de34 (W1 PASS Wall 11233). Result md5 8717b03fe7e16a9bc03808c0aa516f0e, 3068 characters; the whole manual then has md5 fb4ff4394d6201dccd512b279914033e, 708534 characters.$q$, true);
  IF (r->>'success') IS DISTINCT FROM 'true' OR (r->>'written') IS DISTINCT FROM 'true' OR (r->>'version')::int <> 243 THEN
    RAISE EXCEPTION 'cut583 section 0 write FAILED, the whole cut is rolled back: %', r::text; END IF;
  IF (SELECT md5(f.content) FROM engine_manual_full() f) <> 'fb4ff4394d6201dccd512b279914033e' THEN
    RAISE EXCEPTION 'cut583 C1b FAILED: the whole manual is not fb4ff4394d6201dccd512b279914033e'; END IF;
END $s0$;
SELECT version, md5(content) AS md5, length(content) AS length FROM engine_manual_full();
