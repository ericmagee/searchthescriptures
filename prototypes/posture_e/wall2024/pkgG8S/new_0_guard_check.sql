-- pkgG8S rev 3 (ASK 213): the table rule that refused the ASK 212 write. Run FIRST, in the same transaction as the other four.
-- live: guard_served_sets_sight_numbers_check CHECK (((cardinality(sight_numbers) >= 1) AND (cardinality(sight_numbers) <= 11)))
ALTER TABLE guard_served_sets
  DROP CONSTRAINT guard_served_sets_sight_numbers_check,
  ADD CONSTRAINT guard_served_sets_sight_numbers_check CHECK (((cardinality(sight_numbers) >= 1) AND (cardinality(sight_numbers) <= 12)));
