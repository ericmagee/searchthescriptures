#!/bin/sh
# Fetch the round texts of runs 30196, 30268, 30304 and judgment 865 by REST (anon key, read only). Output saved by tool, never retyped.
K='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZmZta2dpbmRkb3ZtZGNwbnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4ODUxNjQsImV4cCI6MjA5NTQ2MTE2NH0.cdNxsU48LeMM8RBnmplA1TbRJo12OpJKNwCgYRJvwxA'
B=https://bhffmkginddovmdcpnty.supabase.co/rest/v1
curl -sS -m 60 "$B/debate_results?select=run_token,claude_r1,claude_r2,engine_r3,engine_r1,engine_r2,challenger_r3&run_token=in.(ODV1-30196-rymz70zp,ODV1-30268-3q7ubjd7,ODV1-30304-tz1mntnx)" -H "apikey: $K" -H "Authorization: Bearer $K" > rounds.json
curl -sS -m 60 "$B/debate_judgments?select=id,verdict_raw&id=eq.865" -H "apikey: $K" -H "Authorization: Bearer $K" > j865.json
