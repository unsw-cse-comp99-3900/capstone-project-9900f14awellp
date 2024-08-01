import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import { useNavigate, MemoryRouter, Route, Routes } from 'react-router-dom';
import Register from '../views/Register';
import Login from '../views/Login';
import { render_page, exec_async } from './test_functions';
import { createContext, useState, useContext, useEffect } from "react";

describe('Register unit test', () => {
    test('Register page element test', () => {
      render_page(Register, 'register');
    
      // check h1 text
      expect(screen.getByRole('heading', {name: "Create an account"})).toBeInTheDocument();
    
      // check username input field
      const username_parent = screen.getByTestId("Register-Username");
      const username_field = username_parent.querySelector('#Register-Username');
      expect(username_field).toBeInTheDocument();
    
      // check email input field
      const email_parent = screen.getByTestId("Register-Email");
      const email_field = email_parent.querySelector('#Register-Email');
      expect(email_field).toBeInTheDocument();
    
      // check name input field
      const name_parent = screen.getByTestId("Register-Name");
      const name_field = name_parent.querySelector('#Register-Name');
      expect(name_field).toBeInTheDocument();
    
      // check password input field
      const password_parent_P = screen.getByTestId("Register-password");
      const password_field_P = password_parent_P.querySelector('#Register-password');
      expect(password_field_P).toBeInTheDocument();
    
      // check confirm password input field
      const password_parent_CP = screen.getByTestId("Register-confirm-password");
      const password_field_CP = password_parent_CP.querySelector('#Register-confirm-password');
      expect(password_field_CP).toBeInTheDocument();
    
      // check button 
      // toggle ...
      expect(screen.getAllByRole('button', {name: "toggle password visibility"})[0]).toBeInTheDocument();
      // Sign-up
      expect(screen.getByTestId('Sign-up-btn')).toBeInTheDocument();
    
      // check link
      // navigate to Login page
      expect(screen.getByRole('link', {name: "Have an account? Go Login"})).toBeInTheDocument();
      // information
      expect(screen.getByRole('link', {name: "By clicking Login, you agree to our Terms of Service and Privacy Policy"})).toBeInTheDocument();
    });

    test('toggle password visibility button function', () => {
      render_page(Register, 'register');

      const password_parent_P = screen.getByTestId("Register-password");
      const input_field = password_parent_P.querySelector("#Register-password");
      const visibility_btn = screen.getAllByRole('button', {name: "toggle password visibility"})[0];

      // default type of input field is password
      expect(input_field).toHaveAttribute('type', 'password');
      
      const enter_password = 'abc123./]'
      
      fireEvent.change(input_field, { target: { value: enter_password } });
      fireEvent.click(visibility_btn);
      
      // after clicking the visibility button, the type should turn to text
      expect(input_field).toHaveAttribute('type', 'text');
      expect(input_field).toHaveAttribute('value', enter_password);
      
      // check if click the v btn twice, the type turns back to password
      fireEvent.click(visibility_btn);
      expect(input_field).toHaveAttribute('type', 'password');
    });

    test('toggle confirm password visibility button function', () => {
      // same as the above, but on confirm password
      render_page(Register, 'register');

      const password_parent_CP = screen.getByTestId("Register-confirm-password");
      const input_field = password_parent_CP.querySelector("#Register-confirm-password");
      // the second visibility_btn [1]
      const visibility_btn = screen.getAllByRole('button', {name: "toggle password visibility"})[1];

      expect(input_field).toHaveAttribute('type', 'password');
      
      const enter_password = 'abc123./]xyz'
      
      fireEvent.change(input_field, { target: { value: enter_password } });
      fireEvent.click(visibility_btn);
      
      expect(input_field).toHaveAttribute('type', 'text');
      expect(input_field).toHaveAttribute('value', enter_password);
      
      fireEvent.click(visibility_btn);
      expect(input_field).toHaveAttribute('type', 'password');
    });

    test('link to login page', async () => {
        render(
          <MemoryRouter initialEntries={['/register']}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </MemoryRouter>
        );

        const navi_login = screen.getByText("Have an account? Go Login");
        
        fireEvent.click(navi_login);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: "Login" })).toBeInTheDocument();
        });

    });

    test('show agreement modal', () => {
        render_page(Register, 'register');
        const TSPP = screen.getByText("By clicking Login, you agree to our Terms of Service and Privacy Policy");
        expect(TSPP).toBeInTheDocument();
        fireEvent.click(TSPP);

        // modal headline
        expect(screen.getByRole('heading',
            { name: "Use our e-invoice service?" }
        )).toBeInTheDocument();

        // disagree btn
        expect(screen.getByRole('button', { name: "Disagree" })).toBeInTheDocument();

        // agree btn
        expect(screen.getByRole('button', { name: "Agree" })).toBeInTheDocument();
    });
});


