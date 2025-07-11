from bson import ObjectId
from core.database import db
from models.cart_model import cart_item_helper
from fastapi import HTTPException

# In cart_controller.py
async def get_user_cart(user_id: str):
    pipeline = [
        {
            "$match": {"user_id": ObjectId(user_id)}
        },
        {
            "$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }
        },
        {"$unwind": "$product"},
        {
            "$project": {
                "_id": 1,
                "product_id": 1,
                "quantity": 1,
                "product": {
                    "_id": "$product._id",
                    "images": "$product.images",
                    "name": "$product.name",
                    "price": "$product.price",
                    "originalPrice": "$product.originalPrice",
                    "image": "$product.image",
                    "size": "$product.size",
                    "stock": "$product.stock",
                }
            }
        }
    ]

    cart_items = db.cart_items.aggregate(pipeline)
    result = []
    async for item in cart_items:
       item["_id"] = str(item["_id"])
       item["product_id"] = str(item["product_id"])
       item["product"]["_id"] = str(item["product"]["_id"]) 
       result.append(item)
    return result

async def add_to_cart(user_id: str, data: dict):
    product_id = data["product_id"]
    quantity = data["quantity"]

    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if quantity > product["stock"]:
        raise HTTPException(status_code=400, detail="Requested quantity exceeds available stock")

    existing = await db.cart_items.find_one({
        "user_id": ObjectId(user_id),
        "product_id": ObjectId(product_id)
    })

    if existing:
        new_quantity = existing["quantity"] + quantity
        if new_quantity > product["stock"]:
            raise HTTPException(status_code=400, detail="Total quantity exceeds available stock")

        await db.cart_items.update_one(
            {"_id": existing["_id"]},
            {"$set": {"quantity": new_quantity}}
        )
    else:
        await db.cart_items.insert_one({
            "user_id": ObjectId(user_id),
            "product_id": ObjectId(product_id),
            "quantity": quantity
        })

    return {"message": "Item added to cart"}

async def update_cart_item(user_id: str, product_id: str, quantity: int):
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if quantity > product["stock"]:
        raise HTTPException(status_code=400, detail="Requested quantity exceeds available stock")

    result = await db.cart_items.update_one(
        {
            "user_id": ObjectId(user_id),
            "product_id": ObjectId(product_id)
        },
        {"$set": {"quantity": quantity}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")

    return {"message": "Cart updated"}

# Update all operations to use the same collection (e.g., cart_items)
async def remove_from_cart(user_id: str, product_id: str):
    await db.cart_items.delete_one({
        "user_id": ObjectId(user_id),
        "product_id": ObjectId(product_id)
    })
    return {"msg": "Item removed"}