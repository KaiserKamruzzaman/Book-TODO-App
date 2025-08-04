import { getBooks, addBook, toggleBookCompletion, deleteBook, getBookById } from "@/lib/db"
import { prisma } from "@/lib/prisma"
import type { Book } from "@prisma/client"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock Prisma Client
jest.mock("@/lib/prisma", () => ({
  prisma: {
    book: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe("Database functions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getBooks", () => {
    it("should return books ordered by creation date", async () => {
      const mockBooks: Book[] = [
        {
          id: 1,
          title: "Book 1",
          author: "Author 1",
          completed: false,
          createdAt: new Date("2024-01-01"),
        },
        {
          id: 2,
          title: "Book 2",
          author: "Author 2",
          completed: true,
          createdAt: new Date("2024-01-02"),
        },
      ]

      mockPrisma.book.findMany.mockResolvedValue(mockBooks)

      const result = await getBooks()

      expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: "desc",
        },
      })
      expect(result).toEqual(mockBooks)
    })
  })

  describe("addBook", () => {
    it("should create a new book", async () => {
      const mockBook: Book = {
        id: 1,
        title: "New Book",
        author: "New Author",
        completed: false,
        createdAt: new Date(),
      }

      mockPrisma.book.create.mockResolvedValue(mockBook)

      const result = await addBook("New Book", "New Author")

      expect(mockPrisma.book.create).toHaveBeenCalledWith({
        data: {
          title: "New Book",
          author: "New Author",
        },
      })
      expect(result).toEqual(mockBook)
    })
  })

  describe("toggleBookCompletion", () => {
    it("should toggle book completion status", async () => {
      const existingBook: Book = {
        id: 1,
        title: "Test Book",
        author: "Test Author",
        completed: false,
        createdAt: new Date(),
      }

      const updatedBook: Book = {
        ...existingBook,
        completed: true,
      }

      mockPrisma.book.findUnique.mockResolvedValue(existingBook)
      mockPrisma.book.update.mockResolvedValue(updatedBook)

      const result = await toggleBookCompletion(1)

      expect(mockPrisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { completed: true },
      })
      expect(result).toEqual(updatedBook)
    })

    it("should throw error if book not found", async () => {
      mockPrisma.book.findUnique.mockResolvedValue(null)

      await expect(toggleBookCompletion(999)).rejects.toThrow("Book not found")
    })
  })

  describe("deleteBook", () => {
    it("should delete a book", async () => {
      mockPrisma.book.delete.mockResolvedValue({} as Book)

      await deleteBook(1)

      expect(mockPrisma.book.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })
  })

  describe("getBookById", () => {
    it("should return a book by id", async () => {
      const mockBook: Book = {
        id: 1,
        title: "Test Book",
        author: "Test Author",
        completed: false,
        createdAt: new Date(),
      }

      mockPrisma.book.findUnique.mockResolvedValue(mockBook)

      const result = await getBookById(1)

      expect(mockPrisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(result).toEqual(mockBook)
    })

    it("should return null if book not found", async () => {
      mockPrisma.book.findUnique.mockResolvedValue(null)

      const result = await getBookById(999)

      expect(result).toBeNull()
    })
  })
})
