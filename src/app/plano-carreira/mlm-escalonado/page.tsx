
// src/app/plano-carreira/mlm-escalonado/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, BarChartBig, Gem, Star, Trophy, Zap, Gift, TrendingUp as TrendingUpIcon, ArrowRightCircle, Network } from 'lucide-react';

const escalonadoLevels = [
  {
    name: "Bronze",
    icon: <Star className="w-10 h-10 text-yellow-600" />,
    criteria: ["Volume de Vendas da Equipe: R$ 20.000/mês", "2 Indicados Diretos Ativos"],
    benefits: ["+1% Comissão sobre Nível 1 (Total 6%)", "Bônus de Avanço: R$ 200"]
  },
  {
    name: "Prata",
    icon: <Gem className="w-10 h-10 text-slate-400" />,
    criteria: ["Volume de Vendas da Equipe: R$ 50.000/mês", "1 Consultor Bronze na equipe", "4 Indicados Diretos Ativos"],
    benefits: ["+2% Comissão sobre Nível 1 (Total 7%)", "+1% Comissão sobre Nível 2 (Total 4%)", "Bônus de Avanço: R$ 500"]
  },
  {
    name: "Ouro",
    icon: <Trophy className="w-10 h-10 text-yellow-400" />,
    criteria: ["Volume de Vendas da Equipe: R$ 150.000/mês", "2 Consultores Prata na equipe", "6 Indicados Diretos Ativos"],
    benefits: ["+3% Comissão sobre Nível 1 (Total 8%)", "+2% Comissão sobre Nível 2 (Total 5%)", "+1% Comissão sobre Nível 3 (Total 2%)", "Bônus de Avanço: R$ 1.500", "Participação em Treinamento de Liderança Avançado"]
  },
  {
    name: "Platina",
    icon: <Zap className="w-10 h-10 text-sky-400" />,
    criteria: ["Volume de Vendas da Equipe: R$ 500.000/mês", "2 Consultores Ouro na equipe", "Formar 1 novo Líder Master"],
    benefits: ["Comissões de rede maximizadas (Ex: 10% N1, 6% N2, 3% N3, 1% N4)", "Bônus de Volume Global (pool)", "Viagem de Incentivo Anual", "Bônus de Avanço: R$ 5.000"]
  }
];

const bonusTypes = [
    { name: "Bônus de Avanço de Título", description: "Pagamento único ao atingir um novo degrau (Bronze, Prata, etc.).", example: "Atingiu Prata? Ganhe R$500!" },
    { name: "Bônus de Volume de Equipe", description: "Percentual adicional sobre o volume total de vendas da sua equipe, conforme seu degrau.", example: "Equipe Ouro vendeu R$150k? Ganhe X% extra." },
    { name: "Bônus de Liderança", description: "Recompensa por desenvolver novos líderes (ex: formar um Consultor Prata ou Ouro) em sua downline.", example: "Seu indicado se tornou Ouro? Bônus de R$Y para você!" },
    { name: "Pool de Participação (Níveis Altos)", description: "Uma pequena porcentagem do faturamento total da empresa é dividida entre os consultores de mais alto nível (ex: Platina e acima).", example: "Platinas dividem 1% do faturamento da SENT."}
];

