import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Jiradate Oratai",
    studentId: "640610287",
  });
};
