# Why the closing enforcer confirms false contradictions, and a proposed fix (W2 study, 11-10; nothing built)

## Cases read
- 33442 link 3 (per-side send 1, and the combined send exec 34535): round 3 "LINK 3: NARROWED TO: Joseph is father only by supposition" against closing
  "D3. NARROWED TO: Joseph is father by supposition and by law only" and "I keep the naming ... only as Joseph's legal act".
- 33442 link 2 (per-side send 2): round 3 "John 3:6 ... is a second birth of a person already born" against closing "John 3:6 does not set a male
  begetter beside the Holy Ghost for this child". Why given: "the closing uses John 3:6 to exclude a male begetter".
- The 9 false and 5 doubtful stored anti-cheat pairs (pkgRAC/w2_read/reading_w2.md). In the pkgRAC replay (staged_w4/rac_replay_s107), the
  33222 pair (closing words inside the opponent's grants) was answered NOT A CONTRADICTION in both sends.

## Causes in the prompt (Close Enforcer Build, live s107)
1. The NOT-a-contradiction list speaks only of the CLOSING sentence ("when the closing sentence: ... states or quotes the other side's position").
   It says nothing when the EARLIER sentence is the opponent's words quoted in this side's round. 4 of the 9 false pairs, and W3's 33222 pair, are that.
   The replay shows the model already applies the rule when it is the closing sentence (33222, both sends).
2. "asserts again ... what it withdrew, dropped or gave up IS a contradiction" is read as "uses the same verse again". The model confirms when the closing
   only names the dropped verse in an answer heading (33218 A131, A135), answers it as before (33846 A57), or says what the verse does NOT show
   (33442 John 3:6). Nothing in the prompt says that naming or answering a verse is not resting on it.
3. The why field asks "why both cannot be true", which the model fills with a description of a difference ("adds", "uses", "an additional basis"),
   not a claim one sentence affirms and the other denies. Two agreeing sentences then pass (33371 A43, 33798 A67).
4. The Record cannot help: it checks that the quotations stand, the rounds and the link. Whether two sentences conflict is not checkable by code.

## 33442 link 3 is a different case
Round 3's own link statement reads "Joseph is father only by supposition" and names one dropped limb (Hebrews 7:14 "evident"); round 1 held
"only by supposition and by law"; the closing restores "and by law". By the prompt's own definition (two statements that cannot both be true) the two
link statements conflict, and the closing re-adds what the round 3 wording left out. My reading: TRUE on the text (W3 reads it doubtful).
The fix below is not expected to change it. Changing it needs a rule choice: "a narrowing withdraws only what it names as dropped". That is the
operator's rule to make, since it narrows his anti-cheat rule; I do not recommend it.

## Proposed fix: one sentence of the prompt replaced (code text otherwise unchanged)
OLD (250 characters):
It is NOT a contradiction when the closing sentence: grants, concedes, narrows or withdraws something; states or quotes the other side's position; answers a press with a further reason the earlier sentence leaves room for; or differs only in wording.
NEW (525 characters):
It is NOT a contradiction when: the closing sentence grants, concedes, narrows or withdraws something; either sentence states or quotes the other side's position; the closing names, quotes or answers a dropped verse without resting the dropped claim on it, or says what a verse does not show; the closing answers a press with a further reason the earlier sentence leaves room for; or both say the same thing.
CONFIRMED only when you can name the one claim one sentence affirms and the other denies; put that claim in the why.
Size (measured on live s107): prompt +275 characters per call, +550 per debate (one call per side); code +276; model calls 0.
No text-free fix was found: the faults are in what the model is told, and code cannot judge conflict. The size is the smallest form that names the three
missing cases; the old sentence is replaced, not kept.
Stacking: pkgRAC changes Close Enforcer Build too; the sentence is the same in both, so the fix builds on whichever is live.

## Replay that would prove it (DeepSeek relay, stored bodies, two sends each)
Bodies: the per-side closing enforcer body built with the new sentence for:
- false or doubtful targets: 33442 (John 3:6 line must not be CONFIRMED), and, built with pkgRAC's handed pairs, 33218 (A131, A135 false), 33299 (A37),
  33345 (A49), 33530 (A106), 33644 (A7), 33371 (A43), 33798 (A67), 33846 (A57): each must be NOT A CONTRADICTION in both sends;
- true controls in the same bodies, each must stay CONFIRMED in both sends: 33299 Genesis 3:15 (A33/A73/A83/A85), 33371 A60, 33798 A61/A63,
  33846 1 John 5:1 (A13/A19/A21) and Ezra 2:61 (A73/A75); plus 34108 (links 3 and 6), 33705 A49, 33482 A39, 33442 A83.
- Every other CONFIRMED NEW line read by hand: no new false line.
Count: 13 bodies x 2 sends = 26 calls with the new sentence. A control of the 9 pkgRAC bodies not yet sent, once each with the live sentence
(9 calls), shows the false pairs are confirmed today; without it a pass could be vacuous. About 35 calls in all.
Limit: two sends cannot prove stability; the call varied between sends in sets C and the combined replay.
