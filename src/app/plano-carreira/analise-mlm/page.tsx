
// src/app/plano-carreira/analise-mlm/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Users, DollarSign, BarChart2, HelpCircle, TrendingUp, Check, Network, Lightbulb, ArrowRightCircle } from 'lucide-react';

const mlmLevels = [
  { level: "Nível 1 (Indicados Diretos)", commission: "5%", exampleGain: "R$ 50,00" },
  { level: "Nível 2", commission: "3%", exampleGain: "R$ 30,00" },
  { level: "Nível 3", commission: "1%", exampleGain: "R$ 10,00" },
];

const faqItems = [
  {
    question: "Como funciona o comissionamento da rede?",
    answer: "Você recebe um percentual sobre as vendas realizadas pelos consultores que você indicou (Nível 1), pelos indicados deles (Nível 2), e assim por diante, até o limite de níveis do plano. Os percentuais variam por nível."
  },
  {
    question: "Preciso vender para ganhar com a rede?",
    answer: "Geralmente, para se qualificar para comissões de rede, é necessário manter um nível mínimo de vendas pessoais ou atividade, garantindo que você também esteja engajado no negócio."
  },
  {
    question: "Qual o potencial de ganhos com MLM na Planus Energia?",
    answer: "O potencial é ilimitado e depende do tamanho e produtividade da sua equipe. Quanto maior e mais bem treinada for sua rede, maiores serão seus ganhos residuais."
  },
  {
    question: "A Planus Energia oferece suporte para construir minha equipe?",
    answer: "Sim! Oferecemos treinamentos de liderança, materiais de recrutamento, e suporte contínuo para ajudá-lo a construir e gerenciar uma equipe de sucesso."
  }
];

