from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
 
from . import crud, models, schemas
from .database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

# Create the database tables
models.Base.metadata.create_all(bind=engine)

# --- Application Instance ---
app = FastAPI(
    title="Project Tracker API",
    description="An API to track projects for the FDE Upskilling Program.",
    version="1.0.0"
)

# Disable automatic trailing slash redirects. This can prevent the 302 redirects
# that cause CORS errors in some proxied environments like GitHub Codespaces.
app.router.redirect_slashes = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

# --- Database Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the Project Tracker API!"}

@app.get("/projects", response_model=List[schemas.Project])
def get_all_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve all projects."""
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@app.post("/projects", response_model=schemas.Project, status_code=status.HTTP_201_CREATED)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    """Create a new project."""
    return crud.create_project(db=db, project=project)

@app.get("/projects/{project_id}", response_model=schemas.Project)
def get_project_by_id(project_id: int, db: Session = Depends(get_db)):
    """Retrieve a single project by its ID."""
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.post("/projects/{project_id}/comments/", response_model=schemas.Comment)
def create_comment_for_project(
    project_id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db)
):
    """Create a comment for a specific project."""
    # crud.get_project is used to ensure the project exists before commenting
    return crud.create_project_comment(db=db, comment=comment, project_id=project_id)

@app.put("/projects/{project_id}", response_model=schemas.Project)
def update_project_endpoint(project_id: int, project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    """Update an existing project."""
    db_project = crud.update_project(db, project_id=project_id, project=project)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_endpoint(project_id: int, db: Session = Depends(get_db)):
    """Delete a project."""
    crud.delete_project(db, project_id=project_id)
    return
