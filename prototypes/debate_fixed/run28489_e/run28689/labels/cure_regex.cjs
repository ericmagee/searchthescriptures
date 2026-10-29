// Item 5 check: which single-judge block headers the cure parser (cureRounds in Cure Build / Cure Check, flow 23cf8db4) accepts.
const re=/^(?:===[ \t]+)?\[(CR1|DR1|CR2|DR2|CR3|DR3)(?:\]|[ \t]--[^\n]*\])(?:[^\n]*===)?[ \t]*$/m;
for(const s of ['[CR1]','[CR3 -- LINK ROUND (defender exhibit-or-concede)]','[CR1] DEFENDER R1','[CR3] DEFENDER R3 -- LINK ROUND (defender exhibit-or-concede)','=== [CR1] DEFENDER R1 ===','=== [DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede) ==='])console.log(re.test(s),s);
