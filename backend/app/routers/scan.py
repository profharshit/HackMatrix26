from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.modules.safe_target import points_to_private_address
from app.orchestrator import extract_domain, scan_url

router = APIRouter(prefix="/api")
saved_scans = {}


class ScanRequest(BaseModel):
    url: str


# Runs a full scan and keeps the result so the frontend can reopen it by id
@router.post("/scan")
def create_scan(request: ScanRequest):
    targetUrl = request.url.strip()
    if not targetUrl:
        raise HTTPException(status_code=422, detail="url must not be empty")
    if points_to_private_address(extract_domain(targetUrl)):
        raise HTTPException(status_code=400, detail="url must point to a public website")
    result = scan_url(targetUrl)
    saved_scans[result["id"]] = result
    return result


# Lets the page reload an old result without scanning the site again
@router.get("/scan/{scan_id}")
def get_scan(scan_id: str):
    if scan_id not in saved_scans:
        raise HTTPException(status_code=404, detail="scan not found")
    return saved_scans[scan_id]