import { PrismaClient, type Prisma } from "@prisma/client"

const prisma = new PrismaClient()

const bookData: Prisma.BookCreateInput[] = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    completed: false,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    completed: true,
  },
  {
    title: "1984",
    author: "George Orwell",
    completed: false,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    completed: true,
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    completed: false,
  },
  {
    title: "Lord of the Flies",
    author: "William Golding",
    completed: true,
  },
]

export async function main() {
  console.log("Start seeding...")

  // Clear existing data
  await prisma.book.deleteMany()

  // Create new books
  for (const book of bookData) {
    const result = await prisma.book.create({
      data: book,
    })
    console.log(`Created book with id: ${result.id}`)
  }

  console.log("Seeding finished.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
