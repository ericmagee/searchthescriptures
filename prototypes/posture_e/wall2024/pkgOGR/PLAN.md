# pkgOGR: the Oracle presents the defender's grants (Eric 2026-11-06 16:22 CST; W3 spec)

Built (record-only check): C4 Build harvests the defender's grant sentences from [CR1]-[CR4] and asks the Oracle to open [DR4] with
OPPONENT'S GRANTS (one G<n> line per grant, quoted word for word with its round, plus SUPPORTS: <claim>; G+ lines for other defender sentences).
C4 Extract reads the section back (grants_check: missing, misquoted, ok, extra). The close-round new-verse check ignores the section's quotations.

Not built: the send-back. A debater round has no re-call path today: C4 Build -> C4 Route -> C4 Call <family> -> C4 Extract, and ~40 nodes
read $('C4 Extract') by name. A send-back needs, after C4 Extract:
  C4G Build (Code): pass-through when grants_check.pass; otherwise one call that continues the Oracle's own conversation (the C4 request, its
    reply, then a user turn naming each missing or misquoted G line and asking for the whole close round again, section first).
  C4G Route + C4G Call <family> (copies of the C4 ones) -> C4G Extract (Code): C4 Extract's reading on the new reply, then the better of the two
    (the one whose check passes, else the first) as the round.
  Every node that reads $('C4 Extract').first().json.raw then reads C4G Extract instead (or C4G Extract writes the chosen round under the
    same fields and those nodes switch name). One re-call at most.
That wiring is W4's to write; W1 builds the two Code nodes once W4 confirms the node names.
