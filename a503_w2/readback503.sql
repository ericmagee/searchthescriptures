-- ASK 503 DB readback (W2, seat 32). Read only. Run each query separately after W4 reports the write.
-- Pre-write baseline (18:34:51 CST 11-19): dash_debaters prosrc b6084d5a len 549, row 3 gemini_deb/google/gemini-4-hydrogen;
--   gemini flash active; gemini_deb hydrogen active; max audit_log id 39378; 0 'ASK 503%' audit rows.
-- Simulation: live body with only row 3 'gemini_deb' -> 'gemini' gives md5 c6621b30 = step503_db.sql body (545 chars). One 'gemini_deb' in body.

-- Q1. Function body and attributes. Expect body c6621b30, len 545, no 'gemini_deb', prosecdef false, volatile s, search_path public, pg_temp.
select left(md5(prosrc),8) body_md5, length(prosrc) len, position('gemini_deb' in prosrc)=0 no_deb, prosecdef, provolatile, proconfig
from pg_proc where proname='dash_debaters' and pronamespace='public'::regnamespace;

-- Q2. Rows. Expect 10 rows; row 3 gemini:gemini:google/gemini-3.8-flash:true; rows 1,2,4-10 unchanged from baseline.
select string_agg(ord||':'||key||':'||mc_seat||':'||coalesce(api_model,'-')||':'||active, ' ; ' order by ord) rows, count(*) n from public.dash_debaters();

-- Q3. model_config. Expect gemini flash true 64000 notes 039f0b38 (unchanged); gemini_deb hydrogen active false, 64000, notes b507e9fb (unchanged; step sets only active).
select seat, api_model, active, max_tokens, left(md5(notes),8) notes_md5 from model_config where seat in ('gemini','gemini_deb') order by seat;

-- Q4. Audit. Expect exactly one new row after 39378 for this step: title 'ASK 503 DB: ...', engine W4_2026_11_06, card set (not NONE), session W4's.
select id, session_title, engine, notes, created_at from audit_log where id>39378 order by id;

-- Q5. Scope check. Baseline: gemini_deb and seat 'hydrogen' (google/gemini-4-hydrogen, 65536, active true, notes c59dc02a). The step does not touch seat hydrogen; hydrogen leaves the judge lists in the engine (Init Seats, Accept Build), not in the DB. Expect seat hydrogen unchanged.
select seat, api_model, active, max_tokens, left(md5(notes),8) notes_md5 from model_config where api_model ilike '%hydrogen%' order by seat;
