import React from "react";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login from '../views/Login';
import Register from "@/views/Register";
import { render_page, register_testaccount, exec_async } from "./test_functions";
import { InvoiceProvider } from "@/Content/GuiContent";

describe('Login page unit tests', () => {
  // headline login
  test('Login headline', () => {
    render_page(Login, 'login');

    expect(screen.getByRole('heading', {name: "Login"})).toBeInTheDocument();
  });
  
  // username input field
  test('Username input field', () => {
    render_page(Login, 'login');

    const username_parent = screen.getByTestId("Login-username");
    const username_field = username_parent.querySelector("#Login-username")
    expect(username_field).toBeInTheDocument();
  });

  // password input field
  test('Password input field', () => {
    render_page(Login, 'login');

    const password_parent = screen.getByTestId("Login-password");
    const password_field = password_parent.querySelector("#Login-password")
    expect(password_field).toBeInTheDocument();
  });
  
  // password visibility btn
  test('Password visibility btn', () => {
    render_page(Login, ' login');
    
    expect(screen.getByRole('button', {name: "toggle password visibility"})).toBeInTheDocument();
  })
  
  // forget password
  test('link of forget password', () => {
    render_page(Login, 'login');
    
    expect(screen.getByRole('link', {name: "Forget your password?"})).toBeInTheDocument();
  });

  // Login btn
  test('LOGIN btn', () => {
    render_page(Login, 'login');
  
    expect(screen.getByRole('button', {name: "Login"})).toBeInTheDocument();
  });

  // Don't have an account? Go register
  test('link to Register page', () => {
    render_page(Login, 'login');

    expect(screen.getByRole('link', {name: "Don't have an account? Go register"}));
  });

  // By clicking login...
  test('link of information', () => {
    render_page(Login, 'login');

    expect(screen.getByRole('link',
      {name: "By clicking Login, you agree to our Terms of Service and Privacy Policy"}
    ));
  });

});

// entering in username field will change value
describe('page element functional tests', () => {
  test('entering in username field', () => {
    render_page(Login, 'login');

    const username_parent = screen.getByTestId("Login-username");
    const username_field = username_parent.querySelector("#Login-username")

    fireEvent.change(username_field, { target: { value: "test-user" } });

    expect(username_field).toHaveAttribute('value', "test-user");
  });

  // entering in password field will change value
  test('entering in password field', () => {
    render_page(Login, 'login');

    const password_parent = screen.getByTestId("Login-password");
    const password_field = password_parent.querySelector("#Login-password")
    
    fireEvent.change(password_field, { target: { value: "123456" } });
    
    expect(password_field).toHaveAttribute('value', "123456");
  });
  
  // password visibility btn work
  test('visibility button working', () => {
    render_page(Login, 'login');
    
    // default type of input field should be password
    const password_parent = screen.getByTestId("Login-password");
    const password_field = password_parent.querySelector("#Login-password")
    expect(password_field).toHaveAttribute('type', 'password');

    const btn = screen.getByRole('button', {name: "toggle password visibility"});
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    
    // after clicking the visibility button, the type of password field should be text
    expect(password_field).toHaveAttribute('type', 'text');
    
    fireEvent.click(btn);
    // click the button twice will change type back to password
    expect(password_field).toHaveAttribute('type', 'password');
  });

  // forget password show reset password modal
  test('forget password link working', () => {
    render_page(Login, 'login');

    const forget_link = screen.getByRole('link', {name: "Forget your password?"});
    fireEvent.click(forget_link);

    expect(screen.getByRole('heading', {name: "Reset Password"})).toBeInTheDocument();
  });

  // click link should navigate to Register page
  test('navigate to register page link working', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <InvoiceProvider>
          <Login />
          <Register />
        </InvoiceProvider>
    </MemoryRouter>
    );

    const navi_register = screen.getByText("Don't have an account? Go register");

    fireEvent.click(navi_register);

    expect(screen.getByRole('heading', {name: "Create an account"})).toBeInTheDocument();
  });

  // by clicking show another modal
  test('information link working', () => {
    render_page(Login, 'login');

    const By_link = screen.getByRole('link',
      {name: "By clicking Login, you agree to our Terms of Service and Privacy Policy"}
    );
    fireEvent.click(By_link);

    expect(screen.getByRole('heading', {name: "Use our e-invoice service?"})).toBeInTheDocument();
  });
});

describe('Login page UI tests', () => {
  describe('incomplete form test', () => {
    test('only type username', async () => {
      render_page(Login, 'login');
      
      const username_parent = screen.getByTestId("Login-username");
      const username_field = username_parent.querySelector("#Login-username")
    
      fireEvent.change(username_field, { value: "test-user"});
      fireEvent.click(screen.getByRole('button', {name: "Login"}));
    
      await waitFor(() => {
        expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
      });
    });

    test('only type username', async () => {
      render_page(Login, 'login');

      const password_parent = screen.getByTestId("Login-password");
      const password_field = password_parent.querySelector("#Login-password")

      fireEvent.change(password_field, { value: "123456" });
      fireEvent.click(screen.getByRole('button', {name: "Login"}));

      await waitFor(() => {
        expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('complete form test', () => {
    test('login account that has not yet register', async () => {
      render_page(Login, 'login');
      
      const username_parent = screen.getByTestId("Login-username");
      const username_field = username_parent.querySelector("#Login-username")
      fireEvent.change(username_field, { target: { value: "test-user-3" }});

      const password_parent = screen.getByTestId("Login-password");
      const password_field = password_parent.querySelector("#Login-password")
      fireEvent.change(password_field, { target: { value: "123456" } });

      fireEvent.click(screen.getByRole('button', {name: "Login"}));

      await waitFor(() => {
        expect(screen.getByText('User not exists or password is wrong, please check your input.')).toBeInTheDocument();
      });
    });

    test('login account that has registered', async () => {
      // render(
      //   <MemoryRouter initialEntries={['/register']}>
      //     <InvoiceProvider>
      //       <Register />
      //       <Login />
      //     </InvoiceProvider>
      //   </MemoryRouter>
      // );
      render_page(Register, 'register');

      await exec_async('python3 src/__tests__/sqlite3_read_script.py test-user-1');
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
      
      fireEvent.change(username_field, { target: { value: "test-user-1" } });
      fireEvent.change(email_field, { target: { value: "test-email-1@gmail.com" } });
      fireEvent.change(name_field, { target: { value: 'test-name' } });
      fireEvent.change(password_field_P, { target: { value: '123456' } });
      fireEvent.change(password_field_CP, { target: { value: '123456' } });

      fireEvent.click(screen.getByTestId("Sign-up-btn"));

      await waitFor(() => {
        expect(screen.getByText('Register successfully!')).toBeInTheDocument();
      });

      render_page(Login, 'login');

      const username_p = screen.getByTestId("Login-username");
      const username_f = username_p.querySelector("#Login-username")
      fireEvent.change(username_f, { target: { value: "test-user-1" } });
      
      const password_p = screen.getByTestId("Login-password");
      const password_f = password_p.querySelector("#Login-password")
      fireEvent.change(password_f, { target: { value: "123456" } });

      fireEvent.click(screen.getByRole('button', {name: "Login"}));

      await waitFor(() => {
        expect(screen.getByText('Login successfully!')).toBeInTheDocument();
      });
      await exec_async('python3 src/__tests__/sqlite3_read_script.py test-user-1');
    });

  });
});
