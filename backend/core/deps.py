from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from core.jwt_handler import decode_access_token, is_token_blacklisted  # 👈 import blacklist checker

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")  # 👈 corrected route

async def get_current_user(request: Request, token: str = Depends(oauth2_scheme)):
    # 🔒 Check if token is blacklisted
    if await is_token_blacklisted(token):
        raise HTTPException(status_code=401, detail="Token has been revoked (logged out)")

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return payload

async def is_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return user

async def is_authenticated(user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
