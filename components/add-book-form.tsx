"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface AddBookFormProps {
  onBookAdded: () => void
}

export function AddBookForm({ onBookAdded }: AddBookFormProps) {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !author.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim(), author: author.trim() }),
      })

      if (response.ok) {
        setTitle("")
        setAuthor("")
        onBookAdded()
      }
    } catch (error) {
      console.error("Failed to add book:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Book
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="title-input"
              required
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              data-testid="author-input"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !title.trim() || !author.trim()}
            className="w-full"
            data-testid="add-book-button"
          >
            {isLoading ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
