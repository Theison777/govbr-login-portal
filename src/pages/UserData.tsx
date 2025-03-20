
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, IdCard, Calendar, FileText, ArrowLeft, CheckCircle, AlertTriangle, Search, Clock, LoaderCircle, Award, Briefcase, ClipboardCheck, Building } from "lucide-react";
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface UserDataPageProps {}

interface UserInfo {
  cpf: string;
  nome?: string;
  nascimento?: string;
  mae?: string;
  situacao?: string;
  // Add any other properties found in the API response
}

const UserData: React.FC<UserDataPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisSteps, setAnalysisSteps] = useState<{title: string; status: 'loading' | 'success' | 'error' | 'waiting'}[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [qualificando, setQualificando] = useState(false);
  const [qualified, setQualified] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Check if userData exists in location state
    if (location.state?.userData) {
      setUserData(location.state.userData);
      setLoading(false);
      
      // Start the analysis process
      startAnalysis();
    } else {
      // No user data, redirect to login
      navigate('/');
      toast.error('Sessão expirada ou inválida');
    }
    
    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [location, navigate]);
  
  const getStepIcon = (step: string) => {
    if (step.includes("atividade remunerada")) {
      return <Briefcase className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else if (step.includes("Dados Informados")) {
      return <ClipboardCheck className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else if (step.includes("Empregadores")) {
      return <Building className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else if (step.includes("CPF")) {
      return <Search className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else if (step.includes("transferências") || step.includes("movimentações")) {
      return <Clock className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-govblue-600 flex-shrink-0" />;
    }
  };
  
  const startAnalysis = () => {
    // Define the analysis steps
    const steps = [
      { title: "Exercer atividade remunerada", status: 'waiting' as const },
      { title: "Dados Informados Corretamente", status: 'waiting' as const },
      { title: "Empregadores Contribuintes", status: 'waiting' as const }
    ];
    
    setAnalysisSteps(steps);
    
    // Start the analysis process with a slight delay
    timerRef.current = window.setTimeout(() => {
      processNextStep();
    }, 1500);
  };
  
  const processNextStep = () => {
    if (currentStep < analysisSteps.length) {
      // Update current step to loading
      setAnalysisSteps(prev => {
        const updated = [...prev];
        if (updated[currentStep]) {
          updated[currentStep].status = 'loading';
        }
        return updated;
      });
      
      // Simulate processing time
      const processingTime = Math.random() * 2000 + 1000; // 1-3 seconds
      
      timerRef.current = window.setTimeout(() => {
        // Mark current step as complete
        setAnalysisSteps(prev => {
          const updated = [...prev];
          if (updated[currentStep]) {
            // We'll always mark as success for this demo
            updated[currentStep].status = 'success';
          }
          return updated;
        });
        
        // Move to the next step or finish
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= analysisSteps.length) {
            setAnalysisComplete(true);
            return prev;
          }
          
          // Process the next step after a short delay
          timerRef.current = window.setTimeout(() => {
            processNextStep();
          }, 800);
          
          return next;
        });
      }, processingTime);
    }
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleQualify = () => {
    setQualificando(true);
    
    // Simulate qualification process
    setTimeout(() => {
      setQualified(true);
      setQualificando(false);
    }, 3000);
  };
  
  // Extract initials from name
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  // Format CPF for display
  const formatCPF = (cpf: string = '') => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  
  // Format date for display (assuming date is in format YYYY-MM-DD or similar)
  const formatDate = (dateString: string = '') => {
    if (!dateString) return '';
    
    try {
      // This assumes date is in a format that JavaScript Date can parse
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return dateString; // Return original if can't format
    }
  };
  
  if (loading) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <LoaderCircle className="h-12 w-12 text-govblue-600 animate-spin mb-4" />
          <h2 className="text-xl font-medium text-gray-700">Carregando dados...</h2>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="w-full max-w-4xl mx-auto p-4 space-y-6 animate-fade-in">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="text-govblue-600 hover:text-govblue-700 p-0 h-auto mb-4"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User profile card */}
          <div className="glass-card rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 border-2 border-govblue-100 shadow-sm">
                <AvatarFallback className="bg-govblue-100 text-govblue-700 text-xl">
                  {getInitials(userData?.nome || '')}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800 mt-2">{userData?.nome || 'Nome não informado'}</h2>
              <p className="text-sm text-gray-500">CPF: {formatCPF(userData?.cpf || '')}</p>
            </div>
            
            <div className="pt-4 space-y-3 border-t border-gray-100">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-govblue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Data de Nascimento</p>
                  <p className="text-sm font-medium">{formatDate(userData?.nascimento || '') || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <User className="h-5 w-5 text-govblue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Nome da Mãe</p>
                  <p className="text-sm font-medium">{userData?.mae || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <IdCard className="h-5 w-5 text-govblue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Situação do CPF</p>
                  <p className="text-sm font-medium">{userData?.situacao || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="glass-card rounded-xl p-6 space-y-6 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Análise de Direito ao Benefício</h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {analysisComplete ? 'Análise Concluída' : 'Em Análise'}
              </Badge>
            </div>
            
            <div className="space-y-6">
              {/* Progress steps */}
              <div className="space-y-4">
                {analysisSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`rounded-full p-1 ${
                      step.status === 'loading' ? 'bg-amber-100' : 
                      step.status === 'success' ? 'bg-green-100' : 
                      step.status === 'error' ? 'bg-red-100' : 
                      'bg-gray-100'
                    }`}>
                      {step.status === 'loading' && <LoaderCircle className="h-5 w-5 text-amber-600 animate-spin" />}
                      {step.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {step.status === 'error' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                      {step.status === 'waiting' && <Clock className="h-5 w-5 text-gray-400" />}
                    </div>
                    
                    <div className="flex items-center flex-1">
                      {getStepIcon(step.title)}
                      <span className="ml-2 text-sm font-medium">{step.title}</span>
                    </div>
                    
                    <div className="text-xs font-medium">
                      {step.status === 'loading' && <span className="text-amber-600">Verificando...</span>}
                      {step.status === 'success' && <span className="text-green-600">Verificado</span>}
                      {step.status === 'error' && <span className="text-red-600">Falha</span>}
                      {step.status === 'waiting' && <span className="text-gray-400">Pendente</span>}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Results section (only show when analysis is complete) */}
              {analysisComplete && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium text-gray-800">Resultado da Análise</h3>
                    <Badge className="bg-green-100 text-green-700 border-green-200">Aprovado</Badge>
                  </div>
                  
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
                    <Award className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Você tem direito ao benefício!</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Com base na nossa análise, verificamos que você cumpre todos os requisitos necessários para 
                        receber o benefício social. Clique no botão abaixo para qualificar-se e receber as instruções.
                      </p>
                    </div>
                  </div>
                  
                  {qualified ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800">Qualificação concluída!</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Sua qualificação foi processada com sucesso. Você receberá um e-mail com instruções 
                        para acessar o seu benefício nos próximos dias úteis.
                      </p>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleQualify} 
                      className="w-full gov-button mt-2"
                      disabled={qualificando}
                    >
                      {qualificando ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Processando qualificação...
                        </>
                      ) : (
                        <>
                          Qualificar-se para o Benefício
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Additional information (FAQ, etc.) */}
        <div className="glass-card rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Perguntas Frequentes</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm">Como funciona o processo de qualificação?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  O processo de qualificação é simples. Após a análise dos seus dados, se você for elegível, 
                  basta clicar no botão "Qualificar-se para o Benefício". O sistema então processará sua solicitação 
                  e enviará um e-mail com instruções para acesso ao benefício.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-sm">Quanto tempo leva para receber o benefício?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  Após a qualificação, o processamento do benefício geralmente leva de 3 a 5 dias úteis. Você receberá 
                  um e-mail com todas as instruções para acesso aos valores concedidos.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-sm">Quais documentos são necessários para receber o benefício?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  Para receber o benefício, você precisará ter um documento de identidade válido (RG ou CNH) e uma conta bancária em seu nome. 
                  Esses documentos serão solicitados nas etapas seguintes do processo.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </PageLayout>
  );
};

export default UserData;
