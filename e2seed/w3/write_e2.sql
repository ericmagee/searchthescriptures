-- E2 corpus write (W3 only, on Eric's card). Guard: Sight 1822 (kb_sights id 2028) summary md5 must equal 6d9f79c3796a9487a7059328f6e26d8f and the anchor must occur once.
SET LOCAL truth.session_id='session_01H1X3ANsGiMnhnbkfphocmo';
UPDATE kb_sights SET summary = replace(summary,
  'The layers for each step are held in Sight 266 (THREE EVENTS, NOT ONE).' || E'\n\nIN DEBATE, SAY:',
  'The layers for each step are held in Sight 266 (THREE EVENTS, NOT ONE).' || E'\n\n' || $p$IN ROUND 1, STATE WHAT BIOLOGICAL MEANS (operator, 11-23; ruling: "Out of the loins is seed", Wall 10642), after the account above and before the IN DEBATE order below. Biological means seed (sperma): seed out of a man's loins. Lay the rows whole, precept upon precept:
1. Genesis 35:11-12: "And God said unto him, I [am] God Almighty: be fruitful and multiply; a nation and a company of nations shall be of thee, and kings shall come out of thy loins; And the land which I gave Abraham and Isaac, to thee I will give it, and to thy seed after thee will I give the land." The kings out of Jacob's loins are his seed after him.
2. 2 Samuel 7:12: "And when thy days be fulfilled, and thou shalt sleep with thy fathers, I will set up thy seed after thee, which shall proceed out of thy bowels, and I will establish his kingdom."
3. The same promise, told of the son: 1 Kings 8:19: "Nevertheless thou shalt not build the house; but thy son that shall come forth out of thy loins, he shall build the house unto my name." 2 Chronicles 6:9: "Notwithstanding thou shalt not build the house; but thy son which shall come forth out of thy loins, he shall build the house for my name." The seed out of the bowels (2 Samuel 7:12) is the son out of the loins (1 Kings 8:19; 2 Chronicles 6:9).
4. To Christ: Acts 2:30: "Therefore being a prophet, and knowing that God had sworn with an oath to him, that of the fruit of his loins, according to the flesh, he would raise up Christ to sit on his throne;" Romans 1:3: "Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;"
[L2] "seed" is zera (H2233) at Genesis 35:12 and 2 Samuel 7:12, and sperma (G4690) at Romans 1:3. Gloss sperma only by its KJV renderings: seed, seeds, issue. "loins" is H2504 at Genesis 35:11, 1 Kings 8:19 and 2 Chronicles 6:9, and osphys (G3751) at Acts 2:30.$p$ || E'\n\nIN DEBATE, SAY:'),
  updated_at = now()
WHERE id = 2028 AND md5(summary) = '6d9f79c3796a9487a7059328f6e26d8f'
RETURNING id, length(summary), md5(summary);
