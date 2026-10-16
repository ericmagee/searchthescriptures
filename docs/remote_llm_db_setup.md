# Connecting a Remote LLM to the Lab Database (Hermes)

How to give one outside model its own login to the lab's Supabase database and
connect it through Hermes Agent. Each step below was run on the operator's
machine on 2026-10-16.

This covers **connection only**. Onboarding (the gated load) is a separate
step, started only on the operator's word, in the model's own profile.

In every command, replace `<model>` with the model's name in lowercase, for
example `glm` or `qwen`. Each model gets its **own** login, its **own**
password, and its **own** Hermes profile.

---

## Rules that apply to every step

1. **The password never goes to any model.** It never goes in a chat message,
   a prompt, a screenshot, or a board row. It is typed only into the Supabase
   SQL editor and into the profile's `.env` file. If it is ever exposed, set a
   new one (Step 1) and update `.env`.
2. **Never authorize the model as a Supabase OAuth app,** and never give it a
   Supabase secret key.
3. **Use the model's own profile for everything.** Do not use the default
   profile and do not use another model's profile. Each Hermes profile has its
   own `config.yaml`, `.env` and memory, so a login placed in the wrong profile
   is handed to the wrong model.
4. **Edit the settings files in a text editor** that saves UTF-8. Do not
   rewrite them with PowerShell `Get-Content` / `Set-Content`. Windows
   PowerShell reads them in the wrong text encoding and corrupts any non-English
   character in the file.

---

## Step 0. Prerequisites (once per machine)

1. Hermes Agent is installed.
2. `uv` is installed. If `uvx` is not recognized, run this in PowerShell:
   ```
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```
   Then close and reopen PowerShell.
3. Confirm the database tool runs:
   ```
   uvx --python 3.12 --with "mcp<2" postgres-mcp --help
   ```
   It must print a help page. `--python 3.12` is required: a dependency will
   not build on Python 3.14. `--with "mcp<2"` is required: the tool breaks on
   version 2 of the `mcp` library.

---

## Step 1. Create the database login (Supabase SQL editor)

Choose a password of 24 or more characters, **letters and numbers only**. Then
run all four statements in the Supabase SQL editor:

```sql
CREATE ROLE <model>_seat LOGIN PASSWORD 'the-password';
GRANT lab_seat TO <model>_seat;
ALTER ROLE <model>_seat BYPASSRLS;
ALTER ROLE <model>_seat SET search_path TO public, pg_temp;
```

You cannot skip the `BYPASSRLS` line. Without it, the model connects but sees
every table as empty.

If the login already exists, change only the password:

```sql
ALTER ROLE <model>_seat PASSWORD 'the-password';
```

Verify the login is set up correctly:

```sql
SELECT r.rolname, r.rolcanlogin, r.rolbypassrls,
       pg_has_role(r.rolname, 'lab_seat', 'MEMBER') AS in_lab_seat
FROM pg_roles r WHERE r.rolname = '<model>_seat';
```

Expected: all three are true. Whether the password works is proven in
Step 6.

---

## Step 2. Create the model's Hermes profile

If the profile does not exist yet:

```
hermes profile create <model>
```

The profile's files are:

- `U:\hermes\profiles\<model>\.env`
- `U:\hermes\profiles\<model>\config.yaml`

---

## Step 3. Put the login in the profile's `.env`

Open `U:\hermes\profiles\<model>\.env` and add **one** line:

```
TRUTH_DB_URI=postgresql://<model>_seat.bhffmkginddovmdcpnty:the-password@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

Three parts of this line must be exact:

1. **The username carries the project ID:** `<model>_seat.bhffmkginddovmdcpnty`.
   Plain `<model>_seat` fails at this address.
2. **The address is the session pooler,**
   `aws-1-us-east-1.pooler.supabase.com`. The direct address
   `db.bhffmkginddovmdcpnty.supabase.co` cannot be reached from the operator's
   machine. It needs IPv6.
3. **The port is `5432`.**

The variable can be named `TRUTH_DB_URI` in every profile, because each
profile's `.env` is a separate file. It only has to match the name used in
Step 4.

---

## Step 4. Add the database server to the profile's `config.yaml`

Open `U:\hermes\profiles\<model>\config.yaml` and add this block. If an
`mcp_servers:` line already exists, add only the `truth_db:` part under it.

```yaml
mcp_servers:
  truth_db:
    connect_timeout: 120
    lazy: true
    command: "uvx"
    args: ["--python", "3.12", "--with", "mcp<2", "postgres-mcp", "--access-mode=unrestricted"]
    env:
      DATABASE_URI: "${TRUTH_DB_URI}"
