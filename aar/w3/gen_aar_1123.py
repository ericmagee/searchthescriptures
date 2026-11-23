import json
S='session_01H1X3ANeXjt6pnw4fs6Wxr4'
def G(seat,verdict,wid,md5,norm='PASS'): return {"seat":seat,"verdict":verdict,"wall_id":wid,"md5_graded":md5,"verdict_norm":norm}
def card(ans,thread,t,src): return {"answer":ans,"thread":thread,"press_time":t,"source":src}
NR="not yet: no graded run check on the Wall"
R=[]
# 494 A2 proven by run 40995
R.append(dict(ask=494,rev='A2',prior=32,title='Public key can no longer call the engine write functions',
 objective="Today anyone holding the public (anon) key can call rpc/record_debate_row and the other engine write functions. With them they can write a forged debate row, judgment or outcome. Close that, and keep every engine run saving. Expected effect: the nine engine write functions refuse anon with 42501, and the engine's saves run as service_role. (a494_w2/plan494.md)",
 met='yes', reason="A2 written 20:51:24Z 11-19 (audit 39218 to 39227; snapshot 32). Run 40995 (ODV1-40995-inaaza3z) saved its row 8033944e at 02:31:23Z 11-20 and called rpc/record_debate_row_tokens once as service_role with HTTP 200 at 02:51:32Z, the last of the nine not yet shown after the revoke (W2 10224 item 4a; W1 10225 item 3). Live grants on 11-23: anon, authenticated and PUBLIC false on all nine; service_role and lab_seat true (W4 10356, W2 10355). Op doc line written as v138 on the operator's card 07:42:38Z 11-23 (readback W2 10365).",
 src='10224, 10225, 10355, 10356, 10364, 10365', words='"not yet"',
 card={"answer":"Write it","thread":"W4","press_time":"20:51:10Z","source":"snapshot 32 card field; the write landed at 20:51:24Z (audit 39218 to 39227)"}, owner='W2',
 plan={"md5":"b57c4b09","path":"a494_w2/plan494.md","commit":"000477e9","wall_id":9820},
 build=[{"md5":"fc32cec9","path":"a494_w2/step494.sql","commit":"9f2f486a"}],
 revert={"md5":"dfcfdd2f","path":"a494_w2/revert494.sql"},
 grades=[{**G("W1","PASS with N1 and N2 (plan rev 0 e888ca4d and step); corrected to FAIL ON FORM at 9772",9765,"e888ca4d"),"superseded_by":9772},{**G("W3","PASS with four notes (plan rev 0 e888ca4d and step); superseded by the form regrade 9783",9766,"e888ca4d"),"superseded_by":9783},{**G("W1","PASS (plan rev 1 6bffd9ec); corrected to FAIL ON FORM at 9772",9768,"6bffd9ec"),"superseded_by":9772},G("W1","FAIL ON FORM (correction of 9765 and 9768: the plan lacked required headings)",9772,"6bffd9ec","FAIL ON FORM"),G("W1","PASS on form: plan rev 2 06b6eb2e, step fc32cec9 in commit 9f2f486a",9782,"fc32cec9"),G("W3","PASS on form: plan rev 2 06b6eb2e, step fc32cec9 in commit 9f2f486a",9783,"fc32cec9"),G("W1","grade STANDS on plan494.md b57c4b09",9820,"b57c4b09"),G("W3","grade STANDS on plan494.md b57c4b09",9824,"b57c4b09")],
 md5w=['fc32cec9'], audit=list(range(39218,39228)),
 objects=[{"kind":"grants","name":"EXECUTE on the nine engine write functions","before":"anon on all nine (snapshot 32)","after":"postgres, service_role, lab_seat only (live read 11-23, W4 10356)"}],
 tests=[{"file":"a494_w2/test494_rollback.sql","md5":"b6f77465","wall_id":10059}],
 readbacks=[{"seat":"W3","result":"CONFIRMED","wall_id":10071},{"seat":"W1","result":"CONFIRMED","wall_id":10072}],
 run={"run_token":"ODV1-40995-inaaza3z","debate_results_id":"8033944e","row_saved_at":"02:31:23Z 11-20","rpc":"record_debate_row_tokens","role":"service_role","http_status":200,"at":"02:51:32Z","checks":[10224,10225]},
 manuals={"engine_manual":"v221 (c3c39ed3)","op_doc":"v138 (eadb1c43), card 07:42:38Z 11-23 W3 thread; readback W2 10365"},
 status='proven by run', sources=[9759,9765,9766,9768,9772,9782,9783,9820,9824,10070,10071,10072,10223,10224,10225,10226,10227,10228,10355,10356,10364,10365,"audit 39227"],
 builders=(['W2','W4'],[{"seat":"W2","what":"built step494.sql fc32cec9","wall_id":9759},{"seat":"W4","what":"wrote 494 A2 on its card","wall_id":10070}])))
