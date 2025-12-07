"""
Data models for the contest management system
Using SQLModel for type hints + ORM
"""

from typing import Optional
from sqlmodel import SQLModel, Field

class ContestBase(SQLModel):
    """Base contest model with common fields"""
    class_level: int = Field(ge=9, le=12, description="Class level (9-12)")
    year: int = Field(ge=2000, le=2100, description="Contest year")
    pre_number: int = Field(ge=1, le=5, description="Pre number (1-5)")
    contest_url: str = Field(description="URL to the contest")
    solution_url: str = Field(description="URL to the solutions")

class Contest(ContestBase, table=True):
    """Contest model for database table"""
    __tablename__ = "contests"
    
    id: Optional[int] = Field(default=None, primary_key=True)

class ContestCreate(ContestBase):
    """Model for creating a new contest"""
    pass

class ContestUpdate(ContestBase):
    """Model for updating a contest"""
    pass

class ContestRead(ContestBase):
    """Model for reading contest data (API response)"""
    id: int
