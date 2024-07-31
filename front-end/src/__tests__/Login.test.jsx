import React from "react";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from '../views/Login';

// headline login
// username input field
// password input field
// password visibility btn
// forget password
// Login btn
// Dont ...
// By clicking login...
const render_register = () => {
  return render(
    <MemoryRouter initialEntries={['/login']}>
        <Login />
    </MemoryRouter>
  );
};

describe('Login page unit test', () => {
  test('Login headline', () => {
    render_register();

    expect(screen.getByRole('heading', {name: "Login"})).toBeInTheDocument();
  });
  
  test('Username input field', () => {
    render_register();

    const username_parent = screen.getByTestId("Login-username");
    const username_field = username_parent.querySelector("#Login-username")
    expect(username_field).toBeInTheDocument();
  });

  test('Password input field', () => {
    render_register();

    const password_parent = screen.getByTestId("Login-password");
    const password_field = password_parent.querySelector("#Login-password")
    expect(password_field).toBeInTheDocument();
  });
  
  

});