def wf(ask,title,obj,met,reason,src,cardt,planm,planp,patch,te,tc,pe,pc,fe,fc,ver,lib,audit,grades,rb,run,man,status,sources,revert,extra_src=None):
    R.append(dict(ask=ask,rev='A1',prior=None,title=title,objective=obj,met=met,reason=reason,src=src,words='"not yet"',
     card=card("Write it","W4",cardt,"audit %s"%" and ".join(map(str,audit))),owner='W3',
     plan={"md5":planm,"path":planp},
     build=[{"md5":patch[1],"path":patch[0]},{"md5":te,"path":"target engine"},{"md5":tc,"path":"target child"}],
     revert={"what":"write back the pre files on the operator's word","files":[{"md5":pe,"path":revert[0]},{"md5":pc,"path":revert[1]}]},
     grades=grades,md5w=[te,tc],audit=audit,
     objects=[{"kind":"workflow","name":"engine moMxiV4Irg1uRBZN","before":ver[0],"after":ver[1]},{"kind":"workflow","name":"Alternate Pass MqQHRl7mQQ0z8QdT","before":ver[2],"after":ver[3]},{"kind":"library","name":"Shared Library sha","before":lib[0],"after":lib[1]}],
     tests="offline replays in the build post; no rolled-back live test",readbacks=rb,run=run,manuals=man,status=status,sources=sources,
     builders=(['W4'],[{"seat":"W4","what":"built and wrote ASK %d"%ask,"wall_id":WID[(ask,ver[1])]}])))
def src_first(s): return [x for x in s if isinstance(x,int)][2] if len([x for x in s if isinstance(x,int)])>2 else s[0]
WID={(504,'6bb4647a'):10231,(506,'783e9f44'):10238,(507,'c6e630a4'):10247,(510,'a08e387a'):10268,(513,'321144bd'):10280,(515,'fb3ff9d7'):10300,(515,'1b20b067'):10308,(516,'38d1020c'):10315}
OBJR="the operator, 21:21 CST 11-19: debate flow is fixed only when the corpus chain is all HELD"
wf(504,'The deciding step of every break is written as a layer',
 "Every BROKEN, FORCED and press-only break names its deciding step as a layer (DECIDES ... FROM ... MEETS [round]); an unlayered deciding step is a fault the enforcer sends back (operator 21:44 CST 11-19, ruling R1 04:22:57Z 11-20). Done when, on this topic, the corpus has all HELD (%s). (a504_w3/plan504.md rev 1)"%OBJR,
 'not yet',"Written 04:23:35Z 11-20 (audit 39410, 39411), graded PASS by W3 (10230) and W2 (10329), fetchbacks equal targets (W2 10329). Run 41024 (launched 06:57Z 11-20) is reported by the builder with the layered DECIDES on each break and drv_uncured 0 (W4 10241); no grader checked it on the Wall. 41024 was not all HELD (terra HELD; sol, sol62 BROKEN), so the done condition is not met.",
 '10230, 10231, 10241, 10329','04:23:35Z',"d7260c9b","a504_w3/plan504.md",("ask504/w4/patch504.js","89eb2db0"),"40eb352b","7cf72c53","2250eeeb","01bcb5dc","bfe33ea5","67ae2ce8",
 ("ddbd7afc","6bb4647a","d7e57ead","c2e4af89"),("89fa920efdbde6b9","ae0b9a1abad1c58d"),[39410,39411],
 [G("W3","PASS with C1 (build rev 1)",10230,"40eb352b"),G("W3","PASS with C1 (build rev 1)",10230,"7cf72c53"),G("W2","PASS (second grade, 11-23)",10329,"40eb352b"),G("W2","PASS (second grade, 11-23)",10329,"7cf72c53")],
 [{"seat":"W2","result":"fetchbacks bfe33ea5 and 67ae2ce8 equal the targets, 0 differences","wall_id":10329}],
 {"run_token":"ODV1-41024-2wbmceb5","report":10241,"reported_by":"W4 (builder)","graded":False,"forms":"layered DECIDES meeting [CR3] on each break; drv_uncured 0","all_held":False},
 {"engine_manual":"v223 (a6135f75)","op_doc":"not yet"},'read back',[10229,10230,10231,10236,10241,10329,"audit 39410","audit 39411"],("ask504/w4/live_moMxiV4Irg1uRBZN.json","ask504/w4/live_MqQHRl7mQQ0z8QdT.json"))
