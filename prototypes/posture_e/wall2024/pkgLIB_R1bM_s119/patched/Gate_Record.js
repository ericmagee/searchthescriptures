// pkgLIB stub, form 3: "Gate Record". The node's full code is rebuilt line for line from the "Shared Library" node, which holds the shared lines once
// and, under this node's name, its line list, its own lines and its length. This stub changes only when the nodes it reads change. The code runs unchanged with the same $ and $input.
if(false){$("Cited Verses");$("Gate Build");$("L2 Lexicon");$("L2 Words");$("Panel Build");$("Panel Cure Check");$("Send Back Record");$(String());} /* pkgLIB v2: never runs. The task runner sends a Code node only the nodes its code text names in literal $() calls (all nodes on a non-literal $() call); the rebuilt source below is string data the runner cannot see, so its reads are named here. Run 33094. */
const __LT=$('Shared Library').params.jsCode;const __L=JSON.parse(__LT.slice(__LT.indexOf('\n/*LIB*/')+8,__LT.lastIndexOf('\n/*MAP*/')));const __M=JSON.parse(__LT.slice(__LT.lastIndexOf('\n/*MAP*/')+8,__LT.lastIndexOf('\n/*END*/')))["Gate Record"];if(!__M)throw new Error('pkgLIB: the Shared Library holds no entry for Gate Record');
const __N=__M.n,__P=__M.p;
const __S=__P.map(e=>typeof e==='number'?__L[e]:typeof e[0]==='string'?e[0]:__L.slice(e[0],e[1]+1).join('\n')).join('\n');
if(__S.length!==__N)throw new Error('pkgLIB: rebuilt source is '+__S.length+' bytes, expected '+__N+' (Shared Library does not match this stub)');
return await new Function('$','$input','return (async()=>{\n'+__S+'\n})();')($,$input); /* the n8n task runner refuses the AsyncFunction constructor (probe 11:45 CST): a plain Function returns an async IIFE */
