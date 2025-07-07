from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
import os

router = APIRouter()
oauth = OAuth()

oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
)

@router.get("/auth/google")
async def login_via_google(request: Request):
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")  # e.g. http://localhost:8000/auth/google/callback
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = await oauth.google.parse_id_token(request, token)

    # Save to MongoDB if not exists
    from core.database import db
    users_collection = db["users"]

    existing_user = await users_collection.find_one({"email": user_info['email']})
    if not existing_user:
        await users_collection.insert_one({
            "name": user_info['name'],
            "email": user_info['email'],
            "picture": user_info['picture'],
            "is_google": True
        })

    # Generate your JWT token logic here (optional)
    return RedirectResponse(url="http://localhost:3000")  # or your frontend URL
