import { type NextRequest, NextResponse } from "next/server"
import { toggleBookCompletion, deleteBook, getBookById } from "@/lib/db"
import { z } from "zod"

const paramsSchema = z.object({
  id: z.string().transform((val) => {
    const num = Number.parseInt(val, 10)
    if (isNaN(num)) throw new Error("Invalid ID")
    return num
  }),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = paramsSchema.parse(params)

    const book = await getBookById(id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Failed to fetch book:", error)
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = paramsSchema.parse(params)

    const book = await toggleBookCompletion(id)
    return NextResponse.json(book)
  } catch (error) {
    if (error instanceof Error && error.message === "Book not found") {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    console.error("Failed to update book:", error)
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = paramsSchema.parse(params)

    await deleteBook(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete book:", error)
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
  }
}
