import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { createMemoryRouter, MemoryRouter } from 'react-router-dom';
import Register from '../views/Register';
import { exec } from 'child_process';
import axios from 'axios';

// vi.mock('axios');

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

  expect(screen.getByText("Password")).toBeInTheDocument();
  expect(screen.getByText("Confirm Password")).toBeInTheDocument();

  expect(screen.getAllByRole('button', {name: "toggle password visibility"})[0]).toBeInTheDocument();
  expect(screen.getByRole('button', {name: "Sign up"})).toBeInTheDocument();

  expect(screen.getByRole('link', {name: "Have an account? Go Login"})).toBeInTheDocument();
  expect(screen.getByRole('link', {name: "By clicking Login, you agree to our Terms of Service and Privacy Policy"})).toBeInTheDocument();
});

// describe('completed form submit test', () => {
//   beforeAll(() => {
//     localStorage.clear();
//     vi.resetAllMocks();
//   })

//   test('successful login', () => {
//     axios.post.mockResolvedValue({
//       data: {
//         'token': 'mock_token',
//         'userid': 'mock_userid',
//       },
//     });

//     render(
//       <MemoryRouter>
//         <Register />
//       </MemoryRouter>
//     )



//   })
// })
    






describe('incomplete form test', () => {
  test('only enter Username', async () => {
    render_register();

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
    render_register();

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
    render_register();

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
    render_register();

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

const exec_async = (command) => {
  return new Promise((res, rej) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        rej(error);
      } else if (stderr) {
        console.log('asdflkj')
        rej(stderr);
      } else {
        res(stdout);
        console.log('finish script')
      }
    });
  });
};

describe('complete form test', () => {
  test('successful register', async () => {
    render_register();
    
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
    fireEvent.change(email_field, { target: { value: "test-email@gamil.com" } });
    fireEvent.change(name_field, { target: { value: 'test-name' } });
    fireEvent.change(password_field_P, { target: { value: '123456' } });
    fireEvent.change(password_field_CP, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', {name: "Sign up"}));
    
    await waitFor(() => {
      expect(screen.getByText('Register successfully!')).toBeInTheDocument();
    });
    await exec_async('python3 src/__tests__/sqlite3_read_script.py');
    
  });
});
