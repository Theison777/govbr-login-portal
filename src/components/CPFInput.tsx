
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Check, AlertCircle } from "lucide-react";

interface CPFInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValidate?: (isValid: boolean, value: string) => void;
}

const CPFInput = ({ 
  className, 
  onValidate, 
  ...props 
}: CPFInputProps) => {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Função para aplicar máscara de CPF: 000.000.000-00
  const formatCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, ''); // Remove tudo o que não é dígito
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return cpf;
  };

  // Função para validar CPF
  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]/g, '');

    if (cpf.length !== 11) return false;

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatCPF(rawValue);
    setValue(formattedValue);
    
    // Só valida se tiver 14 caracteres (CPF completo com máscara)
    if (formattedValue.length === 14) {
      const valid = validateCPF(formattedValue);
      setIsValid(valid);
      onValidate?.(valid, formattedValue);
    } else if (formattedValue.length > 0) {
      setIsValid(null);
      onValidate?.(false, formattedValue);
    } else {
      setIsValid(null);
      onValidate?.(false, '');
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "pr-10 gov-input transition-all duration-200", 
          isValid === true && "border-green-500 pr-10",
          isValid === false && "border-red-500 pr-10",
          className
        )}
        maxLength={14}
        placeholder="000.000.000-00"
        {...props}
      />
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-opacity duration-200">
        {isValid === true && (
          <Check className="h-4 w-4 text-green-500 animate-fade-in" />
        )}
        {isValid === false && (
          <AlertCircle className="h-4 w-4 text-red-500 animate-fade-in" />
        )}
      </div>
    </div>
  );
};

export default CPFInput;
