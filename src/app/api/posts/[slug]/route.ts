import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db/index";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: post.categories.map((c: any) => c.category),
  });
}

// PUT /api/posts/[slug]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    // Validate input
    const { UpdatePostSchema } = await import("../../../../../lib/validations/post");
    const parsed = UpdatePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
    }

    const {
      title,
      status,
      content,
      author,
      thumbnail,
      categoryIds = [],
    } = parsed.data;

    // 1) Check exist
    const existing = await prisma.post.findUnique({
      where: { slug },
      include: { categories: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 2) Generate safe slug if title changed
    const generateSlug = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    let newSlug = slug;
    if (title && title !== existing.title) {
      const base = generateSlug(title);
      newSlug = base;

      // Find all existing slugs that start with this base in a single query
      const conflicting = await prisma.post.findMany({
        where: {
          slug: { startsWith: base },
          id: { not: existing.id },
        },
        select: { slug: true },
      });
      const conflictingSlugs = new Set(conflicting.map((p) => p.slug));

      // Pick the first available slug
      if (conflictingSlugs.has(newSlug)) {
        let suffix = 1;
        while (conflictingSlugs.has(`${base}-${suffix}`)) suffix++;
        newSlug = `${base}-${suffix}`;
      }
    }

    // 3) Build data only with provided fields (no accidental undefineds)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};
    if (typeof title === "string") data.title = title;
    if (typeof status === "string") data.status = status as typeof existing.status;
    if (typeof author === "string") data.author = author;
    if (content !== undefined) data.content = content;
    if (thumbnail !== undefined) data.thumbnail = thumbnail; // allow "" to clear
    if (newSlug !== slug) data.slug = newSlug;

    // 4) Timestamps logic
    if (data.status) {
      if (data.status === "published" && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
      if (data.status === "draft") {
        data.draftedAt = new Date();
      }
    }

    // 5) Reset and recreate category relations (simple approach)
    await prisma.postCategory.deleteMany({ where: { postId: existing.id } });
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      data.categories = {
        create: categoryIds.map((id: string) => ({
          category: { connect: { id } },
        })),
      };
    } else {
      data.categories = { create: [] };
    }

    const updated = await prisma.post.update({
      where: { slug },
      data,
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    return NextResponse.json({
      ...updated,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories: updated.categories.map((c: any) => c.category),
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}


// DELETE - Delete post
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete the post (categories and comments will be deleted due to cascade)
    await prisma.post.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