describe('incomplete form test', () => {
  test('only enter Username', async () => {
    render_page(Register, 'register');

    // get username input field
    const username_parent = screen.getByTestId("Register-Username");
    const username_field = username_parent.querySelector('#Register-Username');

    fireEvent.change(username_field, { target: { value: 'testuser' } });
    fireEvent.click(screen.getByRole('button', {name: "Sign up"}));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

  test('only enter Email will show failed', async () => {
    render_page(Register, 'register');

    // get email input field
    const email_parent = screen.getByTestId("Register-Email");
    const email_field = email_parent.querySelector('#Register-Email');

    fireEvent.change(email_field, { target: { value: "test-email@gamil.com" } });
    fireEvent.click(screen.getByRole('button', {name: "Sign up"}));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

  test('only enter Name will show failed', async () => {
    render_page(Register, 'register');

    // get name input field
    const name_parent = screen.getByTestId("Register-Name");
    const name_field = name_parent.querySelector('#Register-Name');

    fireEvent.change(name_field, { target: { value: 'test-name' } });
    fireEvent.click(screen.getByRole('button', {name: "Sign up"}));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

  test('only enter Passwords will show failed', async () => {
    render_page(Register, 'register');

    // get password input field
    const password_parent_P = screen.getByTestId("Register-password");
    const password_field_P = password_parent_P.querySelector('#Register-password');

    // get confirm password input field
    const password_parent_CP = screen.getByTestId("Register-confirm-password");
    const password_field_CP = password_parent_CP.querySelector('#Register-confirm-password');

    fireEvent.change(password_field_P, { target: { value: '123456' } });
    fireEvent.change(password_field_CP, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', {name: "Sign up"}));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });
});


describe('complete form test', () => {
  test('successful register', async () => {
    render_page(Register, 'register');
    // delete the record in sqlite if username and email have been used
    await exec_async('python3 src/__tests__/sqlite3_read_script.py');
    // get username input field
    const username_parent = screen.getByTestId("Register-Username");
    const username_field = username_parent.querySelector('#Register-Username');
    
    // get email input field
    const email_parent = screen.getByTestId("Register-Email");
    const email_field = email_parent.querySelector('#Register-Email');
    
    // get name input field
    const name_parent = screen.getByTestId("Register-Name");
    const name_field = name_parent.querySelector('#Register-Name');
    
    // get password input field
    const password_parent_P = screen.getByTestId("Register-password");
    const password_field_P = password_parent_P.querySelector('#Register-password');
    
    // get confirm password input field
    const password_parent_CP = screen.getByTestId("Register-confirm-password");
    const password_field_CP = password_parent_CP.querySelector('#Register-confirm-password');
    
    fireEvent.change(username_field, { target: { value: "test-user" } });
    fireEvent.change(email_field, { target: { value: "test-email@gmail.com" } });
    fireEvent.change(name_field, { target: { value: 'test-name' } });
    fireEvent.change(password_field_P, { target: { value: '123456' } });
    fireEvent.change(password_field_CP, { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('Sign-up-btn'));
    
    await waitFor(() => {
      expect(screen.getByText('Register successfully!')).toBeInTheDocument();
    });
    // delete the record in sqlite if successfully register
    await exec_async('python3 src/__tests__/sqlite3_read_script.py');
  });

  test('password & confirm password not the same', async () => {
    render_page(Register, 'register');

    await exec_async('python3 src/__tests__/sqlite3_read_script.py');
    
    const username_parent = screen.getByTestId("Register-Username");
    const username_field = username_parent.querySelector('#Register-Username');
    
    const email_parent = screen.getByTestId("Register-Email");
    const email_field = email_parent.querySelector('#Register-Email');
    
    const name_parent = screen.getByTestId("Register-Name");
    const name_field = name_parent.querySelector('#Register-Name');
    
    const password_parent_P = screen.getByTestId("Register-password");
    const password_field_P = password_parent_P.querySelector('#Register-password');
    
    const password_parent_CP = screen.getByTestId("Register-confirm-password");
    const password_field_CP = password_parent_CP.querySelector('#Register-confirm-password');

    fireEvent.change(username_field, { target: { value: "test-user" } });
    fireEvent.change(email_field, { target: { value: "test-email@gmail.com" } });
    fireEvent.change(name_field, { target: { value: 'test-name' } });
    fireEvent.change(password_field_P, { target: { value: '123456' } });
    // wrong confirm password
    fireEvent.change(password_field_CP, { target: { value: '1' } });
    fireEvent.click(screen.getByTestId('Sign-up-btn'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });
});
