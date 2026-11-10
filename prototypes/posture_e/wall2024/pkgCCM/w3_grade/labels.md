# W3 labels for pkgCCM (written before any run of the candidate; claim Wall 4449)
A1 Diff against fetchback_live_s115.json: exactly C2 Build -9, C3 Build -159, C4 Build -159; every other node, connections, settings deep equal. Else FAIL.
A2 C2 candidate, direct Anthropic branch, 1, 3 and 5 messages: one message marker, on message 0, ttl 1h; none elsewhere. Else FAIL.
A3 C2 candidate, openrouter anthropic branch: same as A2. Else FAIL.
A4 C3 and C4 candidate, both Claude branches: no cache_control in messages; system markers as live. Else FAIL.
A5 Every non-Claude family (openai, gemini, grok, mimo, deepseek, openrouter with openai/, google/, x-ai/, other): candidate body byte-equal to live for C2, C3, C4. Else FAIL.
A6 C2 with one message: candidate byte-equal to live. C2 with message 0 content an array: no marker, no throw (as live does for a non-string last message). Else FAIL.
A7 Breakpoints per request at most 4 in every case above. Else FAIL.
A8 Stored bodies (my own loop, not the builder's test): C2 system and message 0 byte-equal to C1's in every stored run; C3 and C4 system blocks byte-equal to C2's block(s) in every stored run (the system read the builder says is kept). A mismatch on C2 message 0 = FAIL (the marker would write, not read). A mismatch on C3/C4 system = finding to state.
A9 Consumers: list every node that takes a C2, C3 or C4 Build body and re-sends or appends to it. Any consumer that read a message write removed here and is not in the builder's limits (C3G, C4G are stated) = unstated loss, NOT PASSED until stated with a measured count.
A10 Stored usage, where present: C2's own last-message write (cache_creation) and who read it. If a later call read C2's last-message write, the builder's "writes nothing needed" is wrong = finding.
