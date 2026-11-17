export const requestTypes = [
  'Letter of employment',
  'Address proof letter',
  'Asset request',
  'Access request',
  'Reimbursement',
  'Other',
]

export const initialRequests = [
  {
    id: 'req-1',
    type: 'Letter of employment',
    description: 'Needed for visa application',
    submittedAt: '2026-03-12',
    updatedAt: '2026-03-13',
    owner: 'Ananya Gupta',
    status: 'pending',
  },
  {
    id: 'req-2',
    type: 'Reimbursement',
    description: 'Internet allowance – Feb 2026',
    submittedAt: '2026-03-05',
    updatedAt: '2026-03-08',
    owner: 'Rohan Mehta',
    status: 'approved',
  },
  {
    id: 'req-3',
    type: 'Asset request',
    description: 'External monitor for WFH setup',
    submittedAt: '2026-02-20',
    updatedAt: '2026-02-28',
    owner: 'IT Helpdesk',
    status: 'closed',
  },
  {
    id: 'req-4',
    type: 'Access request',
    description: 'Figma organization seat',
    submittedAt: '2026-02-10',
    updatedAt: '2026-02-11',
    owner: 'Meera Iyer',
    status: 'approved',
  },
]
