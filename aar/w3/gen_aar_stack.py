import json
S='session_01H1X3ANeXjt6pnw4fs6Wxr4'
def G(seat,verdict,wid,md5,norm='PASS'): return {"seat":seat,"verdict":verdict,"wall_id":wid,"md5_graded":md5,"verdict_norm":norm}
NR="not yet: no graded run check on the Wall"
R=[]

# Placeholders {{...}} are filled from each write post and its readback before this is run. Times in CST.
def row(ask,rev,title,obj,src,words,plan,build,revert,grades,md5w,objects,tests,run,manual,sources,builders):
    R.append(dict(ask=ask,rev=rev,prior=None,title=title,objective=obj,met='in part',
     reason="Written {{%d_WRITE_CST}} 11-23 (card pressed {{%d_PRESS_CST}}) on the operator's card \"{{%d_CARD}}\" (W4 {{%d_WRITE_WALL}}; audit {{%d_AUDIT}}). Read back {{%d_RB}}. Not yet shown by a run."%((ask,)*6),
     src=src,words=json.dumps(words,ensure_ascii=False),card={"answer":"{{%d_CARD}}"%ask,"thread":"W4","press_time":"{{%d_PRESS_CST}}"%ask,"source":"Wall {{%d_WRITE_WALL}}; the write landed at {{%d_WRITE_CST}} (audit {{%d_AUDIT}})"%((ask,)*3)},owner='W3',
     plan=plan,build=build,revert=revert,grades=grades,md5w=md5w,audit="{{%d_AUDIT_LIST}}"%ask,objects=objects,tests=tests,
     readbacks=[{"seat":"{{%d_RB_SEAT}}"%ask,"result":"{{%d_RB_RESULT}}"%ask,"wall_id":"{{%d_RB_WALL}}"%ask}],run=run,manuals={"engine_manual":manual,"op_doc":"not needed"},
     status='read back',sources=sources,builders=builders))
NR={"case":"not yet: no graded run check on the Wall"}
row(517,'A1','The standing follows the count only; K-G3 retired; win tests read broken lines',
 "A side's standing is decided by its own count only (engine_manual section 8 STANDINGS); the operator on 41117: \"by rulebook definition, L=6, c=0 is SELF-SUPPORTED, never PROP-DEPENDENT.\" The win tests read the broken lines directly so no side wins with its own link broken (the operator, 22:26 CST 11-19: \"We can't have broken links 🔗 and still win\"). Expected outcome effect: none. (ask517/w3/plan517.md rev 5)",
 '10381, 10414, 10415, 10418, 10422, 10435, 10441, 10473, 10475','"Four Remaining Bugs ... Bug 1"; "yes" 02:02 CST 11-23',
 {"md5":"23a73d9e","path":"ask517/w3/plan517.md","commit":"d6904e24 (rev 4); rev 5 61510f35"},
 [{"md5":"11a272f4","path":"ask517/w1/BUILD517.md","commit":"360bb005"},{"md5":"{{517_TARGET_ENGINE}}","path":"ask517/w1/target_engine_517.json"},{"md5":"{{517_TARGET_CHILD}}","path":"ask517/w1/target_child_517.json"},{"md5":"cbbe66de","path":"ask517/w1/step517_s6.sql"}],
 {"md5":"82fcafab","path":"ask517/w1/revert517_s6.sql","workflows":"{{517_REVERT_FILES}}"},
 [G("W4","PASS (plan rev 3)",10414,"3276053d"),G("W2","PASS with C-c (plan rev 3)",10415,"3276053d"),G("W2","PASS (plan rev 4)",10422,"c4221d8e"),G("W2","PASS (build, three limits)",10441,"{{517_TARGET_ENGINE}}"),G("W2","PASS (build, child target)",10441,"{{517_TARGET_CHILD}}"),G("W2","PASS (build, S6 step)",10441,"cbbe66de")],
 ["{{517_TARGET_ENGINE}}","{{517_TARGET_CHILD}}","cbbe66de"],
 [{"kind":"n8n workflow","name":"engine moMxiV4Irg1uRBZN","before":"0427ec91","after":"{{517_ENGINE_AFTER}}"},{"kind":"n8n workflow","name":"child MqQHRl7mQQ0z8QdT","before":"47df6892","after":"{{517_CHILD_AFTER}}"},{"kind":"function","name":"public.derive_debate_outcome(uuid)","before":"2a853df6","after":"{{517_FN_AFTER}}"}],
 [{"file":"ask517/w1/test517_s6_rollback.sql","md5":"a4b1df76","wall_id":10435},{"file":"ask517/w1/test517_s6_knowngood.sql","md5":"0d091211","wall_id":10435},{"file":"ask517/w1/replay517c2.js","wall_id":10473}],
 NR,"{{517_EM_VERSION}}",[10381,10414,10415,10418,10422,10435,10441,10446,10447,10473,10475,"{{517_WRITE_WALL}}","{{517_RB_WALL}}"],
 (['W1','W4'],[{"seat":"W1","what":"built ASK 517","wall_id":10435},{"seat":"W4","what":"wrote ASK 517 on its card","wall_id":"{{517_WRITE_WALL}}"}]))
