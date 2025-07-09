from core.database import db
from bson import ObjectId
from models.product_model import product_helper
from datetime import datetime

# ✅ Create Product
async def create_product(data):
    data["created_at"] = datetime.utcnow()
    result = await db.products.insert_one(data)
    new_product = await db.products.find_one({"_id": result.inserted_id})
    return await product_helper(new_product)

# ✅ Update Product
async def update_product(product_id: str, data: dict):
    if not ObjectId.is_valid(product_id):
        return None

    data["updated_at"] = datetime.utcnow()
    updated = await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": data}
    )
    if updated.modified_count == 0:
        return None
    updated_product = await db.products.find_one({"_id": ObjectId(product_id)})
    return updated_product

# ✅ Delete Product
async def delete_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        return False
    deleted = await db.products.delete_one({"_id": ObjectId(product_id)})
    return deleted.deleted_count > 0

# ✅ Get All Products
async def get_all_products():
    return await db.products.find().to_list(length=100)

# ✅ Get Product by ID
async def get_product_by_id(product_id: str):
    if not ObjectId.is_valid(product_id):
        return None
    return await db.products.find_one({"_id": ObjectId(product_id)})
