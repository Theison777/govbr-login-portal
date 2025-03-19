
import React from 'react';
import GovLogo from './GovLogo';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-start">
          <GovLogo />
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {children}
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

export default PageLayout;
