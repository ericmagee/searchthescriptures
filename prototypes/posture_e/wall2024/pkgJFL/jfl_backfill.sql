-- pkgJFL backfill (W4, after jfl.sql): the ledger from run 33040 on (the runs W3 graded under the current rules), then the strikes W3's grades name.
INSERT INTO public.judge_fault_ledger(log_id,run,run_token,seat,seat_role,judge_model,fault_kind,item,flagged_line,cure_reason)
SELECT l.id,(regexp_match(l.run_token,'^ODV1-(\d+)-'))[1]::int,l.run_token,l.seat,l.seat_role,public.jfl_model(l.run_token,l.seat,l.judge_model),l.rule,left(l.item,600),left(l.flagged_line,1500),left(l.cure_reason,1500)
FROM public.debate_enforcer_log l WHERE public.jfl_counted(l.kind,l.cure_status,l.seat_role,l.run_token,l.cure_reason) AND (regexp_match(l.run_token,'^ODV1-(\d+)-'))[1]::int>=33040
ON CONFLICT (log_id) DO NOTHING;
-- strikes: engine faults in W3's grade files (each call returns the rows it struck)
SELECT 'w3/grade_33060.md K-S3 sol' s, public.jfl_strike(33060,'sol','K-S3','%','ENGINE FAULT: sol answered NOT HELD correctly (row 7881)','/mnt/project-files/w3/grade_33060.md')
UNION ALL SELECT 'w3/grade_33040.md E-GATE grok G2', public.jfl_strike(33040,'grok','E-GATE','G2%','ENGINE FAULT: verdict read with textOf, not unwrapped, so E-APPLY could not find the flagged line (finding 2)','/mnt/project-files/w3/grade_33040.md')
UNION ALL SELECT 'w3/grade_33083.md K-CMT gemini', public.jfl_strike(33083,'gemini','K-CMT','%','ENGINE FAULT: grouped K-CMT stayed uncured though all 6 K-CMTL lines were CURED (pkgKCMF)','/mnt/project-files/w3/grade_33083.md')
UNION ALL SELECT 'w3/grade_33083.md K-V sol', public.jfl_strike(33083,'sol','K-V','%premise 3%','ENGINE FAULT: K-V charged premise 6 VOID to premise 3 (pkgKVP)','/mnt/project-files/w3/grade_33083.md')
UNION ALL SELECT 'w3/grade_33107.md K-V chatgpt', public.jfl_strike(33107,'chatgpt','K-V','%','ENGINE FAULT: the K-V kind test read "quote" but not "quoted" (pkgKVQ)','/mnt/project-files/w3/grade_33107.md')
UNION ALL SELECT 'w3/grade_33129.md K-V chatgpt', public.jfl_strike(33129,'chatgpt','K-V','%','ENGINE FAULT: "a claim the quoted order does not make" (pkgKVQ)','/mnt/project-files/w3/grade_33129.md')
UNION ALL SELECT 'w3/grade_33129.md K-G4 chatgpt', public.jfl_strike(33129,'chatgpt','K-G4','%D4 vs C6%','ENGINE FAULT: the pkgKGW v2 replay cures the retraction on its verified [CR2] quote (Wall 2592)','/mnt/project-files/w3/grade_33129.md')
UNION ALL SELECT 'w3/grade_33129.md K-W chatgpt', public.jfl_strike(33129,'chatgpt','K-W','%','ENGINE FAULT: K-W labels cut inside the reference (pkgKGW)','/mnt/project-files/w3/grade_33129.md')
UNION ALL SELECT 'w3/grade_33149.md K-W chatgpt LINK 5', public.jfl_strike(33149,'chatgpt','K-W','%LINK 5%','ENGINE FAULT: "CONCEDED in that form:" not read (pkgKWC)','/mnt/project-files/w3/grade_33149.md')
UNION ALL SELECT 'w3/grade_33149.md E-UNG chatgpt', public.jfl_strike(33149,'chatgpt','E-UNG','%','ENGINE FAULT: pkgUND read the premise position as the link (pkgUNL)','/mnt/project-files/w3/grade_33149.md')
UNION ALL SELECT 'w3/grade_33149.md E-UNG sol', public.jfl_strike(33149,'sol','E-UNG','%','ENGINE FAULT: pkgUND read the premise position as the link (pkgUNL)','/mnt/project-files/w3/grade_33149.md')
UNION ALL SELECT 'w3/grade_33160.md E-GATE gemini', public.jfl_strike(33160,'gemini','E-GATE','%','ENGINE FAULT: the apply step refused E-UNG answers with a placeholder line (pkgUAP)','/mnt/project-files/w3/grade_33160.md')
UNION ALL SELECT 'w3/grade_33160.md K-V chatgpt', public.jfl_strike(33160,'chatgpt','K-V','%premise 5%','ENGINE FAULT: charge words with an embedded quote (pkgKVE)','/mnt/project-files/w3/grade_33160.md')
UNION ALL SELECT 'w3/grade_33160.md K-W sol', public.jfl_strike(33160,'sol','K-W','%','ENGINE FAULT: "CONCEDED as to ..." not read (pkgKWA)','/mnt/project-files/w3/grade_33160.md');
