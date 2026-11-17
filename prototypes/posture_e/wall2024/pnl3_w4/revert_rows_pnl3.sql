-- Revert panel rev 3 rows (after the code revert, or Accept Build fails closed).
DELETE FROM model_config WHERE seat IN ('ernie','sonnet');
UPDATE model_config SET active=false WHERE seat='ember';
UPDATE model_config SET active=true WHERE seat='alt_minimax31';
