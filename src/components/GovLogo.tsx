
import React from 'react';

interface GovLogoProps {
  className?: string;
}

const GovLogo: React.FC<GovLogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="https://i.postimg.cc/NFYS4SwW/govbr.png" 
        alt="gov.br" 
        className="h-10"
      />
    </div>
  );
};

export default GovLogo;
