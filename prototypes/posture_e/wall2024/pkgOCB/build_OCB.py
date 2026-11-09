#!/usr/bin/env python3
"""pkgOCB (item B of WALL-3714, builder W4): the Oracle's start briefing on contradictions at closing.
usage: python3 build_OCB.py <live fetchback> <out target.json>
B1 Init with Guards: the CONTRADICTION WATCH text at the end of the Oracle seat prompt (profile oracle only).
B2 C4 Build: the OPPONENT'S CONTRADICTIONS ask in the [DR4] request, only when the challenger's prompt carries B1.
B3 the 12 __ogrS nodes: quotations inside the OPPONENT'S CONTRADICTIONS section are the defender's words (as the OPPONENT'S GRANTS section).
B4 C4, C4G, C4B Extract: the section read back (record only); field `contradictions` for item A's enforcer."""
import json, sys, copy
src, out = sys.argv[1], sys.argv[2]
w = json.load(open(src)); N = {n['name']: n for n in w['nodes']}
def sub(name, a, b, count=1):
    s = N[name]['parameters']['jsCode']; k = s.count(a)
    if k != count: raise SystemExit('%s: %d hits (want %d) for %r' % (name, k, count, a[:90]))
    N[name]['parameters']['jsCode'] = s.replace(a, b)
B1 = ("\n\nCONTRADICTION WATCH. This debate is held as a court room, and a contradiction is perjury. From your opponent's first round on, keep track of what your opponent states. "
      "If your opponent's closing round states something that cannot be true together with something your opponent stated in an earlier round, that is a contradiction. "
      "Once the enforcer confirms it, it breaks, by default, the chain link it belongs to. A withdrawal made after the contradiction does not undo it: your opponent is caught at that point. "
      "The same rule binds you: do not contradict in your closing round anything you stated earlier.")
B2 = ("OPPONENT'S CONTRADICTIONS. After your OPPONENT'S GRANTS section (if you write one), write this section, one line for each contradiction in your opponent's closing round [CR4], in this form:\n"
      "OPPONENT'S CONTRADICTIONS:\n"
      "X<n> LINK <n> (or PREMISE <n>) | EARLIER [<round>] \"<your opponent's earlier sentence, word for word>\" | CLOSING [CR4] \"<your opponent's closing sentence, word for word>\" | <one clause: why both cannot be true>\n"
      "Quote both sentences exactly as your opponent wrote them, with their rounds; a line whose quotations are not found word for word in the rounds named is not counted. "
      "If you find none, write: OPPONENT'S CONTRADICTIONS: NONE.")
# B1: Init with Guards, oracle branch only (the oracle return ends with WINPANEL(role)+R.tt;)
sub('Init with Guards', "+WINPANEL(role)+R.tt;", "+WINPANEL(role)+R.tt+__OCB1;")
sub('Init with Guards', "const build=(role,seat,pos)=>{", "const __OCB1=" + json.dumps(B1) + "; /* pkgOCB B1 (operator 11-09 14:31/14:42 CST, WALL-3714 item B): the Oracle's start briefing on contradictions at closing */\nconst build=(role,seat,pos)=>{")
# B2: C4 Build
sub('C4 Build', "const sys=I.csys;const msgs=", "/* pkgOCB B2 */const __OCB2=/CONTRADICTION WATCH\\./.test(String(I.csys||''))?" + json.dumps(B2) + ":''; const sys=I.csys;const msgs=")
sub('C4 Build', "+(__OGRB?'\\n\\n'+__OGRB:'')", "+(__OGRB?'\\n\\n'+__OGRB:'')+(__OCB2?'\\n\\n'+__OCB2:'')")
# B3: __ogrS in every node that defines it
OLD = ("const __ogrS=t=>{const T=String(t||'');const i=T.search(/OPPONENT['\\u2019]?S GRANTS\\s*:/i);if(i<0)return T;const L=T.slice(i).split('\\n');const G=/^\\s*[-*]?\\s*\\**\\s*G(?:\\d+|\\+)/;"
       "let n=1;while(n<L.length&&(G.test(L[n])||(!L[n].trim()&&n+1<L.length&&G.test(L[n+1]))))n++;const sec=L.slice(0,n).join('\\n');return T.slice(0,i)+sec.replace(/[\"\\u201c][^\"\\u201d\\n]*[\"\\u201d]/g,'\"\"')+T.slice(i+sec.length);};")
