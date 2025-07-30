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
    categories: post.categories.map((c) => c.category),
  });
}

// PUT - Update post
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    
    const { title, status, content, author, thumbnail, categoryIds = [] } = body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
      include: { categories: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Generate new slug if title changed
    const newSlug = title 
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      : slug;

    // Delete existing category relationships
    await prisma.postCategory.deleteMany({
      where: { postId: existingPost.id },
    });

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        title,
        slug: newSlug,
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
        publishedAt: status === "published" && existingPost.status === "draft" 
          ? new Date() 
          : existingPost.publishedAt,
        draftedAt: status === "draft" ? new Date() : existingPost.draftedAt,
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    return NextResponse.json({
      ...updatedPost,
      categories: updatedPost.categories.map((c) => c.category),
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
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
