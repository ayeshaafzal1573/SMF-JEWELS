from pydantic import BaseModel
from typing import List, Optional

class CategoryInfo(BaseModel):
    id: str
    name: str
    slug: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    price: float
    category: Optional[CategoryInfo]
    description: Optional[str] = ""
    shortDescription: Optional[str] = ""
    sku: Optional[str] = ""
    stock: int
    weight: Optional[str] = ""
    dimensions: Optional[str] = ""
    featured: bool = False
    images: Optional[List[str]] = []

class ProductResponse(BaseModel):
    name: str
    price: float
    category: Optional[CategoryInfo]
    description: Optional[str] = ""
    shortDescription: Optional[str] = ""
    sku: Optional[str] = ""
    stock: int
    weight: Optional[str] = ""
    dimensions: Optional[str] = ""
    featured: bool = False
    images: Optional[List[str]] = []
