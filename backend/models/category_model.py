from core.database import db
from bson import ObjectId
def category_helper(category) -> dict:
    return {
        "id": str(category["_id"]),
        "name": category["name"],
        "slug": category["slug"],
        "image": category.get("image", None),
    }
async def get_category_by_id(category_id: str):
    category = await db.categories.find_one({"_id": ObjectId(category_id)})
    if category:
        return {
            "id": str(category["_id"]),
            "name": category["name"]
        }
    return None
def category_helper_list(categories) -> list:
    return [category_helper(category) for category in categories]