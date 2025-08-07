"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, BookOpen, BookCheck } from "lucide-react";
import type { Book } from "@prisma/client";

interface BookItemProps {
  book: Book;
  onBookUpdated: () => void;
}

export function BookItem({ book, onBookUpdated }: BookItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleCompletion = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: "PATCH",
      });

      if (response.ok) {
        onBookUpdated();
      }
    } catch (error) {
      console.error("Failed to update book:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    console.log(book.id);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onBookUpdated();
      }
    } catch (error) {
      console.error("Failed to delete book:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={`transition-all ${book.completed ? "opacity-75" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Checkbox
              id={`book-${book.id}`}
              checked={book.completed}
              onCheckedChange={handleToggleCompletion}
              disabled={isUpdating}
              data-testid={`book-checkbox-${book.id}`}
            />
            <div className="flex items-center space-x-2">
              {book.completed ? (
                <BookCheck className="w-4 h-4 text-green-600" />
              ) : (
                <BookOpen className="w-4 h-4 text-blue-600" />
              )}
              <div className="flex-1">
                <label
                  htmlFor={`book-${book.id}`}
                  className={`block font-medium cursor-pointer ${
                    book.completed ? "line-through text-muted-foreground" : ""
                  }`}
                  data-testid={`book-title-${book.id}`}
                >
                  {book.title}
                </label>
                <p
                  className={`text-sm ${
                    book.completed
                      ? "line-through text-muted-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  by {book.author}
                </p>
                <p className="text-xs text-muted-foreground">
                  Added {new Date(book.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            data-testid={`delete-book-${book.id}`}
            aria-label={`Delete ${book.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
