W4 proposals for the lab (Wall 11662), draft 13:40 CST 11-24, to post after run 42283 ends.

1. A run flag the whole team can read. Only W4 can see n8n, so W3 and W1 ask me whether a run is live before a write. Today I also read the database during run 42283 because I did not poll first. Proposal: the engine writes one row when a run starts and updates it when the run ends, and a function run_live() returns yes or no. Every seat checks it before any database read or write. This would be a new ASK, with a plan for W1.

2. Every seat change is tested on all pairings, offline. For ASK 601 and ASK 608 I ran Init Seats and Resolve Seats on all 90 debater pairs against the live model rows and the saved judge order. That test is what found that the first ASK 608 option failed on all four listed pairings. Proposal: add that test to the standing set, so any change to seats, judge order or model rows is checked on every pair before it goes live.

3. Grade a plan's chosen path on live data before PASS. My ASK 608 plan and its grade both missed that option A gave no seat on the listed pairings. Proposal: the plan form's CRITERIA heading names one check of the chosen path on today's data, and the grade runs it.

4. The same family rule may reach two more calls. The Independent Verdict (A2) and the Diagnostic Prompt fall back to luna's model (OpenAI), because seat deepseek_debate is inactive. Ruling 537 names the enforcer only. A ruling question for the operator: should these two calls also be kept from a debater's family?

5. The next memory cut in judging. Close Enforcer Resume and Close Enforcer Needed? each pass the close items on, about 650,000 characters more per run after ASK 611. They can be cut the same way, by rebuilding at the send. This waits on the proof from the first live run of ASK 611.
