# BB-6904 item 8 (7224): the judges' prompts in the transcript. MEASURE, read-only, on active 95f04001 and execution 27433 (debate 5f880ab4).

## Where the sent text exists today
- Only in the n8n execution data. Builders and fields:
  - single judge: Build Independent Verdict, verdictBody
  - panel seats: Panel Build, judges[i].body
  - alternate: Alternate Build, alt.body
  - each cure: Cure Build, Panel Cure Build 1-3 and Alternate Cure Build, cure.body. A cure call copies the judge's original body, then adds the judge's answer and the cure request.
- Build Save Body (the row writer) and Format Markdown (the transcript) never read those fields.
- No column of debate_results or debate_judgments holds request text; verdict_raw holds replies only.
- The transcript itself is not in the database. Format Markdown produced 117,442 chars; Plain Rule Lines made it 118,031; Save to Drive wrote it to Google Drive.

## The calls in 27433 (texts saved per call, md5 of the decoded text; read and re-counted at the verifier's seat)
| seat | call | model | chars | md5 |
|---|---|---|---|---|
| single | judge | deepseek-flash | 87,941 (system 86 + user 87,855) | d7f82d67 |
| deepseek, gemini, grok | panel | each seat's model | 89,946 each (system 26,482 6fa05180 + user 63,464 bf933bdd) | 15f40c12, identical for all |
| glm | alternate for deepseek | z-ai/glm-5.3 | 89,946 | 15f40c12, identical to the panel |
| single | cure | deepseek-flash | 89,776 = its judge text + re-sent answer 4,442 + cure request 1,835 | bce8e914 |
| deepseek | panel cure 1 | deepseek-flash | 91,720 = panel text + answer 5,234 + request 1,774 | 1d4652cd |
| gemini | panel cure 2 | gemini-3.1-pro-preview | 92,450 = panel text + answer 2,749 + request 2,504 | fa8de964 |
| grok | panel cure 3 | none | not called: no violation in this seat | |

## Size it adds to one transcript (this run; the transcript today is 118K)
- P1, every call printed in full: about 722K chars, about 734K with the re-sent answers (about 7 times today's size).
- P2, each distinct text printed once, verbatim, under a heading naming every seat and call that received it (proved by md5):
  - the single prompt, 87,941;
  - the panel prompt, 89,946;
  - each cure's added parts verbatim: requests 6,113 and re-sent answers 12,425.
  - Total about 196K chars (about 2.7 times today's size).
- Nothing is paraphrased under either.

## Facts for the design
1. "The stored row holds the same text" needs a place to store it: no column exists. A new column or table is a schema change.
2. The single judge's prompt and the panel prompt differ in layout: the single judge's rules sit in its user message. About 4,395 chars are only in the single prompt and about 3,200 only in the panel's.
