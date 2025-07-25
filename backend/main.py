from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth
from routes import auth, products,categories,cart,order,wishlist,google_oauth,ai
app = FastAPI()

# Allow frontend requests (Vercel)
origins = [
    "http://localhost:3000",
    "https://smf-jewels.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(categories.router, prefix="/api/category", tags=["Category"])
app.include_router(cart.router)
app.include_router(order.router)
app.include_router(wishlist.router)
app.include_router(google_oauth.router)
app.include_router(ai.router, prefix="/api/ai")
@app.get("/")
def read_root():
    return {"message": "SMF Jewels Backend Running!"}
