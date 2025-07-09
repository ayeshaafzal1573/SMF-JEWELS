from fastapi import APIRouter, HTTPException, Depends,Form, File, UploadFile
from schemas.product_schema import ProductCreate, ProductResponse
from controllers.product_controller import (
    create_product, update_product, delete_product,
    get_all_products, get_product_by_id
)
from bson import ObjectId
from typing import List, Optional
from core.database import db
from models.product_model import product_helper
from core.deps import is_admin
from core.cloudinary_config import cloudinary

router = APIRouter()

# ✅ POST /products (Admin Only)

@router.post("/add-product", response_model=ProductResponse)
async def add_product(
    name: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    description: str = Form(""),
    shortDescription: str = Form(""),
    sku: str = Form(""),
    stock: int = Form(...),
    weight: str = Form(""),
    dimensions: str = Form(""),
    featured: bool = Form(False),
    images: Optional[List[UploadFile]] = File(None),
    user=Depends(is_admin)
):
    # Upload all images to Cloudinary
    image_urls = []
    if images:
        for image in images:
            try:
                result = cloudinary.uploader.upload(image.file, folder="products")
                image_urls.append(result["secure_url"])
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    # Build product dict
    product_data = {
        "name": name,
        "price": price,
        "category": category,
        "description": description,
        "shortDescription": shortDescription,
        "sku": sku,
        "stock": stock,
        "weight": weight,
        "dimensions": dimensions,
        "featured": featured,
        "images": image_urls
    }

    # Save to DB
    new_product = await create_product(product_data)
    return new_product


@router.put("/update-product/{product_id}", response_model=ProductResponse)
async def update_product_route(
    product_id: str,
    name: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    description: str = Form(""),
    shortDescription: str = Form(""),
    sku: str = Form(""),
    stock: int = Form(...),
    weight: str = Form(""),
    dimensions: str = Form(""),
    featured: bool = Form(False),
    existing_images: Optional[str] = Form(""),  # Comma-separated URLs
    images: Optional[List[UploadFile]] = File(None),
    user=Depends(is_admin)
):
    # Parse existing image URLs
    image_urls = [url for url in existing_images.split(",") if url.strip()]

    # Upload new images if any
    if images:
        for image in images:
            try:
                result = cloudinary.uploader.upload(image.file, folder="products")
                image_urls.append(result["secure_url"])
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    # Build updated data
    updated_data = {
        "name": name,
        "price": price,
        "category": category,
        "description": description,
        "shortDescription": shortDescription,
        "sku": sku,
        "stock": stock,
        "weight": weight,
        "dimensions": dimensions,
        "featured": featured,
        "images": image_urls,
    }

    updated = await update_product(product_id, updated_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")

    return updated


# ✅ DELETE /products/{id} 
@router.delete("/delete-product/{product_id}")
async def delete(product_id: str, user=Depends(is_admin)):
    deleted = await delete_product(product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}



# ✅ GET /products — View all products (Public)
@router.get("/all", response_model=List[ProductResponse])
async def list_products():
    products = await get_all_products()
    return [product_helper(product) for product in products] 
# ✅ GET /products/{product_id} — View single product by ID (Public)
@router.get("/products/{product_id}", response_model=ProductResponse)
async def view_product(product_id: str):
    product = await get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_helper(product)