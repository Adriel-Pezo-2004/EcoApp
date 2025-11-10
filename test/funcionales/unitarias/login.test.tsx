import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '@/app/login/page';

import '@testing-library/jest-dom/extend-expect';
declare const jest: any;
// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock de next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
}));



describe('LoginPage', () => {
  it('debe renderizar el formulario de inicio de sesión', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  it('debe mostrar un mensaje de error con credenciales inválidas', async () => {
    const { signIn } = require('next-auth/react');
    signIn.mockResolvedValue({ error: 'Credenciales inválidas' });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'wrong-password' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    expect(await screen.findByText(/Credenciales inválidas/i)).toBeInTheDocument(); // This line is correct, the error message is misleading.
  });
});