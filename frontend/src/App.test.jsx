import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Mock the AuthProvider for testing purposes
const MockAuthProvider = ({ children }) => (
  <AuthContext.Provider value={{ user: null, login: async () => {}, logout: () => {}, loginWithToken: () => {} }}>
    {children}
  </AuthContext.Provider>
);

describe('App', () => {
  test('renders Home link', () => {
    render(
      <BrowserRouter>
        <MockAuthProvider>
          <App />
        </MockAuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });
});
