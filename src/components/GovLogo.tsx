
import React from 'react';

interface GovLogoProps {
  className?: string;
}

const GovLogo: React.FC<GovLogoProps> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Logo gov.br */}
      <div className="flex items-center">
        <span className="text-govblue-700 font-heading font-bold text-3xl mr-0.5">gov</span>
        <span className="bg-govblue-700 text-white font-heading font-bold text-3xl px-1 rounded-sm">.br</span>
      </div>
      <span className="text-gray-600 text-xs mt-1 font-heading">Governo Federal</span>
    </div>
  );
};

export default GovLogo;
