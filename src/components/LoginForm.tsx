import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RegisterForm } from './auth/RegisterForm';
import { ResetPasswordForm } from './auth/ResetPasswordForm';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('Email ou senha incorretos');
      } else {
        setError(err instanceof Error ? err.message : 'Erro ao fazer login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'register') {
    return (
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6">Criar conta</h2>
        <RegisterForm
          onSuccess={() => {
            setMode('login');
            setError('Conta criada com sucesso! Faça login para continuar.');
          }}
          onCancel={() => setMode('login')}
        />
      </div>
    );
  }

  if (mode === 'reset') {
    return (
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6">Recuperar senha</h2>
        <ResetPasswordForm
          onSuccess={() => setMode('login')}
          onCancel={() => setMode('login')}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        {error && (
          <div className={`text-sm ${error.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
        <div className="flex justify-between text-sm">
          <button
            type="button"
            onClick={() => setMode('register')}
            className="text-blue-900 hover:text-blue-800"
          >
            Criar conta
          </button>
          <button
            type="button"
            onClick={() => setMode('reset')}
            className="text-blue-900 hover:text-blue-800"
          >
            Esqueci minha senha
          </button>
        </div>
      </form>
    </div>
  );
}