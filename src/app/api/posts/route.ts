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

  const response = NextResponse.json(
    posts.map((post) => ({
      ...post,
      categories: post.categories.map((c) => c.category),
    }))
  );

  // Cache for 60 minutes (3600 seconds)
  response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600');

  return response;
}

// POST new post
export async function POST(req: Request) {
  //   const user = await authUser(); // optional
  const body = await req.json();

  const { title, slug, status, content, author, thumbnail, categoryIds = [] } = body;

  const postData: any = {
    title,
    slug,
    status,
    content,
    author,
    thumbnail,
    categories: {
      create: Array.isArray(categoryIds) && categoryIds.length > 0 
        ? categoryIds.map((id: string) => ({
            category: { connect: { id } },
          }))
        : [],
    },
    publishedAt: status === "published" ? new Date() : null,
    draftedAt: status === "draft" ? new Date() : null,
  };

  const newPost = await prisma.post.create({
    data: postData,
  });

  return NextResponse.json(newPost);
}
