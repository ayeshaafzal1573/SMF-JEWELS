from bson import ObjectId

def product_helper(product) -> dict:
    # Handle category data - it might be:
    # 1. An object with _id and name
    # 2. Just the category ID string
    # 3. A CategoryInfo object
    # 4. Missing entirely
    
    category_data = product.get("category")
    
    if isinstance(category_data, dict):
        # Case 1: Category is an object with _id and name
        category = {
            "id": str(category_data.get("_id", "")),
            "name": category_data.get("name", "Uncategorized"),
            "slug": category_data.get("slug")
        }
    elif isinstance(category_data, str):
        # Case 2: Category is just an ID string
        category = {
            "id": category_data,
            "name": "Uncategorized",
            "slug": None
        }
    elif hasattr(category_data, "dict"):  # For Pydantic models
        # Case 3: Category is a CategoryInfo object
        category = {
            "id": str(category_data.id),
            "name": category_data.name,
            "slug": category_data.slug
        }
    else:
        # Case 4: Missing category
        category = {
            "id": "",
            "name": "Uncategorized",
            "slug": None
        }

    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "price": product["price"],
        "category": category,
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