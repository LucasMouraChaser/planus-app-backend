// /src/components/SavingsDisplay.tsx
"use client";

import type { SavingsResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface SavingsDisplayProps {
  savings: SavingsResult | null;
  // onGenerateProposalClick: () => void; // Alterado para link direto
}

export function SavingsDisplay({ savings }: SavingsDisplayProps) {
  if (!savings || savings.monthlySaving === 0) {
    return (
      <Card className="w-full shadow-lg animate-in fade-in-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6 text-amber-500" />
            Simule sua Economia
          </CardTitle>
          <CardDescription>
            {savings?.discountDescription || "Ajuste o consumo ou selecione um estado disponível para ver sua economia."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
           <Link href="/proposal-generator" passHref>
            <Button variant="default" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
              <FileText className="mr-2 h-5 w-5" />
              INICIAR NOVA PROPOSTA
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Card className="w-full shadow-lg animate-in fade-in-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <TrendingUp className="mr-3 h-7 w-7" />
          Sua Economia Estimada
        </CardTitle>
        <CardDescription>{savings.discountDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
          <div>
            <p className="text-sm text-muted-foreground">Conta Original Estimada</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(savings.originalMonthlyBill)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nova Conta com SENT (Estimada)</p>
            <p className="text-xl font-semibold text-green-600">{formatCurrency(savings.newMonthlyBillWithSent)}</p>
          </div>
        </div>
        
        <div className="p-4 bg-primary/10 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Economia Mensal Estimada</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(savings.monthlySaving)}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left pt-2">
          <div>
            <p className="text-sm text-muted-foreground">Economia Anual Estimada</p>
            <p className="text-lg font-medium text-foreground">{formatCurrency(savings.annualSaving)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Desconto Anual Efetivo</p>
            <p className="text-lg font-medium text-foreground">{savings.effectiveAnnualDiscountPercentage}%</p>
          </div>
        </div>
        
        <div className="pt-4">
          <Link href="/proposal-generator" passHref>
            <Button variant="default" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
              <FileText className="mr-2 h-5 w-5" />
              INICIAR NOVA PROPOSTA
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground text-center pt-2">
          Valores simulados. A economia real pode variar.
        </p>
      </CardContent>
    </Card>
  );
}
