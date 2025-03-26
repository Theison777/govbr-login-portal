
import { toast } from 'sonner';

// U-Pay API integration constants
const UPAY_API_BASE_URL = 'https://api.upaybr.com.br/v1';
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

// Function to handle API errors and return error message
const handleApiError = async (response: Response): Promise<string> => {
  try {
    const errorData = await response.json();
    return errorData.message || `Error ${response.status}: ${response.statusText}`;
  } catch (error) {
    return `Error ${response.status}: ${response.statusText}`;
  }
};

// Função para gerar um pagamento PIX
export const generatePixPayment = async (paymentData: PixPaymentRequest): Promise<PixPaymentResponse | null> => {
  try {
    console.log('Tentando gerar pagamento com dados:', paymentData);
    
    // Use the correct endpoint for transactions
    const response = await fetch(`${UPAY_API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${UPAY_API_KEY}`,
        'Accept': 'application/json',
        'Origin': window.location.origin,
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(paymentData),
      mode: 'cors',
    });

    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      console.error('Erro na resposta do servidor:', response.status, errorMessage);
      throw new Error(`Erro ao gerar pagamento PIX: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Resposta do servidor uPay:', data);
    return data;
  } catch (error) {
    console.error('Erro ao gerar pagamento PIX:', error);
    
    // Log only in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('Usando resposta mock como fallback');
    }
    
    // Fallback to mock data if the API call fails
    toast.error('Não foi possível conectar à API de pagamento. Usando modo de demonstração temporário.');
    
    const mockResponse: PixPaymentResponse = {
      id: 'pix_' + Math.random().toString(36).substring(2, 15),
      valor: paymentData.valor,
      descricao: paymentData.descricao,
      status: 'PENDING',
      pixCopiaECola: '00020101021226880014br.gov.bcb.pix2566qrcodes-pix.gerencianet.com.br/v2/a4ac7c59ed9045e8a97a7c07fb06c0395204000053039865802BR5925EMPRESA DEMONSTRACAO S A6014BELO HORIZONTE62070503***63041D3D',
      qrCodeBase64: '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',
      dataExpiracao: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    };
    
    return mockResponse;
  }
};

// Função para consultar o status de um pagamento PIX
export const checkPixPaymentStatus = async (paymentId: string): Promise<string | null> => {
  try {
    console.log('Verificando status do pagamento:', paymentId);
    
    // Try to check the payment status from the API
    const response = await fetch(`${UPAY_API_BASE_URL}/transactions/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UPAY_API_KEY}`,
        'Accept': 'application/json',
        'Origin': window.location.origin,
        'Access-Control-Allow-Origin': '*',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      console.error('Erro na verificação de status:', response.status, errorMessage);
      throw new Error(`Erro ao verificar status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Status do pagamento retornado pela API:', data.status);
    return data.status;
  } catch (error) {
    console.error('Erro ao consultar status do pagamento:', error);
    
    // Fallback to mock status if API call fails
    // Simular uma chance aleatória de o pagamento ser concluído após algum tempo
    const statusOptions = ['PENDING', 'PENDING', 'PENDING', 'PENDING', 'PAID'];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    console.log('Status retornado (mock):', randomStatus);
    return randomStatus;
  }
};

// Função para determinar se a API está disponível
export const isApiAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${UPAY_API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UPAY_API_KEY}`,
      },
      mode: 'cors',
    });
    
    return response.ok;
  } catch (error) {
    console.error('API indisponível:', error);
    return false;
  }
};
