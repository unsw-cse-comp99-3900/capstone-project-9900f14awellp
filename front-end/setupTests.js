// setupTests.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => children,
  };
});

// Mock antd ConfigProvider
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    ConfigProvider: ({ children }) => children,
  };
});