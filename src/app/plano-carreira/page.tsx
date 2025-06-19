
// src/app/plano-carreira/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Rocket, Users, TrendingUp, Award, DollarSign, Presentation, BarChart, Pyramid } from 'lucide-react';

const careerLevels = [
  {
    name: "Consultor de Energia",
    icon: <Users className="w-8 h-8 text-primary mb-3" />,
    description: "O ponto de partida na sua jornada com a SENT Energy. Aprenda o básico, comece a construir sua base de clientes e entenda nosso modelo de negócios.",
    requirements: [
      "Completar o treinamento inicial.",
      "Realizar as primeiras vendas qualificadas.",
      "Demonstrar compreensão dos produtos SENT."
    ],
    benefits: [
      "Comissão padrão sobre vendas diretas.",
      "Acesso a materiais de marketing.",
      "Suporte inicial da equipe."
    ],
    nextStep: "Avance para Consultor Sênior ao atingir suas primeiras metas de vendas e indicações."
  },
  {
    name: "Consultor Sênior",
    icon: <TrendingUp className="w-8 h-8 text-primary mb-3" />,
    description: "Você demonstrou consistência e está pronto para expandir sua influência e ganhos.",
    requirements: [
      "Atingir X vendas diretas em um período.",
      "Indicar Y novos consultores ativos.",
      "Manter um volume de vendas pessoal Z."
    ],
    benefits: [
      "Aumento no percentual de comissão direta.",
      "Início da participação em comissões de rede (Nível 1).",
      "Acesso a treinamentos avançados."
    ],
    nextStep: "Desenvolva sua equipe e mire o nível Master."
  },
  {
    name: "Consultor Master",
    icon: <Award className="w-8 h-8 text-primary mb-3" />,
    description: "Um líder em formação, com uma equipe produtiva e resultados expressivos.",
    requirements: [
      "Atingir um volume de vendas significativo na equipe.",
      "Ter Z consultores Sênior em sua downline.",
      "Participar ativamente de eventos e treinamentos."
    ],
    benefits: [
      "Comissões de rede em múltiplos níveis.",
      "Bônus de liderança e por metas de equipe.",
      "Reconhecimento e participação em eventos exclusivos."
    ],
    nextStep: "O nível Diamante é o ápice, com recompensas exponenciais."
  },
    {
    name: "Consultor Diamante",
    icon: <DollarSign className="w-8 h-8 text-primary mb-3" />,
    description: "O mais alto nível de reconhecimento e ganhos, um verdadeiro embaixador da SENT Energy.",
    requirements: [
      "Volume de vendas excepcional em toda a organização.",
      "Formar múltiplos líderes Master em sua downline.",
      "Contribuição estratégica para o crescimento da empresa."
    ],
    benefits: [
      "Maiores percentuais de comissão em todos os níveis.",
      "Bônus de participação nos lucros (hipotético).",
      "Viagens de incentivo e prêmios de alto valor."
    ],
    nextStep: "Consolidar seu legado e mentorar novos líderes."
  }
];

export default function CareerPlanPage() {
  return (
    <div className="relative flex flex-col min-h-[calc(100vh-56px)] items-center justify-start p-4 md:p-8 space-y-8">
      <header className="text-center">
        <Rocket className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tight">
          Sua Jornada de Crescimento na SENT Energy
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Acreditamos no seu potencial. Nosso plano de carreira é desenhado para recompensar seu esforço,
          dedicação e liderança, oferecendo oportunidades claras de progressão e ganhos exponenciais.
        </p>
      </header>

      <section className="w-full max-w-5xl space-y-6">
        <h2 className="text-3xl font-semibold text-center text-foreground">Nossos Níveis de Carreira</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerLevels.map((level) => (
            <Card key={level.name} className="bg-card/70 backdrop-blur-lg border shadow-xl flex flex-col">
              <CardHeader className="items-center text-center">
                {level.icon}
                <CardTitle className="text-2xl text-primary">{level.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="text-muted-foreground text-sm">{level.description}</p>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Requisitos para Alcançar:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {level.requirements.map((req, i) => <li key={i}>{req}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Benefícios do Nível:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {level.benefits.map((ben, i) => <li key={i}>{ben}</li>)}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                 <p className="text-xs text-primary font-medium italic w-full text-center">{level.nextStep}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full max-w-3xl text-center py-8">
        <h2 className="text-3xl font-semibold text-foreground mb-6">Explore Nossas Apresentações Detalhadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/plano-carreira/apresentacao" passHref>
            <Button size="lg" variant="outline" className="w-full bg-card/70 backdrop-blur-md hover:bg-accent/70 hover:text-accent-foreground border-primary/50">
              <Presentation className="mr-2 h-5 w-5" />
              Apresentação Completa
            </Button>
          </Link>
          <Link href="/plano-carreira/analise-mlm" passHref>
            <Button size="lg" variant="outline" className="w-full bg-card/70 backdrop-blur-md hover:bg-accent/70 hover:text-accent-foreground border-primary/50">
              <BarChart className="mr-2 h-5 w-5" />
              Análise do Modelo MLM
            </Button>
          </Link>
          <Link href="/plano-carreira/mlm-escalonado" passHref>
            <Button size="lg" variant="outline" className="w-full bg-card/70 backdrop-blur-md hover:bg-accent/70 hover:text-accent-foreground border-primary/50">
              <Pyramid className="mr-2 h-5 w-5" />
              Detalhes MLM Escalonado
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
