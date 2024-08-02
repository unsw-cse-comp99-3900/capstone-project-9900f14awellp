import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { exec } from 'child_process';
import { createMemoryRouter } from "react-router-dom";
import { routes } from "../AppRouter";
import { InvoiceProvider } from "@/Content/GuiContent";

export const render_this_router = (initialEntries, Page) => {
  const router = createMemoryRouter(routes, { initialEntries });
  return render(<Page router={router} />);
};

export const render_page = (Page, url) => {
  return render(
    <MemoryRouter initialEntries={[`/${url}`]}>
      <InvoiceProvider>
        <Page />
      </InvoiceProvider>
    </MemoryRouter>
  );
}

export const exec_async = (command) => {
  return new Promise((res, rej) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        rej(error);
      } else if (stderr) {
        rej(stderr);
      } else {
        res(stdout);
        console.log('finish script')
      }
    });
  });
};

// The below function does not clear the database data
export const register_testaccount = async () => {
  // delete test account if already exist
  await exec_async('python3 src/__tests__/sqlite3_read_script.py');

//   render_page(Register, 'register');
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
  
  await waitFor(() => {
    expect(screen.getByText('Register successfully!')).toBeInTheDocument();
  });
  // delete the record in sqlite if successfully register
  // await exec_async('python3 src/__tests__/sqlite3_read_script.py');
};