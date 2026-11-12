# pkgKGL: the key-word reader takes the same grant sentences as the grants list (ASK 129, option 1)

- Parent: fetchback_live_s163.json (live s163). Output: /mnt/project-files/wall2024/parent_s163_KGL.json.
- Changes only the Shared Library: three lines of kwLines421 (library lines 2218, 2219, 2221, 0-based). MAP lengths and the library sha recomputed as pkgOAD.
  1. The verb line: up to two adverbs between "I" and the verb; admit, retract, give up, no longer rest added (the live pkgGAV rev 3 line; set aside left out).
  2. The heading check takes the new verbs and up to two words before them; the live pkgKWH rule stays (a heading is skipped only when a grant verb follows under it).
  3. The pkgGAV skips: a verb list ending in none/nothing/no; a question; a sentence opened by If/Unless/Should/Nor with no comma, semicolon or colon before the verb.
  4. A new-form match does not take one of the 10 item slots per side, so every live item stays (without this, 6 stored items were pushed out).
- Size, MEASURED: library code +1,220 characters. Prompt: K-W item lines and audit marks +5,016 characters over the 81 stored runs of corpus2 (8 runs gain one item each, 0 lost), per payload that carries them.
- Proof: test_KGL.cjs, plants 37 of 37; the key-word reader equals the grants finder on every plant except headings, where the live pkgKWH rule differs (old behaviour, unchanged).
- Not in this package: "I accept that", "I agree that" (held by the team for a later package).
