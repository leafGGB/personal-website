from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from datetime import datetime
from app.models.journal import JournalPost
from app.models.user import User
from app.schemas.journal import JournalPostCreate, JournalPostResponse, JournalPostUpdate
from app.core.security import get_current_user

router = APIRouter(prefix="/api/journal", tags=["journal"])


def post_to_response(p: JournalPost) -> JournalPostResponse:
    return JournalPostResponse(
        id=str(p.id),
        title=p.title,
        title_zh=p.title_zh,
        slug=p.slug,
        description=p.description,
        description_zh=p.description_zh,
        content=p.content,
        content_zh=p.content_zh,
        tags=p.tags,
        images=p.images,
        featured=p.featured,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )


@router.get("", response_model=list[JournalPostResponse])
async def list_journal(
    featured: Optional[bool] = None,
    sort: str = Query("-created_at"),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    query = JournalPost.find({})
    if featured is not None:
        query = query.find(JournalPost.featured == featured)
    if sort.startswith("-"):
        query = query.sort(-getattr(JournalPost, sort[1:]))
    else:
        query = query.sort(getattr(JournalPost, sort))
    posts = await query.skip(skip).limit(limit).to_list()
    return [post_to_response(p) for p in posts]


@router.get("/{slug}", response_model=JournalPostResponse)
async def get_journal_post(slug: str):
    post = await JournalPost.find_one(JournalPost.slug == slug)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal post not found")
    return post_to_response(post)


@router.post("", response_model=JournalPostResponse, status_code=status.HTTP_201_CREATED)
async def create_journal_post(body: JournalPostCreate, user: User = Depends(get_current_user)):
    existing = await JournalPost.find_one(JournalPost.slug == body.slug)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists")
    post = JournalPost(**body.model_dump())
    await post.insert()
    return post_to_response(post)


@router.put("/{slug}", response_model=JournalPostResponse)
async def update_journal_post(slug: str, body: JournalPostUpdate, user: User = Depends(get_current_user)):
    post = await JournalPost.find_one(JournalPost.slug == slug)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal post not found")
    update_data = body.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != slug:
        existing = await JournalPost.find_one(JournalPost.slug == update_data["slug"])
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists")
    for field, value in update_data.items():
        setattr(post, field, value)
    post.updated_at = datetime.utcnow()
    await post.save()
    return post_to_response(post)


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journal_post(slug: str, user: User = Depends(get_current_user)):
    post = await JournalPost.find_one(JournalPost.slug == slug)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal post not found")
    await post.delete()
