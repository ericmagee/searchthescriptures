# pkgOCB rev 2: new_press leaves out the CONTRADICTIONS quotations (W1's fold-in, Wall 3751)

Builder W4. Base: live s85 (654efffd, 402 nodes). Record field only.

C4, C4G and C4B Extract keep a local copy `__ogrS2`, used only for the record field `new_press`. It blanked only the GRANTS quotations, so an X line
quoting a verse the challenger never named was listed as a NEW PRESS. Rev 2 makes `__ogrS2` the same two-section blanking as the live `__ogrS`
(read from C4 Extract itself, renamed). No node reads `new_press` by name; the judges' fresh-verse check already runs through `__ogrS`.

Build: `python3 build_OCB2.py /mnt/project-files/wall2024/fetchback_live_s85.json parent_s85_OCB2.json` (each anchor once, in each node).

Proof, t_ocb2.txt, 8 OK: only the three Extract nodes change; X and G quotes both blanked in each; real 34108 C4 Extract byte-equal to live;
a planted X line quoting Obadiah 1:4 is in live new_press and not in rev 2's, every other field equal; 35 saved runs byte-equal (4 skipped, live also cannot run).

Manual: no change to the manual text (the pkgOCB part already says the CONTRADICTIONS quotations are blanked wherever the Oracle's text is read as its own).
