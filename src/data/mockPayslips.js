export const mockPayslips = [
  {
    id: 'pay-1',
    period: 'February 2026',
    payPeriodStart: '2026-02-01',
    payPeriodEnd: '2026-02-28',
    paymentDate: '2026-03-01',
    netPay: 92450,
    grossPay: 125000,
    status: 'Paid',
  },
  {
    id: 'pay-2',
    period: 'January 2026',
    payPeriodStart: '2026-01-01',
    payPeriodEnd: '2026-01-31',
    paymentDate: '2026-02-01',
    netPay: 91820,
    grossPay: 125000,
    status: 'Paid',
  },
  {
    id: 'pay-3',
    period: 'December 2025',
    payPeriodStart: '2025-12-01',
    payPeriodEnd: '2025-12-31',
    paymentDate: '2026-01-01',
    netPay: 95200,
    grossPay: 125000,
    status: 'Paid',
  },
  {
    id: 'pay-4',
    period: 'November 2025',
    payPeriodStart: '2025-11-01',
    payPeriodEnd: '2025-11-30',
    paymentDate: '2025-12-01',
    netPay: 91000,
    grossPay: 125000,
    status: 'Paid',
  },
]

export const taxDeclarationStatus = {
  investmentDeclaration: { status: 'submitted', dueDate: '2026-03-31', lastUpdated: '2026-02-15' },
  proofOfInvestments: { status: 'pending', dueDate: '2026-04-15', lastUpdated: null },
  form16: { status: 'available', year: 'FY 2024-25' },
}

export const mockLoans = [
  {
    id: 'loan-1',
    type: 'Salary advance',
    amount: 25000,
    outstanding: 10000,
    emi: 5000,
    status: 'Active',
    nextDue: '2026-04-01',
  },
]

export const mockRevisions = [
  {
    id: 'rev-1',
    effectiveDate: '2025-04-01',
    previousCtc: 1400000,
    newCtc: 1550000,
    reason: 'Annual increment',
    status: 'Applied',
  },
]
