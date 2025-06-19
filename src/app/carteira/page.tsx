
"use client";

import { useState, useEffect, Suspense } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Wallet, Landmark, Send, History, DollarSign, Users, Info } from 'lucide-react';

import type { WithdrawalRequestWithId, PixKeyType, WithdrawalType } from '@/types/wallet';
import { PIX_KEY_TYPES, WITHDRAWAL_TYPES } from '@/types/wallet';
import { requestWithdrawal, fetchWithdrawalHistory } from '@/lib/firebase/firestore'; // Placeholder functions

// Mock user balances (replace with actual data from auth context or user document)
const MOCK_USER_BALANCES = {
  personalBalance: 1250.75,
  mlmBalance: 875.20,
  userName: "Usuário Exemplo", // For the form
  userEmail: "usuario@exemplo.com", // For the form
  userId: "mockUserId123" // For the form
};

const withdrawalFormSchema = z.object({
  amount: z.preprocess(
    (val) => parseFloat(String(val).replace(",", ".")),
    z.number().positive("O valor deve ser positivo.")
  ),
  withdrawalType: z.enum(WITHDRAWAL_TYPES, {
    required_error: "Selecione a origem do saldo.",
  }),
  pixKeyType: z.enum(PIX_KEY_TYPES, {
    required_error: "Selecione o tipo de chave PIX.",
  }),
  pixKey: z.string().min(1, "A chave PIX é obrigatória."),
});

type WithdrawalFormData = z.infer<typeof withdrawalFormSchema>;

