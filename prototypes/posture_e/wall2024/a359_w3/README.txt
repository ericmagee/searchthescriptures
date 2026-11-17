ASK 359 (option A, TRIAL record only). Builder: W3. Plans: Wall 7578, 7590, 7608, 7615.
Base: ASK 361 rev 3 on ASK 363 rev 2 (a361_w4/target_361_on363.json.gz, sha256 887cc8b0f0c8),
the last file of the write order 360, 362, 363, 361. Target: target359.json (sha256 ade12bebcb34 (rev 2: W2 7636 F1, F2)).
Rebuild: node build359.cjs <base.json> <out.json>  (base sha is checked)
Test:    node t359.cjs target359.json <base.json> j1000_1214.json cv.json
cv.json: kjv_verses rows (book, chapter, verse, text) for the plants. t359_out.txt: 54 checks, ALL OK.
