from fastapi import APIRouter, Depends, HTTPException, status
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate, MessageResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/api/messages", tags=["messages"])


def to_response(m: Message) -> MessageResponse:
    return MessageResponse(
        id=str(m.id),
        name=m.name,
        email=m.email,
        message=m.message,
        read=m.read,
        created_at=m.created_at,
    )


# Public — anyone can submit a message
@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(body: MessageCreate):
    msg = Message(**body.model_dump())
    await msg.insert()
    return to_response(msg)


# Admin — list all messages
@router.get("", response_model=list[MessageResponse])
async def list_messages(user: User = Depends(get_current_user)):
    msgs = await Message.find_all().sort(-Message.created_at).to_list()
    return [to_response(m) for m in msgs]


# Admin — get single message
@router.get("/{msg_id}", response_model=MessageResponse)
async def get_message(msg_id: str, user: User = Depends(get_current_user)):
    msg = await Message.get(msg_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return to_response(msg)


# Admin — mark as read
@router.patch("/{msg_id}/read", response_model=MessageResponse)
async def mark_read(msg_id: str, user: User = Depends(get_current_user)):
    msg = await Message.get(msg_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    msg.read = True
    await msg.save()
    return to_response(msg)


# Admin — delete
@router.delete("/{msg_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(msg_id: str, user: User = Depends(get_current_user)):
    msg = await Message.get(msg_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    await msg.delete()
