import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Copy, QrCode, Clock, AlertTriangle } from "lucide-react";
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { generatePixPayment, checkPixPaymentStatus, isApiAvailable } from '@/services/uPayService';

const QR_CODE_IMAGE_URL = "https://i.postimg.cc/d1rxxRkk/imagem-2025-03-26-105609411.png";

const PixPayment: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutos em segundos
  const [copied, setCopied] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pixData, setPixData] = useState<{
    id: string;
    pixCode: string;
    qrCodeImage: string;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('PENDING');
  const [apiConnectionError, setApiConnectionError] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (location.state && location.state.userData) {
      setUserData(location.state.userData);
      checkApiAndGeneratePayment(location.state.userData);
    } else {
      toast.error("Nenhum dado encontrado. Por favor, faça a consulta novamente.");
      navigate('/');
    }
  }, [location.state, navigate]);

  const checkApiAndGeneratePayment = async (userData: any) => {
    setIsLoading(true);
    try {
      const apiAvailable = await isApiAvailable();
      if (!apiAvailable) {
        setApiConnectionError(true);
        toast.error("Não foi possível conectar ao serviço de pagamento. Verifique sua conexão e tente novamente.");
        setIsLoading(false);
        return;
      }
      
      generatePayment(userData);
    } catch (error) {
      console.error("Erro ao verificar disponibilidade da API:", error);
      setApiConnectionError(true);
      setIsLoading(false);
    }
  };

  const generatePayment = async (userData: any) => {
    setIsLoading(true);
    try {
      const paymentData = {
        valor: 89.61, // Valor da multa
        descricao: `Pagamento de multa - CPF: ${userData.cpf}`,
        clienteNome: userData.nome,
        clienteCpf: userData.cpf.replace(/\D/g, ''), // Remove caracteres não numéricos
        expiracao: 10 // 10 minutos
      };

      const response = await generatePixPayment(paymentData);
      
      setPixData({
        id: response.id,
        pixCode: response.pixCopiaECola,
        qrCodeImage: response.qrCodeBase64,
      });
      
      const statusCheckInterval = startStatusCheck(response.id);
      
      return () => clearInterval(statusCheckInterval);
    } catch (error) {
      console.error('Erro ao gerar pagamento:', error);
      toast.error('Falha ao gerar código PIX. Por favor, tente novamente em alguns instantes.');
      setApiConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPayment = () => {
    if (!userData) return;
    setApiConnectionError(false);
    checkApiAndGeneratePayment(userData);
  };

  const startStatusCheck = (paymentId: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await checkPixPaymentStatus(paymentId);
        setPaymentStatus(status);
        
        if (status === 'PAID') {
          clearInterval(interval);
          toast.success('Pagamento confirmado! Seu abono será liberado em até 24 horas.');
        } else if (status === 'EXPIRED' || status === 'CANCELED') {
          clearInterval(interval);
          toast.error('O pagamento expirou ou foi cancelado. Por favor, tente novamente.');
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error);
      }
    }, 10000);

    return interval;
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error("O tempo para pagamento expirou. Por favor, gere um novo código.");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleCopyPixCode = () => {
    if (!pixData) return;
    
    navigator.clipboard.writeText(pixData.pixCode).then(() => {
      setCopied(true);
      toast.success("Código PIX copiado para a área de transferência");
      setTimeout(() => setCopied(false), 3000);
    }).catch((err) => {
      console.error("Erro ao copiar: ", err);
      toast.error("Não foi possível copiar o código PIX");
    });
  };

  const handleBackToPayment = () => {
    navigate('/payment', { state: { userData } });
  };

  const timeProgress = (timeLeft / 600) * 100;

  return (
    <PageLayout>
      <div className="container mx-auto p-0 pb-4 relative max-w-3xl">
        <div className="absolute top-0 left-0 mt-2 ml-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackToPayment} 
            className="text-gray-500 hover:text-gray-700 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="glass-card rounded-lg p-4 animate-fade-in mt-2 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-govblue-700 mb-3 text-center">
            Pagamento via PIX
          </h2>

          <Card className="mb-4 shadow-sm">
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-sm flex items-center">
                <Clock className="h-4 w-4 text-amber-600 mr-2" />
                Tempo Restante para Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-mono font-bold">{formatTimeLeft()}</span>
                <span className="text-xs text-gray-500">10:00</span>
              </div>
              <Progress 
                value={timeProgress} 
                className="h-2 w-full" 
                style={{"--progress-background": timeLeft > 180 ? "var(--govblue-600)" : "var(--amber-500)"} as React.CSSProperties}
              />
            </CardContent>
          </Card>

          {apiConnectionError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro de Conexão</AlertTitle>
              <AlertDescription>
                Não foi possível conectar ao serviço de pagamento PIX.
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={handleRetryPayment}
                >
                  Tentar Novamente
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!apiConnectionError && (
            <Card className="mb-4 shadow-sm">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-sm flex items-center">
                  <QrCode className="h-4 w-4 text-govblue-600 mr-2" />
                  QR Code PIX
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 flex flex-col items-center">
                {isLoading ? (
                  <div className="w-52 h-52 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-govblue-600"></div>
                  </div>
                ) : (
                  <img 
                    src={QR_CODE_IMAGE_URL}
                    alt="QR Code PIX" 
                    className="w-52 h-52"
                  />
                )}
                <p className="text-xs text-center text-gray-500 mt-2">
                  Escaneie o QR Code com o aplicativo do seu banco
                </p>
              </CardContent>
            </Card>
          )}

          {!apiConnectionError && (
            <Card className="mb-4 shadow-sm">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-sm flex items-center">
                  <Copy className="h-4 w-4 text-govblue-600 mr-2" />
                  Código PIX Copia e Cola
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="relative">
                  <div className="p-2 bg-gray-50 rounded border border-gray-200 overflow-hidden">
                    <p className="text-xs font-mono text-gray-700 truncate">
                      {isLoading ? 'Carregando...' : pixData?.pixCode || 'Código PIX não disponível'}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 py-0 px-2"
                    onClick={handleCopyPixCode}
                    disabled={isLoading || !pixData}
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="text-xs ml-1">{copied ? "Copiado" : "Copiar"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentStatus && !apiConnectionError && (
            <Card className="mb-4 shadow-sm">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-sm flex items-center">
                  <Clock className="h-4 w-4 text-govblue-600 mr-2" />
                  Status do Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className={`p-2 rounded text-center font-medium ${
                  paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 
                  paymentStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {paymentStatus === 'PAID' ? 'Pagamento Confirmado!' : 
                   paymentStatus === 'PENDING' ? 'Aguardando Pagamento' : 
                   'Pagamento Expirado ou Cancelado'}
                </div>
              </CardContent>
            </Card>
          )}

          <Alert variant="destructive" className="mb-4 py-2 px-3 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-xs font-semibold text-red-700 ml-2">
              Valor da multa: R$ 89,61
            </AlertTitle>
            <AlertDescription className="text-xs text-red-700 ml-2">
              Faça o pagamento em até {formatTimeLeft()} para evitar o bloqueio do seu CPF.
            </AlertDescription>
          </Alert>

          <div className="p-2 bg-amber-50 border-l-4 border-amber-500 rounded-r-md mb-4 text-xs">
            <p className="text-amber-800">
              Após a confirmação do pagamento, seu Abono Salarial no valor de 
              <span className="font-semibold"> R$ 1.518,00</span> será liberado em até 24 horas.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PixPayment;
