with v(i,d,c,q,lk) as (values
(4,'c70883f8-45ba-4845-a66b-9be12cee74a9','claude_r2','It fits the link: the therefore connects back','D4'),
(13,'45f53596-64dd-4632-bde4-2270ed6fd8dd','defender_r4','knew is the union word, till bounds the not-k','D5'),
(20,'45f53596-64dd-4632-bde4-2270ed6fd8dd','engine_r3','Where the LORD gave conception, the husband s',''),
(24,'45f53596-64dd-4632-bde4-2270ed6fd8dd','engine_r3','Where the LORD gave conception, the husband s','D4'),
(30,'97ae3ffd-ba5f-4d6f-b74d-ed0eba9fb5b4','defender_r4','It fits D5: finding before taking, union with','D5'),
(42,'b23a3783-a618-4b2f-a1fb-42ed4d459d2b','engine_r3','The plucked signet is set on Zerubbabel son o','D1'),
(53,'b23a3783-a618-4b2f-a1fb-42ed4d459d2b','defender_r4','fruit of loins according to the flesh states ',''),
(54,'b23a3783-a618-4b2f-a1fb-42ed4d459d2b','defender_r4','Matthew applies the saying to this birth; alm','D3'),
(56,'b23a3783-a618-4b2f-a1fb-42ed4d459d2b','defender_r4','come upon is power for witness, overshadow is','D4'),
(58,'b23a3783-a618-4b2f-a1fb-42ed4d459d2b','defender_r4','the canon''s stated means of begetting is know','D5'),
(91,'b038fcf4-fee0-4b5c-a2b0-acd82747a57f','engine_r3','Luke 3:23 as was supposed stands with Mary''s ','D2'),
(110,'f333ef24-cf07-43c7-9ea7-80d98902bb56','defender_r4','The line continues by begetting, and the curs','D1'),
(107,'f333ef24-cf07-43c7-9ea7-80d98902bb56','defender_r4','the withholding runs from the taking to the b','D5'),
(108,'f333ef24-cf07-43c7-9ea7-80d98902bb56','defender_r4','the withholding runs from the taking to the b','D5'),
(118,'f333ef24-cf07-43c7-9ea7-80d98902bb56','defender_r4','The finding before the taking places the find','D5'),
(119,'f333ef24-cf07-43c7-9ea7-80d98902bb56','defender_r4','Joseph knew Mary his wife within the espousal','D5')
),
rt as (select v.*, case v.c when 'claude_r2' then r.claude_r2 when 'engine_r3' then r.engine_r3 else r.defender_r4 end t from v join debate_results r on r.id::text=v.d),
ln as (select rt.i, rt.q, rt.lk, x.l, x.n, (x.l ~ E'^\\s*(\\*\\*|#|D\\d+\\s*[:.]|LINK\\s+\\d+|ANSWER:|\\d+\\.\\s)') hd from rt, regexp_split_to_table(rt.t, E'\n') with ordinality x(l,n)),
f as (select i, min(n) fn from ln where position(q in l)>0 group by i),
b as (select ln.i, f.fn,
  (select max(n) from ln l2 where l2.i=ln.i and l2.hd and l2.n<=f.fn) a0,
  (select min(n) from ln l3 where l3.i=ln.i and l3.hd and l3.n>f.fn) b0
  from (select distinct i from ln) ln left join f on f.i=ln.i)
select b.i, b.fn, b.a0, b.b0,
 (select string_agg(distinct m[1], '; ') from ln l4, regexp_matches(l4.l, '((?:[1-3] )?[A-Z][a-z]+ \d+:\d+)','g') m where l4.i=b.i and l4.n>=coalesce(b.a0,b.fn) and l4.n<coalesce(b.b0,b.fn+1)) refs,
 (select count(*) from ln l5 where l5.i=b.i and l5.n>=coalesce(b.a0,b.fn) and l5.n<coalesce(b.b0,b.fn+1) and l5.l like '%Matthew 1:24%') m124,
 (select sum(length(l)) from ln l6 where l6.i=b.i and l6.n>=coalesce(b.a0,b.fn) and l6.n<coalesce(b.b0,b.fn+1)) blen
from b order by i;
