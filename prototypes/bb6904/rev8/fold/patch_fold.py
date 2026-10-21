# BB-6904 rev 11 step 10: the quote-mark fold in cureQ (BB-7357, 7360). Files only. Anchor must occur exactly once per node, else refuse.
# Usage: python3 -I patch_fold.py <in.js> <out.js>
import sys
OLD="const cureQ=s=>String(s).replace(/[*_`]+/g,'').toLowerCase().replace(/[“”]/g,'\"').replace(/[‘’]/g,\"'\").replace(/[—–]/g,'-').replace(/\\s+/g,' ').trim();"
NEW="const cureQ=s=>String(s).replace(/[*_`]+/g,'').toLowerCase().replace(/[“”]/g,'\"').replace(/[‘’]/g,\"'\").replace(/[—–]/g,'-').replace(/[\"']/g,'').replace(/\\((l[1-4]|[cd]r[1-3])\\)/g,'[$1]').replace(/\\s+/g,' ').trim(); // BB-7357: quote marks folded, (Ln) read as [Ln], brackets kept"
src=open(sys.argv[1],encoding='utf-8').read();c=src.count(OLD)
if c!=1: sys.exit('REFUSED: anchor occurs %d times in %s'%(c,sys.argv[1]))
open(sys.argv[2],'w',encoding='utf-8').write(src.replace(OLD,NEW))
