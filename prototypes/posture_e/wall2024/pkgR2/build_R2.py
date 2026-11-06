# pkgR2: K-RUL fixes from run 32980 (W1; coordinator relay 05:42 UTC). Base: merged_PWQA (= live 426d60c0). Offline only.
# 1. a combined collision card "RULING -- D1, D2, D3 and D6 vs C2 -- ..." matches each D<n> vs C2 it lists.
# 2. NAMED BY and RULE quotes in single quotes ('...' or the curly pair) are read; an outer single-quoted span wins over a double-quoted
#    span inside it ('I drop "only".' is the quote, not "only"); an apostrophe inside a word (Joseph's) is not a quote mark.
import glob,os,json,hashlib
OUT='patched';os.makedirs(OUT,exist_ok=True)
E1_OLD="m=id.match(/^(D\\d+) vs (C\\d+)$/);if(m)return new RegExp('\\\\b'+m[1]+'\\\\s*vs\\\\.?\\\\s*'+m[2]+'\\\\b','i').test(t);return false;}"
E1_NEW=("m=id.match(/^(D\\d+) vs (C\\d+)$/);if(m){if(new RegExp('\\\\b'+m[1]+'\\\\s*vs\\\\.?\\\\s*'+m[2]+'\\\\b','i').test(t))return true;"
 "for(const g of String(t).matchAll(/((?:\\bD\\d+\\s*(?:,\\s*(?:and\\s+)?|\\s+and\\s+|\\s*&\\s*))+D\\d+)\\s*vs\\.?\\s*(C\\d+)\\b/gi)){if(g[2].toUpperCase()===m[2].toUpperCase()&&(g[1].match(/D\\d+/gi)||[]).some(d=>d.toUpperCase()===m[1].toUpperCase()))return true;}} /* pkgR2 (run 32980 chatgpt): a combined card lists several D links against one C */"
 "return false;}")
E2_OLD="const qs=[...nb.matchAll(/[\"\\u201c]([^\"\\u201d]{3,})[\"\\u201d]/g)].map(m=>m[1]);"
E2_NEW="const qs=krulQs(nb);"
E3_OLD="const r=c.f['RULE'].match(/Commitment\\s*(\\d+)\\s*(?:--|—|–|:)?\\s*[\"\\u201c]([^\"\\u201d]+)[\"\\u201d]/i);"
E3_NEW="const r=c.f['RULE'].match(/Commitment\\s*(\\d+)\\s*(?:--|—|–|:)?\\s*(?:[\"\\u201c]([^\"\\u201d]+)[\"\\u201d]|['\\u2018](.+)['\\u2019]\\s*\\.?\\s*$)/i);if(r&&r[2]==null)r[2]=r[3]; /* pkgR2: a single-quoted RULE quote (run 32980 chatgpt) */"
QS=r"""// pkgR2 (run 32980 chatgpt): the quotes of a NAMED BY line, in double or single quotes. A single-quoted span opens after a start, space or
// opening mark and closes before an end, space or punctuation, so an apostrophe inside a word is not a mark; a double-quoted span inside it
// is part of it. Double-quoted spans outside every single-quoted span are read as before.
function krulQs(nb){const s=String(nb||'');const out=[];const used=[];
 for(const m of s.matchAll(/(^|[\s(\[;:,])['\u2018]((?:[^'\u2018\u2019]|['\u2019](?=[A-Za-z]))+?)['\u2019](?=$|[\s.,;:!?)\]])/g)){const a=m.index+m[1].length;used.push([a,a+m[0].length-m[1].length]);if(m[2].trim().length>=3)out.push(m[2]);}
 for(const m of s.matchAll(/["\u201c]([^"\u201d]{3,})["\u201d]/g)){if(!used.some(([a,b])=>m.index>=a&&m.index<b))out.push(m[1]);}
 return out;}
"""
ANCH="function krulCheckCard(c,SRC,own){"
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
plan={'base':'merged_PWQA','nodes':[]}
for f in sorted(glob.glob('../merged_PWQA/*.js')):
    n=os.path.basename(f);s=open(f).read();o=s
    k=[s.count(x) for x in (E1_OLD,E2_OLD,E3_OLD,ANCH)]
    if not any(k): continue
    assert k==[1,1,1,1],(n,k)
    s=s.replace(E1_OLD,E1_NEW).replace(E2_OLD,E2_NEW).replace(E3_OLD,E3_NEW).replace(ANCH,QS+ANCH)
    open(OUT+'/'+n,'w').write(s)
    plan['nodes'].append({'file':n,'name':n[:-3].replace('_',' '),'base_sha':sha(o),'final_sha':sha(s),'edits':['krulMatch combined card','krulQs single quotes','RULE single quotes']})
json.dump(plan,open('plan_R2.json','w'),indent=1);print(len(plan['nodes']))
