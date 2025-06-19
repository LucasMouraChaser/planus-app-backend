
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
  { name: 'item1Tarifa', x: 300, y: 492, width: 70, height: 22, initialValue: "1,093110", style: { fontSize: '8px', color: '#000' }, className: "text-right" },
  { name: 'item1Valor', x: 370, y: 492, width: 70, height: 22, initialValue: "1.630,64", style: { fontSize: '8px', color: '#000' }, className: "text-right" },
  
  { name: 'item1TarifaEnergiaInjetadaREF', x: 555, y: 493, width: 65, height: 22, initialValue: "0,847430", style: { fontSize: '7px', color: '#555' }, className: "text-right" }, 
  
  { name: 'item1PisBase',    x: 620, y: 479, width: 63, height: 22, initialValue: "1.353,43", style: { fontSize: '8px', background: 'white', color: '#000' }, className: "text-right" },
  { name: 'item1PisAliq',    x: 667, y: 479, width: 48, height: 22, initialValue: "1,0945", style: { fontSize: '8px', background: 'white', color: '#000' }, className: "text-right" },
  { name: 'item1PisValor',   x: 702, y: 479, width: 53, height: 22, initialValue: "14,81", style: { fontSize: '8px', background: 'white', color: '#000' }, className: "text-right" },
  
  { name: 'item1CofinsBase', x: 624, y: 493, width: 63, height: 22, initialValue: "1.353,43", style: { fontSize: '8px', background: 'white', color: '#000' }, className: "text-right" },
  { name: 'item1CofinsAliq', x: 667, y: 493, width: 48, height: 22, initialValue: "4,9955", style: { fontSize: '8px', background: 'white', color: '#000' }, className: "text-right" },
  { name: 'item1CofinsValor',x: 702, y: 493, width: 53, height: 22, initialValue: "67,61", style: { fontSize: '8px', background: 'white', color: '#000' }, className: "text-right" },
  
  { name: 'item1IcmsBase',   x: 624, y: 507, width: 63, height: 22, initialValue: "1.630,64", style: { fontSize: '8px', background: 'white', color: '#000' }, className: "text-right" },
  { name: 'item1IcmsPerc',   x: 667, y: 507, width: 48, height: 22, initialValue: "17,00", style: { fontSize: '8px', background: 'white', color: '#000' }, className: "text-right" }, 
  { name: 'item1IcmsRS',     x: 702, y: 507, width: 53, height: 22, initialValue: "277,21", style: { fontSize: '8px', background: 'white', color: '#000' }, className: "text-right" }, 
  

  { name: 'item2Desc', x: 55, y: 504, width: 132, height: 22, initialValue: "Energia Atv Injetada", style: { fontSize: '8px', color: '#000' } },
  { name: 'item2Tarifa', x: 300, y: 504, width: 70, height: 22, initialValue: "0,847430", style: { fontSize: '8px', color: '#000' }, className: "text-right" },
  { name: 'item2Valor', x: 370, y: 504, width: 70, height: 22, initialValue: "146,60", style: { fontSize: '8px', color: '#000' }, className: "text-right" },
        
  { name: 'item3Desc', x: 55, y: 537, width: 132, height: 22, initialValue: "Contrib de Ilum Pub", style: { fontSize: '8px', background: 'white', color: '#000' } },
  { name: 'item3Valor', x: 370, y: 537, width: 70, height: 22, initialValue: "13,75", style: { fontSize: '8px', color: '#000' }, className: "text-right" },
];


