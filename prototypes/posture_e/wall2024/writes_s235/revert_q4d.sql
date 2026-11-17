-- pkgQ4D revert: flow first (restore s234 25b8559b from writes_s235 prewrite), then this row.
DELETE FROM model_config WHERE seat='qwen4max';
