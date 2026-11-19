import json, sys
COORD = 'session_01H1X3APzb2DidJoZ9Avizjn'
dry = json.load(open('/mnt/project-files/ask493/w3/dryrun493_w3.json'))['rows']
NY = 'not yet'
def g(seat, verdict, md5, wall, norm='PASS'):
    return {"seat": seat, "verdict": verdict, "verdict_norm": norm, "md5_graded": md5, "wall_id": wall}
def rb(seat, result, wall): return {"seat": seat, "result": result, "wall_id": wall}
new = []
new.append(dict(ask=482, rev='5', title='Queue tab names each side by model; odv1_eng_label OpenAI',
 objective='The Any vs Any drop-downs list exactly the engines the live engine accepts as debaters (minus the ones it refuses), each shown with its live model version from model_config, and a launch from any listed choice is accepted by both the launch function and the engine. (a482_w3/plan_rev2.md; rev 5 adds the Queue tab, W1 9712 and 9725)',
 objective_met='in part', objective_met_reason='Rev 5 written (audit 38731) and read back: DB and Vercel by W2 (9815) and W3 (9824), W1 as builder (9813). The Queue tab page load by the operator and a launch from the new choices are still owed.',
 objective_source='9725, 9815, 9824', prior_ask=(482,'4'),
 operator_words=NY, card={"thread":"W4","press_time":"18:07:00Z","answer":"Write it","source":"audit 38731"},
 owner_seat='W1', plan={"path":"a482_w3/plan_rev2.md","md5":NY,"commit":"97cf9228","wall_id":9725},
 build_files=[{"path":"delta482r5.sql","md5":"f3b88394","commit":"97cf9228"}], revert=NY,
 grades=[g('W3','PASS','f3b88394',9734), g('W2','PASS','f3b88394',9740)], md5_written=['f3b88394'],
 audit_ids=[38731], objects=[{"kind":"function","name":"dash_queue","before":"9ccd1295","after":"eb3d6380"},{"kind":"function","name":"odv1_eng_label","before":"9d25f4a0","after":"6598260b"},{"kind":"function","name":"odv1_model_name","before":None,"after":"b5d222dd"}],
 tests=NY, readbacks=[rb('W1','CONFIRMED (builder)',9813), rb('W2','CONFIRMED, DB and Vercel',9815), rb('W3','CONFIRMED',9824)],
 run_evidence={"owed":True}, manuals={"engine_manual":"v216 (70243d95)","op_doc":NY}, status='read back',
 sources=[9712,9725,9734,9740,9813,9815,9824,"audit 38731"]))
new.append(dict(ask=488, rev='1', title='Agreeing RESULT words decide the outcome (derive_debate_outcome)',
 objective="No OBJECTIVE line (the plan predates THE ASK FORM). The plan's ruling, the operator's 10:50 CST card: when the counted judges' RESULT words agree, that RESULT is the run's outcome, even if the tags split. (a486_w3/plan488.md rev 1)",
 objective_met='not yet', objective_met_reason='Written (audit 38710; derive_debate_outcome fd075696 to ea1eb1e1) and read back by W2 (9801) and W1 (9803). No run since has had agreeing RESULT words with split tags.',
 objective_source='9799, 9801, 9803', operator_words=[{"text":"Agreeing RESULT words decide outcome (ruling 10:50 CST card)","at":"10:50 CST","source":"plan488.md rev 1"}],
 card={"thread":"W4","press_time":"18:03:24Z","answer":"Write it","source":"audit 38710"}, owner_seat='W4',
 plan={"path":"prototypes/posture_e/wall2024/a486_w3/plan488.md","md5":"03920749","commit":"3a1e55c3","wall_id":NY},
 build_files=[{"path":"ask488/w4/step488.sql","md5":"5fe292f1","commit":NY},{"path":"ask488/w4/gen488.sql","md5":"f4a695c6","commit":NY}],
 revert={"path":"ask488/w4/revert488.sql","md5":"d241bd0e"},
 grades=[g('W1','PASS with N1','5fe292f1',9697), g('W2','PASS with N1','5fe292f1',9698), g('W1','PASS','f4a695c6',9705), g('W2','PASS','f4a695c6',9706)],
 md5_written=['5fe292f1'], audit_ids=[38710], objects=[{"kind":"function","name":"derive_debate_outcome","before":"fd075696","after":"ea1eb1e1"}],
 tests=[{"file":"ask488/w4/test488_rollback.sql","md5":"f961f153","result":"T3 run on a synthetic rolled-back case","wall_id":9709}],
 readbacks=[rb('W2','CONFIRMED',9801), rb('W1','CONFIRMED',9803)], run_evidence={"owed":True},
 manuals={"engine_manual":"v215 (3fd8be60)","op_doc":NY}, status='read back', sources=[9697,9698,9705,9706,9709,9799,9801,9803,"audit 38710"]))
