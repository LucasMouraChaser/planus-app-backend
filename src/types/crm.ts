
import type { Timestamp } from 'firebase/firestore';

export type StageId =
  | 'contato'          // Initial contact or lead generation
  | 'fatura'           // Bill collected, under analysis
  | 'proposta'         // Proposal sent to lead
  | 'contrato'         // Contract sent, awaiting signature
  | 'conformidade'     // Contract signed, under compliance review
  | 'assinado'         // Contract signed and approved (deal won)
  | 'cancelado'        // Lead or client cancelled
  | 'perdido';         // Deal lost to competitor or other reasons

export const STAGE_IDS: StageId[] = [
  'contato',
  'fatura',
  'proposta',
  'contrato',
  'conformidade',
  'assinado',
  'cancelado',
  'perdido',
];


export type LeadSource =
  | 'Tráfego Pago'
  | 'Disparo de E-mail'
  | 'Porta a Porta (PAP)'
  | 'Indicação'
  | 'WhatsApp'
  | 'Outro';

export const LEAD_SOURCES: LeadSource[] = [
  'Tráfego Pago',
  'Disparo de E-mail',
  'Porta a Porta (PAP)',
  'Indicação',
  'WhatsApp',
  'Outro',
];

export interface LeadDocumentData {
  name: string; // Nome do lead/cliente ou razão social - Obrigatório
  company?: string; // Nome da empresa, se aplicável
  value: number; // Valor estimado do contrato/lead em R$ - Obrigatório
  kwh: number; // Consumo médio mensal em KWh - Obrigatório
  stageId: StageId; // Obrigatório
  sellerName: string; // Email ou identificador único do vendedor responsável - Obrigatório
  leadSource?: LeadSource;
  phone?: string; // Número de telefone do lead, normalizado
  email?: string; // Email do lead
  correctionReason?: string; // Texto explicando o motivo se um admin solicitou correção no lead
  needsAdminApproval?: boolean; // Default: false. true se o lead está em um estágio que requer aprovação
  photoDocumentUrl?: string; // URL do Firebase Storage para o documento de foto/identidade
  billDocumentUrl?: string; // URL do Firebase Storage para a fatura de energia
  naturality?: string; // Naturalidade do cliente
  maritalStatus?: string; // Estado civil
  profession?: string; // Profissão
  createdAt: Timestamp; // Obrigatório
  lastContact: Timestamp; // Obrigatório
  userId: string; // UID do Firebase Auth do vendedor/usuário que criou o lead - Obrigatório
}

export interface LeadWithId extends LeadDocumentData {
  id: string;
  // Timestamps are converted to ISO strings for client-side usage
  createdAt: string;
  lastContact: string;
}

export interface ChatMessage {
  id: string; // ID único para a mensagem
  text: string; // Conteúdo da mensagem
  sender: 'user' | 'lead'; // 'user' (vendedor/sistema), 'lead' (cliente)
  timestamp: Timestamp | string; // Timestamp na criação, string no cliente
}

export interface Stage {
  id: StageId;
  title: string;
  colorClass: string; // Tailwind color class for the stage header/accent
}