function WalletPageContent() {
  const { toast } = useToast();
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
  const [userBalances, setUserBalances] = useState(MOCK_USER_BALANCES); // Simulate fetching balances
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRequestWithId[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalFormSchema),
    defaultValues: {
      amount: 0,
      withdrawalType: undefined,
      pixKeyType: undefined,
      pixKey: "",
    },
  });

  useEffect(() => {
    // Simulate fetching withdrawal history
    const loadHistory = async () => {
      setIsLoadingHistory(true);
      // In a real app, get userId from auth context
      const history = await fetchWithdrawalHistory(userBalances.userId);
      setWithdrawalHistory(history);
      setIsLoadingHistory(false);
    };
    loadHistory();
  }, [userBalances.userId]);

  const onSubmitWithdrawal = async (data: WithdrawalFormData) => {
    const selectedBalance = data.withdrawalType === 'personal' ? userBalances.personalBalance : userBalances.mlmBalance;
    if (data.amount > selectedBalance) {
      form.setError("amount", {
        type: "manual",
        message: `Valor solicitado excede o saldo de ${data.withdrawalType === 'personal' ? 'Pessoal' : 'Rede MLM'} disponível.`,
      });
      return;
    }

    try {
      // In a real app, get userId, userName, userEmail from auth context
      const requestId = await requestWithdrawal(
        userBalances.userId,
        userBalances.userEmail,
        userBalances.userName,
        data.amount,
        data.pixKeyType,
        data.pixKey,
        data.withdrawalType
      );

      if (requestId) {
        toast({
          title: "Solicitação de Saque Enviada",
          description: "Sua solicitação foi registrada e será processada em breve.",
        });
        setIsWithdrawalDialogOpen(false);
        form.reset();
        // Simulate updating history (in real app, history would refetch or update via listener)
        const newEntry: WithdrawalRequestWithId = {
            id: requestId,
            userId: userBalances.userId,
            userEmail: userBalances.userEmail,
            userName: userBalances.userName,
            ...data,
            status: 'pendente',
            requestedAt: new Date().toISOString(),
        };
        setWithdrawalHistory(prev => [newEntry, ...prev]);

        // Note: Do NOT deduct balance from local state here.
        // The actual balance deduction should happen on the backend when the admin marks it 'concluido'.
        // The UI should reflect the "real" balance from Firestore. For this mock, balances remain unchanged.

      } else {
        toast({
          title: "Erro na Solicitação",
          description: "Não foi possível registrar sua solicitação. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao solicitar saque:", error);
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro. Por favor, contate o suporte.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "R$ 0,00";
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusBadgeVariant = (status: WithdrawalStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'concluido': return 'default'; // Green (primary theme)
      case 'processando': return 'secondary'; // Yellowish/Grayish
      case 'pendente': return 'outline'; // Blueish/Grayish
      case 'falhou': return 'destructive'; // Red
      default: return 'secondary';
    }
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-56px)] overflow-y-auto p-4 md:p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground flex items-center">
          <Wallet className="w-7 h-7 mr-3 text-primary" />
          Minha Carteira
        </h1>
      </header>

      {/* Saldo Disponível Card */}
      <Card className="bg-card/70 backdrop-blur-lg border shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center">
            <DollarSign className="w-6 h-6 mr-2" />
            Saldo Disponível
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-lg">
          <div className="flex justify-between items-center p-3 bg-background/50 rounded-md">
            <span className="text-muted-foreground">Saldo Pessoal:</span>
            <span className="font-semibold text-foreground">{formatCurrency(userBalances.personalBalance)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-background/50 rounded-md">
            <span className="text-muted-foreground">Saldo de Rede (MLM):</span>
            <span className="font-semibold text-foreground">{formatCurrency(userBalances.mlmBalance)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-primary/10 rounded-md mt-2">
            <span className="font-bold text-primary">SALDO TOTAL:</span>
            <span className="font-bold text-primary text-xl">{formatCurrency(userBalances.personalBalance + userBalances.mlmBalance)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={isWithdrawalDialogOpen} onOpenChange={setIsWithdrawalDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <Landmark className="w-5 h-5 mr-2" />
                Solicitar Saque
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-card/80 backdrop-blur-xl border text-foreground">
              <DialogHeader>
                <DialogTitle className="text-primary">Solicitar Saque</DialogTitle>
                <DialogDescription>
                  Preencha os dados para solicitar o saque dos seus saldos.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitWithdrawal)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor do Saque (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ex: 100,50" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="withdrawalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origem do Saldo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a origem do saldo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="personal" disabled={userBalances.personalBalance <= 0}>
                              Pessoal (Disponível: {formatCurrency(userBalances.personalBalance)})
                            </SelectItem>
                            <SelectItem value="mlm" disabled={userBalances.mlmBalance <= 0}>
                              Rede MLM (Disponível: {formatCurrency(userBalances.mlmBalance)})
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pixKeyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Chave PIX</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo da chave" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PIX_KEY_TYPES.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pixKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chave PIX</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite sua chave PIX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsWithdrawalDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Enviando..." : "Confirmar Solicitação"}
                       <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {/* Histórico de Saques Card */}
      <Card className="bg-card/70 backdrop-blur-lg border shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center">
            <History className="w-6 h-6 mr-2" />
            Histórico de Saques
          </CardTitle>
          <CardDescription>Acompanhe suas solicitações de saque.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="ml-3 text-muted-foreground">Carregando histórico...</p>
            </div>
          ) : withdrawalHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
                <Info size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhuma solicitação de saque encontrada.</p>
                <p className="text-sm">Quando você solicitar um saque, ele aparecerá aqui.</p>
            </div>
          ) : (
            <Table>
              <TableCaption>Seu histórico de solicitações de saque.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Data Solic.</TableHead>
                  <TableHead>Valor (R$)</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Chave PIX</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Processado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalHistory.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{format(parseISO(String(request.requestedAt)), "dd/MM/yy HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(request.amount)}</TableCell>
                    <TableCell>{request.withdrawalType === 'personal' ? 'Pessoal' : 'Rede MLM'}</TableCell>
                    <TableCell className="truncate max-w-[150px]" title={request.pixKey}>{request.pixKeyType}: {request.pixKey}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(request.status)} className="capitalize">
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {request.processedAt ? format(parseISO(String(request.processedAt)), "dd/MM/yy HH:mm", { locale: ptBR }) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


export default function CarteiraPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-transparent text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Carregando Carteira...</p>
      </div>
    }>
      <WalletPageContent />
    </Suspense>
  );
}
