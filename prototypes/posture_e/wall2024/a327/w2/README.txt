W2 grade prep for ASK 327 rev 2 (view) and ASK 328 (USAGE line). Read g327.sql top comment for the measured baseline.
ASK 328 checks (run h330.cjs DIFF section against the 328 target; it is generic): only Shared Library changes; MAP n;
sha; no model-setting token added/removed (max_tokens is READ from the built body, never set); the USAGE line form
"USAGE: prompt=<n> completion=<n> reasoning=<n> finish=<reason> max_tokens=<n>" with "not reported" fallbacks;
replay on 37372 r objects: 41081 -> prompt=104006 completion=64000 reasoning=63997 finish=length max_tokens=64000;
41100 -> reasoning=56380; Format Markdown TRIED regex still closes on "]"; successful alternate rows byte-identical.
