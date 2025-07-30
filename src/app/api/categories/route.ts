import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/index";

export async function GET() {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug } = body;

    // Check if category with same name already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { slug: slug }
        ]
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" }, 
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
      }
    });
    
    return NextResponse.json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
