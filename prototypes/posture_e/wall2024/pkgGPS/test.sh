#!/bin/bash
# pkgGPS local tests (PostgreSQL 16, throwaway server). usage: bash test.sh   (PSQL env overrides the connection)
set -u
P=${PSQL:-"psql -h /tmp/pgt_w2 -p 55432 -U postgres -q -At -v ON_ERROR_STOP=1"}
D=$(dirname "$0"); pass=0; fail=0
ok(){ if [ "$2" = "$3" ]; then pass=$((pass+1)); echo "PASS $1 -> $2"; else fail=$((fail+1)); echo "FAIL $1 -> got [$2] want [$3]"; fi; }
$P -c "drop database if exists gps_t" -d postgres; $P -c "create database gps_t" -d postgres
Q="$P -d gps_t"
$Q -f $D/schema.sql
$Q -f $D/old_function.sql
$Q -c "alter function get_pending_snapshots(integer) rename to gps_old"
$Q -f $D/ddl_A_function.sql
# old function with a 2 s pause between its SELECT and its UPDATE (instrumented copy, used only to open the gap a concurrent commit can fall into)
sed -e 's/get_pending_snapshots/gps_old_pause/' -e 's/^  -- Mark them as exported/  PERFORM pg_sleep(2);/' $D/old_function.sql | $Q
# live-like data: one tie group of 1,084 rows, 300 groups of 2 to 40, 500 singletons
seed(){ $Q -c "truncate table_snapshot_queue;
insert into table_snapshot_queue select g, 'debate_results', 'INSERT', jsonb_build_object('n',g), timestamptz '2026-11-09 14:59', null, 'pending', 'w' from generate_series(1,1084) g;
insert into table_snapshot_queue select 1084+g, 'session_log', 'UPDATE', jsonb_build_object('n',g), timestamptz '2026-11-09 15:00' + ((g % 300) || ' min')::interval, null, 'pending', 'w' from generate_series(1,6000) g where g % 300 < 300 and random() < 0.6 or g <= 300;
insert into table_snapshot_queue select 8000+g, 'audit_log', 'INSERT', '{}', timestamptz '2026-11-10 00:00' + (g || ' s')::interval, null, 'pending', 'w' from generate_series(1,500) g;
-- shuffle physical order so heap order is not id order
create temp table s as select * from table_snapshot_queue order by random(); truncate table_snapshot_queue; insert into table_snapshot_queue select * from s;"; }
seed
N=$($Q -c "select count(*) from table_snapshot_queue")
G=$($Q -c "select count(*)||' groups, largest '||max(c) from (select count(*) c from table_snapshot_queue group by triggered_at having count(*)>1) x")
echo "seed: $N rows, ties: $G"
# 1. drain with the new function, 100 per call: per call returned set = set marked in that call; overall each row once
$Q -c "create table got(call int, pos int, id int); create table bad(call int);"
$Q <<'SQL'
do $$ declare c int := 0; r jsonb; ret int[]; mk int[]; begin
  loop
    c := c + 1;
    r := get_pending_snapshots(100);
    exit when jsonb_array_length(r) = 0;
    select array_agg((e->>'id')::int order by (e->>'id')::int) into ret from jsonb_array_elements(r) e;
    select array_agg(id order by id) into mk from table_snapshot_queue where status = 'exported' and actor = 'w';
    if ret is distinct from mk then insert into bad values (c); end if;
    insert into got select c, (e.o)::int, (e.v->>'id')::int from jsonb_array_elements(r) with ordinality e(v,o);
    update table_snapshot_queue set actor = 'done' where status = 'exported' and actor = 'w';
  end loop; end $$;
SQL
ok "new: per call, returned ids = ids marked in that call" "$($Q -c 'select count(*) from bad')" 0
ok "new: drain returns every row exactly once" "$($Q -c "select count(*)||'/'||count(distinct id) from got")" "$N/$N"
ok "new: nothing left pending" "$($Q -c "select count(*) from table_snapshot_queue where status='pending'")" 0
ok "new: calls of 100" "$($Q -c 'select max(call) from got')" "$(( (N+99)/100 ))"
ok "new: order within a call is triggered_at then id" "$($Q -c "select count(*) from (select g.call, g.pos, row_number() over (partition by g.call order by q.triggered_at, q.id) rn from got g join table_snapshot_queue q using(id)) x where pos <> rn")" 0
# 2. shape: keys and values the same as the old function on data with no ties at the edge
seed
$Q -c "create table a as select get_pending_snapshots(50) j" -c "update table_snapshot_queue set status='pending', exported_at=null" -c "create table b as select gps_old(50) j"
ok "shape: same keys" "$($Q -c "select (select array_agg(distinct k order by k) from a, jsonb_array_elements(a.j) e, jsonb_object_keys(e) k)::text = (select array_agg(distinct k order by k) from b, jsonb_array_elements(b.j) e, jsonb_object_keys(e) k)::text")" t
ok "shape: same 50 rows (batch inside one tie group of 1,084 takes ids 1..50 new; old takes some 50)" "$($Q -c "select jsonb_array_length(j) from a")/$($Q -c "select jsonb_array_length(j) from b")" "50/50"
ok "empty queue returns []" "$($Q -c "update table_snapshot_queue set status='exported'" -c "select get_pending_snapshots(10)::text")" "[]"
# 3. concurrency: two sessions call at once; SKIP LOCKED gives disjoint sets
seed
$Q -c "create table c1(id int); create table c2(id int)"
( $Q -c "begin; insert into c1 select (e->>'id')::int from jsonb_array_elements(get_pending_snapshots(500)) e; select pg_sleep(2); commit;" ) &
sleep 0.5
$Q -c "insert into c2 select (e->>'id')::int from jsonb_array_elements(get_pending_snapshots(500)) e"
wait
ok "concurrent: both got 500" "$($Q -c "select (select count(*) from c1)||'/'||(select count(*) from c2)")" "500/500"
ok "concurrent: no row in both" "$($Q -c 'select count(*) from c1 join c2 using(id)')" 0
ok "concurrent: marked = returned" "$($Q -c "select count(*) from table_snapshot_queue where status='exported'")" 1000
# 4. the gap in the old function: a row committed between its SELECT and its UPDATE with an earlier triggered_at
for f in gps_old_pause get_pending_snapshots; do
  $Q -c "truncate table_snapshot_queue; drop table if exists r; create table r(id int);
    insert into table_snapshot_queue select g,'t','I','{}', timestamptz '2026-11-13 10:00' + (g||' s')::interval, null,'pending','w' from generate_series(1,10) g;"
  ( $Q -c "insert into r select (e->>'id')::int from jsonb_array_elements($f(5)) e" ) &
  sleep 0.7
  $Q -c "insert into table_snapshot_queue values (100,'t','I','{}', timestamptz '2026-11-13 09:00', null,'pending','late commit')"
  wait
  M=$($Q -c "select count(*) from table_snapshot_queue q where status='exported' and not exists (select 1 from r where r.id=q.id)")
  L=$($Q -c "select count(*) from r join table_snapshot_queue q using(id) where q.status='pending'")
  echo "  $f: marked but not returned $M; returned but left pending $L"
  if [ $f = gps_old_pause ]; then ok "old (2 s pause): late row is marked exported without being returned (lost)" "$M/$L" "1/1"; else ok "new: same timing, marked = returned" "$M/$L" "0/0"; fi
done

# 5. the old function without a pause, same tie drain: does its returned set differ from its marked set here? (reported, not asserted)
seed
$Q <<'SQL'
create table oldbad(call int, ret int, mk int);
do $$ declare c int := 0; r jsonb; ret int[]; mk int[]; begin
  loop c := c + 1; r := gps_old(100); exit when jsonb_array_length(r) = 0;
    select array_agg((e->>'id')::int order by (e->>'id')::int) into ret from jsonb_array_elements(r) e;
    select array_agg(id order by id) into mk from table_snapshot_queue where status = 'exported' and actor = 'w';
    if ret is distinct from mk then insert into oldbad values (c, cardinality(ret), cardinality(mk)); end if;
    update table_snapshot_queue set actor = 'done' where status = 'exported' and actor = 'w';
  end loop; end $$;
SQL
echo "old function, no pause, tie drain: calls where returned <> marked: $($Q -c 'select count(*) from oldbad') (reported only)"
echo; echo "$pass pass, $fail fail"
