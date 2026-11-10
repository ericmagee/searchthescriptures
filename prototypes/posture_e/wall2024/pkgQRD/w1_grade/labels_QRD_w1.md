# W1 labels for pkgQRD (W2, item C option 1), committed before any run. Write file pkgQRD/parent_s110_QRD.json on fetchback_live_s110.json.
D1 Only QR Check and QR Final differ from s110; connections equal; sizes measured; the redirect sentence is the only new prompt text.
D2 34299 as stored: chatgpt and sol returned on the defender side naming CR3 and CR4; luna not returned; checks, faults and every other field as live.
D3 Plants on QR Check (first questions):
 a. containment either way (shorter earlier quote inside the other judge's; shorter closing quote inside) -> returned;
 b. same rounds, quotes that do not contain each other -> not returned;
 c. same quotes, a different earlier round -> not returned;
 d. all three judges with one question -> the first in seat order stands, the other two returned;
 e. a judge returned for a fault on the same side that also repeats -> one return, the sentence once;
 f. the repeat on the challenger side -> the sentence names the challenger;
 g. case or end-punctuation differences only ("father." vs "father") -> recorded as found (repeat or not), not a fail.
D4 QR Final, a side returned only to redirect: second reply with no question for that side, empty reply, failed call, or unparseable JSON -> the first question kept, never dropped.
D5 QR Final, second reply passes with a different contradiction -> used; the same question again -> used; fails -> first kept (as W2 states).
D6 A side not returned keeps its first question whatever the second reply holds for it.
D7 The live behaviour for faults alone (no repeat) is unchanged: a stored-style fault-only return gives the same QR Final output as live.

## Rev 2 additions (W3 finding, Wall 4196), committed before any run on rev 2 (commit 4d105506)
D8 Faulted asker. All plants: chatgpt and sol hold luna's defender question on CR3/CR4.
 a. luna faulted on its challenger side only -> luna does not count; chatgpt stands (not returned on the defender side); sol returned naming the pair.
 b. luna faulted on its defender side (its defender question fails) -> luna does not count; chatgpt stands; sol returned.
 c. luna and chatgpt both faulted on their challenger sides -> no defender redirect; sol keeps its question.
 d. all three faulted on their challenger sides -> no defender redirect at all.
 e. luna unfaulted (as stored) -> rev 1 behaviour unchanged: chatgpt and sol returned.
D9 End to end (QR Check then QR Final), for D8a and D8c with luna's second reply: failed call, not JSON, and passing with a different defender question.
 At the end, the number of judges whose defender record still asks about the CR3/CR4 pair is at least 1, wherever live has at least 1. A drop to 0 is a FAIL.
D10 D1 to D7 rerun on rev 2 unchanged.

## D11 (after W3's R12, Wall/commit 8a6d1c31), committed before my run of it
D11 Chain: luna quotes passage A, sol quotes passage B, chatgpt quotes A and B as one passage, all on CR3/CR4, all fault-free.
 After QR Final with each redirected judge switching to another pair, at least one judge still asks about B wherever live has one. 0 is a FAIL.
