# pkgWVR fixed regression set

regress.json holds every plant from every grade of pkgWVR, rev 1 to rev 4 (174 unique of 198), with the grader's expected answer:
W1 plants.cjs; W3 plant.cjs, plant_r2.cjs, plant2.cjs, plant3.cjs, plant4.cjs (/mnt/project-files/w3/grade_WVR/); W2 plants_w2.cjs, plants_w2_rev2.cjs, plants_w2_rev3.cjs, plants_w2_rev4.cjs (wall2024/w2_grades/wvr/).
harvest.cjs rebuilds it from those files. run.cjs [fn.js] runs it; every revision must print N/N before it is posted.
overrides.json: answers changed by agreement, each with its reason and Wall reference. W3's "none or enforcer" answers accept either result.
New plants from a grade are added by re-running harvest.cjs after the grader's file is saved.
