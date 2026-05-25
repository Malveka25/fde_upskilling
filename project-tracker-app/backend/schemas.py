# backend/schemas.py
from pydantic import BaseModel
from typing import List

class CommentBase(BaseModel):
    text: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    project_id: int

    class Config:
        orm_mode = True

class ProjectBase(BaseModel):
    name: str
    status: str

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    comments: List[Comment] = []

    class Config:
        orm_mode = True