new.append(dict(ask=489, rev='1', title='Twin anon policies dropped on debate_candidate_findings and tier3_verdicts',
 objective='Each table keeps one policy per role and command, so a later change (such as closing an anon write) cannot be undone by a forgotten twin. Expected effect: what each role can read and write is the same before and after. (ask489/plan489.md)',
 objective_met='yes', objective_met_reason='Written (audit 38718) and read back by W1 (9806) and W3 (9809): one policy per role and command, and the same effective access before and after.',
 objective_source='9806, 9809', operator_words=NY, card={"thread":"W4","press_time":"18:05:09Z","answer":"Write it","source":"audit 38718"}, owner_seat='W2',
 plan={"path":"ask489/plan489.md","md5":"2f3c271b","commit":NY,"wall_id":9687},
 build_files=[{"path":"ask489/step489.sql","md5":"0fd91b1c","commit":NY}], revert={"path":"ask489/revert489.sql","md5":"33c09658"},
 grades=[g('W3','PASS (rev 0; step 6b24a3a7)','6b24a3a7',9688), g('W1','PASS with N1','0fd91b1c',9695), g('W1','PASS with N1','2f3c271b',9695)],
 md5_written=['0fd91b1c'], audit_ids=[38718], objects=[{"kind":"policy","name":"anon_ins, anon_sel on debate_candidate_findings and tier3_verdicts","before":"present","after":"dropped"}],
 tests=[{"file":"ask489/test489_rollback.sql","md5":"06ddffca","result":"every line PASS","wall_id":9720}],
 readbacks=[rb('W1','CONFIRMED',9806), rb('W3','CONFIRMED',9809)], run_evidence={"case":"no run needed (access unchanged)"},
 manuals={"engine_manual":"v215 (3fd8be60)","op_doc":NY}, status='read back', sources=[9687,9688,9695,9720,9795,9802,9806,9809,"audit 38718"]))
new.append(dict(ask=490, rev='1', title='The transcript names each model',
 objective='Every place the debate transcript names a debater or a judge shows the model\'s own name, in the same form as ASK 482 rev 3 on the dashboard (openai/gpt-6.1-terra reads "Terra 6.1"). Expected effect: a transcript names "Terra 6.1", "Sol 6.1", "Sol 6.2", "Gemini 4 Hydrogen" and so on, never "ChatGPT", and never a bare seat key such as "sol62". (ask490/plan490.md)',
 objective_met='not yet', objective_met_reason='Written (audit 38738; engine dd636c25 to 533f77a1) and read back by W2 (9817, fetchback), W1 (9820) and W3 (9824). No transcript has been made since.',
 objective_source='9814, 9817, 9820, 9824',
 operator_words=[{"text":"the model named \"chat gpt\" need to change tot he model name (eg: terra 6.1 or sol 6.1)","at":"17:00Z","source":"ask490/plan490.md"},{"text":"that need needs to be changed in the transcript also.","at":"17:05Z","source":"ask490/plan490.md"}],
 card={"thread":"W4","press_time":"18:09:59Z","answer":"Write it","source":"audit 38738"}, owner_seat='W1',
 plan={"path":"ask490/plan490.md","md5":"21cadc07","commit":NY,"wall_id":9712},
 build_files=[{"path":"ask490/w4/target_engine_490.json","md5":"c3a1a1c9","commit":NY}], revert=NY,
 grades=[g('W2','PASS','21cadc07',9713), g('W3','PASS','21cadc07',9716), g('W3','PASS','c3a1a1c9',9733), g('W2','PASS','c3a1a1c9',9740)],
 md5_written=['c3a1a1c9'], audit_ids=[38738], objects=[{"kind":"workflow","name":"engine moMxiV4Irg1uRBZN","before":"dd636c25","after":"533f77a1"}],
 tests=NY, readbacks=[rb('W2','MATCH (fetchback b9287d99)',9817), rb('W1','CONFIRMED',9820), rb('W3','CONFIRMED',9824)], run_evidence={"owed":True},
 manuals={"engine_manual":"v216 (70243d95)","op_doc":NY}, status='read back', sources=[9704,9712,9713,9716,9733,9740,9814,9817,9820,9824,"audit 38738"]))
