from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


class FeedbackCreate(BaseModel):
    participant_name: str = Field(..., min_length=2, max_length=255)
    program_name: str = Field(..., min_length=2, max_length=255)
    rating: int = Field(..., ge=1, le=5)
    comments: Optional[str] = Field(None, max_length=500)

    @validator("rating")
    def rating_must_be_valid(cls, v):
        if v < 1 or v > 5:
            raise ValueError("Rating must be between 1 and 5")
        return v


class FeedbackUpdate(BaseModel):
    participant_name: Optional[str] = Field(None, min_length=2, max_length=255)
    program_name: Optional[str] = Field(None, min_length=2, max_length=255)
    rating: Optional[int] = Field(None, ge=1, le=5)
    comments: Optional[str] = Field(None, max_length=500)

    @validator("rating")
    def rating_must_be_valid(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError("Rating must be between 1 and 5")
        return v


class FeedbackResponse(BaseModel):
    feedback_id: int
    participant_name: str
    program_name: str
    rating: int
    comments: Optional[str]
    submitted_at: datetime

    class Config:
        from_attributes = True


class SearchParams(BaseModel):
    keyword: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    program_name: Optional[str] = None
