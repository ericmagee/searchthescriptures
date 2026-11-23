# W1 (seat 34), 2026-11-23. AAR rows for the write stack: 517, 518, 519, 520, 502 A1, 527, 524, 525, 526, 523, 531.
# Reuses W3's row() form and its 517/519/520 rows (aar/w3/gen_aar_stack.py rev 1, md5 b3259b3a; its SQL 8bd2367d), with every {{...}} filled
# from the write posts, the readbacks and audit_log (read by W1's SQL, 11-23). Each row is status 'read back' (live),
# objective_met 'in part', run_evidence UNEXERCISED. DRAFT: NOT RUN. Only the coordinator (seat 36) inserts.
import json, re, hashlib
src = open('/home/claude/searchthescriptures/aar/w3/gen_aar_stack.py').read()
assert hashlib.md5(src.encode()).hexdigest().startswith('b3259b3a'), 'W3 generator changed'
exec(src.split('# 518 and 502 A1 rows', 1)[0])  # defines S, G, R, row(), NR and appends 517, 519, 520

COORD = '{{COORDINATOR_SESSION}}'  # the inserting coordinator session; filled at insert time
UNX = lambda mark: {"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": mark}

FILL = {
 # 517 (W4 10490; W2 10491)
 '517_WRITE_CST': '07:22', '517_PRESS_CST': '07:21:29', '517_CARD': 'Write 517', '517_WRITE_WALL': '10490',
 '517_AUDIT': '39771, 39772', '517_RB': 'by W2 at Wall 10491 (CONFIRMED)', '517_RB_SEAT': 'W2', '517_RB_RESULT': 'CONFIRMED',
 '517_RB_WALL': '10491', '517_AUDIT_LIST': '39771, 39772', '517_REVERT_FILES': 'revert517.sh a06b3e09, guarded on c5dcd97a and 8bfbc810',
 '517_ENGINE_AFTER': 'c5dcd97a (fetch-back 6c45af6a)', '517_CHILD_AFTER': '8bfbc810 (fetch-back 78f2cd04)', '517_FN_AFTER': 'a59400d8',
 '517_EM_VERSION': 'engine_manual v234 (26d1152e; read back W1 10586, W2 10587)',
 # 519 (W4 10509; W2 10514)
 '519_WRITE_CST': '07:33', '519_PRESS_CST': '07:33:04', '519_CARD': 'Write 519', '519_WRITE_WALL': '10509',
 '519_AUDIT': '39793', '519_RB': 'by W2 at Wall 10514 (CONFIRMED)', '519_RB_SEAT': 'W2', '519_RB_RESULT': 'CONFIRMED',
 '519_RB_WALL': '10514', '519_AUDIT_LIST': '39793',
 '519_TARGET_ENGINE': 'f62c817e', '519_TARGET_ENGINE_PATH': 'ask519/w4/target_engine_519.json',
 '519_TARGET_CHILD': '6eb563eb', '519_TARGET_CHILD_PATH': 'ask519/w4/target_child_519.json',
 '519_REVERT': 'ask520/w4/stack/steps/revert_519_engine.json (4969bb50) and revert_519_child.json (c4030e97), guarded on c35d330e and b66da7aa',
 '519_ENGINE_BEFORE': 'c243b2c9', '519_ENGINE_AFTER': 'c35d330e (fetch-back 290db075)',
 '519_CHILD_BEFORE': '8bfbc810', '519_CHILD_AFTER': 'b66da7aa (fetch-back 47e23e82)',
 '519_EM_VERSION': 'not yet written',
 # 520 (W4 10556; W2 10557)
 '520_WRITE_CST': '08:08', '520_PRESS_CST': '08:07:20', '520_CARD': 'Write 520', '520_WRITE_WALL': '10556',
 '520_AUDIT': '39833', '520_RB': 'by W2 at Wall 10557 (CONFIRMED)', '520_RB_SEAT': 'W2', '520_RB_RESULT': 'CONFIRMED',
 '520_RB_WALL': '10557', '520_AUDIT_LIST': '39833',
 '520_TARGET_ENGINE_PATH': 'ask520/w4/target_engine_520b_on519.json',
 '520_TARGET_CHILD': 'b208524d', '520_TARGET_CHILD_PATH': 'ask520/w4/target_child_520b_on519.json',
 '520_REVERT': 'ask520/w4/stack/steps/revert_520_engine.json and revert_520_child.json',
 '520_ENGINE_BEFORE': 'c35d330e', '520_ENGINE_AFTER': 'ea8e8b80 (fetch-back ad302e3c)',
 '520_CHILD_BEFORE': 'b66da7aa', '520_CHILD_AFTER': 'dfa5fecc (fetch-back 9ac64e59)',
 '520_EM_VERSION': 'not yet written',
}
ENG, CHI = 'engine moMxiV4Irg1uRBZN', 'child MqQHRl7mQQ0z8QdT'
def wf(name, b, a): return {"kind": "n8n workflow", "name": name, "before": b, "after": a}

