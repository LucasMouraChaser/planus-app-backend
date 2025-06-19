
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChevronLeft } from 'lucide-react';

const formatBRL = (value: number | null | undefined, includeSymbol = true): string => {
  if (value === null || value === undefined || isNaN(value)) return includeSymbol ? "R$ 0,00" : "0,00";
  return value.toLocaleString('pt-BR', { 
    style: includeSymbol ? 'currency' : 'decimal', 
    currency: 'BRL', 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

const parseInputNumber = (value: string): number => {
  return parseInt(value, 10) || 0;
};


export default function MlmEscalonadoPage() {
  const [personalSales, setPersonalSales] = useState(40000);
  const [nivel1Count, setNivel1Count] = useState(2);
  const [nivel1Sales, setNivel1Sales] = useState(35000);
  const [nivel2Count, setNivel2Count] = useState(3);
  const [nivel2Sales, setNivel2Sales] = useState(25000);
  const [nivel3Count, setNivel3Count] = useState(3);
  const [nivel3Sales, setNivel3Sales] = useState(25000);
  const [temOuroNivel3, setTemOuroNivel3] = useState(true);
  const [nivel4Count, setNivel4Count] = useState(3);
  const [nivel4Sales, setNivel4Sales] = useState(22000);

  const [calculationResults, setCalculationResults] = useState<React.ReactNode>(null);

  useEffect(() => {
    const calculateMLMEscalonado = () => {
        let calculatedPersonalCommission: number;
        if (personalSales >= 30000 && (nivel1Count > 0 || nivel2Count > 0 || nivel3Count > 0 || (temOuroNivel3 && nivel4Count > 0) )) {
            calculatedPersonalCommission = personalSales * 0.5;
        } else if (personalSales >= 20000) {
            calculatedPersonalCommission = personalSales * 0.5;
        } else {
            calculatedPersonalCommission = personalSales * 0.4;
        }

        let calculatedNivel1Override = 0;
        let calculatedNivel2Override = 0;
        let calculatedNivel3Override = 0;
        let calculatedNivel4Override = 0;

        if (personalSales >= 30000) {
            calculatedNivel1Override = nivel1Count * nivel1Sales * 0.05;
            calculatedNivel2Override = nivel2Count * nivel2Sales * 0.03;
            calculatedNivel3Override = nivel3Count * nivel3Sales * 0.02;
            if (temOuroNivel3) {
                calculatedNivel4Override = nivel4Count * nivel4Sales * 0.01;
            }
        }

        const totalOverride = calculatedNivel1Override + calculatedNivel2Override + calculatedNivel3Override + calculatedNivel4Override;
        const totalMonthly = calculatedPersonalCommission + totalOverride;
        const totalYearly = totalMonthly * 12;

        let nivel = 'Bronze';
        let nivelColorClass = 'text-yellow-600'; // Bronze
        if (personalSales >= 30000 && totalOverride > 0) {
            nivel = 'Ouro';
            nivelColorClass = 'text-yellow-400'; // Gold
        } else if (personalSales >= 20000) {
            nivel = 'Prata';
            nivelColorClass = 'text-slate-400'; // Silver
        }

        const totalPessoas = nivel1Count + nivel2Count + nivel3Count + (temOuroNivel3 ? nivel4Count : 0);
        const roiPerPessoa = totalPessoas > 0 ? Math.round(totalOverride / totalPessoas * 12) : 0;

        setCalculationResults(
        <Card className="bg-slate-900/70 backdrop-blur-md border-primary/30 shadow-xl mt-6">
            <CardHeader>
            <CardTitle className="text-primary text-center text-xl">🚀 SIMULAÇÃO MLM 4 NÍVEIS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                <div className={`text-lg font-bold ${nivelColorClass}`}>{nivel}</div>
                <div className="text-xs text-muted-foreground">Seu Nível</div>
                </div>
                <div>
                <div className="text-lg font-bold text-green-400">{formatBRL(calculatedPersonalCommission)}</div>
                <div className="text-xs text-muted-foreground">Comissão Direta</div>
                </div>
                <div>
                <div className="text-lg font-bold text-sky-400">{formatBRL(totalOverride)}</div>
                <div className="text-xs text-muted-foreground">Override Total</div>
                </div>
                <div>
                <div className="text-lg font-bold text-amber-400">{totalPessoas}</div>
                <div className="text-xs text-muted-foreground">Total na Rede</div>
                </div>
            </div>

            <div className="bg-green-500/10 border-2 border-green-400 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                {formatBRL(totalMonthly)}
                </div>
                <div className="text-muted-foreground text-md mb-2">GANHO MENSAL TOTAL</div>
                <div className="text-lg font-semibold text-green-400">
                {formatBRL(totalYearly)}/ano
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-green-500/10 border-green-400/50 p-3">
                        <CardTitle className="text-green-400 text-sm font-semibold mb-1">🎯 Nível 1 (5%)</CardTitle>
                        <p className="text-xs text-muted-foreground">{nivel1Count} pessoas × {formatBRL(nivel1Sales)}</p>
                        <p className="text-green-400 font-bold text-base">{formatBRL(calculatedNivel1Override)}/mês</p>
                    </Card>
                    <Card className="bg-sky-500/10 border-sky-400/50 p-3">
                        <CardTitle className="text-sky-400 text-sm font-semibold mb-1">🔥 Nível 2 (3%)</CardTitle>
                        <p className="text-xs text-muted-foreground">{nivel2Count} pessoas × {formatBRL(nivel2Sales)}</p>
                        <p className="text-sky-400 font-bold text-base">{formatBRL(calculatedNivel2Override)}/mês</p>
                    </Card>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <Card className="bg-amber-500/10 border-amber-400/50 p-3">
                        <CardTitle className="text-amber-400 text-sm font-semibold mb-1">⚡ Nível 3 (2%)</CardTitle>
                        <p className="text-xs text-muted-foreground">{nivel3Count} pessoas × {formatBRL(nivel3Sales)}</p>
                        <p className="text-amber-400 font-bold text-base">{formatBRL(calculatedNivel3Override)}/mês</p>
                    </Card>
                    <Card className={`p-3 ${temOuroNivel3 ? 'bg-slate-500/10 border-slate-400/50' : 'bg-slate-700/20 border-slate-600/30 opacity-60'}`}>
                        <CardTitle className={`text-sm font-semibold mb-1 ${temOuroNivel3 ? 'text-slate-400' : 'text-muted-foreground'}`}>💫 Nível 4 (1%)</CardTitle>
                        <p className="text-xs text-muted-foreground">{temOuroNivel3 ? nivel4Count : 0} pessoas × {formatBRL(temOuroNivel3 ? nivel4Sales : 0)}</p>
                        <p className={`font-bold text-base ${temOuroNivel3 ? 'text-slate-400' : 'text-muted-foreground'}`}>{formatBRL(calculatedNivel4Override)}/mês</p>
                        {!temOuroNivel3 && <p className="text-xs text-muted-foreground/70 mt-1">Requer OURO no Nível 3</p>}
                    </Card>
                </div>
            </div>

            <Card className="bg-primary/10 border-primary/30 p-4 mt-4">
                <CardTitle className="text-primary text-center text-base mb-2">📈 ANÁLISE DE PERFORMANCE</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                    <strong className="text-foreground">ROI por pessoa na rede:</strong><br />
                    <span className="text-green-400 font-semibold">{formatBRL(roiPerPessoa)}/ano</span>
                </div>
                <div>
                    <strong className="text-foreground">Status Nível 4:</strong><br />
                    <span className={`${temOuroNivel3 ? 'text-green-400' : 'text-amber-400'} font-semibold`}>
                    {temOuroNivel3 ? '✅ ATIVO (OURO no Nível 3)' : '⏳ INATIVO (Sem OURO no Nível 3)'}
                    </span>
                </div>
                </div>
                {temOuroNivel3 ? (
                <div className="bg-green-500/10 p-3 rounded-md mt-3">
                    <strong className="text-green-400 text-xs">🎯 Vantagem do Nível 4:</strong><br />
                    <span className="text-muted-foreground text-xs">
                    Parabéns! Você desbloqueou o nível 4 por ter OURO no nível 3. Isso significa +{formatBRL(calculatedNivel4Override)}/mês extras!
                    </span>
                </div>
                ) : (
                <div className="bg-amber-500/10 p-3 rounded-md mt-3">
                    <strong className="text-amber-400 text-xs">🎯 Como ativar o Nível 4:</strong><br />
                    <span className="text-muted-foreground text-xs">
                    Desenvolva pelo menos 1 recruta do nível 3 para OURO (R$ 30K+ vendas + equipe). Isso desbloqueará o nível 4!
                    </span>
                </div>
                )}
            </Card>
            </CardContent>
        </Card>
        );
    };

    calculateMLMEscalonado();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalSales, nivel1Count, nivel1Sales, nivel2Count, nivel2Sales, nivel3Count, nivel3Sales, temOuroNivel3, nivel4Count, nivel4Sales]);

  return (
    <div className="min-h-screen text-white p-4 md:p-8" style={{ background: '#000000' }}>
      <Link href="/career-plan" passHref className="absolute top-4 left-4 z-10">
        <Button variant="outline" size="sm" className="bg-gray-800/50 hover:bg-gray-700/70 border-gray-600 text-gray-300 hover:text-white">
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar ao Plano
        </Button>
      </Link>

      <header className="text-center py-12 md:py-16">
        <div className="text-6xl mb-6" style={{ filter: "drop-shadow(0 0 20px rgba(0, 212, 255, 0.7))" }}>🚀</div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-3">
          SUA JORNADA DE SUCESSO
        </h1>
        <p className="text-xl text-muted-foreground font-mono mb-8">// Sistema MLM com Estrutura Escalonada</p>
        <div className="inline-block bg-primary/10 border-2 border-primary rounded-full px-6 py-3 font-mono text-lg">
          <strong>COMISSÕES ATÉ 50%</strong> + Override MLM 11%: 5% → 3% → 2% → 1%
        </div>
      </header>

      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center text-primary">💎 NÍVEIS DE COMISSÃO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-yellow-700/10 border-2 border-yellow-700 p-6 text-center hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-3">🥉</div>
              <CardTitle className="text-xl font-bold text-yellow-600 mb-2">BRONZE</CardTitle>
              <div className="text-3xl font-bold text-yellow-600 mb-3 font-mono">40%</div>
              <p className="text-xs text-muted-foreground mb-3">
                <strong>Requisitos:</strong> Nenhum<br />
                <strong>Benefícios:</strong> Comissão direta sobre vendas
              </p>
              <div className="bg-yellow-700/10 p-3 rounded-md text-xs">
                <strong>Exemplo:</strong><br />
                Venda R$ 20.000 → <strong className="text-yellow-600">Ganho: R$ 8.000</strong>
              </div>
            </Card>
            <Card className="bg-slate-400/10 border-2 border-slate-400 p-6 text-center hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-3">🥈</div>
              <CardTitle className="text-xl font-bold text-slate-400 mb-2">PRATA</CardTitle>
              <div className="text-3xl font-bold text-slate-400 mb-3 font-mono">50%</div>
              <p className="text-xs text-muted-foreground mb-3">
                <strong>Requisitos:</strong> R$ 20K em vendas<br />
                <strong>Benefícios:</strong> +25% na comissão
              </p>
              <div className="bg-slate-400/10 p-3 rounded-md text-xs">
                <strong>Exemplo:</strong><br />
                Venda R$ 20.000 → <strong className="text-slate-400">Ganho: R$ 10.000</strong>
              </div>
            </Card>
            <Card className="bg-yellow-400/10 border-2 border-yellow-400 p-6 text-center hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-3">🥇</div>
              <CardTitle className="text-xl font-bold text-yellow-400 mb-2">OURO</CardTitle>
              <div className="text-3xl font-bold text-yellow-400 mb-3 font-mono">50% + MLM</div>
              <p className="text-xs text-muted-foreground mb-3">
                <strong>Requisitos:</strong> R$ 30K + equipe<br />
                <strong>Benefícios:</strong> Sistema Multinível
              </p>
              <div className="bg-yellow-400/10 p-3 rounded-md text-xs">
                <strong>Potencial:</strong><br />
                <strong className="text-yellow-400">Renda Ilimitada!</strong>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center text-primary">🔺 ESTRUTURA MLM - SISTEMA ESCALONADO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-sky-500/10 border-l-4 border-sky-500 p-4 rounded-md text-sm text-sky-300 mb-6">
            <strong>💡 Estrutura Otimizada:</strong> Sistema baseado na imagem fornecida com 11% total de override distribuído em 4 níveis: 5% → 3% → 2% → 1% para máxima rentabilidade e sustentabilidade.
          </div>
          <div className="bg-slate-800/50 border-2 border-yellow-400/30 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">👑 VOCÊ - LÍDER OURO</h3>
            <Card className="inline-block bg-yellow-400/10 border-2 border-yellow-400 p-4 min-w-[180px]">
                <div className="text-3xl mb-1">👑</div>
                <p className="text-base font-semibold text-yellow-400">VOCÊ</p>
                <p className="text-xs text-muted-foreground">R$ 40.000/mês</p>
                <p className="text-lg font-bold text-green-400">R$ 20.000</p>
                <p className="text-xs text-muted-foreground">50% comissão</p>
            </Card>

            {/* Nível 1 */}
            <div className="mt-6">
                <div className="bg-green-500/80 text-black px-4 py-1 rounded-full inline-block text-xs font-bold mb-2">NÍVEL 1 - OVERRIDE 5%</div>
                <div className="flex flex-wrap justify-center gap-4">
                    <Card className="bg-sky-500/10 border-2 border-sky-500 p-3 min-w-[160px] relative">
                        <Badge className="absolute top-1 right-1 bg-green-500 text-xs">5%</Badge>
                        <p className="text-2xl mb-1">👨‍💼</p>
                        <p className="text-sm font-semibold text-sky-400">OURO 1</p>
                        <p className="text-xs text-muted-foreground">R$ 35.000/mês</p>
                        <p className="text-sm font-bold text-green-400">+R$ 1.750</p>
                        <p className="text-[10px] text-muted-foreground/70">Override para você</p>
                    </Card>
                    <Card className="bg-sky-500/10 border-2 border-sky-500 p-3 min-w-[160px] relative">
                         <Badge className="absolute top-1 right-1 bg-green-500 text-xs">5%</Badge>
                        <p className="text-2xl mb-1">👩‍💼</p>
                        <p className="text-sm font-semibold text-sky-400">OURO 2</p>
                        <p className="text-xs text-muted-foreground">R$ 35.000/mês</p>
                        <p className="text-sm font-bold text-green-400">+R$ 1.750</p>
                        <p className="text-[10px] text-muted-foreground/70">Override para você</p>
                    </Card>
                </div>
            </div>
            {/* Adicionar setas/conexões visuais aqui se desejado, ou manter simples */}
            
            {/* Nível 2 */}
             <div className="mt-6">
                <div className="bg-sky-500/80 text-black px-4 py-1 rounded-full inline-block text-xs font-bold mb-2">NÍVEL 2 - OVERRIDE 3%</div>
                <div className="flex flex-wrap justify-center gap-4">
                    {[...Array(3)].map((_, i) => (
                         <Card key={`n2-${i}`} className={`${i < 2 ? 'bg-yellow-700/10 border-yellow-700' : 'bg-sky-500/10 border-sky-500'} border-2 p-3 min-w-[150px] relative`}>
                            <Badge className="absolute top-1 right-1 bg-sky-500 text-xs">3%</Badge>
                            <p className="text-xl mb-1">{i < 2 ? '🥉' : '👨‍💼'}</p>
                            <p className={`text-xs font-semibold ${i < 2 ? 'text-yellow-600' : 'text-sky-400'}`}>{i < 2 ? `BRONZE ${i+1}` : 'OURO 1'}</p>
                            <p className="text-[10px] text-muted-foreground">{i < 2 ? 'R$ 22.000/mês' : 'R$ 35.000/mês'}</p>
                            <p className="text-xs font-bold text-green-400">+{formatBRL( (i < 2 ? 22000 : 35000) * 0.03, false)}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Nível 3 */}
            <div className="mt-6">
                <div className="bg-amber-500/80 text-black px-4 py-1 rounded-full inline-block text-xs font-bold mb-2">NÍVEL 3 - OVERRIDE 2%</div>
                 <div className="flex flex-wrap justify-center gap-4">
                     {[...Array(3)].map((_, i) => (
                        <Card key={`n3-${i}`} className={`${i < 2 ? 'bg-yellow-700/10 border-yellow-700' : 'bg-sky-500/10 border-sky-500'} border-2 p-2 min-w-[140px] relative text-[10px]`}>
                            <Badge className="absolute top-1 right-1 bg-amber-500 text-[9px] px-1 py-0">2%</Badge>
                            <p className="text-lg mb-0.5">{i < 2 ? '🥉' : '👨‍💼'}</p>
                            <p className={`font-semibold ${i < 2 ? 'text-yellow-600' : 'text-sky-400'}`}>{i < 2 ? `BRONZE ${i+1}` : 'OURO 1'}</p>
                            <p className="text-muted-foreground/80">{i < 2 ? 'R$ 22.000/mês' : 'R$ 35.000/mês'}</p>
                            <p className="font-bold text-green-400/90 text-xs">+{formatBRL( (i < 2 ? 22000 : 35000) * 0.02, false)}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Nível 4 */}
            <div className="mt-6">
                <div className="bg-slate-500 text-white px-4 py-1 rounded-full inline-block text-xs font-bold mb-2">NÍVEL 4 - OVERRIDE 1% (Requer OURO no Nível 3)</div>
                 <div className="flex flex-wrap justify-center gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={`n4-${i}`} className="bg-yellow-700/10 border-yellow-700 border-2 p-2 min-w-[140px] relative text-[10px]">
                            <Badge className="absolute top-1 right-1 bg-slate-500 text-[9px] px-1 py-0">1%</Badge>
                            <p className="text-lg mb-0.5">🥉</p>
                            <p className="font-semibold text-yellow-600">{`BRONZE ${i+1}`}</p>
                            <p className="text-muted-foreground/80">R$ 22.000/mês</p>
                            <p className="font-bold text-green-400/90 text-xs">+{formatBRL(22000 * 0.01, false)}</p>
                        </Card>
                    ))}
                </div>
            </div>
            
            <Card className="bg-green-500/10 border-2 border-green-400 rounded-lg p-6 mt-8 text-center">
                <h4 className="text-green-400 text-lg font-semibold mb-2">💰 TOTAL DE OVERRIDE NESTE EXEMPLO</h4>
                <div className="text-4xl font-bold text-green-400 mb-1 font-mono">
                    R$ 7.990
                </div>
                <p className="text-muted-foreground text-sm mb-2">Override mensal da rede (4 níveis) - Total 11%</p>
                <div className="text-2xl font-semibold text-green-400">
                    R$ 27.990 ganho total/mês
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                    (R$ 20.000 próprio + R$ 7.990 override)
                </p>
                <div className="bg-sky-500/10 p-3 rounded-md text-xs text-left">
                    <strong className="text-primary">Breakdown por Nível (11% total):</strong><br />
                    <span className="text-muted-foreground">
                        Nível 1: R$ 3.500 (5%) | Nível 2: R$ 1.320 (3%) | Nível 3: R$ 1.580 (2%) | Nível 4: R$ 660 (1%)<br />
                        <strong>Nível 4 ativo graças ao OURO no nível 3!</strong>
                    </span>
                </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center text-primary">🧮 CALCULADORA MLM ESCALONADA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800/50 border-2 border-primary/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-primary mb-4 text-center">💰 Sistema MLM 11%: 5% → 3% → 2% → 1%</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="personal-sales" className="text-sm text-muted-foreground">Suas Vendas Mensais (R$):</Label>
                <Input type="number" id="personal-sales" value={personalSales} onChange={e => setPersonalSales(parseInputNumber(e.target.value))} min="0" step="1000" placeholder="Ex: 40000" className="bg-slate-700 border-slate-600 text-foreground" />
                <small className="text-xs text-muted-foreground/70">Para ativar MLM: mín. R$ 30K</small>
              </div>
              <div>
                <Label htmlFor="nivel1-count" className="text-sm text-muted-foreground">Nível 1 (5%) - Recrutas Diretos:</Label>
                <Input type="number" id="nivel1-count" value={nivel1Count} onChange={e => setNivel1Count(parseInputNumber(e.target.value))} min="0" max="20" placeholder="Ex: 2" className="bg-slate-700 border-slate-600 text-foreground mb-1" />
                <Input type="number" id="nivel1-sales" value={nivel1Sales} onChange={e => setNivel1Sales(parseInputNumber(e.target.value))} min="0" step="1000" placeholder="Vendas médias/recruta" className="bg-slate-700 border-slate-600 text-foreground" />
              </div>
              <div>
                <Label htmlFor="nivel2-count" className="text-sm text-muted-foreground">Nível 2 (3%) - Sub-recrutas:</Label>
                <Input type="number" id="nivel2-count" value={nivel2Count} onChange={e => setNivel2Count(parseInputNumber(e.target.value))} min="0" max="50" placeholder="Ex: 3" className="bg-slate-700 border-slate-600 text-foreground mb-1" />
                <Input type="number" id="nivel2-sales" value={nivel2Sales} onChange={e => setNivel2Sales(parseInputNumber(e.target.value))} min="0" step="1000" placeholder="Vendas médias/recruta" className="bg-slate-700 border-slate-600 text-foreground" />
              </div>
            </div>
             <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <Label htmlFor="nivel3-count" className="text-sm text-muted-foreground">Nível 3 (2%) - Rede Profunda:</Label>
                    <Input type="number" id="nivel3-count" value={nivel3Count} onChange={e => setNivel3Count(parseInputNumber(e.target.value))} min="0" max="100" placeholder="Ex: 3" className="bg-slate-700 border-slate-600 text-foreground mb-1" />
                    <Input type="number" id="nivel3-sales" value={nivel3Sales} onChange={e => setNivel3Sales(parseInputNumber(e.target.value))} min="0" step="1000" placeholder="Vendas médias/recruta" className="bg-slate-700 border-slate-600 text-foreground" />
                    <div className="flex items-center space-x-2 mt-2">
                        <Checkbox id="nivel3-tem-ouro" checked={temOuroNivel3} onCheckedChange={(checked) => setTemOuroNivel3(Boolean(checked))} />
                        <Label htmlFor="nivel3-tem-ouro" className="text-xs text-muted-foreground">Tem OURO no Nível 3? (Ativa Nível 4)</Label>
                    </div>
                </div>
                <div>
                    <Label htmlFor="nivel4-count" className="text-sm text-muted-foreground">Nível 4 (1%) - Só com OURO no Nível 3:</Label>
                    <Input type="number" id="nivel4-count" value={nivel4Count} onChange={e => setNivel4Count(parseInputNumber(e.target.value))} min="0" max="100" placeholder="Ex: 3" disabled={!temOuroNivel3} className="bg-slate-700 border-slate-600 text-foreground mb-1 disabled:opacity-50" />
                    <Input type="number" id="nivel4-sales" value={nivel4Sales} onChange={e => setNivel4Sales(parseInputNumber(e.target.value))} min="0" step="1000" placeholder="Vendas médias/recruta" disabled={!temOuroNivel3} className="bg-slate-700 border-slate-600 text-foreground disabled:opacity-50" />
                     <Card className="bg-amber-500/10 border-amber-400/50 p-2 mt-2">
                        <p className="text-xs text-muted-foreground">
                            <strong>Regra Especial:</strong> Nível 4 (1%) só é ativado se houver OURO no nível 3.
                        </p>
                    </Card>
                </div>
            </div>
             <Card className="bg-primary/10 p-3 rounded-md text-xs mb-4">
                <strong className="text-primary">Estrutura Completa MLM (Total 11%):</strong><br />
                <span className="text-muted-foreground">
                    • 2-5 recrutas diretos (nível 1 - 5%)<br />
                    • 3-8 sub-recrutas (nível 2 - 3%)<br />
                    • 3-10 rede profunda (nível 3 - 2%)<br />
                    • 3-15 rede OURO (nível 4 - 1% - requer OURO no nível 3)<br />
                    • Total disponível: 11% de override distribuído estrategicamente
                </span>
            </Card>
            {/* Botão Calcular removido, cálculo é automático */}
            <div id="mlm-results-container" className="mt-6">
              {calculationResults}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl mb-10">
        <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center text-primary">📊 CENÁRIOS REAIS MLM 4 NÍVEIS (11% Total)</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
            {/* Cenário Iniciante */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
                <CardTitle className="text-lg font-semibold text-primary mb-2">🚀 Cenário Iniciante</CardTitle>
                <div className="space-y-1 text-xs">
                    <div className="bg-primary/10 p-2 rounded"><strong className="text-foreground">Suas vendas:</strong> R$ 40.000 (R$ 20.000 comissão)</div>
                    <div className="bg-green-500/10 p-2 rounded"><strong className="text-foreground">Nível 1 (5%):</strong> 2 × R$ 35K = +R$ 3.500</div>
                    <div className="bg-amber-500/10 p-2 rounded"><strong className="text-foreground">Nível 2 (3%):</strong> 3 × R$ 25K = +R$ 2.250</div>
                    <div className="bg-slate-500/10 p-2 rounded">
                        <strong className="text-foreground">Nível 3 (2%):</strong> 2 × R$ 22K = +R$ 880<br />
                        <span className="text-muted-foreground/70">Nível 4 (1%): Inativo (sem OURO nível 3)</span><br />
                        <strong className="text-green-400">Total mensal: R$ 26.630</strong>
                    </div>
                </div>
                <p className="text-xl font-bold text-primary mt-3 text-center">R$ 320K</p>
                <p className="text-xs text-muted-foreground text-center uppercase">Potencial anual</p>
            </Card>
             {/* Cenário Intermediário */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
                <CardTitle className="text-lg font-semibold text-green-400 mb-2">⚡ Cenário Intermediário</CardTitle>
                 <div className="space-y-1 text-xs">
                    <div className="bg-primary/10 p-2 rounded"><strong className="text-foreground">Suas vendas:</strong> R$ 50.000 (R$ 25.000 comissão)</div>
                    <div className="bg-green-500/10 p-2 rounded"><strong className="text-foreground">Nível 1 (5%):</strong> 4 × R$ 40K = +R$ 8.000</div>
                    <div className="bg-amber-500/10 p-2 rounded"><strong className="text-foreground">Nível 2 (3%):</strong> 6 × R$ 30K = +R$ 5.400</div>
                    <div className="bg-slate-500/10 p-2 rounded">
                        <strong className="text-foreground">Nível 3 (2%):</strong> 1 OURO + 2 Bronze = +R$ 1.580<br />
                        <strong className="text-foreground">Nível 4 (1%):</strong> 3 × R$ 22K = +R$ 660<br />
                        <span className="text-green-400/80">✅ Nível 4 ATIVO!</span><br />
                        <strong className="text-green-400">Total mensal: R$ 40.640</strong>
                    </div>
                </div>
                <p className="text-xl font-bold text-green-400 mt-3 text-center">R$ 488K</p>
                <p className="text-xs text-muted-foreground text-center uppercase">Potencial anual</p>
            </Card>
            {/* Cenário Elite */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
                <CardTitle className="text-lg font-semibold text-amber-400 mb-2">🏆 Cenário Elite</CardTitle>
                 <div className="space-y-1 text-xs">
                    <div className="bg-primary/10 p-2 rounded"><strong className="text-foreground">Suas vendas:</strong> R$ 60.000 (R$ 30.000 comissão)</div>
                    <div className="bg-green-500/10 p-2 rounded"><strong className="text-foreground">Nível 1 (5%):</strong> 6 × R$ 50K = +R$ 15.000</div>
                    <div className="bg-amber-500/10 p-2 rounded"><strong className="text-foreground">Nível 2 (3%):</strong> 12 × R$ 35K = +R$ 12.600</div>
                    <div className="bg-slate-500/10 p-2 rounded">
                        <strong className="text-foreground">Nível 3 (2%):</strong> 2 OUROs + 6 Bronze = +R$ 4.040<br />
                        <strong className="text-foreground">Nível 4 (1%):</strong> 15 × R$ 25K = +R$ 3.750<br />
                        <span className="text-green-400/80">🔥 Rede Completa 11%!</span><br />
                        <strong className="text-green-400">Total mensal: R$ 65.390</strong>
                    </div>
                </div>
                <p className="text-xl font-bold text-amber-400 mt-3 text-center">R$ 785K</p>
                <p className="text-xs text-muted-foreground text-center uppercase">Potencial anual</p>
            </Card>
        </CardContent>
        <CardContent>
            <div className="bg-green-500/10 border-l-4 border-green-400 p-4 rounded-md text-sm text-green-300">
                <strong>🎯 Impacto do Nível 4 (1%):</strong> A diferença entre ter OURO no nível 3 vs não ter pode representar 
                <strong> +R$ 44K a R$ 90K/ano extras!</strong> 
                O sistema de 11% total distribuído em 4 níveis garante sustentabilidade e incentiva o desenvolvimento de líderes OURO.
            </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/70 backdrop-blur-lg border-slate-700 shadow-xl">
        <CardHeader className="text-center">
            <div className="text-5xl mb-4" style={{ filter: "drop-shadow(0 0 20px rgba(0, 255, 136, 0.7))" }}>🎯</div>
            <CardTitle className="text-2xl md:text-3xl text-green-400">ESTRUTURA MLM 4 NÍVEIS</CardTitle>
            <CardDescription className="text-muted-foreground">Sistema escalonado 5% → 3% → 2% → 1% | Total 11% | Nível 4 requer OURO no Nível 3</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-6">
            <Card className="bg-green-500/10 border-2 border-green-400 p-4 text-center">
                <div className="text-lg font-semibold text-green-400 mb-1">🎯 NÍVEL 1</div>
                <div className="text-2xl font-bold text-green-400 mb-1">5%</div>
                <p className="text-xs text-muted-foreground">Recrutas diretos</p>
            </Card>
            <Card className="bg-sky-500/10 border-2 border-sky-400 p-4 text-center">
                <div className="text-lg font-semibold text-sky-400 mb-1">🔥 NÍVEL 2</div>
                <div className="text-2xl font-bold text-sky-400 mb-1">3%</div>
                <p className="text-xs text-muted-foreground">Sub-recrutas</p>
            </Card>
            <Card className="bg-amber-500/10 border-2 border-amber-400 p-4 text-center">
                <div className="text-lg font-semibold text-amber-400 mb-1">⚡ NÍVEL 3</div>
                <div className="text-2xl font-bold text-amber-400 mb-1">2%</div>
                <p className="text-xs text-muted-foreground">Rede profunda</p>
            </Card>
            <Card className="bg-slate-500/10 border-2 border-slate-400 p-4 text-center">
                <div className="text-lg font-semibold text-slate-400 mb-1">💫 NÍVEL 4</div>
                <div className="text-2xl font-bold text-slate-400 mb-1">1%</div>
                <p className="text-xs text-muted-foreground">Requer OURO nível 3</p>
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}