wf(506,'Each judge states the points at issue first, and every grade names its point',
 "Judges write POINTS AT ISSUE first, one entry per D vs C line on both sides, and every collision line names -- POINT: P<n>; a BROKEN line with no point or a point not in the section is sent back (E-COL), and the enforcer sees the P entry per break (operator 22:36 and 22:39 CST 11-19). (a506_w3/plan506.md rev 3)",
 'in part',"Written 05:08:01Z 11-20 (audit 39425, 39426), graded PASS by W3 (10237) and W2 (10337), read back by W3 (10239). Run 41024 is reported by the builder with POINTS AT ISSUE in all 3 judgments and POINT on every collision line (W4 10241); no grader checked it on the Wall.",
 '10237, 10238, 10239, 10241, 10337','05:08:01Z',"d90ffb59","a506_w3/plan506.md",("ask506/w4/patch506.js","f392f27e"),"e325bfdb","f796ae1c","bfe33ea5","67ae2ce8","2a711680","e95badda",
 ("6bb4647a","783e9f44","c2e4af89","d6908ec6"),("ae0b9a1abad1c58d","680dd2af97c187be"),[39425,39426],
 [G("W3","PASS with N1 (build rev 0)",10237,"e325bfdb"),G("W3","PASS with N1 (build rev 0)",10237,"f796ae1c"),G("W2","PASS (second grade, 11-23)",10337,"e325bfdb"),G("W2","PASS (second grade, 11-23)",10337,"f796ae1c")],
 [{"seat":"W3","result":"CONFIRMED","wall_id":10239}],
 {"run_token":"ODV1-41024-2wbmceb5","report":10241,"reported_by":"W4 (builder)","graded":False,"forms":"POINTS AT ISSUE in all 3; POINT on every collision line"},
 {"engine_manual":"v224 (f56bd34a)","op_doc":"not yet"},'read back',[10237,10238,10239,10240,10241,10337,"audit 39425","audit 39426"],("ask506/w4/pre_moMxiV4Irg1uRBZN.json","ask506/w4/pre_MqQHRl7mQQ0z8QdT.json"))
wf(507,'Each judge names, at the verdict, the whole position that holds',
 "At the verdict each judge weighs each side's complete position and says which holds: a WHOLE POSITIONS section (both POSITION lines, then WHICH HOLDS in the DECIDES form) before RESULT; a mismatch with the grades is recorded only (TRIAL E-WHL) (operator 01:45 CST 11-20). (a507_w3/plan507.md rev 3)",
 'not yet',"Written 08:10:37Z 11-20 (audit 39439, 39440), graded PASS by W3 (10246) and W2 (10338), read back by W3 (10248). The Wall holds no graded run check of the WHOLE POSITIONS section; the pre-run objectives were posted at 10285.",
 '10246, 10247, 10248, 10285, 10338','08:10:37Z',"9cfca971","a507_w3/plan507.md",("ask507/w4/patch507.js","787e0429"),"08046dfa","23c14f70","2a711680","e95badda","c6d3c637","54048b71",
 ("783e9f44","c6e630a4","d6908ec6","ecb82fb2"),("680dd2af97c187be","b940895bd43124b7"),[39439,39440],
 [G("W3","PASS with two notes (build rev 0)",10246,"08046dfa"),G("W3","PASS with two notes (build rev 0)",10246,"23c14f70"),G("W2","PASS (second grade, 11-23)",10338,"08046dfa"),G("W2","PASS (second grade, 11-23)",10338,"23c14f70")],
 [{"seat":"W3","result":"CONFIRMED","wall_id":10248}],{"case":NR,"objectives_post":10285},
 {"engine_manual":"v225 (2a2c40b0)","op_doc":"not yet"},'read back',[10242,10243,10244,10246,10247,10248,10251,10285,10338,"audit 39439","audit 39440"],("ask507/w4/pre_engine_507.json","ask507/w4/pre_child_507.json"))
