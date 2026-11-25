# ASK 632 record facts (W4), for W3's AAR rows

- Write: engine moMxiV4Irg1uRBZN 066525aa-beeb-42ad-a92c-e5b6575bed96 -> 3b72583c-43b2-4236-8f05-5fa67ed8fcb8, at 06:00 CST 11-25. Only Panel Tokens changed.
- Audit row: audit_log id 42123.
- Written target (W1 build b1): ask632/w1/b1/tg/target_engine_632.json, md5 d46b0b595573b4f61d8973f7b72bf318.
- Fetch-back: ask632/w4/write/fetchback_eng_632.json, md5 9c0a1188f4e8e3f24656c2b02f3729ba. Its node parameters equal the target's; connections are equal; the child aad0ad9c is unchanged.
- Revert: ask632/w4/write/revert_eng_632.json, md5 2aa215bc486b649b7fa879b5392b9d98 (restores 066525aa).
- Write script: ask632/w4/write/write632.sh, md5 1b4c3d485ee0efdafa197702f48ec70e (run log write632_run.txt).
- Card (W4 thread), message cmsg_017ZQamDMHrS6fqMHnQDVo58DjKj6vJTSoL8pwo16XFy12:
  - Question: "Write ASK 632 so a gemini cost entry never shows negative input tokens?"
  - Option A, "Write it": "I change one line in the engine's Panel Tokens node, fetch it back, and W1 reads it back. No dollar figure changes. Undo restores the 066525aa engine." (recommended)
  - Option B, "Hold": "The engine stays as it is, and gemini-3.8-flash entries keep a negative or understated input-token count."
  - Pressed: option A, by the operator, 05:59 CST 11-25.
- Grades: plan W4 PASS WITH N1 to N3 (Wall 11988); build W4 PASS (Wall 11990); write Wall 11993; W1 readback PASS (Wall 11994).
- W4 mistakes in the write (script only, nothing wrong written): the first run stopped before any write, because W1's base_eng.json has no versionId; the in-script fetch-back was not found by its own checks after the PUT, so I fetched back by hand. Both are on Wall 11993.
