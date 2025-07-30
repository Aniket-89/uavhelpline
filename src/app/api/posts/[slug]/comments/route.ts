import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/db/index";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // First find the post by slug to get its ID
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true }
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId: post.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}
