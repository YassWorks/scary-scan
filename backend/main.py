from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import shodan
import nmap
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

API_KEY = "API_KEY"
api = shodan.Shodan(API_KEY)

app = FastAPI()

MONGO_URL = "MONGO_URL"
client = AsyncIOMotorClient(MONGO_URL)
db = client.scan_results_db

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

        scan_entry = {
            "service": "Shodan",
            "time": datetime.now(),
            "data": str(host)
        }
        await db.shodan_scans.insert_one(scan_entry)

        return {"host": host}
    
    except shodan.APIError as e:
        return {"error": str(e)}


@app.get("/nmap")
async def get_nmap_info(ip: str):
    nm = nmap.PortScanner()
    try:
        scan_result = nm.scan(ip, arguments='-sS -T4 -A -v')
        
        scan_entry = {
            "service": "Nmap",
            "time": datetime.now(),
            "data": str(scan_result)
        }
        await db.nmap_scans.insert_one(scan_entry)

        return {"nmap_result": scan_result}
    
    except Exception as e:
        return {"error": str(e)}
    

@app.get("/history/shodan")
async def get_history(query: str = ""):
    if query:
        filter = {"data": {"$regex": query, "$options": "i"}}
    else:
        filter = {}
    results = await db.shodan_scans.find(filter).to_list(100)
    
    for doc in results:
        doc["_id"] = str(doc["_id"])
        if isinstance(doc.get("time"), datetime):
            doc["time"] = doc["time"].isoformat()
    return {"results": results}


@app.get("/history/nmap")
async def get_history(query: str = ""):
    if query:
        filter = {"data": {"$regex": query, "$options": "i"}}
    else:
        filter = {}
    results = await db.nmap_scans.find(filter).to_list(100)
    
    for doc in results:
        doc["_id"] = str(doc["_id"])
        if isinstance(doc.get("time"), datetime):
            doc["time"] = doc["time"].isoformat()
    return {"results": results}