row(518, 'A1', 'Close enforcer and judge contradiction check the whole quotation against its named text',
 "S1 only (plan rev 6): a quoted reading is checked, whole, against the text it names. Source: the operator's \"Four Remaining Bugs ... Bug 2\", released by \"yes\" 02:02 CST 11-23. (ask518/w3/plan518.md rev 6)",
 '10381, 10443, 10448, 10451, 10492, 10497, 10506, 10508', '"Four Remaining Bugs ... Bug 2"; "yes" 02:02 CST 11-23',
 {"md5": "f3ee867a", "path": "ask518/w3/plan518.md", "note": "rev 6"},
 [{"md5": "4969bb50", "path": "ask518/w4/write/put_518_engine_live.json", "wall_id": 10497}, {"md5": "1372e909", "path": "write518.sh"}],
 {"md5": "22486ae3", "path": "ask520/w4/stack/steps/revert_518_engine.json", "guard": "c243b2c9"},
 [G("W2", "PASS (build rev 6 on the live 517 engine)", 10497, "4969bb50")], ["4969bb50"],
 [wf(ENG, "c5dcd97a", "c243b2c9 (fetch-back 667db4c1)"), {"kind": "n8n workflow", "name": CHI, "note": "not touched"}],
 [{"file": "ask518/w4/write/put_518_engine_live.json", "wall_id": 10497}], UNX("no probe named"), "not yet written",
 [10381, 10451, 10492, 10497, 10506, 10508], (['W4'], [{"seat": "W4", "what": "built and wrote ASK 518 rev 6 on its card", "wall_id": 10506}]))

row(502, 'A1', 'Engine calls to record and get early alternate move off the public key',
 "Move the engine's calls to record_early_alternate and get_early_alternate off the public (anon) key (option O1), prove it with a run, then revoke the public key's EXECUTE. A1 is the move only; the revoke is A2. (ask502/w3/plan502.md rev 0)",
 '10201, 10204, 10363, 10480, 10481, 10564, 10565', 'plan502 option O1, chosen by both graders (W2 10201, W1 10204)',
 {"md5": "f958b8a4", "path": "ask502/w3/plan502.md", "note": "rev 0, option O1"},
 [{"md5": "83971fab", "path": "ask502/w4/BUILD502.md", "wall_id": 10480}, {"md5": "adae9459", "path": "ask502/w4/target_SX4Z_502.json"}],
 {"md5": "04eda854", "path": "write/revert502.sh", "guard": "497ffa2c and ef373841", "copies": "revert_SX4ZWtgHNs96uBOo.json 778606ba, revert_moMxiV4Irg1uRBZN.json f7659f9a"},
 [G("W1", "PASS with two notes (build)", 10481, "83971fab")], ["adae9459"],
 [wf("SX4ZWtgHNs96uBOo", "f47f5955", "497ffa2c (fetch-back 9ead58fe)"), wf(ENG, "ea8e8b80", "ef373841 (fetch-back a4c1fc87)")],
 [{"file": "ask502/w4/BUILD502.md", "md5": "83971fab", "wall_id": 10480}], UNX("a released run in which an early alternate fires and its row is saved and read as service_role"), "not yet written",
 [10201, 10204, 10363, 10480, 10481, 10564, 10565], (['W4'], [{"seat": "W4", "what": "built and wrote ASK 502 A1 on its card", "wall_id": 10564}]))

