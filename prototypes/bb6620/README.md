# BB-6620: pressed-witness ledger (draft)

Draft for the ODV1 debate fix ordered by the operator on 2026-10-19 ("fix the current debate issue").

`ledger.js` computes, from a debate transcript, which verses each premise of a side's closing
premise list carries, and whether the answering link round names them. It is the input for a
system-computed block in the ODV1 judges' prompt (Panel Build, Build Independent Verdict) and in
the link-round prompts (C3 Build, D3 Build).

Measured offline on ODV1-27035 (no write): against the defender, premises 1, 2, 4 and 6 carry
verses its link round never names; against the challenger, premises 1 and 4 (Matthew 1:16, Luke 1:34).

Nothing here is deployed. Shape and approval live on the TRUTH blackboard, thread BB-6620.
