
"use client";

import type React from 'react';
import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Save, ScanSearch, AlertTriangle } from 'lucide-react';
import { addDays, subDays, format, getDaysInMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EditableField from './editable-field';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { InvoiceData } from '@/types/invoice';
import { INVOICE_FIELDS_CONFIG, initialInvoiceData as defaultInitialData } from '@/config/invoice-fields';

// Constantes para cálculos
const TARIFA_ENERGIA = 1.093110;
const ALIQUOTA_PIS_PERC = 1.0945 / 100; // 0.010945
const ALIQUOTA_COFINS_PERC = 4.9955 / 100; // 0.049955
const ALIQUOTA_ICMS_PERC = 17.00 / 100; // 0.17

// Helper para formatar número para string BRL (ex: "1.234,56")
const formatNumberToCurrencyString = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return "0,00";
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Helper para formatar número para string local (ex: "1.500,00" ou "1,093110")
const formatNumberToLocaleString = (value: number | null | undefined, fractionDigits: number = 2): string => {
  if (value === null || value === undefined || isNaN(value)) {
    if (fractionDigits === 0) return "0";
    return "0," + "0".repeat(fractionDigits);
  }
  return value.toLocaleString('pt-BR', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
};

// Helper para converter string formatada (BRL ou com vírgula) para número
const parseLocaleNumberString = (str: string | null | undefined): number => {
  if (!str) return 0;
  return parseFloat(str.replace(/\./g, '').replace(',', '.'));
};


function InvoiceEditorContent() {
  const searchParams = useSearchParams();
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInitialData);
  const fieldRefs = useRef<Record<string, SVGForeignObjectElement | null>>({});
  const [overlappingFields, setOverlappingFields] = useState<Set<string>>(new Set());
  const [overlapWarningMsg, setOverlapWarningMsg] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const newInvoiceData = { ...defaultInitialData };
    let hasQueryData = false;

    // Lê todos os parâmetros da URL
    const params = new URLSearchParams(searchParams.toString());
    params.forEach((value, key) => {
      if (key in newInvoiceData) {
        newInvoiceData[key as keyof InvoiceData] = value;
      }
      hasQueryData = true;
    });
    
    if (hasQueryData) {
      // Preenchimento direto do formulário
      newInvoiceData.clienteNome = params.get("clienteNome") || newInvoiceData.clienteNome;
      
      const rua = params.get("clienteRua") || "";
      const numero = params.get("clienteNumero") || "";
      const complemento = params.get("clienteComplemento") || "";
      let enderecoCompleto = rua;
      if (numero) enderecoCompleto += `, ${numero}`;
      if (complemento) enderecoCompleto += ` - ${complemento}`;
      newInvoiceData.clienteEndereco = enderecoCompleto || newInvoiceData.clienteEndereco;

      newInvoiceData.clienteBairro = params.get("clienteBairro") || newInvoiceData.clienteBairro;
      
      const cidade = params.get("clienteCidade") || "";
      const uf = params.get("clienteUF") || "";
      if (cidade && uf) {
        newInvoiceData.clienteCidadeUF = `${cidade}/${uf}`;
      } else if (cidade) {
        newInvoiceData.clienteCidadeUF = cidade;
      } else {
        newInvoiceData.clienteCidadeUF = newInvoiceData.clienteCidadeUF;
      }

      newInvoiceData.clienteCnpjCpf = params.get("clienteCnpjCpf") || newInvoiceData.clienteCnpjCpf;
      newInvoiceData.codigoClienteInstalacao = params.get("codigoClienteInstalacao") || newInvoiceData.codigoClienteInstalacao;
      newInvoiceData.ligacao = params.get("ligacao") || newInvoiceData.ligacao;
      newInvoiceData.classificacao = params.get("classificacao") || newInvoiceData.classificacao;

      // Cálculos de Datas
      const hoje = new Date();
      newInvoiceData.mesAnoReferencia = format(hoje, 'MMMM / yyyy', { locale: ptBR }).toUpperCase();
      newInvoiceData.dataVencimento = format(addDays(hoje, 10), 'dd/MM/yyyy');
      newInvoiceData.leituraAnteriorData = format(subDays(hoje, 30), 'dd/MM/yyyy');
      newInvoiceData.leituraAtualData = format(hoje, 'dd/MM/yyyy');
      newInvoiceData.numDiasFaturamento = getDaysInMonth(hoje).toString();
      newInvoiceData.proximaLeituraData = format(addDays(hoje, 30), 'dd/MM/yyyy');
      
      // Inputs numéricos do formulário
      const consumoKwhInput = parseLocaleNumberString(params.get("item1Quantidade"));
      const cipValorInput = parseLocaleNumberString(params.get("item3Valor"));
      const valorProdPropriaInput = parseLocaleNumberString(params.get("valorProducaoPropria"));

      // Cálculos de Valores
      const valorConsumoPrincipal = consumoKwhInput * TARIFA_ENERGIA;
      newInvoiceData.valorTotalFatura = formatNumberToCurrencyString(valorConsumoPrincipal + cipValorInput);
      
      newInvoiceData.item1Quantidade = formatNumberToLocaleString(consumoKwhInput, 2);
      // item1Tarifa é fixo na exibição, usa initialValue
      newInvoiceData.item1Valor = formatNumberToCurrencyString(valorConsumoPrincipal);

      const tarifaEnergiaInjetadaRefCalc = TARIFA_ENERGIA * (1 - ALIQUOTA_ICMS_PERC);
      newInvoiceData.item1TarifaEnergiaInjetadaREF = formatNumberToLocaleString(tarifaEnergiaInjetadaRefCalc, 6);
      
      newInvoiceData.item2Valor = formatNumberToCurrencyString(valorProdPropriaInput);
      newInvoiceData.item3Valor = formatNumberToCurrencyString(cipValorInput);
      
      const baseCalculoPisCofins = consumoKwhInput * tarifaEnergiaInjetadaRefCalc;
      newInvoiceData.item1PisBase = formatNumberToCurrencyString(baseCalculoPisCofins);
      // item1PisAliq é fixo na exibição
      newInvoiceData.item1PisValor = formatNumberToCurrencyString(baseCalculoPisCofins * ALIQUOTA_PIS_PERC);
      
      newInvoiceData.item1CofinsBase = formatNumberToCurrencyString(baseCalculoPisCofins);
      // item1CofinsAliq é fixo na exibição
      newInvoiceData.item1CofinsValor = formatNumberToCurrencyString(baseCalculoPisCofins * ALIQUOTA_COFINS_PERC);
      
      newInvoiceData.item1IcmsBase = formatNumberToCurrencyString(valorConsumoPrincipal);
      // item1IcmsPerc é fixo na exibição
      newInvoiceData.item1IcmsRS = formatNumberToCurrencyString(valorConsumoPrincipal * ALIQUOTA_ICMS_PERC);

      // Garantir que campos com exibição fixa usem o initialValue
      const fixedDisplayFields: (keyof InvoiceData)[] = ['item1Tarifa', 'item1PisAliq', 'item1CofinsAliq', 'item1IcmsPerc'];
      fixedDisplayFields.forEach(fieldName => {
        const fieldConfig = INVOICE_FIELDS_CONFIG.find(f => f.name === fieldName);
        if (fieldConfig) {
          newInvoiceData[fieldName] = fieldConfig.initialValue;
        }
      });
    }
    
    setInvoiceData(newInvoiceData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const checkForOverlaps = useCallback(() => {
    const newOverlaps = new Set<string>();
    const elements = Object.entries(fieldRefs.current).filter(([, el]) => el !== null);
    let overlapDetected = false;

    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const [name1, el1] = elements[i];
        const [name2, el2] = elements[j];
        if (el1 && el2) {
          const rect1 = el1.getBoundingClientRect();
          const rect2 = el2.getBoundingClientRect();
          
          const isOverlapping = !(
            rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom
          );

          if (isOverlapping) {
            newOverlaps.add(name1);
            newOverlaps.add(name2);
            overlapDetected = true;
          }
        }
      }
    }
    setOverlappingFields(newOverlaps);
    if (overlapDetected) {
      const warningText = `Overlap detected! Fields involved: ${Array.from(newOverlaps).join(', ')}.`;
      setOverlapWarningMsg(warningText);
      toast({
        title: 'Overlap Warning',
        description: 'Some fields are overlapping. Please check the highlighted fields.',
        variant: 'destructive',
        duration: 5000,
      });
    } else {
      setOverlapWarningMsg(null);
      toast({
        title: 'Overlap Check Complete',
        description: 'No overlaps detected.',
        duration: 3000,
      });
    }
  }, [toast]);
  

  const handleSave = () => {
    try {
      const jsonString = JSON.stringify(invoiceData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "invoice-data.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast({
        title: 'Success!',
        description: 'Invoice data has been saved to invoice-data.json.',
      });
    } catch (error) {
      console.error("Failed to save invoice data:", error);
      toast({
        title: 'Error Saving Data',
        description: 'There was an issue saving your invoice data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <Button onClick={handleSave} variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
          <Save className="mr-2 h-5 w-5" /> Save Data
        </Button>
        <Button onClick={checkForOverlaps} variant="outline" className="border-accent text-accent-foreground hover:bg-accent/10 hover:text-accent-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
          <ScanSearch className="mr-2 h-5 w-5" /> Check Overlaps
        </Button>
      </div>

      {overlapWarningMsg && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive-foreground rounded-lg shadow-sm flex items-center text-sm max-w-xl w-full">
          <AlertTriangle className="h-5 w-5 mr-3 shrink-0 text-destructive" />
          <span className="font-medium">{overlapWarningMsg}</span>
        </div>
      )}
      
      <div className="invoice-container bg-white shadow-xl rounded-lg" style={{ width: '827px', height: '580px', overflow: 'hidden', position: 'relative' }}>
        <svg width="827" height="580" viewBox="0 0 827 580" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <image 
            href="https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/86dc9c43c4be1f9265bb146d607212a360025633/pagina%201_P%C3%A1gina_1.jpg" 
            data-ai-hint="bill background" 
            x="0" y="0" width="827" height="1169" 
          />
          
          <foreignObject x="45" y="25" width="130" height="65">
            <image 
              href="https://raw.githubusercontent.com/LucasMouraChaser/backgrounds-sent/refs/heads/main/FATURA%20ENERGISA%2017.06_P%C3%A1gina_1%20(2).svg" 
              width="130" height="65" data-ai-hint="energisa logo"
            />
          </foreignObject>

          {INVOICE_FIELDS_CONFIG.map(field => (
            <EditableField
              key={field.name}
              name={field.name}
              x={field.x}
              y={field.y}
              width={field.width}
              height={field.height}
              value={invoiceData[field.name] || ''}
              onChange={handleInputChange}
              inputStyle={field.style}
              inputClassName={field.className}
              isTextarea={field.isTextarea}
              fieldRef={el => (fieldRefs.current[field.name] = el)}
              isOverlapping={overlappingFields.has(field.name)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

const InvoiceEditor: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Carregando dados da fatura...</div>}>
      <InvoiceEditorContent />
    </Suspense>
  );
};

export default InvoiceEditor;
