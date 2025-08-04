"use client"

import { useEffect, useState } from "react"
import { BookItem } from "./book-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, BookCheck } from "lucide-react"
import type { Book } from "@prisma/client"

interface BookListProps {
  refreshTrigger: number
}

export function BookList({ refreshTrigger }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books")
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      }
    } catch (error) {
      console.error("Failed to fetch books:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [refreshTrigger])

  const completedBooks = books.filter((book) => book.completed)
  const pendingBooks = books.filter((book) => !book.completed)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading books...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>My Reading List</span>
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {pendingBooks.length} to read
            </Badge>
            <Badge variant="default" className="flex items-center gap-1">
              <BookCheck className="w-3 h-3" />
              {completedBooks.length} completed
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {books.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground" data-testid="empty-state">
            No books in your reading list yet. Add your first book above!
          </div>
        ) : (
          <div className="space-y-3" data-testid="book-list">
            {books.map((book) => (
              <BookItem key={book.id} book={book} onBookUpdated={fetchBooks} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
