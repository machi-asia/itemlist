import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button component", () => {
  it("renders children correctly", () => {
    render(<Button appName="test">Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
