"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sendBulkWhatsappMessages, type SendBulkWhatsappMessagesOutput, type SendingConfiguration, type OutboundLead } from '@/ai/flows/send-bulk-whatsapp-messages-flow';
import type { LeadWithId } from '@/types/crm';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, ListFilter, PlayCircle, BarChart2, CheckCircle, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FormDescription } from '@/components/ui/form';

export default function DisparosPage() {
  const { fetchAllCrmLeadsGlobally } = useAuth();
  const { toast } = useToast();

  const [leads, setLeads] = useState<OutboundLead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [messageTemplate, setMessageTemplate] = useState("Olá, {{nome_do_cliente}}! Temos uma oferta especial de economia de energia para você. Gostaria de saber mais?");
  const [sendingConfig, setSendingConfig] = useState<SendingConfiguration>({
    sendPerChip: 25,
    sendInterval: 10,
    randomDelay: 5,
    restAfterRound: "30-60",
    numberOfSimultaneousWhatsapps: 4,
  });

  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [simulationResult, setSimulationResult] = useState<SendBulkWhatsappMessagesOutput | null>(null);

  const loadLeads = async () => {
    setIsLoadingLeads(true);
    setSimulationResult(null);
    try {
      const allLeads = await fetchAllCrmLeadsGlobally();
      const validLeads = allLeads
        .filter(lead => lead.phone && lead.phone.trim() !== '')
        .map((lead: LeadWithId): OutboundLead => ({
          id: lead.id,
          name: lead.name,
          phone: lead.phone || 'N/A',
          consumption: lead.kwh,
          company: lead.company,
        }));
      setLeads(validLeads);
    } catch (error) {
      console.error("Failed to load leads:", error);
      toast({
        title: "Erro ao Carregar Leads",
        description: "Não foi possível buscar os leads do CRM. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const handleSelectLead = (leadId: string) => {
    const newSelection = new Set(selectedLeads);
    if (newSelection.has(leadId)) {
      newSelection.delete(leadId);
    } else {
      newSelection.add(leadId);
    }
    setSelectedLeads(newSelection);
  };

  const handleSelectAllLeads = (checked: boolean) => {
    if (checked) {
      const allLeadIds = new Set(leads.map(lead => lead.id));
      setSelectedLeads(allLeadIds);
    } else {
      setSelectedLeads(new Set());
    }
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSendingConfig(prev => ({
      ...prev,
      [name]: name === 'restAfterRound' ? value : Number(value),
    }));
  };

  const handleStartSimulation = async () => {
    if (selectedLeads.size === 0 || !messageTemplate) {
      toast({
        title: "Dados Incompletos",
        description: "Selecione ao menos um lead e preencha o modelo da mensagem.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setProgress(0);
    setSimulationResult(null);
    setStatusText("Iniciando simulação...");

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 10 : 90));
    }, 200);

    const leadsToSend = leads.filter(lead => selectedLeads.has(lead.id));
    setStatusText(`Preparando para enviar para ${leadsToSend.length} contatos...`);

    try {
      const result = await sendBulkWhatsappMessages({
        leads: leadsToSend,
        messageTemplate,
        configuration: sendingConfig,
      });
      setSimulationResult(result);
      toast({
        title: "Simulação Concluída",
        description: result.message,
      });
    } catch (error) {
      console.error("Simulation failed:", error);
      toast({
        title: "Erro na Simulação",
        description: "Ocorreu um erro ao executar a simulação.",
        variant: "destructive",
      });
      setSimulationResult({ success: false, message: "A simulação falhou.", sentCount: 0 });
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsSending(false);
      setStatusText("Simulação finalizada.");
    }
  };

  const previewMessage = useMemo(() => {
    if (selectedLeads.size === 0) {
      return messageTemplate.replace(/{{nome_do_cliente}}/g, "[Nome do Cliente]");
    }
    const firstSelectedId = Array.from(selectedLeads)[0];
    const firstLead = leads.find(l => l.id === firstSelectedId);
    return messageTemplate.replace(/{{nome_do_cliente}}/g, `**${firstLead?.name || '[Nome do Cliente]'}**`);
  }, [messageTemplate, selectedLeads, leads]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary">Simulador de Disparos em Massa</h1>
        <p className="text-muted-foreground mt-2">Configure e simule o envio de mensagens para seus leads.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Seleção de Leads</CardTitle>
              <CardDescription>Carregue e selecione os leads do CRM para o disparo.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={loadLeads} disabled={isLoadingLeads}>
                {isLoadingLeads && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Carregar Leads do CRM
              </Button>
              {leads.length > 0 && <p className="text-sm text-muted-foreground mt-2">{selectedLeads.size} de {leads.length} leads selecionados.</p>}
            </CardContent>
            <CardContent>
              <ScrollArea className="h-72 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedLeads.size > 0 && selectedLeads.size === leads.length}
                          onCheckedChange={handleSelectAllLeads}
                          aria-label="Selecionar todos"
                        />
                      </TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingLeads ? (
                      <TableRow><TableCell colSpan={3} className="h-24 text-center">Carregando...</TableCell></TableRow>
                    ) : leads.length > 0 ? (
                      leads.map(lead => (
                        <TableRow key={lead.id} data-state={selectedLeads.has(lead.id) && "selected"}>
                          <TableCell><Checkbox checked={selectedLeads.has(lead.id)} onCheckedChange={() => handleSelectLead(lead.id)} /></TableCell>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>{lead.phone}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={3} className="h-24 text-center">Nenhum lead carregado.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Modelo da Mensagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Digite sua mensagem aqui..."
                value={messageTemplate}
                onChange={e => setMessageTemplate(e.target.value)}
                className="min-h-[120px]"
              />
              <FormDescription>{'Use `{{nome_do_cliente}}` para personalizar a mensagem.'}</FormDescription>
              <Card className="p-4 bg-muted/50">
                <Label className="text-xs font-semibold text-muted-foreground">Pré-visualização</Label>
                <p className="text-sm mt-1">{previewMessage}</p>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>3. Configurações de Envio</CardTitle>
              <CardDescription>Ajuste os parâmetros da simulação.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="sendPerChip">Envios por chip</Label>
                <Input id="sendPerChip" name="sendPerChip" type="number" value={sendingConfig.sendPerChip} onChange={handleConfigChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sendInterval">Intervalo (s)</Label>
                <Input id="sendInterval" name="sendInterval" type="number" value={sendingConfig.sendInterval} onChange={handleConfigChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="randomDelay">Atraso aleatório (s)</Label>
                <Input id="randomDelay" name="randomDelay" type="number" value={sendingConfig.randomDelay} onChange={handleConfigChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="restAfterRound">Descanso após rodada</Label>
                <Input id="restAfterRound" name="restAfterRound" type="text" value={sendingConfig.restAfterRound} onChange={handleConfigChange} />
              </div>
              <div className="col-span-2 space-y-1">
                <Label htmlFor="numberOfSimultaneousWhatsapps">Nº de WhatsApps simultâneos</Label>
                <Input id="numberOfSimultaneousWhatsapps" name="numberOfSimultaneousWhatsapps" type="number" value={sendingConfig.numberOfSimultaneousWhatsapps} onChange={handleConfigChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Execução e Resultados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <Button
                size="lg"
                onClick={handleStartSimulation}
                disabled={isSending || selectedLeads.size === 0 || !messageTemplate}
                className="w-full"
              >
                {isSending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <PlayCircle className="mr-2 h-5 w-5" />
                )}
                Iniciar Disparo Simulado
              </Button>
              {isSending && (
                <div className="space-y-2 pt-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">{statusText}</p>
                </div>
              )}
              {simulationResult && (
                <Card className={`mt-4 p-4 ${simulationResult.success ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}>
                  <div className="flex items-center justify-center">
                    {simulationResult.success ? <CheckCircle className="h-6 w-6 text-green-500 mr-2" /> : <AlertCircle className="h-6 w-6 text-red-500 mr-2" />}
                    <div>
                      <p className="font-semibold">{simulationResult.message}</p>
                      <p className="text-sm text-muted-foreground">Contatos processados: {simulationResult.sentCount}</p>
                    </div>
                  </div>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
