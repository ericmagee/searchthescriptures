# pkgLGS: late gate (ASK 191 option 1)

Builder: W1. Parent: s179 (n8n 25da10ec), file /mnt/project-files/wall2024/fetchback_live_s179.json.
Output: /mnt/project-files/w1/pkgLGS/parent_s179_LGS.json.

## What it does
A gate change that raises a new LIVE item (W3 2341) used to count against the judge at once. Now the judge gets one send-back on those late items before the count:

- New nodes on each path P ('', 'Alt ', 'R2 Alt '): P Late Gate Build, P Late Gate Needed?, P Late Gate Call openrouter.
  They are wired between P Gate Call openrouter and P Gate Record.
- P Late Gate Build re-reads the gate answers and finds each change left UNCURED only because it raised a new LIVE item.
  For those, it numbers the new items after the gate items (G n+1 ...) and sends one message. The body is the gate conversation plus the gate reply plus the late message.
- P Gate Record reads the gate replies by name. Its $input is now the late call.
  It runs gateCure2024 on the late reply. When every late item from one change is cured, that change becomes CURED and its count comes off.
  Otherwise the count stays, and a note is added to the change's reason.
- Records: E-GATE LATE audit lines, LATE rows (RECORD-ONLY), and seats[].late. A failed late call gives one 'LATE (no answer read)' row and leaves the counts as they were.
- There is no further round after the late call.
- A late CHANGE is added to sb_items exactly as a gate CHANGE is, whether it cures or not. Live s179 does the same for uncured gate changes.
- Panel Tokens counts the late calls.

## Checks (tests/)
Set LGS_DIR and LIVE_UN to scratch folders, then run in order:

1. cmp.cjs live new: rebuilds every map entry and lists the entries that differ.
2. t1.cjs: compares new Gate Record to live with no late call executed, and gives the Late Gate Build output.
3. t2.cjs RUN '' plants.json: runs the planted late replies.
4. kd2.cjs RUN plant: compares a plant's output to live and shows which differences are records only.
5. terr.cjs: the late call error path.
