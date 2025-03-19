
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
          className="gov-button w-full"
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
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          Não possui uma conta gov.br?
        </p>
        <Button
          variant="link"
          className="w-full text-govblue-600 hover:text-govblue-700 font-medium p-0 h-auto mt-1"
        >
          Crie sua conta
        </Button>
      </div>
    </div>
  );
};

export default LoginCard;