wf(510,'The enforcer checks one-verse grades and deferrals',
 "The enforcer checks every MEETS, STANDS and UNDERDETERMINED against Commitment 8 (one verse read alone does not give a contested fact) and Commitment 13 (no verse decides alone), and against a grade that leaves its point for another collision; either side alike. (ask510/w3/plan510.md rev 1)",
 'not yet',"Written 16:03:34Z 11-20 (audit 39468, 39469), graded PASS by W3 (10267, corrected 10273) and W2 (10343), read back by W3 (10269). Run 41090 then broke on an E-COL line, outside E-ANS and E-HOLD (coordinator 10290; W3 10291), and ASK 515 removed the two 510 sentences (W4 10300). No graded run check of 510 is on the Wall.",
 '10267, 10268, 10269, 10290, 10291, 10300, 10343','16:03:34Z',"2ecdf36b","ask510/w3/plan510.md",("ask510/w4/build/patch510.js","6d032ea5"),"3f07df4b","45fc0b8e","c6d3c637","54048b71","4163ec5e","25967a2b",
 ("c6e630a4","a08e387a","ecb82fb2","45a121d2"),("b940895bd43124b7","3929ad23c9371833"),[39468,39469],
 [G("W3","PASS (build), corrected at 10273",10267,"3f07df4b"),G("W3","PASS (build), corrected at 10273",10267,"45fc0b8e"),G("W2","PASS (second grade, 11-23)",10343,"3f07df4b"),G("W2","PASS (second grade, 11-23)",10343,"45fc0b8e")],
 [{"seat":"W3","result":"CONFIRMED","wall_id":10269}],{"case":NR,"superseded":"the two 510 sentences were removed by ASK 515 (W4 10300)"},
 {"engine_manual":"v227 (26747f66); its ASK 510 entry does not yet say the sentences were removed by ASK 515","op_doc":"not yet"},'read back',[10264,10265,10266,10267,10268,10269,10273,10274,10275,10290,10291,10300,10343,"audit 39468","audit 39469"],("ask510/w4/build/pre_engine_510.json","ask510/w4/build/pre_child_510.json"))
wf(513,'K-RUL accepts a quote that stands across a K-SU sentence',
 "K-RUL accepts a NAMED BY quote that runs across the verse break of a sentence K-SU told that judge to grade whole. No other quote is newly accepted. Both rules stay TRIAL, recorded only. (ask513/w3/plan513.md rev 1)",
 'in part',"Written 16:31:44Z 11-20 (audit 39483, 39484), graded PASS by W3 (10279) and W2 (10348), read back by W3 (10281). Offline replay: the two 41043 quotes (47505, 47532) refused before and accepted after; a splice of 1:24 with \"before they came together\" refused both ways (W3 10279; W2 10348). No graded run check is on the Wall.",
 '10279, 10280, 10281, 10348','16:31:44Z',"f0d97a02","ask513/w3/plan513.md",("ask513/w4/build/patch513.js","b9a2dd10"),"e011693a","589567b0","4163ec5e","25967a2b","95d08fe9","dbbd6306",
 ("a08e387a","321144bd","45a121d2","fee9f696"),("3929ad23c9371833","d45d546ddc3d99ce"),[39483,39484],
 [G("W3","PASS (build; planner, at W4's request)",10279,"e011693a"),G("W3","PASS (build; planner, at W4's request)",10279,"589567b0"),G("W2","PASS (second grade, 11-23)",10348,"e011693a"),G("W2","PASS (second grade, 11-23)",10348,"589567b0")],
 [{"seat":"W3","result":"CONFIRMED","wall_id":10281}],{"case":NR},
 {"engine_manual":"v228 (d261f6bd)","op_doc":"not yet"},'read back',[10277,10278,10279,10280,10281,10282,10283,10284,10348,"audit 39483","audit 39484"],("ask513/w4/build/pre_engine_513.json","ask513/w4/build/pre_child_513.json"))
wf(515,'One verse rule binds every enforcer rule, with the record on each link',
 "RULE ONE VERSE is the first rule of RULES and binds every enforcer rule, either side alike; each enforcer call carries the record on its links; on E-HOLD a reworded UNDERDETERMINED is read as a KEEP (operator 11:32 to 11:37 CST 11-20: \"none of our fixes are for single case instances\"). (ask515/w3/plan515.md rev 6)",
 'in part',"Written 18:06:20Z 11-20 (audit 39506, 39507), graded PASS by W3 (10299) and W2 (10361), read back by W3 (10301). Run 41117 ran on it: the enforcer agreed with every break of the defender's D4 link though the defender's rows on that point stood in the rounds, and the POINTS AT ISSUE entries reached no call (W3 10306; engine manual v230 entry). Rev 7 fixed the POINTS store (row for 515 r7). ASK 516 replaced item 4 and was reverted, so item 4 is live again (manual v231).",
 '10299, 10300, 10301, 10306, 10361','18:06:20Z',"4d62400e","ask515/w3/plan515.md",("ask515/w4/build/patch515.js","f65e05dd"),"20f4fe3d","b78f3e12","95d08fe9","dbbd6306","809b2404","3ba64499",
 ("321144bd","fb3ff9d7","fee9f696","e1ae55a9"),("d45d546ddc3d99ce","fa6e8159e811863c"),[39506,39507],
 [G("W3","PASS (build)",10299,"20f4fe3d"),G("W3","PASS (build)",10299,"b78f3e12"),G("W2","PASS (second grade, 11-23)",10361,"20f4fe3d"),G("W2","PASS (second grade, 11-23)",10361,"b78f3e12")],
 [{"seat":"W3","result":"CONFIRMED","wall_id":10301}],{"run":"41117","first_read":10306,"read_by":"W3","finding":"enforcer AGREE on every D4 break; defender's D4 rows not in the record; POINTS AT ISSUE in no call"},
 {"engine_manual":"v229 (2debf507); item 4 marked replaced in v230, live again in v231 (47be13a3)","op_doc":"not yet"},'read back',[10290,10291,10292,10294,10296,10298,10299,10300,10301,10302,10303,10304,10306,10361,"audit 39506","audit 39507"],("ask515/w4/build/pre_engine_515.json","ask515/w4/build/pre_child_515.json"))
