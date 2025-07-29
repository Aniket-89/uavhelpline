import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function POST(req: Request) {
  const { postId, content, authorName, authorEmail, parentId } =
    await req.json();

  const comment = await prisma.comment.create({
    data: {
      postId,
      content,
      authorName,
      authorEmail,
      parentId,
    },
  });

  return NextResponse.json(comment);
}
