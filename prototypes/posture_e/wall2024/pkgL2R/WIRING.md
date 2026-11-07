# pkgL2R: [L2] roots and refusal rows (W3 queue B4, hermes 3 #4)

Code only, no wiring change. 56 nodes: the 55 that hold the [L2] library L2C (one identical copy each) and Build Save Body.

## What 33175 shows (replayed on its stored rounds and the map rows of every cited verse; the live library reproduces the stored 112/108/4/0)
- DR1 enomizeto (G3543) at Luke 3:23: a FALSE refusal. G3543 stands in Luke 3:23 and Acts 16:13. The tag was refused only because it
  also names the root, "from *nomos*", and G3551 stands in none of the cited verses.
- CR1 parthenos (G3933): a TRUE refusal. The refused tag is premise 6 of the CR1 premise list, which cites Matthew 1:18, Luke 1:35,
  Galatians 4:4 and Matthew 1:25; none carries G3933. The section-2 tag (block Luke 1:27 and 1:34) is a different tag and was COUNTED.
  A multi-verse block is already read against every verse it cites (the candidates are pooled); no binding fault was found.
- CR1 lambano (G2983) and CR4 pater (G3962): true refusals, as hermes said.

## Changes
1. A word named only as the root of another ("from *nomos*", "from the root X", "derived from G3551", and a number in parentheses just
   after such a word) is marked root. A root not in a cited verse does not refuse the tag; the tag's other words decide it. A tag of
   roots only is read as before. Side-neutral: debater rounds (Citation Scan / L2 Count Plan) and judge lines (K-L2, Send Back l2) use the
   same library.
2. Each matched word carries the verses it stands in (in). The AUDIT v28 [L2] CHECK line names, per refusal, the tag's words, the verses
   it was bound to, and each word's map verdict. The why strings keep their form.

## Build and test (from wall2024/)
    node pkgL2R/build_L2R.cjs [in] [out]   # default: fetchback_live_1b49671d + pkgSLA (= live n24); edits are text-exact, any order with pkgPTA
    node pkgL2R/test_L2R.cjs               # 17 OK: of 112 tags in 33175 exactly one changes (DR1, NOT COUNTED -> COUNTED)
