
// src/app/plano-carreira/apresentacao/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, CheckCircle, BookOpen, Users, Presentation as PresentationIcon, TrendingUp, Award, DollarSign, Target, ArrowRightCircle } from 'lucide-react';

const presentationLevels = [
  {
    title: "Consultor de Energia",
    icon: <Users className="w-12 h-12 text-primary mx-auto mb-4" />,
    requirements: [
      "Completar treinamento inicial e certificação.",
      "Realizar 5 vendas diretas qualificadas no primeiro mês.",
      "Participar de 2 workshops de produto."
    ],
    benefits: [
      "Comissão de 10% sobre vendas diretas.",
      "Acesso a materiais de marketing padrão.",
      "Suporte de um mentor experiente."
    ],
    potentialChart: "https://placehold.co/600x300.png?text=Potencial+Ganhos+Consultor",
    potentialChartHint: "bar chart money growth",
    motivation: "Construa sua base e prepare-se para o próximo nível!"
  },
  {
    title: "Consultor Sênior",
    icon: <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />,
    requirements: [
      "Total de 20 vendas diretas acumuladas.",
      "Indicar e ativar 3 novos Consultores.",
      "Volume de vendas pessoal de R$ 15.000."
    ],
    benefits: [
      "Comissão de 12% sobre vendas diretas.",
      "Comissão de 5% sobre vendas do Nível 1 da rede.",
      "Acesso a treinamentos de liderança."
    ],
    potentialChart: "https://placehold.co/600x300.png?text=Potencial+Ganhos+Senior",
    potentialChartHint: "bar chart money growth",
    motivation: "Lidere pelo exemplo e expanda sua rede!"
  },
  {
    title: "Consultor Master",
    icon: <Award className="w-12 h-12 text-primary mx-auto mb-4" />,
    requirements: [
      "Volume de vendas da equipe de R$ 100.000 em um trimestre.",
      "Ter 2 Consultores Sênior em sua downline direta.",
      "Apresentar um plano de negócios para sua equipe."
    ],
    benefits: [
      "Comissão de 15% sobre vendas diretas.",
      "Comissão de 5% (N1), 3% (N2) sobre vendas da rede.",
      "Bônus de liderança de R$ 1.000 por meta atingida.",
      "Participação em eventos VIP."
    ],
    potentialChart: "https://placehold.co/600x300.png?text=Potencial+Ganhos+Master",
    potentialChartHint: "bar chart money growth",
    motivation: "Inspire sua equipe e alcance novos patamares!"
  },
  {
    title: "Consultor Diamante",
    icon: <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />,
    requirements: [
      "Volume de vendas da organização de R$ 500.000 em um semestre.",
      "Formar 3 Consultores Master em diferentes linhas da downline.",
      "Contribuições significativas para a estratégia da empresa."
    ],
    benefits: [
      "Comissão de 18% sobre vendas diretas.",
      "Comissão de 5% (N1), 3% (N2), 2% (N3) sobre vendas da rede.",
      "Bônus de participação nos lucros (ex: 1% do faturamento regional).",
      "Viagens de incentivo internacionais e prêmios de luxo."
    ],
    potentialChart: "https://placehold.co/600x300.png?text=Potencial+Ganhos+Diamante",
    potentialChartHint: "bar chart money growth",
    motivation: "Você está no topo! Compartilhe seu sucesso e continue crescendo."
  }
];

