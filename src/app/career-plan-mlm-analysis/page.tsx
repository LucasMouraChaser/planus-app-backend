
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { ChevronLeft } from 'lucide-react';

// Tier data matching the HTML structure
const commissionTiers = [
  {
    name: "BRONZE",
    icon: "🥉",
    commissionRate: 40,
    requirements: "Nenhum",
    meta: "R$ 0 - R$ 19.999/mês",
    exampleClients: "10 clientes R$ 1.000",
    exampleMargin: 2500,
    bgColorClass: "bg-yellow-700/10",
    borderColorClass: "border-yellow-700",
    textColorClass: "text-yellow-600",
    get exampleGain() { return this.exampleMargin * (this.commissionRate / 100); }
  },
  {
    name: "PRATA",
    icon: "🥈",
    commissionRate: 50,
    requirements: "R$ 20K+/mês",
    meta: "R$ 20.000 - R$ 29.999/mês",
    exampleClients: "20 clientes R$ 1.000",
    exampleMargin: 5000,
    bgColorClass: "bg-slate-400/10",
    borderColorClass: "border-slate-400",
    textColorClass: "text-slate-400",
    get exampleGain() { return this.exampleMargin * (this.commissionRate / 100); }
  },
  {
    name: "OURO",
    icon: "🥇",
    commissionRate: 50,
    requirements: "R$ 30K+/mês",
    meta: "R$ 30.000+/mês",
    exampleClients: "30 clientes R$ 1.000",
    exampleMargin: 7500,
    bgColorClass: "bg-yellow-400/10",
    borderColorClass: "border-yellow-400",
    textColorClass: "text-yellow-400",
    get exampleGain() { return this.exampleMargin * (this.commissionRate / 100); }
  }
];

const clientTypesData = [
  {
    type: "🏠 RESIDENCIAL",
    consumption: "R$ 400 - R$ 1.000/mês",
    profile: "Casas, apartamentos, pequenos negócios familiares",
    margin: "R$ 100 - R$ 250",
    commissionBronze: "R$ 40 - R$ 100",
    commissionGold: "R$ 50 - R$ 125",
    strategy: "Foque em quantidade - são mais fáceis de fechar!",
    badgeBg: "bg-green-500/10",
    badgeText: "text-green-400",
    strategyBg: "bg-green-500/5"
  },
  {
    type: "🏪 MINI COMÉRCIOS",
    consumption: "R$ 2.000 - R$ 5.000/mês",
    profile: "Mercearias, padarias, distribuidoras pequenas",
    margin: "R$ 500 - R$ 1.250",
    commissionBronze: "R$ 200 - R$ 500",
    commissionGold: "R$ 250 - R$ 625",
    strategy: "Mostre o impacto da economia no lucro mensal!",
    badgeBg: "bg-sky-500/10",
    badgeText: "text-sky-400",
    strategyBg: "bg-sky-500/5"
  },
  {
    type: "🏬 COMÉRCIOS MÉDIOS",
    consumption: "R$ 5.000 - R$ 15.000/mês",
    profile: "Academias, mercados, açougues, sorveterias",
    margin: "R$ 1.250 - R$ 3.750",
    commissionBronze: "R$ 500 - R$ 1.500",
    commissionGold: "R$ 625 - R$ 1.875",
    strategy: "Foque na redução de custos operacionais!",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-400",
    strategyBg: "bg-amber-500/5"
  },
  {
    type: "🏭 SUPER COMÉRCIOS",
    consumption: "R$ 15.000+/mês",
    profile: "Mercados grandes, indústrias, grandes academias",
    margin: "R$ 3.750+",
    commissionBronze: "R$ 1.500+",
    commissionGold: "R$ 1.875+",
    strategy: "Apresente relatórios detalhados de economia!",
    badgeBg: "bg-yellow-400/10",
    badgeText: "text-yellow-300",
    strategyBg: "bg-yellow-400/5"
  }
];

