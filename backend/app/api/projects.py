from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.core.security import get_current_user

router = APIRouter(prefix="/api/projects", tags=["projects"])


def project_to_response(p: Project) -> ProjectResponse:
    return ProjectResponse(
        id=str(p.id),
        title=p.title,
        title_zh=p.title_zh,
        slug=p.slug,
        description=p.description,
        content=p.content,
        tech_stack=p.tech_stack,
        images=p.images,
        live_url=p.live_url,
        github_url=p.github_url,
        featured=p.featured,
        sort_order=p.sort_order,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )


@router.get("", response_model=list[ProjectResponse])
async def list_projects(
    featured: Optional[bool] = None,
    sort: str = Query("-sort_order", description="Sort field, prefix - for desc"),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    query = Project.find()
    if featured is not None:
        query = query.find(Project.featured == featured)

    # Simple sort: "-field" means descending
    if sort.startswith("-"):
        sort_field = sort[1:]
        query = query.sort(-getattr(Project, sort_field))
    else:
        query = query.sort(getattr(Project, sort))

    projects = await query.skip(skip).limit(limit).to_list()
    return [project_to_response(p) for p in projects]


@router.get("/{slug}", response_model=ProjectResponse)
async def get_project(slug: str):
    project = await Project.find_one(Project.slug == slug)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project_to_response(project)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(body: ProjectCreate, user: User = Depends(get_current_user)):
    existing = await Project.find_one(Project.slug == body.slug)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists")

    project = Project(**body.model_dump())
    await project.insert()
    return project_to_response(project)


@router.put("/{slug}", response_model=ProjectResponse)
async def update_project(slug: str, body: ProjectUpdate, user: User = Depends(get_current_user)):
    project = await Project.find_one(Project.slug == slug)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    update_data = body.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != slug:
        existing = await Project.find_one(Project.slug == update_data["slug"])
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists")

    for field, value in update_data.items():
        setattr(project, field, value)

    from datetime import datetime
    project.updated_at = datetime.utcnow()
    await project.save()
    return project_to_response(project)


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(slug: str, user: User = Depends(get_current_user)):
    project = await Project.find_one(Project.slug == slug)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    await project.delete()
