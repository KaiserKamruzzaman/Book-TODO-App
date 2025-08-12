import { render, screen, waitFor } from "@testing-library/react";
import { BookList } from "@/components/book-list";
import type { Book } from "@prisma/client";

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Mock BookItem component
jest.mock("@/components/book-item", () => ({
  BookItem: ({ book }: { book: Book }) => (
    <div data-testid={`book-item-${book.id}`}>
      {book.title} by {book.author}
    </div>
  ),
}));

describe("BookList", () => {
  const mockBooks: Book[] = [
    {
      id: 1,
      title: "Book 1",
      author: "Author 1",
      completed: false,
      createdAt: new Date("2024-01-01T00:00:00Z"),
    },
    {
      id: 2,
      title: "Book 2",
      author: "Author 2",
      completed: true,
      createdAt: new Date("2024-01-02T00:00:00Z"),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading state initially", () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<BookList refreshTrigger={0} />);

    expect(screen.getByText("Loading books...")).toBeInTheDocument();
  });

  it("displays books after loading", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks,
    } as Response);

    render(<BookList refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByTestId("book-list")).toBeInTheDocument();
    });

    expect(screen.getByTestId("book-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("book-item-2")).toBeInTheDocument();
  });

  it("displays empty state when no books", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(<BookList refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "No books in your reading list yet. Add your first book above!"
      )
    ).toBeInTheDocument();
  });

  it("displays correct book counts in badges", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks,
    } as Response);

    render(<BookList refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByText("1 to read")).toBeInTheDocument();
      expect(screen.getByText("1 completed")).toBeInTheDocument();
    });
  });

  it("refetches books when refreshTrigger changes", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockBooks,
    } as Response);

    const { rerender } = render(<BookList refreshTrigger={0} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    rerender(<BookList refreshTrigger={1} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
