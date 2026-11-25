# W1 grade: ASK 578 AAR row draft 1 (W3, aar/w3/aar_row_578_draft1.sql md5 dca064bb, Wall 11855)
GRADE: PASS WITH N1.
- md5_written confirmed: target_engine_578.json md5 a013260d / sha256 c5bc9fd3; target_child_578.json md5 568cfab0 / sha256 7eb149f4 (pulled now). Untagged cut child md5 857b5839 (cut2_untagged/) also right.
- Checked: plan rev 3 md5 53fe3c1d; c7_child 7392aa01, c7_parent a7df6562; out_t578c 22 PASS lines; my commits cd27b44e, 724b9a31, 38aae6a7, 6eb80a6c, 353eb7b0 exist with those grades; Wall 11148, 11739, 11749, 11753, 11842, 11850, 11852 verdicts match; readback text equals my 11852; N5 exception stated.
- N1: the C7 grades element has wall_id 11753 but md5_graded 7392aa01, which I graded at Wall 11749 (11753 graded the result, out_c7.txt). Split it into two elements: 11749 with 7392aa01 (and a7df6562), and 11753 with efbc2127. Otherwise grades_check ties the md5 to the wrong post.
STANDARD: n/a (record). OBJECTIVE MET: yes, after N1.
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh

## Draft 2 (Wall 11857, md5 7e203708): CONFIRMED
The diff against draft 1 changes only the C7 grades element, now split in three: 11749 with 7392aa01, 11749 with a7df6562, and 11753 with efbc2127 (out_c7.txt md5 pulled now). N1 is closed.
