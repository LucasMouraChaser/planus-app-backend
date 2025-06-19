
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
  
  // Fields for "bowe" layout / Planus
  boweNomeRazaoSocial?: string; // Will be same as clienteNome but useful for explicit mapping
  boweCpfCnpj?: string; // same as clienteCnpjCpf
  boweEnderecoCompleto?: string; // Combination of rua, numero, bairro, cidade, uf, cep
  boweNumeroInstalacao?: string; // same as codigoClienteInstalacao
  boweMesReferencia?: string; // same as mesAnoReferencia
  boweTipoLigacao?: string; // same as ligacao + classificacao (e.g., "Comercial Trifásico")
  boweDataVencimento?: string; // same as dataVencimento
  boweNumeroBoleto?: string; // New field, can be static or from proposal
  boweTotalAPagar?: string; // same as valorTotalFatura (for Planus)
  boweDataEmissao?: string; // New field, can be static or from proposal (e.g. today)

  boweAntesValor?: string;
  boweDepoisValor?: string;
  boweEconomiaMensalValor?: string;
  boweEconomiaAcumuladaValor?: string; // Example, can be static for now
  boweReducaoCO2Valor?: string; // Example, can be static for now
  boweArvoresPlantadasValor?: string; // Example, can be static for now

  // For "Seus Custos Mensais" table in Bowe layout
  boweCustosDistribuidoraDesc?: string;
  boweCustosDistribuidoraValor?: string;
  boweEnergiaEletricaDesc?: string;
  boweEnergiaEletricaQtd?: string;
  boweEnergiaEletricaTarifa?: string;
  boweEnergiaEletricaValor?: string;
  boweRestituicaoPisCofinsDesc?: string;
  boweRestituicaoPisCofinsValor?: string;
  boweCreditosDesc?: string;
  boweCreditosValor?: string;
  boweCustosTotalValor?: string; // Same as planusInvoiceData.valorTotalFatura
  boweObservacao?: string; // New field

  // For "QUANTO VOCÊ GASTARIA SEM A BOW-E" table
  boweSemBowCustosDistribuidoraValor?: string; // Original item1Valor
  boweSemBowIluminacaoPublicaValor?: string; // Original item3Valor
  boweSemBowDemaisCustosValor?: string; // Placeholder for now
  boweSemBowTotalValor?: string; // Original valorTotalFatura
  
  // Placeholder for PIX details
  bowePixBeneficiario?: string;
  bowePixCodigo?: string;

  valorProducaoPropria?: string; 
  [key: string]: string | undefined; // Allow other string keys
}

export interface FieldConfig {
  name: keyof InvoiceData; // Make sure all names used exist in InvoiceData
  x: number;
  y: number;
  width: number;
  height: number;
  initialValue?: string; // Make initialValue optional
  style?: React.CSSProperties;
  className?: string;
  isTextarea?: boolean;
}
