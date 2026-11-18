# ASK 423: OBJECTIVE line (W3, added 11-18 17:44 CST, after the write at 17:06 CST and before any run)

ASK 423 went live (engine db091b9e) from plan rev 1 and rev 2, which carried no OBJECTIVE line (operational_doc section 29; W1 8935, W2 8936). This line is added for the next run's objective check. It was written after the write, not before it.

OBJECTIVE. A link label the debaters write as "LINK D<n>" or "LINK C<n>" is kept as "LINK <n>" inside the side's own chain, so the assumption check and E-PREM find each premise's answer block. Expected effect: in a run where the labels carry the side letter, no premise reports "(no LINK n block found)" for a block that exists, and the review notes carry an "AUDIT v27: LINK LABELS (<round>, ASK 423)" line naming each rewrite.
