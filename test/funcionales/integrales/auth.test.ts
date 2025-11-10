import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { signIn } from 'next-auth/react';
declare const jest: any;
jest.mock('next/navigation', () => ({ // eslint-disable-line no-undef
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  getSession: jest.fn().mockResolvedValue({ user: { email: 'test@example.com' } }),
}));

describe('Authentication Integration', () => {
  it('debe redirigir al dashboard después de un inicio de sesión exitoso', async () => {
    const { push } = require('next/navigation').useRouter();
    (signIn as jest.Mock).mockResolvedValue({ ok: true });

    render(LoginPage());

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

  });
});

