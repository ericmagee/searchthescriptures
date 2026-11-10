// pkgABH (W4): restore the pkgE4 head on the Alternate Build stub (dropped at s80). Stub form 3. Base: live fetch-back given.
//   node build_ABH.cjs <fetch-back> <s79 stub with E4 head> <out>
const fs=require('fs');const [,,FB,OLD,OUT]=process.argv;const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const n=d.nodes.find(z=>z.name==='Alternate Build');const L=n.parameters.jsCode.split('\n');const i=L.findIndex(l=>l.startsWith('if(__S.length!==__N)'));if(i<0)die('no length check');
if(n.parameters.jsCode.includes('pkgE4'))die('Alternate Build already has the pkgE4 head');
if(!/^return await new Function\('\$','\$input',/.test(L[i+1])||L.slice(i+2).some(x=>x.trim()))die('tail after the length check is not the plain run line');
const O=fs.readFileSync(OLD,'utf8').split('\n');const j=O.findIndex(l=>l.startsWith('if(__S.length!==__N)'));const T=O.slice(j+1).map(x=>x.replace(/\b__M\b/g,'__EM')); /* form 3 stubs use __M for the map entry */
if(!T[0].startsWith('const __e4h=')||!T.some(x=>x.includes("$('Alternate Needed?')")))die('old stub tail is not the pkgE4 head');
n.parameters.jsCode=L.slice(0,i+1).concat(T).join('\n');new Function('$','$input','return (async()=>{\n'+n.parameters.jsCode+'\n})();');
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log('Alternate Build: tail replaced, '+T.filter(x=>x.trim()).length+' lines from the pkgE4 head; '+d.nodes.length+' nodes');
