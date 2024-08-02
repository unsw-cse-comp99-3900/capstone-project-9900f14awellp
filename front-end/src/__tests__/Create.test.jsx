import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from "vitest";
import { render_page } from "./test_functions";
import Create from "@/views/Creation/Create";

describe('Create page unit test', () => {
  test('title', () => {
    render_page(Create, 'create');
    
    expect(screen.getByText(/Create your E-invoice/i)).toBeInTheDocument();
  });
  
  test('hint', () => {
    render_page(Create, 'create');

    expect(screen.getByText(/select your invoice type/i)).toBeInTheDocument();
  });

  test('GUI Form', () => {
    render_page(Create, 'create');

    expect(screen.getByText('GUI Form')).toBeInTheDocument();
  });

  test('File Upload', () => {
    render_page(Create, 'create');

    expect(screen.getByText('File Upload')).toBeInTheDocument();
  });

  test('continue button', () => {
    render_page(Create, 'create');

    expect(screen.getByRole('button', {name: "Continue"})).toBeInTheDocument();
  });
});