NEW = ("const __ogrS=t=>{const __sb=(T,H,G)=>{const i=T.search(H);if(i<0)return T;const L=T.slice(i).split('\\n');"
       "let n=1;while(n<L.length&&(G.test(L[n])||(!L[n].trim()&&n+1<L.length&&G.test(L[n+1]))))n++;const sec=L.slice(0,n).join('\\n');return T.slice(0,i)+sec.replace(/[\"\\u201c][^\"\\u201d\\n]*[\"\\u201d]/g,'\"\"')+T.slice(i+sec.length);};"
       "return __sb(__sb(String(t||''),/OPPONENT['\\u2019]?S GRANTS\\s*:/i,/^\\s*[-*]?\\s*\\**\\s*G(?:\\d+|\\+)/),/OPPONENT['\\u2019]?S CONTRADICTIONS\\s*:/i,/^\\s*[-*]?\\s*\\**\\s*X\\d+/);}; /* pkgOCB B3: and of the OPPONENT'S CONTRADICTIONS section */")
b3 = [n for n in N if OLD in (N[n]['parameters'].get('jsCode') or '')]
if len(b3) != 12: raise SystemExit('B3: %d nodes hold the __ogrS definition, want 12: %s' % (len(b3), b3))
for n in b3: sub(n, OLD, NEW)
# B4: read back in the three close-round extracts
CHK = ("/* pkgOCB B4: the OPPONENT'S CONTRADICTIONS section read back (record only; item A's enforcer reads the found lines) */"
 "let contradictions=null;try{const __OR={CR1:$('D1 Extract').first().json.raw,CR2:$('D2B Extract').first().json.raw,CR3:$('D3B Extract').first().json.raw,CR4:$('D4B Extract').first().json.raw};"
 "const N=s=>String(s==null?'':s).replace(/[*_`]+/g,'').replace(/[\\u201c\\u201d]/g,'\"').replace(/[\\u2018\\u2019]/g,\"'\");const W=s=>N(s).toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\\s+/g,' ').trim();"
 "const T=N(raw);const i=T.search(/OPPONENT'?S CONTRADICTIONS\\s*:/i);"
 "if(i<0)contradictions={section:false,none:false,lines:[],found:0,not_found:0};else{const A=T.slice(i).split('\\n');const none=/CONTRADICTIONS\\s*:\\s*NONE\\b/i.test(A[0]);const lines=[];"
 "for(const l0 of A.slice(1)){const l=l0.trim();if(!l){if(lines.length)break;continue;}if(!/^[-*]?\\s*X\\d+/.test(l))break;"
 "const x=(l.match(/X(\\d+)/)||[])[1];const on=l.match(/\\b(LINK|PREMISE)\\s+(\\d+)/i);const e=l.match(/EARLIER\\s*\\[(CR[1-4])\\]\\s*\"(.*?)\"\\s*\\|\\s*CLOSING/i);const c=l.match(/CLOSING\\s*\\[(CR[1-4])\\]\\s*\"(.*)\"\\s*\\|/i);"
 "const eok=!!(e&&e[1]!=='CR4'&&e[2].trim().split(/\\s+/).length>=3&&W(__OR[e[1]]).includes(W(e[2])));const cok=!!(c&&c[1]==='CR4'&&c[2].trim().split(/\\s+/).length>=3&&W(__OR.CR4).includes(W(c[2])));"
 "lines.push({x:x?Number(x):null,on:on?on[1].toUpperCase()+' '+on[2]:null,earlier_round:e?e[1]:null,earlier:e?e[2].slice(0,300):null,closing_round:c?c[1]:null,closing:c?c[2].slice(0,300):null,earlier_found:eok,closing_found:cok,found:eok&&cok,why:String(l.split('|').slice(-1)[0]||'').trim().slice(0,200)});}"
 "contradictions={section:true,none,lines,found:lines.filter(z=>z.found).length,not_found:lines.filter(z=>!z.found).length};}}catch(x){contradictions={error:String(x&&x.message||x).slice(0,200)};} ")
for ex in ['C4 Extract', 'C4G Extract', 'C4B Extract']:
    sub(ex, "\nlet renumbered=[];", "\n" + CHK + "\nlet renumbered=[];")
    sub(ex, "grants,grants_check}}];", "grants,grants_check,contradictions}}];")
json.dump({'nodes': w['nodes'], 'connections': w['connections']}, open(out, 'w'))
print('pkgOCB built: B1 Init with Guards; B2 C4 Build; B3 __ogrS in', len(b3), 'nodes:', ', '.join(b3), '; B4 C4/C4G/C4B Extract')
