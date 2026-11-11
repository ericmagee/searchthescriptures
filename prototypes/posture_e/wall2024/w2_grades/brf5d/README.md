# W2: Wall 4536 item 5d (pkgBRF rev 5 limits), measured on live s119 (C4 Build copy of C4P)
Scripts and outputs are in this folder. There are 9 stored executions and 18 distinct close texts.
## Limit 1: there is no cap on the book line's length
- Stored: 2 book lines (34726 and 34780 [DR4]), each 172 characters, each listing 2 verses. MEASURED.
- Planted (Q2): 10 earlier books each name 1:1, and the close writes "So 1:1". The line is 270 characters and lists 10 verses. The length grows by about 14 characters per listed verse. Its bound is the number of books that name the same chapter:verse.
- Reading: no stored case comes near a problem. No package recommended.
## Limit 2: an earlier bare reference under a borrowed book is listed as named earlier
- Planted (Q3): the earlier round has "Deuteronomy 20:7 governs the espousal, and 1:18 dates it." The close line says "Deuteronomy 1:18 named earlier", although no round names that verse under Deuteronomy. CONFIRMED.
- Stored: 0 listed verses whose only earlier naming had a borrowed book. MEASURED.
- Reading: the line still tells the judge to read the sentence. No package recommended.
## New finding (needs a second seat)
C4P.refs drops every reference to which the scoped parser gives no book. Such a reference is never marked NEW and never appears on a book line.
- This happens to a bare reference ("1:37", "(1:24)", "Then 5:9") when the text before it has no book in the same sentence. See Q5 and Q7.
- Stored: 175 such references in the 18 close texts. For 174 of them, the chapter:verse is named in an earlier round that the check reads, so nothing is lost.
- ONE is new: in 33497 [CR4], "the 'nothing shall be impossible' of 1:37". No earlier round names 1:37 under any book, and the close-round new-verse check never saw it. MEASURED.
- A related form (Q6): a bare reference in the sentence right after a book borrows that book. SENT is tested on a slice that ends before the head word, so the sentence break just before "So 1:18" or "Then 5:9" is never seen. Q6 prints "Luke 5:9" as a NEW PRESS. This is the 34726 cause, and rev 3c already lists it as a limit (a bare new verse is printed with the borrowed book).
