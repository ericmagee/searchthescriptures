# pkgMIM2 (W2): the database half of pkgMIM (W3 2889 item 2)

Without this, the first run that seats mimo as an alternate ERRORs at Record Alternates, as 33249 did for grok before pkgGRA2:
odv1_record_panel_alternates accepts only provider 'openrouter' (or 'xai' with an x-ai/ model), and mimo's model_config row is provider 'xiaomi'
(api_model xiaomi/mimo-v2.6-pro, family xiaomi, role engine, active). The guard now also accepts a xiaomi row whose api_model is the xiaomi/ openrouter slug.

- fix_MIM2.sql: anchored replaces, each asserted once, on live md5 f7340949dc46a5af1262625578755fde (live after g1 pkgGRA2). revert_MIM2.sql reverses and checks the md5.
- test_MIM2.sql / test_MIM2.txt: pg_temp copies on 33345's debate row, writes stripped, rolled back. Live refuses mimo (T1); fixed seats mimo (T2), still seats grok (T3),
  seats grok + mimo together (T5, the pkgODD even-panel case), refuses a wrong mimo model (T4) and MiniMax (T6).
- Write order: pkgMIM2 (database) with or before pkgMIM (n8n: Init Seats, Accept Build, Alternate Build). pkgMIM alone would crash the run the first time mimo is seated.
- Not done here: W3's item 4, a dry call of mimo on a saved alternate input. That is an outside model call, which a seat cannot make; W4 can make it, or the first live seat shows it.
