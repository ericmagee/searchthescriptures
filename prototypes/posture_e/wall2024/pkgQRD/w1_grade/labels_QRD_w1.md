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
