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

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  
Object.defineProperty(window, 'getComputedStyle', {
value: () => ({
    getPropertyValue: () => '',
}),
});