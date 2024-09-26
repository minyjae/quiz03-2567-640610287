import { DB, readDB, Room, Message, User, writeDB, Database } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  let rooms = (<Room>DB).rooms;
  const totalRooms = rooms.length;
  return NextResponse.json({
    ok: true,
    rooms: rooms,
    totalRooms: totalRooms
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
    {
      ok: false,
      message: "Invalid token",
    },
    { status: 401 }
  );
  }
  
  const { role } = <User>payload;
  readDB();
  const body = await request.json();
  const { roomName } = body;
  const foundRoomName = (<Room>DB).rooms.find((x: { roomName: any; }) => x.roomName === roomName)
  if(foundRoomName) {
    return NextResponse.json(
    {
      ok: false,
      message: `Room ${"replace this with room name"} already exists`,
    },
    { status: 400 }
  );
  }  
  const roomId = nanoid();
  if(role === "ADMIN" || role === "SUPER_ADMIN") {
    (<Room>DB).rooms.push({
      roomId: roomId,
      roomName: roomName,
    })
  }
  
  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    //roomId,
    message: `Room ${"replace this with room name"} has been created`,
  });
};