row(527, 'A1', 'Send-back replies in the Sn RESPONSE form are read and graded',
 "A judge's written reply to a send-back is read, and graded as today. An item counts under its rule as today when its answer was read and did not cure, or when no answer to it could be read. (ask527/w3/plan527.md rev 3)",
 '10524, 10526, 10528, 10530, 10541, 10546, 10549, 10550, 10551, 10552, 10578, 10579', 'run 41418 (sol 6.1 removed with drv_uncured 6)',
 {"md5": "7d32ccc2", "path": "ask527/w3/plan527.md", "commit": "30330174", "note": "rev 3"},
 [{"md5": "a3f5a5bb", "path": "ask527/w4/BUILD527.md", "wall_id": 10551}, {"md5": "859de6c6", "path": "target_engine_527.json"}, {"md5": "01e41009", "path": "target_child_527.json"}],
 {"path": "write/revert527.sh", "copies": "revert_engine.json 3737aead, revert_child.json eec6c3fb"},
 [G("W2", "FAIL (plan rev 0)", 10526, "b56aaa6c", "FAIL"), G("W2", "FAIL ON FORM (plan rev 1)", 10528, "65f39f86", "FAIL ON FORM"),
  G("W2", "PASS withdrawn as FAIL ON FORM at 10546 (plan rev 2)", 10530, "21adbb1c", "FAIL ON FORM"), G("W2", "FAIL ON FORM (build rev 0)", 10546, "447d58a2", "FAIL ON FORM"),
  G("W2", "PASS (plan rev 3)", 10550, "7d32ccc2"), G("W2", "PASS (build rev 1)", 10552, "a3f5a5bb")], ["859de6c6", "01e41009"],
 [wf(ENG, "ef373841", "97731058 (fetch-back 610b4305)"), wf(CHI, "dfa5fecc", "27629667 (fetch-back 57572b7a)")],
 [{"file": "replay527.js", "md5": "152fcc66", "wall_id": 10552}], UNX("NO PROBE (plan rev 3 section 6)"), "not yet written",
 [10524, 10526, 10528, 10530, 10546, 10550, 10552, 10578, 10579], (['W4'], [{"seat": "W4", "what": "built and wrote ASK 527 on its card", "wall_id": 10578}]))

for a, t in ((524, 'E-ASSUME runs on both sides\' charges; D3 Build carries the round 2 sentence'),
             (525, 'ASK 525, written with 524 on one card')):
    row(a, 'A1', t,
     "The assumption enforcer (E-ASSUME) tests whether the verses a side quoted, read together, state a fact that one of its premises takes as given, on the defender's charges against the challenger as well as the challenger's. D3 Build carries C2's round 2 carry sentence; this reverses the ASK 374 choice. (ask524/w1/plan524.md rev 1, which covers 524 and 525)",
     '10534, 10538, 10539, 10544, 10547, 10580, 10581', 'failed run 41418 (also 41117, 41102, 41043)',
     {"md5": "bdab364c", "path": "ask524/w1/plan524.md", "note": "rev 1, covers 524 and 525"},
     [{"md5": "f858956b", "path": "ask524/w4/build/target_engine_524_on520.json"}, {"md5": "4baa2f89", "path": "patch524.py"}, {"md5": "86541f14", "path": "write524.sh"}],
     {"md5": "591f1376", "path": "ask524/w4/build/revert524.sh", "copy": "revert_engine.json 83952c80"},
     [G("W3", "PASS (plan rev 1)", 10539, "bdab364c"), G("W3", "PASS (build)", 10547, "f858956b")], ["f858956b"],
     [wf(ENG, "97731058", "0e05fc55 (fetch-back 3788819f)")],
     [{"file": "synth524_41418.txt", "wall_id": 10539}], UNX("\"EVERY VERSE THE\" in an E-ASSUME prompt (plan524.md section 6)"), "not yet written (waits on the operator's card in W3's thread)",
     [10539, 10547, 10580, 10581], (['W4'], [{"seat": "W4", "what": "built and wrote ASK 524/525 on one card", "wall_id": 10580}]))

