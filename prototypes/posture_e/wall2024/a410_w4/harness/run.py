#!/usr/bin/env python3
# ASK 410 harness, step 2: send each request through the temporary n8n webhook; one file per request in OUT; resumable.
# Usage: python3 run.py requests.json OUT WEBHOOK_URL [--only EA,PL,D4] [--seats a,b] [--workers 4] [--limit N]
import json, sys, os, time, argparse, urllib.request, concurrent.futures as cf
ap = argparse.ArgumentParser()
ap.add_argument('reqs'); ap.add_argument('out'); ap.add_argument('url')
ap.add_argument('--only', default=''); ap.add_argument('--seats', default='')
ap.add_argument('--workers', type=int, default=4); ap.add_argument('--limit', type=int, default=0)
a = ap.parse_args()
R = json.load(open(a.reqs)); os.makedirs(a.out, exist_ok=True)
if a.only: R = [r for r in R if r['set'] in a.only.split(',')]
if a.seats: R = [r for r in R if r['seat'] in a.seats.split(',')]
R = [r for r in R if not os.path.exists(os.path.join(a.out, r['key'] + '.json'))]
if a.limit: R = R[:a.limit]
print('to send', len(R), flush=True)
def send(r):
    data = json.dumps({'route': r['route'], 'body': r['body']}).encode()
    t0 = time.time(); res = None; err = None
    try:
        q = urllib.request.Request(a.url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
        with urllib.request.urlopen(q, timeout=960) as h: res = json.loads(h.read().decode() or 'null')
    except Exception as e: err = str(e)[:300]
    dt = round(time.time() - t0, 1)
    json.dump({'key': r['key'], 'set': r['set'], 'src': r['src'], 'seat': r['seat'], 'rep': r['rep'], 'seconds': dt, 'error': err, 'response': res}, open(os.path.join(a.out, r['key'] + '.json'), 'w'))
    return r['key'], dt, err
with cf.ThreadPoolExecutor(a.workers) as ex:
    for i, (k, dt, err) in enumerate(ex.map(send, R), 1):
        print(i, k, dt, 'ERR ' + err if err else 'ok', flush=True)
