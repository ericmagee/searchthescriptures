# pkgLIB live probe (before the write; live-test thread)

pkgLIB rests on two n8n behaviours that offline replay cannot show. Probe both in a throwaway workflow, not ORACLE_DEBATE_V1:

1. Manual Trigger -> Code node "Probe" (Run Once for All Items).
2. A second Code node named "Lib", NOT wired to anything, jsCode:
   `return [];\n/*LIB*/["a","b"]\n/*END*/`
3. "Probe" jsCode (second probe, after the 11:45 CST result: the stubs now use a plain new Function that returns an async IIFE, the form the live stubs end with):
   ```
   const t=$('Lib').params.jsCode;
   const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*END*/')));
   const __S='return [{json:{lib:'+JSON.stringify(L)+',items:$input.all().length,awaited:await Promise.resolve(7)}}];';
   return await new Function('$','$input','return (async()=>{\n'+__S+'\n})();')($,$input);
   ```
Pass: Probe outputs `{"lib":["a","b"],"items":1,"awaited":7}` (awaited shows an await inside the rebuilt body works, as the cure nodes need). That shows (a) `.params` of an unrun, unwired node is readable and (b) the Code node allows `new Function`.
If (a) fails, the fallback is to wire "Shared Library" ahead of the 22 nodes. If (b) fails, pkgLIB cannot work as built; report it to W1.

Write (after the probe passes and W3 grades): add the node in plan_LIB.json `new_node` with jsCode = pkgLIB/patched/Shared_Library.js, unwired; set the
jsCode of each of the 22 nodes to pkgLIB/patched/<node>.js. Revert = the saved prewrite JSON (one write, one revert).
Each stub checks the rebuilt length against its own record and throws "pkgLIB: rebuilt source is ..." if the library does not match it, so a
mismatched library stops the node loudly rather than running the wrong code.

## pkgLIB v2 probe (after run 33094; W3 grading condition 4)

Run 33094 showed a third n8n behaviour: the task runner sends a Code node only the data of nodes its code TEXT names in literal `$('Name')` calls
(every node on a non-literal `$(x)`). v2 stubs carry a never-run line `if(false){$("A");$("B");...}` naming every node the rebuilt source reads, and
`$(String());` on the 4 dynamic nodes. The probe shows that a dead-code literal ref is enough. Throwaway workflow, not ORACLE_DEBATE_V1:

1. Manual Trigger -> Code node "Up", jsCode: `return [{json:{v:42}}];`
2. "Up" -> Code node "ProbeA" (v1 form, expected to FAIL to read Up), jsCode:
   ```
   const __S='return [{json:{v:$(\'Up\').first().json.v}}];';
   let r;try{r=await new Function('$','$input','return (async()=>{\n'+__S+'\n})();')($,$input);}catch(e){r=[{json:{err:String(e.message||e)}}];}
   return r;
   ```
3. "ProbeA" -> Code node "ProbeB" (v2 form, expected to PASS), jsCode:
   ```
   if(false){$("Up");}
   const __S='return [{json:{v:$(\'Up\').first().json.v}}];';
   return await new Function('$','$input','return (async()=>{\n'+__S+'\n})();')($,$input);
   ```
4. "ProbeB" -> Code node "ProbeC" (dynamic form), jsCode:
   ```
   if(false){$(String());}
   const __S='const n=["U","p"].join("");return [{json:{v:$(n).first().json.v}}];';
   return await new Function('$','$input','return (async()=>{\n'+__S+'\n})();')($,$input);
   ```
Pass: ProbeA outputs `{"err":"Node 'Up' hasn't been executed"}` (the 33094 fault, reproduced), ProbeB outputs `{"v":42}`, ProbeC outputs `{"v":42}`.
If ProbeA reads 42, the runner is not the cause and pkgLIB stays out until the 33094 cause is found again. If ProbeB fails, v2 does not work; report to W1.
Offline the same model is pkgLIB/runner_model.cjs (acorn walk as in n8n's BuiltInsParser); test_LIB runs every node through it and fails the f303dc7 stubs.
