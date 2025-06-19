
"use client";

// Placeholder for /src/app/career-plan-mlm-escalonado/page.tsx
// Detailed content to be added based on specification.

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Zap, TrendingUp, Award, ShieldCheck, Gem, Gift, Users } from 'lucide-react';

interface EscalationStep {
  icon: React.ElementType;
  name: string;
  criteria: string[];
  benefits: string[];
  bonusExample?: string;
}

const escalationStepsData: EscalationStep[] = [
  {
    icon: Zap,
    name: "Bronze",
    criteria: ["Volume de equipe: R$ 10.000/mês", "2 Indicados Diretos Ativos"],
    benefits: ["+1% sobre comissão Nível 1", "Reconhecimento Bronze"],
    bonusExample: "Bônus de Avanço: R$ 200"
  },
  {
    icon: TrendingUp,
    name: "Prata",
    criteria: ["Volume de equipe: R$ 30.000/mês", "5 Indicados Diretos Ativos (1 Bronze)"],
    benefits: ["+2% sobre comissão Nível 1", "+1% sobre comissão Nível 2", "Treinamento de Liderança Prata"],
    bonusExample: "Bônus de Avanço: R$ 500"
  },
  {
    icon: Award,
    name: "Ouro",
    criteria: ["Volume de equipe: R$ 100.000/mês", "10 Indicados Diretos Ativos (2 Pratas)"],
    benefits: ["+3% sobre comissão Nível 1", "+2% sobre comissão Nível 2", "+1% sobre comissão Nível 3", "Participação em Pool de Bônus Ouro"],
    bonusExample: "Bônus de Avanço: R$ 1.500 + Pin Ouro"
  },
  {
    icon: ShieldCheck,
    name: "Platina",
    criteria: ["Volume de equipe: R$ 300.000/mês", "15 Indicados Diretos Ativos (2 Ouros)", "Formar 1 novo Master na equipe direta"],
    benefits: ["Comissões de rede maximizadas", "Bônus de Liderança Platina Trimestral", "Acesso a eventos internacionais"],
    bonusExample: "Bônus de Avanço: R$ 5.000 + Viagem Nacional"
  },
  {
    icon: Gem,
    name: "Diamante Escalonado",
    criteria: ["Volume de equipe: R$ 1.000.000/mês", "25 Indicados Diretos Ativos (3 Platinas)", "Desenvolvimento de novos líderes Diamante"],
    benefits: ["Participação nos Lucros da Empresa (anual)", "Bônus de Carro (condicional)", "Reconhecimento máximo Planus"],
    bonusExample: "Bônus de Avanço: R$ 20.000 + Viagem Internacional de Luxo"
  }
];

