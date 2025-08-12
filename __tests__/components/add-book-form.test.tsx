import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddBookForm } from "@/components/add-book-form";

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("AddBookForm", () => {
  const mockOnBookAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form elements correctly", () => {
    render(<AddBookForm onBookAdded={mockOnBookAdded} />);

    expect(screen.getByText("Add New Book")).toBeInTheDocument();
    expect(screen.getByTestId("title-input")).toBeInTheDocument();
    expect(screen.getByTestId("author-input")).toBeInTheDocument();
    expect(screen.getByTestId("add-book-button")).toBeInTheDocument();
  });

  it("disables submit button when fields are empty", () => {
    render(<AddBookForm onBookAdded={mockOnBookAdded} />);

    const submitButton = screen.getByTestId("add-book-button");
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when both fields are filled", () => {
    render(<AddBookForm onBookAdded={mockOnBookAdded} />);

    const titleInput = screen.getByTestId("title-input");
    const authorInput = screen.getByTestId("author-input");
    const submitButton = screen.getByTestId("add-book-button");

    fireEvent.change(titleInput, { target: { value: "Test Book" } });
    fireEvent.change(authorInput, { target: { value: "Test Author" } });

    expect(submitButton).not.toBeDisabled();
  });

  it("submits form with correct data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, title: "Test Book", author: "Test Author" }),
    } as Response);

    render(<AddBookForm onBookAdded={mockOnBookAdded} />);

    const titleInput = screen.getByTestId("title-input");
    const authorInput = screen.getByTestId("author-input");
    const submitButton = screen.getByTestId("add-book-button");

    fireEvent.change(titleInput, { target: { value: "Test Book" } });
    fireEvent.change(authorInput, { target: { value: "Test Author" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Test Book", author: "Test Author" }),
      });
    });

    expect(mockOnBookAdded).toHaveBeenCalled();
  });

  it("clears form after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, title: "Test Book", author: "Test Author" }),
    } as Response);

    render(<AddBookForm onBookAdded={mockOnBookAdded} />);

    const titleInput = screen.getByTestId("title-input") as HTMLInputElement;
    const authorInput = screen.getByTestId("author-input") as HTMLInputElement;
    const submitButton = screen.getByTestId("add-book-button");

    fireEvent.change(titleInput, { target: { value: "Test Book" } });
    fireEvent.change(authorInput, { target: { value: "Test Author" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput.value).toBe("");
      expect(authorInput.value).toBe("");
    });
  });
});
