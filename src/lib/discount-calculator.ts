
// /src/lib/discount-calculator.ts
import type { SavingsResult } from "@/types";

// Constants
const MIN_BILL_AMOUNT_VALID = 50; 
const MAX_BILL_AMOUNT_VALID = 100000; 
const FIXED_DISCOUNT_NO_FIDELITY = 0.15; // 15%

export function calculateSavings(billAmountInReais: number, isFidelityEnabled: boolean): SavingsResult {
  let effectiveAnnualDiscountPercentage: number;
  let discountDescription: string;
  let totalSavingsYear: number;
  let averageMonthlySaving: number;

  if (billAmountInReais < MIN_BILL_AMOUNT_VALID || billAmountInReais > MAX_BILL_AMOUNT_VALID) {
    return {
      effectiveAnnualDiscountPercentage: 0,
      monthlySaving: 0,
      annualSaving: 0,
      discountDescription: "Valor da conta fora da faixa de cálculo para descontos.",
      originalMonthlyBill: billAmountInReais,
      newMonthlyBillWithSent: billAmountInReais,
    };
  }

  if (!isFidelityEnabled) {
    // Fixed 15% discount if fidelity is not enabled
    totalSavingsYear = billAmountInReais * 12 * FIXED_DISCOUNT_NO_FIDELITY;
    averageMonthlySaving = totalSavingsYear / 12;
    effectiveAnnualDiscountPercentage = FIXED_DISCOUNT_NO_FIDELITY * 100;
    discountDescription = "15% de desconto fixo (sem fidelidade).";
  } else {
    // Existing tiered logic for when fidelity is enabled
    let firstTwoMonthsDiscountRate: number;
    let nextTenMonthsDiscountRate: number;
    let fixedAnnualDiscountRate: number | null = null;

    if (billAmountInReais <= 1000) {
      firstTwoMonthsDiscountRate = 0.25; // 25%
      nextTenMonthsDiscountRate = 0.15; // 15%
      discountDescription = "Com fidelidade: 25% nos 2 primeiros meses, 15% nos 10 meses seguintes.";
    } else if (billAmountInReais <= 3000) {
      firstTwoMonthsDiscountRate = 0.25; // 25%
      nextTenMonthsDiscountRate = 0.18; // 18%
      discountDescription = "Com fidelidade: 25% nos 2 primeiros meses, 18% nos 10 meses seguintes.";
    } else if (billAmountInReais <= 5000) {
      firstTwoMonthsDiscountRate = 0.25; // 25%
      nextTenMonthsDiscountRate = 0.22; // 22%
      discountDescription = "Com fidelidade: 25% nos 2 primeiros meses, 22% nos 10 meses seguintes.";
    } else if (billAmountInReais <= 10000) {
      fixedAnnualDiscountRate = 0.25; // 25%
      discountDescription = "Com fidelidade: 25% de desconto fixo anual.";
    } else if (billAmountInReais <= 20000) {
      fixedAnnualDiscountRate = 0.28; // 28%
      discountDescription = "Com fidelidade: 28% de desconto fixo anual.";
    } else { // billAmountInReais > 20000
      fixedAnnualDiscountRate = 0.30; // 30%
      discountDescription = "Com fidelidade: 30% de desconto fixo anual.";
    }

    if (fixedAnnualDiscountRate !== null) {
      totalSavingsYear = billAmountInReais * 12 * fixedAnnualDiscountRate;
      averageMonthlySaving = totalSavingsYear / 12;
      effectiveAnnualDiscountPercentage = fixedAnnualDiscountRate * 100;
    } else {
      const savingsFirstTwoMonths = billAmountInReais * firstTwoMonthsDiscountRate * 2;
      const savingsNextTenMonths = billAmountInReais * nextTenMonthsDiscountRate * 10;
      totalSavingsYear = savingsFirstTwoMonths + savingsNextTenMonths;
      averageMonthlySaving = totalSavingsYear / 12;
      effectiveAnnualDiscountPercentage = (totalSavingsYear / (billAmountInReais * 12)) * 100;
    }
  }
  
  const newMonthlyBillWithSent = billAmountInReais - averageMonthlySaving;

  return {
    effectiveAnnualDiscountPercentage: parseFloat(effectiveAnnualDiscountPercentage.toFixed(2)),
    monthlySaving: parseFloat(averageMonthlySaving.toFixed(2)),
    annualSaving: parseFloat(totalSavingsYear.toFixed(2)),
    discountDescription,
    originalMonthlyBill: parseFloat(billAmountInReais.toFixed(2)),
    newMonthlyBillWithSent: parseFloat(newMonthlyBillWithSent.toFixed(2)),
  };
}
