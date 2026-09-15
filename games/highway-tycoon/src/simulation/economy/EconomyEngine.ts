import { FinancialRecord } from '../../types';
import { gameEvents } from '../../core/EventBus';

export interface Loan {
  id: string;
  name: string;
  principal: number;
  remainingBalance: number;
  dailyInterestRate: number;
  dailyPayment: number;
}

export class EconomyEngine {
  public cash: number = 0;
  public totalRevenue: number = 0;
  public totalExpenses: number = 0;
  public records: FinancialRecord[] = [];
  public activeLoans: Loan[] = [];

  constructor(initialCash: number = 0) {
    this.cash = initialCash;
  }

  public recordTransaction(
    category: FinancialRecord['category'],
    amount: number,
    description: string,
    day: number,
    hour: number
  ): void {
    this.cash += amount;
    if (amount > 0) {
      this.totalRevenue += amount;
      gameEvents.emit('CASH_EARNED', { amount, category });
    } else {
      this.totalExpenses += Math.abs(amount);
    }

    const record: FinancialRecord = {
      timestamp: Date.now(),
      day,
      hour,
      category,
      amount,
      description
    };

    this.records.unshift(record);
    if (this.records.length > 300) {
      this.records.pop();
    }
  }

  public canAfford(amount: number): boolean {
    return this.cash >= amount;
  }

  public takeLoan(name: string, principal: number, interestRate: number, daysTerm: number): boolean {
    if (this.activeLoans.length >= 3) return false;

    const totalToRepay = principal * (1 + interestRate);
    const dailyPayment = +(totalToRepay / daysTerm).toFixed(2);

    const loan: Loan = {
      id: `loan_${Date.now()}`,
      name,
      principal,
      remainingBalance: totalToRepay,
      dailyInterestRate: interestRate / daysTerm,
      dailyPayment
    };

    this.activeLoans.push(loan);
    this.recordTransaction('SERVICES', principal, `Bank Loan Principal: ${name}`, 1, 12);
    return true;
  }

  public processDailyLoanPayments(day: number): void {
    for (let i = this.activeLoans.length - 1; i >= 0; i--) {
      const loan = this.activeLoans[i];
      const payment = Math.min(loan.remainingBalance, loan.dailyPayment);
      this.recordTransaction('LOAN_INTEREST', -payment, `Loan Installment: ${loan.name}`, day, 0);
      loan.remainingBalance -= payment;

      if (loan.remainingBalance <= 0.01) {
        this.activeLoans.splice(i, 1);
      }
    }
  }

  public getDailyNetProfit(currentDay: number): number {
    return this.records
      .filter(r => r.day === currentDay)
      .reduce((sum, r) => sum + r.amount, 0);
  }

  public getCategoryBreakdown(currentDay: number): Record<string, { income: number; expense: number }> {
    const breakdown: Record<string, { income: number; expense: number }> = {};
    this.records
      .filter(r => r.day === currentDay)
      .forEach(r => {
        if (!breakdown[r.category]) {
          breakdown[r.category] = { income: 0, expense: 0 };
        }
        if (r.amount > 0) {
          breakdown[r.category].income += r.amount;
        } else {
          breakdown[r.category].expense += Math.abs(r.amount);
        }
      });
    return breakdown;
  }
}
