from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Base schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None

class ProductBase(BaseModel):           
    title: str                          
    description: Optional[str] = None   
    price: float                        
    is_published: Optional[bool] = True 

class ProductCreate(ProductBase):
    seller_id: int

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    is_published: Optional[bool] = None

# Response schemas (without relationships to avoid circular imports)
class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool
    
    class Config:
        from_attributes = True

class ProductResponse(ProductBase):
    id: int
    seller_id: int
    
    class Config:
        from_attributes = True

# Extended response schemas with relationships
class UserWithProducts(UserResponse):
    products: List[ProductResponse] = []

class ProductWithSeller(ProductResponse):
    seller: Optional[UserResponse] = None

# Auth schemas
class TokenData(BaseModel):
    id: Optional[int] = None

class Token(BaseModel):
    access_token: str
    token_type: str

# Cart schemas
class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: Optional[int] = None

class CartItemResponse(CartItemBase):
    id: int
    cart_id: int
    added_at: datetime
    product: ProductResponse
    
    class Config:
        from_attributes = True

class CartBase(BaseModel):
    pass

class CartResponse(CartBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    cart_items: List[CartItemResponse] = []
    
    class Config:
        from_attributes = True