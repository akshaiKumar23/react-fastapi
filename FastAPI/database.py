from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


URL_DATABASE = "sqlite:///./finance.db"

engine = create_engine(URL_DATABASE, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# yeh local database session create karta hein to interact with the database

Base = declarative_base()
# yeh mapping create karta hein hamare database aur jab data pass karenge hamare database hein
