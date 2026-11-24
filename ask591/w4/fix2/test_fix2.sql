-- ASK 591 fix 2 test, to run in ONE call. Loads the same safeupdate guard the dashboard's role runs with,
-- then: (1) a bare DELETE on a temp table must fail with 21000; (2) DELETE ... WHERE true must pass.
LOAD 'safeupdate';
CREATE TEMP TABLE jo_t(x int); INSERT INTO jo_t VALUES (1),(2);
CREATE TEMP TABLE r(k text, v text);
DO $t$ BEGIN
  BEGIN DELETE FROM jo_t; INSERT INTO r VALUES ('bare','RAN (guard not loaded)'); EXCEPTION WHEN others THEN INSERT INTO r VALUES ('bare', SQLSTATE||' '||SQLERRM); END;
  BEGIN DELETE FROM jo_t WHERE true; INSERT INTO r VALUES ('where_true','ok, rows left '||(SELECT count(*) FROM jo_t)); EXCEPTION WHEN others THEN INSERT INTO r VALUES ('where_true', SQLSTATE||' '||SQLERRM); END;
END $t$;
SELECT * FROM r;
