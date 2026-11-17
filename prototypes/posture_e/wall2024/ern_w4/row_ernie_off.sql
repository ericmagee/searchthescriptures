-- Run AFTER the s258 code write (Accept Build fails closed on a listed seat without an active row; ernie is no longer listed).
UPDATE model_config SET active=false, updated_at=now() WHERE seat='ernie' AND active=true AND api_model='baidu/ernie-5.5-flash-preview:free';
