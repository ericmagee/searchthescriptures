-- pkgS266 (W2; coordinator ask 11-13 10:22 CST under the operator's Matthew 1:19 ruling: legal framing is contamination; the ground is the broken tradition).
-- Sight 266, four literal replacements. Each old text must occur exactly once; md5 before and after are checked; anything else raises and rolls back.
-- Status, layer_status, title and embedding are untouched (no fence or status trigger fires on these columns; production_safe recomputes to the same value).
-- The embedding is NOT refreshed here: it goes stale on the summary change, as with the earlier Matthew 1:19 writes (separate refresh, on the operator's word).
-- Writer: W4 only, on the operator's own word. Run inside: begin; set local truth.session_id='<writer session>'; <this block>; commit;
DO $pkg$
DECLARE
  r record;
  o1 text := 'dikaios = Torah-compliant legal status, not mere emotional disposition (G1342;';
  n1 text := 'dikaios (G1342;';
  o2 text := 'the coordinate clause is one legal reality stated from two angles';
  n2 text := 'the coordinate clause is one intent stated from two angles';
  o3 text := ' L4 open: whether dikaios fully exhausts to legal-covenantal force in Matthew.';
  log text := E'\nCORRECTED 2026-11-13 (Matthew 1:19 ruling; the ground is the broken tradition, Sight 32): legal framing struck from the summary (the dikaios gloss; the CORE sentence), from this note, and from framework_area. Prior wording: table_snapshot_queue row 53017.';
  s2 text; nt2 text;
BEGIN
  SELECT summary, notes, framework_area INTO r FROM kb_sights WHERE sight_number=266 FOR UPDATE;
  IF md5(r.summary) <> 'df55e3a0063f207f49ef18b650f5a96f' THEN RAISE EXCEPTION 'summary md5 before %', md5(r.summary); END IF;
  IF md5(r.notes) <> '65fea1f2d335aa8561d4fa6f861ed5b3' THEN RAISE EXCEPTION 'notes md5 before %', md5(r.notes); END IF;
  IF r.framework_area IS DISTINCT FROM 'Christology / Legal' THEN RAISE EXCEPTION 'framework_area before %', r.framework_area; END IF;
  IF (length(r.summary)-length(replace(r.summary,o1,'')))/length(o1)<>1 OR (length(r.summary)-length(replace(r.summary,o2,'')))/length(o2)<>1
     OR (length(r.notes)-length(replace(r.notes,o3,'')))/length(o3)<>1 THEN RAISE EXCEPTION 'anchor count'; END IF;
  s2 := replace(replace(r.summary,o1,n1),o2,n2);
  nt2 := replace(r.notes,o3,'') || log;
  UPDATE kb_sights SET summary=s2, notes=nt2, framework_area='Christology', updated_at=now() WHERE sight_number=266;
  SELECT summary, notes INTO r FROM kb_sights WHERE sight_number=266;
  IF md5(r.summary) <> '166fe44f1ed8acf667c8abd1b35d44a2' OR md5(r.notes) <> '7d341d1808cd3d2cda951bcf9ccaa287' THEN RAISE EXCEPTION 'md5 after % %', md5(r.summary), md5(r.notes); END IF;
END $pkg$;