const earningsScenarios = [
  { scenario: "🚀 Iniciante Focado", level: "Bronze", levelColor: "text-yellow-600", clientsPerMonth: "40 residenciais", avgTicket: "R$ 600", totalMargin: 25000, commission: 10000 },
  { scenario: "⚡ Estratégico Misto", level: "Prata", levelColor: "text-slate-400", clientsPerMonth: "20 res. + 10 mini", avgTicket: "R$ 1.200", totalMargin: 30000, commission: 15000 },
  { scenario: "🏆 Comercial Expert", level: "Ouro", levelColor: "text-yellow-400", clientsPerMonth: "15 médios + 5 grandes", avgTicket: "R$ 8.000", totalMargin: 48750, commission: 24000, highlight: true },
  { scenario: "💎 Master Premium", level: "Ouro", levelColor: "text-yellow-400", clientsPerMonth: "10 super + 20 médios", avgTicket: "R$ 12.000", totalMargin: 90000, commission: 45000 }
];

const strategyRanges = [
    { title: "💡 R$ 10K - R$ 20K/mês", focus: "Volume de residenciais + alguns mini comércios", dailyGoal: "2-3 clientes/dia", profile: "80% residencial, 20% mini comércio", avgTicket: "R$ 800", clientsPerMonth: "30-40", tip: "Use networking pessoal e indicações. Residenciais confiam mais em conhecidos!", accentColor: "primary" },
    { title: "🚀 R$ 20K - R$ 35K/mês", focus: "Equilíbrio estratégico", dailyGoal: "1-2 comércios médios", profile: "40% residencial, 60% comercial", avgTicket: "R$ 2.500", clientsPerMonth: "20-25", tip: "Desenvolva cases de sucesso para apresentar economia real aos comerciais!", accentColor: "green-500" },
    { title: "⚡ R$ 35K - R$ 45K/mês", focus: "Grandes contratos comerciais", dailyGoal: "1 grande contrato", profile: "20% residencial, 80% grande comércio", avgTicket: "R$ 8.000+", clientsPerMonth: "12-18", tip: "Invista em apresentações profissionais e relatórios detalhados de ROI!", accentColor: "amber-500" },
    { title: "💎 R$ 45K+/mês", focus: "Contratos premium e industriais", dailyGoal: "1 super contrato", profile: "100% grandes contratos", avgTicket: "R$ 15.000+", clientsPerMonth: "8-12", tip: "Torne-se especialista em indústrias específicas. Credibilidade é tudo!", accentColor: "yellow-400" }
];

