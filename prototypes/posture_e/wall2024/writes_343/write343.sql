-- ASK 343 write (migration ask343_kjv_word_map_kjv_word_idx)
CREATE INDEX idx_kjv_word_map_kjv_word ON public.kjv_word_map USING btree (kjv_word);