export default function CareerPlanMlmEscalonadoPage() {
  return (
    <div className="min-h-screen text-white p-4 md:p-8" style={{ backgroundColor: '#000000' }}>
      <div className="absolute top-4 left-4 z-10">
        <Link href="/plano-carreira" passHref>
          <Button variant="outline" size="sm" className="bg-gray-800/50 hover:bg-gray-700/70 border-gray-600 text-gray-300 hover:text-white">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar ao Plano
          </Button>
        </Link>
      </div>

      {/* O que é o MLM Escalonado */}
      <section className="text-center py-16 md:py-20">
        <BarChartBig className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6">
          MLM Escalonado SENT Energy: Potencialize Seus Ganhos!
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Nosso modelo Escalonado é projetado para quem busca crescimento acelerado e recompensas significativas.
          À medida que você e sua equipe avançam, seus ganhos e benefícios se multiplicam.
        </p>
      </section>

      {/* Estrutura dos Degraus */}
      <section className="py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-100 mb-10">Degraus do Sucesso: Sua Ascensão</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {escalonadoLevels.map((level) => (
            <Card key={level.name} className="bg-gray-900/70 backdrop-blur-sm border-gray-800 shadow-xl flex flex-col text-center hover:border-primary transition-all duration-300">
              <CardHeader className="items-center">
                {level.icon}
                <CardTitle className="text-2xl text-primary mt-2">{level.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 px-4 pb-4">
                <div>
                  <h4 className="font-semibold text-gray-300 mb-1 text-sm">Critérios para Alcançar:</h4>
                  <ul className="text-xs text-gray-400 space-y-0.5">
                    {level.criteria.map((crit, i) => <li key={i}>{crit}</li>)}
                  </ul>
                </div>
                <div className="pt-2">
                  <h4 className="font-semibold text-gray-300 mb-1 text-sm">Benefícios Adicionais:</h4>
                  <ul className="text-xs text-gray-400 space-y-0.5">
                    {level.benefits.map((ben, i) => <li key={i}>{ben}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
            <Image
                src="https://placehold.co/700x400.png?text=Projecao+MLM+Escalonado"
                alt="Gráfico de Projeção de Ganhos no MLM Escalonado"
                width={700}
                height={400}
                className="rounded-lg mx-auto shadow-md"
                data-ai-hint="growth arrow chart steps"
            />
        </div>
      </section>

      {/* Mecanismos de Bônus Escalonados */}
      <section className="py-12 md:py-16">
        <Card className="max-w-4xl mx-auto bg-gray-900/70 backdrop-blur-md border-gray-800 shadow-2xl text-gray-200 p-6 md:p-8">
            <CardHeader className="text-center p-0 mb-8">
                <Gift className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle className="text-3xl font-bold text-primary">Bônus Exclusivos do Plano Escalonado</CardTitle>
                <CardDescription className="text-gray-400">Recompensas extras que impulsionam seus resultados.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                {bonusTypes.map(bonus => (
                    <div key={bonus.name} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h4 className="text-xl font-semibold text-amber-400 mb-1">{bonus.name}</h4>
                        <p className="text-sm text-gray-300 mb-1">{bonus.description}</p>
                        <p className="text-xs text-gray-500 italic">Ex: {bonus.example}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
      </section>
      
      {/* Estratégias para o Sucesso */}
      <section className="py-12 md:py-16">
        <Card className="max-w-4xl mx-auto bg-gray-900/70 backdrop-blur-md border-gray-800 shadow-2xl text-gray-200 p-6 md:p-8">
            <CardHeader className="text-center p-0 mb-8">
                <TrendingUpIcon className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle className="text-3xl font-bold text-primary">Estratégias para o Sucesso no MLM Escalonado</CardTitle>
            </CardHeader>
            <CardContent className="p-0 grid md:grid-cols-2 gap-6 text-gray-300">
                <div>
                    <h4 className="text-xl font-semibold text-amber-400 mb-2">1. Recrutamento Inteligente</h4>
                    <p className="text-sm">Foque em atrair pessoas com perfil empreendedor e dispostas a aprender. Qualidade é melhor que quantidade no início.</p>
                </div>
                <div>
                    <h4 className="text-xl font-semibold text-amber-400 mb-2">2. Treinamento e Duplicação</h4>
                    <p className="text-sm">Capacite seus indicados com o conhecimento e as ferramentas que você recebeu. O sucesso deles é o seu sucesso.</p>
                </div>
                <div>
                    <h4 className="text-xl font-semibold text-amber-400 mb-2">3. Liderança pelo Exemplo</h4>
                    <p className="text-sm">Mantenha-se ativo nas vendas pessoais e demonstre os comportamentos que você espera da sua equipe.</p>
                </div>
                <div>
                    <h4 className="text-xl font-semibold text-amber-400 mb-2">4. Metas Claras e Acompanhamento</h4>
                    <p className="text-sm">Defina metas para você e sua equipe. Acompanhe o progresso regularmente e celebre as conquistas.</p>
                </div>
            </CardContent>
            <CardFooter className="mt-8 text-center">
                <p className="text-gray-400 text-sm w-full">A SENT Energy oferece todo o suporte para você implementar estas estratégias e alcançar o topo!</p>
            </CardFooter>
        </Card>
      </section>

      {/* Recursos Visuais Adicionais (Placeholder) */}
      <section className="py-12 md:py-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-100 mb-6">Visualize Sua Trajetória</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <Image
                src="https://placehold.co/400x500.png?text=Escada+do+Sucesso+MLM"
                alt="Diagrama da Escada do Sucesso MLM"
                width={400}
                height={500}
                className="rounded-lg shadow-md"
                data-ai-hint="pyramid diagram steps"
            />
            <Image
                src="https://placehold.co/400x300.png?text=Premios+por+Nivel"
                alt="Ícones de Prêmios por Nível"
                width={400}
                height={300}
                className="rounded-lg shadow-md"
                data-ai-hint="awards trophy icons"
            />
          </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto para Escalar Seus Ganhos?</h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          O modelo MLM Escalonado é a sua via rápida para um futuro financeiro extraordinário com a SENT Energy.
        </p>
         <Link href="/contato" passHref> {/* TODO: Link para página de cadastro ou contato específico */}
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-3 text-lg">
                Quero Aderir ao Plano Escalonado!
                <ArrowRightCircle className="ml-2 h-5 w-5" />
            </Button>
        </Link>
      </section>
    </div>
  );
}
