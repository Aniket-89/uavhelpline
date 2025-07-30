import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const handleApiResponse = <T>(data: T, status = 200) => {
  return NextResponse.json(data, { status });
};

export const handleApiError = (error: unknown) => {
  if (error instanceof ZodError) {
    return NextResponse.json({ errors: error.issues }, { status: 400 });
  }

  console.error(error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
};
