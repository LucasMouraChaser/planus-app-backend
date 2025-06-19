// src/components/admin/AdminCommissionDashboard.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { AppUser, FirestoreUser, UserType } from '@/types/user';
import type { LeadWithId } from '@/types/crm';
import type { WithdrawalRequestWithId, WithdrawalStatus } from '@/types/wallet';
import { USER_TYPE_FILTER_OPTIONS, USER_TYPE_ADD_OPTIONS, WITHDRAWAL_STATUSES_ADMIN } from '@/config/admin-config';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Keep if used elsewhere, but FormLabel is preferred in forms
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
    CalendarIcon, Filter, Users, UserPlus, DollarSign, Settings, RefreshCw, 
    ExternalLink, ShieldAlert, WalletCards, Activity, BarChartHorizontalBig, PieChartIcon, 
    Loader2, Search // Added Loader2 and Search
} from 'lucide-react';
import { ChartContainer } from "@/components/ui/chart";

// Mock Data (Replace with actual data fetching)
const MOCK_USERS_DATA: FirestoreUser[] = [
  { uid: 'user1', email: 'vendedor1@example.com', displayName: 'Vendedor Um', cpf: '111.111.111-11', type: 'vendedor', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), personalBalance: 1200, mlmBalance: 300, photoURL: 'https://placehold.co/40x40.png?text=V1' },
  { uid: 'user2', email: 'vendedor2@example.com', displayName: 'Vendedor Dois', cpf: '222.222.222-22', type: 'vendedor', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), personalBalance: 850, mlmBalance: 150, photoURL: 'https://placehold.co/40x40.png?text=V2' },
  { uid: 'admin1', email: 'admin@example.com', displayName: 'Admin Principal', type: 'admin', createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), photoURL: 'https://placehold.co/40x40.png?text=AP' },
  { uid: 'user3', email: 'cliente1@example.com', displayName: 'Cliente Teste Um', cpf: '333.333.333-33', type: 'user', createdAt: new Date(Date.now() - 86400000 * 20).toISOString(), photoURL: 'https://placehold.co/40x40.png?text=C1' },
  { uid: 'user4', email: 'prospector1@example.com', displayName: 'Prospector Alfa', cpf: '444.444.444-44', type: 'prospector', createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  { uid: 'user5', email: 'novousuario@example.com', displayName: 'Pendente Config', cpf: '555.555.555-55', type: 'pending_setup', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

const MOCK_LEADS: LeadWithId[] = [
  { id: 'lead1', name: 'Empresa Grande', value: 10000, kwh: 5000, stageId: 'assinado', sellerName: 'vendedor1@example.com', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), lastContact: new Date().toISOString(), leadSource: 'Tráfego Pago', userId: 'user1', needsAdminApproval: false },
  { id: 'lead2', name: 'Mercado Local', value: 2000, kwh: 800, stageId: 'proposta', sellerName: 'vendedor2@example.com', createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), lastContact: new Date(Date.now() - 86400000).toISOString(), leadSource: 'Indicação', userId: 'user2' },
];
const MOCK_WITHDRAWALS: WithdrawalRequestWithId[] = [
  { id: 'wd1', userId: 'user1', userEmail: 'vendedor1@example.com', userName: 'Vendedor Um', amount: 500, pixKeyType: 'CPF/CNPJ', pixKey: '111.111.111-11', status: 'pendente', requestedAt: new Date(Date.now() - 86400000).toISOString(), withdrawalType: 'personal' },
  { id: 'wd2', userId: 'user2', userEmail: 'vendedor2@example.com', userName: 'Vendedor Dois', amount: 200, pixKeyType: 'Email', pixKey: 'vendedor2@example.com', status: 'concluido', requestedAt: new Date(Date.now() - 86400000 * 2).toISOString(), processedAt: new Date(Date.now() - 86400000).toISOString(), withdrawalType: 'mlm', adminNotes: 'Pago.' },
];

const addUserFormSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres."),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos.").max(14, "CPF inválido.").regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$|^\d{11}$/, "Formato de CPF inválido."),
  type: z.enum(USER_TYPE_ADD_OPTIONS.map(opt => opt.value) as [Exclude<UserType, 'pending_setup'>, ...Exclude<UserType, 'pending_setup'>[]], { required_error: "Tipo de usuário é obrigatório." }),
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
  
  const [allUsers, setAllUsers] = useState<FirestoreUser[]>([]);
  const [allLeads, setAllLeads] = useState<LeadWithId[]>(MOCK_LEADS);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequestWithId[]>(MOCK_WITHDRAWALS);

  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<UserType | 'all'>('all');

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isUpdateWithdrawalModalOpen, setIsUpdateWithdrawalModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequestWithId | null>(null);
  
  const addUserForm = useForm<AddUserFormData>({ 
    resolver: zodResolver(addUserFormSchema), 
    defaultValues: { type: 'vendedor', cpf: '', displayName: '', email: '', password: '' } 
  });
  const updateWithdrawalForm = useForm<UpdateWithdrawalFormData>({ resolver: zodResolver(updateWithdrawalFormSchema) });

  useEffect(() => {
    setIsUsersLoading(true);
    // Simulate fetching users
    setTimeout(() => {
        setAllUsers(MOCK_USERS_DATA);
        setIsUsersLoading(false);
    }, 500);
  }, []);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const searchTermLower = userSearchTerm.toLowerCase();
      const matchesSearch = 
        (user.displayName?.toLowerCase().includes(searchTermLower)) ||
        (user.email?.toLowerCase().includes(searchTermLower)) ||
        (user.cpf?.replace(/\D/g, '').includes(searchTermLower.replace(/\D/g, '')));
      const matchesType = userTypeFilter === 'all' || user.type === userTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [allUsers, userSearchTerm, userTypeFilter]);

  const handleAddUser = async (data: AddUserFormData) => {
    addUserForm.control.disabled = true; // Disable form while submitting
    console.log("Admin registering user (simulated):", data);

    // Simulate CPF/Email check
    const cpfExists = allUsers.some(user => user.cpf === data.cpf.replace(/\D/g, ''));
    const emailExists = allUsers.some(user => user.email === data.email);

    if (emailExists) {
        toast({ title: "Erro ao Criar Usuário", description: "Este email já está cadastrado.", variant: "destructive" });
        addUserForm.control.disabled = false;
        return;
    }
    if (cpfExists) {
        toast({ title: "Erro ao Criar Usuário", description: "Este CPF já está cadastrado.", variant: "destructive" });
        addUserForm.control.disabled = false;
        return;
    }

    // Simulate API call success
    setTimeout(() => {
        const newUser: FirestoreUser = {
            uid: `mock-uid-${Date.now()}`,
            email: data.email,
            displayName: data.displayName || data.email.split('@')[0],
            cpf: data.cpf.replace(/\D/g, ''),
            type: data.type,
            createdAt: new Date().toISOString(),
            photoURL: `https://placehold.co/40x40.png?text=${(data.displayName || data.email).charAt(0).toUpperCase()}`
        };
        setAllUsers(prev => [newUser, ...prev]);
        toast({ title: "Usuário Criado", description: `${data.email} registrado com sucesso (simulado).` });
        setIsAddUserModalOpen(false);
        addUserForm.reset({ type: 'vendedor', cpf: '', displayName: '', email: '', password: '' });
        addUserForm.control.disabled = false;
    }, 1000);
  };

  const handleOpenUpdateWithdrawalModal = (withdrawal: WithdrawalRequestWithId) => {
    setSelectedWithdrawal(withdrawal);
    updateWithdrawalForm.reset({ status: withdrawal.status, adminNotes: withdrawal.adminNotes || '' });
    setIsUpdateWithdrawalModalOpen(true);
  };

  const handleUpdateWithdrawal = async (data: UpdateWithdrawalFormData) => {
    if (!selectedWithdrawal) return;
    updateWithdrawalForm.control.disabled = true;
    console.log("Admin updating withdrawal (simulated):", selectedWithdrawal.id, data);
    setTimeout(() => {
        setWithdrawalRequests(prev => prev.map(w => 
            w.id === selectedWithdrawal.id 
            ? {...w, ...data, processedAt: (data.status === 'concluido' || data.status === 'falhou') ? new Date().toISOString() : w.processedAt} 
            : w
        ));
        toast({ title: "Status de Saque Atualizado", description: "Solicitação atualizada (simulado)." });
        setIsUpdateWithdrawalModalOpen(false);
        updateWithdrawalForm.control.disabled = false;
    }, 1000);
  };
  
  const formatCurrency = (value: number | undefined) => value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || "R$ 0,00";

  const filteredLeads = useMemo(() => {
    return allLeads.filter(lead => {
      const createdAt = new Date(lead.createdAt);
      const inRange = (!dateRange.from || createdAt >= dateRange.from) && (!dateRange.to || createdAt <= dateRange.to);
      return inRange;
    });
  }, [allLeads, dateRange]);

  const aggregatedMetrics = useMemo(() => {
    const paidCommissions = withdrawalRequests.filter(w => w.status === 'concluido').reduce((sum, w) => sum + w.amount, 0);
    const pendingCommissions = withdrawalRequests.filter(w => w.status === 'pendente').reduce((sum, w) => sum + w.amount, 0);
    const signedLeadsValue = filteredLeads.filter(l => l.stageId === 'assinado').reduce((sum, l) => sum + l.value, 0);
    return { paidCommissions, pendingCommissions, signedLeadsValue };
  }, [withdrawalRequests, filteredLeads]);

  const getUserTypeBadgeStyle = (type: UserType) => {
    switch (type) {
      case 'admin': return 'bg-red-500/20 text-red-400';
      case 'vendedor': return 'bg-blue-500/20 text-blue-400';
      case 'prospector': return 'bg-purple-500/20 text-purple-400';
      case 'user': return 'bg-green-500/20 text-green-400';
      case 'pending_setup': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-primary">Comissões Pagas</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(aggregatedMetrics.paidCommissions)}</div></CardContent>
        </Card>
        <Card className="bg-card/70 backdrop-blur-lg border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-primary">Saques Pendentes</CardTitle><WalletCards className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(aggregatedMetrics.pendingCommissions)}</div></CardContent>
        </Card>
         <Card className="bg-card/70 backdrop-blur-lg border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-primary">Leads Assinados (Período)</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(aggregatedMetrics.signedLeadsValue)}</div><p className="text-xs text-muted-foreground">{filteredLeads.filter(l=>l.stageId === 'assinado').length} leads</p></CardContent>
        </Card>
        <Card className="bg-card/70 backdrop-blur-lg border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-primary">Total de Usuários</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{allUsers.length}</div></CardContent>
        </Card>
      </div>

      {/* Performance Graphs Placeholder */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="bg-card/70 backdrop-blur-lg border lg:col-span-1"><CardHeader><CardTitle className="text-primary">Leads Assinados por Vendedor</CardTitle><CardDescription>Distribuição no período selecionado.</CardDescription></CardHeader><CardContent className="h-[250px] flex items-center justify-center"><PieChartIcon className="w-16 h-16 text-muted-foreground/50"/> </CardContent></Card>
        <Card className="bg-card/70 backdrop-blur-lg border lg:col-span-1"><CardHeader><CardTitle className="text-primary">Origem dos Leads Assinados</CardTitle><CardDescription>Fontes dos leads convertidos no período.</CardDescription></CardHeader><CardContent className="h-[250px] flex items-center justify-center"><BarChartHorizontalBig className="w-16 h-16 text-muted-foreground/50"/></CardContent></Card>
        <Card className="bg-card/70 backdrop-blur-lg border lg:col-span-1"><CardHeader><CardTitle className="text-primary">Consumo (kWh) dos Leads</CardTitle><CardDescription>Distribuição de consumo dos leads assinados.</CardDescription></CardHeader><CardContent className="h-[250px] flex items-center justify-center"><Activity className="w-16 h-16 text-muted-foreground/50"/></CardContent></Card>
      </div>
      
      {/* Gerenciamento de Usuários */}
      <Card className="bg-card/70 backdrop-blur-lg border">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-primary flex items-center"><Users className="mr-2 h-5 w-5" />Gerenciamento de Usuários</CardTitle>
            <CardDescription>Adicione e gerencie usuários do sistema.</CardDescription>
          </div>
          <Button onClick={() => setIsAddUserModalOpen(true)} size="sm"><UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome, email ou CPF..." 
                className="pl-8" 
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />
            </div>
            <Select value={userTypeFilter} onValueChange={(value) => setUserTypeFilter(value as UserType | 'all')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPE_FILTER_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isUsersLoading ? (
             <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Nenhum usuário encontrado com os filtros atuais.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>CPF</TableHead><TableHead>Tipo</TableHead><TableHead>Criado em</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                          <AvatarFallback>{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {user.displayName || user.email?.split('@')[0] || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.cpf ? `${user.cpf.slice(0,3)}.${user.cpf.slice(3,6)}.${user.cpf.slice(6,9)}-${user.cpf.slice(9,11)}` : 'N/A'}</TableCell>
                    <TableCell><span className={`px-2 py-1 text-xs rounded-full ${getUserTypeBadgeStyle(user.type)}`}>{USER_TYPE_FILTER_OPTIONS.find(opt => opt.value === user.type)?.label || user.type}</span></TableCell>
                    <TableCell>{user.createdAt ? format(parseISO(user.createdAt as string), "dd/MM/yyyy", { locale: ptBR }) : 'N/A'}</TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon" disabled><Settings className="h-4 w-4"/></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Gerenciamento de Solicitações de Saque */}
      <Card className="bg-card/70 backdrop-blur-lg border">
        <CardHeader><CardTitle className="text-primary">Solicitações de Saque</CardTitle></CardHeader>
        <CardContent>
          <Input placeholder="Buscar por usuário ou chave PIX..." className="mb-4" />
          <Table>
            <TableHeader><TableRow><TableHead>Usuário</TableHead><TableHead>Valor</TableHead><TableHead>Tipo</TableHead><TableHead>Chave PIX</TableHead><TableHead>Solicitado em</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {withdrawalRequests.map(req => (
                <TableRow key={req.id}>
                  <TableCell>{req.userName || req.userEmail}</TableCell><TableCell>{formatCurrency(req.amount)}</TableCell>
                  <TableCell>{req.withdrawalType === 'personal' ? 'Pessoal' : 'Rede MLM'}</TableCell><TableCell title={req.pixKey} className="truncate max-w-[150px]">{req.pixKeyType}: {req.pixKey}</TableCell>
                  <TableCell>{req.requestedAt ? format(parseISO(req.requestedAt as string), "dd/MM/yy HH:mm", { locale: ptBR }) : 'N/A'}</TableCell>
                  <TableCell><span className={`px-2 py-1 text-xs rounded-full ${req.status === 'concluido' ? 'bg-green-500/20 text-green-400' : req.status === 'pendente' ? 'bg-yellow-500/20 text-yellow-400' : req.status === 'falhou' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>{req.status}</span></TableCell>
                  <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => handleOpenUpdateWithdrawalModal(req)}><ExternalLink className="h-3 w-3 mr-1"/>Detalhes</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Adicionar Usuário */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-xl border text-foreground">
          <DialogHeader><DialogTitle className="text-primary">Adicionar Novo Usuário</DialogTitle><DialogDescription>Crie uma nova conta de usuário para o sistema.</DialogDescription></DialogHeader>
          <Form {...addUserForm}>
            <form onSubmit={addUserForm.handleSubmit(handleAddUser)} className="space-y-4 py-3">
              <FormField control={addUserForm.control} name="displayName" render={({ field }) => (<FormItem><FormLabel>Nome Completo (Opcional)</FormLabel><FormControl><Input placeholder="Ex: João da Silva" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={addUserForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email*</FormLabel><FormControl><Input type="email" placeholder="Ex: joao.silva@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={addUserForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Senha*</FormLabel><FormControl><Input type="password" placeholder="Mínimo 6 caracteres" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={addUserForm.control} name="cpf" render={({ field }) => (<FormItem><FormLabel>CPF*</FormLabel><FormControl><Input placeholder="Ex: 000.000.000-00" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={addUserForm.control} name="type" render={({ field }) => (<FormItem><FormLabel>Tipo de Usuário*</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger></FormControl><SelectContent>{USER_TYPE_ADD_OPTIONS.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsAddUserModalOpen(false); addUserForm.reset(); }} disabled={addUserForm.formState.isSubmitting}>Cancelar</Button>
                <Button type="submit" disabled={addUserForm.formState.isSubmitting}>
                  {addUserForm.formState.isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  Adicionar
                </Button>
              </DialogFooter>
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
              <p><strong>Solicitado em:</strong> {selectedWithdrawal.requestedAt ? format(parseISO(selectedWithdrawal.requestedAt as string), "dd/MM/yyyy HH:mm", { locale: ptBR }) : 'N/A'}</p>
            </div>
            <Form {...updateWithdrawalForm}>
              <form onSubmit={updateWithdrawalForm.handleSubmit(handleUpdateWithdrawal)} className="space-y-4 pt-2">
                <FormField control={updateWithdrawalForm.control} name="status" render={({ field }) => (<FormItem><FormLabel>Novo Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger></FormControl><SelectContent>{WITHDRAWAL_STATUSES_ADMIN.map(status => (<SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={updateWithdrawalForm.control} name="adminNotes" render={({ field }) => (<FormItem><FormLabel>Notas do Admin (Opcional)</FormLabel><FormControl><Input placeholder="Ex: Pagamento efetuado" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsUpdateWithdrawalModalOpen(false)} disabled={updateWithdrawalForm.formState.isSubmitting}>Cancelar</Button>
                  <Button type="submit" disabled={updateWithdrawalForm.formState.isSubmitting}>
                    {updateWithdrawalForm.formState.isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                    Atualizar Status
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
