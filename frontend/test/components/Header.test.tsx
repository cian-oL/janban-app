import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import Header from "@/components/Header";

// ==== MOCKS ====

const renderHeader = () => {
  render(<Header />);

  return {
    headerElement: screen.getByRole("banner"),
    logoElement: screen.getByRole("link", { name: "Janban" }),
    buttonElement: screen.queryByTestId("button-mock"),
    toggleElement: screen.getByTestId("mode-toggle-mock"),
    userDropDownMenu: screen.queryByTestId("user-menu-mock"),
  };
};

let mockIsSignedIn = vi.hoisted(() => true);
vi.mock("@clerk/clerk-react", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SignedIn: ({ children }: { children: ReactNode }) =>
    mockIsSignedIn ? <>{children}</> : null,
  SignedOut: ({ children }: { children: ReactNode }) =>
    !mockIsSignedIn ? <>{children}</> : null,
  useUser: () => ({ isSignedIn: mockIsSignedIn }),
}));

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

describe("Header Component", () => {
  beforeEach(() => mockNavigate.mockClear());
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
    expect(buttonElement).toBeInTheDocument();
    expect(toggleElement).toBeInTheDocument();

    // Confirm button has correct text
    expect(buttonElement).toHaveTextContent("Sign In");

    // Confirm no User Drop Down Menu when not logged in
    expect(userDropDownMenu).toBeInTheDocument();
  });

  // Logo navigation test
  it("Navigates to the Dashboard on click of logo", () => {
    const { logoElement } = renderHeader();
    fireEvent.click(logoElement);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  // Button functionality test
  it("Navigates to login directory on click of button", () => {
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

  //   Check render of UserDropDownMenu when logged in
  it("Renders the UserDropDownMenu component when logged in", () => {
    const { userDropDownMenu } = renderHeader();

    expect(userDropDownMenu).toBeInTheDocument();
  });
});
