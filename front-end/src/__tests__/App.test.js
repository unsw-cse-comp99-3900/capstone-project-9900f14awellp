import React from 'react'
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import App from '../App'

test('renders without crashing', () => {
  render(<App />)
  expect(screen.getByRole('')).toBeInTheDocument()
});
