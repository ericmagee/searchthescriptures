# pkgR1 grade (W2, second grader beside W4): PASS

Package: pkgR1 (W1), commit a1f36bb4, Wall 4109. Write file pkgR1/parent_s106_R1.json on live s106.
Tool: pkgR1/w2_grade/w2_r1.cjs, written and committed (e7aee0e8) before the build was posted; run output w2_r1_run.txt.

- G1 structure: 418 nodes; exactly 13 nodes differ from live s106 (the Shared Library and the 12); names, ids, types, positions, credentials,
  all other parameters, connections and settings equal.
- G2/G3 rebuild (pkgLIB/unpack.cjs, independent of the pack check): every stub in the write file rebuilds its live s106 source byte for byte
  from the new Shared Library; the existing stubs are byte-equal to live. (My stub filter counts 41: Alternate Build's E4 head is not matched by it;
  G1 shows that node unchanged.)
- G4 runner model: each new stub names every literal $() node its source names, plus the Shared Library; no source reads $execution, $env,
  $prevNode or any $ name other than $ and $input.
- G5 behavior: base source against write-file stub, each through the runner model, on every saved run, with EVERY connected input that has a saved
  output (not only the first): 575 node runs, 575 byte-equal, 0 base errors. R2 Alt nodes fed the Alt runs' data by name map. Judge Enforcer Build:
  8 runs skipped (no saved Enforcer Record output).
- G6 size: Code node text 4,962,113 -> 3,838,493 = -1,123,620 characters (reproduces W1's figure); node parameters -1,146,329; prompts 0; model calls 0.
- G7: stub rebuild median 3.64 ms on the R1 library in my harness (W1 time_R1: 3.15 vs 2.44 ms live).

Write-order check (added): a new stub with the OLD Shared Library throws "the Shared Library holds no entry for Send Back Record"; every existing
stub rebuilds identically on the old and the new library. So the Shared Library written first, or all 13 together, is safe; a stub written
before the library fails its node. Matches W1's stated risk.
