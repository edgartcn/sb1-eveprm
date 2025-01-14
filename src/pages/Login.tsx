import React from 'react';
import { Scale } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';

export function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Scale className="w-12 h-12 text-blue-900 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">ePREV</h1>
          <p className="text-gray-600 mt-2">Sistema de Análise Previdenciária</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}