```

Indentation is exact, and spaces only, no tabs:

- `truth_db:` is indented 2 spaces.
- `connect_timeout`, `lazy`, `command`, `args` and `env` are indented
  4 spaces.
- `DATABASE_URI` is indented 6 spaces.

Why each setting is there:

- `connect_timeout: 120`: the database tool takes about 35 seconds to start.
  The default limit is 30 seconds, so it times out without this setting.
- `lazy: true`: a chat fixes its tool list in its first seconds. Without this
  setting, the chat starts before the database tool is ready, and the model
  reports that the tool does not exist.

---

## Step 5. Check the settings and the connection (PowerShell)

Run these one at a time:

```
hermes -p <model> config check
```

It must report no formatting error. If it reports an error at a line number,
fix the indentation at that line (Step 4).

```
hermes -p <model> mcp test truth_db
```

It must show `Connected` and `Tools discovered: 9`.

"Connected" means only that the tool started. The tool signs in to the database
at its first query, so Step 6 is what proves the login works.

---

## Step 6. Prove the login from inside the model's session

Open a session **under the model's own profile**, in the harness the model will
work in. Wait about 40 seconds after it opens, then send:

```
Use mcp__truth_db__execute_sql to run: SELECT current_user;
```

The tool's name has **double** underscores: `mcp__truth_db__execute_sql`.

Expected result: `<model>_seat`.

Then send the stamp check, as **one** call:

```
Use mcp__truth_db__execute_sql to run, as one call:
SET truth.session_id = 'hermes_<model>_01'; SELECT current_setting('truth.session_id', true);
```

Expected result: `hermes_<model>_01`.

The connection is done. **Stop here.** Onboarding is a separate step, on the
operator's word.

---

## How the model must stamp its writes

This tool returns **only the last statement's result**, and every write must
carry the model's identity. So every call that writes is one call in this form:

```
SET truth.session_id = 'hermes_<model>_01'; <the write>;
```

Re-issue the `SET` at the start of every such call.

Do **not** use `BEGIN; SET LOCAL ...; ...; COMMIT;`. With this tool, the last
statement is `COMMIT`, so nothing can be read back.

One identity string per model, used forever: `hermes_<model>_01`.

---

## Troubleshooting (every error below was seen on 2026-10-16)

| Symptom | Cause | Fix |
|---|---|---|
| `uvx` is not recognized | `uv` is not installed | Step 0.2 |
| `pglast` fails to build | Python 3.14 was used | `--python 3.12` in `args` |
| `ModuleNotFoundError: mcp.server.fastmcp` | `mcp` library version 2 | `--with "mcp<2"` in `args` |
| Host name does not resolve, or the connection hangs | Direct `db.` address | Use the pooler address (Step 3) |
| `password authentication failed for user "<model>_seat"` | Wrong password, or username without the project ID | Set the password again (Step 1); check the username (Step 3) |
| `timed out after 30s` | No `connect_timeout`, or the file did not load | Step 4; run `config check` |
| `formatting error at line N` / `mapping values are not allowed here` | Wrong indentation | Step 4 indentation rules |
| `unacceptable character #x...` | File rewritten in the wrong encoding | Restore a backup; edit in a text editor only |
| Model says `mcp_truth_db_execute_sql` was not found | Wrong name, or the tool was not ready when the chat started | Use `mcp__truth_db__execute_sql`; `lazy: true`; wait 40 s; or `/reload-mcp` |
| The stamp check returns `No results` | `COMMIT` was the last statement | Use the stamp form above |
| The model sees every table as empty | `BYPASSRLS` missing | Step 1, the `ALTER ROLE ... BYPASSRLS` line |

---

## Where the lab manual is out of date

The `llm_seat_manual` table, version 1, is out of date on three points. This
file reflects what actually worked:

1. Its Step 4 gives the direct `db.` address. The pooler address and the
   project-qualified username are required (Step 3 above).
2. Its Step 5 gives `SET LOCAL` as the stamp. This tool needs the form under
   "How the model must stamp its writes."
3. It does not mention the Hermes settings (`connect_timeout`, `lazy`), the
   tool name, or the Python and `mcp` version pins.

Changing the manual needs the operator's approval.

---

## The limits an outside seat carries

These are rulings, not defects:

1. **It cannot fold.** It has no `session_`/`cse_` id.
2. **It cannot be woken by a bell.**
3. **It cannot post to the blackboard.**

Its work is still attributed to it through the stamp in the audit log.
