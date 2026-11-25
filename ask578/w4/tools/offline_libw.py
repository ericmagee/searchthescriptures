# Offline harness (W4, ASK 578): runs libw.py with the n8n API stubbed from local files; any PUT raises. No network.
import sys,json,io,runpy,urllib.request,os
LIVE={'moMxiV4Irg1uRBZN':os.environ['OFF_ENG'],'MqQHRl7mQQ0z8QdT':os.environ['OFF_CHILD']}
class R(io.BytesIO):
  def __enter__(s):return s
  def __exit__(s,*a):pass
def fake(r,timeout=None):
  if r.get_method()!='GET':raise SystemExit('OFFLINE: a %s was attempted; nothing sent'%r.get_method())
  u=r.full_url
  if 'executions?' in u:return R(b'{"data":[]}')
  w=u.rsplit('/',1)[1];d=json.load(open(LIVE[w]));d=d.get('data',d);return R(json.dumps(d).encode())
urllib.request.urlopen=fake
os.environ.setdefault('N8N_API_KEY','offline')
sys.argv=[sys.argv[1]]+sys.argv[2:];runpy.run_path(sys.argv[0],run_name='__main__')