export default function CareerPlanMlmAnalysisPage() {
  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8" style={{ backgroundColor: '#0a0a0b' }}>
      <div className="absolute top-4 left-4 z-10">
        <Link href="/plano-carreira" passHref>
          <Button variant="outline" size="sm" className="bg-slate-800/50 hover:bg-slate-700/70 border-slate-600 text-slate-300 hover:text-white">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar ao Plano
          </Button>
        </Link>
      </div>

      {/* Introdução ao Modelo MLM */}
      <section className="text-center py-16 md:py-20">
        <Network className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6">
          Análise do Marketing Multinível Planus Energia
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
          Descubra como nosso modelo de Marketing Multinível (MLM) pode multiplicar seus ganhos
          e criar uma fonte de renda residual sólida, recompensando sua capacidade de liderança e construção de equipe.
        </p>
      </section>

      {/* Detalhamento dos Níveis da Rede */}
      <section className="py-12 md:py-16">
        <Card className="max-w-4xl mx-auto bg-slate-900/70 backdrop-blur-md border-slate-800 shadow-2xl text-slate-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Níveis da Rede e Comissões</CardTitle>
            <CardDescription className="text-slate-400">Percentuais sobre uma venda hipotética de R$1.000 na sua downline.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300 font-semibold">Nível da Rede</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">% Comissão</TableHead>
                  <TableHead className="text-right text-slate-300 font-semibold">Exemplo de Ganho</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mlmLevels.map((level) => (
                  <TableRow key={level.level} className="border-slate-800">
                    <TableCell className="font-medium text-slate-200">{level.level}</TableCell>
                    <TableCell className="text-center text-green-400 font-semibold">{level.commission}</TableCell>
                    <TableCell className="text-right text-yellow-400 font-semibold">{level.exampleGain}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption className="text-slate-500 mt-2">Estes são exemplos ilustrativos. Consulte o plano oficial para detalhes.</TableCaption>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Simuladores de Ganhos MLM */}
      <section className="py-12 md:py-16 text-center">
        <Card className="max-w-4xl mx-auto bg-slate-900/70 backdrop-blur-md border-slate-800 shadow-2xl text-slate-200 p-6 md:p-8">
            <CardHeader className="p-0 mb-6">
                <BarChart2 className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle className="text-3xl font-bold text-primary">Simulação de Ganhos MLM</CardTitle>
                <CardDescription className="text-slate-400">Visualize o potencial de crescimento exponencial.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
                <p className="text-slate-300">
                    Imagine indicar 5 consultores (Nível 1). Se cada um deles indicar mais 5 (Nível 2), e estes também indicarem 5 cada (Nível 3), sua rede terá:
                </p>
                <ul className="text-left list-disc list-inside mx-auto max-w-md space-y-1 text-slate-300">
                    <li>5 consultores no Nível 1</li>
                    <li>25 consultores no Nível 2</li>
                    <li>125 consultores no Nível 3</li>
                </ul>
                <p className="text-slate-300">
                    Se cada um desses consultores fizer apenas UMA venda de R$1.000 no mês, seus ganhos de rede seriam:
                </p>
                 <p className="text-xl font-semibold text-yellow-400">
                    N1: (5 x R$50) + N2: (25 x R$30) + N3: (125 x R$10) = <span className="text-2xl text-green-400">R$ 2.250,00</span> (somente de comissões de rede!)
                </p>
                <div className="mt-6">
                    <Image
                    src="https://placehold.co/700x400.png?text=Simulacao+Ganhos+MLM"
                    alt="Gráfico de Simulação de Ganhos MLM"
                    width={700}
                    height={400}
                    className="rounded-lg mx-auto shadow-md"
                    data-ai-hint="line chart financial projection"
                    />
                </div>
            </CardContent>
        </Card>
      </section>

      {/* Estudos de Caso / Exemplos */}
      <section className="py-12 md:py-16">
         <Card className="max-w-4xl mx-auto bg-slate-900/70 backdrop-blur-md border-slate-800 shadow-2xl text-slate-200 p-6 md:p-8">
            <CardHeader className="p-0 mb-6 text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle className="text-3xl font-bold text-primary">Crescimento e Exemplos Práticos</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-slate-300">
                <p><strong>Exemplo 1 (Início Focado):</strong> Maria indicou 3 amigos. Dois deles se tornaram ativos e cada um fez 2 vendas de R$2.000. Maria ganhou R$200 de comissão de rede (2 vendas x R$2.000 x 5% x 2 amigos), além de suas próprias comissões de venda direta.</p>
                <p><strong>Exemplo 2 (Liderança em Expansão):</strong> João tem uma rede com 10 indicados diretos e 50 no segundo nível. Com um volume médio de vendas de R$1.500 por consultor ativo em sua rede, seus ganhos MLM podem facilmente ultrapassar R$5.000 mensais, somados às suas vendas pessoais.</p>
                <p className="italic text-slate-400">Estes são exemplos. O sucesso depende do seu esforço, dedicação e da capacidade de motivar e treinar sua equipe.</p>
            </CardContent>
         </Card>
      </section>
      
      {/* Ferramentas e Suporte */}
       <section className="py-12 md:py-16">
        <Card className="max-w-4xl mx-auto bg-slate-900/70 backdrop-blur-md border-slate-800 shadow-2xl text-slate-200 p-6 md:p-8">
            <CardHeader className="text-center p-0 mb-6">
                <Lightbulb className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle className="text-3xl font-bold text-primary">Ferramentas para seu Sucesso</CardTitle>
            </CardHeader>
            <CardContent className="p-0 grid md:grid-cols-2 gap-6 text-slate-300">
                <div>
                    <h4 className="text-xl font-semibold text-amber-400 mb-2">Treinamento de Liderança</h4>
                    <p className="text-sm">Capacitações focadas em desenvolvimento de equipes, recrutamento eficaz e motivação.</p>
                </div>
                <div>
                    <h4 className="text-xl font-semibold text-amber-400 mb-2">Materiais de Apoio</h4>
                    <p className="text-sm">Apresentações prontas, scripts de abordagem e ferramentas de marketing digital para sua rede.</p>
                </div>
                <div>
                    <h4 className="text-xl font-semibold text-amber-400 mb-2">Sistema de Gerenciamento</h4>
                    <p className="text-sm">Painel para acompanhar o desempenho da sua equipe, comissões e crescimento da rede.</p>
                </div>
                <div>
                    <h4 className="text-xl font-semibold text-amber-400 mb-2">Eventos e Reconhecimento</h4>
                    <p className="text-sm">Eventos exclusivos para líderes, com premiações, viagens e networking de alto nível.</p>
                </div>
            </CardContent>
        </Card>
      </section>


      {/* FAQ sobre o MLM */}
      <section className="py-12 md:py-16">
        <Card className="max-w-4xl mx-auto bg-slate-900/70 backdrop-blur-md border-slate-800 shadow-2xl text-slate-200 p-6 md:p-8">
            <CardHeader className="text-center p-0 mb-6">
                <HelpCircle className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle className="text-3xl font-bold text-primary">Perguntas Frequentes sobre MLM</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-slate-800">
                    <AccordionTrigger className="text-left text-lg text-slate-200 hover:text-primary hover:no-underline">
                        {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400 pt-2 pb-4">
                        {item.answer}
                    </AccordionContent>
                </AccordionItem>
                ))}
            </Accordion>
            </CardContent>
        </Card>
      </section>

       {/* CTA */}
      <section className="py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Pronto para Multiplicar seus Ganhos?</h2>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
          Comece a construir sua rede de sucesso hoje mesmo com a Planus Energia!
        </p>
        <Link href="/contato" passHref> {/* TODO: Link para página de cadastro ou contato específico */}
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-3 text-lg">
                Quero Saber Mais
                <ArrowRightCircle className="ml-2 h-5 w-5" />
            </Button>
        </Link>
      </section>
    </div>
  );
}

