from typing import Annotated
from fastapi import APIRouter, Depends, Form, UploadFile

from backend.services.comment_service import CommentService
from backend.utils.dependencies.dependencies import get_comment_service


router = APIRouter(tags=["comments"], prefix="/comments")
