"use client"

import { useState } from "react"
import { AddBookForm } from "@/components/add-book-form"
import { BookList } from "@/components/book-list"

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleBookAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">📚 Book Todo</h1>
        <p className="text-muted-foreground">Keep track of your reading list and mark books as completed</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <AddBookForm onBookAdded={handleBookAdded} />
        </div>
        <div>
          <BookList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
