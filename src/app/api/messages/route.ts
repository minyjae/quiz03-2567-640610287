import { DB, readDB,Message, User,writeDB} from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();
  const seeRoom = request.nextUrl.searchParams.get('roomId');
  if(seeRoom === null) {
    return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
  );}
  const filterd_room = (<Message>DB).messages;
  const findRoom = filterd_room.filter((x: { roomId: string; }) => x.roomId === seeRoom);
  return NextResponse.json(
    {
      ok: true,
      message: findRoom
    }
  );
}

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const {roomId , messageText} = body;
  const foundMessageRoom = (<Message>DB).messages.find((x: { roomId: any; }) => x.roomId === roomId)
  if(!foundMessageRoom){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  const messageId = nanoid();

  (<Message>DB).messages.push({
    roomId : roomId,
    messageId: messageId,
    messageText: messageText,
  })
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  if(!payload){
    return NextResponse.json(
    {
      ok: false,
      message: "Invalid token",
    },
    { status: 401 }
  );
  }

  const body = await request.json();
  const { messageId } = body;
  const foundMessageId = (<Message>DB).messages.find((x: { messageId: string; }) => x.messageId === messageId)
  if(!foundMessageId){
    return NextResponse.json(
    {
      ok: false,
      message: "Message is not found",
    },
    { status: 404 }
  );
  }
  readDB();
  const { role } = <User>payload;
  if(role === "SUPER_ADMIN"){
    (<Message>DB).messages.splice(messageId,1);
  }else{
    return NextResponse.json({
      ok: false,
      message: "You are not SUPER_ADMIN role",
    },{
      status: 400
    });
  }
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
