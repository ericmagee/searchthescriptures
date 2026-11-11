## pkgRRT: the second reading does not ask DeepSeek about a retraction

Where: Reread Build, Alt Reread Build and R2 Alt Reread Build, with their three Record nodes (pkgVP1 second reading, record-only).

What changed: a replaced line that begins "RETRACTED:" is set aside before the second-reading call. That covers a bare retraction ("RETRACTED: D1 vs C6") and one followed by its reason. A retraction carries no grade to read again. Each line set aside is written as a reread row "SECOND READING NOT MADE (pkgVP1; RECORD-ONLY): the replaced line is a retraction, which carries no grade to read again (pkgRRT): <the line>". Before this package DeepSeek was asked about it and answered NO ANSWER every time (8 of 8 stored lines). The Record now also writes the not-made rows when the Build skips the call altogether, so that a reread in which every line is a retraction is still recorded. Before this package, a skipped reread wrote no rows.

Size (measured): +1,578 characters of code across the six nodes (+400 per Build, +126 per Record); prompt instruction text 0; second-reading input smaller (run 35173: -6,489 characters).

Limits: record-only, as all of pkgVP1. The collision line that a retraction accompanies is still read in its own item. The skip-branch change also records the other not-read reasons (calls not readable, no ITEM block) that a skipped reread used to drop.
