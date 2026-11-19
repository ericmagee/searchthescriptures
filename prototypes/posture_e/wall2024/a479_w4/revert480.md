# ASK 480 revert: republish the 12 W-series workflows

Read live 2026-11-19 09:1x CST, before any change. Each was published (active) at the version below.
To revert one: publish that workflow at its published version id (n8n publish_workflow with versionId, or POST /api/v1/workflows/{id}/activate after confirming versionId matches).
After the revert, read back: active = true and activeVersionId = the value below.

| # | Workflow id | Name | Published version id (activeVersionId) | Last updated |
|---|---|---|---|---|
| 1 | 3mV1UBs09SZTfK0u | TRUTH — DS Direct Single Call | f88ec195-b29d-4fb6-b2e9-4582b0fe3e59 | 2026-06-08T17:31:31.446Z |
| 2 | cVvQhy2Y1jwfW3TM | TRUTH — DS-W2 DeepSeek Dialog | d6b23052-1c90-4d2c-bfea-64460d6f000d | 2026-07-10T18:32:36.452Z |
| 3 | ALwKqNIw0i0YLcGC | TRUTH — DS-W3 DeepSeek Leads | 4f178362-7bb0-4d4a-bc63-b59a51593b48 | 2026-07-10T18:33:33.430Z |
| 4 | O4hG1nxEbQiztSMa | TRUTH — DS-W4 DeepSeek Steel Man | 761b39f9-c088-4aed-91f8-06abc1a46b1c | 2026-07-12T21:07:17.189Z |
| 5 | rveOzNV4Ir0OzcGI | TRUTH — DS-W5 DeepSeek Blind Analysis | e4ce0d26-bafe-4b86-84a1-5f9c4c1333a5 | 2026-07-10T18:31:44.696Z |
| 6 | DB7E7eb3i4DPJaHx | TRUTH — Group W2 Dialog (Gemini+Grok+ChatGPT+DeepSeek) | 96b50ce6-8b34-4cad-b871-026a141d5d52 | 2026-07-10T18:31:03.164Z |
| 7 | L2dnmMe0HPiT9vxb | TRUTH — W7 Adversarial L2 Specialist | 27f09be8-2d94-45f8-a3ab-0e9706956a8f | 2026-07-10T00:30:49.998Z |
| 8 | OuzlkGSKXryID4Y7 | TRUTH — W7 Engine-Led Adversarial Construction | 734cf103-94f2-42b6-a995-44af63383688 | 2026-07-12T19:59:17.830Z |
| 9 | QCMqpp3zxPA9XFe4 | TRUTH — W14 L1 Textual Integrity Analysis | 1c3d15aa-3b4f-4a86-b9d8-cd161df2c982 | 2026-07-10T00:33:00.027Z |
| 10 | b17zNbN3hjV7vFBi | TRUTH — W16 L1-A Literary Genre Analysis | a74e94b7-49b3-4a3c-9ad4-ad89bc59b174 | 2026-07-10T00:31:24.187Z |
| 11 | Udlm6jD9QwTp6E5x | TRUTH — Independent Synthesis (Claude-Free Verdict) | fdcbdc24-6f25-4328-8a5d-e3590124f3e4 | 2026-07-10T18:32:46.600Z |
| 12 | WzzlumCCL4ZT1Sgk | Challenger - Bible AI Tribunal | 4a6fccdb-fdcf-4f71-906d-412eab868db2 | 2026-11-01T22:07:37.482Z |

Machine-readable copy: revert480.json in this folder.
