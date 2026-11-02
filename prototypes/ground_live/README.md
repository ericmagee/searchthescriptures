# GROUND live on every judge (2026-11-02)
- Base: ORACLE_DEBATE_V1 version 87e4c655 (live), nodes Build Independent Verdict (51eb5f8c) and Panel Build (3ea0b347).
- New: BIV 9e91340c, Panel Build 8e2d6b2a (patch.py).
- Changes: GROUND in the COLLISION POINTS formats (single judge user message; panel system message, which reserves and alternates reuse); single-judge GLM and Qwen at effort medium (empty replies at max, g4); Qwen primary panel body = Reserve Build's.
- Checks: both nodes compile; runbiv.cjs 21/21 (7 seats x 3 debates) message = base + 3 edits, bodies change only glm/qwen; panel harness 7/7 seats system = base + 3 edits, only qwen body changes; extest.cjs/newflags.cjs: live extractor on 9 stored arm-C replies; GROUND adds true K-S/K-C flags (stating-verse grounds now visible), loses none.
- Unexercised offline: Panel Payloads parse of panel replies carrying GROUND (live run exercises it); MiMo writing GROUND (g4 aborted).
- Undo: restore n8n version 87e4c655.