r=R[-1]; 
wf(515,'POINTS AT ISSUE store fixed (ASK 515 rev 7)',
 "The POINTS AT ISSUE entries reach every enforcer call: the per-item store moves from Object.defineProperty, a no-op in the n8n sandbox, to a Map keyed by the item's first LINE id. (ask515/w4/r7/R7.md)",
 'not yet',"Written 19:11:33Z 11-20 (audit 39517, 39518), graded PASS by W3 (10307) and W2 (10361 part A), read back by W3 (10309). Live again since the 516 revert (W4 10326; W2 10327). No run has exercised it (W2 10361).",
 '10307, 10308, 10309, 10326, 10327, 10361','19:11:33Z',"7df43e1f","ask515/w4/r7/R7.md",("ask515/w4/r7/patch515r7.js","1ed511d8"),"ce56c631","ed835664","809b2404","3ba64499","d5519cb2","15424037",
 ("fb3ff9d7","1b20b067","e1ae55a9","c9db9777"),("fa6e8159e811863c","6f2ae36f19303a92"),[39517,39518],
 [G("W3","PASS (rev 7)",10307,"ce56c631"),G("W3","PASS (rev 7)",10307,"ed835664"),G("W2","PASS (second grade, 11-23)",10361,"ce56c631"),G("W2","PASS (second grade, 11-23)",10361,"ed835664")],
 [{"seat":"W3","result":"CONFIRMED","wall_id":10309},{"seat":"W2","result":"revert to this content CONFIRMED","wall_id":10327}],{"case":"not yet: no run on rev 7 since the 516 revert (W2 10361)"},
 {"engine_manual":"v230 (4a5e85ce), v231 (47be13a3)","op_doc":"not yet"},'read back',[10307,10308,10309,10326,10327,10361,"audit 39517","audit 39518"],("ask515/w4/r7/pre_engine_r7.json","ask515/w4/r7/pre_child_r7.json"))
R[-1]['rev']='r7'
wf(516,'Every enforcer call is given the rounds in full',
 "Every judge enforcer call carries THE ROUNDS IN FULL, all eight rounds tagged and as stored, the same bytes in every call and before anything that varies, so the enforcer can weigh rows on any point either side laid (approved by the operator's \"Work on 516\", 13:13 CST 11-20). (ask516/w3/plan516.md rev 3)",
 'no',"Written 19:23:42Z 11-20 (audit 39526, 39527), graded PASS by W3 only (10314; second grade held), read back by W3 (10316). The first runs on it, 41128 and 41155, crashed out of memory; 41147, the retry of 41128, failed at Record Substitution on recovered placeholders (W4 10324, 10353). Reverted to 515 rev 7 on the operator's card 07:22:37Z 11-23 (audit 39555, 39556; W4 10326), read back by W2 (10327). A lower-memory plan (plan516b.md rev 6, a4dc21f6) has PASS from W4 (10360) and W2 (10362), not built.",
 '10314, 10315, 10316, 10324, 10326, 10327, 10353, 10360, 10362, 10367, 10368, 10370','19:23:42Z',"1203417d","ask516/w3/plan516.md",("ask516/w4/patch516.js","2a3a8de7"),"3c4d415e","7567713f","d5519cb2","15424037","0f4def0e","410813c9",
 ("1b20b067","38d1020c","c9db9777","48ea0c0d"),("6f2ae36f19303a92","1bcba53c4b456acf"),[39526,39527],
 [G("W3","PASS (build; second grade held)",10314,"3c4d415e"),G("W3","PASS (build; second grade held)",10314,"7567713f")],
 [{"seat":"W3","result":"CONFIRMED","wall_id":10316},{"seat":"W2","result":"revert CONFIRMED (engine 31702b15, child cd2d84d8)","wall_id":10327}],
 {"runs":{"41128":"out of memory","41155":"out of memory","41147":"retry of 41128; failed at Record Substitution (W4 10353)"},"report":10324,"trace":10332,"reverted":"07:22:37Z 11-23, audit 39555 and 39556"},
 {"engine_manual":"v230 (4a5e85ce); revert entry v231 (47be13a3)","op_doc":"not yet"},'reverted',[10310,10311,10312,10313,10314,10315,10316,10318,10322,10324,10326,10327,10332,10353,10354,10358,10360,10362,"audit 39526","audit 39527","audit 39555","audit 39556"],("ask516/w4/pre_engine_516.json","ask516/w4/pre_child_516.json"))
