# P3 (BB-7994, P2D BB-8004 step 6): item 1 (Init with Guards) and item 4 (Build Save Body) on live 23cf8db4 (p3/live_*.js).
# Each anchor exactly once or abort. Item 1's sentence is read from p3/item1_sentence.txt (taken by SQL from WALL-1838 reply 1882,
# md5 570f087b7b345e0da1c9ea69dc55ea68) and escaped for the double-quoted GUARDHOLD literal. Writes p3/new_<node>.js.
import hashlib, os, sys
D = os.path.dirname(os.path.abspath(__file__))
def patch(name, edits):
    src = open(os.path.join(D, 'live_' + name + '.js')).read(); out = src
    for old, new in edits:
        n = out.count(old)
        if n != 1: sys.exit('ABORT %s: anchor occurs %d times: %r' % (name, n, old[:80]))
        out = out.replace(old, new)
    open(os.path.join(D, 'new_' + name + '.js'), 'w').write(out)
    print(name, hashlib.md5(src.encode()).hexdigest(), '->', hashlib.md5(out.encode()).hexdigest(), len(out))
S = open(os.path.join(D, 'item1_sentence.txt')).read()
if hashlib.md5(S.encode()).hexdigest() != '570f087b7b345e0da1c9ea69dc55ea68': sys.exit('ABORT: item 1 sentence md5 moved')
ESC = S.replace('\\', '\\\\').replace('"', '\\"')
ANCH = '(for DG-8: Luke 1:34, Matthew 1:18, Matthew 1:25, Sight 1578 item 10).'
patch('Init_with_Guards', [(ANCH + ' In the link round', ANCH + ' ' + ESC + ' In the link round')])
SU = ("// Item 4 (WALL-1841 replies 1866-1869): the synthesis call's usage on one line, so a cut-off synthesis shows what spent its budget.\n"
      "const __SU=(()=>{const g=f=>{try{return f();}catch(e){return undefined;}};const sn=g(()=>$('Synthesis Normalizer').first().json)||null;"
      "const u=(sn&&sn.usage)||null;const ch=(sn&&Array.isArray(sn.choices)&&sn.choices[0])||null;"
      "const mt=g(()=>$('Build Synthesis').first().json.requestBody.max_tokens);const v=x=>(x===undefined||x===null||x==='')?'unknown':String(x);"
      "const rt=u&&u.completion_tokens_details?u.completion_tokens_details.reasoning_tokens:undefined;"
      "return '[SYNTHESIS USAGE: prompt='+v(u&&u.prompt_tokens)+' completion='+v(u&&u.completion_tokens)+' reasoning='+(u?((rt===undefined||rt===null)?'not reported':String(rt)):'unknown')+' finish='+v(ch&&ch.finish_reason)+' max_tokens='+v(mt)+']';})();FF.push(__SU);\n")
patch('Build_Save_Body', [("const RN=FF.length?FF.join(' '):null;", SU + "const RN=FF.length?FF.join(' '):null;")])
