// W2 replay, Wall 6705 item 3: which K-UNX path luna's 40012/40013 count line takes on s209 (UNXA_ASM = /\bASSUMES\b/, case-sensitive).
const UNXA_ASM=/\bASSUMES\b/, UNXA_UNA=/\bunanswered\b|\bno\s+answer\b|\bnot\s+answered\b/i;
const lines={
 actual_40012:"CONCEDED LINKS: 2 -- Premise 5: UNEXHIBITED (assumed Davidic descent through Mary, with no quoted row establishing it); Premise 6: UNEXHIBITED (same assumed fact).",
 form_ASSUMES:"CONCEDED LINKS: 2 -- Premise 5: UNEXHIBITED; ASSUMES: Mary is of David's line, which no quoted row gives; Premise 6: UNEXHIBITED (same).",
};
for(const [k,t] of Object.entries(lines)) console.log(k, "ASSUMES path:", UNXA_ASM.test(t), "| unanswered path:", UNXA_UNA.test(t), "->", UNXA_ASM.test(t)?"K-UNX-A (assumed-fact reason accepted with the block's [L1] quoted)":UNXA_UNA.test(t)?"unanswered path":"plain path: must name a missing layer or drop the premise");
