# prints the exact update_workflow operations JSON for one node file: python3 emit.py <File_Name.js>
import json,sys,os
H=os.path.dirname(os.path.abspath(__file__));f=sys.argv[1];nm=f[:-3].replace('_',' ')
t=open(os.path.join(H,'new',f),encoding='utf-8').read()
print(json.dumps([{"type":"updateNodeParameters","nodeName":nm,"replace":False,"parameters":{"jsCode":t}}],ensure_ascii=False))
