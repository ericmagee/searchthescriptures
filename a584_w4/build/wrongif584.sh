#!/bin/sh
# ASK 584 wrong-if: PASS only if the page asks the database for odv1_engines AND builds the drop-down list from that answer.
f="$1"
if grep -q "odv1_engines')\.then(function(r){" "$f" && grep -q "ODV1_PICK=r\.map(" "$f"; then echo "PASS $f: the drop-down is filled from dash_debaters()"; else echo "FAIL $f: the drop-down is NOT filled from the database"; fi
