-- same CTEs as export_lines.sql, last line replaced by:
SELECT id, md5(string_agg(n::text||E'\t'||ln, E'\n' ORDER BY n)) h, count(*) k FROM c GROUP BY id ORDER BY id;
