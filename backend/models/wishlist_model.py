from bson import ObjectId
from core.database import db
from models.product_model import product_helper
async def wishlist_item_helper(item):
    product = await db.products.find_one({"_id": item["product_id"]})
    return product_helper(product) if product else None

def product_helper(product):
    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "price": product["price"],
        "description": product.get("description", ""),
        "shortDescription": product.get("shortDescription", ""),
        "sku": product.get("sku", ""),
        "stock": product.get("stock", 0),
        "weight": product.get("weight", ""),
        "dimensions": product.get("dimensions", ""),
        "featured": product.get("featured", False),
        "images": product.get("images", []),
        "created_at": product.get("created_at")
    }