row(526, 'A1', 'Stored counted-premise arrays agree with the final count lines',
 "A judge's stored counted-premise arrays agree with its final count lines, whenever those lines name the counted premises. Expected: in 41418 qwen 4 max's counted_premises_defender reads [2,5,6]. (ask526/w3/plan526.md rev 2)",
 '10543, 10555, 10558, 10560, 10562, 10582, 10583', 'run 41418 (qwen 4 max array [1,2,5,6] against a count of 3)',
 {"md5": "9e2f3819", "path": "ask526/w3/plan526.md", "commit": "7dafc2ed", "note": "rev 2"},
 [{"md5": "ed5c103c", "path": "ask526/w4/BUILD526.md", "wall_id": 10560}, {"md5": "3afab90f", "path": "target_engine_526_on520.json"}, {"md5": "0356771b", "path": "patch526.py"}, {"md5": "b291898a", "path": "write526.sh"}],
 {"path": "write/revert526.sh", "copy": "revert_engine.json 30e8263a"},
 [G("W1", "PASS with two build requirements (plan rev 2)", 10558, "9e2f3819"), G("W1", "PASS (build)", 10562, "ed5c103c")], ["3afab90f"],
 [wf(ENG, "0e05fc55", "a2206d5d (fetch-back aad7b96a)")],
 [{"file": "ask526/w4/BUILD526.md", "md5": "ed5c103c", "wall_id": 10562}], UNX("\"COUNT: FINAL PASS to n\" (W4 10560); NO PROBE"), "not yet written",
 [10558, 10562, 10582, 10583], (['W4'], [{"seat": "W4", "what": "built and wrote ASK 526 on its card", "wall_id": 10582}]))

row(523, 'A1', 'An uncured DISAGREE on a deciding line counts against the judge',
 "The operator chose \"Yes, count it\" on ASK 523: an enforcer DISAGREE on a judge's deciding line counts against that judge's seat when the judge does not cure it. (ask523/w3/plan523.md rev 1)",
 '10559, 10561, 10563, 10566, 10572, 10573, 10574, 10575, 10584, 10585', 'the operator\'s choice on 523, relayed 08:08 CST 11-23',
 {"md5": "418fbb56", "path": "ask523/w3/plan523.md", "note": "rev 1; dlu_match.js 6372cbd9"},
 [{"md5": "643e2ef6", "path": "ask523/w4/BUILD523.md", "wall_id": 10574}, {"md5": "110630d3", "path": "stack/engine_527_526_523.json"}, {"md5": "9b1c10bb", "path": "stack/child_527_523.json"}, {"md5": "acfdae89", "path": "patch523.py"}, {"md5": "9ba25478", "path": "body523.py"}, {"md5": "e9635196", "path": "write523.sh"}],
 {"path": "write/revert523.sh", "copies": "revert_engine.json f916f109, revert_child.json c5c05639"},
 [G("W2", "FAIL (plan rev 0)", 10561, "7d2f1e63", "FAIL"), G("W2", "PASS (plan rev 1)", 10566, "418fbb56"),
  G("W2", "FAIL (build rev 0)", 10573, "892b516b", "FAIL"), G("W2", "PASS (build rev 1)", 10575, "643e2ef6")], ["110630d3", "9b1c10bb"],
 [wf(ENG, "a2206d5d", "48513907 (fetch-back af95e833)"), wf(CHI, "27629667", "ac517c41 (fetch-back e7f2c047)")],
 [{"file": "synth523_out.txt", "md5": "0da5b726", "wall_id": 10575}], UNX("\"DECIDING LINE UNCURED (pkgDLU, ASK 523)\"; NO PROBE"), "not yet written",
 [10561, 10566, 10573, 10575, 10584, 10585], (['W4'], [{"seat": "W4", "what": "built and wrote ASK 523 on its card", "wall_id": 10584}]))

