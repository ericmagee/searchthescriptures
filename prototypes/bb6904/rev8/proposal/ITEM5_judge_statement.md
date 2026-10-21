# BB-6904 revision 8, proposal item 5: the judge's written statement (7191; order 6904 (c) and (e)).
(a) and (b) are code, in patch_rev8.py (ITEM 5 block): the cure form asks every flagged judge for one line per item,
    STATEMENT: <the flagged item, as labelled> | <in your own words: why the line stands as you graded it, or what you corrected and why>
    the reply parser reads it; each verdict carries it (judge_statement); every report line prints "; JUDGE STATEMENT: <text>" or
    "; JUDGE STATEMENT: none written"; the transcript reads the field and shows it in its own column, "Judge's own statement".
    The ask's prompt text (the STATEMENT line and its sentence) is UNEXERCISED until the step 9 live run.
(c) Whether a statement can keep a line standing: the operator's choice (6904 (d)). Two options, each with its cost:
  1. A statement is recorded beside every item and never cures by itself; a line stands only through the checked forms
     (RESTATED, PRESSED, SHORT, CORRECTED, WITHDRAWN). This is what the code above does.
     Cost: a judge whose line is right but who cannot meet the form is not counted, and an alternate is seated in its place.
  2. A statement alone keeps the line standing, recorded for review (6904 (c) as first written: "cure ... or state why").
     Cost: any judge that writes a sentence keeps a broken line; the code cannot test the reason. On 27433 every deciding BROKEN line
     would have stood if its judge wrote one sentence, so the verdict the operator ruled wrong would stand.
  Recommendation: 1. It keeps the judge's words on the record (what (e) asks) without letting words replace the rule.
