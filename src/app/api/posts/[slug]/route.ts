import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db/index";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      categories: {
        include: { category: true },
      },
    },
  });

  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  return NextResponse.json({
    ...post,
    categories: post.categories.map((c) => c.category),
  });
}
