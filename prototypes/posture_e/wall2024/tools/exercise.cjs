// ASK 417 exercise query emitter. Usage: node exercise.cjs <run_token> [--all]
// Prints one read-only SQL statement. --all ignores live_since (probe check on an older run).
const fs = require('fs');
const reg = JSON.parse(fs.readFileSync((process.env.REG || __dirname + '/../a417_w2/registry.json'), 'utf8'));
const tok = process.argv[2] || '';
const all = process.argv.includes('--all');
if (!/^[A-Za-z0-9-]+$/.test(tok)) { console.error('bad run token'); process.exit(2); }
const q = s => "'" + String(s).replace(/'/g, "''") + "'";
const rows = reg.packages.map((p, i) => {
  const sql = p.probe === 'sql';
  const c = sql ? `(${p.case_sql})` : 'null::boolean';
  const m = sql && p.mark_sql ? `(${p.mark_sql})::bigint` : 'null::bigint';
  return `select ${i} n, ${q(p.ask)} ask, ${q(p.title)} title, ${q(p.live_since)}::timestamptz live_since, ${q(p.probe)} probe, ${sql && p.mark_sql ? 'true' : 'false'} has_mark, ${c} cse, ${m} fired`;
});
const out = `with p as (select ${q(tok)}::text tok, ${all ? 'true' : 'false'} allp),
r as (select * from debate_results where run_token=(select tok from p)),
j as (select j.* from debate_judgments j join r on j.debate_id=r.id),
e as (select * from debate_enforcer_log where run_token=(select tok from p)),
x as (select x.* from debate_errors x, r where x.created_at between r.created_at - interval '3 hours' and r.created_at + interval '10 minutes'),
ev as (
${rows.join('\nunion all\n')}
)
select (select tok from p) run_token, ev.ask, ev.title,
 case when not exists(select 1 from r) then 'NO RUN'
      when not (select allp from p) and (select created_at from r) < ev.live_since then 'NOT LIVE'
      when ev.probe='NOT IN DB' then 'NOT IN DB'
      when ev.probe='NO PROBE' then 'NO PROBE'
      when not ev.cse then 'NO CASE'
      when not ev.has_mark then 'CASE, READ BY HAND'
      when ev.fired > 0 then 'EXERCISED'
      else 'MISSED' end grade,
 ev.cse "case", ev.fired, to_char(ev.live_since at time zone 'UTC','MM-DD HH24:MI"Z"') live_since
from ev order by ev.n;`;
const bad = out.replace(/'(?:[^']|'')*'/g, "''").match(/\b(insert|update|delete|drop|alter|create|truncate|grant|revoke|copy|call|do|perform|set_config|pg_read_file)\b/gi);
if (bad) { console.error('refused: write word in statement: ' + [...new Set(bad)].join(',')); process.exit(3); }
process.stdout.write(out + '\n');