row(519,'A1','K-W and K-S3 ask only about footing',
 "K-W and K-S3 are raised only on a sentence that can give up a side's own footing: a withdrawal-class sentence, or a grant-class sentence that names a link, premise or press. Expected effect: K-W and K-S3 cure items fall from 51 to about 13 on 41117, with no real reply dropped. (ask519/w3/plan519.md rev 2)",
 '10381, 10416, 10420, 10425, 10426, 10474, 10476','"Four Remaining Bugs ... Bug 3"; "yes" 02:02 CST 11-23',
 {"md5":"11628857","path":"ask519/w3/plan519.md","commit":"bb58e8b9"},
 [{"md5":"078884f1","path":"ask519/w4/BUILD519.md","commit":"fa5ac288"},{"md5":"{{519_TARGET_ENGINE}}","path":"{{519_TARGET_ENGINE_PATH}}"},{"md5":"{{519_TARGET_CHILD}}","path":"{{519_TARGET_CHILD_PATH}}"}],
 {"path":"{{519_REVERT}}"},
 [G("W2","PASS with C-d (plan rev 1)",10420,"63abeb6b"),G("W2","PASS (plan rev 2)",10426,"11628857"),G("W2","PASS (build)",10476,"{{519_TARGET_ENGINE}}"),G("W2","PASS (build, child target)",10476,"{{519_TARGET_CHILD}}")],
 ["{{519_TARGET_ENGINE}}","{{519_TARGET_CHILD}}"],
 [{"kind":"n8n workflow","name":"engine moMxiV4Irg1uRBZN","before":"{{519_ENGINE_BEFORE}}","after":"{{519_ENGINE_AFTER}}"},{"kind":"n8n workflow","name":"child MqQHRl7mQQ0z8QdT","before":"{{519_CHILD_BEFORE}}","after":"{{519_CHILD_AFTER}}"}],
 [{"file":"ask519/w4/BUILD519.md","md5":"078884f1","wall_id":10474}],NR,"{{519_EM_VERSION}}",
 [10381,10416,10420,10425,10426,10474,10476,"{{519_WRITE_WALL}}","{{519_RB_WALL}}"],(['W4'],[{"seat":"W4","what":"built ASK 519","wall_id":10474},{"seat":"W4","what":"wrote ASK 519 on its card","wall_id":"{{519_WRITE_WALL}}"}]))
row(520,'A1','K-UNX not raised on a press the judge grades MISSES',
 "K-UNX is not raised on a counted premise when the judge's own ANSWER CHECK grades a press of that premise, from the pressing side's round 2 or 3, MISSES or FAILS (Commitment 5, ruling 372). Expected effect on 41117: Sol 6.1 premises 4 and 5 and Terra premises 1 and 5 are not raised. (ask520/w3/plan520.md rev 3)",
 '10381, 10429, 10430, 10432, 10477, 10478, 10479, 10483','"Four Remaining Bugs ... Bug 4"; "yes" 02:02 CST 11-23',
 {"md5":"76f7bdd5","path":"ask520/w3/plan520.md","commit":"e427cb92"},
 [{"md5":"739ad6b7","path":"ask520/w4/FINDING520.md","commit":"410bcd9d"},{"md5":"1ca93bdf","path":"patch520b_on519.py"},{"md5":"962f4571","path":"{{520_TARGET_ENGINE_PATH}}"},{"md5":"{{520_TARGET_CHILD}}","path":"{{520_TARGET_CHILD_PATH}}"}],
 {"path":"{{520_REVERT}}"},
 [G("W2","PASS with C-e (plan rev 1)",10430,"48eef61f"),G("W2","PASS (plan rev 2)","{{520_REV2_PASS_WALL}}","107725bf"),G("W2","PASS (plan rev 3 with variant B build, stacked on 519)",10483,"962f4571"),G("W2","PASS (child target)",10483,"{{520_TARGET_CHILD}}")],
 ["962f4571","{{520_TARGET_CHILD}}"],
 [{"kind":"n8n workflow","name":"engine moMxiV4Irg1uRBZN","before":"{{520_ENGINE_BEFORE}}","after":"{{520_ENGINE_AFTER}}"},{"kind":"n8n workflow","name":"child MqQHRl7mQQ0z8QdT","before":"{{520_CHILD_BEFORE}}","after":"{{520_CHILD_AFTER}}"}],
 [{"file":"chainG520b_41117.txt","wall_id":10479}],NR,"{{520_EM_VERSION}}",
 [10381,10429,10430,10432,10477,10478,10479,10483,"{{520_WRITE_WALL}}","{{520_RB_WALL}}"],(['W4'],[{"seat":"W4","what":"built ASK 520 (variant B)","wall_id":10477},{"seat":"W4","what":"wrote ASK 520 on its card","wall_id":"{{520_WRITE_WALL}}"}]))
# 518 and 502 A1 rows: added when 518 is released to continue and when 502 A1 is written; same row() form.
def q(s): return 'NULL' if s is None else '$t$'+s+'$t$'
def j(o): return 'NULL' if o is None else q(json.dumps(o,ensure_ascii=False))+'::jsonb'
out=["-- ASK AAR rows for the write stack (517, 519, 520; 518 and 502 A1 to follow), DRAFT rev 0 (W3, 2026-11-23). Placeholders {{...}} are filled from each write and readback. Times in CST. NOT RUN.",

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
"-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 76;"]
open('/mnt/project-files/aar/w3/aar_rows_stack_draft.sql','w').write('\n'.join(out)+'\n')
print(len(R))
