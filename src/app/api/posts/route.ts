import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/index";
// import { authUser } from "@/lib/auth"; // custom middleware if needed

// GET all posts
export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      categories: {
        include: { category: true },
      },
    },
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json(
    posts.map((post) => ({
      ...post,
      categories: post.categories.map((c) => c.category),
    }))
  );
}

// POST new post
export async function POST(req: Request) {
  //   const user = await authUser(); // optional
  const body = await req.json();

  const { title, slug, status, content, author, categoryIds } = body;

  const newPost = await prisma.post.create({
    data: {
      title,
      slug,
      status,
      content,
      author,
      categories: {
        create: categoryIds.map((id: string) => ({
          category: { connect: { id } },
        })),
      },
      publishedAt: status === "published" ? new Date() : null,
      draftedAt: status === "draft" ? new Date() : null,
    },
  });

  return NextResponse.json(newPost);
}