const formatBRL = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export default function MlmAnalysisPage() {
  const [residentialClients, setResidentialClients] = useState(20);
  const [commercialClients, setCommercialClients] = useState(10);
  const [commissionLevel, setCommissionLevel] = useState(50);
  const [calculationResults, setCalculationResults] = useState<React.ReactNode>(null);

  const handleCalculateEarnings = () => {
    const residentialAvg = 600;
    const commercialAvg = 3000;
    
    const residentialMargin = residentialClients * (residentialAvg * 0.25);
    const commercialMargin = commercialClients * (commercialAvg * 0.25);
    const totalMargin = residentialMargin + commercialMargin;
    
    const totalCommission = totalMargin * (commissionLevel / 100);
    const totalYearly = totalCommission * 12;
    
    let nivel = 'Bronze';
    let nivelColor = 'text-yellow-600'; // Bronze
    if (commissionLevel === 50) {
        nivel = 'Prata/Ouro';
        nivelColor = 'text-yellow-400'; // Gold for Prata/Ouro
    }
    
    const totalClients = residentialClients + commercialClients;
    const avgGainPerClient = totalClients > 0 ? Math.round(totalCommission / totalClients) : 0;
    const dailyGoal = totalClients > 0 ? Math.ceil(totalClients / 22) : 0;

    setCalculationResults(
      <Card className="bg-slate-900/70 backdrop-blur-md border-slate-700 shadow-xl mt-6">
        <CardHeader>
          <CardTitle className="text-primary text-center text-xl">📊 SEUS GANHOS CALCULADOS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-lg font-bold ${nivelColor}`}>{nivel}</div>
              <div className="text-xs text-muted-foreground">Nível {commissionLevel}%</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">{totalClients}</div>
              <div className="text-xs text-muted-foreground">Total Clientes</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">R$ {formatBRL(totalMargin)}</div>
              <div className="text-xs text-muted-foreground">Margem Total</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-400">{commissionLevel}%</div>
              <div className="text-xs text-muted-foreground">Taxa Comissão</div>
            </div>
          </div>
          
          <div className="bg-green-500/10 border-2 border-green-400 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              R$ {formatBRL(totalCommission)}
            </div>
            <div className="text-muted-foreground text-md mb-2">GANHO MENSAL</div>
            <div className="text-lg font-semibold text-green-400">
              R$ {formatBRL(totalYearly)}/ano
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-sky-500/10 border-sky-400 p-4">
              <CardTitle className="text-sky-400 text-sm">🏠 Residenciais:</CardTitle>
              <ul className="text-xs text-muted-foreground list-disc list-inside pl-2">
                <li>{residentialClients} clientes × R$ {residentialAvg}</li>
                <li>Margem: R$ {formatBRL(residentialMargin)}</li>
                <li className="font-semibold">Comissão: R$ {formatBRL(residentialMargin * (commissionLevel / 100))}</li>
              </ul>
            </Card>
            <Card className="bg-amber-500/10 border-amber-400 p-4">
              <CardTitle className="text-amber-400 text-sm">🏢 Comerciais:</CardTitle>
              <ul className="text-xs text-muted-foreground list-disc list-inside pl-2">
                <li>{commercialClients} clientes × R$ {commercialAvg}</li>
                <li>Margem: R$ {formatBRL(commercialMargin)}</li>
                <li className="font-semibold">Comissão: R$ {formatBRL(commercialMargin * (commissionLevel / 100))}</li>
              </ul>
            </Card>
          </div>
          
          <Card className="bg-green-500/5 border-green-500/20 p-4">
            <CardTitle className="text-green-400 text-sm">💡 Análise de Performance:</CardTitle>
            <ul className="text-xs text-muted-foreground list-disc list-inside pl-2">
              <li>Ganho médio por cliente: <strong className="text-foreground">R$ {formatBRL(avgGainPerClient)}</strong></li>
              <li>Para dobrar a renda: adicione <strong className="text-foreground">{totalClients} clientes</strong></li>
              <li>Meta diária: <strong className="text-foreground">{dailyGoal} clientes/dia útil</strong></li>
            </ul>
          </Card>
        </CardContent>
      </Card>
    );
  };

  useEffect(() => {
    handleCalculateEarnings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residentialClients, commercialClients, commissionLevel]); // Recalculate when inputs change

  return (
    <div className="min-h-screen p-4 md:p-8 text-gray-100" style={{ background: '#0a0a0b' }}>
      <Link href="/career-plan" passHref className="absolute top-4 left-4 z-10">
        <Button variant="outline" size="sm" className="bg-slate-800/50 hover:bg-slate-700/70 border-slate-600 text-slate-300 hover:text-white">
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar ao Plano de Carreira
        </Button>
      </Link>

      <header className="text-center py-12 md:py-16">
        <div className="text-6xl mb-6" style={{ filter: "drop-shadow(0 0 20px rgba(0, 212, 255, 0.7))" }}>⚡</div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-3">
          PROMOTOR DE ENERGIA
        </h1>
        <p className="text-xl text-muted-foreground font-mono mb-8">// Ganhos Reais por Comissão Individual</p>
        <div className="inline-block bg-primary/10 border-2 border-primary rounded-full px-6 py-3 font-mono text-lg">
          <strong>COMISSÕES ATÉ 50%</strong> + Economia Real para Clientes
        </div>
      </header>

      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center text-primary">💡 COMO FUNCIONA A PROPOSTA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-md text-primary">
            <strong>🎯 MODELO SIMPLES E TRANSPARENTE:</strong> Você oferece economia de energia para o cliente e ganha comissão sobre a margem da empresa!
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-3">📊 ESTRUTURA DE GANHOS</h3>
              <div className="bg-green-500/5 p-4 rounded-md mb-4 text-sm leading-relaxed">
                <strong>1.</strong> Cliente paga <strong>R$ 1.000</strong> na conta atual<br/>
                <strong>2.</strong> Ofertamos <strong>25% de desconto</strong><br/>
                <strong>3.</strong> Cliente paga <strong>R$ 750</strong> conosco<br/>
                <strong>4.</strong> Margem da empresa: <strong>R$ 250</strong><br/>
                <strong>5.</strong> Sua comissão: <strong>40% a 50%</strong> da margem
              </div>
              <div className="bg-primary/10 p-3 rounded-md text-center">
                <strong className="text-primary text-md">Resultado: R$ 100 a R$ 125 por cliente</strong>
              </div>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">🚀 VANTAGENS DO MODELO</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside pl-2">
                <li>Cliente: 25% de economia garantida</li>
                <li>Você: Comissão sobre margem real</li>
                <li>Recorrente: Ganho mensal contínuo</li>
                <li>Escalável: Sem limite de clientes</li>
                <li>Transparente: Valores claros</li>
              </ul>
              <div className="bg-amber-500/10 p-3 rounded-md text-center mt-4">
                <strong className="text-amber-500 text-sm">🎯 Ganha-Ganha: Cliente economiza, você prospera!</strong>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center text-primary">💎 NÍVEIS DE COMISSÃO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {commissionTiers.map(tier => (
              <Card key={tier.name} className={`${tier.bgColorClass} ${tier.borderColorClass} border-2 p-6 text-center hover:shadow-2xl transition-shadow`}>
                <div className="text-4xl mb-3">{tier.icon}</div>
                <CardTitle className={`text-xl font-bold ${tier.textColorClass} mb-2`}>{tier.name}</CardTitle>
                <div className={`text-3xl font-bold ${tier.textColorClass} mb-3 font-mono`}>{tier.commissionRate}%</div>
                <p className="text-xs text-muted-foreground mb-3">
                  <strong>Requisitos:</strong> {tier.requirements}<br/>
                  <strong>Meta:</strong> {tier.meta}
                </p>
                <div className={`${tier.bgColorClass} p-3 rounded-md text-xs`}>
                  <strong>Exemplo:</strong><br/>
                  {tier.exampleClients} = R$ {formatBRL(tier.exampleMargin)} margem<br/>
                  <strong className={tier.textColorClass}>Seu ganho: R$ {formatBRL(tier.exampleGain)}</strong>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center text-primary">🏢 TIPOS DE CLIENTES E POTENCIAL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {clientTypesData.map(client => (
              <Card key={client.type} className="bg-slate-800/50 border-slate-700 p-4">
                <CardTitle className={`text-md font-semibold ${client.badgeText} mb-2`}>{client.type}</CardTitle>
                <div className={`${client.badgeBg} ${client.badgeText} inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2`}>
                  {client.consumption}
                </div>
                <p className="text-xs text-muted-foreground mb-1"><strong>Perfil:</strong> {client.profile}</p>
                <p className="text-xs text-muted-foreground mb-1"><strong>Margem:</strong> {client.margin}</p>
                <p className="text-xs text-muted-foreground mb-1"><strong>Comissão Bronze:</strong> {client.commissionBronze}</p>
                <p className="text-xs text-muted-foreground mb-3"><strong>Comissão Ouro:</strong> {client.commissionGold}</p>
                <div className={`${client.strategyBg} p-2 rounded-md text-xs`}>
                  <strong className={client.badgeText}>💡 Estratégia:</strong> {client.strategy}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center text-primary">💰 CENÁRIOS REAIS DE R$ 10K A R$ 50K</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-muted-foreground">Cenário</TableHead>
                  <TableHead className="text-center text-muted-foreground">Nível</TableHead>
                  <TableHead className="text-center text-muted-foreground">Clientes/Mês</TableHead>
                  <TableHead className="text-center text-muted-foreground">Ticket Médio</TableHead>
                  <TableHead className="text-right text-muted-foreground">Margem Total</TableHead>
                  <TableHead className="text-right text-muted-foreground">Sua Comissão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earningsScenarios.map(scenario => (
                  <TableRow key={scenario.scenario} className={`border-slate-800 ${scenario.highlight ? 'bg-primary/5' : ''}`}>
                    <TableCell className="font-semibold text-foreground">{scenario.scenario}</TableCell>
                    <TableCell className={`text-center ${scenario.levelColor}`}>{scenario.level}</TableCell>
                    <TableCell className="text-center">{scenario.clientsPerMonth}</TableCell>
                    <TableCell className="text-center">{scenario.avgTicket}</TableCell>
                    <TableCell className="text-right">R$ {formatBRL(scenario.totalMargin)}</TableCell>
                    <TableCell className={`text-right text-green-400 font-bold ${scenario.highlight ? 'text-lg' : ''}`}>R$ {formatBRL(scenario.commission)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-green-500/10 border-l-4 border-green-400 p-4 rounded-md mt-6 text-sm text-green-300">
            <strong>📈 CRESCIMENTO PROGRESSIVO:</strong> Comece com residenciais, evolua para comerciais e chegue aos grandes contratos. 
            Cada nível tem sua estratégia específica para maximizar ganhos!
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center text-primary">🎯 ESTRATÉGIAS POR FAIXA DE GANHO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {strategyRanges.map(range => (
              <Card key={range.title} className="bg-slate-800/50 border-slate-700 p-5">
                <CardTitle className={`text-lg font-semibold text-${range.accentColor} mb-3`}>{range.title}</CardTitle>
                <div className={`bg-${range.accentColor}/5 p-3 rounded-md mb-3 text-xs leading-relaxed`}>
                  <strong>FOCO:</strong> {range.focus}<br/>
                  <strong>Meta Diária:</strong> {range.dailyGoal}<br/>
                  <strong>Perfil Ideal:</strong> {range.profile}<br/>
                  <strong>Ticket Médio:</strong> {range.avgTicket}<br/>
                  <strong>Clientes/Mês:</strong> {range.clientsPerMonth}
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Dica:</strong> {range.tip}
                </p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center text-primary">🧮 CALCULADORA DE GANHOS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800/50 border-2 border-primary/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-primary mb-4 text-center">💰 Calcule Seu Potencial</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="residential-clients" className="text-sm text-muted-foreground">Clientes Residenciais:</Label>
                <Input 
                  type="number" 
                  id="residential-clients" 
                  value={residentialClients} 
                  onChange={(e) => setResidentialClients(Number(e.target.value))}
                  min="0" step="1" placeholder="Ex: 20" 
                  className="bg-slate-700 border-slate-600 text-foreground"
                />
                <small className="text-xs text-muted-foreground/70">Conta média: R$ 600</small>
              </div>
              <div>
                <Label htmlFor="commercial-clients" className="text-sm text-muted-foreground">Clientes Comerciais:</Label>
                <Input 
                  type="number" 
                  id="commercial-clients" 
                  value={commercialClients} 
                  onChange={(e) => setCommercialClients(Number(e.target.value))}
                  min="0" step="1" placeholder="Ex: 10"
                  className="bg-slate-700 border-slate-600 text-foreground"
                />
                <small className="text-xs text-muted-foreground/70">Conta média: R$ 3.000</small>
              </div>
              <div>
                <Label htmlFor="commission-level-select" className="text-sm text-muted-foreground">Seu Nível Atual:</Label>
                <Select 
                    value={String(commissionLevel)} 
                    onValueChange={(value) => setCommissionLevel(Number(value))}
                >
                    <SelectTrigger id="commission-level-select" className="bg-slate-700 border-slate-600 text-foreground">
                        <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-foreground">
                        <SelectItem value="40" className="hover:bg-slate-700">Bronze - 40%</SelectItem>
                        <SelectItem value="50" className="hover:bg-slate-700">Prata/Ouro - 50%</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCalculateEarnings} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-mono uppercase tracking-wider">
              Calcular Meus Ganhos
            </Button>
            <div id="calculation-results-container" className="mt-6">
              {calculationResults}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl">
        <CardHeader className="text-center">
            <div className="text-5xl mb-4" style={{ filter: "drop-shadow(0 0 20px rgba(0, 255, 136, 0.7))" }}>🎯</div>
            <CardTitle className="text-2xl md:text-3xl text-green-400">COMECE SUA JORNADA HOJE</CardTitle>
            <CardDescription className="text-muted-foreground">Ganhos reais, clientes satisfeitos, crescimento sustentável</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                    { title: "INICIE", icon: "🥉", target: "R$ 10K+", timeframe: "Primeiro mês", color: "yellow-600", border: "border-yellow-600" },
                    { title: "DESENVOLVA", icon: "🥈", target: "R$ 25K+", timeframe: "Em 3 meses", color: "slate-400", border: "border-slate-400" },
                    { title: "DOMINE", icon: "🥇", target: "R$ 45K+", timeframe: "Em 6 meses", color: "yellow-400", border: "border-yellow-400" },
                ].map(cta => (
                    <div key={cta.title} className={`bg-${cta.color}/10 border-2 ${cta.border} rounded-lg p-6 text-center`}>
                        <div className={`text-lg font-semibold text-${cta.color} mb-2`}>{cta.icon} {cta.title}</div>
                        <div className={`text-2xl font-bold text-${cta.color} mb-1`}>{cta.target}</div>
                        <p className="text-xs text-muted-foreground">{cta.timeframe}</p>
                    </div>
                ))}
            </div>
            <div className="text-center">
                <div className="inline-block bg-primary/10 border-2 border-primary rounded-full px-6 py-3 font-mono text-md text-primary">
                    <strong>PRÓXIMO PASSO:</strong> Agende sua conversa e descubra como começar
                </div>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}

