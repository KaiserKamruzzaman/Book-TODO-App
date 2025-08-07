import { prisma } from "./prisma";
import type { Book } from "@prisma/client";

export type { Book };

export async function getBooks(): Promise<Book[]> {
  return await prisma.book.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function addBook(title: string, author: string): Promise<Book> {
  return await prisma.book.create({
    data: {
      title,
      author,
    },
  });
}

export async function toggleBookCompletion(id: number): Promise<Book> {
  const book = await prisma.book.findUnique({
    where: { id },
  });

  if (!book) {
    throw new Error("Book not found");
  }

  return await prisma.book.update({
    where: { id },
    data: {
      completed: !book.completed,
    },
  });
}

export async function deleteBook(id: number): Promise<Book | null> {
  try {
    return await prisma.book.delete({
      where: { id },
    });
  } catch (error) {
    // If the book does not exist, Prisma will throw an error
    return null;
  }
}

export async function getBookById(id: number): Promise<Book | null> {
  return await prisma.book.findUnique({
    where: { id },
  });
}

export async function getBookStats(): Promise<{
  total: number;
  completed: number;
  pending: number;
}> {
  const [total, completed] = await Promise.all([
    prisma.book.count(),
    prisma.book.count({
      where: { completed: true },
    }),
  ]);

  return {
    total,
    completed,
    pending: total - completed,
  };
}
