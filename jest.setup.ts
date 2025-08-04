import { jest } from "@jest/globals"
import "@testing-library/jest-dom"

// Mock fetch for API calls in tests
global.fetch = jest.fn()

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
}))
