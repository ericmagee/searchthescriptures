import hashlib
v=open('v169.txt',encoding='utf-8').read()
E='''  - THE COUNT LIST NOTE IS CUT FROM THE ROUND TEXT (pkgACT part 1, ASK 273; Shared Library line 1891, the round parser; 12 round-parser users):
    - Why: the note that pkgCLN appends after [DR1] came back inside the [DR1] round text the parser returned.
    - What it does: beside the CLOSE-ROUND and LINK-ROUND FORMAT CHECK cuts, the parser also cuts "\\n\\n[COUNT LIST NOTE". An inline "[COUNT LIST NOTE" with no blank line before it is kept.
    - Size: LIB 1891 284 to 376; inside the pkgACT part 1 library total (927,952 to 928,397, sha d537e25d805e1cf6).
    - Not shown by a run: live and unexercised at s199.
  - THE E-SYN SIDE IS THE SIDE WORD NEAREST BEFORE THE GIVE-GROUND WORD (pkgACT part 1, ASK 275; Shared Library line 3159; RECORD-ONLY, ruling 428):
    - Why: a synthesis sentence holding two side words was given the first side word, so "The challenger's close restated C1-C6 and listed the defender's grants" was read as the challenger giving ground.
    - What it does: inside the matched span, the side is the side word nearest before the give-ground word. A possessive side word ("the challenger's links") counts only when the give-ground word follows it directly ("the defender's grants").
    - Size: LIB 3159 76 to 423.
    - Shown offline: of 303 stored E-SYN rows, 8 change side, all now right; of 56 synthesis sentences with two side words before a give-ground word (30 days), none goes from right to wrong.
    - Limits: "The challenger answered the defender and conceded C3" now reads as the defender (wrong); a passive "conceded by the challenger", and a sentence whose only side word is possessive, stay as before. Not shown by a run.
  - A CITATION OF ISAIAH 28:10 OR 28:13 AS METHOD IS NOT A NEW PRESS IN THE CLOSE (pkgACT part 1, ASK 276; fresh() in Build Synthesis, Build Independent Verdict, Build Save Body, Panel Build, Format Markdown, D4 Extract, C4 Extract, C4G Extract, D4B Extract and C4B Extract):
    - Why: DG-61 holds Isaiah 28:10 as the method. A close line such as "Precept upon precept (Isaiah 28:10), the rows stand together" was listed as a new press.
    - What it does: in a sentence with no MEANS and no [L1] to [L4] tag, an Isaiah 28:10 or 28:13 reference is replaced by "(method verse)" before the new-press test. A row with "-- MEANS" or a layer tag still counts, as do other verses on the same line. A bare "I press Isaiah 28:10 against the reading" also leaves the list: it lays out no reading of the verse, and it weighs nothing as a chain.
    - Size: +294 in each of the 10 nodes (one fresh() body, identical in all).
    - Shown offline: of 22 close-round lines citing Isaiah 28:10 or 28:13 in 60 days, the 21 with no MEANS or tag leave the list; the tagged one stays. On run 37032 the new-press list goes from ["Isaiah 28:10"] to empty.
    - Limits: a row whose "-- MEANS" sits on the next line also leaves the list (0 stored); "(Isa. 28:13)" and "Isaiah 28:9-10" still count, as before; a sentence that applies the verse's words to the topic with no MEANS is not seen. No footing check reads the new-press list.
  - A COUNT THAT STANDS AFTER ITS ONLY NAMED VERSE STOPPED FAILING IS RECORDED (K-CNT; pkgACT part 2, ASK 274; Shared Library line 1562, cureRewrite, after the K-RECHK lines; 6 users; TRIAL, record-only):
    - Why: in run 37032 luna kept premise 2 counted UNEXHIBITED although the change moved its only named verse, Luke 1:13, to MEETS.
    - What it does: when a RULING card "Premise N -- UNEXHIBITED" names verses in its NAMED BY line, every one of them had a BROKEN collision line or a MISSES/FAILS answer check moved to a non-failing grade in this change, and no failing line on that verse remains, a K-RECHK row is written: "Premise N is still counted UNEXHIBITED, but its NAMED BY line names only <verse>, and this change moved that grade (...); the count is not re-derived". counted_premises, conceded_links, the RESULT line and the ruling cards do not change.
    - Size: LIB 1562 536 to 3,513; Shared Library 928,397 to 931,428, sha a894ff926b24be72.
    - Shown offline: of 71 change pairs in the 7 matching judgments of the newest 40, 1 flag (luna, run 37032, premise 2).
    - Limits: RESULT and ruling-card prose are not re-checked; the count is not re-derived; a range in NAMED BY (\"Luke 1:13-15\") is read as its first verse only; a failing FORCED line left on the verse does not stop the line (the still-failing test reads ANSWER CHECK and collision lines only). Not shown by a run.
'''
anchor='\n\n## 10. The panel\n'; assert v.count(anchor)==1
v2=v.replace(anchor,'\n'+E.rstrip('\n')+anchor)
old='- Live flow: s198 (n8n version eaeb774a, 455 nodes; Shared Library 927,952 characters, sha c7e7505f6d74d860).'
assert v2.count(old)==1
v2=v2.replace(old,'- Live flow: s200 (n8n version 47809843, 455 nodes; Shared Library 931,428 characters, sha a894ff926b24be72).')
old2=' + pkgNRW rev 3 (s198).'; assert v2.count(old2)==1
v2=v2.replace(old2,' + pkgNRW rev 3 (s198). s200 = s198 + pkgACT part 1 (s199) + pkgACT part 2 (s200).')
open('v170.txt','w',encoding='utf-8').write(v2)
print(len(v),len(v2),len(v2)-len(v),hashlib.md5(v2.encode()).hexdigest(), v2.count('—'))
