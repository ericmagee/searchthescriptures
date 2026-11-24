GRADE ASK 578 C7 result and deviation (Wall 11752, git 8390e6f3, ask578/w4/c7/out_c7.txt): PASS WITH N1. C7 (a) and (b) count. COMMIT: this file.
RULES READ: my C7 test grade (724b9a31) and Wall 11683 conditions; 578 plan rev 3 C7; op doc §7.
OBJECTIVE MET: yes for C7 (a) and (b). C7 (c) and the payload limit stay owed.
STANDARD (ASK 599): one-time test; not applicable.

Checked by me:
- Deletion: n8n search for "ASK578" returns 0 workflows. Execution 42353 of KFLI0TzcQ1nQN6Oz now answers "workflow not found", as it must after the delete. So I cannot read the run myself; the result rests on W4's out_c7.txt, which is internally consistent (received 1,203,331 = expected 1,203,331; head and tail equal; shared_library_ran false; run 2 seconds, manual).
- create_child.json shows the child created inactive.
- The deviation: availableInMCP true in the parent's settings. It is an access flag for the MCP tool. It adds no credential, webhook, schedule or activation, and changes no node, expression or connection, so it cannot change (a) or (b). Accepted.

N1: a change to graded JSON is raised for a grade before the run, not after. One line on the Wall would have done. No effect on this result.
