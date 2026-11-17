s250: ASK 359 written 2026-11-17 on Eric's word ("#359 has been assigned").
Base live 0d298e3a-33b3-405d-a42d-d2dec54cce3e (s249, ASK 361). New live 890d4cdc-3691-4343-a42b-8015e3db8f24.
Target stk/t359.json (sha256 prefix ade12bebcb34). Ten nodes changed: Build Independent Verdict, Panel Build (2 lines), Reserve Build, Accept Build, Accept Check, Accept Return Build, Accept Final, Accept DS Return Build, Enforcer Build (1 line each, replaced in place); Shared Library (5 lines replaced at 1958, 1963, 1974, 3094, 3402 of the unpacked library; 16 lines added after 1963). Nothing deleted outright. Reasoning guard: no model-setting change. Readback OK.
Revert: PUT prewrite_s250.json nodes (gunzip) through wgen with base fetchback_s250.json.
