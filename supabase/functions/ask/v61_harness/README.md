# ask v61 offline harness (BB-5551 step 8)

Checks the v61 draft against v60 and against `debate_arsenal_linked` (step 6) without network or database.

```
cd supabase/functions/ask/v61_harness
git show <v60 commit>:supabase/functions/ask/index.ts > v60.ts
{ cat v60.ts; echo; echo 'export { buildConclusionBlock };'; } > v60x.ts
{ cat ../index.ts; echo; echo 'export { buildConclusionBlock, rankLinked, expandLinkedConclusions, LINK_CAP };'; } > v61x.ts
deno run --allow-read --import-map im.json test.ts
deno check --import-map im.json ../index.ts
```

The two remote imports are stubbed (`server.ts`, `supa.ts`), so the Supabase client is untyped in the check.
`t45.json` is the live text of Conclusion 45 (2,068 chars, md5 d7b875c7). F3's expected notes are the output of
`debate_arsenal_linked` on the ODV1-24793 topic with links 41-49 approved inside an aborted transaction.
