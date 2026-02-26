export const runtime = 'nodejs'; // ensure NOT Edge Runtime
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/index";

// GET posts with optional filtering and pagination
// Query params: ?status=published&category=blogs&page=1&limit=12
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const categorySlug = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "0", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "0", 10), 100);

  // Build where clause based on query params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (status === "published" || status === "draft") {
    where.status = status;
  }
  if (categorySlug) {
    where.categories = {
      some: { category: { slug: categorySlug } },
    };
  }

  // If page and limit are provided, use server-side pagination
  const usePagination = page > 0 && limit > 0;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        categories: {
          include: { category: true },
        },
      },
      orderBy: { publishedAt: "desc" },
      ...(usePagination && {
        skip: (page - 1) * limit,
        take: limit,
      }),
    }),
    usePagination ? prisma.post.count({ where }) : Promise.resolve(0),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flattenedPosts = posts.map((post: any) => ({
    ...post,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: post.categories.map((c: any) => c.category),
  }));

  // Return paginated response when pagination params are present
  const body = usePagination
    ? { posts: flattenedPosts, total, page, limit, totalPages: Math.ceil(total / limit) }
    : flattenedPosts;

  const response = NextResponse.json(body);

  // Cache for 60 minutes (3600 seconds)
  response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600');

  return response;
}

// POST new post
export async function POST(req: Request) {
  const body = await req.json();

  // Validate input
  const { CreatePostSchema } = await import("../../../../lib/validations/post");
  const parsed = CreatePostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
  }

  const { title, slug, status, content, author, thumbnail, categoryIds = [] } = parsed.data;

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
  const existingIds = new Set(existing.map((c: { id: string }) => c.id));

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
        .filter((id: string) => existingIds.has(id))
        .map((id: string) => ({ category: { connect: { id } } })),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: newPost.categories.map((c: any) => c.category),
  });
}

