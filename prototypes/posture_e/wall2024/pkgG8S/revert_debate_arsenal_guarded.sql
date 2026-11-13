CREATE OR REPLACE FUNCTION public.debate_arsenal_guarded(p_topic text)
 RETURNS TABLE(id integer, status text, layer text, passage_anchor text, conclusion_text text, kind text, link_note text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH words AS (
    SELECT DISTINCT lower(w) AS w FROM regexp_split_to_table(coalesce(p_topic,''), '[^A-Za-z]+') AS w WHERE length(w) > 3
  ),
  gs AS (
    SELECT g.guard_num, u.sn, u.ord
    FROM guard_served_sets g CROSS JOIN LATERAL unnest(g.sight_numbers) WITH ORDINALITY AS u(sn, ord)
    WHERE g.active AND EXISTS (SELECT 1 FROM unnest(g.trigger_terms) t WHERE lower(t) IN (SELECT w FROM words))
  ),
  gr AS (
    SELECT DISTINCT ON (s.sight_number) s.sight_number AS id, ('SIGHT/'||coalesce(s.status,'?'))::text AS status,
           coalesce(s.layer_status,'L3') AS layer, s.primary_passage AS passage_anchor,
           (coalesce(s.title,'')||' — '||coalesce(s.summary,''))::text AS conclusion_text,
           ('GUARD SET (DG-'||gs.guard_num||')')::text AS link_note, gs.guard_num, gs.ord
    FROM gs JOIN kb_sights s ON s.sight_number = gs.sn AND coalesce(s.production_safe, true)
    ORDER BY s.sight_number, gs.guard_num, gs.ord
  ),
  g8 AS (SELECT * FROM gr ORDER BY guard_num, ord LIMIT 11),
  sl AS (
    SELECT x.id, x.status, x.layer, x.passage_anchor, x.conclusion_text, x.kind, x.link_note, x.ord
    FROM debate_sight_links(p_topic) WITH ORDINALITY AS x(id, status, layer, passage_anchor, conclusion_text, kind, link_note, ord)
    WHERE x.id NOT IN (SELECT id FROM g8)
  ),
  out AS (
    SELECT g8.id, g8.status, g8.layer, g8.passage_anchor, g8.conclusion_text, 'SIGHT'::text AS kind, g8.link_note,
           0 AS sec, row_number() OVER (ORDER BY g8.guard_num, g8.ord) AS k2
    FROM g8
    UNION ALL
    SELECT sl.id, sl.status, sl.layer, sl.passage_anchor, sl.conclusion_text, sl.kind, sl.link_note,
           1, sl.ord
    FROM sl
    UNION ALL
    SELECT l.id, l.status, l.layer, l.passage_anchor, l.conclusion_text, l.kind, l.link_note,
           2, l.ord
    FROM debate_arsenal_linked(p_topic) WITH ORDINALITY AS l(id, status, layer, passage_anchor, conclusion_text, kind, link_note, ord)
    WHERE NOT (l.kind = 'SIGHT' AND (l.id IN (SELECT id FROM g8) OR l.id IN (SELECT id FROM sl)))
  )
  SELECT id, status, layer, passage_anchor, conclusion_text, kind, link_note FROM out ORDER BY sec, k2;
$function$
