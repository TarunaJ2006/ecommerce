from fastapi import APIRouter, Depends, HTTPException, status, Query
from .. import models
from ..database import get_db
from sqlalchemy.orm import Session
from .. import schemas, oauth2



router = APIRouter(
    prefix="/products",
    tags=["products"]
)

@router.get("/", response_model=list[schemas.ProductResponse])
async def read_products(search: str = Query(None, description="Search products by title"), db: Session = Depends(get_db)):
    query = db.query(models.Product)
    
    if search:
        query = query.filter(models.Product.title.ilike(f"%{search}%"))
    
    return query.all()

@router.post("/", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product: schemas.ProductBase, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    db_product = models.Product(seller_id=current_user.id, **product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/{product_id}", response_model=schemas.ProductResponse)
async def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return product

@router.put("/{product_id}", response_model=schemas.ProductResponse)
async def update_product(product_id: int, product_update: schemas.ProductUpdate, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    product_query = db.query(models.Product).filter(models.Product.id == product_id)
    product = product_query.first()
    
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    if product.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform requested action")
    
    update_data = product_update.dict(exclude_unset=True)
    product_query.update(update_data, synchronize_session=False)
    
    db.commit()
    return product_query.first()

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    product_query = db.query(models.Product).filter(models.Product.id == product_id)
    product = product_query.first()
    
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    if product.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform requested action")
    
    product_query.delete(synchronize_session=False)
    db.commit()
    return {"message": "Product deleted successfully"}

