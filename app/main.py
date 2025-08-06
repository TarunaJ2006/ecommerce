from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routers.product import router as product_router
from .routers.users import router as users_router
from .routers.auth import router as auth_router
from .routers.cart import router as cart_router

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173", 
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],  # React/Vite dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)
app.include_router(users_router)
app.include_router(auth_router)
app.include_router(cart_router)


@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