export default function CareerPlanMlmEscalonadoPage() {
  return (
    <div className="min-h-screen text-white p-4 md:p-8" style={{ background: '#000000' }}>
      <header className="mb-12 text-center">
        <Link href="/career-plan" passHref>
          <Button variant="outline" className="absolute top-4 left-4 bg-black text-white hover:bg-gray-800/80 border-gray-700">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar ao Plano de Carreira
          </Button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mt-16 mb-4">
          MLM Escalonado Planus: Suba de Nível!
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
          Nosso sistema escalonado é projetado para quem busca crescimento exponencial. A cada degrau, novas recompensas e um potencial de ganhos ainda maior.
        </p>
      </header>

      <section className="mb-16">
        <Card className="bg-gray-900/80 border-gray-700 shadow-xl text-white p-6 md:p-8 rounded-lg">
          <CardHeader className="items-center">
             <Award className="w-16 h-16 mb-4 text-primary" />
            <CardTitle className="text-3xl text-center text-primary">O Que é o MLM Escalonado Planus?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4 text-center md:text-lg">
              O MLM Escalonado da Planus Energia é um sistema de progressão avançado dentro da nossa estrutura de rede. Ele reconhece e recompensa líderes que não apenas constroem equipes largas, mas também profundas e produtivas. Ao atingir novos "degraus" baseados no desempenho da sua organização, você desbloqueia percentuais de comissão maiores, bônus exclusivos e reconhecimento especial. É a sua trilha para o topo!
            </p>
             <Image 
                src="https://placehold.co/700x400.png?text=Projecao+MLM+Escalonado" 
                alt="Gráfico de Projeção MLM Escalonado" 
                width={700} 
                height={400} 
                className="rounded-md shadow-md mx-auto mt-8"
                data-ai-hint="growth arrow chart steps"
              />
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center text-primary mb-10">Degraus do Sucesso Escalonado</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          {escalationStepsData.map((step) => (
            <Card key={step.name} className="bg-gray-900/80 border-gray-700 shadow-xl text-white flex flex-col">
              <CardHeader className="items-center text-center">
                <step.icon className="w-12 h-12 mb-3 text-primary" />
                <CardTitle className="text-2xl text-primary">{step.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-200 mb-1">Critérios para Alcançar:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-0.5">
                    {step.criteria.map((crit, i) => <li key={i}>{crit}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200 mb-1">Benefícios Adicionais:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-0.5">
                    {step.benefits.map((ben, i) => <li key={i}>{ben}</li>)}
                  </ul>
                </div>
                {step.bonusExample && (
                   <p className="text-sm text-yellow-400 mt-2"><Gift className="inline w-4 h-4 mr-1" /> {step.bonusExample}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <Card className="bg-gray-900/80 border-gray-700 shadow-xl text-white p-6 md:p-8 rounded-lg">
          <CardHeader className="items-center">
            <DollarSign className="w-12 h-12 mb-3 text-primary" />
            <CardTitle className="text-2xl text-center text-primary">Mecanismos de Bônus Escalonados</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Além das comissões de rede, o sistema escalonado oferece múltiplos bônus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption className="text-gray-500">Exemplos de bônus. Valores e condições podem variar.</TableCaption>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-primary">Tipo de Bônus</TableHead>
                  <TableHead className="text-primary">Descrição</TableHead>
                  <TableHead className="text-right text-primary">Exemplo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-gray-700">
                  <TableCell className="font-medium text-gray-200">Avanço de Título</TableCell>
                  <TableCell className="text-gray-300">Pagamento único ao atingir um novo degrau.</TableCell>
                  <TableCell className="text-right text-gray-300">R$ 200 a R$ 20.000+</TableCell>
                </TableRow>
                <TableRow className="border-gray-700">
                  <TableCell className="font-medium text-gray-200">Volume de Equipe</TableCell>
                  <TableCell className="text-gray-300">Percentual adicional sobre o volume total de vendas da sua organização.</TableCell>
                  <TableCell className="text-right text-gray-300">1-3% sobre VGV da rede</TableCell>
                </TableRow>
                <TableRow className="border-gray-700">
                  <TableCell className="font-medium text-gray-200">Liderança</TableCell>
                  <TableCell className="text-gray-300">Ganhos sobre o desenvolvimento de novos líderes na sua equipe.</TableCell>
                  <TableCell className="text-right text-gray-300">Matching Bônus, Bônus de Geração</TableCell>
                </TableRow>
                 <TableRow className="border-gray-700">
                  <TableCell className="font-medium text-gray-200">Pool Global</TableCell>
                  <TableCell className="text-gray-300">Participação em um percentual do faturamento global da empresa (para níveis altos).</TableCell>
                  <TableCell className="text-right text-gray-300">Variável</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <Card className="bg-gray-900/80 border-gray-700 shadow-xl text-white p-6 md:p-8 rounded-lg">
          <CardHeader className="items-center">
            <Users className="w-12 h-12 mb-3 text-primary" />
            <CardTitle className="text-2xl text-center text-primary">Estratégias para o Sucesso Escalonado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-300 text-center md:text-left">
            <p>🚀 <strong className="text-gray-100">Foco no Recrutamento Qualificado:</strong> Busque parceiros com perfil empreendedor e dispostos a aprender.</p>
            <p>📚 <strong className="text-gray-100">Treinamento e Duplicação:</strong> Ensine sua equipe a fazer o que você faz. O sucesso deles é o seu sucesso.</p>
            <p>🎯 <strong className="text-gray-100">Metas Claras e Acompanhamento:</strong> Defina metas para você e sua equipe e acompanhe o progresso regularmente.</p>
            <p>💡 <strong className="text-gray-100">Liderança pelo Exemplo:</strong> Mantenha-se ativo nas vendas diretas e no suporte à sua rede.</p>
            <p>🌐 <strong className="text-gray-100">Desenvolvimento Contínuo:</strong> Participe de todos os treinamentos e eventos da Planus Energia.</p>
          </CardContent>
        </Card>
      </section>

      <section className="text-center mt-12 mb-8">
        <Link href="/career-plan-mlm-analysis" passHref>
          <Button size="lg" variant="outline" className="bg-transparent text-primary border-primary hover:bg-primary/10 mr-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Análise MLM
          </Button>
        </Link>
         <Link href="/proposal-generator" passHref> {/* Placeholder link */}
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Iniciar Minha Jornada Agora!
          </Button>
        </Link>
      </section>
    </div>
  );
}
