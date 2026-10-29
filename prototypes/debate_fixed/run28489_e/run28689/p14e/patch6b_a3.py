import glob,os,sys,hashlib
A1="const DRV_REF=/(?:[1-3]\\s)?[A-Z][a-z]+\\.?\\s\\d{1,3}:\\d{1,3}/;"
N1=A1+"\nconst DRV_REF_END=/(?:[1-3]\\s)?[A-Z][a-z]+\\.?\\s\\d{1,3}:\\d{1,3}(?:\\s?[-–]\\s?\\d{1,3})?[\\s*_]*$/; // BB-7994 step 6b: a reference written just before its [L3] tag (\"Job 15:14 [L3]\") names the reference"
A2="    const cut=rest.search(/;|(?<!\\.)\\.\\s|\\s--\\s|\\s—\\s|\\[L[1-4]\\]/);if(cut>=0)rest=rest.slice(0,cut);"
N2="    // BB-7994 step 6b: a quotation that opens the text runs to its closing mark before any cut (\"Adam knew Eve his wife; and she conceived\").\n    {const q=rest.match(/^\\s*[\"“]/);let from=0;if(q){const k=rest.slice(q[0].length).search(/[\"”]/);if(k>=0)from=q[0].length+k+1;}\n     const cut=rest.slice(from).search(/;|(?<!\\.)\\.\\s|\\s--\\s|\\s—\\s|\\[L[1-4]\\]/);if(cut>=0)rest=rest.slice(0,from+cut);}"
A3="(t==='3'&&DRV_REF.test(rest))"
N3="(t==='3'&&(DRV_REF.test(rest)||DRV_REF_END.test(line.slice(Math.max(0,m.index-40),m.index))))"
A4=" for(const line of text.split('\\n')){const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();\n  const m=u.match(/^(?:[-•]|\\d+[.)])?\\s*D(\\d+)\\b\\s*:?\\s*(?:D\\1\\b\\s*)?(.*)$/);if(!m||!/^VS\\.?\\s/.test(m[2]))continue;\n  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;\n  const side=g[1].split(' ')[0];cnt[side]++;"
N4=" const LS=text.split('\\n');for(let li=0;li<LS.length;li++){const line=LS[li];const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();\n  const m=u.match(/^(?:[-•]|\\d+[.)])?\\s*D(\\d+)\\b\\s*:?\\s*(?:D\\1\\b\\s*)?(.*)$/);if(!m||!/^VS\\.?\\s/.test(m[2]))continue;\n  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;\n  const side=g[1].split(' ')[0];cnt[side]++;"
A5="  const k=drvKinds(line);\n  if(k.length<2){items.push({rule:'K-B',side,link:id,kinds:k,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION -- '+id+' '+g[1]+' exhibits '+k.length+' layer kind'+(k.length===1?'':'s')+(k.length?' ('+k.join(', ')+')':'')+' of the two rule B requires on the line itself. REVIEW THIS ROW.]');}"
N5="  // BB-7994 step 6b (BB-8044, 8056): the line under a BROKEN line carries its footing when it is not itself a collision, a label line or a concession line (SIDE | round |).\n  const nx=String(LS[li+1]||''),nu=nx.toUpperCase().replace(/[*_`]+/g,'').trim();\n  const k=(nu&&!/^(?:[-•]|\\d+[.)])?\\s*[DC]\\d+\\b/.test(nu)&&!/^[A-Z][A-Z \\-]{2,}:/.test(nu)&&!/^(?:DEFENDER|CHALLENGER)\\s*\\|/.test(nu))?[...new Set([...drvKinds(line),...drvKinds(nx)])].sort():drvKinds(line);\n  if(k.length<2){items.push({rule:'K-B',side,link:id,kinds:k,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION -- '+id+' '+g[1]+' exhibits '+k.length+' layer kind'+(k.length===1?'':'s')+(k.length?' ('+k.join(', ')+')':'')+' of the two rule B requires on the line or the line under it. REVIEW THIS ROW.]');}"
P=[(A1,N1),(A2,N2),(A3,N3),(A4,N4),(A5,N5)]
only=sys.argv[1:]  # mutant: list of patch indices to apply
for f in sorted(glob.glob('live/*.js')):
  s=open(f).read()
  if 'function drvExhibits' not in s: continue
  out=s
  for i,(a,n) in enumerate(P):
    c=s.count(a)
    if c!=1: sys.exit('ANCHOR %d count %d in %s'%(i+1,c,f))
    if only and str(i+1) not in only: continue
    out=out.replace(a,n,1)
  d='new' if not only else 'mut_'+''.join(only)
  os.makedirs(d,exist_ok=True)
  open(os.path.join(d,os.path.basename(f)),'w').write(out)
print('ok')
