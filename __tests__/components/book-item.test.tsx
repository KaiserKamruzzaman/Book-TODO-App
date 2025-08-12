import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BookItem } from "@/components/book-item";
import type { Book } from "@prisma/client";

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("BookItem", () => {
  const mockOnBookUpdated = jest.fn();

  const mockBook: Book = {
    id: 1,
    title: "Test Book",
    author: "Test Author",
    completed: false,
    createdAt: new Date("2024-01-01T00:00:00Z"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders book information correctly", () => {
    render(<BookItem book={mockBook} onBookUpdated={mockOnBookUpdated} />);

    expect(screen.getByTestId("book-title-1")).toHaveTextContent("Test Book");
    expect(screen.getByText("by Test Author")).toBeInTheDocument();
    expect(screen.getByTestId("book-checkbox-1")).not.toBeChecked();
  });

  it("renders completed book with correct styling", () => {
    const completedBook = { ...mockBook, completed: true };
    render(<BookItem book={completedBook} onBookUpdated={mockOnBookUpdated} />);

    const title = screen.getByTestId("book-title-1");
    expect(title).toHaveClass("line-through");
    expect(screen.getByTestId("book-checkbox-1")).toBeChecked();
  });

  it("toggles book completion when checkbox is clicked", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockBook, completed: true }),
    } as Response);

    render(<BookItem book={mockBook} onBookUpdated={mockOnBookUpdated} />);

    const checkbox = screen.getByTestId("book-checkbox-1");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/books/1", {
        method: "PATCH",
      });
    });

    expect(mockOnBookUpdated).toHaveBeenCalled();
  });

  it("deletes book when delete button is clicked", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<BookItem book={mockBook} onBookUpdated={mockOnBookUpdated} />);

    const deleteButton = screen.getByTestId("delete-book-1");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/books/1", {
        method: "DELETE",
      });
    });

    expect(mockOnBookUpdated).toHaveBeenCalled();
  });

  it("has proper accessibility attributes", () => {
    render(<BookItem book={mockBook} onBookUpdated={mockOnBookUpdated} />);

    const deleteButton = screen.getByTestId("delete-book-1");
    expect(deleteButton).toHaveAttribute("aria-label", "Delete Test Book");
  });
});
