import hashlib
v=open('v170r6.txt',encoding='utf-8').read()
assert hashlib.md5(v.encode()).hexdigest()=='c395d83140583f275ed18f3becfe04e1'
E='''  - THE ANSWER CHECK ROUND LABEL RECORD MOVES TO ALTERNATE MERGE, AND READS A LABEL WITH A TAIL (pkgACL2, ASK 287; Alternate Merge and Build Save Body; TRIAL, record-only):
    - Why: in run 37113 (s205) no AUDIT v51 line could be written. pkgACL read $('Alternate Merge') from Build Save Body, but Alternate Merge runs after Build Save Body (Build Save Body > Save to DB > ... > Panel Build > ... > Alternate Merge). The read threw inside try/catch, so the s201 line was dead on every live run. Also, sol writes its labels as "[CR3, defender Premise 1]", which the bare "[CRn]" match skipped (56 of 56 sol lines in 37113).
    - What it does: the v51 block is removed from Build Save Body. Alternate Merge runs its own code unchanged, then reads the eight rounds from $('Build Save Body') (an ancestor) and checks each judge body's verdict_raw as pkgACL did. Up to 12 v51 lines per seat are appended after the judge's text in that seat's verdict_raw, which Write Judgment 1 to 3 store. The label match takes "[CRn]", "[CRn, <tail>]" and "(CRn)", still at line start. "RESULT" inside a quoted answer is lowercased in the line. A body with no flag is returned unchanged.
    - Size: Build Save Body 81,554 to 79,946 (-1,659 with the marker); Alternate Merge 3,072 to 5,068.
    - Shown offline: run 37032 gives luna 11, chatgpt 0, sol 0 (88 of 93 sol lines now labelled). Run 37113 gives 0 for every seat (labels read: chatgpt 77, sol 56, luna 58).
    - Limits: the line lives in each judge's verdict_raw, not in review_notes; on a run that reaches Anticheat Resume by the regrade path (Close Enforcer Record > Regrade After Quotes?) without Build Save Body, the read fails silently and no line is written (mark v51 UNEXERCISED there); on the plain return path the block sets bodies on Alternate Merge 1's own json object (effect not measured). Not shown by a run.
  - THE ORDER STATEMENT LIST ALSO SPLITS A SENTENCE AFTER A CLOSING QUOTE (pkgORD2, ASK 288; Build Save Body, inside the pkgORD block):
    - Why: in run 37113 the defender's round 2 held "Genesis 4:1: "And Adam knew Eve his wife; and she conceived." Here the knowing comes first and the conceiving after." The split needed the sentence end right before the space, so the order sentence stayed joined to the quoted verse and was skipped for its reference and quotation. The case was in scope and was missed (a FAULT of pkgORD).
    - What it does: the sentence split (?<=[.!?])\\s+ becomes (?<=[.!?]["”'’)\\]]*)\\s+, so a sentence also ends after a closing quotation mark, bracket or parenthesis.
    - Size: Build Save Body +34 (+10 the pattern, +24 the marker).
    - Shown offline: run 37113 0 to 1 line (the CR2 sentence above, true by Genesis 4:1); over 61 stored debates, 11 to 13 debates with a line, all 12 earlier sentences kept, 2 added ("Betrothal comes first and the taking follows.", true by Matthew 1:18 and 1:24; "The forming comes first and the sanctifying second.", which goes beyond Jeremiah 1:5).
    - Limits: as pkgORD. Not shown by a run.
  - THE E-ANS ITEM READER ALSO TAKES A LABEL WITH A TAIL AND A PARTLY QUOTED MEANS (pkgEAL rev 2, ASK 289; Shared Library line 2977 and its use at 2979):
    - Why: in run 37113 the E-ANS groups held 59 answer checks, all chatgpt's. sol's "[CRn, <tail>]" labels and luna's partly quoted MEANS did not match the reader, so no sol or luna ANSWER CHECK line was sent to the enforcer: two of three seats went unchecked by E-ANS.
    - What it does: when the existing pattern AC does not match, a fallback __ac2 reads "[CRn, <label tail>]" and a MEANS that is not wholly quoted, up to "-- ANSWER:". One pair of outer quotes is stripped only when the MEANS is wholly quoted with no inner quote of the same kind. AC is tried first, so every line it read before is read the same way.
    - Size: Shared Library 931,428 to 932,018 (built alone on s205).
    - Shown offline (rebuilt stubs, run in line order): run 37113 groups 59 to 152 (chatgpt 61 to 61, luna 0 to 58, sol 0 to 56), all 59 earlier groups kept; run 37032 172 to 172 groups, byte-equal.
    - Limits: whether a send-back item ever carries the tail form is not measured; more groups mean more E-ANS prompt text per run (not measured). Not shown by a run.
  - THE CURE ROUND PARSER ALSO CUTS THE COUNT LIST NOTE (pkgCLN2, ASK 290; Shared Library line 858, cureRounds):
    - Why: in run 37113 chatgpt's E-SYN item Y1 listed "[COUNT LIST NOTE -- computed by the system ...]" as the first of the challenger's own sentences that give ground. The s199 cut (ASK 273) went into the round parser at line 1891 only. cureRounds, which feeds cure.rounds and from there the E-SYN side sentences, still returned the note inside [DR1]. It moved no count.
    - What it does: after the COUNTING RULE cut, cureRounds also cuts at "\\n\\n[COUNT LIST NOTE", as line 1891 does. An inline note with no blank line before it is kept.
    - Size: LIB 858 192 to 284 (+92); MAP n +92 for its 12 users (Cure Build, Cure Check, Panel Cure Build 1 to 3, Panel Cure Check, Alternate Cure Build, Alternate Merge Seat, Alternate Merge 1, R2 Alternate Cure Build, R2 Alternate Merge Seat, R2 Alternate Merge); Shared Library 931,428 to 931,522 built alone on s205.
    - Shown offline: the 37113 Y1 replay lists the LINK 3 and C3 narrowings only; [DR1] equals the stored round; [CR2] unchanged.
    - Limits: the LINK-ROUND FORMAT CHECK note is cut at line 1891 but not here (0 times in the 37113 enforcer prompts). Not shown by a run.
'''
anchor='\n\n## 10. The panel\n'; assert v.count(anchor)==1
v2=v.replace(anchor,'\n'+E.rstrip('\n')+anchor)
# pkgACL entry: note it was dead on s201-s20x
a="    - Limits: an answer found in no round, shorter than 5 words, or not quoted, and a line with no [CRn] or [DRn] label, are skipped with no record; whether every panel seat's body is in Alternate Merge's bodies on a live run is not measured. Not shown by a run."
assert v2.count(a)==1
v2=v2.replace(a,"    - Limits: an answer found in no round, shorter than 5 words, or not quoted, and a line with no [CRn] or [DRn] label, are skipped with no record. As built here the line could not be written on a live run (Alternate Merge runs after Build Save Body; run 37113, FAULT by structure); see pkgACL2 below.")
open('v171_draft.txt','w',encoding='utf-8').write(v2)
print(len(v),len(v2),len(v2)-len(v),hashlib.md5(v2.encode()).hexdigest())
