# ASK 423: live nodes that read LINK labels (engine 36fcf36b), W4

Pattern: any regex text LINK\s+ or LINK\s* in the node source (library nodes rebuilt from the Shared Library MAP). accepts_D_prefix: a pattern that allows D or C before the number. reads_premise_tag: the source reads a [premise n] tag. reads: what the source mentions (rough, by name), not proof that each pattern is applied to that text.

| node | library | patterns | accepts D prefix | reads [premise n] | reads | first pattern |
|---|---|---|---|---|---|---|
| Extract Independent Verdict | yes | 34 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(\d+/none)\b/i);if(k)own.push({at:off,link:` |
| Panel Payloads | yes | 28 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Alternate Payloads | yes | 28 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Cure Check | yes | 26 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Panel Cure Check | yes | 26 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Alternate Merge Seat | yes | 26 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Cure Normalize | yes | 24 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Panel Cure Normalize 1 | yes | 24 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Panel Cure Normalize 2 | yes | 24 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Panel Cure Normalize 3 | yes | 24 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Alternate Cure Normalize | yes | 24 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Gate Build | yes | 18 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Gate Record | yes | 18 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Alt Gate Build | yes | 18 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Alt Gate Record | yes | 18 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Late Gate Build | yes | 18 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Alt Late Gate Build | yes | 18 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Send Back Build | yes | 17 | no | no | challenger round 3, defender round 3, judge lines | `LINK\s+(\d+)[^\n]*/gmi)];const h=H[j-1];return h?t` |
| Alt Send Back Build | yes | 17 | no | no | challenger round 3, defender round 3, judge lines | `LINK\s+(\d+)[^\n]*/gmi)];const h=H[j-1];return h?t` |
| Send Back Record | yes | 12 | no | no | challenger round 3, defender round 3, judge lines | `LINK\s+(\d+/none)\b/i);if(k)own.push({at:off,link:` |
| Alt Judge Enforcer Build | yes | 12 | YES | YES | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+\d)/i.test(l))break;out.push(l);}` |
| Alt Send Back Record | yes | 12 | no | no | challenger round 3, defender round 3, judge lines | `LINK\s+(\d+/none)\b/i);if(k)own.push({at:off,link:` |
| Panel Build | no | 11 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Build Independent Verdict | no | 10 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b/\**\s*\d+[.)]\s)[^\n]*$/gmi)` |
| Judge Enforcer Build | yes | 10 | YES | YES | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+\d)/i.test(l))break;out.push(l);}` |
| C3B Extract | no | 9 | no | no | challenger round 3, defender round 3, premise list | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| D4 Build | no | 8 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| D3B Extract | no | 8 | no | no | defender round 3, premise list | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| Alternate Merge 1 | yes | 7 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(\d+/none)\b/i);if(k)own.push({at:off,link:` |
| D4B Extract | no | 7 | no | no | challenger round 3, defender round 3, premise list | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| Close Enforcer Build | no | 7 | no | no | challenger round 3, defender round 3, judge lines | `LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index` |
| Build Save Body | no | 6 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(\d+/none)\b/i);if(k)own.push({at:off,link:` |
| D2B Extract | no | 6 | no | no |  | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| C2B Extract | no | 6 | no | no | premise list | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| D3 Build | no | 5 | no | YES | premise list, judge lines | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| C3 Extract | no | 5 | no | no | challenger round 3, defender round 3, premise list | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| C4 Build | no | 5 | YES | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| C3G Extract | no | 5 | no | no | challenger round 3, defender round 3, premise list | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| C4B Extract | no | 5 | no | no | challenger round 3, defender round 3, premise list | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| D3 Extract | no | 4 | no | no | premise list | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| C3 Build | no | 4 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| C1B Extract | no | 4 | no | no |  | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| D2B Build | no | 4 | no | no |  | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| C2B Build | no | 4 | no | no | premise list | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| D3B Build | no | 4 | no | no | defender round 3, premise list | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| C3B Build | no | 4 | no | no | defender round 3, premise list | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| D4B Build | no | 4 | no | no | challenger round 3, defender round 3, premise list | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| C4B Build | no | 4 | no | no | challenger round 3, defender round 3, premise list | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| D4 Extract | no | 3 | no | no | challenger round 3, defender round 3, premise list | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| Close Enforcer Record | no | 3 | no | no | challenger round 3, defender round 3, judge lines | `LINK\s+)(\d+)\b/gi:/\b(?:C/LINK\s+)(\d+)\b/gi;cons` |
| Assume Check Build | no | 3 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(\d+)/i);` |
| C1 Extract | no | 2 | no | no |  | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| D2 Build | no | 2 | no | no | judge lines | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| D2 Extract | no | 2 | no | no |  | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| C2 Build | no | 2 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| C2 Extract | no | 2 | no | no |  | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| Citation Scan | no | 2 | no | no | challenger round 3, defender round 3 | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| Failure Salvage | no | 2 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(?:\d+/none)\b[^\n:]{0,80}:/mi;` |
| Cure Build | yes | 2 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+\d/\[L[1-4]\]/\b(?:answered/unanswered/refu` |
| Panel Cure Build 1 | yes | 2 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+\d/\[L[1-4]\]/\b(?:answered/unanswered/refu` |
| Panel Cure Build 2 | yes | 2 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+\d/\[L[1-4]\]/\b(?:answered/unanswered/refu` |
| Panel Cure Build 3 | yes | 2 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+\d/\[L[1-4]\]/\b(?:answered/unanswered/refu` |
| Alternate Build | yes | 2 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+\d/\[L[1-4]\]/\b(?:answered/unanswered/refu` |
| Alternate Cure Build | yes | 2 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+\d/\[L[1-4]\]/\b(?:answered/unanswered/refu` |
| L2 Count Plan | no | 2 | no | no | challenger round 3, defender round 3, judge lines | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| Enforcer Build | no | 2 | YES | no | challenger round 3, premise list, judge lines | `LINK\s*\d+/[DC]\d+)\b[^\n:]{0,60}):/gi;` |
| C1B Build | no | 2 | no | no |  | `LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*` |
| Judge Contradiction Build | no | 2 | no | no | challenger round 3, defender round 3, judge lines | `LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index` |
| Judge Contradiction Record | no | 2 | no | no | challenger round 3, defender round 3, judge lines | `LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index` |
| L2 Gloss Plan | no | 2 | no | no |  | `LINK\s+(?:\d+/none)\b[^\n]*/\**\s*\d+[.)]\s+(?:LIN` |
| Build Synthesis | no | 1 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index` |
| Format Markdown | no | 1 | no | no | challenger round 3, defender round 3, premise list, judge lines | `LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index` |
| C4 Extract | no | 1 | no | no | challenger round 3, defender round 3, premise list | `LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index` |
| C4G Extract | no | 1 | no | no | challenger round 3, defender round 3, premise list | `LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index` |
