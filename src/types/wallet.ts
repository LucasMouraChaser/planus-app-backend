
import type { Timestamp } from 'firebase/firestore';

export type PixKeyType = 'CPF/CNPJ' | 'Celular' | 'Email' | 'Aleatória';
export const PIX_KEY_TYPES: PixKeyType[] = ['CPF/CNPJ', 'Celular', 'Email', 'Aleatória'];

export type WithdrawalStatus = 'pendente' | 'processando' | 'concluido' | 'falhou';
export const WITHDRAWAL_STATUSES: WithdrawalStatus[] = ['pendente', 'processando', 'concluido', 'falhou'];

export type WithdrawalType = 'personal' | 'mlm';
export const WITHDRAWAL_TYPES: WithdrawalType[] = ['personal', 'mlm'];

export interface CommissionRecord {
  id: string;
  userId: string;
  type: 'personal_sale' | 'mlm_level_1' | 'mlm_level_2' | string; // string for future MLM levels
  amount: number;
  sourceLeadId?: string;
  sourceSaleUserId?: string;
  description: string;
  createdAt: Timestamp | string; // Timestamp for Firestore, string for client
  isPaidOut: boolean;
  withdrawalRequestId?: string;
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