R[-1]['build'].append({"note":"10313 and 10314 named 38644970 and 673f336d, which are the first eight characters of the sha256 of target_engine_516.json and target_child_516.json; their md5s are 3c4d415e and 7567713f (W4 10368 C3)."})
# DB ASKs
R.append(dict(ask=505,rev='A1',prior=None,title='Closing forfeit takes a win only from the side that made it; standing gate',
 objective="C1: a closing contradiction only takes a win away from the side that made it, both sides (card \"Both sides (B)\"). C0: a side PROP-DEPENDENT or COLLAPSED on two or more counted judges cannot prevail (operator 22:29 CST 11-19, card \"Yes, always\"). Forward only, from v_505_from. (outcome_fix/w3/plan_outcome.md rev 3)",
 met='in part', reason="Written 04:44:20Z 11-20 (audit 39420; v_505_from 04:44:38Z): derive_debate_outcome 1f79a931 to 2a853df6. Graded PASS by W3 (10232, 10233, 10234; test run 2 executed both new branches) and W2 (10333; reverse check restores 1f79a931). No graded check of a debate created after v_505_from is on the Wall; 505 C2 and C3 (transcripts) wait on the transcript-location question.",
 src='10232, 10233, 10234, 10235, 10333', words='"not yet"', card=card("Write it","W4","04:44:20Z","audit 39420"), owner='W3',
 plan={"md5":"96435850","path":"outcome_fix/w3/plan_outcome.md","commit":"26b931e2"},
 build=[{"md5":"f18294a7","path":"outcome_fix/w4/step505.sql"}], revert={"md5":"ce16ca95","path":"outcome_fix/w4/revert505.sql"},
 grades=[G("W3","PASS (test run 2; step f18294a7)",10234,"f18294a7"),G("W2","PASS (second grade, 11-23)",10333,"f18294a7")],
 md5w=['f18294a7'], audit=[39420],
 objects=[{"kind":"function","name":"public.derive_debate_outcome(uuid)","before":"1f79a931","after":"2a853df6"}],
 tests=[{"file":"outcome_fix/w4/test505.sql","md5":"299e7f7d","wall_id":10233},{"file":"outcome_fix/w4/test505b.sql","md5":"5ea08f15","wall_id":10234}],
 readbacks=[{"seat":"W2","result":"live prosrc 2a853df6, 28,648 characters; revert gives 1f79a931","wall_id":10333}],
 run={"case":NR}, manuals={"engine_manual":"v223 (a6135f75)","op_doc":"not yet"}, status='read back',
 sources=[10232,10233,10234,10235,10236,10333,"audit 39420"], builders=(['W4'],[{"seat":"W4","what":"built and wrote step505.sql f18294a7","wall_id":10235}])))
R.append(dict(ask=508,rev='A1',prior=None,title='The DG-8 guard set also fires on the words of begetting',
 objective="Add beget, begat, begetting, pregnant and impregnated to the DG-8 guard words, so a topic in those words is served Sight 1822 as GUARD SET (operator 08:24:13Z 11-20: \"Guard words for begetting only\"). (ask508/w3/plan508.md rev 2)",
 met='in part', reason="Written 08:33:40Z 11-20 (audit 39450): guard 8 trigger_terms e515ba0a to 3c900d8c. W2 (10340) confirms exactly the five words were added and that \"Did the Holy Ghost beget the flesh of Christ?\" serves S-1822 as GUARD SET (DG-8), whole. One non-builder grade only: W3 planned it and did not grade. Not shown by a run.",
 src='10255, 10340', words='"Guard words for begetting only"', card=card("Write it","W4","08:33:40Z","audit 39450"), owner='W3',
 plan={"md5":"a483e5c5","path":"ask508/w3/plan508.md","wall_id":10252},
 build=[{"what":"one UPDATE of guard_served_sets guard 8 trigger_terms (plan508.md)"}], revert={"what":"set guard 8 trigger_terms back to the nine words (plan508.md)"},
 grades=[G("W2","PASS (first non-builder grade, 11-23)",10340,"3c900d8c")], md5w=['3c900d8c'], audit=[39450],
 objects=[{"kind":"row","name":"guard_served_sets guard 8 trigger_terms","before":"e515ba0a","after":"3c900d8c"}],
 tests="live after-checks (W4 10255; W2 10340)", readbacks=[{"seat":"W2","result":"live 3c900d8c; base e515ba0a recovered","wall_id":10340}],
 run={"case":NR}, manuals={"engine_manual":"v226 (bb21ce44)","op_doc":"not yet"}, status='read back',
 sources=[10252,10255,10259,10340,"audit 39450"], builders=(['W4'],[{"seat":"W4","what":"wrote ASK 508","wall_id":10255}])))
