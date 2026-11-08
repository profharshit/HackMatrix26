from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.orchestrator import scan_url

router = APIRouter(prefix="/api")
saved_scans = {}


class ScanRequest(BaseModel):
    url: str


# Runs a full scan and keeps the result so the frontend can reopen it by id
@router.post("/scan")
def create_scan(request: ScanRequest):
    if not request.url.strip():
        raise HTTPException(status_code=422, detail="url must not be empty")
    result = scan_url(request.url.strip())
    saved_scans[result["id"]] = result
    return result


# Lets the page reload an old result without scanning the site again
@router.get("/scan/{scan_id}")
def get_scan(scan_id: str):
    if scan_id not in saved_scans:
        raise HTTPException(status_code=404, detail="scan not found")
    return saved_scans[scan_id]
