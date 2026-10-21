# BB-6904 revision 8, option 1 fix after live run 27528 (7255, 7256, 7258): files only, nothing written to n8n.
# Each anchor must occur exactly once in a node that holds it, or the patch refuses.
# Usage: python3 -I patch_fix.py <node .js in> <node .js out>
import sys
A=[]
# K. drvExhibits (17 nodes): a period that ends an ellipsis no longer cuts a layer's text, so a quotation like
#    "a virgin espoused... the virgin's name was Mary" keeps its closing mark (gemini, D6 vs C6, 27528).
A.append(("const cut=rest.search(/;|\\.\\s|\\s--\\s|",
          "const cut=rest.search(/;|(?<!\\.)\\.\\s|\\s--\\s|"))
# S. Format Markdown, item 8: a node read that fails or returns nothing is named in the section, not hidden (27528: "Sent to" short by four seats).
A.append(("const fromNode = (name, f) => { try { return f($(name)); } catch (e) { return null; } };",
          "const SENT_ERR = [];\n"
          "const fromNode = (name, f) => { try { const r = f($(name)); if (r == null || (Array.isArray(r) && !r.length)) SENT_ERR.push(name + ': the read returned nothing'); return r; }"
          " catch (e) { SENT_ERR.push(name + ': ' + String((e && e.message) || e).slice(0, 300)); return null; } };"))
A.append(("if (!SG.length && !SENT.cures.length) s8 +=",
          "if (SENT_ERR.length) s8 += '*Reads that gave no text:* ' + SENT_ERR.join('; ') + '.\\n\\n';\n"
          "if (!SG.length && !SENT.cures.length) s8 +="))
if __name__=='__main__':
    src=open(sys.argv[1],encoding='utf-8').read();out=src;n=0
    for old,new in A:
        c=out.count(old)
        if c==0: continue
        if c!=1: sys.exit('REFUSED: anchor occurs %d times: %r'%(c,old[:60]))
        out=out.replace(old,new);n+=1
    open(sys.argv[2],'w',encoding='utf-8').write(out)
    print(n,'anchors applied')
