
import React from 'react';
import GovLogo from './GovLogo';
import LoginCard from './LoginCard';

const LoginLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GovLogo />
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <h1 className="text-3xl font-heading font-bold text-gray-800">
              Acesse sua conta gov.br
            </h1>
            <p className="mt-2 text-gray-600">
              Informe seu CPF para começar
            </p>
          </div>
          
          <LoginCard className="opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }} />
          
          <div className="mt-8 text-center text-sm text-gray-500 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <p>Seus dados estão protegidos pela Lei Geral de</p>
            <p>Proteção de Dados (LGPD)</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} - Governo Federal</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-govblue-600 transition-colors">Termos de uso</a>
              <a href="#" className="hover:text-govblue-600 transition-colors">Política de privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginLayout;
