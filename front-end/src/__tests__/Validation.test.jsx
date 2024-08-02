import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from "vitest";
import { render_page } from "./test_functions";
import Validation from "@/views/Validation";

describe('Validation page unit test', () => {
  test('title', () => {
    render_page(Validation, 'validate');
    
    expect(screen.getByText(/Validate your E-invoice/i)).toBeInTheDocument();
  });
  
  test('hint', () => {
    render_page(Validation, 'validate');

    expect(screen.getByText(/please choose your invoice and rules/i)).toBeInTheDocument();
  });

  test('select Rules form', () => {
    render_page(Validation, 'validate');

    expect(screen.getByTestId('select-Rules')).toBeInTheDocument();
  });

  test('select Invoice form', () => {
    render_page(Validation, 'validate');

    expect(screen.getByTestId('select-Invoice')).toBeInTheDocument();
  });

  test('Validate button', () => {
    render_page(Validation, 'validate');

    expect(screen.getByRole('button', {name: "Validate"})).toBeInTheDocument();
  });
});