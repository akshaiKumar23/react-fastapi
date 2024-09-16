from typing import Annotated, List
import models
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str
# yeh pydantic ka BaseModel class extend karta hein aur apne model ko pytantic ko use karke validate karta hein


class TransactionModel(TransactionBase):
    id: int

    class Config:
        orm_mode = True

# yeh hamare validated model TransactionnModel ko extend karta hein aur usmein id add karta hein and orm true kar deta hein taki ORM ke saath work kar paye


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
# yeh additional dependencies attach karne mein use aata hein
# Session object use to interact with the database , to perform query , add etc
# Depends is a utility jo ki dependency define karta hein, yeh dependencies database connections jaise functionality ko inject karne mein help aata hein into route functions
# database injection to the correponding endpoints
models.Base.metadata.create_all(bind=engine)
# yeh saare tables create kar dega jo ki models mein defined hein in the database


@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db: db_dependency):
    db_transaction = models.Transaction(**transaction.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    return db_transaction


@app.get("/transactions/", response_model=List[TransactionModel])
async def read_transactions(db: db_dependency, skip: int = 0, limit: int = 100):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions


@app.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: int, db: db_dependency):
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return {"detail": "Transaction deleted"}


@app.put("/transactions/{transaction_id}")
async def update_transaction(transaction_id: int, new_transaction: TransactionBase, db: db_dependency):

    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id).first()

    if not transaction:
        raise HTTPException(
            status_code=404, detail="Could not find transaction")

    transaction.amount = new_transaction.amount
    transaction.category = new_transaction.category
    transaction.description = new_transaction.description
    transaction.is_income = new_transaction.is_income
    transaction.date = new_transaction.date
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction
