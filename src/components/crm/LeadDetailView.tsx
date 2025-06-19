
"use client";

import type { LeadWithId, ChatMessage as ChatMessageType } from '@/types/crm';
import { STAGES_CONFIG } from '@/config/crm-stages';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { DollarSign, Zap, User, CalendarDays, MessageSquare, Send, Edit, Paperclip, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
// Placeholder for actual Firebase functions
// import { fetchChatHistory, saveChatMessage, approveCrmLead, requestCrmLeadCorrection } from '@/lib/firebase/firestore';

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

interface LeadDetailViewProps {
  lead: LeadWithId;
  onClose: () => void;
  onEdit: (lead: LeadWithId) => void;
  // For admin actions - to be implemented with actual auth and roles
  isAdmin?: boolean; 
  onApprove?: (leadId: string) => Promise<void>;
  onRequestCorrection?: (leadId: string, reason: string) => Promise<void>;
}

// Mock chat messages
const MOCK_CHAT_MESSAGES: ChatMessageType[] = [
    { id: '1', text: 'Olá! Tenho interesse na proposta.', sender: 'lead', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: '2', text: 'Excelente! Qual sua média de consumo?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString() },
    { id: '3', text: 'Cerca de 500 kWh.', sender: 'lead', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
];


export function LeadDetailView({ lead, onClose, onEdit, isAdmin, onApprove, onRequestCorrection }: LeadDetailViewProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>(MOCK_CHAT_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [showCorrectionInput, setShowCorrectionInput] = useState(false);

  // useEffect(() => {
  //   const loadChat = async () => {
  //     // const history = await fetchChatHistory(lead.id);
  //     // setChatMessages(history);
  //     setChatMessages(MOCK_CHAT_MESSAGES); // Using mock for now
  //   };
  //   loadChat();
  // }, [lead.id]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    const messageData = { text: newMessage, sender: 'user' as const };
    // const savedMessage = await saveChatMessage(lead.id, messageData);
    // if (savedMessage) {
    //   setChatMessages(prev => [...prev, savedMessage]);
    // }
    const mockSavedMessage: ChatMessageType = {
        id: String(Date.now()),
        ...messageData,
        timestamp: new Date().toISOString()
    }
    setChatMessages(prev => [...prev, mockSavedMessage]);
    setNewMessage('');
  };
  
  const handleRequestCorrection = async () => {
    if (!onRequestCorrection || !correctionReason.trim()) return;
    await onRequestCorrection(lead.id, correctionReason);
    setCorrectionReason('');
    setShowCorrectionInput(false);
    // Optionally refetch lead or update UI
  };

  const stageInfo = STAGES_CONFIG.find(s => s.id === lead.stageId);

  return (
    <div className="p-0 md:p-2">
      <Card className="bg-card/80 backdrop-blur-xl border shadow-2xl">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-primary mb-1">{lead.name}</CardTitle>
            {lead.company && <CardDescription className="text-sm text-muted-foreground">{lead.company}</CardDescription>}
             {stageInfo && (
              <Badge className={`mt-2 text-xs ${stageInfo.colorClass} text-white`}>{stageInfo.title}</Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-280px)] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
              <div className="flex items-center"><DollarSign className="w-4 h-4 mr-2 text-amber-400" /><strong>Valor:</strong><span className="ml-2 text-foreground">{formatCurrency(lead.value)}</span></div>
              <div className="flex items-center"><Zap className="w-4 h-4 mr-2 text-sky-400" /><strong>Consumo:</strong><span className="ml-2 text-foreground">{lead.kwh} kWh</span></div>
              <div className="flex items-center"><User className="w-4 h-4 mr-2 text-green-400" /><strong>Vendedor:</strong><span className="ml-2 text-foreground">{lead.sellerName}</span></div>
              <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-purple-400" /><strong>Criado em:</strong><span className="ml-2 text-foreground">{format(parseISO(lead.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span></div>
              <div className="flex items-center col-span-1 md:col-span-2"><CalendarDays className="w-4 h-4 mr-2 text-purple-400" /><strong>Último Contato:</strong><span className="ml-2 text-foreground">{format(parseISO(lead.lastContact), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span></div>
              {lead.email && <div className="col-span-1 md:col-span-2"><strong>Email:</strong><span className="ml-2 text-foreground">{lead.email}</span></div>}
              {lead.phone && <div className="col-span-1 md:col-span-2"><strong>Telefone:</strong><span className="ml-2 text-foreground">{lead.phone}</span></div>}
              {lead.leadSource && <div className="col-span-1 md:col-span-2"><strong>Fonte:</strong><span className="ml-2 text-foreground">{lead.leadSource}</span></div>}
              {lead.naturality && <div className="col-span-1"><strong>Naturalidade:</strong><span className="ml-2 text-foreground">{lead.naturality}</span></div>}
              {lead.maritalStatus && <div className="col-span-1"><strong>Estado Civil:</strong><span className="ml-2 text-foreground">{lead.maritalStatus}</span></div>}
              {lead.profession && <div className="col-span-1 md:col-span-2"><strong>Profissão:</strong><span className="ml-2 text-foreground">{lead.profession}</span></div>}
              
              {lead.photoDocumentUrl && (
                <div className="col-span-1 md:col-span-2">
                  <strong>Doc. Identidade:</strong>
                  <Button variant="link" size="sm" asChild className="ml-2 p-0 h-auto"><a href={lead.photoDocumentUrl} target="_blank" rel="noopener noreferrer">Ver Documento <Paperclip className="w-3 h-3 ml-1"/></a></Button>
                </div>
              )}
              {lead.billDocumentUrl && (
                 <div className="col-span-1 md:col-span-2">
                  <strong>Fatura de Energia:</strong>
                  <Button variant="link" size="sm" asChild className="ml-2 p-0 h-auto"><a href={lead.billDocumentUrl} target="_blank" rel="noopener noreferrer">Ver Fatura <Paperclip className="w-3 h-3 ml-1"/></a></Button>
                </div>
              )}
            </div>

            {isAdmin && lead.needsAdminApproval && (
                <Card className="mb-6 border-amber-500 bg-amber-500/10">
                    <CardHeader><CardTitle className="text-amber-600 text-base flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/>Aguardando Aprovação</CardTitle></CardHeader>
                    <CardContent className="space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onApprove && onApprove(lead.id)}><CheckCircle className="w-4 h-4 mr-2"/>Aprovar Lead</Button>
                        <Button size="sm" variant="outline" onClick={() => setShowCorrectionInput(true)}>Solicitar Correção</Button>
                    </CardContent>
                </Card>
            )}
             {isAdmin && showCorrectionInput && (
                <div className="mb-6 p-4 border rounded-md bg-background">
                    <Label htmlFor="correctionReason" className="font-semibold">Motivo da Solicitação de Correção:</Label>
                    <Textarea 
                        id="correctionReason"
                        value={correctionReason} 
                        onChange={(e) => setCorrectionReason(e.target.value)}
                        placeholder="Descreva o que precisa ser corrigido..."
                        className="mt-1 mb-2"
                    />
                    <Button size="sm" onClick={handleRequestCorrection} disabled={!correctionReason.trim()}><Send className="w-4 h-4 mr-2"/>Enviar Solicitação</Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowCorrectionInput(false)} className="ml-2">Cancelar</Button>
                </div>
            )}
            {lead.correctionReason && !lead.needsAdminApproval && (
                 <Card className="mb-6 border-red-500 bg-red-500/10">
                    <CardHeader><CardTitle className="text-red-600 text-base flex items-center"><XCircle className="w-5 h-5 mr-2"/>Correção Solicitada</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-red-700">{lead.correctionReason}</p>
                    </CardContent>
                </Card>
            )}


            {/* Chat Section */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-primary"/>Histórico de Contato</h3>
              <ScrollArea className="h-48 mb-3 p-3 border rounded-md bg-background">
                {chatMessages.length === 0 && <p className="text-sm text-muted-foreground text-center">Nenhuma mensagem ainda.</p>}
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`mb-2 p-2 rounded-lg max-w-[80%] text-sm ${
                    msg.sender === 'user' ? 'bg-primary/80 text-primary-foreground ml-auto text-right' : 'bg-muted text-muted-foreground mr-auto text-left'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
                      {format(parseISO(String(msg.timestamp)), "dd/MM HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex gap-2">
                <Input 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder="Digite uma mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}><Send className="w-4 h-4 mr-0 md:mr-2"/><span className="hidden md:inline">Enviar</span></Button>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onEdit(lead)}><Edit className="w-4 h-4 mr-2"/>Editar Lead</Button>
            <Button onClick={onClose}>Fechar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}


    