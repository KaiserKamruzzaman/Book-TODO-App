import { GET, POST } from "@/app/api/books/route"
import { NextRequest } from "next/server"
import jest from "jest" // Declare the jest variable

// Mock the Prisma functions
jest.mock("@/lib/prisma", () => ({
  prisma: {
    book: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

import { prisma } from "@/lib/prisma"
import type { Book } from "@prisma/client"

const mockPrisma = prisma as jest.Mocked<typeof prisma>

// Update the test data
const mockBooks: Book[] = [
  {
    id: 1,
    title: "Book 1",
    author: "Author 1",
    completed: false,
    createdAt: new Date("2024-01-01"),
  },
]

describe("/api/books", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET", () => {
    it("returns books successfully", async () => {
      mockPrisma.book.findMany.mockResolvedValue(mockBooks)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockBooks)
      expect(mockPrisma.book.findMany).toHaveBeenCalledTimes(1)
    })

    it("handles database errors", async () => {
      mockPrisma.book.findMany.mockRejectedValue(new Error("Database error"))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: "Failed to fetch books" })
    })
  })

  describe("POST", () => {
    it("creates a book successfully", async () => {
      const mockBook: Book = {
        id: 1,
        title: "New Book",
        author: "New Author",
        completed: false,
        createdAt: new Date("2024-01-01"),
      }
      mockPrisma.book.create.mockResolvedValue(mockBook)

      const request = new NextRequest("http://localhost:3000/api/books", {
        method: "POST",
        body: JSON.stringify({ title: "New Book", author: "New Author" }),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockBook)
      expect(mockPrisma.book.create).toHaveBeenCalledWith({
        data: { title: "New Book", author: "New Author" },
      })
    })

    it("validates required fields", async () => {
      const request = new NextRequest("http://localhost:3000/api/books", {
        method: "POST",
        body: JSON.stringify({ title: "New Book" }), // Missing author
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: "Title and author are required" })
      expect(mockPrisma.book.create).not.toHaveBeenCalled()
    })

    it("handles database errors", async () => {
      mockPrisma.book.create.mockRejectedValue(new Error("Database error"))

      const request = new NextRequest("http://localhost:3000/api/books", {
        method: "POST",
        body: JSON.stringify({ title: "New Book", author: "New Author" }),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: "Failed to add book" })
    })
  })
})
