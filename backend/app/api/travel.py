from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from datetime import datetime
from app.models.travel import TravelPost
from app.models.user import User
from app.schemas.travel import TravelPostCreate, TravelPostResponse, TravelPostUpdate
from app.core.security import get_current_user

router = APIRouter(prefix="/api/travel", tags=["travel"])


def post_to_response(p: TravelPost) -> TravelPostResponse:
    return TravelPostResponse(
        id=str(p.id),
        title=p.title,
        title_zh=p.title_zh,
        slug=p.slug,
        location_name=p.location_name,
        location_name_zh=p.location_name_zh,
        latitude=p.latitude,
        longitude=p.longitude,
        date_visited=p.date_visited,
        description=p.description,
        description_zh=p.description_zh,
        content=p.content,
        content_zh=p.content_zh,
        images=p.images,
        tags=p.tags,
        featured=p.featured,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )


@router.get("", response_model=list[TravelPostResponse])
async def list_travel(
    featured: Optional[bool] = None,
    sort: str = Query("-created_at"),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    query = TravelPost.find({})
    if featured is not None:
        query = query.find(TravelPost.featured == featured)

    if sort.startswith("-"):
        query = query.sort(-getattr(TravelPost, sort[1:]))
    else:
        query = query.sort(getattr(TravelPost, sort))

    posts = await query.skip(skip).limit(limit).to_list()
    return [post_to_response(p) for p in posts]


@router.get("/{slug}", response_model=TravelPostResponse)
async def get_travel_post(slug: str):
    post = await TravelPost.find_one(TravelPost.slug == slug)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Travel post not found")
    return post_to_response(post)


@router.post("", response_model=TravelPostResponse, status_code=status.HTTP_201_CREATED)
async def create_travel_post(body: TravelPostCreate, user: User = Depends(get_current_user)):
    existing = await TravelPost.find_one(TravelPost.slug == body.slug)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists")
    post = TravelPost(**body.model_dump())
    await post.insert()
    return post_to_response(post)


@router.put("/{slug}", response_model=TravelPostResponse)
async def update_travel_post(slug: str, body: TravelPostUpdate, user: User = Depends(get_current_user)):
    post = await TravelPost.find_one(TravelPost.slug == slug)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Travel post not found")

    update_data = body.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != slug:
        existing = await TravelPost.find_one(TravelPost.slug == update_data["slug"])
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists")

    for field, value in update_data.items():
        setattr(post, field, value)

    post.updated_at = datetime.utcnow()
    await post.save()
    return post_to_response(post)


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_travel_post(slug: str, user: User = Depends(get_current_user)):
    post = await TravelPost.find_one(TravelPost.slug == slug)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Travel post not found")
    await post.delete()
