from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from models import Feedback
from schemas import FeedbackCreate, FeedbackUpdate
from datetime import datetime, timedelta


def create_feedback(db: Session, feedback: FeedbackCreate) -> Feedback:
    db_feedback = Feedback(
        participant_name=feedback.participant_name,
        program_name=feedback.program_name,
        rating=feedback.rating,
        comments=feedback.comments,
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


def get_all_feedback(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Feedback).order_by(Feedback.submitted_at.desc()).offset(skip).limit(limit).all()


def get_feedback_count(db: Session) -> int:
    return db.query(func.count(Feedback.feedback_id)).scalar()


def get_feedback_by_id(db: Session, feedback_id: int):
    return db.query(Feedback).filter(Feedback.feedback_id == feedback_id).first()


def update_feedback(db: Session, feedback_id: int, feedback_data: FeedbackUpdate):
    db_feedback = get_feedback_by_id(db, feedback_id)
    if not db_feedback:
        return None
    update_data = feedback_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_feedback, key, value)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


def delete_feedback(db: Session, feedback_id: int) -> bool:
    db_feedback = get_feedback_by_id(db, feedback_id)
    if not db_feedback:
        return False
    db.delete(db_feedback)
    db.commit()
    return True


def search_feedback(db: Session, keyword: str = None, rating: int = None, program_name: str = None):
    query = db.query(Feedback)

    if keyword:
        like_pattern = f"%{keyword}%"
        query = query.filter(
            or_(
                Feedback.participant_name.ilike(like_pattern),
                Feedback.program_name.ilike(like_pattern),
                Feedback.comments.ilike(like_pattern),
            )
        )

    if rating is not None:
        query = query.filter(Feedback.rating == rating)

    if program_name:
        query = query.filter(Feedback.program_name.ilike(f"%{program_name}%"))

    return query.order_by(Feedback.submitted_at.desc()).all()


def get_average_rating(db: Session):
    result = db.query(func.avg(Feedback.rating)).scalar()
    return round(float(result), 1) if result else 0.0


def get_highest_rated_program(db: Session):
    result = (
        db.query(Feedback.program_name, func.avg(Feedback.rating).label("avg_rating"))
        .group_by(Feedback.program_name)
        .order_by(func.avg(Feedback.rating).desc())
        .first()
    )
    return result[0] if result else "N/A"


def get_weekly_count(db: Session) -> int:
    week_ago = datetime.utcnow() - timedelta(days=7)
    return db.query(func.count(Feedback.feedback_id)).filter(Feedback.submitted_at >= week_ago).scalar()


def get_rating_distribution(db: Session):
    total = get_feedback_count(db)
    distribution = []
    for star in range(1, 6):
        count = db.query(func.count(Feedback.feedback_id)).filter(Feedback.rating == star).scalar()
        distribution.append({
            "rating": star,
            "count": count,
            "percentage": round((count / total * 100), 1) if total > 0 else 0,
        })
    return distribution
