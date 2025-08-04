import { type NextRequest, NextResponse } from "next/server"
import { getBooks, addBook } from "@/lib/db"
import { z } from "zod"

const createBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  author: z.string().min(1, "Author is required").max(255, "Author too long"),
})

export async function GET() {
  try {
    const books = await getBooks()
    return NextResponse.json(books)
  } catch (error) {
    console.error("Failed to fetch books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = createBookSchema.parse(body)

    const book = await addBook(validatedData.title.trim(), validatedData.author.trim())
    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    console.error("Failed to add book:", error)
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 })
  }
}
