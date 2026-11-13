-- pkgG8S rev 3 revert: run LAST, after revert_guard8.sql has put guard 8 back to 11 sights (else this ADD fails its own check).
ALTER TABLE guard_served_sets
  DROP CONSTRAINT guard_served_sets_sight_numbers_check,
  ADD CONSTRAINT guard_served_sets_sight_numbers_check CHECK (((cardinality(sight_numbers) >= 1) AND (cardinality(sight_numbers) <= 11)));
