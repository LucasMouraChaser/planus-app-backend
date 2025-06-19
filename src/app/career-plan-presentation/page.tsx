
"use client";

// Placeholder for /src/app/career-plan-presentation/page.tsx
// Detailed content to be added based on specification.

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, CheckCircle, BookOpen, Users, Presentation, TrendingUp, Award, DollarSign, Rocket } from 'lucide-react';

// Mock data for career levels (can be expanded)
const levels = [
  {
    name: "Consultor de Energia",
    icon: Rocket,
    requirements: ["Cadastro aprovado", "Treinamento inicial completo", "Primeira venda"],
    benefits: ["Comissão de 8%", "Materiais de marketing", "Suporte inicial"],
    potentialChartSrc: "https://placehold.co/600x300.png?text=Potencial+Ganhos+Consultor",
    potentialChartHint: "bar chart money growth",
  },
  {
    name: "Consultor Sênior",
    icon: TrendingUp,
    requirements: ["5 vendas concluídas", "Volume de R$20k", "Feedback positivo"],
    benefits: ["Comissão de 10%", "Bônus por meta", "Treinamentos avançados", "Início formação de equipe"],
    potentialChartSrc: "https://placehold.co/600x300.png?text=Potencial+Ganhos+Senior",
    potentialChartHint: "bar chart money growth",
  },
  {
    name: "Consultor Master",
    icon: Award,
    requirements: ["15 vendas concluídas", "Volume de R$70k", "3 indicados ativos"],
    benefits: ["Comissão de 12%", "MLM Nível 1: 5%, Nível 2: 2%", "Bônus de liderança", "Eventos exclusivos"],
    potentialChartSrc: "https://placehold.co/600x300.png?text=Potencial+Ganhos+Master",
    potentialChartHint: "bar chart money growth",
  },
   {
    name: "Diamante Planus",
    icon: Users, // Using Users as a placeholder for Diamond
    requirements: ["50 vendas concluídas", "Volume de R$250k", "10 indicados (2 Masters)"],
    benefits: ["Comissão de 15%", "MLM Nível 1: 7%, N2: 3%, N3: 1%", "Bônus global", "Viagens"],
    potentialChartSrc: "https://placehold.co/600x300.png?text=Potencial+Ganhos+Diamante",
    potentialChartHint: "bar chart money growth",
  },
];


export default function CareerPlanPresentationPage() {
  return (
    <div className="min-h-screen text-gray-100 p-4 md:p-8" style={{ background: '#1e293b' }}>
      <header className="mb-12 text-center">
        <Link href="/career-plan" passHref>
          <Button variant="outline" className="absolute top-4 left-4 bg-transparent text-gray-100 hover:bg-gray-700/50 border-gray-500">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar ao Plano de Carreira
          </Button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mt-16 mb-4">
          Sua Ascensão na Planus Energia
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Descubra cada degrau da sua jornada conosco, repleta de oportunidades, reconhecimento e recompensas.
        </p>
      </header>

      {levels.map((level, index) => (
        <section key={level.name} className="mb-16">
          <Card className="bg-slate-800/70 border-slate-700 shadow-xl text-gray-100 p-6 md:p-8 rounded-lg">
            <CardHeader className="text-center md:text-left mb-6">
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mb-4">
                <level.icon className="w-16 h-16 mr-0 md:mr-6 mb-4 md:mb-0 text-primary" />
                <CardTitle className="text-3xl md:text-4xl font-semibold text-primary">{level.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Requisitos para Alcançar:</h3>
                <ul className="space-y-2">
                  {level.requirements.map((req, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="text-xl font-semibold text-gray-200 mt-6 mb-3">Benefícios e Comissões:</h3>
                <ul className="space-y-2">
                  {level.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start">
                      <DollarSign className="w-5 h-5 mr-2 mt-0.5 text-yellow-400 flex-shrink-0" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 md:mt-0">
                <h4 className="text-lg font-medium text-center text-gray-300 mb-2">Potencial de Ganhos (Ilustrativo)</h4>
                 <Image 
                    src={level.potentialChartSrc} 
                    alt={`Gráfico de Potencial de Ganhos - ${level.name}`} 
                    width={600} 
                    height={300} 
                    className="rounded-md shadow-md mx-auto"
                    data-ai-hint={level.potentialChartHint}
                  />
              </div>
            </CardContent>
          </Card>
        </section>
      ))}

      <section className="mb-16">
        <Card className="bg-slate-800/70 border-slate-700 shadow-xl text-gray-100 p-6 md:p-8 rounded-lg">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-3xl font-semibold text-primary">Estrutura de Comissionamento</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-4">
              Nosso modelo de comissionamento é projetado para recompensar seu esforço e crescimento.
            </p>
            <Image 
              src="https://placehold.co/500x400.png?text=Estrutura+Comissao" 
              alt="Diagrama da Estrutura de Comissionamento" 
              width={500} 
              height={400} 
              className="rounded-md shadow-md mx-auto my-6"
              data-ai-hint="network diagram hierarchy"
            />
            <p className="text-gray-400 text-sm">
              Exemplo: Venda direta de R$1000 no nível Sênior (10%) = R$100. Se um indicado seu (Nível 1 MLM - 5%) faz uma venda de R$1000, você ganha R$50.
            </p>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-16">
         <Card className="bg-slate-800/70 border-slate-700 shadow-xl text-gray-100 p-6 md:p-8 rounded-lg">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-3xl font-semibold text-primary">Suporte e Treinamento Contínuo</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-4">
              <BookOpen className="w-12 h-12 mb-3 text-primary" />
              <h4 className="text-xl font-medium text-gray-200 mb-1">Materiais Completos</h4>
              <p className="text-gray-400 text-sm">Acesso a guias, scripts e apresentações.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Users className="w-12 h-12 mb-3 text-primary" />
              <h4 className="text-xl font-medium text-gray-200 mb-1">Comunidade Ativa</h4>
              <p className="text-gray-400 text-sm">Troca de experiências e suporte mútuo.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Presentation className="w-12 h-12 mb-3 text-primary" />
              <h4 className="text-xl font-medium text-gray-200 mb-1">Treinamentos Regulares</h4>
              <p className="text-gray-400 text-sm">Workshops e webinars com especialistas.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="text-center mt-12 mb-8">
         <Image 
            src="https://placehold.co/800x400.png?text=Equipe+Planus+Sucesso" 
            alt="Equipe Planus Energia em Evento de Sucesso" 
            width={800} 
            height={400} 
            className="rounded-lg shadow-xl mx-auto mb-8"
            data-ai-hint="team success meeting"
          />
        <h2 className="text-3xl font-semibold text-primary mb-4">Pronto para Crescer Conosco?</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Sua jornada para o sucesso começa agora. Dê o próximo passo e transforme seu potencial em resultados extraordinários.
        </p>
        <Link href="/proposal-generator" passHref> {/* Placeholder link, adjust as needed */}
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Quero Fazer Parte!
          </Button>
        </Link>
      </section>
    </div>
  );
}