new.append(dict(ask=491, rev='3', title='Anon EXECUTE revoked on dash_launch_debate, debate_queue_expire_stale, pick_next_debate',
 objective='A holder of the public (anon) key cannot launch a W1 debate without the dashboard passphrase, cannot mark queued jobs failed, and cannot claim the next queued job. The dashboard launch (through dash_api, with the passphrase), the hourly expiry job and the engine are unchanged. (ask491/plan491.md)',
 objective_met='in part', objective_met_reason='Written (audit 38745) and read back by W1 (9820) and W3 (9824): anon is refused. The hourly expiry job ran after the write and succeeded (W1 9836). A dashboard launch and an engine claim since the write are not yet shown.',
 objective_source='9820, 9824, 9836', operator_words=NY, card={"thread":"W4","press_time":"18:11:13Z","answer":"Write it","source":"audit 38745"}, owner_seat='W2',
 plan={"path":"a491_w2/plan491.md","md5":"513e4f7d","commit":"9f2f486a","wall_id":9781},
 build_files=[{"path":"a491_w2/step491.sql","md5":"7074eb34","commit":"9f2f486a"}], revert={"path":"a491_w2/revert491.sql","md5":"6841b272"},
 grades=[g('W1','PASS','7074eb34',9735), g('W3','PASS','7074eb34',9737), g('W1','PASS on form','513e4f7d',9782), g('W3','PASS ON FORM','513e4f7d',9783)],
 md5_written=['7074eb34'], audit_ids=[38745], objects=[{"kind":"function grants","name":"dash_launch_debate, debate_queue_expire_stale, pick_next_debate","before":"EXECUTE to PUBLIC, anon, authenticated","after":"revoked"}],
 tests=[{"file":"a491_w2/test491_rollback.sql","md5":"a853825b","result":"all PASS","wall_id":9751}],
 readbacks=[rb('W1','CONFIRMED',9820), rb('W3','CONFIRMED',9824)], run_evidence={"case":"debate-queue-expire cron 18:17:00Z succeeded","mark":"W1 9836"},
 manuals={"engine_manual":"v217 (f646e032)","op_doc":NY}, status='read back', sources=[9729,9735,9737,9751,9781,9782,9783,9818,9820,9824,9836,"audit 38745"]))
