import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdirSync, existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public/uploads/post-content");
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    const uniqueFileName = `${uuidv4()}.${file.name.split(".").pop()}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/post-content/${uniqueFileName}`;

    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading editor image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
