import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { MemoryRouter } from 'react-router-dom'
import App from '../App';

const render_this_router = (router) => {
  return render(
      <MemoryRouter initialEntries={[router]}>
        <App />
      </MemoryRouter>
  );
};
describe('App constructure test without login', () => {

  // default page
  test('render dafault page', () => {
    render_this_router('/')
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });

  // Not Found Page
  test('render NotFound page for unknown router 1', () => {
    render_this_router('/404');
    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
  });

  test('render NotFound page for unknown router 2', () => {
    render_this_router('/*');
    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
  });
    
  // Dashboard Page
  test('render Dashboard page for /home route', () => {
    render_this_router('/home');
    expect(screen.getAllByText(/E-Invoice/i)[0]).toBeInTheDocument();
  });

});

describe('App constructure test with login', () => {
  beforeAll(() => {
    localStorage.setItem('token', 'mock_token');
    // localStorage.setItem('userid', 9999);
  });

  afterAll(() => {
    localStorage.clear();
  });

  // Creation
  // Create
  test('render Create page', () => {
    render_this_router('/create');
    expect(screen.getByText(/Create your E-invoice/i)).toBeInTheDocument();
  });

  // // Upload
  // test('render Upload page in Create page', () => {
  //   render_this_router('/create/upload');
  //   expect(screen.getByText(/Upload File/i)).toBeInTheDocument();
  // });

  // // Form
  // test('render Form page in Create page for /create/form route', () => {
  //   render_this_router('/create/form');
  //   expect(screen.getByText(/Invoice Details/i)).toBeInTheDocument();
  // });

  // // login
  // test('render login page', () => {
  //   render_this_router('/login')
  //   expect(screen.getAllByText(/Login/i)[0]).toBeInTheDocument();
  // })

  // // path="/register"
  // test('render register page', () => {
  //   render_this_router('/register')
  //   expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
  // })

  // // path="/choice"
  // test('render choice page', () => {
  //   render_this_router('/choice')
  //   expect(screen.getByText(/Welcome🥳/i)).toBeInTheDocument();
  // })

  // // path="/draft"
  // test('render draft page', () => {
  //   render_this_router('/draft')
  //   expect(screen.getByText(/Draft page/i)).toBeInTheDocument();
  // })

  // // path="/profile"
  // test('render profile page', () => {
  //   render_this_router('/profile')
  //   expect(screen.getAllByText(/Profile/i)[0]).toBeInTheDocument();
  // })

  // // path="/company-details"
  // test('render company-details', () => {
  //   render_this_router('/company-details')
  //   expect(screen.getByText(/company details Page/i)).toBeInTheDocument();
  // })

  localStorage.clear();
});