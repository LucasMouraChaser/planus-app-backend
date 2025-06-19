
// /src/components/SavingsDisplay.tsx
"use client";

import type { SavingsResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

interface SavingsDisplayProps {
  savings: SavingsResult | null;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const illustrativeChartData = [
  { month: "M1", value: 120 },
  { month: "M2", value: 150 },
  { month: "M3", value: 130 },
  { month: "M4", value: 190 },
  { month: "M5", value: 220 },
];

const chartConfig = {
  value: {
    label: "Economia",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const renderDiscountDescription = (description: string) => {
  const parts = description.split(/(\d+%)/g); // Split by percentages, keeping the delimiter
  return parts.map((part, index) => {
    if (/\d+%/.test(part)) {
      return <span key={index} className="text-primary font-medium">{part}</span>;
    }
    return part;
  });
};

export function SavingsDisplay({ savings }: SavingsDisplayProps) {

  if (!savings || savings.monthlySaving === 0) {
    return (
      <Card className="w-full shadow-lg animate-in fade-in-50 bg-card/70 backdrop-blur-lg border text-card-foreground rounded-lg">
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
           <Link href="/proposal-generator">
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
    <Card className="w-full shadow-lg animate-in fade-in-50 bg-card/70 backdrop-blur-lg border text-card-foreground rounded-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-foreground">
          Sua Economia Estimada
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          {renderDiscountDescription(savings.discountDescription)}
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
          <div className="flex justify-center items-center mt-4 md:mt-0 h-[120px] w-full max-w-[250px] mx-auto">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart 
                accessibilityLayer 
                data={illustrativeChartData} 
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="month" hide stroke="hsl(var(--foreground))" fontSize={10} />
                <YAxis hide stroke="hsl(var(--foreground))" fontSize={10} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ChartContainer>
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
            <p className="text-2xl font-bold text-primary">{savings.effectiveAnnualDiscountPercentage}%</p>
          </div>
        </div>
        
        {/* Button Section */}
        <div className="pt-4">
          <Link href="/proposal-generator">
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

