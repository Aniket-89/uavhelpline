export const runtime = 'nodejs'; // ensure NOT Edge Runtime
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
  const body = await req.json();
  const { title, slug, status, content, author, thumbnail, categoryIds = [] } = body;

  // TipTap parsing
  const { generateJSON } = await import("@tiptap/html");
  const StarterKit = (await import("@tiptap/starter-kit")).default;
  const tiptapJSON = typeof content === "string" ? generateJSON(content, [StarterKit]) : content;

  // Ensure array of strings and dedupe
  const ids = Array.isArray(categoryIds)
    ? [...new Set(categoryIds.map(String).filter(Boolean))]
    : [];

  // (Optional but recommended) verify they exist to avoid silent no-ops
  const existing = await prisma.category.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  const existingIds = new Set(existing.map(c => c.id));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postData: any = {
    title,
    slug,
    status,
    content: tiptapJSON,
    author,
    thumbnail,
    // ✅ Explicit M2M: create PostCategory rows & connect the Category
    categories: {
      create: ids
        .filter(id => existingIds.has(id))
        .map(id => ({ category: { connect: { id } } })),
    },
    publishedAt: status === "published" ? new Date() : null,
    draftedAt: status === "draft" ? new Date() : null,
  };

  const newPost = await prisma.post.create({
    data: postData,
    include: {
      // ✅ Include junction + category so you can see what got linked
      categories: { include: { category: true } },
    },
  });

  // Flatten categories like your GET
  return NextResponse.json({
    ...newPost,
    categories: newPost.categories.map(c => c.category),
  });
}

