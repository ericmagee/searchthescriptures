# BB-6904 revision 8, option 1 fix (7256, 7258): FILES ONLY, nothing written to n8n. Base: published 804b870a (the composed files
# verified equal to it, BB-7238/7243). Built by Worker_E; Worker_A3 verifies.
patch_fix.py: K (17 nodes): drvExhibits's cut "\.\s" becomes "(?<!\.)\.\s", so the period ending an ellipsis does not cut a layer's text.
              S (Format Markdown): fromNode names any read that throws or returns nothing under "*Reads that gave no text:*" in the item 8
              section, instead of returning null silently.
patched/: the 18 nodes after the patch. test_fix.cjs -> TEST_RESULT.txt. HARNESS_FIX.txt: harness_rev8 with the fixed module, identical to
HARNESS_RESULT.txt. LIMIT: a read that returns an object with an empty judges list is still not named (fromNode sees an object).
