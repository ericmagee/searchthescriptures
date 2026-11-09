# gate: shared build and test tools (W1, 11-09)

These tools are items 2 and 6 of the list that Eric approved on 11-09 (Wall 3627: "all approve. i want all in the next run"). They are build-tree tools only: they never write to n8n or the database.

## Item 2: one required replay gate

### `gate/pack.cjs`: one safe pack command

```
FB=<fetchback json> node gate/pack.cjs pkgLIB/strip_X pkgLIB_X
```

It replaces four manual steps:
1. running pkgLIB/pack.cjs in the shared pkgLIB folder;
2. copying the result;
3. deleting Alternate_Merge.js;
4. running `git checkout` and `git clean` on pkgLIB/patched.

Packing, the stub rebuild check and e4_rebase all run in a new temporary folder. Only `pkgLIB_X` is created, and the tool refuses to run if that folder already exists. FB defaults to the live fetch-back named in `gate/LIVE`.

Checks:
- every stub rebuilds byte for byte to its strip source;
- e4_rebase reports `stubs ok true` and `rebuild=strip true`.

Proof: packing `pkgLIB/strip_FUM` with FB=s77 gives the committed `pkgLIB_FUM` byte for byte. The one exception is the absolute paths that `plan_LIB.json` records.

### `gate/replay.cjs`: the gate itself

```
node gate/replay.cjs --base pkgLIB/strip_A --cand pkgLIB/strip_B [--targets pkgX/targets.json] [--out pkgX/gate_B.txt]
                     [--ms 60000] [--jobs 4] [--runs 34016,33846] [--fb <fetchback>] [--cases gate/cases]
```

It runs on every saved run in `/mnt/project-files/wall2024/inputs` (a run with an index file) and on every near-miss case in `gate/cases/*.json`.

1. **Chain replay.** The library nodes run in dependency order, once with the base sources and once with the candidate sources. Each library node reads the recomputed output of the library nodes upstream of it. A change in a Normalize node therefore reaches Panel Cure Check, Cure Check, the Merge nodes and the Gate Records.
2. **Byte-equal.** Each node's base and candidate outputs are compared, with timestamps ignored.
3. **Item check** (W2's unasked-item check). Every item row is compared field by field: enforcer_log rows and summary cure and drv rows. A changed, new or missing row passes only if it matches a target. Outside item rows, every changed text line fails unless it matches `allow_lines`. JSON held inside strings, such as bodies, is opened and compared line by line.
4. **Near-miss cases.** Each case edits a judge reply in a saved run and states what the candidate must give. Every check must pass. A case that carries its own `targets` also goes through step 3.
5. **Time limit.** Each node run (one node, one side, one run) gets `--ms` milliseconds. Each run or case executes in its own worker thread, so an endless loop is stopped. The overrun is reported as TIMEOUT with the node and side, and it counts as a FAIL.

The exit code is 0 only on `GATE PASS`.

**Targets file** (the package states what it means to change):
```json
{"why":"...",
 "items":[{"rule":"K-RUL","item":"^keystone$","seat":"luna","run":"34016"}],
 "allow_lines":[{"re":"ITEM: keystone; RULE: K-RUL; RESULT: (UN)?CURED"},{"path":"\\.drv_uncured$","re":"^[-+] [12]$"}]}
```
- In item targets, `rule`, `seat`, `run` and `field` must match exactly. `item`, `link` and `node` are regexes; `item` is tested against the row's item, or its link when the row has no item.
- An `allow_lines` entry tests each changed line, which begins with `- ` (base) or `+ ` (candidate). It can add `node` and `path` regexes.
- Example: `gate/examples/targets_KRC.json`.

**Near-miss case** (`gate/cases/<seat>_*.json`, an array):
```json
{"id":"KRC-A-33506","by":"W1","wall":"...","run":"33506","say":"what the case shows",
 "edits":[{"find":"regex","replace":"text","flags":"g","where":"optional plain literal seen in the raw JSON file"}],
 "targets":{"items":[]},
 "checks":[{"node":"Cure Check","rule":"K-RUL","seat":"","judge":"regex","item":"regex","has":"status","field":"status","expect":{"eq":"CURED"}}]}
```
- Each edit applies to every string in every saved node output of the run. Give `where` when the find needs characters that JSON escapes, such as quotation marks.
- `expect` is `{"eq":...}` or `{"re":...}`. A check must match at least one row, and every matched row must satisfy it.
- **Every seat adds its probes here.** That is the shared trick-line set (W3 3).

**Limits.**
- Only the library nodes are recomputed. Non-library nodes keep their saved output. A package that adds wiring, as FUM did, still needs its own path test until those nodes are added.
- A run takes about 10 to 20 seconds; an edited case takes longer, because it reads every file of its run from the shared folder.

**Proof** (`gate/proof/`):
- `gate_FUM_self.txt`: base and candidate are the same, so the gate passes.
- `gate_KRC_*.txt`: on 34016, KRC's luna keystone change is caught in Panel Cure Check, Alternate Merge Seat and Alternate Merge 1. It fails without targets and passes with `targets_KRC.json`.
- An endless loop is stopped at the limit and reported as `TIMEOUT ... Panel Cure Check (cand)`.

## Item 6: one library source in the build tree

### `gate/src.cjs`

```
node gate/src.cjs split pkgLIB/strip_X pkgLIB/src_X     # strip folder -> source folder (accepted only if join gives every source back byte for byte)
node gate/src.cjs join  pkgLIB/src_X  pkgLIB/strip_Y    # source folder -> new strip folder, then gate/pack.cjs and gate/replay.cjs
node gate/src.cjs check pkgLIB/src_X  pkgLIB/strip_X    # compare without writing
```

- `lib/<name>.js` holds one top-level statement used by 2 or more nodes, stored once.
- `nodes/<Node>.js` holds the node's source with `//@lib <name>` in place of each shared statement.
- `USES.txt` lists, for each piece, the nodes it reaches.
- `VARIANTS.txt` lists names that have more than one version across nodes.

A fix to `cureVerdicts` then becomes one edit to `lib/cureVerdicts.js` instead of the same substitution in 26 files. Two packages that change the same function then meet as an ordinary git conflict on one file.

Statements inside an async wrapper (`const X=await (async()=>{...})();`) count as top level. That wrapper is where Alternate Build, Alternate Merge 1 and their R2 copies hold the library.

On strip_FUM: the 9.4 MB strip folder of 30 nodes becomes 695 shared statements in `lib/` (539 KB) plus 424 KB of node files. `cureVerdicts` reaches all 26 nodes that carry it.

**Proof** (`gate/proof/item6_krc_one_edit.sh`): pkgKRC's change, made as one edit to `lib/cureVerdicts.js` and joined, gives `pkgLIB/strip_CJR_KRC` byte for byte. build_KRC.cjs made the same change by substitution in 26 files.

Found by the split (VARIANTS.txt: one name, different text, in different nodes, meaning copies that drifted apart):
- `drvCited` and `drvBrokenPW`: one version in 26 nodes, another in 4.
- `psGrades`: one version in 10 nodes, another in 16.
- Smaller locals in a few nodes each: PB0, R, PP, bodies, summary, seated, removed, tried.

A fix to one of these must be made to each version on purpose.
