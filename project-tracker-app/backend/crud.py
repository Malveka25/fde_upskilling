# backend/crud.py
from sqlalchemy.orm import Session, joinedload
from . import models, schemas

def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_project_by_name(db: Session, name: str):
    return db.query(models.Project).filter(models.Project.name == name).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).options(joinedload(models.Project.comments)).order_by(models.Project.id).offset(skip).limit(limit).all()

def create_project(db: Session, project: schemas.ProjectCreate):
    # Check if a project with the same name already exists.
    db_project = get_project_by_name(db, name=project.name)
    if db_project:
        # If it exists, update its status and return it.
        db_project.status = project.status
        db.commit()
        db.refresh(db_project)
        return db_project
    
    # If it doesn't exist, create a new one.
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def create_project_comment(db: Session, comment: schemas.CommentCreate, project_id: int):
    db_comment = models.Comment(**comment.dict(), project_id=project_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def update_project(db: Session, project_id: int, project: schemas.ProjectCreate):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if db_project:
        db_project.name = project.name
        db_project.status = project.status
        db.commit()
        db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
    return db_project
