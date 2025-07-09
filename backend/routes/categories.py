from fastapi import APIRouter, HTTPException, Depends,UploadFile, File, Form
from core.database import db
from models.category_model import category_helper
from schemas.category_schema import CategoryCreate, CategoryResponse
from typing import List
from bson import ObjectId
from core.deps import is_admin
from core.cloudinary_config import cloudinary

router = APIRouter()

# ✅ Get All Categories
@router.get("/all-categories", response_model=List[CategoryResponse])
async def get_all_categories():
    categories = []
    async for cat in db.categories.find():
        categories.append(category_helper(cat))
    return categories

# ✅ Create Category (Admin only)
@router.post("/add-category", response_model=CategoryResponse)
async def add_category(
    name: str = Form(...),
    slug: str = Form(...),
    image: UploadFile = File(None),
    user=Depends(is_admin)
):
    # Check if slug already exists
    existing = await db.categories.find_one({"slug": slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    image_url = None

    # ✅ Upload to Cloudinary if image provided
    if image:
        try:
            upload_result = cloudinary.uploader.upload(image.file, folder="categories")
            image_url = upload_result["secure_url"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    new_cat = {
        "name": name,
        "slug": slug,
        "image": image_url,
    }

    result = await db.categories.insert_one(new_cat)
    cat = await db.categories.find_one({"_id": result.inserted_id})
    return category_helper(cat)

# ✅ Delete Category (Admin only)
@router.delete("/delete-category/{category_id}")
async def delete_category(category_id: str, user=Depends(is_admin)):
    deleted = await db.categories.delete_one({"_id": ObjectId(category_id)})
    if not deleted.deleted_count:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}
# ✅ Update Category (Admin only)
@router.put("/update-category/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    name: str = Form(...),
    slug: str = Form(...),
    image: UploadFile = File(None),
    image_url_existing: str = Form(None),
    user=Depends(is_admin)
):
    existing = await db.categories.find_one({"_id": ObjectId(category_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Category not found")

    image_url = existing.get("image")

    # ✅ Upload new image if provided
    if image:
        try:
            upload_result = cloudinary.uploader.upload(image.file, folder="categories")
            image_url = upload_result["secure_url"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")
    elif image_url_existing:
        image_url = image_url_existing

    update_data = {
        "name": name,
        "slug": slug,
        "image": image_url,
    }

    await db.categories.update_one(
        {"_id": ObjectId(category_id)},
        {"$set": update_data}
    )

    updated_cat = await db.categories.find_one({"_id": ObjectId(category_id)})
    return category_helper(updated_cat)

# ✅ Get Category by ID
@router.get("/single-category/{category_id}", response_model=CategoryResponse)
async def get_category_by_id(category_id: str):
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")
    
    category = await db.categories.find_one({"_id": ObjectId(category_id)})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return category_helper(category)