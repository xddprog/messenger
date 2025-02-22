from fastapi import APIRouter

from backend.services.comment_service import CommentService


router = APIRouter(tags=["comments"], prefix="/comments")
