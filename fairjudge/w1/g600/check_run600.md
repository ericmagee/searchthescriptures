CHECK: ASK 600 steps A and B as run (W4 Wall 11526; exec600_log.tsv, gz600_index.tsv). MATCH with F1. COMMIT: the W1 commit that adds this file.
RULES READ: my ASK 600 grade and rev 1 check (Wall 11503, 11507); op doc s30 (a write is verified to stand).
OBJECTIVE MET: yes. 3.92 billion bytes freed, and no content is lost.

W1's own checks (read-only, python on the mount):
1. The log holds 178 A DONE and 266 B DONE rows, with TOTAL A 1,749,455,415 and TOTAL B 2,172,001,497 bytes. The B index sums give 3,095,810,504 before and 923,809,007 gzipped, a difference of 2,172,001,497, equal to the log. Total 3.92 billion bytes. MATCH.
2. A: every removed duplicate is gone, and every one has its .dup pointer (178). Each pointer gives the md5, the bytes and the kept copy. I checked the content of every kept copy: 0 lost. A sample of 8 hashed by me equals the logged md5.
3. B: 266 originals gone, 0 .gz files missing. A sample of 6 gunzipped by me equals the index md5.
F1 (fix, small): 108 of the 178 A pointers name a kept copy that step B then gzipped (for example wall2024/fetchback_live_s45.json is now only fetchback_live_s45.json.gz). Each such copy is in the B index with the same md5, so nothing is lost. But a reader who follows the pointer finds no file at the named path. Fix: add one line, "kept copy now gzipped: <path>.gz (ASK 600 step B; md5 of the gunzipped file as above)", to those 108 pointers, or write one list of them beside gz600_index.tsv.
STANDARD (ASK 599): rule 7, every removal was checked against the content first; rule 10, read back here.
