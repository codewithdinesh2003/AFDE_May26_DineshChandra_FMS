from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from schemas import FeedbackCreate, FeedbackUpdate, FeedbackResponse
import crud

router = APIRouter()


@router.get("/feedback", response_model=List[FeedbackResponse])
def list_feedback(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return crud.get_all_feedback(db, skip=skip, limit=limit)


@router.get("/feedback/stats")
def get_stats(db: Session = Depends(get_db)):
    total = crud.get_feedback_count(db)
    avg_rating = crud.get_average_rating(db)
    top_program = crud.get_highest_rated_program(db)
    weekly = crud.get_weekly_count(db)
    distribution = crud.get_rating_distribution(db)
    return {
        "total_feedback": total,
        "average_rating": avg_rating,
        "highest_rated_program": top_program,
        "weekly_submissions": weekly,
        "rating_distribution": distribution,
    }


@router.get("/feedback/{feedback_id}", response_model=FeedbackResponse)
def get_feedback(feedback_id: int, db: Session = Depends(get_db)):
    feedback = crud.get_feedback_by_id(db, feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail=f"Feedback with id {feedback_id} not found")
    return feedback


@router.post("/feedback", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    return crud.create_feedback(db, feedback)


@router.put("/feedback/{feedback_id}", response_model=FeedbackResponse)
def update_feedback(feedback_id: int, feedback_data: FeedbackUpdate, db: Session = Depends(get_db)):
    updated = crud.update_feedback(db, feedback_id, feedback_data)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Feedback with id {feedback_id} not found")
    return updated


@router.delete("/feedback/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_feedback(feedback_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_feedback(db, feedback_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Feedback with id {feedback_id} not found")


@router.get("/search", response_model=List[FeedbackResponse])
def search_feedback(
    keyword: Optional[str] = Query(None),
    rating: Optional[int] = Query(None, ge=1, le=5),
    program_name: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return crud.search_feedback(db, keyword=keyword, rating=rating, program_name=program_name)