R.append(dict(ask=509,rev='A1',prior=None,title='The sight-link path serves up to 50,000 characters',
 objective="Raise the debate_sight_links character cap from 8,000 to 50,000 (default and clamp); the 6-sight limit is unchanged (operator 08:30:57Z 11-20: \"50k\"). (ask509/w3/plan509.md rev 2)",
 met='in part', reason="Written 08:34:49Z 11-20 (audit 39453): function 75a7aa5b to d43c0860. W2 (10340) confirms the three literal changes are the whole write and that S-1822 is served whole as SIGHT LINK. One non-builder grade only (W3 planned; W4 10257). Not shown by a run. W2 notes S-1822 is now 32,466 characters, not the 24,114 the manual entry gives (10340 item 7).",
 src='10256, 10257, 10340', words='"50k"', card=card("Write it","W4","08:34:49Z","audit 39453"), owner='W3',
 plan={"md5":"86bed057","path":"ask509/w3/plan509.md","wall_id":10253},
 build=[{"md5":"b442ca20","path":"ask509/w4/step509.sql"}], revert={"md5":"49080ef7","path":"ask509/w4/revert509.sql"},
 grades=[G("W2","PASS (first non-builder grade, 11-23)",10340,"b442ca20")], md5w=['b442ca20'], audit=[39453],
 objects=[{"kind":"function","name":"public.debate_sight_links(text,integer,integer)","before":"75a7aa5b","after":"d43c0860"}],
 tests="live after-checks (W4 10256; W2 10340)", readbacks=[{"seat":"W2","result":"live d43c0860; base 75a7aa5b recovered","wall_id":10340}],
 run={"case":NR}, manuals={"engine_manual":"v226 (bb21ce44); size figure owed a correction (W2 10340 item 7)","op_doc":"not yet"}, status='read back',
 sources=[10253,10256,10257,10259,10340,"audit 39453"], builders=(['W4'],[{"seat":"W4","what":"wrote ASK 509","wall_id":10256}])))
def sight(ask,title,obj,words,t,rev,before,after,wid,match,rb,grade,src):
    R.append(dict(ask=ask,rev='A1',prior=None,title=title,objective=obj,met='yes',
     reason="Sight 1822 (kb_sights 2028) revision %d written by W3 under the operator's %s (%s, W4 thread), on W4's MATCH (%s): summary %s to %s. W2 graded it PASS for record accuracy (%d). The embedding was not refreshed."%(rev,words,t,match,before,after,grade),
     src=src, words=json.dumps(words), card={"answer":words,"thread":"W4","press_time":t,"source":"Wall %d"%wid}, owner='W3',
     plan={"what":"draft in the Wall post","wall_id":wid}, build=[{"what":"Sight 1822 revision %d"%rev,"md5":after}], revert={"what":"summary back to %s on the operator's word"%before},
     grades=[G("W4","MATCH (%s)"%match,int(match.split()[-1]) if match.split()[-1].isdigit() else wid,after),G("W2","PASS for record accuracy (11-23)",grade,after)],
     md5w=[after], audit=None, objects=[{"kind":"row","name":"kb_sights 2028 summary (Sight 1822)","before":before,"after":after}],
     tests=None, readbacks=rb, run={"case":"not applicable: a sight text revision"}, manuals={"engine_manual":"none","op_doc":"none"}, status='read back',
     sources=[int(x) for x in src.split(', ')], builders=(['W3'],[{"seat":"W3","what":"wrote Sight 1822 revision %d"%rev,"wall_id":wid}])))
