
import type { Timestamp } from 'firebase/firestore';

export type PixKeyType = 'CPF/CNPJ' | 'Celular' | 'Email' | 'Aleatória';
export const PIX_KEY_TYPES: PixKeyType[] = ['CPF/CNPJ', 'Celular', 'Email', 'Aleatória'];

export type WithdrawalStatus = 'pendente' | 'processando' | 'concluido' | 'falhou';
export const WITHDRAWAL_STATUSES: WithdrawalStatus[] = ['pendente', 'processando', 'concluido', 'falhou'];

export type WithdrawalType = 'personal' | 'mlm';
export const WITHDRAWAL_TYPES: WithdrawalType[] = ['personal', 'mlm'];

export type CommissionType = 'personal_sale' | 'mlm_level_1' | 'mlm_level_2' | 'mlm_level_3' | string; // string for future MLM levels

export interface CommissionRecord {
  id: string;
  userId: string; // UID do usuário que recebeu a comissão
  type: CommissionType;
  amount: number; // Valor da comissão
  sourceLeadId?: string; // ID do lead no CRM que gerou a comissão de venda pessoal
  sourceSaleUserId?: string; // UID do usuário na downline que gerou a comissão MLM
  description: string; // Ex: "Comissão venda lead X", "Comissão Nível 1 venda Y por Z"
  createdAt: Timestamp | string; // Timestamp for Firestore, string for client
  isPaidOut: boolean; // Default: false. Marcado como true quando o valor correspondente é sacado/processado
  withdrawalRequestId?: string; // ID da solicitação de saque que incluiu esta comissão, se aplicável
}

export interface WithdrawalRequestData {
  userId: string;
  userEmail: string;
  userName?: string;
  amount: number;
  pixKeyType: PixKeyType;
  pixKey: string;
  status: WithdrawalStatus;
  requestedAt: Timestamp | string; // Timestamp for Firestore, string for client
  processedAt?: Timestamp | string; // Timestamp for Firestore, string for client
  adminNotes?: string;
  withdrawalType: WithdrawalType;
}

export interface WithdrawalRequestWithId extends WithdrawalRequestData {
  id: string;
}
