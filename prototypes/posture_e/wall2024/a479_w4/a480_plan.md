# ASK 480 plan (W4, 11-19 09:1x CST): remove DeepSeek from the W-series workflows. Nothing written.
Count correction: 12 active workflows call api.deepseek.com, not 11 (W4 9529 missed "DS Direct Single Call").
All 12 are webhook-triggered; no other n8n workflow calls them; app_source names none of their paths.
DB: fire_debate_workflow (debate_queue trigger) names the deepseek-w4-steelman path; debate_queue's last deepseek row is 2026-08-14, last row of any engine 2026-09-28.
Stored executions: none for 11 of 12; Challenger last ran 2026-11-01 22:07Z (error). Raw node lists: a480_scan.txt.

| # | Workflow (id) | DeepSeek call node(s) | Hardcoded fallback / literal | Reads model_config | Last execution |
|---|---|---|---|---|---|
| 1 | DS Direct Single Call (3mV1UBs0) | DeepSeek Direct Call | Build DS Request: 'deepseek-chat' | no | none stored |
| 2 | DS-W2 DeepSeek Dialog (cVvQhy2Y) | DeepSeek R1, R2 | Build R1/R2, Final Output: 'deepseek-chat' | yes, active only | none |
| 3 | DS-W3 DeepSeek Leads (ALwKqNIw) | DeepSeek Opens, Challenges | in node: 'deepseek-chat' | yes, select=* (no active filter) | none |
| 4 | DS-W4 DeepSeek Steel Man (O4hG1nxE) | DeepSeek Steel Man Call | M['deepseek']||{deepseek-chat,8000} | yes, select=* (no active filter) | none |
| 5 | DS-W5 DeepSeek Blind Analysis (rveOzNV4) | Standard, Framework ID, Blind Analysis calls | 'deepseek-chat' | yes, active only | none |
| 6 | Group W2 Dialog (DB7E7eb3) | DeepSeek R1 | M['deepseek']||{deepseek-chat,1200} | yes, active only | none |
| 7 | W7 Adversarial L2 Specialist (L2dnmMe0) | Root Fallacy, LXX, DSS Attack | in node: 'deepseek-chat' | yes, active only | none |
| 8 | W7 Engine-Led Adversarial Construction (OuzlkGSK) | DeepSeek Construction Call | M['deepseek']||{deepseek-chat,4000} | yes, active only | none |
| 9 | W14 L1 Textual Integrity (QCMqpp3z) | DeepSeek Cross-Check | in node: 'deepseek-chat' | yes, active only | none |
| 10 | W16 L1-A Literary Genre (b17zNbN3) | DeepSeek Cross-Check | in node: 'deepseek-chat' | yes, active only | none |
| 11 | Independent Synthesis (Udlm6jD9) | DeepSeek Neutral Call | Build Neutral Verdict: 'deepseek-chat'; Final Output: M['deepseek']||{deepseek-chat} | yes, active only | none |
| 12 | Challenger - Bible AI Tribunal (WzzlumCC) | Vanilla DeepSeek | in node: 'deepseek-chat' | yes, active only | 2026-11-01 (error) |

## Proposal
A (recommended): unpublish (deactivate) all 12. None has run since at least 11-01, nothing in n8n or the app calls them, 1-5 exist only to run DeepSeek,
and a model swap in 6-12 would change what each workflow is. Revert: republish each (versionIds in a480_scan.txt).
B: keep 6-12 published and replace each DeepSeek call with an OpenRouter call to the model_config seat chatgpt (openai/gpt-6.1-terra) through the OpenRouter credential; unpublish 1-5. More nodes touched; each needs its own readback.
Either way: fire_debate_workflow's deepseek route then points at an unpublished webhook (the queue has no deepseek row since 08-14); a later ASK can remove the route.
