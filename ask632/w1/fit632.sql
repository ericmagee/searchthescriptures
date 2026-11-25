-- ASK 632 evidence (W1, read-only): which reading of OpenRouter's cache fields does the billed cost of google/gemini-3.8-flash fit?
-- Prices solved from stored entries: input 0.75/M, cache read 0.075/M, cache write 1/24 per M, output 3.75/M.
with e as (select (x->>'i')::numeric i, (x->>'cr')::numeric cr, coalesce((x->>'w5')::numeric,0) w, (x->>'o')::numeric o, (x->>'b')::numeric b
  from debate_results r, jsonb_array_elements(case when jsonb_typeof(r.call_costs)='array' then r.call_costs else '[]'::jsonb end) x
  where x->>'m'='google/gemini-3.8-flash'),
f as (select *, (i+w)*7.5e-7 + cr*7.5e-8 + w*(1.0/24000000) + o*3.75e-6 ovl,
               greatest(i,0)*7.5e-7 + cr*7.5e-8 + w*(1.0/24000000) + o*3.75e-6 dis from e)
select count(*) n, count(*) filter (where w=0) nonov, count(*) filter (where w=0 and abs(dis-b)<1e-9) nonov_fit,
       count(*) filter (where w>0) ov, count(*) filter (where w>0 and abs(ovl-b)<1e-9) ov_fit_overlap,
       count(*) filter (where w>0 and abs(dis-b)<1e-9) ov_fit_disjoint from f;
-- Result 11-25 05:5x CST: n 111; nonov 54, fit 54; ov 57, overlap fit 57, disjoint fit 0.
