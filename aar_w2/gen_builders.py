import json
C='session_01H1X3APzb2DidJoZ9Avizjn'
B=[ # snapshot id, ask/rev, [(seat, wall_id, what)]
(3,'484 rev 0',[('W4',9639,'built build484.md 57732429'),('W4',9665,'wrote 484 on its card')]),
(4,'485 rev 0',[('W4',9657,'built 485 targets ed2f37f8 and 436d1db0'),('W4',9665,'rebased 485 targets c6541680 and 32153f8d'),('W4',9672,'wrote 485 on its card')]),
(5,'483 rev 2',[('W2',9607,'built step483.sql ad028df9'),('W4',9679,'wrote 483 on its card')]),
(6,'481 rev 0',[('W2',9580,'built step481.sql 6275be56'),('W4',9681,'wrote 481 on its card')]),
(7,'486 rev 1',[('W4',9685,'built target_engine_486.json rev 0'),('W4',9694,'rebuilt rev 1 cdbaf7e9'),('W4',9701,'wrote 486 on its card')]),
(8,'487 rev 1',[('W4',9685,'built 487 rev 0 and step487_row.sql f3c17684'),('W4',9694,'rebuilt rev 1 32bf6cba'),('W4',9701,'rebased 93fe9adc'),('W4',9709,'wrote 487 on its card')]),
(9,'482 rev 4',[('W1',9699,'built build482.sql 062698a7 and odv1.js 6944e18b'),('W4',9719,'wrote 482 rev 4 on its card')]),
(10,'482 rev 5',[('W1',9725,'built delta482r5.sql f3b88394'),('W4',9811,'wrote 482 rev 5 on its card')]),
(11,'488 rev 1',[('W4',9690,'built step488.sql 5fe292f1'),('W4',9701,'rev 1'),('W4',9799,'wrote 488 on its card')]),
(12,'489 rev 1',[('W2',9687,'built step489.sql rev 0 6b24a3a7'),('W2',9692,'rebuilt step489.sql rev 1 0fd91b1c'),('W4',9802,'wrote 489 on its card')]),
(13,'490 rev 1',[('W4',9724,'built target_engine_490.json c3a1a1c9'),('W4',9814,'wrote 490 on its card')]),
(14,'491 rev 3',[('W2',9729,'built step491.sql 7074eb34'),('W4',9818,'wrote 491 on its card')]),
(15,'492 rev 2',[('W2',9754,'built step492.sql 133ad316'),('W4',9831,'wrote 492 on its card')]),
(16,'494 A1',[('W4',9835,'built target_engine_494a1.json 6eac56a9'),('W4',9837,'wrote 494 A1 on its card')]),
(17,'495 rev 2',[('W3',9773,'wrote plan495.md dee5adcf, the written md5'),('W4',9821,'wrote 495 on its card')]),
(18,'496 rev 1',[('W2',9867,'wrote plan496.md a9029c31, the written md5'),('W4',9873,'wrote 496 on its card')]),
(19,'493 rev 8',[('W4',9893,'built step493.sql 2769dff6'),('W4',9902,'wrote 493 on its card')]),
]
out=["-- ASK 498 step 7: builder rows for snapshot rows 3 to 19, rev 0 (W2 draft for the coordinator; run once from seat 36, no card).",
"-- Builder seats: every seat that built or rebased any part of what was written, plus W4 for each engine and DB write on its cards (plan498 rev 3 section 4). Each source is that seat's own Wall post.",
"BEGIN;",f"SET LOCAL truth.session_id = '{C}';"]
for sid,label,src in B:
    seats=[]
    for s,_,_ in src:
        if s not in seats: seats.append(s)
    sj=json.dumps([{"seat":s,"wall_id":w,"what":t} for s,w,t in src])
    assert '$j$' not in sj
    arr="ARRAY["+",".join("'%s'"%s for s in seats)+"]::text[]"
    out.append(f"INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by) VALUES ({sid}, NULL, {arr}, $j${sj}$j$::jsonb, '{C}'); -- ASK {label}")
out.append("SELECT id, snapshot_id, builder_seats FROM public.ask_aar_builders ORDER BY id;")
out.append("SELECT snapshot_id, md5, pass_seats, proof_seats, n, ok, detail FROM public.ask_aar_grades_check() ORDER BY snapshot_id, md5;")
out.append("COMMIT;")
open('/mnt/project-files/aar/w2/aar_builders_insert_1119.sql','w').write("\n".join(out)+"\n")