sight(511,'Sight 1822 revision 7: "is of the Holy Ghost" is not a possessive',"Sight 1822 gains item (4) in its IN DEBATE head: \"is of the Holy Ghost\" (Matthew 1:20) is not a possessive; it says where the child is from, not whose child he is (Wall 10270).","put it in","16:09:01Z",7,"132799e1","53a93cc0",10271,"W4 thread reply 16:14Z",[{"seat":"W2","result":"item file ad6bdb02 matches","wall_id":10346}],10346,'10270, 10271, 10346')
R[-1]['grades'][0]['wall_id']=10271
sight(512,'Sight 1822 revision 8: "Son of man", dozens of times, five verses',"Sight 1822 gains a sub-item under point (1): Christ calls himself the Son of man dozens of times, with five of his own rows quoted whole (Wall 10271 item 2).","yes, we can say dozens of time and list like 5 verses","16:13:48Z",8,"53a93cc0","f9c42469",10272,"W4 thread reply",[{"seat":"W2","result":"item file 6ecd02c0 matches the guard","wall_id":10346}],10346,'10271, 10272, 10346')
R[-1]['grades'][0]['wall_id']=10272
sight(514,'Sight 1822 revision 9: Matthew 1:20 words and John 3:5-6',"Item (4) of Sight 1822 gains six lines: Matthew 1:20 is G1080 + G1537 + G4151; John 3:5, 3:6, Matthew 1:18 and John 1:13 quoted whole; \"The rows decide, not the lexicon.\" (Wall 10287)","Put it in","16:44:34Z",9,"f9c42469","ed7a8a8b",10287,"Wall 10286",[{"seat":"W4","result":"CONFIRMED","wall_id":10288},{"seat":"W2","result":"reversing the pairs gives f9c42469","wall_id":10352}],10352,'10286, 10287, 10288, 10352')
R[-1]['grades'][0]['wall_id']=10286
def q(s): 
    if s is None: return 'NULL'
    return '$t$'+s+'$t$'
def j(o): 
    if o is None: return 'NULL'
    return q(json.dumps(o,ensure_ascii=False))+'::jsonb'
out=["-- ASK AAR snapshot rows, DRAFT rev 5 (W3, 2026-11-23; replaces rev 4 db97670b (Wall 10377), which the live insert trigger refused: the three superseded 494 A2 grades now carry verdict_norm PASS, the verdict given, with superseded_by naming the correcting post; rev 4 replaced rev 3 d463fe94 (Wall 10373) on W1 10376 C1; earlier revs on W2 10367, W4 10368, W2 10370), for the coordinator (seat 36) to run once after W2's grade. NOT RUN.",
"-- Rows: 494 A2 (proven by run 40995; prior_row 32), 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515 A1, 515 r7, 516. Each field cites Wall ids or audit ids.",
"-- Not covered: ASKs 517 to 520 (held). The per-field sources are in each row's sources array.",
"-- Run from seat 36 in one call, then read the closing SELECTs in separate calls.",
"BEGIN;","SET LOCAL truth.session_id = '%s';"%S]
for r in R:
    out.append("INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES\n(%d, '%s', %s,\n %s,\n '%s', %s,\n '%s', '%s', %s,\n '%s'::jsonb, %s, '%s',\n %s,\n %s,\n %s,\n %s,\n ARRAY[%s], %s,\n %s,\n %s,\n %s,\n %s,\n %s,\n '%s', %s);"%(
     r['ask'],r['rev'],q(r['title']),q(r['objective']),r['met'],q(r['reason']),r['src'],S,('NULL' if r['prior'] is None else r['prior']),
     r['words'].replace("'","''"),j(r['card']),r['owner'],j(r['plan']),j(r['build']),j(r['revert']),j(r['grades']),
     ','.join("'%s'"%m for m in r['md5w']),j(r['audit']),j(r['objects']),j(r['tests']) if not isinstance(r['tests'],str) else j(r['tests']),j(r['readbacks']),j(r['run']),j(r['manuals']),r['status'],j(r['sources'])))
    bs,bsrc=r['builders']
    out.append("INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)\nSELECT s.id, NULL, ARRAY[%s], %s, '%s' FROM public.ask_aar_snapshots s WHERE s.ask = %d AND s.rev = '%s' AND s.aar_at = now();"%(
     ','.join("'%s'"%b for b in bs), j(bsrc), S, r['ask'], r['rev']))
out+=["COMMIT;","-- Separate calls after COMMIT:",
"-- SELECT id, ask, rev, prior_row, objective_met, status, md5_match FROM public.ask_aar_snapshots WHERE aar_at > now() - interval '10 minutes' ORDER BY id;",
"-- SELECT id, snapshot_id, builder_seats FROM public.ask_aar_builders ORDER BY id DESC LIMIT 16;",
"-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';",
"-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 35;"]
open('/mnt/project-files/aar/w3/aar_rows_1123_draft.sql','w').write('\n'.join(out)+'\n')
print(len(R))
