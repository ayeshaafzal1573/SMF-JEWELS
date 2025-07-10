def product_helper(product) -> dict:
    product_id = product.get("_id")
    if not product_id:
        raise ValueError("Missing '_id' in product")

    category_data = product.get("category")

    if isinstance(category_data, dict):
        category = {
            "id": str(category_data.get("_id", "")),
            "name": category_data.get("name", "Uncategorized"),
            "slug": category_data.get("slug")
        }
    elif isinstance(category_data, str):
        category = {
            "id": category_data,
            "name": "Uncategorized",
            "slug": None
        }
    elif hasattr(category_data, "dict"):
        category = {
            "id": str(category_data.id),
            "name": category_data.name,
            "slug": category_data.slug
        }
    else:
        category = {
            "id": "",
            "name": "Uncategorized",
            "slug": None
        }

    return {
        "id": str(product_id),  # ✅ Safe now
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