new.append(dict(ask=492, rev='2', title='debate_results direct anon INSERT closed',
 objective='The public (anon) key can insert any row into debate_results by a direct REST POST. Close that path without breaking any live writer. Expected effect: a direct anon POST to /rest/v1/debate_results is refused with 42501; every RPC writer and every read is unchanged. (a492_w2/plan492.md)',
 objective_met='in part', objective_met_reason='Written (audit 38761) and read back by W3 (9832), W1 (9833) and W2 (9839): the direct anon insert is refused. That every RPC writer is unchanged needs a run that saves.',
 objective_source='9832, 9833, 9839', operator_words=NY, card={"thread":"W4","press_time":"18:14:12Z","answer":"Write it","source":"audit 38761"}, owner_seat='W2',
 plan={"path":"a492_w2/plan492.md","md5":"fc388155","commit":"9f2f486a","wall_id":9774},
 build_files=[{"path":"a492_w2/step492.sql","md5":"133ad316","commit":"9f2f486a"}], revert={"path":"a492_w2/revert492.sql","md5":"928b6eca"},
 grades=[g('W1','PASS WITH C-1','133ad316',9755), g('W1','PASS','133ad316',9757), g('W3','PASS','133ad316',9758), g('W3','PASS ON FORM','fc388155',9775), g('W1','PASS (C-1 met)','fc388155',9782)],
 md5_written=['133ad316'], audit_ids=[38761], objects=[{"kind":"policy and grant","name":"debate_results anon_ins; INSERT for anon","before":"present","after":"dropped and revoked"}],
 tests=NY, readbacks=[rb('W3','CONFIRMED',9832), rb('W1','CONFIRMED',9833), rb('W2','CONFIRMED',9839)], run_evidence={"owed":True},
 manuals={"engine_manual":"v217 (f646e032)","op_doc":NY}, status='read back', sources=[9754,9755,9757,9758,9775,9781,9782,9831,9832,9833,9839,"audit 38761"]))
new.append(dict(ask=494, rev='A1', title="Engine save nodes moved to the \"Supabase account\" credential",
 objective='Today anyone holding the public (anon) key can call rpc/record_debate_row and the other engine write functions. With them they can write a forged debate row, judgment or outcome. Close that, and keep every engine run saving. Expected effect: the nine engine write functions refuse anon with 42501, and the engine\'s saves run as service_role. (a494_w2/plan494.md)',
 objective_met='not yet', objective_met_reason='A1 only is written (audit 38773; engine 533f77a1 to d491f4a5) and read back by W3 (9841) and W1 (9843). The proving run and A2 (the revokes) are not done, so no function refuses anon yet.',
 objective_source='9837, 9841, 9843', operator_words=NY, card={"thread":"W4","press_time":"18:18:48Z","answer":"Write it","source":"audit 38773"}, owner_seat='W2',
 plan={"path":"a494_w2/plan494.md","md5":"b57c4b09","commit":"000477e9","wall_id":9774},
 build_files=[{"path":"ask494/w4/target_engine_494a1.json","md5":"6eac56a9","commit":NY}], revert=NY,
 grades=[g('W1','PASS (stands)','b57c4b09',9820), g('W3','PASS (stands)','b57c4b09',9824)],
 md5_written=['6eac56a9'], audit_ids=[38773], objects=[{"kind":"workflow","name":"engine moMxiV4Irg1uRBZN (11 save nodes, credential only)","before":"533f77a1","after":"d491f4a5"}],
 tests=NY, readbacks=[rb('W3','CONFIRMED',9841), rb('W1','CONFIRMED',9843)], run_evidence={"owed":True},
 manuals={"engine_manual":"v217 (f646e032)","op_doc":NY}, status='read back', sources=[9759,9765,9766,9767,9768,9820,9824,9835,9837,9841,9843,"audit 38773"]))
new.append(dict(ask=495, rev='2', title='Oracle Hardening Test (Live Ask) unpublished',
 objective='The workflow "TRUTH — Oracle Hardening Test (Live Ask)" (zwfk72lxBBf6ccJa) is published, and its webhook takes no credential (W1 Wall 9755). One request to that URL runs a live ask call and then a Claude drift-audit call, both paid. Expected effect: that URL no longer starts any call. Nothing the engine or the dashboard uses changes. (a495_w3/plan495.md)',
 objective_met='yes', objective_met_reason='Written (audit 38750): the workflow is inactive, no node changed. CRITERIA (i) to (iii) read back by W2 (9822) and W1 (9823).',
 objective_source='9821, 9822, 9823', operator_words=NY, card={"thread":"W4","press_time":"18:13:08Z","answer":"Write it","source":"audit 38750"}, owner_seat='W3',
 plan={"path":"a495_w3/plan495.md","md5":"dee5adcf","commit":"5f4ea5b6","wall_id":9773},
 build_files=[], revert={"path":"publish_workflow zwfk72lxBBf6ccJa, on the operator's word","md5":None},
 grades=[g('W1','PASS on form','dee5adcf',9779), g('W2','PASS','dee5adcf',9784)],
 md5_written=['dee5adcf'], audit_ids=[38750], objects=[{"kind":"workflow","name":"Oracle Hardening Test (Live Ask) zwfk72lxBBf6ccJa","before":"active true","after":"active false"}],
 tests=NY, readbacks=[rb('W2','CONFIRMED (i) to (iii)',9822), rb('W1','CONFIRMED (i) to (iii)',9823)], run_evidence={"case":"NO PROBE (plan); the URL must not be called"},
 manuals={"engine_manual":"v217 (f646e032)","op_doc":NY}, status='read back', sources=[9770,9772,9773,9779,9784,9821,9822,9823,"audit 38750"]))
