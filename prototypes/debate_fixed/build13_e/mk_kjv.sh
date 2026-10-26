#!/bin/sh
# Builds fx/kjv28269.json (not committed, 4 MB) from A3's committed fx/kjv25.json (git 22a4aec, md5 0282498b) plus fx/kjv_supp28269.json.
A3=${A3:-/tmp/claude-0/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/scratchpad/wt12/prototypes/debate_fixed/build12_a3}
python3 -c "import json,sys;a=json.load(open(sys.argv[1]))+json.load(open('fx/kjv_supp28269.json'));json.dump(a,open('fx/kjv28269.json','w'))" $A3/fx/kjv25.json; md5sum fx/kjv28269.json
