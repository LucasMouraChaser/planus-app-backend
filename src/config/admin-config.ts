// src/config/admin-config.ts
import type { UserType } from '@/types/user';
import type { WithdrawalStatus, PixKeyType } from '@/types/wallet';

export const USER_TYPES: UserType[] = ['admin', 'vendedor', 'cliente'];

export const WITHDRAWAL_STATUSES_ADMIN: WithdrawalStatus[] = ['pendente', 'processando', 'concluido', 'falhou'];

export const PIX_KEY_TYPES_ADMIN: PixKeyType[] = ['CPF/CNPJ', 'Celular', 'Email', 'Aleatória'];
