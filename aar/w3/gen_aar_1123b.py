import json
S='session_01H1X3ANeXjt6pnw4fs6Wxr4'
def G(seat,verdict,wid,md5,norm='PASS'): return {"seat":seat,"verdict":verdict,"wall_id":wid,"md5_graded":md5,"verdict_norm":norm}
NR="not yet: no graded run check on the Wall"
R=[]
R.append(dict(ask=516,rev='A2',prior=None,title='Lower-memory 516: the rounds held once per build',
 objective="Every judge enforcer call carries THE ROUNDS IN FULL, as under 516, without the out-of-memory crash of the two runs on 516. Each Build holds the rounds once; the call bodies carry a one-line placeholder that the 12 HTTP senders fill at send time. Expected effect: every sent body equals the 516 body byte for byte, and the characters held on the 41117 shape fall to at most 515 rev 7's plus 1.7% on the judge path. (ask516/w3/plan516b.md rev 7)",
 met='in part', reason="Written 08:16:51Z 11-23 (card pressed 08:16:08Z) on the operator's card \"Write 516b\" (W4 10407; audit 39669, 39670): engine 31702b15 to 0427ec91, child cd2d84d8 to 47df6892, library e481127ff69347f9. Graded PASS by W3 (10399). Read back CONFIRMED by W2 (10409). Offline: every sent body equals the 516 body; held characters on the judge path 8,039,097 against 8,679,304 under 515 rev 7 and 22,334,418 under 516 (W4 10395). No run has started, so the crash being gone is not shown.",
 src='10382, 10383, 10395, 10399, 10407, 10409', words='"Write 516b"',
 card={"answer":"Write 516b","thread":"W4","press_time":"08:16:08Z","source":"Wall 10407; the write landed at 08:16:51Z (audit 39669 and 39670; W1 10437)"}, owner='W3',
 plan={"md5":"e2e13266","path":"ask516/w3/plan516b.md","commit":"17062b34","wall_id":10382},
 build=[{"md5":"e45ddf24","path":"ask516/w4/b/BUILD516b.md","commit":"56ab34be"},{"md5":"25e1a9f9","path":"ask516/w4/b/target_engine_516b.json"},{"md5":"f361da60","path":"ask516/w4/b/target_child_516b.json"}],
 revert={"md5":"5af56dc6","path":"ask516/w4/b/revert516b.sh","files":{"revert_engine_516b.json":"0a35623d","revert_child_516b.json":"c451c10a"}},
 grades=[G("W2","PASS (plan rev 6 a4dc21f6)",10362,"a4dc21f6"),G("W4","PASS (plan rev 6 a4dc21f6)",10360,"a4dc21f6"),G("W2","PASS with one note (plan rev 7)",10383,"e2e13266"),G("W3","PASS (build e45ddf24; engine target named in the grade)",10399,"25e1a9f9"),G("W3","PASS (build e45ddf24; child target named in the grade)",10399,"f361da60")],
 md5w=['25e1a9f9','f361da60'], audit=[39669,39670],
 objects=[{"kind":"n8n workflow","name":"engine moMxiV4Irg1uRBZN","before":"31702b15","after":"0427ec91 (12 nodes)"},{"kind":"n8n workflow","name":"child MqQHRl7mQQ0z8QdT","before":"cd2d84d8","after":"47df6892 (6 nodes)"}],
 tests=[{"file":"ask516/w4/b/replay516b.js","md5":"4bd62bc8","wall_id":10395},{"file":"ask516/w4/b/checks516b.js","md5":"658ec398","wall_id":10395},{"file":"ask516/w4/b/measure516b_41117.json","md5":"c6c5cd91","wall_id":10395}],
 readbacks=[{"seat":"W2","result":"CONFIRMED: 0 parameter mismatches, engine 12 and child 6 nodes changed as named","wall_id":10409}],
 run={"case":NR}, manuals={"engine_manual":"v232 (417fd55f), card 08:28:25Z W3 thread; readback W2 10431","op_doc":"not needed"},
 status='read back', sources=[10360,10362,10382,10383,10395,10399,10407,10409,10431,10437,"audit 39669","audit 39670"],
 builders=(['W4'],[{"seat":"W4","what":"built ASK 516b","wall_id":10395},{"seat":"W4","what":"wrote ASK 516b on its card","wall_id":10407}])))
