// ASK 420(b) (W1): engine manual readback. Emits one read-only SELECT that applies a pair set to a base version
// and compares the result with a stored version, by md5 and length. A second reader for engine_manual_apply (ASK 421),
// written without it: the pairs are applied here in SQL with replace(), in order, and each must occur exactly once
// in the text as it stands when that pair is applied (the same order rule as engine_manual_apply).
// Usage: node mrb.cjs <base_version> <new_version> <pairs.json> [part]   -> prints the SQL; run it read-only (execute_sql).
// ASK 583 parts mode (W1): with a fourth argument <part> (for example 09.3) the base and the new text are read from
// engine_manual_parts by part and version, and the log rows by version and part. Without it, engine_manual as before.
// pairs.json: [{"old":"...","new":"..."}, ...]  (the form engine_manual_apply takes).
// Output rows: one per pair (step, occurrences when applied, old and new lengths), then RESULT:
//   MATCH when every pair occurs exactly once and the applied text equals the stored new version in md5 and length;
//   otherwise MISMATCH with the reason. Last, the new version's engine_manual_log row(s).
const fs = require('fs');
const [B, N, P, PART] = process.argv.slice(2);
if (!/^\d+$/.test(B || '') || !/^\d+$/.test(N || '') || !P) {
  console.error('usage: node mrb.cjs <base_version> <new_version> <pairs.json> [part]');
  process.exit(2);
}
if (PART !== undefined && !/^\d{2}\.\d+$/.test(PART)) { console.error('part must look like 09.3'); process.exit(2); }
const SRC = PART === undefined ? 'engine_manual where ' : "engine_manual_parts where part='" + PART + "' and ";
const LOGW = 'version=' + N + (PART === undefined ? '' : " and part='" + PART + "'");
const LBL = PART === undefined ? '' : ' part ' + PART;
const pairs = JSON.parse(fs.readFileSync(P, 'utf8'));
if (!Array.isArray(pairs) || !pairs.length || pairs.some(p => typeof p.old !== 'string' || typeof p.new !== 'string' || !p.old.length))
  throw new Error('pairs must be a non-empty array of {old,new} with non-empty old');
const js = JSON.stringify(pairs);
let tag = 'p';
while (js.includes('$' + tag + '$')) tag += 'x';
const Q = '$' + tag + '$';
const sql = [
  'with recursive',
  "pr as (select ord::int ord, e->>'old' o, e->>'new' n from jsonb_array_elements(" + Q + js + Q + '::jsonb) with ordinality t(e,ord)),',
  'b as (select content from ' + SRC + 'version=' + B + ' order by id desc limit 1),',
  's as (select content from ' + SRC + 'version=' + N + ' order by id desc limit 1),',
  'a(i,txt,occ) as (select 0, content, null::int from b',
  " union all select a.i+1, replace(a.txt,pr.o,pr.n), ((length(a.txt)-length(replace(a.txt,pr.o,'')))/length(pr.o))::int from a join pr on pr.ord=a.i+1),",
  'fin as (select txt from a where i=(select count(*) from pr)),',
  'bad as (select count(*) c from a where i>0 and occ<>1)',
  "select step, occurrences, old_len, new_len, detail from (",
  "select a.i k, 'pair '||a.i step, a.occ occurrences, (select length(o) from pr where ord=a.i) old_len, (select length(n) from pr where ord=a.i) new_len, null::text detail from a where a.i>0",
  'union all',
  "select 1000000, 'RESULT', null, null, null,",
  " case when not exists(select 1 from b) then 'MISMATCH: base version " + B + LBL + " not found'",
  "      when not exists(select 1 from s) then 'MISMATCH: version " + N + LBL + " not found'",
  "      when (select c from bad)>0 then 'MISMATCH: '||(select c from bad)||' pair(s) do not occur exactly once ('||(select string_agg(i::text||'='||occ,', ' order by i) from a where i>0 and occ<>1)||')'",
  "      when (select count(*) from fin)=0 then 'MISMATCH: the pairs did not all apply'",
  "      when (select md5(txt) from fin)<>(select md5(content) from s) or (select length(txt) from fin)<>(select length(content) from s) then 'MISMATCH: applied '||(select md5(txt)||' / '||length(txt) from fin)||' vs stored '||(select md5(content)||' / '||length(content) from s)",
  "      else 'MATCH: applied = stored v" + N + LBL + ", md5 '||(select md5(content) from s)||', length '||(select length(content) from s)||'; base v" + B + " md5 '||(select md5(content) from b)||'; pairs '||(select count(*) from pr) end",
  'union all',
  "select 1000001, 'LOG v" + N + "', null, null, null, coalesce((select string_agg(coalesce(entry_date::text,'no date')||' | '||title||' | char_len '||char_len||' | log text length '||length(content), ' || ' order by id) from engine_manual_log where " + LOGW + "),'no log row for v" + N + LBL + "')",
  ') z order by k;',
  ''
].join('\n');
process.stdout.write(sql);
