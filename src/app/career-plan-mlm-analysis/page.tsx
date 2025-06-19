
"use client";

// Placeholder for /src/app/career-plan-mlm-analysis/page.tsx
// Detailed content to be added based on specification.

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Network, Users, BarChart, HelpCircle, DollarSign } from 'lucide-react';
import { useState } from 'react';

const mlmLevelsData = [
  { level: 1, commission: "5%", exampleGain: "R$ 50 (sobre venda de R$1000)" },
  { level: 2, commission: "3%", exampleGain: "R$ 30 (sobre venda de R$1000)" },
  { level: 3, commission: "1%", exampleGain: "R$ 10 (sobre venda de R$1000)" },
];

const faqData = [
  { question: "Preciso vender para ganhar com a rede?", answer: "Sim, o modelo MLM é baseado no volume de vendas gerado por você e sua equipe. A indicação por si só não gera comissão." },
  { question: "Qual o limite de indicados diretos?", answer: "Não há limite para o número de indicados diretos (Nível 1) que você pode ter." },
  { question: "Como recebo as comissões da rede?", answer: "As comissões da rede são creditadas no seu 'Saldo de Rede (MLM)' e podem ser sacadas conforme as regras de saque." },
  { question: "Há material de apoio para recrutar?", answer: "Sim, a Planus Energia oferece materiais e treinamentos para ajudar na prospecção e desenvolvimento da sua equipe." },
];

