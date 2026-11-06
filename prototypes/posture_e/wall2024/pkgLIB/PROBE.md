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
