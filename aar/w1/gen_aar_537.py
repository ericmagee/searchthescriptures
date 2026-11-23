# W1 (seat 34), 2026-11-23. AAR row for ASK 537, in the row() form of gen_aar_1123c.py (W3's form). DRAFT: NOT RUN.
# Sources read by W1's SQL: Wall 10649 to 10659, 10667, 10670, 10686, 10694; audit_log 39977 (10:21:43 CST); disk md5s under /mnt/project-files/ask537/.
import json, hashlib
COORD = '{{COORDINATOR_SESSION}}'
def G(seat, verdict, wid, md5, norm='PASS'): return {"seat": seat, "verdict": verdict, "wall_id": wid, "md5_graded": md5, "verdict_norm": norm}
r = dict(ask=537, rev='A1', title='Oracle text: name a one-verse restriction; restate unanswered questions in the close',
 objective="1. When the opponent restricts an answer to one verse, the Oracle names the restriction, states the complaint and answers the pressed verse from the chain. 2. In its close, the Oracle restates every question it put to the opponent that went unanswered (ruling 10643). (ask537/w3/plan537.md rev 3)",
 met='in part',
 reason="Written 10:21 CST 11-23 (card pressed 10:21 CST) on the operator's card \"Write 537\" (W4 10686; audit 39977, 10:21:43 CST). Read back by W2 at Wall 10694 (CONFIRMED, MATCH). Not yet shown by a run.",
 src='10635, 10643, 10649, 10650, 10651, 10652, 10653, 10654, 10655, 10656, 10658, 10659, 10667, 10670, 10686, 10694',
 words=json.dumps('operator items 1 and 2 (Wall 10635) and his ruling at 10643; "Approve as written" 10:04 CST'),
 card={"answer": "Write 537", "thread": "W4", "press_time": "10:21 CST", "source": "Wall 10686; the write landed at 10:21 CST (audit 39977)"},
 owner='W3',
 plan={"md5": "9fc47743", "path": "ask537/w3/plan537.md", "commit": "78b816a8", "note": "rev 3, final GAP text (10658)"},
 build=[{"md5": "0087a274", "path": "ask537/w4/BUILD537.md", "wall_id": 10667}, {"md5": "ad7d9ed2", "path": "ask537/w4/build/target_engine_537.json"}, {"md5": "cb8fa648", "path": "patch537.py"}, {"md5": "fdad1cb5", "path": "ask537/w4/write/write537.sh"}],
 revert={"md5": "6b1f8f66", "path": "ask537/w4/write/revert537.sh", "copy": "revert_engine.json ed6f0f0d", "note": "not exercised (W4 10686 item 4)"},
 grades=[G("W2", "FAIL ON FORM (plan rev 1)", 10650, "3ec01b45", "FAIL ON FORM"), G("W2", "PASS (plan rev 2)", 10653, "9228c215"),
         G("W2", "PASS (plan rev 3, final GAP text)", 10659, "9fc47743"), G("W2", "PASS (build)", 10670, "0087a274"), G("W2", "PASS (build; target named in the grade)", 10670, "ad7d9ed2")],
 md5w=["ad7d9ed2"], audit="39977",
 objects=[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "9240349c", "after": "04450043 (fetch-back a078ac78)", "nodes": "Init with Guards (a1822dd2), D4 Build (6f6aa0b9), C4 Build (91636ca9)"},
          {"kind": "n8n workflow", "name": "child MqQHRl7mQQ0z8QdT", "note": "not touched"}],
 tests=[{"file": "ask537/w4/build/gap537.js", "md5": "10bd606a", "wall_id": 10656}, {"file": "ask537/w4/build/pwa537.js", "md5": "3444cc5b", "wall_id": 10656}, {"file": "test537.js", "wall_id": 10670}, {"file": "gapcheck537.js", "wall_id": 10670}],
 readbacks=[{"seat": "W2", "result": "CONFIRMED, MATCH", "wall_id": 10694}],
 run={"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "\"GAP: premise <n> [<round>] -- <verse> -- UNANSWERED\" or \"GAPS: NONE\" in the Oracle's close; \"RESTRICTION:\" lines where an opponent restricts (item 1 NO PROBE)"},
 manuals={"engine_manual": "not yet written", "op_doc": "not needed"}, status='read back',
 sources=[10635, 10643, 10649, 10650, 10651, 10652, 10653, 10654, 10655, 10656, 10658, 10659, 10667, 10670, 10686, 10694],
 builders=(['W4'], [{"seat": "W4", "what": "built and wrote ASK 537 on its card", "wall_id": 10686}]))
def q(s): return 'NULL' if s is None else '$t$' + s + '$t$'
def j(o): return 'NULL' if o is None else q(json.dumps(o, ensure_ascii=False)) + '::jsonb'
out = ["-- ASK AAR row for ASK 537, DRAFT rev 0 (W1, 2026-11-23). Live (status 'read back'), objective_met 'in part', run_evidence UNEXERCISED. NOT RUN. Only the coordinator (seat 36) inserts, after W2's grade.",
       "-- Replace {{COORDINATOR_SESSION}} with the inserting coordinator's session before running.",
       "BEGIN;", "SET LOCAL truth.session_id = '%s';" % COORD,
       "INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES\n(%d, '%s', %s,\n %s,\n '%s', %s,\n '%s', '%s', NULL,\n %s::jsonb, %s, '%s',\n %s,\n %s,\n %s,\n %s,\n ARRAY[%s], %s,\n %s,\n %s,\n %s,\n %s,\n %s,\n '%s', %s);" % (
        r['ask'], r['rev'], q(r['title']), q(r['objective']), r['met'], q(r['reason']), r['src'], COORD, q(r['words']), j(r['card']), r['owner'],
        j(r['plan']), j(r['build']), j(r['revert']), j(r['grades']), ','.join("'%s'" % m for m in r['md5w']), j(r['audit']), j(r['objects']), j(r['tests']),
        j(r['readbacks']), j(r['run']), j(r['manuals']), r['status'], j(r['sources'])),
       "INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)\nSELECT s.id, NULL, ARRAY['W4'], %s, '%s' FROM public.ask_aar_snapshots s WHERE s.ask = 537 AND s.rev = 'A1' AND s.aar_at = now();" % (j(r['builders'][1]), COORD),
       "COMMIT;", "-- After COMMIT, separately:", "-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';", "-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 92;"]
sql = '\n'.join(out) + '\n'
open('aar_row_537_draft.sql', 'w').write(sql)
print(hashlib.md5(sql.encode()).hexdigest()[:8], len(sql))
