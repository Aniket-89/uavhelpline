import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    // Validation: No file
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 415 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "post-thumbnails",
      fileName
    );

    // Save file to disk
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/post-thumbnails/${fileName}`;
    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (err: any) {
    console.error("Upload error:", err);

    // Known errors
    if (err.code === "ENOENT") {
      return NextResponse.json(
        { error: "Directory not found" },
        { status: 500 }
      );
    }

    // Fallback error
    return NextResponse.json(
      { error: "Something went wrong while uploading the file" },
      { status: 500 }
    );
  }
}
