import { type NextRequest, NextResponse } from "next/server";
import { toggleBookCompletion, deleteBook, getBookById } from "@/lib/db";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().transform((val) => {
    const num = Number.parseInt(val, 10);
    if (isNaN(num)) throw new Error("Invalid ID");
    return num;
  }),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = paramsSchema.parse(params);
    const book = await getBookById(id);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (error) {
    console.error("Failed to fetch book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;

    const { id } = paramsSchema.parse(resolvedParams);
    const book = await toggleBookCompletion(id);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (error) {
    console.error("Failed to update book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = paramsSchema.parse(resolvedParams);
    // Make sure deleteBook returns something you can check!
    const deleted = await deleteBook(id);
    // If deleteBook returns void, this check will not work.
    // You need to update deleteBook to return a value.
    if (!deleted) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
