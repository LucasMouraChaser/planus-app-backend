// /src/lib/discount-calculator.ts
import type { SavingsResult } from "@/types";

// Constants
const MIN_BILL_AMOUNT_VALID = 50; // Example minimum bill amount for savings to apply
const MAX_BILL_AMOUNT_VALID = 100000; // Example maximum

export function calculateSavings(billAmountInReais: number): SavingsResult {
  let effectiveAnnualDiscountPercentage: number;
  let discountDescription: string;

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

  let firstTwoMonthsDiscountRate: number;
  let nextTenMonthsDiscountRate: number;
  let fixedAnnualDiscountRate: number | null = null;

  if (billAmountInReais <= 1000) {
    firstTwoMonthsDiscountRate = 0.25; // 25%
    nextTenMonthsDiscountRate = 0.15; // 15%
    discountDescription = "25% nos 2 primeiros meses, 15% nos 10 meses seguintes.";
  } else if (billAmountInReais <= 3000) {
    firstTwoMonthsDiscountRate = 0.25; // 25%
    nextTenMonthsDiscountRate = 0.18; // 18%
    discountDescription = "25% nos 2 primeiros meses, 18% nos 10 meses seguintes.";
  } else if (billAmountInReais <= 5000) {
    firstTwoMonthsDiscountRate = 0.25; // 25%
    nextTenMonthsDiscountRate = 0.22; // 22%
    discountDescription = "25% nos 2 primeiros meses, 22% nos 10 meses seguintes.";
  } else if (billAmountInReais <= 10000) {
    fixedAnnualDiscountRate = 0.25; // 25%
    discountDescription = "25% de desconto fixo anual.";
  } else if (billAmountInReais <= 20000) {
    fixedAnnualDiscountRate = 0.28; // 28%
    discountDescription = "28% de desconto fixo anual.";
  } else { // billAmountInReais > 20000
    fixedAnnualDiscountRate = 0.30; // 30%
    discountDescription = "30% de desconto fixo anual.";
  }

  let totalSavingsYear: number;
  let averageMonthlySaving: number;

  if (fixedAnnualDiscountRate !== null) {
    totalSavingsYear = billAmountInReais * 12 * fixedAnnualDiscountRate;
    averageMonthlySaving = totalSavingsYear / 12;
    effectiveAnnualDiscountPercentage = fixedAnnualDiscountRate * 100;
  } else {
    const savingsFirstTwoMonths = billAmountInReais * firstTwoMonthsDiscountRate * 2;
    const savingsNextTenMonths = billAmountInReais * nextTenMonthsDiscountRate * 10;
    totalSavingsYear = savingsFirstTwoMonths + savingsNextTenMonths;
    averageMonthlySaving = totalSavingsYear / 12;
    // Calculate effective annual percentage based on total savings
    effectiveAnnualDiscountPercentage = (totalSavingsYear / (billAmountInReais * 12)) * 100;
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
