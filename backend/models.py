from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func, JSON # import JSON here so it can be used both for MySQL and SQLite
# from sqlalchemy.dialects.mysql import JSON

class Base(DeclarativeBase):
    pass

class Car(Base):
    __tablename__ = "Cars"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    model: Mapped[str] = mapped_column(String(200))
    year: Mapped[int] = mapped_column(Integer)
    price: Mapped[float] = mapped_column(Integer)
    trim: Mapped[str] = mapped_column(String(100))
    mileage: Mapped[int] = mapped_column(Integer)
    range_miles: Mapped[int] = mapped_column(Integer)
    gas_mileage: Mapped[float] = mapped_column(Integer)
    drivetrain: Mapped[str] = mapped_column(String(50))
    horsepower: Mapped[int] = mapped_column(Integer)
    color: Mapped[str] = mapped_column(String(50))
    interior_color: Mapped[str] = mapped_column(String(50))
    interior_material: Mapped[str] = mapped_column(String(50))
    dealership_id: Mapped[int] = mapped_column(Integer)

class Dealership(Base):
    __tablename__ = "Dealerships"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    address: Mapped[str] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(100))
    state: Mapped[str] = mapped_column(String(50))