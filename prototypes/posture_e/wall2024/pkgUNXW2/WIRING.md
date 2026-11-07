# pkgUNXW2: unxLack reads two more phrasings (W3 2747 item 2 follow-up)

W3 found that unxLack missed "nothing for [L2]" and "L2 absent" (no "is"). Each left a true statement UNCURED. The fix is two anchors inside unxLack, in the 19 cure nodes:
- "nothing" joins the lack words read before a tag.
- After a tag, "is" or "are" becomes optional before missing, absent, lacking or not exhibited. So "[L2] missing" and "L2 absent" now read as named missing.

**Base.** pkgRCK/out, which is W1's build output: live 5a710187 + UNXS + UNXW + RCK 0d3cc45. It is not committed, so run `node pkgRCK/build_RCK.cjs` first, then `node pkgUNXW2/build_UNXW2.cjs`. Note: the committed pkgRCK/patched and plan_RCK.json are the older K-RECHK package of the same name (Wall 2493, base pkgKCL). They are not W1's 0d3cc45. Write order: UNXS, UNXW, RCK (from pkgRCK/out), then UNXW2.

**Test.** `node pkgUNXW2/test_UNXW2.cjs` gives 16 OK:
- 9 unit cases: W3's 3 controls, the 2 missed forms, a third no-"is" form, and 3 earlier cases that are unchanged.
- A1: each file differs from pkgRCK/out only inside unxLack.
- Parity of Panel Cure Check and Alternate Merge Seat on 33218, 33222 and 33249.
