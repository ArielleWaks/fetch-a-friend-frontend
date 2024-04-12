import { render, screen } from '@testing-library/react';
import App from './App';

test('renders clients', () => {
  render(<App />);
  const headerElement = screen.getByText(/clients/i);
  expect(headerElement).toBeInTheDocument();
});