row(531, 'A1', 'A judge who spares an unsupported premise is sent back and counted',
 "The operator chose \"Yes, count it (ASK 531)\" at 08:51 CST 11-23: \"If both readers find a premise's fact unsupported by any verse and the judge spares it, it is sent back. Left uncured, it counts against that judge's seat, like Mary's line in 41418.\" (ask531/w3/plan531.md rev 1b)",
 '10588, 10591, 10592, 10594, 10628, 10629, 10631, 10632, 10637, 10639, 10660, 10661', 'card "Count a judge who lets an unsupported premise stand?", 08:51 CST 11-23',
 {"md5": "0d641e7b", "path": "ask531/w3/plan531.md", "note": "rev 1b"},
 [{"md5": "ec623065", "path": "ask531/w4/BUILD531.md", "wall_id": 10637}, {"md5": "fa7711aa", "path": "ask531/w4/build/target_engine_531.json"}, {"md5": "577679a6", "path": "ask531/w4/build/target_child_531.json"}, {"md5": "d73ad624", "path": "patch531.py"}],
 {"md5": "7e1e1c94", "path": "ask531/w4/write/revert531.sh", "copies": "revert_engine.json eb6e7e8a, revert_child.json 8447f33b", "note": "never run (W4 10660 item 5)"},
 [G("W2", "FAIL (plan rev 0)", 10591, "947ad221", "FAIL"), G("W2", "PASS with one WRONG-IF fix (plan rev 1)", 10594, "5e8e5650"),
  G("W2", "PASS with one text fix (plan rev 1b)", 10629, "fe10fbed"), G("W2", "FAIL (build rev 0)", 10632, "aecbb85a", "FAIL"),
  G("W2", "PASS (build rev 1)", 10639, "ec623065")], ["fa7711aa", "577679a6"],
 [wf(ENG, "48513907", "9240349c (fetch-back 184761d0)"), wf(CHI, "ac517c41", "334f0518 (fetch-back e2ceb1bf)")],
 [{"file": "ask531/w4/build/synth531d.js", "md5": "feaa86a2", "wall_id": 10639}, {"file": "out_synth531d.txt", "md5": "d67de361"}],
 UNX("a released run carrying the 524 marker in which a judge spares a fact both readers mark NOT STATED"), "not yet written",
 [10591, 10594, 10629, 10632, 10639, 10660, 10661], (['W4'], [{"seat": "W4", "what": "built and wrote ASK 531 on its card", "wall_id": 10660}]))

# Fill the generic fields W3's row() leaves as placeholders for the rows added here.
W = {518: ('07:30', '07:30:12', '10506', '39789', 'W2', 'CONFIRMED', '10508'),
     502: ('08:17', '08:16:35', '10564', '39842', 'W2', 'CONFIRMED', '10565'),
     527: ('08:43', '08:42:09', '10578', '39857', 'W2', 'CONFIRMED', '10579'),
     524: ('08:46', '08:46:17', '10580', '39860', 'W3', 'MATCH', '10581'),
     525: ('08:46', '08:46:17', '10580', '39860', 'W3', 'MATCH', '10581'),
     526: ('08:51', '08:50:36', '10582', '39863', 'W1', 'MATCH', '10583'),
     523: ('08:53', '08:52:34', '10584', '39867', 'W2', 'CONFIRMED', '10585'),
     531: ('10:01', '09:59:06', '10660', '39943', 'W2', 'MATCH', '10661')}
CARD = {518: 'Write 518', 502: 'Write 502 A1', 527: 'Write 527', 524: 'Write 524/525', 525: 'Write 524/525', 526: 'Write 526', 523: 'Write 523', 531: 'Write 531'}
for a, (wc, pc, ww, au, rs, rr, rw) in W.items():
    FILL.update({'%d_WRITE_CST' % a: wc, '%d_PRESS_CST' % a: pc, '%d_CARD' % a: CARD[a], '%d_WRITE_WALL' % a: ww, '%d_AUDIT' % a: au,
                 '%d_RB' % a: 'by %s at Wall %s (%s)' % (rs, rw, rr), '%d_RB_SEAT' % a: rs, '%d_RB_RESULT' % a: rr, '%d_RB_WALL' % a: rw, '%d_AUDIT_LIST' % a: au})