export const PLANUS_INVOICE_FIELDS_CONFIG: FieldConfig[] = [
  // Header Section - Left Side (Based on Bowe Image)
  { name: 'headerTitle', x: 300, y: 20, width: 250, height: 20, style: { fontSize: '14px', fontWeight: 'bold', color: '#D9087E' } , initialValue: "ENTENDA SUA FATURA!" }, // ENTENDA SUA FATURA!
  { name: 'boweNomeRazaoSocial', x: 60, y: 90, width: 300, height: 18, style: { fontSize: '10px', fontWeight: 'bold', color: '#000' } }, // Nome/Razão Social
  { name: 'boweCpfCnpj', x: 60, y: 105, width: 200, height: 18, style: { fontSize: '10px', color: '#555' } }, // CPF/CNPJ
  { name: 'boweEnderecoCompleto', x: 60, y: 125, width: 300, height: 30, style: { fontSize: '9px', color: '#555' }, isTextarea: true }, // Endereço

  // Header Section - Right Side
  { name: 'boweNumeroInstalacao', x: 570, y: 68, width: 150, height: 18, style: { fontSize: '10px', color: '#000' }, className: 'text-left' },
  { name: 'boweMesReferencia', x: 570, y: 102, width: 150, height: 18, style: { fontSize: '10px', fontWeight: 'bold', color: '#D9087E' }, className: 'text-left' }, // Mês de Referência
  { name: 'boweTipoLigacao', x: 570, y: 85, width: 150, height: 18, style: { fontSize: '10px', color: '#555' }, className: 'text-left' }, // Tipo de Ligação
  { name: 'boweDataVencimento', x: 570, y: 119, width: 150, height: 18, style: { fontSize: '10px', fontWeight: 'bold', color: '#D9087E' }, className: 'text-left' }, // Data de Vencimento
  { name: 'boweNumeroBoleto', x: 570, y: 136, width: 150, height: 18, style: { fontSize: '10px', color: '#555' }, className: 'text-left' }, // Número do Boleto
  { name: 'boweTotalAPagar', x: 570, y: 153, width: 150, height: 20, style: { fontSize: '14px', fontWeight: 'bold', color: '#D9087E' }, className: 'text-left' }, // Total a Pagar
  { name: 'boweDataEmissao', x: 570, y: 170, width: 150, height: 18, style: { fontSize: '10px', color: '#555' }, className: 'text-left' }, // Data de Emissão

  // "Entenda sua Fatura" Icons section
  // Labels are part of the background image. These fields are for the values.
  { name: 'boweAntesValor',              x: 80,  y: 262, width: 100, height: 20, style: { fontSize: '11px', fontWeight: 'bold', color: '#000' }, className: 'text-center' },
  { name: 'boweDepoisValor',             x: 218, y: 262, width: 100, height: 20, style: { fontSize: '11px', fontWeight: 'bold', color: '#000' }, className: 'text-center' },
  { name: 'boweEconomiaMensalValor',     x: 350, y: 262, width: 100, height: 20, style: { fontSize: '11px', fontWeight: 'bold', color: '#000' }, className: 'text-center' },
  { name: 'boweEconomiaAcumuladaValor',  x: 480, y: 262, width: 100, height: 20, style: { fontSize: '11px', fontWeight: 'bold', color: '#000' }, className: 'text-center', initialValue: "R$ 0,00" }, // Placeholder
  { name: 'boweReducaoCO2Valor',         x: 600, y: 262, width: 70, height: 20, style: { fontSize: '11px', fontWeight: 'bold', color: '#000' }, className: 'text-center', initialValue: "0 t" }, // Placeholder
  { name: 'boweArvoresPlantadasValor',   x: 700, y: 262, width: 70, height: 20, style: { fontSize: '11px', fontWeight: 'bold', color: '#000' }, className: 'text-center', initialValue: "0" }, // Placeholder

  // "Seus Custos Mensais" Table (approximated)
  // Header text ("Descrição", "Quantidade", etc.) is part of the background.
  // Row 1: Custos da distribuidora
  { name: 'boweCustosDistribuidoraDesc',  x: 65, y: 341, width: 200, height: 18, style: { fontSize: '10px', color: '#000' }, initialValue: "Custos da distribuidora" },
  { name: 'boweCustosDistribuidoraValor', x: 650, y: 341, width: 100, height: 18, style: { fontSize: '10px', color: '#000' }, className: 'text-right' },
  // Row 2: Energia elétrica Planus
  { name: 'boweEnergiaEletricaDesc',   x: 65, y: 359, width: 200, height: 18, style: { fontSize: '10px', color: '#000' } },
  { name: 'boweEnergiaEletricaQtd',    x: 300, y: 359, width: 100, height: 18, style: { fontSize: '10px', color: '#000' }, className: 'text-right' },
  { name: 'boweEnergiaEletricaTarifa', x: 450, y: 359, width: 130, height: 18, style: { fontSize: '10px', color: '#000' }, className: 'text-right' },
  { name: 'boweEnergiaEletricaValor',  x: 650, y: 359, width: 100, height: 18, style: { fontSize: '10px', color: '#000' }, className: 'text-right' },
  // Row 3: Restituição PIS/COFINS
  { name: 'boweRestituicaoPisCofinsDesc', x: 65, y: 377, width: 200, height: 18, style: { fontSize: '10px', color: '#000' }, initialValue: "Restituição PIS/COFINS" },
  { name: 'boweRestituicaoPisCofinsValor',x: 650, y: 377, width: 100, height: 18, style: { fontSize: '10px', color: '#000' }, className: 'text-right', initialValue: "-R$ 0,00" }, // As per Bowe image
  // Row 4: Créditos Planus
  { name: 'boweCreditosDesc',  x: 65, y: 395, width: 200, height: 18, style: { fontSize: '10px', color: '#000' }, initialValue: "Créditos Planus" },
  { name: 'boweCreditosValor', x: 650, y: 395, width: 100, height: 18, style: { fontSize: '10px', color: '#000' }, className: 'text-right' },
  // TOTAL Row
  { name: 'boweCustosTotalValor', x: 650, y: 417, width: 100, height: 20, style: { fontSize: '12px', fontWeight: 'bold', color: '#D9087E' }, className: 'text-right' },
  
  // Observação
  { name: 'boweObservacao', x: 65, y: 440, width: 400, height: 30, style: { fontSize: '9px', color: '#555' }, isTextarea: true, initialValue: "Observações adicionais aqui..." },

  // PIX Section (simplified - labels are part of background)
  { name: 'boweMesReferencia', x: 210, y: 688, width: 100, height: 16, style: { fontSize: '9px', color: '#000'}, className: 'text-left'}, // Mês de Referência (PIX)
  { name: 'boweDataVencimento', x: 340, y: 688, width: 100, height: 16, style: { fontSize: '9px', color: '#000'}, className: 'text-left'}, // Data de Vencimento (PIX)
  { name: 'boweTotalAPagar', x: 475, y: 688, width: 100, height: 16, style: { fontSize: '9px', fontWeight: 'bold', color: '#000'}, className: 'text-left'}, // Total a Pagar (PIX)
  { name: 'boweNumeroInstalacao', x: 600, y: 688, width: 100, height: 16, style: { fontSize: '9px', color: '#000'}, className: 'text-left'}, // N° de Instalação (PIX)
  { name: 'bowePixCodigo', x: 60, y: 705, width: 680, height: 20, style: { fontSize: '9px', color: '#000', letterSpacing: '1px' }, initialValue:"00190.00009 03730.402009 00007.8131731 10310001024400" }, // PIX Code
  { name: 'bowePixBeneficiario', x: 60, y: 735, width: 400, height: 16, style: { fontSize: '9px', color: '#000' }, initialValue:"Beneficiário: PLANUS COMERCIALIZADORA VAREJISTA LTDA - CNPJ: XX.XXX.XXX/XXXX-XX" }, // Beneficiary
];


