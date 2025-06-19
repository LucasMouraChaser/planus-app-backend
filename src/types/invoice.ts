
import type React from 'react';

export interface InvoiceData {
  headerTitle: string;
  companyName: string;
  companyAddress: string;
  companyCityStateZip: string;
  companyCnpj: string;
  companyInscEst: string;
  domBanco: string;
  domEnt: string;
  classificacao: string;
  ligacao: string;
  tensaoNominalDisp: string;
  limMinTensao: string;
  limMaxTensao: string;
  leituraAnteriorData: string;
  leituraAtualData: string;
  numDiasFaturamento: string;
  proximaLeituraData: string;
  notaFiscalNum: string;
  clienteNome: string;
  clienteEndereco: string;
  clienteBairro: string;
  clienteCidadeUF: string;
  clienteCnpjCpf: string;
  codigoClienteInstalacao: string;
  mesAnoReferencia: string;
  dataVencimento: string;
  valorTotalFatura: string;
  item1Desc: string;
  item1Unidade: string;
  item1Quantidade: string;
  item1Tarifa: string;
  item1Valor: string;
  item1PisBase: string;
  item1PisAliq: string;
  item1PisValor: string;
  item1CofinsBase: string;
  item1CofinsAliq: string;
  item1CofinsValor: string;
  item1IcmsBase: string;
  item1IcmsPerc: string;
  item1TarifaEnergiaInjetadaREF: string; 
  item1IcmsRS: string; 
  item2Desc: string; 
  item2Tarifa: string; 
  item2Valor: string; 
  item3Desc: string; 
  item3Valor: string;
  
  // Fields for "Planus" (bowe-like) layout. Prefix 'bowe' or 'planus' can be used.
  // For clarity, I'll use 'bowe' as per previous discussion, but component can be PlanusInvoiceDisplay
  boweNomeRazaoSocial?: string; 
  boweCpfCnpj?: string; 
  boweEnderecoCompleto?: string; 
  boweNumeroInstalacao?: string; 
  boweMesReferencia?: string; 
  boweTipoLigacao?: string; 
  boweDataVencimento?: string; 
  boweNumeroBoleto?: string; 
  boweTotalAPagar?: string; 
  boweDataEmissao?: string; 

  boweAntesValor?: string; // "Antes da Planus" value
  boweDepoisValor?: string; // "Depois da Planus" value (same as boweTotalAPagar)
  boweEconomiaMensalValor?: string;
  boweEconomiaAcumuladaValor?: string; 
  boweReducaoCO2Valor?: string; 
  boweArvoresPlantadasValor?: string;

  // For "Seus Custos Mensais" table in Planus layout
  boweCustosDistribuidoraDesc?: string; // e.g. "Custos da distribuidora (CIP Cuiabá)"
  boweCustosDistribuidoraValor?: string; // e.g. CIP value
  boweEnergiaEletricaDesc?: string; // e.g. "Energia elétrica Planus"
  boweEnergiaEletricaQtd?: string; // e.g. "1500 kWh"
  boweEnergiaEletricaTarifa?: string; // e.g. "R$ 0,705000" (discounted unit price)
  boweEnergiaEletricaValor?: string; // e.g. Discounted energy cost
  boweRestituicaoPisCofinsDesc?: string; // e.g. "PIS/COFINS"
  boweRestituicaoPisCofinsValor?: string; // e.g. Calculated PIS/COFINS on discounted energy
  boweCreditosDesc?: string; // e.g. "Créditos Energia Injetada"
  boweCreditosValor?: string; // e.g. Value of injected energy (can be negative)
  boweCustosTotalValor?: string; // Same as boweTotalAPagar

  boweObservacao?: string; 

  // For "QUANTO VOCÊ GASTARIA SEM A PLANUS" table
  boweSemBowCustosDistribuidoraValor?: string; // Original item1Valor (Energia)
  boweSemBowIluminacaoPublicaValor?: string; // Original item3Valor (CIP)
  boweSemBowDemaisCustosValor?: string; // Placeholder for other costs (e.g., Custo Disponibilidade if separated)
  boweSemBowTotalValor?: string; // Original valorTotalFatura (Energisa)
  
  // Placeholder for PIX details
  bowePixBeneficiario?: string;
  bowePixCodigo?: string;

  valorProducaoPropria?: string; 
  [key: string]: string | undefined; // Allow other string keys
}

export interface FieldConfig {
  name: keyof InvoiceData; 
  x: number;
  y: number;
  width: number;
  height: number;
  initialValue?: string; 
  style?: React.CSSProperties;
  className?: string;
  isTextarea?: boolean;
}

    