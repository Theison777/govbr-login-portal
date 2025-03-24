
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle, CreditCard, User, Banknote, Calendar, FileText, Clock } from "lucide-react";
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Payment: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
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
    toast.info("Iniciando processo de pagamento da multa e liberação do Abono Salarial.");
    // Here you would implement the actual payment processing
    // For now, we'll just show a success message
    setTimeout(() => {
      toast.success("Pagamento processado com sucesso. Seu Abono Salarial será liberado em até 24 horas.");
    }, 2000);
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
            onClick={handleBackToVerification} 
            className="text-gray-500 hover:text-gray-700 hover:bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="glass-card rounded-xl p-6 animate-fade-in mt-2">
          <h2 className="font-heading text-xl font-semibold text-govblue-700 mb-4 text-center">
            Revisão de Dados para Regularização
          </h2>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <User className="h-5 w-5 text-govblue-600 mr-2" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gray-500">Nome Completo</span>
                    <p className="font-medium">{userData.nome}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">CPF</span>
                    <p className="font-medium">{formatCPF(userData.cpf)}</p>
                  </div>
                  {userData.data_nascimento && (
                    <div>
                      <span className="text-xs text-gray-500">Data de Nascimento</span>
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
              </div>
            </CardContent>
          </Card>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-4 bg-govblue-50">
              <h3 className="font-medium text-govblue-700 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Detalhes da Regularização
              </h3>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[250px]">Item</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Valor do Abono Salarial</TableCell>
                  <TableCell className="text-green-600 font-medium">R$ 1.518,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Valor proporcional</TableCell>
                  <TableCell>1 Salário mínimo</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Impedimento</TableCell>
                  <TableCell className="text-red-600">O empregador não enviou a declaração RAIS/eSocial</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Razão da Multa</TableCell>
                  <TableCell>
                    Não cumprimento da obrigação de informar dados do trabalhador na RAIS ou eSocial
                  </TableCell>
                </TableRow>
                <TableRow className="bg-amber-50">
                  <TableCell className="font-medium">Multa Base</TableCell>
                  <TableCell>R$ 63,21</TableCell>
                </TableRow>
                <TableRow className="bg-amber-50">
                  <TableCell className="font-medium">Acréscimo por atraso</TableCell>
                  <TableCell>R$ 26,40 (4 trimestres x R$ 6,60)</TableCell>
                </TableRow>
                <TableRow className="bg-amber-50 font-bold">
                  <TableCell className="font-medium text-red-700">Total da Multa</TableCell>
                  <TableCell className="text-red-700 font-bold">R$ 89,61</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-xs text-gray-500">
                    Após o pagamento da multa, o valor de R$ 1.518,00 será liberado em até 24 horas.
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-md mb-6">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-amber-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Para evitar o bloqueio do seu CPF e a suspensão de suas chaves PIX, recomendamos que 
                faça a regularização o mais rápido possível. Este pagamento está relacionado apenas 
                à regularização do impedimento e não configura multa fiscal.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              className="gov-button bg-govblue-600 hover:bg-govblue-500 rounded-full px-6 py-4 text-base w-full max-w-md"
              onClick={handleProceedToPayment}
            >
              <CreditCard className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="font-medium">Pagar Multa e Liberar Abono Salarial</span>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Payment;
