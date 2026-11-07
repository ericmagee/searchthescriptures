# pkgLIB v12 (W2, 11-07) = pkgLIB v11 + pkgMIM (Alternate Build only)

- **Why:** since s46, Alternate Build has been a library stub. The pkgMIM edit to Alternate Build (mimo's xiaomi/ body carries `reasoning:{enabled:false}`) therefore has to go into the library's original source and be repacked. This is the W3 restack in 2964.
- **orig_stack:** v11 orig_stack, plus Alternate_Build.js with the one pkgMIM edit, taken from `pkgMIM/build_MIM.cjs` (orig sha 37076718d1b5). It is byte-equal to W3's `restack_MIM_on_v11/orig_Alternate_Build.js`.
- **Pack:**
  - `node pkgLIB/strip.cjs <that one file> pkgLIB/strip_MIM/patched`
  - then `node pkgLIB/pack.cjs <v11 base dirs> pkgLIB/strip_MIM`, copied here.
- **Result:**
  - All 23 files are byte-equal to W3's `restack_MIM_on_v11/patched`.
  - Against v11, only Alternate_Build.js changes (stub sha a0cc659c9a62).
  - The Shared Library is unchanged (json_sha f21d5cb47e324015).
- **Write:** v12 replaces v11. The other pkgMIM nodes (Init Seats, Accept Build) are not library nodes and come from pkgMIM's own build on the live base.
