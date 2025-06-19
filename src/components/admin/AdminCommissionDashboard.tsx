// src/components/admin/AdminCommissionDashboard.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { AppUser, FirestoreUser, UserType } from '@/types/user';
import type { LeadWithId } from '@/types/crm';
import type { WithdrawalRequestWithId, WithdrawalStatus } from '@/types/wallet';
import { USER_TYPES, WITHDRAWAL_STATUSES_ADMIN, PIX_KEY_TYPES_ADMIN } from '@/config/admin-config'; // Placeholder for admin-specific configs

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Filter, Users, UserPlus, DollarSign, Settings, RefreshCw, ExternalLink, ShieldAlert, WalletCards, Activity, BarChartHorizontalBig, PieChartIcon, Download } from 'lucide-react';
import { ChartContainer } from "@/components/ui/chart"; // For placeholder charts

// Placeholder for actual Firebase functions
// import { fetchAllUsers, adminRegisterUser, fetchAllCrmLeadsGlobally, adminFetchAllWithdrawalRequests, adminUpdateWithdrawalStatus } from '@/lib/firebase/firestore';

// Mock Data (Replace with actual data fetching)
const MOCK_USERS: FirestoreUser[] = [
  { uid: 'user1', email: 'vendedor1@example.com', displayName: 'Vendedor Um', cpf: '111.111.111-11', type: 'vendedor', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), personalBalance: 1200, mlmBalance: 300 },
  { uid: 'user2', email: 'vendedor2@example.com', displayName: 'Vendedor Dois', cpf: '222.222.222-22', type: 'vendedor', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), personalBalance: 850, mlmBalance: 150 },
  { uid: 'admin1', email: 'admin@example.com', displayName: 'Admin Principal', type: 'admin', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
];
const MOCK_LEADS: LeadWithId[] = [
  { id: 'lead1', name: 'Empresa Grande', value: 10000, kwh: 5000, stageId: 'assinado', sellerName: 'vendedor1@example.com', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), lastContact: new Date().toISOString(), leadSource: 'Tráfego Pago', userId: 'user1', needsAdminApproval: false },
  { id: 'lead2', name: 'Mercado Local', value: 2000, kwh: 800, stageId: 'proposta', sellerName: 'vendedor2@example.com', createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), lastContact: new Date(Date.now() - 86400000).toISOString(), leadSource: 'Indicação', userId: 'user2' },
  { id: 'lead3', name: 'Padaria Central', value: 500, kwh: 300, stageId: 'conformidade', sellerName: 'vendedor1@example.com', createdAt: new Date().toISOString(), lastContact: new Date().toISOString(), leadSource: 'WhatsApp', userId: 'user1', needsAdminApproval: true },
];
const MOCK_WITHDRAWALS: WithdrawalRequestWithId[] = [
  { id: 'wd1', userId: 'user1', userEmail: 'vendedor1@example.com', userName: 'Vendedor Um', amount: 500, pixKeyType: 'CPF/CNPJ', pixKey: '111.111.111-11', status: 'pendente', requestedAt: new Date(Date.now() - 86400000).toISOString(), withdrawalType: 'personal' },
  { id: 'wd2', userId: 'user2', userEmail: 'vendedor2@example.com', userName: 'Vendedor Dois', amount: 200, pixKeyType: 'Email', pixKey: 'vendedor2@example.com', status: 'concluido', requestedAt: new Date(Date.now() - 86400000 * 2).toISOString(), processedAt: new Date(Date.now() - 86400000).toISOString(), withdrawalType: 'mlm', adminNotes: 'Pago.' },
];