new.append(dict(ask=496, rev='1', title='Debate Findings Pipeline paused',
 objective='The operator, card in W2\'s thread, 18:25:54Z 11-19: chose "B. Pause it" on "Decide what happens to the hourly Findings Pipeline workflow". Expected effect: the workflow starts no more runs. Nothing is deleted, and the 182 queued debates stay queued. (a496_w2/plan496.md)',
 objective_met='yes', objective_met_reason='Written (audit 38810): inactive, version 66f18454 kept. (i) and (ii) read back by W1 (9875), W3 (9876) and W2 (9878); (iii) no execution at the 19:00:40Z mark, read by W3 (9906), W2 (9907) and W1 (9908).',
 objective_source='9875, 9876, 9878, 9906, 9907, 9908',
 operator_words=[{"text":"Chose \"B. Pause it\" on the decision card asking \"Decide what happens to the hourly Findings Pipeline workflow\"","at":"18:25:54Z","source":"W2 thread card"}],
 card={"thread":"W4","press_time":"18:31:56Z","answer":"Write it","source":"audit 38810"}, owner_seat='W2',
 plan={"path":"a496_w2/plan496.md","md5":"a9029c31","commit":"d3c6aaab","wall_id":9867},
 build_files=[], revert={"path":"publish_workflow i3bLxvLj6EL4yfak, on the operator's word","md5":None},
 grades=[g('W1','PASS ON FORM (rev 0)','da3a2235',9864), g('W3','PASS ON FORM (rev 0)','da3a2235',9865), g('W3','PASS (after the write)','a9029c31',9876), g('W1','PASS (after the write)','a9029c31',9879)],
 md5_written=['a9029c31'], audit_ids=[38810], objects=[{"kind":"workflow","name":"Debate Findings Pipeline i3bLxvLj6EL4yfak","before":"active true","after":"active false"}],
 tests=NY, readbacks=[rb('W1','CONFIRMED',9875), rb('W3','CONFIRMED',9876), rb('W2','CONFIRMED (i)(ii)',9878), rb('W3','(iii) none at 19:00:40Z',9906), rb('W2','(iii) CONFIRMED',9907), rb('W1','(iii) MET',9908)],
 run_evidence={"case":"NO PROBE (plan); CRITERIA (iii)","mark":"19:00:40Z"},
 manuals={"engine_manual":"v218 pending (em_pairs_v218.json cc8ffc8f)","op_doc":NY}, status='read back', sources=[9861,9864,9865,9867,9873,9875,9876,9878,9879,9906,9907,9908,"audit 38810"]))