export default function CareerPlanMlmAnalysisPage() {
  const [directReferrals, setDirectReferrals] = useState(5);
  const [avgSalePerReferral, setAvgSalePerReferral] = useState(1000);
  const [estimatedMlmEarnings, setEstimatedMlmEarnings] = useState(0);

  const calculateMlmEarnings = () => {
    // Simulação básica: Nível 1 (5%)
    const level1CommissionRate = 0.05;
    const earnings = directReferrals * avgSalePerReferral * level1CommissionRate;
    setEstimatedMlmEarnings(earnings);
  };

  return (
    <div className="min-h-screen text-gray-100 p-4 md:p-8" style={{ background: '#0a0a0b' }}>
      <header className="mb-12 text-center">
        <Link href="/career-plan" passHref>
          <Button variant="outline" className="absolute top-4 left-4 bg-transparent text-gray-100 hover:bg-gray-700/50 border-gray-500">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar ao Plano de Carreira
          </Button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mt-16 mb-4">
          Análise do Modelo de Ganhos em Rede Planus
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Entenda como a construção de uma equipe sólida pode multiplicar seus resultados e criar uma fonte de renda passiva e crescente.
        </p>
      </header>

      <section className="mb-16">
        <Card className="bg-slate-900/70 border-slate-700 shadow-xl text-gray-100 p-6 md:p-8 rounded-lg">
          <CardHeader className="items-center">
            <Network className="w-16 h-16 mb-4 text-primary" />
            <CardTitle className="text-3xl text-center text-primary">O Poder da Rede Planus Energia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4 text-center md:text-lg">
              Nosso modelo de Marketing Multinível (MLM) foi desenhado para recompensar não apenas suas vendas diretas, mas também seu esforço em construir, treinar e motivar uma equipe de consultores de sucesso. Ao ajudar outros a crescer, você cresce junto.
            </p>
            <Image 
              src="https://placehold.co/500x400.png?text=Estrutura+Rede+MLM" 
              alt="Diagrama da Estrutura de Rede MLM" 
              width={500} 
              height={400} 
              className="rounded-md shadow-md mx-auto my-8"
              data-ai-hint="network diagram hierarchy"
            />
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <Card className="bg-slate-900/70 border-slate-700 shadow-xl text-gray-100 p-6 md:p-8 rounded-lg">
          <CardHeader className="items-center">
             <DollarSign className="w-12 h-12 mb-3 text-primary" />
            <CardTitle className="text-2xl text-center text-primary">Níveis de Comissão da Rede</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Veja como você ganha com as vendas da sua equipe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption className="text-gray-500">Percentuais aplicados sobre o valor da venda realizada por membros da sua downline.</TableCaption>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="w-[100px] text-primary">Nível da Rede</TableHead>
                  <TableHead className="text-primary">% Comissão</TableHead>
                  <TableHead className="text-right text-primary">Exemplo de Ganho</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mlmLevelsData.map((item) => (
                  <TableRow key={item.level} className="border-slate-700">
                    <TableCell className="font-medium text-gray-200">{`Nível ${item.level}`}</TableCell>
                    <TableCell className="text-gray-300">{item.commission}</TableCell>
                    <TableCell className="text-right text-gray-300">{item.exampleGain}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <Card className="bg-slate-900/70 border-slate-700 shadow-xl text-gray-100 p-6 md:p-8 rounded-lg">
          <CardHeader className="items-center">
            <BarChart className="w-12 h-12 mb-3 text-primary" />
            <CardTitle className="text-2xl text-center text-primary">Simulador de Ganhos MLM (Estimativa)</CardTitle>
             <CardDescription className="text-center text-gray-400">
              Insira dados hipotéticos para visualizar seu potencial de ganhos com a rede (Nível 1).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="directReferrals" className="text-gray-300">Nº de Indicados Diretos (Nível 1)</Label>
                <Input 
                  id="directReferrals" 
                  type="number" 
                  value={directReferrals} 
                  onChange={(e) => setDirectReferrals(Number(e.target.value))} 
                  className="bg-slate-800 border-slate-600 text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="avgSalePerReferral" className="text-gray-300">Média de Vendas por Indicado (R$)</Label>
                <Input 
                  id="avgSalePerReferral" 
                  type="number" 
                  value={avgSalePerReferral} 
                  onChange={(e) => setAvgSalePerReferral(Number(e.target.value))} 
                  className="bg-slate-800 border-slate-600 text-gray-100"
                />
              </div>
            </div>
            <Button onClick={calculateMlmEarnings} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Calcular Ganhos Estimados</Button>
            {estimatedMlmEarnings > 0 && (
              <div className="mt-4 text-center p-4 bg-primary/10 rounded-md">
                <p className="text-gray-300">Ganhos MLM estimados (Nível 1): 
                  <span className="font-bold text-xl text-primary ml-2">
                    {estimatedMlmEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </p>
              </div>
            )}
            <Image 
              src="https://placehold.co/700x400.png?text=Simulacao+Ganhos+MLM" 
              alt="Gráfico de Simulação de Ganhos MLM" 
              width={700} 
              height={400} 
              className="rounded-md shadow-md mx-auto mt-6"
              data-ai-hint="line chart financial projection"
            />
          </CardContent>
        </Card>
      </section>
      
       <section className="mb-16">
        <Card className="bg-slate-900/70 border-slate-700 shadow-xl text-gray-100 p-6 md:p-8 rounded-lg">
          <CardHeader className="items-center">
            <Users className="w-12 h-12 mb-3 text-primary" />
            <CardTitle className="text-2xl text-center text-primary">Ferramentas para Construção de Rede</CardTitle>
             <CardDescription className="text-center text-gray-400">
              A Planus Energia oferece suporte para você expandir sua equipe:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-300 text-center">
            <p>✔️ Página de captura personalizada para seus indicados.</p>
            <p>✔️ Materiais de treinamento para sua downline.</p>
            <p>✔️ Sistema de acompanhamento de desempenho da equipe.</p>
            <p>✔️ Suporte dedicado para líderes de rede.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <Card className="bg-slate-900/70 border-slate-700 shadow-xl text-gray-100 p-6 md:p-8 rounded-lg">
          <CardHeader className="items-center">
            <HelpCircle className="w-12 h-12 mb-3 text-primary" />
            <CardTitle className="text-2xl text-center text-primary">Perguntas Frequentes sobre o MLM</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-slate-700">
                  <AccordionTrigger className="text-gray-200 hover:text-primary">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
      
      <section className="text-center mt-12 mb-8">
        <Link href="/career-plan-mlm-escalonado" passHref>
          <Button size="lg" variant="outline" className="bg-transparent text-primary border-primary hover:bg-primary/10">
            Conheça o MLM Escalonado <Network className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
