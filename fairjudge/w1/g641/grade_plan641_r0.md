# GRADE: ASK 641 plan rev 0 (ask641/w4/plan641.md 24d6f455, commit 67f0a19c)
PASS WITH N1.
Checked in live ccaf4660: Panel Tokens is 8,795 characters with 105 literal $('...') references; existing library stubs (for example Gate Record) open with an if(false){$("..."); ...} list of every node the entry reads, then rebuild the entry from Shared Library and run it.
N1: the n8n task runner sends a Code node only the node data its code names literally. The two new stubs (Panel Tokens and Salvage Tokens) must carry, in their if(false) list, every node name the Panel Tokens body reads, and C4 must test that the stub's literal set equals the body's $('...') set. An offline replay cannot show this; a missing name would make the collector skip that node silently (it runs behind isExecuted/try), so costs would drop with no error.
NOT CHECKED: the record_debate_row_tokens body (null-token UPDATE behaviour); the salvage path wiring.
STANDARD (ASK 599): one copy via the library is in line; graded on the build.
