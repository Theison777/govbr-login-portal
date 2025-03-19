
import React from 'react';
import LoginCard from './LoginCard';
import PageLayout from './PageLayout';

const LoginLayout: React.FC = () => {
  return (
    <PageLayout>
      <div className="w-full max-w-md">
        <LoginCard 
          className="opacity-0 animate-fade-in" 
        />
        
        <div className="mt-8 text-center text-sm text-gray-500 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <p>Seus dados estão protegidos pela Lei Geral de</p>
          <p>Proteção de Dados (LGPD)</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginLayout;