export default function CareerPlanPresentationPage() {
  return (
    <div className="min-h-screen text-white p-4 md:p-8" style={{ backgroundColor: '#1e293b' }}>
      <div className="absolute top-4 left-4 z-10">
        <Link href="/plano-carreira" passHref>
          <Button variant="outline" size="sm" className="bg-slate-700/50 hover:bg-slate-600/70 border-slate-500 text-slate-200 hover:text-white">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar ao Plano
          </Button>
        </Link>
      </div>

      {/* Seção de Boas-Vindas */}
      <section className="text-center py-16 md:py-24">
        <Target className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-4">
          Sua Escalada para o Sucesso na Planus Energia
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
          Descubra um caminho claro para o crescimento profissional e financeiro.
          Na Planus Energia, seu esforço e liderança são diretamente recompensados.
        </p>
      </section>

      {/* Seções Detalhadas por Nível */}
      {presentationLevels.map((level, index) => (
        <section key={index} className="py-12 md:py-16 border-b border-slate-700 last:border-b-0">
          <Card className="max-w-4xl mx-auto bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl text-slate-100">
            <CardHeader className="text-center">
              {level.icon}
              <CardTitle className="text-3xl md:text-4xl font-bold text-primary">{level.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-200 mb-3">Requisitos para Alcançar:</h3>
                <ul className="space-y-2">
                  {level.requirements.map((req, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-200 mb-3">Benefícios e Comissões:</h3>
                <ul className="space-y-2">
                  {level.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start">
                      <DollarSign className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2 mt-6 text-center">
                <h4 className="text-lg font-semibold text-slate-300 mb-2">Potencial de Ganhos (Ilustrativo):</h4>
                <Image
                  src={level.potentialChart}
                  alt={`Gráfico de Potencial de Ganhos - ${level.title}`}
                  width={600}
                  height={300}
                  className="rounded-lg mx-auto shadow-md"
                  data-ai-hint={level.potentialChartHint}
                />
              </div>
            </CardContent>
            <CardDescription className="p-6 pt-0 text-center text-amber-400 font-medium italic">
              {level.motivation}
            </CardDescription>
          </Card>
        </section>
      ))}

      {/* Seção de Estrutura de Comissionamento */}
      <section className="py-12 md:py-16 border-b border-slate-700">
         <Card className="max-w-4xl mx-auto bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl text-slate-100 p-6 md:p-8">
            <CardHeader className="text-center p-0 mb-6">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Estrutura de Comissionamento</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-center space-y-6">
                <p className="text-slate-300">Entenda como suas vendas diretas e o crescimento da sua rede se traduzem em ganhos sólidos.</p>
                <Image
                    src="https://placehold.co/500x400.png?text=Estrutura+Comissao"
                    alt="Diagrama da Estrutura de Comissionamento"
                    width={500}
                    height={400}
                    className="rounded-lg mx-auto shadow-md"
                    data-ai-hint="network diagram hierarchy"
                />
                <p className="text-slate-300 text-sm">
                    Exemplo: Venda de R$1.000. Comissão direta (Consultor): R$100. Se seu indicado (Nível 1) realiza uma venda similar, você ganha mais R$50 (5% comissão de rede).
                </p>
            </CardContent>
         </Card>
      </section>

      {/* Seção de Suporte e Treinamento */}
      <section className="py-12 md:py-16 border-b border-slate-700">
        <Card className="max-w-4xl mx-auto bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl text-slate-100 p-6 md:p-8">
            <CardHeader className="text-center p-0 mb-6">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Seu Desenvolvimento é Nossa Prioridade</CardTitle>
            </CardHeader>
            <CardContent className="p-0 grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-2">
                <BookOpen className="w-10 h-10 text-amber-400 mb-2" />
                <h4 className="text-xl font-semibold text-slate-200">Treinamento Contínuo</h4>
                <p className="text-sm text-slate-400">Acesso a uma plataforma completa com cursos, workshops e materiais de apoio.</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
                <Users className="w-10 h-10 text-amber-400 mb-2" />
                <h4 className="text-xl font-semibold text-slate-200">Comunidade e Mentoria</h4>
                <p className="text-sm text-slate-400">Faça parte de uma rede de consultores experientes e receba orientação individualizada.</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
                <PresentationIcon className="w-10 h-10 text-amber-400 mb-2" />
                <h4 className="text-xl font-semibold text-slate-200">Ferramentas de Vendas</h4>
                <p className="text-sm text-slate-400">Disponibilizamos as melhores ferramentas para você gerenciar seus leads e fechar negócios.</p>
            </div>
            </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Pronto para Começar Sua Jornada de Sucesso?</h2>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
          Junte-se à Planus Energia e transforme seu potencial em resultados extraordinários.
        </p>
        <div className="flex justify-center space-x-4">
            <Link href="/proposal-generator" passHref>
                <Button size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-3 text-lg">
                    Quero Ser Consultor!
                    <ArrowRightCircle className="ml-2 h-5 w-5" />
                </Button>
            </Link>
             <Link href="/contato" passHref>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary px-8 py-3 text-lg">
                    Fale Conosco
                </Button>
            </Link>
        </div>
         <div className="mt-12">
            <Image
                src="https://placehold.co/800x400.png?text=Equipe+Planus+Sucesso"
                alt="Equipe Planus Energia celebrando o sucesso"
                width={800}
                height={400}
                className="rounded-lg mx-auto shadow-xl"
                data-ai-hint="team success meeting"
            />
        </div>
      </section>
    </div>
  );
}
