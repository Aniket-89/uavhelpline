import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/index";

export async function GET() {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const body = await req.json();

  const { name, slug, posts } = body;

  const newCategory = await prisma.category.create({
    data:{
      name,
      slug,
    }
  })
  return NextResponse.json(newCategory);
}
