# ASK 422(b) plan rev 1 (W3): strip code comments from the live flow

Assignment (W3 Wall 8826): plan W3, build W1, grade W2 and W4; W4 writes it on the operator's card.
Efficiency item. No prompt text, no model setting, no reasoning setting and no behaviour changes.

## Size, measured on live (acorn 8.12.1 tokenizer, 16:31 CST 11-18)
- Engine 36fcf36b: 182 Code nodes, 3,558,889 characters; 107 nodes carry comments, 144,253 comment characters (4.1%).
- Child 365d2828: 62 Code nodes, 1,129,352 characters; 57 nodes carry comments, 13,369 comment characters.
- The Shared Library node (both workflows) does not parse as one program: its /*LIB*/ and /*MAP*/ markers are read by
  every stub, and its MAP entries (for example REFP {n:8133, p:[[490,511]]}) count characters and lines. It is out of scope.

## Method
1. Remove only comment tokens, located by the acorn tokenizer (onComment), each Code node parsed as the body of an
   async function as n8n runs it. Every other character stays, so strings, regex literals and template text holding
   "//" or "/*" are untouched. A removed line comment leaves its line break; a removed block comment that stood
   between two tokens leaves one space.
2. Excluded: the Shared Library node in both workflows; any comment whose text is a marker read by code (W1 lists
   them by searching every node for indexOf or a regex on "/*"); any node acorn cannot parse (named, left as is).
3. The commented source of every node is kept in git (W1's build commit), and the pre-write fetch is the revert.

## Proof (ASK 411)
1. Per node: the acorn AST of the stripped code equals the AST of the original, positions and comments ignored.
   All 107 engine nodes and 57 child nodes, or each exception named.
2. The ASK 409 loaders stay one text: the 30 loader nodes hold the same loader after the strip.
3. Stored-row replay: the 15-node [L2] chain and the Assume Check pair on runs 39015 and 39266 give identical output
   before and after.
4. Size before and after, per workflow, and n8n load time of the engine (W4 measures one open of the workflow).
5. The ASK 385 one-copy registry (a385/registry.json) is re-derived for the stripped texts and its check passes.

## After the write
- Engine manual section 15, "Comments: live Code nodes carry code comments", becomes the stripped rule; that is a
  manual version written by W3 on the operator's card in W3's thread.
- New code after the strip carries no comments; a builder's notes go in git and on the Wall. Graders read for it
  (ASK 413: the touched section's rules).

## Limits
The ASK names and package tags in comments leave the live flow; they remain in git and in the manual.
The library's own comments stay until a later package re-packs the library.
