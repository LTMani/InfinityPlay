import { describe, it, expect, beforeEach } from 'vitest';
import { EconomyEngine } from '../simulation/economy/EconomyEngine';

describe('EconomyEngine & Financial Integrity', () => {
  let economy: EconomyEngine;

  beforeEach(() => {
    economy = new EconomyEngine(50000);
  });

  it('should initialize with correct balance', () => {
    expect(economy.cash).toBe(50000);
    expect(economy.canAfford(30000)).toBe(true);
    expect(economy.canAfford(60000)).toBe(false);
  });

  it('should record income transactions and update balance and revenue', () => {
    economy.recordTransaction('FUEL', 1500, 'Fuel Sale Batch', 1, 10);

    expect(economy.cash).toBe(51500);
    expect(economy.totalRevenue).toBe(1500);
    expect(economy.records.length).toBe(1);
    expect(economy.records[0].category).toBe('FUEL');
  });

  it('should record expense transactions and decrease cash', () => {
    economy.recordTransaction('SALARIES', -450, 'Hourly Payroll', 1, 11);

    expect(economy.cash).toBe(49550);
    expect(economy.totalExpenses).toBe(450);
  });

  it('should issue bank loans and disburse funds', () => {
    const success = economy.takeLoan('Expansion Loan', 20000, 0.10, 10);

    expect(success).toBe(true);
    expect(economy.cash).toBe(70000);
    expect(economy.activeLoans.length).toBe(1);
    expect(economy.activeLoans[0].remainingBalance).toBe(22000);
  });

  it('should process daily loan repayment installments', () => {
    economy.takeLoan('Small Loan', 10000, 0.05, 5); // total repay 10500, daily 2100
    const cashBefore = economy.cash;

    economy.processDailyLoanPayments(2);

    expect(economy.cash).toBe(cashBefore - 2100);
    expect(economy.activeLoans[0].remainingBalance).toBe(8400);
  });

  it('should accurately compute daily net profit and category breakdowns', () => {
    economy.recordTransaction('FUEL', 300, 'Fuel', 1, 9);
    economy.recordTransaction('STORE', 120, 'Store', 1, 10);
    economy.recordTransaction('UPKEEP', -80, 'Power', 1, 11);

    const net = economy.getDailyNetProfit(1);
    expect(net).toBe(340);

    const breakdown = economy.getCategoryBreakdown(1);
    expect(breakdown['FUEL'].income).toBe(300);
    expect(breakdown['STORE'].income).toBe(120);
    expect(breakdown['UPKEEP'].expense).toBe(80);
  });
});
