## pkgRHN rev 2: the round-heading normalizer rewrites only a heading line
The normalizer in the 17 round Extract nodes changes a wrong round number in the first three non-empty lines only when the line is a heading.
- Any line: not a heading when my, our, your, his, its, their, the, this, that, in, of, from, to, at, by, before, after or since stands before "Round".
- A line that does not begin with "#": also not a heading when a possessive ("defender's", "sides'") or under, during, as, with, for, on or through stands before "Round".
- A line that neither begins with "#" nor is bold or underlined whole: also not a heading when it is over 160 characters, has over 40 characters before "Round", holds a sentence break, ends in . : ; ! ?, or carries words after the number that do not begin with a dash, colon, bar, bracket, comma or equals sign, or run past 40 characters.
- A whole-bold line that ends in . ; ! ? inside the bold is read as a sentence, not a heading.
