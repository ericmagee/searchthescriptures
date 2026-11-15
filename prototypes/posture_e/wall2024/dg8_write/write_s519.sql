-- ASK (coordinator to number) kb_sights id 555 (S-519 GUARD SET, DG-8 served copy): W3 Edit 1 (Wall 6754). Guarded on md5 4c8b77879b7697cd58384f436380c5d1 (2,552). Target md5 cea0bca2412495b07f532fd009e5c468 (2,615).
SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
update kb_sights set summary = replace(summary,
 $a$husband and wife in law from the espousal ("Joseph her husband," Matt 1:19; "Mary thy wife," Matt 1:20)$a$,
 $a$husband and wife from the espousal, as the rows themselves name them ("Joseph her husband," Matt 1:19; "Mary thy wife," Matt 1:20; "Mary his espoused wife," Luke 2:5)$a$), updated_at = now()
where id=555 and md5(summary)='4c8b77879b7697cd58384f436380c5d1';
select md5(summary), length(summary), updated_at from kb_sights where id=555;
-- REVERT: same replace with the two literals swapped, guarded on md5 cea0bca2412495b07f532fd009e5c468.
