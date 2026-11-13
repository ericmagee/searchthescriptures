CREATE OR REPLACE FUNCTION public.debate_sight_links(p_topic text, p_sight_cap integer DEFAULT 6, p_char_cap integer DEFAULT 8000)
 RETURNS TABLE(id integer, status text, layer text, passage_anchor text, conclusion_text text, kind text, link_note text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  -- BB-6377 Part 2 (design BB-6415, BB-6416; cap ruling BB-6417; fix ruling BB-6442): approved, active link groups whose
  -- trigger terms meet the topic's words (length over 3, as debate_arsenal_guarded); both ends of their approved links, whole.
  -- Sights the guard set serves on this topic are removed first (as debate_arsenal_guarded computes them). Then, in group then
  -- link order, a sight that would pass the character cap is skipped and later sights still fill, to 6 sights and 8,000 chars.
  WITH RECURSIVE words AS (
    SELECT DISTINCT lower(w) AS w FROM regexp_split_to_table(coalesce(p_topic,''), '[^A-Za-z]+') AS w WHERE length(w) > 3
  ),
  caps AS (
    SELECT greatest(least(coalesce(p_sight_cap, 6), 6), 0) AS cs, greatest(least(coalesce(p_char_cap, 8000), 8000), 0) AS cc
  ),
  gs AS (
    SELECT g.guard_num, u.sn, u.ord
    FROM guard_served_sets g CROSS JOIN LATERAL unnest(g.sight_numbers) WITH ORDINALITY AS u(sn, ord)
    WHERE g.active AND EXISTS (SELECT 1 FROM unnest(g.trigger_terms) t WHERE lower(t) IN (SELECT w FROM words))
  ),
  gr AS (
    SELECT DISTINCT ON (s.sight_number) s.sight_number AS gid, gs.guard_num, gs.ord
    FROM gs JOIN kb_sights s ON s.sight_number = gs.sn AND coalesce(s.production_safe, true)
    ORDER BY s.sight_number, gs.guard_num, gs.ord
  ),
  g8 AS (SELECT gr.gid FROM gr ORDER BY gr.guard_num, gr.ord LIMIT 11),
  grp AS (
    SELECT g.id FROM kb_sight_link_groups g
    WHERE g.status = 'approved' AND g.active
      AND EXISTS (SELECT 1 FROM unnest(g.trigger_terms) t WHERE t IN (SELECT w FROM words))
  ),
  ends AS (
    SELECT l.group_id, l.id AS link_id, e.sn, e.side, l.relation, l.from_sight, l.to_sight
    FROM kb_sight_links l JOIN grp ON grp.id = l.group_id
    CROSS JOIN LATERAL (VALUES (l.from_sight, 1), (l.to_sight, 2)) AS e(sn, side)
    WHERE l.status = 'approved' AND e.sn NOT IN (SELECT gid FROM g8)
  ),
  firsts AS (
    SELECT DISTINCT ON (e.sn) e.sn, e.group_id, e.link_id, e.side,
           'SIGHT LINK (group ' || e.group_id || ', link ' || e.link_id || ': S-' || e.from_sight || ' ' || e.relation || ' S-' || e.to_sight || ')' AS note
    FROM ends e ORDER BY e.sn, e.group_id, e.link_id, e.side
  ),
  rws AS (
    SELECT s.sight_number AS sid, ('SIGHT/'||coalesce(s.status,'?'))::text AS st,
           coalesce(s.layer_status,'L3') AS ly, s.primary_passage AS pa,
           (coalesce(s.title,'')||' — '||coalesce(s.summary,''))::text AS ct, f.note,
           row_number() OVER (ORDER BY f.group_id, f.link_id, f.side) AS k
    FROM firsts f JOIN kb_sights s ON s.sight_number = f.sn AND coalesce(s.production_safe, true)
  ),
  pick(k, n, used, inc) AS (
    SELECT 0::bigint, 0, 0, false
    UNION ALL
    SELECT r.k,
           CASE WHEN p.n < c.cs AND p.used + length(r.ct) <= c.cc THEN p.n + 1 ELSE p.n END,
           CASE WHEN p.n < c.cs AND p.used + length(r.ct) <= c.cc THEN p.used + length(r.ct) ELSE p.used END,
           (p.n < c.cs AND p.used + length(r.ct) <= c.cc)
    FROM pick p JOIN rws r ON r.k = p.k + 1 CROSS JOIN caps c
  )
  SELECT r.sid, r.st, r.ly, r.pa, r.ct, 'SIGHT'::text, r.note
  FROM rws r JOIN pick p ON p.k = r.k AND p.inc
  ORDER BY r.k;
$function$
