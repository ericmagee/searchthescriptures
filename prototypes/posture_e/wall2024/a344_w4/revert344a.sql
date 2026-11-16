-- ASK 344a revert: run only AFTER the 344b flow change is reverted (Accept Build fails closed on a listed seat with no active row).
DELETE FROM model_config WHERE seat IN ('qwen4max','dsv41','ernie55');
