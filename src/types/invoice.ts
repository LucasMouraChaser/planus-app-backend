
import type React from 'react';

export interface InvoiceData {
  headerTitle: string;
  companyName: string;
  companyAddress: string;
  companyCityStateZip: string;
  companyCnpj: string;
  companyInscEst: string;
  roteiroMatricula: string;
  notaFiscalConcorrencia: string; // Field 'x' in HTML. Changed name for clarity.
  domBanco: string;
  domEnt: string;
  classificacao: string;
  ligacao: string;
  tensaoNominalDisp: string;
  limMinTensao: string;
  limMaxTensao: string;
  dataApresentacao: string;
  codDebAutom: string;
  leituraAnteriorData: string;
  leituraAtualData: string;
  numDiasFaturamento: string;
  proximaLeituraData: string;
  notaFiscalNum: string;
  notaFiscalSerie: string;
  dataEmissaoNF: string;
  chaveAcessoNFe: string;
  contingenciaNFe: string;
  qrNFePlaceholder: string;
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
  // totalItensValor: string; // Removido conforme solicitado
  totalPisValor: string;
  totalCofinsValor: string;
  totalIcmsValor: string;
  [key: string]: string; 
}

export interface FieldConfig {
  name: keyof InvoiceData;
  x: number;
  y: number;
  width: number;
  height: number;
  initialValue: string;
  style?: React.CSSProperties;
  className?: string;
  isTextarea?: boolean;
}

