from fastapi import Header, HTTPException
from typing import Optional

async def get_current_user(authorization: Optional[str] = Header(None)):
    # MVP: trust token presence and extract uid passed as "Bearer <uid>"
    # TODO: verify Supabase JWT using JWKS for production
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    uid = authorization.split(" ",1)[1].strip()
    if len(uid) < 10:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"uid": uid}
