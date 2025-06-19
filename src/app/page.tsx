// /src/app/page.tsx (Nova Calculadora e Editor)
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { BrazilMapGraphic } from '@/components/BrazilMapGraphic';
import { StateInfoCard } from '@/components/StateInfoCard';
import { SavingsDisplay } from '@/components/SavingsDisplay';
import InvoiceEditor from '@/components/invoice-editor';

import { statesData } from '@/data/state-data';
import type { StateInfo, SavingsResult } from '@/types';
import { calculateSavings } from '@/lib/discount-calculator';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Edit3 } from 'lucide-react';

const KWH_TO_R_FACTOR = 1.0907; // Tarifa média para cálculo inicial da conta
const MIN_KWH_SLIDER = 100;
const MAX_KWH_SLIDER = 50000; // Aumentado para cobrir faixas maiores
const SLIDER_STEP = 50;
const DEFAULT_KWH = 1500;
const DEFAULT_UF = 'MT';

function CalculatorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [currentKwh, setCurrentKwh] = useState<number>(DEFAULT_KWH);
  const [savings, setSavings] = useState<SavingsResult | null>(null);
  
  // Ler estado da URL e definir o estado selecionado inicialmente
  useEffect(() => {
    const stateCodeFromUrl = searchParams.get('state');
    const kwhFromUrl = searchParams.get('kwh');

    let initialStateCode = DEFAULT_UF;
    if (stateCodeFromUrl && statesData.find(s => s.code === stateCodeFromUrl && s.available)) {
      initialStateCode = stateCodeFromUrl;
    }
    
    const initialKwh = kwhFromUrl ? parseInt(kwhFromUrl, 10) : DEFAULT_KWH;
    if (!isNaN(initialKwh) && initialKwh >= MIN_KWH_SLIDER && initialKwh <= MAX_KWH_SLIDER) {
      setCurrentKwh(initialKwh);
    } else {
      setCurrentKwh(DEFAULT_KWH);
    }

    const stateDetails = statesData.find(s => s.code === initialStateCode);
    if (stateDetails && stateDetails.available) {
      setSelectedState(stateDetails);
    } else {
      // Se o estado da URL não for válido/disponível, ou nenhum estado for passado,
      // tenta selecionar o estado padrão (MT) se estiver disponível.
      const defaultStateDetails = statesData.find(s => s.code === DEFAULT_UF && s.available);
      setSelectedState(defaultStateDetails || null);
      if (!defaultStateDetails && stateCodeFromUrl) { // Se nem MT está disponível e veio algo na URL
         toast({ title: "Estado Indisponível", description: `O estado ${stateCodeFromUrl} não está disponível para simulação.`, variant: "destructive" });
      }
    }
  }, [searchParams, toast]);

  // Atualizar URL quando o estado selecionado ou kWh mudar
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedState) {
      params.set('state', selectedState.code);
    }
    params.set('kwh', currentKwh.toString());
    // router.replace torna a URL mais limpa, mas pode causar re-renderizações.
    // window.history.replaceState({}, '', `?${params.toString()}`); // Alternativa para não recarregar
  }, [selectedState, currentKwh, router]);


  // Calcular economia
  useEffect(() => {
    if (selectedState && selectedState.available) {
      const billAmountInReais = currentKwh * KWH_TO_R_FACTOR;
      setSavings(calculateSavings(billAmountInReais));
    } else {
      setSavings(null); // Reseta a economia se nenhum estado disponível estiver selecionado
    }
  }, [currentKwh, selectedState]);

  const handleStateClick = (stateCode: string) => {
    const stateDetails = statesData.find(s => s.code === stateCode);
    if (stateDetails && stateDetails.available) {
      setSelectedState(stateDetails);
    } else if (stateDetails) {
      toast({ title: "Estado Indisponível", description: `${stateDetails.name} ainda não está disponível para simulação.`, variant: "destructive" });
      setSelectedState(null); // Limpa seleção se indisponível
    }
  };

  const handleStateHover = (stateCode: string | null) => {
    setHoveredStateCode(stateCode);
  };

  const handleKwhInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value)) value = MIN_KWH_SLIDER; // ou manter o valor anterior
    if (value < MIN_KWH_SLIDER) value = MIN_KWH_SLIDER;
    if (value > MAX_KWH_SLIDER) value = MAX_KWH_SLIDER;
    setCurrentKwh(value);
  };

  const handleSliderChange = (value: number[]) => {
    setCurrentKwh(value[0]);
  };
  
  const currentBillWithoutDiscount = parseFloat((currentKwh * KWH_TO_R_FACTOR).toFixed(2));

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-background p-4 md:p-8 font-body">
      <header className="mb-8 text-center py-4">
        <h1 className="text-3xl md:text-4xl font-headline text-primary font-bold tracking-tight">
          Calculadora de Economia de Energia
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-2xl mx-auto">
          Selecione seu estado, ajuste o consumo e veja o quanto você pode economizar com a Energisa.
          Depois, clique em "Iniciar Nova Proposta" para personalizar sua fatura.
        </p>
      </header>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Coluna do Mapa e Info do Estado */}
        <div className="flex flex-col items-center space-y-6">
          <Card className="w-full shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">Selecione seu Estado</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <BrazilMapGraphic
                selectedStateCode={selectedState?.code || null}
                hoveredStateCode={hoveredStateCode}
                onStateClick={handleStateClick}
                onStateHover={handleStateHover}
                className="max-w-md"
              />
            </CardContent>
          </Card>
          {selectedState && <StateInfoCard state={selectedState} />}
           {!selectedState && (
             <Card className="w-full shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-primary">Nenhum Estado Selecionado</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Clique em um estado no mapa para ver os detalhes e simular sua economia.</p>
                </CardContent>
             </Card>
           )}
        </div>

        {/* Coluna do Simulador e Economia */}
        <div className="flex flex-col space-y-6">
          <Card className="w-full shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary flex items-center">
                <Edit3 className="mr-2 h-5 w-5" />
                Simulador de Consumo
              </CardTitle>
              <CardDescription>
                Ajuste seu consumo mensal em kWh para ver a estimativa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="kwhInput" className="text-sm font-medium">Consumo Mensal (kWh)</Label>
                <Input
                  id="kwhInput"
                  type="number"
                  value={currentKwh}
                  onChange={handleKwhInputChange}
                  min={MIN_KWH_SLIDER}
                  max={MAX_KWH_SLIDER}
                  step={SLIDER_STEP}
                  className="mt-1 text-lg"
                />
              </div>
              <Slider
                value={[currentKwh]}
                onValueChange={handleSliderChange}
                min={MIN_KWH_SLIDER}
                max={MAX_KWH_SLIDER}
                step={SLIDER_STEP}
                aria-label="Slider de Consumo kWh"
              />
              <div className="p-3 bg-secondary rounded-md text-center">
                <p className="text-sm text-muted-foreground">Sua conta atual estimada (sem desconto):</p>
                <p className="text-2xl font-semibold text-primary">
                  {currentBillWithoutDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <SavingsDisplay savings={savings} />

          <Card className="w-full shadow-xl mt-4">
             <CardHeader>
                <CardTitle className="text-xl font-bold text-primary flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Próximos Passos
                </CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-muted-foreground mb-4">
                    Gostou da simulação? Clique abaixo para preencher mais detalhes e visualizar uma simulação completa da sua fatura Energisa.
                </p>
                <Link href="/proposal-generator" passHref>
                    <Button variant="default" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
                        <FileText className="mr-2 h-5 w-5" />
                        INICIAR NOVA PROPOSTA
                    </Button>
                </Link>
             </CardContent>
          </Card>

        </div>
      </div>
      
      {/* Seção do Editor de Fatura */}
      <div className="w-full max-w-4xl mx-auto mt-12">
        <Card className="shadow-2xl overflow-hidden">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-2xl font-bold text-primary text-center">
              Editor da Fatura Energisa (Simulação)
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Os dados da simulação (ou do formulário de proposta) são carregados aqui. Você pode editar os campos diretamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
             <InvoiceEditor />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


export default function HomePage() {
  return (
    // Suspense é necessário porque CalculatorPageContent usa useSearchParams
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Carregando calculadora e editor...</p>
      </div>
    }>
      <CalculatorPageContent />
    </Suspense>
  );
}
