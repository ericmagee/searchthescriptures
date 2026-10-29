import json,sys
s=json.dumps(open('final/'+sys.argv[1]+'.js').read());n=int(sys.argv[2]) if len(sys.argv)>2 else 15000
for i in range(0,len(s),n): print('=====CHUNK',i//n); print(s[i:i+n])
