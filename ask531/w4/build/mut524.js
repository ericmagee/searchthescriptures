// ASK 531 criterion 2: W1's fixed E-ASSUME test reply (ask524/w1/rec524.js) in place of the recorded reply, so the run reads as under 524. No model call.
const REPLY=['ASSUME-CHECK: DEFENDER PREMISE 5 -- FACT 1 "the flesh runs from David to the child through Joseph" -- STATED -- John 6:42 "the son of Joseph, whose father and mother we know" -- read with Romans 1:3.',
'ASSUME-CHECK: DEFENDER PREMISE 2 -- FACT 1 "Mary\'s question concerned the throne" -- STATED -- Luke 1:34 "Mary was of the house of David by her own line" -- invented words.',
'ASSUME-CHECK: CHALLENGER PREMISE 91 -- FACT 1 "Mary is of David\'s line" -- NOT STATED -- no quoted verse gives it.'].join('\n');
RD['Assume Check Call openrouter'][0].data.main[0]=[{json:{choices:[{message:{content:REPLY}}]}}];
if(globalThis.EXTRA)EXTRA(RD);
