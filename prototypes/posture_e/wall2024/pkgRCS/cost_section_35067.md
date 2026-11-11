
## Cost of this run

Total $5.0153 for 49 model calls: billed by OpenRouter $1.3942 (measured); priced from the price list $3.6211 (estimate); 18 calls have no price and are not in the total.

| Call | Model | Input | Cache read | Cache write | Output | Cost | Source |
|---|---|---|---|---|---|---|---|
| D1 Call anthropic | claude-sonnet-5-5 | 4 | 0 | 3,721 | 5,595 | $0.0708 | price list |
| C1 Call anthropic | claude-opus-5-5 | 4 | 0 | 86,487 | 13,694 | $0.9658 | price list |
| D2 Call anthropic | claude-sonnet-5-5 | 4 | 3,721 | 26,967 | 14,271 | $0.2510 | price list |
| C2 Call anthropic | claude-opus-5-5 | 30,511 | 86,487 | 0 | 20,345 | $0.5462 | price list |
| D3 Call anthropic | claude-sonnet-5-5 | 4 | 2,936 | 31,611 | 27,213 | $0.3989 | price list |
| C3 Call anthropic | claude-opus-5-5 | 30,577 | 70,281 | 0 | 13,032 | $0.3970 | price list |
| Synthesis Call openrouter | openai/gpt-6.1-terra | 3 | 0 | 68,027 | 2,580 | $0.0979 | billed |
| Diagnostic Call openrouter | openai/gpt-6.1-terra | 3 | 0 | 86,248 | 920 | $0.1124 | billed |
| Verdict Call openrouter | openai/gpt-6.1-terra | 3 | 0 | 67,448 | 7,776 | $0.1232 | billed |
| Cure Call openrouter | openai/gpt-6.1-terra | 3 | 0 | 82,053 | 3,814 | $0.1216 | billed |
| Panel Cure Call 1 openrouter | openai/gpt-6-luna | 3 | 0 | 85,244 | 6,244 | $0.0138 | billed |
| Panel Cure Call 2 openrouter | openai/gpt-6.1-terra | 3 | 0 | 84,222 | 2,391 | $0.1172 | billed |
| Panel Cure Call 3 openrouter | openai/gpt-6.1-sol | 3 | 0 | 84,796 | 3,376 | $0.2458 | billed |
| D4 Call anthropic | claude-sonnet-5-5 | 4 | 2,936 | 28,170 | 19,462 | $0.3076 | price list |
| C4 Call anthropic | claude-opus-5-5 | 32,920 | 70,281 | 0 | 12,037 | $0.3865 | price list |
| Accept Call openrouter | openai/gpt-6.1-terra | 3 | 0 | 3,341 | 503 | $0.0067 | billed |
| Accept Call openrouter #2 | openai/gpt-6.1-sol | 3 | 0 | 3,341 | 495 | $0.0133 | billed |
| Accept Call openrouter #3 | openai/gpt-6-luna | 3 | 0 | 3,341 | 516 | $0.0007 | billed |
| Accept Call openrouter #4 | x-ai/grok-4.7 | 3,419 | 1,152 | 0 | 1,090 | $0.0140 | billed |
| Accept Call openrouter #5 | google/gemini-4-argon | 3,423 | 0 | 0 | 896 | $0.0158 | billed |
| Accept Call openrouter #6 | anthropic/claude-haiku-5.5 | 4 | 0 | 4,898 | 1,431 | $0.0013 | billed |
| Enforcer Call deepseek | deepseek-flash | 39,032 | 4,736 | 0 | 23,526 | no price | no price |
| Anticheat Call deepseek | deepseek-flash | 17,010 | 384 | 0 | 20,866 | no price | no price |
| Anticheat Call deepseek #2 | deepseek-flash | 17,102 | 384 | 0 | 30,907 | no price | no price |
| Anticheat Call deepseek #3 | deepseek-flash | 17,568 | 384 | 0 | 28,995 | no price | no price |
| Anticheat Call deepseek #4 | deepseek-flash | 15,522 | 384 | 0 | 43,918 | no price | no price |
| Judge Enforcer Call deepseek | deepseek-flash | 14,611 | 3,328 | 0 | 11,911 | no price | no price |
| Judge Enforcer Call deepseek #2 | deepseek-flash | 14,439 | 3,328 | 0 | 12,067 | no price | no price |
| Judge Enforcer Call deepseek #3 | deepseek-flash | 14,905 | 3,328 | 0 | 22,425 | no price | no price |
| Judge Enforcer Call deepseek #4 | deepseek-flash | 14,401 | 3,328 | 0 | 17,754 | no price | no price |
| Judge Enforcer Call deepseek #5 | deepseek-flash | 11,850 | 3,328 | 0 | 25,654 | no price | no price |
| Judge Enforcer Call deepseek #6 | deepseek-flash | 13,749 | 3,328 | 0 | 16,969 | no price | no price |
| Judge Enforcer Call deepseek #7 | deepseek-flash | 14,143 | 3,328 | 0 | 17,490 | no price | no price |
| Judge Enforcer Call deepseek #8 | deepseek-flash | 7,087 | 3,328 | 0 | 4,693 | no price | no price |
| Send Back Call openrouter | openai/gpt-6-luna | 3 | 68,971 | 10,126 | 2,169 | $0.0030 | billed |
| Send Back Call openrouter #2 | openai/gpt-6.1-terra | 3 | 70,294 | 10,790 | 3,579 | $0.0349 | billed |
| Send Back Call openrouter #3 | openai/gpt-6.1-sol | 3 | 69,505 | 9,842 | 667 | $0.0382 | billed |
| Gate Call openrouter | openai/gpt-6.1-terra | 3 | 81,084 | 4,359 | 650 | $0.0128 | billed |
| D2B Call anthropic | claude-sonnet-5-5 | 4,859 | 30,688 | 0 | 5,530 | $0.0681 | price list |
| D3B Call anthropic | claude-sonnet-5-5 | 8,981 | 34,547 | 0 | 9,129 | $0.1127 | price list |
| D4B Call anthropic | claude-sonnet-5-5 | 8,742 | 31,106 | 0 | 9,592 | $0.1165 | price list |
| Close Enforcer Call deepseek | deepseek-flash | 18,887 | 256 | 0 | 19,203 | no price | no price |
| Close Enforcer Call deepseek #2 | deepseek-flash | 21,714 | 384 | 0 | 7,727 | no price | no price |
| Judge Contradiction Call deepseek | deepseek-flash | 40,236 | 384 | 0 | 6,142 | no price | no price |
| Reread Call deepseek | deepseek-flash | 4,406 | 6,656 | 0 | 8,610 | no price | no price |
| Assume Check Call deepseek | deepseek-flash | 1,206 | 384 | 0 | 2,861 | no price | no price |
| Panel Judge 1 openrouter | openai/gpt-6-luna | 3 | 0 | 68,971 | 21,489 | $0.0194 | billed |
| Panel Judge 2 openrouter | openai/gpt-6.1-terra | 3 | 0 | 70,294 | 9,022 | $0.1330 | billed |
| Panel Judge 3 openrouter | openai/gpt-6.1-sol | 3 | 0 | 69,505 | 9,546 | $0.2692 | billed |
