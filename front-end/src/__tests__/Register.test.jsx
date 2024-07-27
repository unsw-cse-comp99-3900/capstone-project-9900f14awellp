import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { MemoryRouter } from 'react-router-dom'
import Register from '../views/Register'

const render_register = () => {
  return render(
    <MemoryRouter>
        <Register />
    </MemoryRouter>
  );
}

test('Register element test', () => {
  render_register();

  expect(screen.getByRole('heading', {name: "Create an account"})).toBeInTheDocument();

  expect(screen.getByRole('textbox', {name: "Username"})).toBeInTheDocument();
  expect(screen.getByRole('textbox', {name: "Email"})).toBeInTheDocument();
  expect(screen.getByRole('textbox', {name: "Name"})).toBeInTheDocument();

  expect(screen.getAllByRole('button', {name: "toggle password visibility"})[0]).toBeInTheDocument();
  expect(screen.getByRole('button', {name: "Sign up"})).toBeInTheDocument();

  expect(screen.getByRole('link', {name: "Have an account? Go Login"})).toBeInTheDocument();
  expect(screen.getByRole('link', {name: "By clicking Login, you agree to our Terms of Service and Privacy Policy"})).toBeInTheDocument();

});

describe('uncomplete form with show alert when submit', () => {
  test('only username', async () => {
    render_register();

    fireEvent.change(screen.getByRole('textbox', {name: "Username"}), { target: { value: 'testuser' } });
    fireEvent.click(screen.getByRole('button', {name: "Sign up"}));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

});