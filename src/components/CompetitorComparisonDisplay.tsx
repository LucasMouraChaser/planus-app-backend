
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';

// Helper function (can be moved to utils if used elsewhere)
const formatCurrency = (value: number | undefined | null, defaultString = "R$ 0,00"): string => {
  if (value === undefined || value === null || isNaN(value)) return defaultString;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

interface Competitor {
  id: string;
  name: string;
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  logoAiHint: string;
  discountType: 'fixed' | 'nominal_plus_tax' | 'effective_example';
  fixedRate?: number;
  nominalRate?: number;
  taxRate?: number;
  exampleEffectiveRate?: number;
  getInfoText: (currentBill: number, effectiveDiscountRate?: number) => string;
  additionalNote?: string;
}

const competitorsData: Competitor[] = [
  {
    id: 'igreen',
    name: 'igreen energy',
    logoUrl: 'https://static.wixstatic.com/media/c003a9_5303abb8a48344abacbcc3b15bbaa139~mv2.jpeg',
    logoAlt: 'Logo igreen energy',
    logoWidth: 50,
    logoHeight: 14,
    logoAiHint: 'igreen logo',
    discountType: 'fixed',
    fixedRate: 0.12,
    getInfoText: () => "Oferece um desconto fixo de 12% sobre o valor da conta.",
  },
  {
    id: 'reenergisa',
    name: '(RE)energisa',
    logoUrl: 'https://static.wixstatic.com/media/c003a9_def5603bd54a44488c5d77c014de2bd2~mv2.webp',
    logoAlt: 'Logo (RE)energisa',
    logoWidth: 60,
    logoHeight: 16,
    logoAiHint: 'reenergisa logo',
    discountType: 'nominal_plus_tax',
    nominalRate: 0.30,
    taxRate: 0.22,
    getInfoText: (_currentBill, effectiveRate) => `Desconto nominal de 30%. Sobre o valor da fatura após este desconto, são adicionados impostos (PIS/COFINS/ICMS) de ~22%, resultando em ~${effectiveRate?.toFixed(1) ?? 'N/A'}% de desconto efetivo.`,
  },
  {
    id: 'enersim',
    name: 'Enersim',
    logoUrl: 'https://static.wixstatic.com/media/c003a9_9fb6e8280b184f1aa2ff299bb4bf961b~mv2.png',
    logoAlt: 'Logo Enersim',
    logoWidth: 50,
    logoHeight: 14,
    logoAiHint: 'enersim logo',
    discountType: 'nominal_plus_tax',
    nominalRate: 0.20,
    taxRate: 0.22,
    getInfoText: (_currentBill, effectiveRate) => `Desconto nominal de 20%. Sobre o valor da fatura após este desconto, são adicionados impostos (PIS/COFINS/ICMS) de ~22%, resultando em ~${effectiveRate?.toFixed(1) ?? 'N/A'}% de desconto efetivo.`,
  },
  {
    id: 'evolua',
    name: 'Evolua Energia',
    logoUrl: 'https://static.wixstatic.com/media/c003a9_e0218ef58465428c92b43ed1f5357626~mv2.png',
    logoAlt: 'Logo Evolua Energia',
    logoWidth: 60,
    logoHeight: 16,
    logoAiHint: 'evolua energia logo gradient',
    discountType: 'nominal_plus_tax',
    nominalRate: 0.20,
    taxRate: 0.22,
    getInfoText: (_currentBill, effectiveRate) => `Desconto nominal de 20%. Sobre o valor da fatura após este desconto, são adicionados impostos (PIS/COFINS/ICMS) de ~22%, resultando em ~${effectiveRate?.toFixed(1) ?? 'N/A'}% de desconto efetivo.`,
  },
  {
    id: 'axs',
    name: 'AXS Energia',
    logoUrl: 'https://static.wixstatic.com/media/c003a9_2585b0ba552246308b1ab030c99ad4c8~mv2.png',
    logoAlt: 'Logo AXS Energia',
    logoWidth: 50,
    logoHeight: 13,
    logoAiHint: 'AXS logo',
    discountType: 'nominal_plus_tax',
    nominalRate: 0.32,
    taxRate: 0.22,
    getInfoText: (_currentBill, effectiveRate) => `Desconto nominal de 32%. Sobre o valor da fatura após este desconto, são adicionados impostos (PIS/COFINS/ICMS) de ~22%, resultando em ~${effectiveRate?.toFixed(1) ?? 'N/A'}% de desconto efetivo.`,
    additionalNote: "<br /><span class='font-semibold'>Importante:</span> Este cálculo assume que seu consumo está dentro do limite de kWh contratado.",
  },
  {
    id: 'origo',
    name: 'Origo Energia',
    logoUrl: 'https://static.wixstatic.com/media/c003a9_92e1b183079943d1946074372cdfe568~mv2.webp',
    logoAlt: 'Logo Origo Energia',
    logoWidth: 60,
    logoHeight: 16,
    logoAiHint: 'Origo Energia logo teal purple',
    discountType: 'effective_example',
    exampleEffectiveRate: 0.18,
    getInfoText: () => "A Origo Energia possui planos com descontos que variam (ex: 15% a 25% de percepção mensal)... resultando em ~18% de desconto. Essas ofertas geralmente envolvem análise de crédito e fidelidade contratual.",
  },
  {
    id: 'fit',
    name: 'Fit Energia',
    logoUrl: 'https://static.wixstatic.com/media/c003a9_8429c42665e14b88b534635940b53285~mv2.webp',
    logoAlt: 'Logo Fit Energia',
    logoWidth: 50,
    logoHeight: 16,
    logoAiHint: 'Fit Energia Santander logo',
    discountType: 'fixed',
    fixedRate: 0.20,
    getInfoText: () => "Oferece um desconto fixo de 20% sobre o valor da conta.",
  },
  {
    id: 'mtenergia',
    name: 'Mato Grosso Energia Renovável',
    logoUrl: 'https://static.wixstatic.com/media/c003a9_166946e1aafe4ecc9a9f90b45f762271~mv2.png',
    logoAlt: 'Logo Mato Grosso Energia Renovável',
    logoWidth: 60,
    logoHeight: 22,
    logoAiHint: 'Mato Grosso Energia Renovavel logo',
    discountType: 'nominal_plus_tax',
    nominalRate: 0.25,
    taxRate: 0.22,
    getInfoText: (_currentBill, effectiveRate) => `Desconto nominal de 25%. Sobre o valor da fatura após este desconto, são adicionados impostos (PIS/COFINS/ICMS) de ~22%, resultando em ~${effectiveRate?.toFixed(1) ?? 'N/A'}% de desconto efetivo.`,
  },
  {
    id: 'oestesolar',
    name: 'Oeste Solar',
    logoUrl: 'https://static.wixstatic.com/media/c003a9_2739592fa16e423490eeacc72249d56c~mv2.jpeg',
    logoAlt: 'Logo Oeste Solar',
    logoWidth: 60,
    logoHeight: 12,
    logoAiHint: 'Oeste Solar Energia Renovavel logo',
    discountType: 'fixed',
    fixedRate: 0.15,
    getInfoText: () => "Oferece um desconto fixo de 15% sobre o valor da conta.",
  }
];

interface CompetitorComparisonDisplayProps {
  currentBillAmount: number;
  sentEnergyAnnualSaving: number;
}

const CompetitorComparisonDisplay: FC<CompetitorComparisonDisplayProps> = ({ currentBillAmount, sentEnergyAnnualSaving }) => {
  if (currentBillAmount <= 0 || sentEnergyAnnualSaving === undefined) {
    return null; // Or some placeholder if no valid bill amount or Planus savings
  }

  return (
    <Card className="shadow-lg transition-all duration-300 ease-out mt-8 bg-card/70 backdrop-blur-lg border">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-bold text-primary text-center">Análise da Concorrência</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitorsData.map((competitor) => {
            let monthlySaving = 0;
            let annualSaving = 0;
            let effectiveDiscountRate = 0;

            if (competitor.discountType === 'fixed' && competitor.fixedRate) {
              monthlySaving = currentBillAmount * competitor.fixedRate;
              annualSaving = monthlySaving * 12;
            } else if (competitor.discountType === 'nominal_plus_tax' && competitor.nominalRate && competitor.taxRate) {
              const billAfterNominalDiscount = currentBillAmount * (1 - competitor.nominalRate);
              const taxAmount = billAfterNominalDiscount * competitor.taxRate;
              const finalBillCompetitor = billAfterNominalDiscount + taxAmount;
              monthlySaving = currentBillAmount > finalBillCompetitor ? currentBillAmount - finalBillCompetitor : 0;
              annualSaving = monthlySaving * 12;
              if (currentBillAmount > 0) {
                effectiveDiscountRate = (monthlySaving / currentBillAmount) * 100;
              }
            } else if (competitor.discountType === 'effective_example' && competitor.exampleEffectiveRate) {
              monthlySaving = currentBillAmount * competitor.exampleEffectiveRate;
              annualSaving = monthlySaving * 12;
              effectiveDiscountRate = competitor.exampleEffectiveRate * 100;
            }

            const additionalSavingsWithPlanus = sentEnergyAnnualSaving - annualSaving;
            let comparisonMessage = "";
            let comparisonColor = "text-muted-foreground"; 

            if (additionalSavingsWithPlanus > 1) { 
              comparisonMessage = `Com a Planus Energia, você economiza ${formatCurrency(additionalSavingsWithPlanus)} a mais anualmente!`;
              comparisonColor = "text-green-400"; 
            } else if (additionalSavingsWithPlanus < -1) { 
              comparisonMessage = `Com a ${competitor.name}, você economizaria ${formatCurrency(Math.abs(additionalSavingsWithPlanus))} a mais anualmente.`;
              comparisonColor = "text-red-400"; 
            } else { 
              comparisonMessage = "A economia anual é virtualmente a mesma em comparação com a Planus Energia.";
            }
            
            const infoText = competitor.getInfoText(currentBillAmount, effectiveDiscountRate) + (competitor.additionalNote || "");

            return (
              <div key={competitor.id} className="p-4 bg-slate-200/70 backdrop-blur-lg border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-out space-y-3 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-semibold text-slate-800 min-w-0 break-words mr-2">{competitor.name}</h3>
                  <Image
                    src={competitor.logoUrl}
                    alt={competitor.logoAlt}
                    width={competitor.logoWidth}
                    height={competitor.logoHeight}
                    data-ai-hint={competitor.logoAiHint}
                    className="rounded object-contain flex-shrink-0"
                  />
                </div>
                <p className="text-xs text-slate-700 flex-grow" dangerouslySetInnerHTML={{ __html: infoText }} />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-slate-100/80 border border-slate-300/70 rounded-md text-center">
                    <p className="text-slate-600 text-xs">Economia Mensal</p>
                    <p className="font-bold text-md text-primary">{formatCurrency(monthlySaving)}</p>
                  </div>
                  <div className="p-2 bg-slate-100/80 border border-slate-300/70 rounded-md text-center">
                    <p className="text-slate-600 text-xs">Economia Anual</p>
                    <p className="font-bold text-md text-primary">{formatCurrency(annualSaving)}</p>
                  </div>
                </div>
                <div className="mt-auto pt-3">
                  <div className="p-3 bg-neutral-800/70 backdrop-blur-md border border-neutral-700 rounded-lg">
                    <h4 className="flex items-center font-semibold text-sm text-primary mb-1">
                      <Sparkles className="w-4 h-4 mr-1.5 text-primary" />
                      vs. Planus Energia
                    </h4>
                    <p className={`text-xs text-center ${comparisonColor}`}>
                      {comparisonMessage}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorComparisonDisplay;

