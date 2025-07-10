from fastapi import APIRouter, HTTPException,Depends,Request
from core.database import db
from schemas.user_schema import UserCreate, UserResponse,UserLogin
from controllers.auth_controller import hash_password
from core.jwt_handler import create_access_token
from models.user_model import user_helper
from datetime import datetime
from passlib.context import CryptContext
from core.deps import get_current_user
router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


@router.post("/signup", response_model=UserResponse)
async def signup(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "role": "user",
        "created_at": datetime.utcnow()
    }

    result = await db.users.insert_one(new_user)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return user_helper(created_user)


@router.post("/login")
async def login(form_data: UserLogin):
    user = await db.users.find_one({"email": form_data.email})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    role = user.get("role", "user")  # Default to "user" if role not set

    token = create_access_token({
        "id": str(user["_id"]),
        "email": user["email"],
        "role": role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role  # <-- This line is important for frontend logic
    }
@router.post("/logout")
async def logout(request: Request, user=Depends(get_current_user)):
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid Authorization header")

    token = auth_header.split(" ")[1]

    # Check if already blacklisted
    exists = await db.blacklisted_tokens.find_one({"token": token})
    if not exists:
        await db.blacklisted_tokens.insert_one({"token": token})

    return {"message": "Logout successful"}
