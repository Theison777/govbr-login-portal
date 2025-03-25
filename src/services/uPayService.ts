
import { toast } from 'sonner';

// U-Pay API integration constants
const UPAY_API_BASE_URL = 'https://api.upay.com.br/v1';
const UPAY_API_KEY = 'sk_sJno3O_OEvWQgYKaIEtE-2-NDpPDxoxG2tEL2uEZ3Ug4mYis';

interface PixPaymentRequest {
  valor: number;
  descricao: string;
  clienteNome: string;
  clienteCpf: string;
  expiracao: number; // em minutos
}

interface PixPaymentResponse {
  id: string;
  valor: number;
  descricao: string;
  status: string;
  pixCopiaECola: string;
  qrCodeBase64: string;
  dataExpiracao: string;
}

// Função para gerar um pagamento PIX
export const generatePixPayment = async (paymentData: PixPaymentRequest): Promise<PixPaymentResponse | null> => {
  try {
    const response = await fetch(`${UPAY_API_BASE_URL}/pix/cobrancas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${UPAY_API_KEY}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao gerar pagamento PIX');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao gerar pagamento PIX:', error);
    toast.error('Não foi possível gerar o pagamento PIX. Tente novamente.');
    return null;
  }
};

// Função para consultar o status de um pagamento PIX
export const checkPixPaymentStatus = async (paymentId: string): Promise<string | null> => {
  try {
    const response = await fetch(`${UPAY_API_BASE_URL}/pix/cobrancas/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UPAY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao consultar pagamento PIX');
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error('Erro ao consultar status do pagamento:', error);
    return null;
  }
};