R.append(dict(ask=521,rev='A1',prior=None,title='The AAR grade check counts one non-builder PASS',
 objective="ask_aar_grades_check (ASK 498) counts one non-builder PASS seat per written md5 as enough, matching op doc v139 section 29 (operator 02:05 CST 11-23: \"update the manual to just 1 grader.\"). Expected effect: snapshots 12, 61, 63 and 64 turn ok true; 16 and 31 stay ok false. (ask521/w3/plan521.md)",
 met='yes', reason="Written 08:27:42Z 11-23 (card pressed 08:27:12Z) on the operator's card \"Write 521\" (W4 10427; audit 39697): prosrc 2e26db98 to bd213a7c, 3,815 characters. Graded PASS by W2 (plan 10410; build 10421). Read back CONFIRMED by W2 (10428): 55 rows, 53 ok; 16 and 31 not ok with \"no non-builder PASS seat\". Op doc sentence (S2) written as v140 (dbf09693) on the operator's card 08:32:50Z 11-23 in W3's thread; read back CONFIRMED by W2 (10436).",
 src='10408, 10410, 10419, 10421, 10427, 10428', words='"update the manual to just 1 grader."',
 card={"answer":"Write 521","thread":"W4","press_time":"08:27:12Z","source":"Wall 10427; the write landed at 08:27:42Z (audit 39697; W1 10437)"}, owner='W3',
 plan={"md5":"7d2a5c64","path":"ask521/w3/plan521.md","commit":"ad620d15","wall_id":10408},
 build=[{"md5":"3ceedeba","path":"ask521/w4/BUILD521.md","commit":"b3a038c8"},{"md5":"b8c49b3c","path":"ask521/w4/after_ask_aar_grades_check.sql"}],
 revert={"md5":"3229be8d","path":"ask521/w4/before_ask_aar_grades_check.sql"},
 grades=[G("W2","PASS (plan)",10410,"7d2a5c64"),G("W2","PASS (build; deviation on 16 and 31 detail text accepted)",10421,"b8c49b3c")],
 md5w=['b8c49b3c'], audit=[39697],
 objects=[{"kind":"function","name":"public.ask_aar_grades_check()","before":"2e26db98","after":"bd213a7c"}],
 tests=[{"file":"ask521/w4/BUILD521.md","md5":"3ceedeba","wall_id":10419}],
 readbacks=[{"seat":"W2","result":"CONFIRMED: prosrc bd213a7c, attributes equal, 53 of 55 ok","wall_id":10428}],
 run={"case":"not a run path: the evidence is the live output after the write (W2 10428)"}, manuals={"engine_manual":"not needed","op_doc":"v140 (dbf09693), card 08:32:50Z 11-23 W3 thread; readback W2 10436"},
 status='read back', sources=[10408,10410,10419,10421,10427,10428,10431,10436,10437,"audit 39697"],
 builders=(['W4'],[{"seat":"W4","what":"built ASK 521","wall_id":10419},{"seat":"W4","what":"wrote ASK 521 on its card","wall_id":10427}])))
def q(s): return 'NULL' if s is None else '$t$'+s+'$t$'
def j(o): return 'NULL' if o is None else q(json.dumps(o,ensure_ascii=False))+'::jsonb'
out=["-- ASK AAR snapshot rows 11-23 second set, DRAFT rev 2 (W3, 2026-11-23; replaces rev 1 0e3f24f3, kept as aar_rows_1123b_draft_rev1.sql, on W2's C-f (Wall 10436) and W1's C1 (Wall 10437)), same form as aar_rows_1123_draft.sql rev 5. For the coordinator (seat 36) to run once after one non-builder grade (op doc v139). NOT RUN.",
"-- Rows: 516 A2 (516b, written, no run yet) and 521 A1. ASKs 517 to 520 are added as each is written.",
"-- verdict_norm values: PASS, FAIL or FAIL ON FORM only.",
"BEGIN;","SET LOCAL truth.session_id = '%s';"%S]
for r in R:
    out.append("INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES\n(%d, '%s', %s,\n %s,\n '%s', %s,\n '%s', '%s', %s,\n %s::jsonb, %s, '%s',\n %s,\n %s,\n %s,\n %s,\n ARRAY[%s], %s,\n %s,\n %s,\n %s,\n %s,\n %s,\n '%s', %s);"%(
     r['ask'],r['rev'],q(r['title']),q(r['objective']),r['met'],q(r['reason']),r['src'],S,('NULL' if r['prior'] is None else r['prior']),
     q(r['words']),j(r['card']),r['owner'],j(r['plan']),j(r['build']),j(r['revert']),j(r['grades']),
     ','.join("'%s'"%m for m in r['md5w']),j(r['audit']),j(r['objects']),j(r['tests']),j(r['readbacks']),j(r['run']),j(r['manuals']),r['status'],j(r['sources'])))
    bs,bsrc=r['builders']
    out.append("INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)\nSELECT s.id, NULL, ARRAY[%s], %s, '%s' FROM public.ask_aar_snapshots s WHERE s.ask = %d AND s.rev = '%s' AND s.aar_at = now();"%(
     ','.join("'%s'"%b for b in bs), j(bsrc), S, r['ask'], r['rev']))
out+=["COMMIT;","-- Separate calls after COMMIT:",
"-- SELECT id, ask, rev, objective_met, status, md5_match FROM public.ask_aar_snapshots WHERE aar_at > now() - interval '10 minutes' ORDER BY id;",
"-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';",
"-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 67;"]
open('/mnt/project-files/aar/w3/aar_rows_1123b_draft.sql','w').write('\n'.join(out)+'\n')
print(len(R))
