
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, QrCode, Key, Cloud, HelpCircle } from "lucide-react";
import CPFInput from './CPFInput';
import { toast } from 'sonner';

interface LoginCardProps {
  className?: string;
}

const LoginCard: React.FC<LoginCardProps> = ({ className }) => {
  const [cpf, setCpf] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = (valid: boolean, value: string) => {
    setIsValid(valid);
    setCpf(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast.error('CPF inválido. Por favor, verifique o número informado.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulação de autenticação
    setTimeout(() => {
      toast.success('CPF validado com sucesso!');
      setIsLoading(false);
      // Aqui seria a navegação para a próxima etapa
    }, 1500);
  };

  return (
    <div className={`glass-card rounded-xl p-8 w-full max-w-md mx-auto animate-fade-in ${className}`}>
      <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-6 text-center">
        Identifique-se no gov.br
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="cpf" className="gov-label">
            Digite seu CPF
          </label>
          <CPFInput 
            id="cpf"
            name="cpf"
            onValidate={handleValidate}
            aria-describedby="cpf-description"
          />
          <p id="cpf-description" className="text-sm text-gray-500 mt-1">
            Digite apenas números
          </p>
        </div>
        
        <Button
          type="submit"
          className="gov-button w-full rounded-full"
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-pulse">Verificando...</span>
            </span>
          ) : (
            <span className="flex items-center">
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {/* Outras opções de identificação */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Outras opções de identificação:</h3>
        
        <div className="space-y-4">
          {/* Login com banco */}
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-green-600 font-medium">Login com seu banco</span>
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">SUA CONTA SERÁ PRATA</span>
            </div>
          </div>
          
          {/* Login com QR code */}
          <div className="flex items-center">
            <QrCode className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Login com QR code</span>
          </div>
          
          {/* Certificado digital */}
          <div className="flex items-center">
            <Key className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Seu certificado digital</span>
          </div>
          
          {/* Certificado digital em nuvem */}
          <div className="flex items-center">
            <Cloud className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Seu certificado digital em nuvem</span>
          </div>
        </div>
        
        {/* Ajuda e termos */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
            <span className="text-blue-600">Está com dúvidas e precisa de ajuda?</span>
          </div>
          
          <div className="text-center">
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-700 text-sm"
            >
              Termo de Uso e Aviso de Privacidade
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
