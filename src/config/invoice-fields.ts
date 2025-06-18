import type { FieldConfig, InvoiceData } from '@/types/invoice';

export const INVOICE_FIELDS_CONFIG: FieldConfig[] = [
  // Cabeçalho Energisa
  { name: 'headerTitle', x: 220, y: 15, width: 500, height: 16, initialValue: "SIMULACAO DE FATURA DA ENERGISA", style: { fontSize: '11px', fontWeight: 'bold', color: '#000' } },
  { name: 'companyName', x: 220, y: 25, width: 400, height: 18, initialValue: "ENERGISA MATO GROSSO - DISTRIBUIDORA DE ENERGIA S A", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyAddress', x: 220, y: 35, width: 400, height: 18, initialValue: "Rua Vereador João Barbosa Caramuru, 184", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyCityStateZip', x: 220, y: 45, width: 400, height: 18, initialValue: "Cuiabá/MT - CEP 78010-000", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyCnpj', x: 220, y: 55, width: 160, height: 18, initialValue: "CNPJ XX.XXX.XXX/XXXX-XX", style: { fontSize: '9px', color: '#000' } },
  { name: 'companyInscEst', x: 220, y: 65, width: 180, height: 19, initialValue: "Insc. Est. XXXXXXXXXX", style: { fontSize: '9px', color: '#000' } },

  // Bloco Roteiro/Matrícula (superior esquerdo)
  { name: 'roteiroMatricula', x: 73, y: 105, width: 120, height: 14, initialValue: "655-5432-000-0", style: { fontSize: '9px' }, className: "text-left" },
  { name: 'notaFiscalConcorrencia', x: 208, y: 105, width: 100, height: 14, initialValue: "x", style: { fontSize: '9px' }, className: "text-left" },
  { name: 'domBanco', x: 63, y: 120, width: 120, height: 14, initialValue: "", style: { fontSize: '9px' }, className: "text-left" },
  { name: 'domEnt', x: 208, y: 120, width: 100, height: 14, initialValue: "", style: { fontSize: '9px' }, className: "text-left" },
  
  { name: 'classificacao', x: 73, y: 117, width: 240, height: 14, initialValue: "RESIDENCIAL-CONVENCIONAL BAIXA TENSAO B1/B2/B3", style: { fontSize: '8px' }, className: "text-left" },
  { name: 'ligacao', x: 318, y: 127, width: 70, height: 14, initialValue: "TRIFASICO", style: { fontSize: '9px' }, className: "text-left" },
  { name: 'tensaoNominalDisp', x: 200, y: 197, width: 20, height: 18, initialValue: "127", style: { fontSize: '9px' }, className: "text-center" },
  { name: 'limMinTensao', x: 248, y: 197, width: 40, height: 18, initialValue: "117", style: { fontSize: '9px' }, className: "text-center" },
  { name: 'limMaxTensao', x: 328, y: 197, width: 40, height: 18, initialValue: "133", style: { fontSize: '9px' }, className: "text-center" },
  
  // Bloco Datas e NF-e (superior direito) - Adjusted X coordinates for visibility
  { name: 'dataApresentacao', x: 700, y: 105, width: 90, height: 18, initialValue: "18/06/2025", style: { fontSize: '9px' }, className: "text-right" },
  { name: 'codDebAutom', x: 643, y: 120, width: 90, height: 14, initialValue: "6555432", style: { fontSize: '9px' }, className: "text-right" },
  
  { name: 'leituraAnteriorData', x: 510, y: 220, width: 70, height: 18, initialValue: "18/05/2025", style: { fontSize: '9px' }, className: "text-center" },
  { name: 'leituraAtualData', x: 570, y: 220, width: 70, height: 18, initialValue: "18/06/2025", style: { fontSize: '9px' }, className: "text-center" },
  { name: 'numDiasFaturamento', x: 651, y: 220, width: 28, height: 18, initialValue: "30", style: { fontSize: '9px' }, className: "text-center" },
  { name: 'proximaLeituraData', x: 685, y: 220, width: 70, height: 18, initialValue: "18/07/2025", style: { fontSize: '9px' }, className: "text-center" },

  { name: 'notaFiscalNum', x: 0, y: 0, width: 105, height: 13, initialValue: "017.270.053", style: { fontSize: '8.5px' }, className: "text-left" },
  { name: 'notaFiscalSerie', x: 690, y: 180, width: 45, height: 13, initialValue: "002", style: { fontSize: '8.5px' }, className: "text-left" },
  { name: 'dataEmissaoNF', x: 700, y: 191, width: 105, height: 13, initialValue: "18/05/2025", style: { fontSize: '8.5px' }, className: "text-left" },
  { name: 'chaveAcessoNFe', x: 500, y: 218, width: 285, height: 13, initialValue: "5125 0203 4873 2100 0100 5500 2017 2700 5320 8808 7028", style: { fontSize: '8.5px', letterSpacing: '-0.45px' } },
  { name: 'contingenciaNFe', x: 500, y: 243, width: 285, height: 13, initialValue: "EMITIDO EM CONTINGÊNCIA Pendente da Autorização", style: { fontSize: '8px' }, className: "text-center" },
  { name: 'qrNFePlaceholder', x: 720, y: 200, width: 70, height: 13, initialValue: "QR NF-e", style: { fontSize: '7px', textAlign:'center' } },

  // Dados do Cliente
  { name: 'clienteNome', x: 75, y: 219, width: 355, height: 15, initialValue: "MERCADO MIX LTDA", style: { fontSize: '15px', fontWeight: 'bold' } },
  { name: 'clienteEndereco', x: 75, y: 245, width: 355, height: 18, initialValue: "RUA CAMINHO DO SOL, 0 - QD18 LT11 - 78890000", style: { fontSize: '9px' } },
  { name: 'clienteBairro', x: 75, y: 270, width: 155, height: 18, initialValue: "ROTA DO SOL", style: { fontSize: '9px' } },
  { name: 'clienteCidadeUF', x: 75, y: 280, width: 205, height: 18, initialValue: "SORRISO (AG: 167)", style: { fontSize: '9px' } },
  { name: 'clienteCnpjCpf', x: 75, y: 310, width: 155, height: 18, initialValue: "05701044165", style: { fontSize: '10px' } },

  // Código Cliente / Instalação
  { name: 'codigoClienteInstalacao', x: 345, y: 265, width: 155, height: 16, initialValue: "6555432", style: { fontSize: '15px', fontWeight: 'bold', color: '#000', background: 'transparent' } },
  
  // Barra Principal Azul
  { name: 'mesAnoReferencia', x: 120, y: 348, width: 100, height: 18, initialValue: "MAIO / 2025", style: { fontSize: '11px', fontWeight: 'bold', color: '#000', background: 'transparent' } },
  { name: 'dataVencimento', x: 240, y: 348, width: 90, height: 18, initialValue: "10/07/2025", style: { fontSize: '11px', fontWeight: 'bold', color: '#000', background: 'transparent' } },
  { name: 'valorTotalFatura', x: 360, y: 348, width: 120, height: 22, initialValue: "R$ 1.644,71", style: { fontSize: '16px', fontWeight: 'bold', color: '#000', background: 'transparent' } },

  // Tabela Itens da Fatura - Linha 1
  { name: 'item1Desc', x: 55, y: 492, width: 132, height: 16, initialValue: "Consumo em kWh", style: { fontSize: '8px', background: 'white' } },
  { name: 'item1Unidade', x: 220, y: 492, width: 37, height: 16, initialValue: "KWH", style: { fontSize: '8px' }, className: "text-center" },
  { name: 'item1Quantidade', x: 245, y: 492, width: 52, height: 16, initialValue: "1.500,00", style: { fontSize: '8px' }, className: "text-right" },
  { name: 'item1Tarifa', x: 275, y: 492, width: 67, height: 16, initialValue: "1,093110", style: { fontSize: '8px' }, className: "text-right" },
  { name: 'item1Valor', x: 330, y: 492, width: 62, height: 16, initialValue: "1.630,64", style: { fontSize: '8px' }, className: "text-right" },
  { name: 'item1PisBase', x: 610, y: 487, width: 52, height: 16, initialValue: "1.353,43", style: { fontSize: '7px' }, className: "text-right" },
  { name: 'item1PisAliq', x: 666, y: 487, width: 37, height: 16, initialValue: "1,0945", style: { fontSize: '7px', background: 'white' }, className: "text-right" },
  { name: 'item1PisValor', x: 705, y: 487, width: 42, height: 16, initialValue: "14,81", style: { fontSize: '8px' }, className: "text-right" },
  { name: 'item1CofinsBase', x: 610, y: 498, width: 52, height: 16, initialValue: "1.353,43", style: { fontSize: '8px' }, className: "text-right" },
  { name: 'item1CofinsAliq', x: 666, y: 498, width: 37, height: 16, initialValue: "4,9955", style: { fontSize: '8px', background: 'white' }, className: "text-right" },
  { name: 'item1CofinsValor', x: 705, y: 498, width: 42, height: 16, initialValue: "67,61", style: { fontSize: '8px' }, className: "text-right" },
  { name: 'item1IcmsBase', x: 620, y: 508, width: 42, height: 16, initialValue: "1.630,64", style: { fontSize: '8px' }, className: "text-right" },
  { name: 'item1IcmsPerc', x: 676, y: 512, width: 26, height: 15, initialValue: "17,00", style: { fontSize: '8px', background: 'white' }, className: "text-right" },
  { name: 'item1TarifaEnergiaInjetadaREF', x: 565, y: 492, width: 40, height: 16, initialValue: "0,847430", style: { fontSize: '7px', color: '#555' } },
  { name: 'item1IcmsRS', x: 710, y: 361, width: 42, height: 12, initialValue: "277,21", style: { fontSize: '8px' }, className: "text-right" },

  // Linha 2: Energia Injetada GDI UC
  { name: 'item2Desc', x: 55, y: 504, width: 132, height: 16, initialValue: "Energia Atv Injetada", style: { fontSize: '8px' } },
  { name: 'item2Tarifa', x: 285, y: 370, width: 67, height: 12, initialValue: "0,847430", style: { fontSize: '8px' }, className: "text-right" },
  { name: 'item2Valor', x: 330, y: 505, width: 62, height: 16, initialValue: "146,60", style: { fontSize: '8px' }, className: "text-right" },
        
  // Tabela Lançamentos e Serviços
  { name: 'item3Desc', x: 55, y: 537, width: 132, height: 16, initialValue: "Contrib de Ilum Pub", style: { fontSize: '8px', background: 'white' } },
  { name: 'item3Valor', x: 330, y: 537, width: 62, height: 16, initialValue: "13,75", style: { fontSize: '8px' }, className: "text-right" },
  
  // Total Itens
  { name: 'totalItensValor', x: 360, y: 467, width: 62, height: 13, initialValue: "1.644,71", style: { fontSize: '9px', fontWeight: 'bold' }, className: "text-right" },
  { name: 'totalPisValor', x: 520, y: 467, width: 42, height: 13, initialValue: "14,81", style: { fontSize: '9px', fontWeight: 'bold' }, className: "text-right" },
  { name: 'totalCofinsValor', x: 665, y: 467, width: 42, height: 13, initialValue: "67,61", style: { fontSize: '9px', fontWeight: 'bold' }, className: "text-right" },
  { name: 'totalIcmsValor', x: 705, y: 510, width: 42, height: 16, initialValue: "277,21", style: { fontSize: '9px', fontWeight: 'bold' }, className: "text-right" },
];

export const initialInvoiceData = INVOICE_FIELDS_CONFIG.reduce((acc, field) => {
  acc[field.name] = field.initialValue;
  return acc;
}, {} as InvoiceData);
