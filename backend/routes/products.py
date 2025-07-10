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
from models.category_model import get_category_by_id 
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
    existing_images: Optional[str] = Form(""),
    images: Optional[List[UploadFile]] = File(None),
    user=Depends(is_admin)
):
    # Parse existing image URLs
    image_urls = [url for url in existing_images.split(",") if url.strip()]

    # Upload new images to Cloudinary
    if images:
        for image in images:
            try:
                result = cloudinary.uploader.upload(image.file, folder="products")
                image_urls.append(result["secure_url"])
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    # Update the product
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

    # 🔁 Re-fetch the updated product to include full category object
    updated_product = await get_product_by_id(product_id)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Failed to fetch updated product")

    # 🔍 Replace category ID with full category object
    category_obj = await get_category_by_id(updated_product["category"])
    updated_product["category"] = category_obj

    return updated_product

# ✅ DELETE /products/{id} 
@router.delete("/delete-product/{product_id}")
async def delete(product_id: str, user=Depends(is_admin)):
    deleted = await delete_product(product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}



@router.get("/all")
async def list_products():
    products = await db.products.find().to_list(length=None)

    formatted_products = []

    for product in products:
        if "_id" not in product:
            print("⚠️ Skipped product (missing _id):", product)
            continue

        # Replace category ID with full category object
        category_id = product.get("category")
        if category_id:
            try:
                category = await db.categories.find_one({"_id": ObjectId(category_id)})
                if category:
                    product["category"] = category
            except Exception as e:
                print("⚠️ Failed to fetch category:", e)

        formatted_products.append(product_helper(product))

    return formatted_products

@router.get("/{product_id}", response_model=ProductResponse)
async def view_product(product_id: str):
    product = await get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_helper(product)