import { jest } from "@jest/globals";
import "@testing-library/jest-dom";

// Mock fetch for API calls in tests
global.fetch = jest.fn() as jest.MockedFunction<
  (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
>;

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Optional: Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
