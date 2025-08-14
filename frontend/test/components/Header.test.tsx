import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import Header from "@/components/Header";

type MockAuthState = {
  isSignedIn: boolean;
  userId: string | null;
};

// ==== MOCKS ====

let mockAuthState = vi.hoisted<MockAuthState>(() => ({
  isSignedIn: true,
  userId: "user_123",
}));

vi.mock("@clerk/clerk-react", () => {
  const MockClerkProvider = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="clerk-provider-mock">{children}</div>
  );

  const SignedIn = ({ children }: { children: React.ReactNode }) => {
    return mockAuthState.isSignedIn ? <>{children}</> : null;
  };

  const SignedOut = ({ children }: { children: React.ReactNode }) => {
    return !mockAuthState.isSignedIn ? <>{children}</> : null;
  };

  return {
    ClerkProvider: MockClerkProvider,
    useAuth: () => mockAuthState,
    SignedIn,
    SignedOut,
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
  }) => (
    <a
      href={to}
      data-testid="link-mock"
      onClick={() => mockNavigate(to)}
      {...props}
    >
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

let mockTheme = vi.hoisted<"light" | "dark">(() => "light");
vi.mock("@/contexts/ThemeProvider", () => ({
  useTheme: vi.fn(() => ({
    theme: mockTheme,
    setTheme: vi.fn(),
  })),
}));

vi.mock("@/components/ModeToggle", () => ({
  default: vi.fn(() => <div data-testid="mode-toggle-mock" />),
}));

vi.mock("@/components/ui/button", () => ({
  Button: vi.fn(
    ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
    }) => (
      <button data-testid="button-mock" onClick={onClick}>
        {children}
      </button>
    ),
  ),
}));

vi.mock("@/components/UserDropDownMenu", () => ({
  default: vi.fn(() => <div data-testid="user-menu-mock" />),
}));

// ==== TESTS ====

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="test-wrapper">{children}</div>;
};

const renderHeader = () => {
  render(<Header />, { wrapper: TestWrapper });

  return {
    headerElement: screen.getByRole("banner"),
    logoElement: screen.getByRole("link", { name: "Janban" }),
    buttonElement: screen.queryByTestId("button-mock"),
    toggleElement: screen.getByTestId("mode-toggle-mock"),
    userDropDownMenu: screen.queryByTestId("user-menu-mock"),
  };
};

describe("Header Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockAuthState = { isSignedIn: true, userId: "user_123" };
  });
  afterEach(() => cleanup());

  // Basic rendering test
  it("Renders the header with all expected elements when signed in", () => {
    const {
      headerElement,
      logoElement,
      buttonElement,
      toggleElement,
      userDropDownMenu,
    } = renderHeader();

    // Confirm rendering
    expect(headerElement).toBeInTheDocument();
    expect(logoElement).toBeInTheDocument();
    expect(toggleElement).toBeInTheDocument();
    expect(userDropDownMenu).toBeInTheDocument();

    // Sign in button should not be visible when signed in
    expect(buttonElement).not.toBeInTheDocument();
  });

  it("Renders sign in button when user is not signed in", () => {
    // Set auth state to signed out
    mockAuthState = { isSignedIn: false, userId: null };

    const {
      headerElement,
      logoElement,
      buttonElement,
      toggleElement,
      userDropDownMenu,
    } = renderHeader();

    // Confirm rendering
    expect(headerElement).toBeInTheDocument();
    expect(logoElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
    expect(toggleElement).toBeInTheDocument();

    // User menu should not be visible when signed out
    expect(userDropDownMenu).not.toBeInTheDocument();

    // Confirm button has correct text
    expect(buttonElement).toHaveTextContent("Sign In");
  });

  // Logo navigation test
  it("Navigates to Home on click of logo", () => {
    const { logoElement } = renderHeader();
    fireEvent.click(logoElement);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  // Button functionality test
  it("Navigates to login directory on click of button", () => {
    mockAuthState = { isSignedIn: false, userId: null };
    const { buttonElement } = renderHeader();
    fireEvent.click(buttonElement!);

    expect(mockNavigate).toHaveBeenCalledWith("/sign-in");
  });

  // Theme color test for light mode
  it("Has the correct background color in light mode", () => {
    mockTheme = "light";
    const { headerElement } = renderHeader();

    expect(headerElement).toHaveClass("bg-indigo-600");
  });

  // Theme color test for dark mode
  it("Has the correct background color in dark mode", () => {
    mockTheme = "dark";
    const { headerElement } = renderHeader();

    expect(headerElement).toHaveClass("bg-indigo-900");
  });
});
