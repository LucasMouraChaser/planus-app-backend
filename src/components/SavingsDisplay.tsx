
// /src/components/SavingsDisplay.tsx
"use client";

import type { SavingsResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SavingsDisplayProps {
  savings: SavingsResult | null;
}

export function SavingsDisplay({ savings }: SavingsDisplayProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!savings || savings.monthlySaving === 0) {
    return (
      <Card className="w-full shadow-lg animate-in fade-in-50 bg-card text-card-foreground rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            Simule sua Economia
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            {savings?.discountDescription || "Ajuste o consumo ou selecione um estado disponível para ver sua economia."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col items-center">
           <Link href="/proposal-generator" passHref>
            <Button variant="default" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <FileText className="mr-2 h-5 w-5" />
              INICIAR NOVA PROPOSTA
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg animate-in fade-in-50 bg-card text-card-foreground rounded-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-foreground">
          Sua Economia Estimada
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          {savings.discountDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 space-y-6">
        {/* Section for Original Bill, New Bill, and Chart */}
        <div className="grid md:grid-cols-2 gap-4 items-end">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Conta Original Estimada</p>
              <p className="text-lg font-medium text-foreground">{formatCurrency(savings.originalMonthlyBill)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nova Conta com SENT (Estimada)</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(savings.newMonthlyBillWithSent)}</p>
            </div>
          </div>
          <div className="flex justify-center items-center mt-4 md:mt-0">
            <Image 
              src="https://placehold.co/250x120.png" 
              width={250}
              height={120}
              alt="Gráfico de economia estimada"
              data-ai-hint="line chart graph"
              className="object-contain"
            />
          </div>
        </div>

        {/* Section for Annual Savings & Effective Discount */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Economia Anual Estimada</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(savings.annualSaving)}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground">Desconto Anual Efetivo</p>
            <p className="text-2xl font-bold text-foreground">{savings.effectiveAnnualDiscountPercentage}%</p>
          </div>
        </div>
        
        {/* Button Section */}
        <div className="pt-4">
          <Link href="/proposal-generator" passHref>
            <Button variant="default" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <FileText className="mr-2 h-5 w-5" />
              INICIAR NOVA PROPOSTA
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

