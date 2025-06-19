
import type { FieldConfig, InvoiceData } from '@/types/invoice';

export const ENERGISA_INVOICE_FIELDS_CONFIG: FieldConfig[] = [
  // Cabeçalho Energisa
  { name: 'headerTitle', x: 220, y: 15, width: 500, height: 22, initialValue: "SIMULACAO DE FATURA DA ENERGISA", style: { fontSize: '11px', fontWeight: 'bold', color: '#000' } },
  { name: 'companyName', x: 220, y: 25, width: 400, height: 22, initialValue: "ENERGISA MATO GROSSO - DISTRIBUIDORA DE ENERGIA S A", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyAddress', x: 220, y: 35, width: 400, height: 22, initialValue: "Rua Vereador João Barbosa Caramuru, 184", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyCityStateZip', x: 220, y: 45, width: 400, height: 22, initialValue: "Cuiabá/MT - CEP 78010-000", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyCnpj', x: 220, y: 55, width: 160, height: 22, initialValue: "CNPJ XX.XXX.XXX/XXXX-XX", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyInscEst', x: 220, y: 65, width: 180, height: 22, initialValue: "Insc. Est. XXXXXXXXXX", style: { fontSize: '9px', color: '#000' } },

  // Bloco Roteiro/Matrícula (superior esquerdo)
  { name: 'domBanco', x: 63, y: 120, width: 120, height: 22, initialValue: "", style: { fontSize: '9px', color: '#000' }, className: "text-left" },
  { name: 'domEnt', x: 208, y: 120, width: 100, height: 22, initialValue: "", style: { fontSize: '9px', color: '#000' }, className: "text-left" },
  
  { name: 'classificacao', x: 73, y: 117, width: 340, height: 28, initialValue: "RESIDENCIAL-CONVENCIONAL BAIXA TENSAO B1/B2/B3", style: { fontSize: '8px', color: '#000' }, className: "text-left" },
  { name: 'ligacao', x: 318, y: 127, width: 70, height: 24, initialValue: "TRIFASICO", style: { fontSize: '9px', color: '#000' }, className: "text-left" },
  { name: 'tensaoNominalDisp', x: 200, y: 197, width: 20, height: 22, initialValue: "127", style: { fontSize: '9px', color: '#000' }, className: "text-center" },
  { name: 'limMinTensao', x: 248, y: 197, width: 40, height: 22, initialValue: "117", style: { fontSize: '9px', color: '#000' }, className: "text-center" },
  { name: 'limMaxTensao', x: 328, y: 197, width: 40, height: 22, initialValue: "133", style: { fontSize: '9px', color: '#000' }, className: "text-center" },
  
  // Bloco Datas e NF-e (superior direito)
  { name: 'leituraAnteriorData', x: 510, y: 220, width: 70, height: 24, initialValue: "18/05/2025", style: { fontSize: '9px', color: '#000' }, className: "text-center" },
  { name: 'leituraAtualData', x: 570, y: 220, width: 70, height: 24, initialValue: "18/06/2025", style: { fontSize: '9px', color: '#000' }, className: "text-center" },
  { name: 'numDiasFaturamento', x: 651, y: 220, width: 28, height: 24, initialValue: "30", style: { fontSize: '9px', color: '#000' }, className: "text-center" },
  { name: 'proximaLeituraData', x: 685, y: 220, width: 70, height: 24, initialValue: "18/07/2025", style: { fontSize: '9px', color: '#000' }, className: "text-center" },

  { name: 'notaFiscalNum', x: 440, y: 180, width: 105, height: 22, initialValue: "017.270.053", style: { fontSize: '8.5px', color: '#000' }, className: "text-left" },
  
  // Dados do Cliente
  { name: 'clienteNome', x: 75, y: 219, width: 355, height: 25, initialValue: "MERCADO MIX LTDA", style: { fontSize: '15px', fontWeight: 'bold', color: '#000' } },
  { name: 'clienteEndereco', x: 75, y: 245, width: 355, height: 22, initialValue: "RUA CAMINHO DO SOL, 0 - QD18 LT11 - 78890000", style: { fontSize: '9px', color: '#000' } },
  { name: 'clienteBairro', x: 75, y: 270, width: 155, height: 22, initialValue: "ROTA DO SOL", style: { fontSize: '9px', color: '#000' } },
  { name: 'clienteCidadeUF', x: 75, y: 280, width: 205, height: 22, initialValue: "SORRISO (AG: 167)", style: { fontSize: '9px', color: '#000' } },
  { name: 'clienteCnpjCpf', x: 75, y: 310, width: 155, height: 22, initialValue: "05701044165", style: { fontSize: '10px', color: '#000' } },

  // Código Cliente / Instalação
  { name: 'codigoClienteInstalacao', x: 345, y: 265, width: 155, height: 22, initialValue: "6555432", style: { fontSize: '15px', fontWeight: 'bold', color: '#000', background: 'transparent' } },
  
  // Barra Principal Azul
  { name: 'mesAnoReferencia', x: 120, y: 348, width: 182, height: 22, initialValue: "MAIO / 2025", style: { fontSize: '11px', fontWeight: 'bold', color: '#000', background: 'transparent' } },
  { name: 'dataVencimento', x: 240, y: 348, width: 102, height: 22, initialValue: "10/07/2025", style: { fontSize: '11px', fontWeight: 'bold', color: '#000', background: 'transparent' } },
  { name: 'valorTotalFatura', x: 340, y: 348, width: 222, height: 24, initialValue: "R$ 1.644,71", style: { fontSize: '16px', fontWeight: 'bold', color: '#000', background: 'transparent' } },

  // Tabela Itens da Fatura - Linha 1
  { name: 'item1Desc', x: 55, y: 492, width: 132, height: 22, initialValue: "Consumo em kWh", style: { fontSize: '8px', background: 'white', color: '#000' } },
  { name: 'item1Unidade', x: 200, y: 492, width: 40, height: 22, initialValue: "KWH", style: { fontSize: '8px', color: '#000' }, className: "text-center" },
  { name: 'item1Quantidade', x: 240, y: 492, width: 60, height: 22, initialValue: "1.500,00", style: { fontSize: '8px', color: '#000' }, className: "text-right" },
  { name: 'item1Tarifa', x: 276, y: 492, width: 70, height: 22, initialValue: "1,093110", style: { fontSize: '8px', color: '#000' }, className: "text-right" },
  { name: 'item1Valor', x: 327, y: 492, width: 75, height: 20, initialValue: "1.630,64", style: { fontSize: '8px', color: '#000' }, className: "text-right" },
  
  { name: 'item1TarifaEnergiaInjetadaREF', x: 528, y: 493, width: 65, height: 22, initialValue: "0,847430", style: { fontSize: '7px', color: '#555' }, className: "text-right" }, 
  
  { name: 'item1PisBase',    x: 625, y: 481, width: 45, height: 22, initialValue: "1.353,43", style: { fontSize: '7px', background: 'white', color: '#000' }, className: "text-right" },
  { name: 'item1PisAliq',    x: 672, y: 481, width: 45, height: 22, initialValue: "1,0945", style: { fontSize: '7px', background: 'white', color: '#000' }, className: "text-right" },
  { name: 'item1PisValor',   x: 713, y: 481, width: 45, height: 22, initialValue: "14,81", style: { fontSize: '7px', background: 'white', color: '#000' }, className: "text-right" },
  
  { name: 'item1CofinsBase', x: 625, y: 495, width: 45, height: 22, initialValue: "1.353,43", style: { fontSize: '7px', background: 'white', color: '#000' }, className: "text-right" },
  { name: 'item1CofinsAliq', x: 672, y: 495, width: 45, height: 22, initialValue: "4,9955", style: { fontSize: '7px', background: 'white', color: '#000' }, className: "text-right" },
  { name: 'item1CofinsValor',x: 713, y: 495, width: 45, height: 22, initialValue: "67,61", style: { fontSize: '7px', background: 'white', color: '#000' }, className: "text-right" },
  
  { name: 'item1IcmsBase',   x: 625, y: 509, width: 45, height: 22, initialValue: "1.630,64", style: { fontSize: '7px', background: 'white', color: '#000' }, className: "text-right" },
  { name: 'item1IcmsPerc',   x: 672, y: 509, width: 45, height: 22, initialValue: "17,00", style: { fontSize: '7px', background: 'white', color: '#000' }, className: "text-right" }, 
  { name: 'item1IcmsRS',     x: 713, y: 509, width: 45, height: 22, initialValue: "277,21", style: { fontSize: '7px', background: 'white', color: '#000' }, className: "text-right" }, 
  

  { name: 'item2Desc', x: 55, y: 504, width: 132, height: 22, initialValue: "Energia Atv Injetada", style: { fontSize: '8px', color: '#000' } },
  { name: 'item2Tarifa', x: 276, y: 504, width: 70, height: 22, initialValue: "0,847430", style: { fontSize: '8px', color: '#000' }, className: "text-right" },
  { name: 'item2Valor', x: 327, y: 504, width: 75, height: 20, initialValue: "146,60", style: { fontSize: '8px', color: '#000' }, className: "text-right" },
        
  { name: 'item3Desc', x: 55, y: 537, width: 132, height: 22, initialValue: "Contrib de Ilum Pub", style: { fontSize: '8px', background: 'white', color: '#000' } },
  { name: 'item3Valor', x: 327, y: 537, width: 75, height: 20, initialValue: "13,75", style: { fontSize: '8px', color: '#000' }, className: "text-right" },
];


// Helper to generate initial data structure from a config
const generateInitialData = (config: FieldConfig[]): Partial<InvoiceData> => {
  return config.reduce((acc, field) => {
    if (field.initialValue !== undefined) {
      acc[field.name] = field.initialValue;
    } else {
      acc[field.name] = ""; // Default to empty string if no initialValue
    }
    return acc;
  }, {} as Partial<InvoiceData>);
};

export const initialInvoiceData: InvoiceData = {
  ...generateInitialData(ENERGISA_INVOICE_FIELDS_CONFIG),
  // Ensure all required fields of InvoiceData have a default, even if just empty string
  // Many are covered by generateInitialData now. Add any missing ones explicitly.
  headerTitle: "SIMULACAO DE FATURA DA ENERGISA",
  companyName: "ENERGISA MATO GROSSO - DISTRIBUIDORA DE ENERGIA S A",
  // ... other specific defaults if not covered by ENERGISA_INVOICE_FIELDS_CONFIG's initialValues
} as InvoiceData;

    

    























    
