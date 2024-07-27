import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom'
import App from '../App';

describe('App test', () => {
  const render_this_router = (router) => {
    return render(
      <MemoryRouter initialEntries={[router]}>
        <App />
      </MemoryRouter>
    );
  };

  // default page
  test('renders dafault page', () => {
    render_this_router('/')
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });



});