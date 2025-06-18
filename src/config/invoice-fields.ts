
import type { FieldConfig, InvoiceData } from '@/types/invoice';

export const INVOICE_FIELDS_CONFIG: FieldConfig[] = [
  // Cabeçalho Energisa
  { name: 'headerTitle', x: 220, y: 15, width: 500, height: 22, initialValue: "SIMULACAO DE FATURA DA ENERGISA", style: { fontSize: '11px', fontWeight: 'bold', color: '#000' } },
  { name: 'companyName', x: 220, y: 25, width: 400, height: 22, initialValue: "ENERGISA MATO GROSSO - DISTRIBUIDORA DE ENERGIA S A", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyAddress', x: 220, y: 35, width: 400, height: 22, initialValue: "Rua Vereador João Barbosa Caramuru, 184", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyCityStateZip', x: 220, y: 45, width: 400, height: 22, initialValue: "Cuiabá/MT - CEP 78010-000", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyCnpj', x: 220, y: 55, width: 160, height: 22, initialValue: "CNPJ XX.XXX.XXX/XXXX-XX", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyInscEst', x: 220, y: 65, width: 180, height: 22, initialValue: "Insc. Est. XXXXXXXXXX", style: { fontSize: '9px', color: '#000' } },

  // Bloco Roteiro/Matrícula (superior esquerdo)
  { name: 'domBanco', x: 63, y: 120, width: 120, height: 22, initialValue: "", style: { fontSize: '9px' }, className: "text-left" },
  { name: 'domEnt', x: 208, y: 120, width: 100, height: 22, initialValue: "", style: { fontSize: '9px' }, className: "text-left" },
  
  { name: 'classificacao', x: 73, y: 117, width: 340, height: 28, initialValue: "RESIDENCIAL-CONVENCIONAL BAIXA TENSAO B1/B2/B3", style: { fontSize: '8px' }, className: "text-left" },
  { name: 'ligacao', x: 318, y: 127, width: 70, height: 24, initialValue: "TRIFASICO", style: { fontSize: '9px' }, className: "text-left" },
  { name: 'tensaoNominalDisp', x: 200, y: 197, width: 20, height: 22, initialValue: "127", style: { fontSize: '9px' }, className: "text-center" },
  { name: 'limMinTensao', x: 248, y: 197, width: 40, height: 22, initialValue: "117", style: { fontSize: '9px' }, className: "text-center" },
  { name: 'limMaxTensao', x: 328, y: 197, width: 40, height: 22, initialValue: "133", style: { fontSize: '9px' }, className: "text-center" },
  
  // Bloco Datas e NF-e (superior direito)
  { name: 'leituraAnteriorData', x: 510, y: 220, width: 70, height: 24, initialValue: "18/05/2025", style: { fontSize: '9px' }, className: "text-center" },
  { name: 'leituraAtualData', x: 570, y: 220, width: 70, height: 24, initialValue: "18/06/2025", style: { fontSize: '9px' }, className: "text-center" },
  { name: 'numDiasFaturamento', x: 651, y: 220, width: 28, height: 24, initialValue: "30", style: { fontSize: '9px' }, className: "text-center" },
  { name: 'proximaLeituraData', x: 685, y: 220, width: 70, height: 24, initialValue: "18/07/2025", style: { fontSize: '9px' }, className: "text-center" },

  { name: 'notaFiscalNum', x: 440, y: 180, width: 105, height: 22, initialValue: "017.270.053", style: { fontSize: '8.5px' }, className: "text-left" },
  
  // Dados do Cliente
  { name: 'clienteNome', x: 75, y: 219, width: 355, height: 25, initialValue: "MERCADO MIX LTDA", style: { fontSize: '15px', fontWeight: 'bold' } },
  { name: 'clienteEndereco', x: 75, y: 245, width: 355, height: 22, initialValue: "RUA CAMINHO DO SOL, 0 - QD18 LT11 - 78890000", style: { fontSize: '9px' } },
  { name: 'clienteBairro', x: 75, y: 270, width: 155, height: 22, initialValue: "ROTA DO SOL", style: { fontSize: '9px' } },
  { name: 'clienteCidadeUF', x: 75, y: 280, width: 205, height: 22, initialValue: "SORRISO (AG: 167)", style: { fontSize: '9px' } },
  { name: 'clienteCnpjCpf', x: 75, y: 310, width: 155, height: 22, initialValue: "05701044165", style: { fontSize: '10px' } },

  // Código Cliente / Instalação
  { name: 'codigoClienteInstalacao', x: 345, y: 265, width: 155, height: 22, initialValue: "6555432", style: { fontSize: '15px', fontWeight: 'bold', color: '#000', background: 'transparent' } },
  
  // Barra Principal Azul
  { name: 'mesAnoReferencia', x: 120, y: 348, width: 182, height: 22, initialValue: "MAIO / 2025", style: { fontSize: '11px', fontWeight: 'bold', color: '#000', background: 'transparent' } },
  { name: 'dataVencimento', x: 240, y: 348, width: 102, height: 22, initialValue: "10/07/2025", style: { fontSize: '11px', fontWeight: 'bold', color: '#000', background: 'transparent' } },
  { name: 'valorTotalFatura', x: 340, y: 348, width: 222, height: 24, initialValue: "R$ 1.644,71", style: { fontSize: '16px', fontWeight: 'bold', color: '#000', background: 'transparent' } },

  // Tabela Itens da Fatura - Linha 1
  { name: 'item1Desc', x: 55, y: 492, width: 132, height: 22, initialValue: "Consumo em kWh", style: { fontSize: '8px', background: 'white' } },
  { name: 'item1Unidade', x: 200, y: 492, width: 40, height: 22, initialValue: "KWH", style: { fontSize: '8px' }, className: "text-center" },
  { name: 'item1Quantidade', x: 240, y: 492, width: 60, height: 22, initialValue: "1.500,00", style: { fontSize: '8px' }, className: "text-right" },
  { name: 'item1Tarifa', x: 300, y: 492, width: 70, height: 22, initialValue: "1,093110", style: { fontSize: '8px' }, className: "text-right" },
  { name: 'item1Valor', x: 370, y: 492, width: 70, height: 22, initialValue: "1.630,64", style: { fontSize: '8px' }, className: "text-right" },
  
  // Tarifa Energia Injetada REF
  { name: 'item1TarifaEnergiaInjetadaREF', x: 445, y: 492, width: 65, height: 22, initialValue: "0,847430", style: { fontSize: '7px', color: '#555' }, className: "text-right" }, 
  
  // Campos de Tributos - PIS (Linha 1)
  { name: 'item1PisBase',    x: 607, y: 483, width: 63, height: 22, initialValue: "1.353,43", style: { fontSize: '8px', background: 'white' }, className: "text-right" },
  { name: 'item1PisAliq',    x: 667, y: 483, width: 48, height: 22, initialValue: "1,0945", style: { fontSize: '8px', background: 'white' }, className: "text-right" },
  { name: 'item1PisValor',   x: 712, y: 483, width: 53, height: 22, initialValue: "14,81", style: { fontSize: '8px', background: 'white' }, className: "text-right" },
  
  // Campos de Tributos - COFINS (Linha 1)
  { name: 'item1CofinsBase', x: 607, y: 494, width: 63, height: 22, initialValue: "1.353,43", style: { fontSize: '8px', background: 'white' }, className: "text-right" },
  { name: 'item1CofinsAliq', x: 667, y: 494, width: 48, height: 22, initialValue: "4,9955", style: { fontSize: '8px', background: 'white' }, className: "text-right" },
  { name: 'item1CofinsValor',x: 712, y: 494, width: 53, height: 22, initialValue: "67,61", style: { fontSize: '8px', background: 'white' }, className: "text-right" },
  
  // Campos de Tributos - ICMS (Linha 1)
  { name: 'item1IcmsBase',   x: 607, y: 505, width: 63, height: 22, initialValue: "1.630,64", style: { fontSize: '8px', background: 'white' }, className: "text-right" },
  { name: 'item1IcmsPerc',   x: 667, y: 505, width: 48, height: 22, initialValue: "17,00", style: { fontSize: '8px', background: 'white' }, className: "text-right" },
  { name: 'item1IcmsRS',     x: 712, y: 505, width: 53, height: 22, initialValue: "277,21", style: { fontSize: '8px', background: 'white' }, className: "text-right" },
  

  // Linha 2: Energia Injetada GDI UC
  { name: 'item2Desc', x: 55, y: 504, width: 132, height: 22, initialValue: "Energia Atv Injetada", style: { fontSize: '8px' } },
  { name: 'item2Tarifa', x: 300, y: 504, width: 70, height: 22, initialValue: "0,847430", style: { fontSize: '8px' }, className: "text-right" },
  { name: 'item2Valor', x: 370, y: 504, width: 70, height: 22, initialValue: "146,60", style: { fontSize: '8px' }, className: "text-right" },
        
  // Tabela Lançamentos e Serviços
  { name: 'item3Desc', x: 55, y: 537, width: 132, height: 22, initialValue: "Contrib de Ilum Pub", style: { fontSize: '8px', background: 'white' } },
  { name: 'item3Valor', x: 370, y: 537, width: 70, height: 22, initialValue: "13,75", style: { fontSize: '8px' }, className: "text-right" },
  
  { name: 'totalPisValor', x: 520, y: 467, width: 42, height: 22, initialValue: "14,81", style: { fontSize: '9px', fontWeight: 'bold' }, className: "text-right" },
  { name: 'totalCofinsValor', x: 665, y: 467, width: 42, height: 22, initialValue: "67,61", style: { fontSize: '9px', fontWeight: 'bold' }, className: "text-right" },
  { name: 'totalIcmsValor', x: 705, y: 510, width: 42, height: 22, initialValue: "277,21", style: { fontSize: '9px', fontWeight: 'bold' }, className: "text-right" },
];

export const initialInvoiceData = INVOICE_FIELDS_CONFIG.reduce((acc, field) => {
  let value = field.initialValue;
  acc[field.name] = value;
  return acc;
}, {} as InvoiceData);

