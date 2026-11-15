import re,sys
p=sys.argv[1];s=open(p).read()
a=s.index("   ['DG-18 (the title of Luke 1:35")
b=s.index("return null;}]];",a)+len("return null;}]];")
new=r"""   ['DG-18 (the title of Luke 1:35 read as resting on the conception)',(t,ng)=>{const CL=/[:;](?=\s)|,\s+(?:and|but|while|whereas)\s/g;const GW=/\b(?:grounds?|grounded|rests?|resting|ties|tying|because|on\s+that|reason)\b/gi;
     for(const m of t.matchAll(/[^.\n]*[.\n]?/g)){const x=m[0];if(!x.trim()||ATT.test(x))continue;const y=x.replace(/\b(?:no|not|nor|without)\s+(?:\w+\s+)?(?:begetting|begotten|conception)\b/gi,' ');
      const hit=(/\b(?:therefore|Son\s+of\s+God|dio\s+kai)\b/i.test(y)&&CAUSE.test(y)&&GR.test(y))||/\b(?:1:35|therefore(?:\s+also)?|dio\s+kai)\b[^.;]{0,60}?(?:\bgrounds?\b|\bground\s+(?:of|for)\b|\bgives\s+(?:a|the|its)\s+ground\b|\badds\s+(?:a|the)\s+ground\b)[^.;]{0,60}?\b(?:title|calling)\b/i.test(y);
      if(!hit)continue;let ok=false;for(const g of x.matchAll(GW)){let st=0;for(const c of x.slice(0,g.index).matchAll(CL))st=c.index+c[0].length;if(!NEGW.test(nm0(x.slice(st,g.index)))){ok=true;break;}}
      if(ok)return {0:x.trim(),index:m.index};}return null;}]];"""
s=s[:a]+new+s[b:]
s=s.replace(r"|\bnot\s+a\s+mere\b/gi,' ')",r"|\bnot\s+a\s+mere\b|\bfear\s+not\b/gi,' ')",1)
s=s.replace(r"gives\s+(?:a|the)\s+ground|adds",r"gives\s+(?:a|the|its)\s+ground|adds",1)
open(p,'w').write(s)