new.append(dict(ask=493, rev='8', title='ASK AAR snapshots table',
 objective='The operator, 11:54 CST 11-19: "so now, the team must needs to agree on what they want recorded and how ... whatever they decide i will approve.  I will need the operation manual updated to explain who is responsible for updating the new ASK AAR table ... when to update it ... and how.  As a rule, the table will need to be updated before the report is given to me." (a493_w3/plan493.md)',
 objective_met='in part', objective_met_reason='The table is written (audit 38890) and read back by W2 (9903) and W1 (9904). The op doc paragraph (v135) is not yet written, and these are the first rows.',
 objective_source='9902, 9903, 9904',
 operator_words=[{"text":"so now, the team must needs to agree on what they want recorded and how ... whatever they decide i will approve.","at":"11:54 CST","source":"a493_w3/plan493.md"}],
 card={"thread":"W4","press_time":"18:44:56Z","answer":"Write it","source":"audit 38890"}, owner_seat='W3',
 plan={"path":"a493_w3/plan493.md","md5":"4af9b456","commit":"a7956ff6","wall_id":9889},
 build_files=[{"path":"a493_w4/step493.sql","md5":"2769dff6","commit":"5ff09ab1"}], revert={"path":"a493_w4/revert493.sql","md5":"514a3efa"},
 grades=[g('W2','PASS','4af9b456',9890), g('W1','PASS with C1 and C2 (build)','4af9b456',9891), g('W2','PASS','2769dff6',9896), g('W1','PASS','2769dff6',9899), g('W2','PASS (test output)','2769dff6',9900)],
 md5_written=['2769dff6'], audit_ids=[38885,38886,38887,38888,38889,38890], objects=[{"kind":"table","name":"public.ask_aar_snapshots with 4 triggers and 3 functions","before":None,"after":"after_insert b55dbe2c, before_insert 8d309b66, no_change 2f315710 (prosrc)"}],
 tests=[{"file":"a493_w4/test493_rollback.sql","md5":"ce04b37c","result":"all as expected; T4 berean_ro by the closing check","wall_id":9897}],
 readbacks=[rb('W2','CONFIRMED',9903), rb('W1','CONFIRMED',9904)], run_evidence={"case":"DONE (iii): these rows, before the AAR"},
 manuals={"engine_manual":"v218 pending (em_pairs_v218.json cc8ffc8f)","op_doc":"v135 pending (od_pairs_v135.json 3b3bc616)"}, status='read back',
 sources=[9889,9890,9891,9893,9896,9897,9899,9900,9902,9903,9904,"audit 38890"]))

def jl(v):
    if v is None: return 'NULL'
    return "$j$" + json.dumps(v, ensure_ascii=False) + "$j$::jsonb"
def tl(v): return "$t$" + v + "$t$"
def arr(a): return "ARRAY[" + ",".join("'" + x + "'" for x in a) + "]::text[]" if a else "NULL"
JCOLS = ['operator_words','card','plan','build_files','revert','grades','audit_ids','objects','tests','readbacks','run_evidence','manuals','sources']
out = ["-- ASK AAR snapshot rows, first real fill (W2 draft for the coordinator; run once from seat 36, before the AAR is sent).",
       "BEGIN;", f"SET LOCAL truth.session_id = '{COORD}';"]
rows = []
for r in dry:
    r = dict(r)
    r.pop('aar_at', None); r.pop('md5_match', None); r['prior_ask'] = None
    rows.append(r)
rows += new
for r in rows:
    prior = 'NULL'
    if r.get('prior_ask'):
        a, v = r['prior_ask']; prior = f"(SELECT id FROM public.ask_aar_snapshots WHERE ask={a} AND rev='{v}' ORDER BY id DESC LIMIT 1)"
    vals = [str(r['ask']), tl(str(r['rev'])), tl(r['title']), tl(r['objective']), tl(r['objective_met']), tl(r['objective_met_reason']), tl(str(r['objective_source'])),
            f"'{COORD}'", prior] + [jl(r.get(c)) for c in JCOLS[:6]] + [arr(r.get('md5_written'))] + [jl(r.get(c)) for c in JCOLS[6:12]] + [tl(r['status']), jl(r['sources'])]
    # owner_seat goes after card
    cols = "ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources, owner_seat"
    vals.append(tl(r['owner_seat']) if r.get('owner_seat') else 'NULL')
    out.append(f"INSERT INTO public.ask_aar_snapshots ({cols}) VALUES ({', '.join(vals)});")
out.append("SELECT id, ask, rev, status, objective_met, md5_match, md5(s::text) FROM public.ask_aar_snapshots s ORDER BY id;")
out.append("COMMIT;")
open(sys.argv[1], 'w').write("\n".join(out) + "\n")
print(len(rows))
