
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
import { HelpCircle, Edit3, FileText, Building } from 'lucide-react'; // Added Building as example, FileText used

const KWH_TO_R_FACTOR = 1.0907; 
const MIN_KWH_SLIDER = 100;
const MAX_KWH_SLIDER = 50000; 
const SLIDER_STEP = 50;
const DEFAULT_KWH = 1500;
const DEFAULT_UF = 'MT'; // Default UF

function CalculatorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [currentKwh, setCurrentKwh] = useState<number>(DEFAULT_KWH);
  const [savings, setSavings] = useState<SavingsResult | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      if (!loggedIn) {
        router.replace('/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return; // Não processe até estar autenticado

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
      const defaultStateDetails = statesData.find(s => s.code === DEFAULT_UF && s.available);
      setSelectedState(defaultStateDetails || null);
      if (!defaultStateDetails && stateCodeFromUrl) { 
         toast({ title: "Estado Indisponível", description: `O estado ${stateCodeFromUrl} não está disponível para simulação.`, variant: "destructive" });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, toast, isAuthenticated]); 

  useEffect(() => {
    if (!isAuthenticated) return;
    // This effect might not be strictly necessary anymore if URL is primarily driven by user actions
    // Keeping it for now, but could be re-evaluated.
    // const params = new URLSearchParams(searchParams.toString()); 
    // if (selectedState) {
    //   params.set('state', selectedState.code);
    // } else {
    //    params.delete('state'); // Or set to default?
    // }
    // params.set('kwh', currentKwh.toString());
    // router.replace(`/?${params.toString()}`, { scroll: false }); 
  }, [selectedState, currentKwh, router, searchParams, isAuthenticated]);


  useEffect(() => {
    if (!isAuthenticated) return;

    if (selectedState && selectedState.available) {
      const billAmountInReais = currentKwh * KWH_TO_R_FACTOR;
      setSavings(calculateSavings(billAmountInReais));
    } else {
      setSavings(null); 
    }
  }, [currentKwh, selectedState, isAuthenticated]);

  const handleStateClick = (stateCode: string) => {
    const stateDetails = statesData.find(s => s.code === stateCode);
    if (stateDetails && stateDetails.available) {
      setSelectedState(stateDetails);
      const params = new URLSearchParams(searchParams.toString());
      params.set('state', stateCode);
      router.push(`/?${params.toString()}`, { scroll: false });
    } else if (stateDetails) {
      toast({ title: "Estado Indisponível", description: `${stateDetails.name} ainda não está disponível para simulação.`, variant: "destructive" });
      setSelectedState(null); 
      const params = new URLSearchParams(searchParams.toString());
      params.delete('state');
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  const handleStateHover = (stateCode: string | null) => {
    setHoveredStateCode(stateCode);
  };

  const handleKwhInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value)) value = MIN_KWH_SLIDER; 
    if (value < MIN_KWH_SLIDER) value = MIN_KWH_SLIDER;
    if (value > MAX_KWH_SLIDER) value = MAX_KWH_SLIDER;
    setCurrentKwh(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('kwh', value.toString());
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleSliderChange = (value: number[]) => {
    setCurrentKwh(value[0]);
    const params = new URLSearchParams(searchParams.toString());
    params.set('kwh', value[0].toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };
  
  const currentBillWithoutDiscount = parseFloat((currentKwh * KWH_TO_R_FACTOR).toFixed(2));

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Verificando autenticação...</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-0"> {/* Adjusted padding for page within layout */}
      <header className="mb-8 text-center py-4">
        <h1 className="text-3xl md:text-4xl font-headline text-primary font-bold tracking-tight">
          Calculadora de Economia de Energia
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-2xl mx-auto">
          Selecione seu estado, ajuste o consumo e veja o quanto você pode economizar.
          Depois, clique em "Iniciar Nova Proposta" para personalizar sua fatura.
        </p>
      </header>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 px-4">
        <div className="flex flex-col items-center space-y-6">
          <Card className="w-full shadow-xl bg-card">
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
             <Card className="w-full shadow-lg bg-card">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-primary">Nenhum Estado Selecionado</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Clique em um estado no mapa para ver os detalhes e simular sua economia.</p>
                </CardContent>
             </Card>
           )}
        </div>

        <div className="flex flex-col space-y-6">
          <Card className="w-full shadow-xl bg-card">
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

          <Card className="w-full shadow-xl mt-4 bg-card">
             <CardHeader>
                <CardTitle className="text-xl font-bold text-primary flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Próximos Passos
                </CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-muted-foreground mb-4">
                    Gostou da simulação? Clique abaixo para preencher mais detalhes e visualizar uma simulação completa da sua fatura.
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
      
      <div className="w-full max-w-4xl mx-auto mt-12 px-4">
        <Card className="shadow-2xl overflow-hidden bg-card">
          <CardHeader className="bg-primary/10">
            <CardTitle className="text-2xl font-bold text-primary text-center">
              Editor da Fatura (Simulação)
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Os dados da simulação (ou do formulário de proposta) são carregados aqui. Você pode editar os campos diretamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-2 bg-background"> {/* Ensure editor background contrasts card */}
             <InvoiceEditor />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function HomePage() {
  return (
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

