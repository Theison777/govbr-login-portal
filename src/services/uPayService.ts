
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
export const generatePixPayment = async (paymentData: PixPaymentRequest): Promise<PixPaymentResponse> => {
  console.log('Gerando pagamento PIX com dados:', paymentData);
  
  const response = await fetch(`${UPAY_API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${UPAY_API_KEY}`,
      'Accept': 'application/json',
      'Origin': window.location.origin,
    },
    body: JSON.stringify(paymentData),
    mode: 'cors',
    credentials: 'omit'
  });

  if (!response.ok) {
    const errorMessage = await handleApiError(response);
    console.error('Erro na resposta do servidor:', response.status, errorMessage);
    throw new Error(`Erro ao gerar pagamento PIX: ${errorMessage}`);
  }

  const data = await response.json();
  console.log('Pagamento PIX gerado com sucesso:', data);
  return data;
};

// Função para consultar o status de um pagamento PIX
export const checkPixPaymentStatus = async (paymentId: string): Promise<string> => {
  console.log('Verificando status do pagamento:', paymentId);
  
  const response = await fetch(`${UPAY_API_BASE_URL}/transactions/${paymentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${UPAY_API_KEY}`,
      'Accept': 'application/json',
      'Origin': window.location.origin,
    },
    mode: 'cors',
    credentials: 'omit'
  });

  if (!response.ok) {
    const errorMessage = await handleApiError(response);
    console.error('Erro na verificação de status:', response.status, errorMessage);
    throw new Error(`Erro ao verificar status do pagamento: ${errorMessage}`);
  }

  const data = await response.json();
  console.log('Status do pagamento atualizado:', data.status);
  return data.status;
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
      credentials: 'omit'
    });
    
    return response.ok;
  } catch (error) {
    console.error('API indisponível:', error);
    return false;
  }
};