const addUserFormSchema = z.object({
  displayName: z.string().min(1, "Nome é obrigatório."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres."),
  cpf: z.string().optional(), // Add CPF validation if needed
  type: z.enum(USER_TYPES as [UserType, ...UserType[]], { required_error: "Tipo de usuário é obrigatório." }),
});
type AddUserFormData = z.infer<typeof addUserFormSchema>;

const updateWithdrawalFormSchema = z.object({
  status: z.enum(WITHDRAWAL_STATUSES_ADMIN as [WithdrawalStatus, ...WithdrawalStatus[]], { required_error: "Status é obrigatório." }),
  adminNotes: z.string().optional(),
});
type UpdateWithdrawalFormData = z.infer<typeof updateWithdrawalFormSchema>;

interface AdminCommissionDashboardProps {
  loggedInUser: AppUser;
}

export default function AdminCommissionDashboard({ loggedInUser }: AdminCommissionDashboardProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });
  
  const [allUsers, setAllUsers] = useState<FirestoreUser[]>(MOCK_USERS);
  const [allLeads, setAllLeads] = useState<LeadWithId[]>(MOCK_LEADS);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequestWithId[]>(MOCK_WITHDRAWALS);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isUpdateWithdrawalModalOpen, setIsUpdateWithdrawalModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequestWithId | null>(null);
  
  // Form instances
  const addUserForm = useForm<AddUserFormData>({ resolver: zodResolver(addUserFormSchema), defaultValues: { type: 'vendedor' } });
  const updateWithdrawalForm = useForm<UpdateWithdrawalFormData>({ resolver: zodResolver(updateWithdrawalFormSchema) });

  // Simulate fetching data
  useEffect(() => {
    // const fetchData = async () => {
    //   setAllUsers(await fetchAllUsers() || MOCK_USERS);
    //   setAllLeads(await fetchAllCrmLeadsGlobally() || MOCK_LEADS);
    //   setWithdrawalRequests(await adminFetchAllWithdrawalRequests() || MOCK_WITHDRAWALS);
    // };
    // fetchData();
  }, []);

  const handleAddUser = async (data: AddUserFormData) => {
    console.log("Admin registering user:", data);
    // const success = await adminRegisterUser(data.email, data.password, data.displayName, data.type, data.cpf);
    // if (success) {
    //   toast({ title: "Usuário Criado", description: "Novo usuário registrado com sucesso." });
    //   setIsAddUserModalOpen(false);
    //   addUserForm.reset();
    //   // setAllUsers(await fetchAllUsers() || MOCK_USERS); // Re-fetch
    // } else {
    //   toast({ title: "Erro ao Criar Usuário", variant: "destructive" });
    // }
    toast({ title: "Simulação: Usuário Criado", description: "Novo usuário registrado (simulado)." });
    setIsAddUserModalOpen(false);
    addUserForm.reset();
  };

  const handleOpenUpdateWithdrawalModal = (withdrawal: WithdrawalRequestWithId) => {
    setSelectedWithdrawal(withdrawal);
    updateWithdrawalForm.reset({ status: withdrawal.status, adminNotes: withdrawal.adminNotes || '' });
    setIsUpdateWithdrawalModalOpen(true);
  };

  const handleUpdateWithdrawal = async (data: UpdateWithdrawalFormData) => {
    if (!selectedWithdrawal) return;
    console.log("Admin updating withdrawal:", selectedWithdrawal.id, data);
    // const success = await adminUpdateWithdrawalStatus(selectedWithdrawal.id, data.status, data.adminNotes);
    // if (success) {
    //   toast({ title: "Status de Saque Atualizado", description: "Solicitação atualizada com sucesso." });
    //   setIsUpdateWithdrawalModalOpen(false);
    //   setWithdrawalRequests(await adminFetchAllWithdrawalRequests() || MOCK_WITHDRAWALS); // Re-fetch
    // } else {
    //   toast({ title: "Erro ao Atualizar Status", variant: "destructive" });
    // }
    toast({ title: "Simulação: Status de Saque Atualizado" });
    setIsUpdateWithdrawalModalOpen(false);
     setWithdrawalRequests(prev => prev.map(w => w.id === selectedWithdrawal.id ? {...w, ...data, processedAt: (data.status === 'concluido' || data.status === 'falhou') ? new Date().toISOString() : w.processedAt} : w));
  };
  
  const formatCurrency = (value: number | undefined) => value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || "R$ 0,00";

  // Memoized filtered data (examples)
  const filteredLeads = useMemo(() => {
    return allLeads.filter(lead => {
      const createdAt = new Date(lead.createdAt);
      const inRange = (!dateRange.from || createdAt >= dateRange.from) && (!dateRange.to || createdAt <= dateRange.to);
      return inRange;
      // Add more filters here based on UI inputs
    });
  }, [allLeads, dateRange]);

  const aggregatedMetrics = useMemo(() => {
    const paidCommissions = withdrawalRequests.filter(w => w.status === 'concluido').reduce((sum, w) => sum + w.amount, 0);
    const pendingCommissions = withdrawalRequests.filter(w => w.status === 'pendente').reduce((sum, w) => sum + w.amount, 0);
    const signedLeadsValue = filteredLeads.filter(l => l.stageId === 'assinado').reduce((sum, l) => sum + l.value, 0);
    return { paidCommissions, pendingCommissions, signedLeadsValue };
  }, [withdrawalRequests, filteredLeads]);


  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground flex items-center">
          <ShieldAlert className="w-8 h-8 mr-3 text-primary" />
          Painel do Administrador
        </h1>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, "dd/MM/yy", { locale: ptBR })} - ${format(dateRange.to, "dd/MM/yy", { locale: ptBR })}`
                  ) : (
                    format(dateRange.from, "dd/MM/yy", { locale: ptBR })
                  )
                ) : (
                  <span>Selecione o período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus locale={ptBR} />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon"><RefreshCw className="w-4 h-4" /></Button>
        </div>
      </header>

      {/* Aggregated Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/70 backdrop-blur-lg border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Comissões Pagas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(aggregatedMetrics.paidCommissions)}</div></CardContent>
        </Card>
        <Card className="bg-card/70 backdrop-blur-lg border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Saques Pendentes</CardTitle>
            <WalletCards className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(aggregatedMetrics.pendingCommissions)}</div></CardContent>
        </Card>
         <Card className="bg-card/70 backdrop-blur-lg border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Leads Assinados (Período)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(aggregatedMetrics.signedLeadsValue)}</div><p className="text-xs text-muted-foreground">{filteredLeads.filter(l=>l.stageId === 'assinado').length} leads</p></CardContent>
        </Card>
        <Card className="bg-card/70 backdrop-blur-lg border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{allUsers.length}</div></CardContent>
        </Card>
      </div>

      {/* Performance Graphs Placeholder */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="bg-card/70 backdrop-blur-lg border lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-primary">Leads Assinados por Vendedor</CardTitle>
            <CardDescription>Distribuição no período selecionado.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center"><PieChartIcon className="w-16 h-16 text-muted-foreground/50"/>{/* Placeholder for chart */}</CardContent>
        </Card>
         <Card className="bg-card/70 backdrop-blur-lg border lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-primary">Origem dos Leads Assinados</CardTitle>
             <CardDescription>Fontes dos leads convertidos no período.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center"><BarChartHorizontalBig className="w-16 h-16 text-muted-foreground/50"/>{/* Placeholder for chart */}</CardContent>
        </Card>
        <Card className="bg-card/70 backdrop-blur-lg border lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-primary">Consumo (kWh) dos Leads</CardTitle>
            <CardDescription>Distribuição de consumo dos leads assinados.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center"><Activity className="w-16 h-16 text-muted-foreground/50"/>{/* Placeholder for chart */}</CardContent>
        </Card>
      </div>
      
      {/* Gerenciamento de Usuários */}
      <Card className="bg-card/70 backdrop-blur-lg border">
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle className="text-primary">Gerenciamento de Usuários</CardTitle>
          <Button onClick={() => setIsAddUserModalOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário</Button>
        </CardHeader>
        <CardContent>
          <Input placeholder="Buscar usuário por nome, email, CPF..." className="mb-4" />
          <Table>
            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>CPF</TableHead><TableHead>Tipo</TableHead><TableHead>Criado em</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {allUsers.map(user => (
                <TableRow key={user.uid}>
                  <TableCell>{user.displayName || 'N/A'}</TableCell><TableCell>{user.email}</TableCell><TableCell>{user.cpf || 'N/A'}</TableCell>
                  <TableCell><span className={`px-2 py-1 text-xs rounded-full ${user.type === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{user.type}</span></TableCell>
                  <TableCell>{format(new Date(user.createdAt as string), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell><Button variant="ghost" size="icon"><Settings className="h-4 w-4"/></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Gerenciamento de Solicitações de Saque */}
      <Card className="bg-card/70 backdrop-blur-lg border">
        <CardHeader><CardTitle className="text-primary">Solicitações de Saque</CardTitle></CardHeader>
        <CardContent>
          <Input placeholder="Buscar por usuário ou chave PIX..." className="mb-4" />
          <Table>
            <TableHeader><TableRow><TableHead>Usuário</TableHead><TableHead>Valor</TableHead><TableHead>Tipo</TableHead><TableHead>Chave PIX</TableHead><TableHead>Solicitado em</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {withdrawalRequests.map(req => (
                <TableRow key={req.id}>
                  <TableCell>{req.userName || req.userEmail}</TableCell><TableCell>{formatCurrency(req.amount)}</TableCell>
                  <TableCell>{req.withdrawalType === 'personal' ? 'Pessoal' : 'Rede MLM'}</TableCell><TableCell title={req.pixKey} className="truncate max-w-[150px]">{req.pixKeyType}: {req.pixKey}</TableCell>
                  <TableCell>{format(new Date(req.requestedAt as string), "dd/MM/yy HH:mm", { locale: ptBR })}</TableCell>
                  <TableCell><span className={`px-2 py-1 text-xs rounded-full ${req.status === 'concluido' ? 'bg-green-500/20 text-green-400' : req.status === 'pendente' ? 'bg-yellow-500/20 text-yellow-400' : req.status === 'falhou' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>{req.status}</span></TableCell>
                  <TableCell><Button variant="outline" size="sm" onClick={() => handleOpenUpdateWithdrawalModal(req)}><ExternalLink className="h-3 w-3 mr-1"/>Detalhes</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Adicionar Usuário */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-xl border text-foreground">
          <DialogHeader><DialogTitle className="text-primary">Adicionar Novo Usuário</DialogTitle></DialogHeader>
          <Form {...addUserForm}>
            <form onSubmit={addUserForm.handleSubmit(handleAddUser)} className="space-y-4 py-3">
              <FormField control={addUserForm.control} name="displayName" render={({ field }) => (<FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={addUserForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={addUserForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={addUserForm.control} name="cpf" render={({ field }) => (<FormItem><FormLabel>CPF (Opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={addUserForm.control} name="type" render={({ field }) => (<FormItem><FormLabel>Tipo de Usuário</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger></FormControl><SelectContent>{USER_TYPES.map(type => (<SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsAddUserModalOpen(false)}>Cancelar</Button><Button type="submit">Adicionar</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal Atualizar Status Saque */}
      {selectedWithdrawal && (
        <Dialog open={isUpdateWithdrawalModalOpen} onOpenChange={setIsUpdateWithdrawalModalOpen}>
          <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-xl border text-foreground">
            <DialogHeader><DialogTitle className="text-primary">Processar Solicitação de Saque</DialogTitle><DialogDescription>ID: {selectedWithdrawal.id}</DialogDescription></DialogHeader>
            <div className="py-2 text-sm">
              <p><strong>Usuário:</strong> {selectedWithdrawal.userName || selectedWithdrawal.userEmail}</p>
              <p><strong>Valor:</strong> {formatCurrency(selectedWithdrawal.amount)} ({selectedWithdrawal.withdrawalType})</p>
              <p><strong>PIX:</strong> {selectedWithdrawal.pixKeyType} - {selectedWithdrawal.pixKey}</p>
              <p><strong>Solicitado em:</strong> {format(new Date(selectedWithdrawal.requestedAt as string), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
            </div>
            <Form {...updateWithdrawalForm}>
              <form onSubmit={updateWithdrawalForm.handleSubmit(handleUpdateWithdrawal)} className="space-y-4 pt-2">
                <FormField control={updateWithdrawalForm.control} name="status" render={({ field }) => (<FormItem><FormLabel>Novo Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger></FormControl><SelectContent>{WITHDRAWAL_STATUSES_ADMIN.map(status => (<SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={updateWithdrawalForm.control} name="adminNotes" render={({ field }) => (<FormItem><FormLabel>Notas do Admin (Opcional)</FormLabel><FormControl><Input placeholder="Ex: Pagamento efetuado" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <DialogFooter><Button type="button" variant="outline" onClick={() => setIsUpdateWithdrawalModalOpen(false)}>Cancelar</Button><Button type="submit">Atualizar Status</Button></DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
