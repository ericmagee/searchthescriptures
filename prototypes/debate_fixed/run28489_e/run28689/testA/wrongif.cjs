// P2D wrong-if pre-run (BB-7994): known-bad = the 0.75 share rule (live and fix7 Quote Compare); known-good = rule (A)
// of WALL-1864/1865 (split at ellipsis, each segment contiguous in the folded verse, margin brackets dropped).
// Quotes and verses copied from fix7/test.cjs (rows e6253a01, 8a510163) and WALL-1862's four altered quotes; KJV rows from kjv_verses.
const V={
 'Gal 4:4':'But when the fulness of the time was come, God sent forth his Son, made of a woman, made under the law,',
 'Rom 1:3':'Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;',
 'Job 25:4':'How then can man be justified with God? or how can he be clean [that is] born of a woman?',
 'Mat 11:11':'Verily I say unto you, Among them that are born of women there hath not risen a greater than John the Baptist: notwithstanding he that is least in the kingdom of heaven is greater than he.',
 'Acts 16:13':'And on the sabbath we went out of the city by a river side, where prayer was wont to be made; and we sat down, and spake unto the women which resorted [thither]. [sabbath: Gr. sabbath day]',
 'Luke 3:23':'And Jesus himself began to be about thirty years of age, being (as was supposed) the son of Joseph, which was [the son] of Heli,',
 'John 6:42':'And they said, Is not this Jesus, the son of Joseph, whose father and mother we know? how is it then that he saith, I came down from heaven?',
 'John 1:45':'Philip findeth Nathanael, and saith unto him, We have found him, of whom Moses in the law, and the prophets, did write, Jesus of Nazareth, the son of Joseph.',
 'Luke 1:35':'And the angel answered and said unto her, The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also that holy thing which shall be born of thee shall be called the Son of God.',
 'Gen 16:10':'And the angel of the LORD said unto her, I will multiply thy seed exceedingly, that it shall not be numbered for multitude.'};
const T=[['Gal 4:4','made of a woman',1],['Rom 1:3','made of the seed of David according to the flesh',1],['Job 25:4','how can he be clean that is born of a woman?',1],
 ['Mat 11:11','among them that are born of women',1],['Acts 16:13','where prayer was wont to be made',1],['Acts 16:13','wont to be made',1],['Luke 3:23','(as was supposed)',1],
 ['John 6:42','Is not this Jesus, the son of Joseph',1],['John 1:45','Jesus of Nazareth, the son of Joseph',1],['Gen 16:10','I will multiply thy seed',1],
 ['Luke 1:35','The Holy Ghost shall come upon thee... therefore also that holy thing which shall be born of thee shall be called the Son of God',1],
 ['Gen 16:10','I will multiply thy daughters',0],['Luke 3:23','being (as was never supposed) the son of Joseph',0],['Gal 4:4','made of a virgin',0],['Gal 4:4','God sent forth his Son, born without a father',0]];
const words=s=>[...new Set(String(s).toLowerCase().replace(/[^a-z ]/g,' ').split(/\s+/).filter(w=>w.length>2))];
const share=(q,v)=>{const w=words(q.replace(/…|\.\.\./g,' '));if(w.length<3)return null;const t=new Set(words(v));return w.filter(x=>t.has(x)).length/w.length>=0.75;};
const fold=s=>' '+String(s).toLowerCase().replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim()+' ';
const A=(q,v)=>{const cv=fold(v);const sg=q.split(/…|\.\.\./).map(fold).filter(s=>s.trim());return sg.length>0&&sg.every(s=>cv.includes(s));};
for(const [name,f] of [['known-bad, 0.75 share',share],['known-good, rule (A)',A]]){let am=0,tn=0;
 for(const [r,q,ok] of T){const m=f(q,V[r]);if(!ok&&m===true)am++;if(ok&&m!==true)tn++;}
 console.log(name.padEnd(24),'altered quotes MATCHED:',am,'| true quotes not MATCHED:',tn);}