// Helper to generate initial data structure from a config
const generateInitialData = (config: FieldConfig[]): Partial<InvoiceData> => {
  return config.reduce((acc, field) => {
    acc[field.name] = field.initialValue || ""; // Use initialValue from config or empty string
    return acc;
  }, {} as Partial<InvoiceData>);
};

// Generate default initial data for Energisa
export const initialEnergisaData: InvoiceData = {
  ...generateInitialData(ENERGISA_INVOICE_FIELDS_CONFIG),
  // Ensure all required fields of InvoiceData have a default, even if just empty string
  headerTitle: "SIMULACAO DE FATURA DA ENERGISA",
  companyName: "ENERGISA MATO GROSSO - DISTRIBUIDORA DE ENERGIA S A",
  // ... other specific defaults for Energisa if not covered by ENERGISA_INVOICE_FIELDS_CONFIG's initialValues
} as InvoiceData; // Cast as InvoiceData to satisfy type

// Generate default initial data for Planus (can be minimal as it's populated dynamically)
export const initialPlanusData: InvoiceData = {
  ...generateInitialData(PLANUS_INVOICE_FIELDS_CONFIG),
  headerTitle: "ENTENDA SUA FATURA PLANUS",
  companyName: "ENERGIA ELÉTRICA FORNECIDA PLANUS COMERCIALIZADORA VAREJISTA LTDA",
  // ... other specific defaults for Planus
} as InvoiceData; // Cast as InvoiceData


export const initialInvoiceData = initialEnergisaData; // Default export for general use
