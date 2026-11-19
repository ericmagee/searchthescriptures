# ASK 500 A0: what the operator makes (W4; W1 C2 at 10125). No seat sees or types the value.
1. Make one random value of 32 characters or more (for example 64 hex characters from a password manager).
2. Supabase, Vault: add a secret with the name odv1_start_webhook and that value. The name must match exactly.
3. n8n, Credentials: add a "Header Auth" credential with the name "ODV1 start webhook", the header name x-odv1-key, and the same value.
4. The two values must be equal. If they differ, every launch is refused after A2 (plan Wrong-if 2).
5. Tell W4 when both exist. W4 checks them by name only: Vault by name, and n8n by credential name, to get its id for A2.
Order: the A1 rolled-back test runs BEFORE this step, because its T3 needs the secret to be absent (W1 C1).
