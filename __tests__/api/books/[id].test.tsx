import { GET, PATCH, DELETE } from "@/app/api/books/[id]/route"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Book } from "@prisma/client"
import jest from "jest"

// Mock Prisma Client
jest.mock("@/lib/prisma", () => ({
  prisma: {
    book: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe("/api/books/[id]", () => {
  const mockBook: Book = {
    id: 1,
    title: "Test Book",
    author: "Test Author",
    completed: false,
    createdAt: new Date("2024-01-01"),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET", () => {
    it("returns book successfully", async () => {
      mockPrisma.book.findUnique.mockResolvedValue(mockBook)

      const request = new NextRequest("http://localhost:3000/api/books/1")
      const response = await GET(request, { params: { id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockBook)
      expect(mockPrisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })

    it("returns 404 if book not found", async () => {
      mockPrisma.book.findUnique.mockResolvedValue(null)

      const request = new NextRequest("http://localhost:3000/api/books/999")
      const response = await GET(request, { params: { id: "999" } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: "Book not found" })
    })
  })

  describe("PATCH", () => {
    it("toggles book completion successfully", async () => {
      const updatedBook = { ...mockBook, completed: true }
      mockPrisma.book.findUnique.mockResolvedValue(mockBook)
      mockPrisma.book.update.mockResolvedValue(updatedBook)

      const request = new NextRequest("http://localhost:3000/api/books/1", {
        method: "PATCH",
      })
      const response = await PATCH(request, { params: { id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(updatedBook)
      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { completed: true },
      })
    })
  })

  describe("DELETE", () => {
    it("deletes book successfully", async () => {
      mockPrisma.book.delete.mockResolvedValue(mockBook)

      const request = new NextRequest("http://localhost:3000/api/books/1", {
        method: "DELETE",
      })
      const response = await DELETE(request, { params: { id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ success: true })
      expect(mockPrisma.book.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })
  })
})
