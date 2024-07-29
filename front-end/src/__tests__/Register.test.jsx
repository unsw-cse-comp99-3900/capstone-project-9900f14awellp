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

describe('uncomplete form with show alert when submit', () => {
  test('only enter Username will show failed', async () => {
    render_register();

    fireEvent.change(screen.getByRole('textbox', {name: "Username"}), { target: { value: 'testuser' } });
    fireEvent.click(screen.getByRole('button', {name: "Sign up"}));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

  test('only enter Email will show failed', async () => {
    render_register();

    fireEvent.change(screen.getByRole('textbox', {name: "Email"}), { target: { value: 'apple@mail.com' } });
    fireEvent.click(screen.getByRole('button', {name: "Sign up"}));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

  test('only enter Name will show failed', async () => {
    render_register();

    fireEvent.change(screen.getByRole('textbox', {name: "Name"}), { target: { value: 'testname' } });
    fireEvent.click(screen.getByRole('button', {name: "Sign up"}));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

  test('only enter Passwords will show failed', async () => {
    render_register();

    const password_parent_P = screen.getByTestId("Register-password");
    const password_field_P = password_parent_P.querySelector('#Register-password');

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
  test('successful login', async () => {
    render_register();
    

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
    
    let enter_username = "test-user";
    let enter_email = "test-email@gamil.com";
    
    await fireEvent.change(username_field, { target: { value: enter_username } });
    await fireEvent.change(email_field, { target: { value: enter_email } });
    await fireEvent.change(name_field, { target: { value: 'test-name' } });
    await fireEvent.change(password_field_P, { target: { value: '123456' } });
    await fireEvent.change(password_field_CP, { target: { value: '123456' } });
    await fireEvent.click(screen.getByRole('button', {name: "Sign up"}));
    
    await waitFor(() => {
      expect(screen.getByText('Register successfully!')).toBeInTheDocument();
    });
    
  });
});

// sqlite3 ../../../db.splite3
// drop table if exists invoice_user; 
// CREATE TABLE IF NOT EXISTS "invoice_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "last_login" datetime NULL, "username" varchar(255) NOT NULL UNIQUE, "password" varchar(255) NOT NULL, "name" varchar(255) NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "create_date" datetime NOT NULL, "update_date" datetime NOT NULL, "company_id" bigint NULL REFERENCES "invoice_company" ("id") DEFERRABLE INITIALLY DEFERRED, "reset_password_sent_at" datetime NULL, "reset_password_token" varchar(255) NULL, "is_staff" bool NOT NULL, "avatar" varchar(100) NULL, "bio" text NOT NULL);
// .exit



// CREATE INDEX "invoice_user_company_id_f0531d06" ON "invoice_user" ("company_id");