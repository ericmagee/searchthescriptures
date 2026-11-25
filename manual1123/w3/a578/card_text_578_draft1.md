# Card text: ASK 578 entry for the engine manual (part 09.6)

Pairs file manual1123/w3/a578/em_pairs_578_draft3.json 50019d51 (grader PASS, Wall 11877). Part 09.6 v294 181bac44 (39,037) becomes 8f288364 (41,455).

## Change 1 (part 09.6)

### BEFORE

```
  - THE ENGINE AND THE CHILD HOLD ONE SHARED LIBRARY TEXT, CHECKED BEFORE THE RUN AND AT THE CHILD'S LOAD (ASK 422(a); engine "Library Sha (ASK 422a)" and "Alternate Pass Call"; child workflow MqQHRl7mQQ0z8QdT, "Library Check (ASK 422a)"):
```

### AFTER

```
  - THE ENGINE HOLDS THE ONE SHARED LIBRARY; THE CHILD READS IT FROM THE CALL AND CHECKS IT AT ITS LOAD (ASK 422(a), ASK 578; engine "Library Sha (ASK 422a)" and "Alternate Pass Call"; child workflow MqQHRl7mQQ0z8QdT, "Library Check (ASK 422a)" and its 14 library readers):
```

## Change 2 (part 09.6)

### BEFORE

```
each hold their own Shared Library node. A library change was built, graded, carded and read back twice, and nothing stopped a run whose two copies differed.
```

### AFTER

```
each held their own Shared Library node. A library change was built, graded, carded and read back twice, and nothing stopped a run whose two copies differed. The child's copy is removed: the child has no Shared Library node, and the engine sends its library text in the call. Where an entry of this manual says "Shared Library, both copies", "both libraries", or "the engine and the child" of a library line, a MAP entry or the library header, it now means the engine's Shared Library, which the child reads; where any other entry differs from this one on the child's library, this entry is right. A library change is made on the engine only.
```

## Change 3 (part 09.6)

### BEFORE

```
keys sorted, each entry from that workflow's own MAP. The child takes all its keys. The engine takes its keys less the named list MAPEXTRA, today ["REFP"] (ASK 409), and gives no map_sha unless every listed key is present. So map_sha differs when a shared entry changes, a child key is missing from the engine, an unlisted key is engine-only, or REFP is missing from the engine.
```

### AFTER

```
keys sorted, less the keys of the named list MAPEXTRA, today ["REFP", "Alternate Merge CPD"]; no map_sha is given unless every listed key is present. The engine computes both values from its own Shared Library. The child computes both from the text it receives, by the same rule and the same list, which its Library Check node holds.
```

## Change 4 (part 09.6)

### BEFORE

```
"Alternate Pass Call" sends lib_sha and map_sha in pass, not in sa. In the child, "Library Check (ASK 422a)", between "Alternate Pass In" and "Alternate Pass Check", computes both from the child's own library and stops the child with "pkgLIB1: library drift, engine lib <x> map <y>, child lib <x> map <y>" unless both pairs are equal; when they are, it passes on lib422, which names all four values.
```

### AFTER

```
"Alternate Pass Call" sends the library text (lib, read from the Shared Library node when the call is made), lib_sha and map_sha in pass, not in sa. In the child, "Library Check (ASK 422a)", between "Alternate Pass In" and "Alternate Pass Check", stops the child with "pkgLIB1: the call carries no library text (ASK 578)" when lib is absent or empty. Else it computes both values from the received text and stops the child with "pkgLIB1: the library text received differs from the engine library, engine lib <x> map <y>, received lib <x> map <y>" unless both pairs are equal; when they are, it removes lib from pass and passes on lib422, which names all four values. The child's 14 library readers (R2 Alternate Build, R2 Alternate Merge Seat, R2 Alt Judge Enforcer Build, R2 Alt Judge Enforcer Record, R2 Alt Send Back Build, R2 Alt Send Back Record, R2 Alt Gate Build, R2 Alt Gate Record, R2 Alt Late Gate Build, R2 Alt Judge Enforcer Retry Build, R2 Alternate Payloads, R2 Alternate Cure Build, R2 Alternate Cure Normalize and R2 Alternate Merge) read the text from the output of "Alternate Pass In" (pass.lib).
```

## Change 5 (part 09.6)

### BEFORE

```
with the reason "sub-workflow error: pkgLIB1: library drift ...".
```

### AFTER

```
with the reason "sub-workflow error: pkgLIB1: ...".
```

## Change 6 (part 09.6)

### BEFORE

```
on "3 MAP DIFFERS" alone.
    - Limits: two copies still exist in n8n; a hand edit of one in the editor is caught at the next run start or child load, not when it is made. Not shown by a run;
```

### AFTER

```
on "3 MAP DIFFERS" alone. With the child's copy removed: the child's Library Check, run on what the engine sends, passes; it throws when the engine does not send the text; and an engine that sends the text to a child that still holds its own Shared Library node passes, because that child does not read the field. A 1,203,331-character text passed in one Execute Workflow call in a test.
    - Limits: the library text (1,276,323 characters) travels in every call to the child, and each child execution stores it once, in the output of "Alternate Pass In" (about 1.28 MB beside about 19.0 MB for one stored child execution); the engine stores no item that holds it. The largest call n8n will carry is not established. Not shown by a run;
```

## Change 7 (part 09.6)

### BEFORE

```
The run-start check (ASK 419, runstart.py, check 3) fetches both workflows and refuses to release a run unless both values are equal; it prints "3 map_sha equal <x>" or "3 MAP DIFFERS: engine <x>, child <y>". The readback script libsha.py prints the body, header and map_sha of each workflow and says EQUAL only when both values are equal. From ASK 422(a) on, a library change is written to both workflows by the one writer, libw.py.
```

### AFTER

```
The run-start check (ASK 419, runstart.py, check 3) fetches both workflows. For a child with no Shared Library node it refuses to release a run unless the engine's library equals the sha its header names, "Alternate Pass Call" sends the library text, and the MAPEXTRA list in the child's Library Check equals the engine's. It prints "3 child has no Shared Library node; it is served the engine library in the call (ASK 578)", and it refuses with "3 ENGINE Alternate Pass Call DOES NOT SEND the library text" or "3 MAPEXTRA DIFFERS: engine <x>, child <y>". The readback script libsha.py prints for the child "no Shared Library node: served the engine library in the call (ASK 578); engine sends it: True" and says EQUAL only when the engine sends the text. Before a write of either workflow, the pair check (test557.js --pair) runs the child's Library Check on what the engine sends and throws when the engine does not send the text, and the standing set gives the child's readers the engine's library. A library change is written to the engine only, by the one writer, libw.py --engine-only; the child takes it from the next call.
```
