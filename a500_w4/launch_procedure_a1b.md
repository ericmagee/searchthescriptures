# ASK 500 A1b: W4's launch procedure after A1 (W4)
Read 11-19: runstart.py (ASK 419, md5 5949c43a; rev 2 9ef757fd) only checks; it never posts. Its checks are: 0 live guards, 1 nothing running, 2 versions, 3 library sha, 4 one copy (ASK 385) and 5 body shape. The POST to oracle-debate-v1 was a separate step (runs 440 and 40891).
So A1b changes no code. It changes the procedure:
1. Run runstart.py exactly as today (GO or REFUSED), with the same arguments.
2. On GO, launch with one SQL call as postgres: SELECT public.dash_launch_odv1(<topic>, <def engine>, <def profile>, <ch engine>, <ch profile>[, <fence reason>]). The values are taken from the released body file, the same five fields that runstart check 5 validates.
3. Read the returned status. "fired" with a request_id means the launch went out; then read net._http_response for that request_id (status code only). "error" means nothing went out; the message says why (for example the fence, plan Wrong-if 5).
4. Never POST to the URL directly again. After A2, a direct POST is refused.
Effect: W4's launches get the topic fence and the odv1_launches log, and they send the header from Vault. No seat sees the value.
