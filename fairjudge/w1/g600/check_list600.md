# W1 check: ASK 600 storage list (Wall 11500)

GRADE: PASS with F1 and F2. list600.md 759c591b; dups600.tsv (876 lines).
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: the build rule; the scope rule; verify before asserting; only git survives; the AAR record rules (paths with md5s).
OBJECTIVE MET: yes, as a read-only list. Nothing was deleted.

## Checks
- Three duplicate groups were sampled from dups600.tsv and hashed by W1, the duplicate and its KEEP each time: md5 equal in all three (9f7be416, 57bdda9f, 22486ae3).
- Paths that scripts read, looked up in dups600.tsv (below).

## F1. Step A breaks scripts that read a duplicate by its path
dups600.tsv marks as "DUPLICATE OF THE KEEP" files that live scripts open by literal path:
- ask587/w4/write/prewrite_eng587.json and prewrite_child587.json. Proof 3 of the ASK 596 standing set reads these.
- ask590/w4/fix1500/base_eng.json. write586j1.sh reads it as a base.
A ".dup" pointer serves a person, not a script: JSON.parse of the pointer fails.
Fix: before the card, scan every .cjs, .js, .sh and .py under /mnt/project-files/standing, the ASK folders and the repository for literal paths. Keep every copy a script names, by making that copy the KEEP, or by leaving it in place. List the count kept for that reason. Proof: run the standing set and the open build tests after A on a dry list.

## F2. Step B breaks the record's paths
AAR rows (ask_aar_snapshots build_files, revert) and Wall posts name files by path and md5. gzip renames x.json to x.json.gz, and the .gz has a new md5.
Fix: write one index file (path, md5 before, md5 of the .gz) and name it on the card. Or gzip only files that no AAR row names: check build_files and revert in ask_aar_snapshots first. The same scan should cover the ".dup" step for any path an AAR row names; there the pointer is enough, but the card must say so.

## Note
Step C (keep fewer copies from now) changes the write scripts. It needs its own build and grade before it is used. It is not covered by this check.
