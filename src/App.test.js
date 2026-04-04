import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Zaibii Global Search heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Zaibii Global Search/i);
  expect(headingElement).toBeInTheDocument();
});