# Owner: W3 plans all but 502 (W3 plan), 524/525 (W1 plan). Run evidence for 517/519/520 is UNEXERCISED too.
for r in R:
    if r['ask'] in (524, 525): r['owner'] = 'W1'
    if r['ask'] in (517, 519, 520): r['run'] = UNX({517: 'no probe named', 519: 'K-W/K-S3 drop counts in a released run', 520: 'K-UNX skip on a MISSES press in a released run'}[r['ask']])

def fill(o):
    if isinstance(o, str):
        o2 = re.sub(r'\{\{([0-9A-Z_]+)\}\}', lambda m: FILL[m.group(1)], o)
        return int(o2) if re.fullmatch(r'\d+', o2) and o != o2 and o.startswith('{{') else o2
    if isinstance(o, list): return [fill(x) for x in o]
    if isinstance(o, tuple): return tuple(fill(x) for x in o)
    if isinstance(o, dict): return {k: fill(v) for k, v in o.items()}
    return o
R[:] = [fill(r) for r in R]
for r in R:
    for k in ('words',): pass
    r['words'] = fill(r['words'])

def q(s): return 'NULL' if s is None else '$t$' + s + '$t$'
def j(o): return 'NULL' if o is None else q(json.dumps(o, ensure_ascii=False)) + '::jsonb'
out = ["-- ASK AAR rows for the write stack, DRAFT rev 0 (W1, 2026-11-23): 517, 519, 520 (W3's rows, filled), 518, 502 A1, 527, 524, 525, 526, 523, 531.",
       "-- All 11 are live (status 'read back'), objective_met 'in part', run_evidence UNEXERCISED. NOT RUN. Only the coordinator (seat 36) inserts, after W2's grade.",
       "-- Replace {{COORDINATOR_SESSION}} with the inserting coordinator's session before running.",
       "BEGIN;", "SET LOCAL truth.session_id = '%s';" % COORD]
for r in R:
    out.append("INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES\n(%d, '%s', %s,\n %s,\n '%s', %s,\n '%s', '%s', NULL,\n %s::jsonb, %s, '%s',\n %s,\n %s,\n %s,\n %s,\n ARRAY[%s], %s,\n %s,\n %s,\n %s,\n %s,\n %s,\n '%s', %s);" % (
        r['ask'], r['rev'], q(r['title']), q(r['objective']), r['met'], q(r['reason']), r['src'], COORD,
        q(r['words']), j(r['card']), r['owner'], j(r['plan']), j(r['build']), j(r['revert']), j(r['grades']),
        ','.join("'%s'" % m for m in r['md5w']), j(r['audit']), j(r['objects']), j(r['tests']), j(r['readbacks']), j(r['run']), j(r['manuals']), r['status'], j(r['sources'])))
    bs, bsrc = r['builders']
    out.append("INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)\nSELECT s.id, NULL, ARRAY[%s], %s, '%s' FROM public.ask_aar_snapshots s WHERE s.ask = %d AND s.rev = '%s' AND s.aar_at = now();" % (
        ','.join("'%s'" % b for b in bs), j(bsrc), COORD, r['ask'], r['rev']))
out += ["COMMIT;", "-- After COMMIT, separately:",
        "-- SELECT id, ask, rev, objective_met, status, md5_match FROM public.ask_aar_snapshots WHERE aar_at > now() - interval '10 minutes' ORDER BY id;",
        "-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';",
        "-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 76;"]
sql = '\n'.join(out) + '\n'
left = sorted(set(re.findall(r'\{\{([0-9A-Z_]+)\}\}', sql)) - {'COORDINATOR_SESSION'})
assert not left, left
open('/home/claude/searchthescriptures/aar/w1/aar_rows_1123c_draft.sql', 'w').write(sql)
print(len(R), [r['ask'] for r in R], hashlib.md5(sql.encode()).hexdigest()[:8], len(sql))
