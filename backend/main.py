from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import shodan
import nmap

API_KEY = "6ackYFNANSBHVgmg2vFmp5GTo8DPEzez"
api = shodan.Shodan(API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/shodan")
async def get_shodan_info(ip: str):
    try:
        host = api.host(ip)
        return {"host": host}
    
    except shodan.APIError as e:
        return {"error": str(e)}


@app.get("/nmap")
async def get_nmap_info(ip: str):
    nm = nmap.PortScanner()
    try:
        scan_result = nm.scan(ip, arguments='-sS -T4 -A -v')
        with open("nmap_result.txt", "w") as f:
            f.write(str(scan_result))
        return {"nmap_result": scan_result}
    
    except Exception as e:
        return {"error": str(e)}