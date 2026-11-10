# W3 grade of pkgKRO rev 1 (W4, commit f3258e83): PASS (record-only)

## Scoreboard
- My 126 correct answers of the pkgFUN grades (good2 to good7), through the nodes on pkgKRO (w3_plant_KRO_tables.txt): 126 CURED, 0 refused. These include every answer that failed pkgFUN revs 2 to 7.
- My 14 new correct answers (w3_good_kro.json; w3_plant_KRO_new.txt): 12 CURED (live cures 2 of them). Not cured: "Not counted before. COUNTED now." and "NOT COUNTED in my first answer; COUNTED now."; live refuses both too. pkgKRO is NOT WORSE THAN LIVE on any correct answer I have (reader level over W2's 287, W4's 59 and all my tables, w3_caps_idea.txt: 375 correct, 3 not cured, none of them cured by live; live leaves 36 uncured).
- Reason prefix: every CURED row begins "answered: the close concession is counted"; the three library tests of it are prefix tests (/^answered: the close concession is counted/), unchanged.
- Write file against live s103: only the Shared Library differs; 418 nodes; connections equal. Rolled-back insert of a noted CURED row and an UNCURED row: rows 2, recorded true.

## Cost, for the operator's choice: refusals that now read CURED
W4's count stands (kro_refusals_cured.txt). From my 13 new refusals, 6 that live enforces now read CURED, each with the note:
"It is not counted." / "This should not be counted." / "I have not counted it and I will not." / "Never counted." / "It cannot be counted here." / "The defender asks that it be counted; I decline."
Still UNCURED: "NOT COUNTED.", "Not counted. It is a courtesy.", "TOUCHES NO LINK." alone, "Uncounted.", "I refuse.", "No."
A CURED reading means the system takes the close concession as counted for that judge. So under pkgKRO a judge who refuses in a sentence holding the word "counted" is treated as having counted it, as before s96.

## Two improvements W4 may take (not conditions of the PASS)
1. Take the keyword in CAPITALS only, and refuse capital NOT COUNTED anywhere (w3_caps_idea.cjs, reader level): the 6 refusals above and "Counted." read UNCURED again as live; no correct answer that live cures is lost; lower-case correct answers ("Yes, counted.", "It is counted against D6.") stay uncured as on live. W2 has already ruled that the rule asks for COUNTED in capitals.
2. The note fires only where the live strict test refuses. A refusal after a clean opening ("COUNTED. I refuse.", "COUNTED. My count stands.") reads CURED with NO note, on live as well. If the notes are to show how judges word refusals, add the pkgFUN rev 7 reading as a second note.

## Limits for the manual
An answer that opens with NOT COUNTED is refused even when it goes on to count. An answer with no COUNTED word is refused ("I count it against D6.").
