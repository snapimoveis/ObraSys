import { useState, useMemo } from 'react';
import { ApprovalRequest, ApprovalStatus, ApprovalHistory } from '../types';

const MOCK_APPROVALS: ApprovalRequest[] = [
  {
    id: 'apr-1',
    type: 'BUDGET',
    reference: 'Orçamento #2023-001 v2',
    description: 'Revisão do orçamento da Moradia V4 após alterações do cliente.',
    workId: 'w1',
    workName: 'Moradia V4 - Cascais',
    requester: 'Ana Silva',
    requesterRole: 'Eng. Civil',
    requestedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    amount: 450000,
    status: 'PENDING',
    priority: 'HIGH',
    complianceStatus: 'OK',
    history: [
      { id: 'h1', action: 'CREATED', user: 'Ana Silva', date: new Date(Date.now() - 3600000 * 2).toISOString() }
    ]
  },
  {
    id: 'apr-2',
    type: 'MEASUREMENT',
    reference: 'Auto de Medição #3',
    description: 'Medição mensal de Novembro. Betonagem concluída.',
    workId: 'w1',
    workName: 'Moradia V4 - Cascais',
    requester: 'Carlos Mendes',
    requesterRole: 'Encarregado',
    requestedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    amount: 25000,
    status: 'PENDING',
    priority: 'MEDIUM',
    complianceStatus: 'BLOCKED',
    complianceIssues: ['Falta validação técnica do betão', 'Seguro expirado'],
    history: [
      { id: 'h2', action: 'CREATED', user: 'Carlos Mendes', date: new Date(Date.now() - 3600000 * 24).toISOString() }
    ]
  },
  {
    id: 'apr-3',
    type: 'RDO',
    reference: 'RDO #45 (12/11)',
    description: 'Registo diário com ocorrência de acidente leve.',
    workId: 'w2',
    workName: 'Reabilitação Baixa',
    requester: 'João Ferreira',
    requesterRole: 'Subempreiteiro',
    requestedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'PENDING',
    priority: 'CRITICAL',
    complianceStatus: 'OK',
    history: [
      { id: 'h3', action: 'CREATED', user: 'João Ferreira', date: new Date(Date.now() - 3600000 * 4).toISOString() }
    ]
  }
];

export const useApprovals = () => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(MOCK_APPROVALS);

  const processApproval = (id: string, action: 'APPROVE' | 'REJECT' | 'HOLD', note: string, user: string) => {
    setApprovals(prev => prev.map(req => {
      if (req.id !== id) return req;

      let newStatus: ApprovalStatus = req.status;
      if (action === 'APPROVE') newStatus = 'APPROVED';
      if (action === 'REJECT') newStatus = 'REJECTED';
      if (action === 'HOLD') newStatus = 'ON_HOLD';

      const newHistoryItem: ApprovalHistory = {
        id: Date.now().toString(),
        action: action === 'APPROVE' ? 'APPROVED' : action === 'REJECT' ? 'REJECTED' : 'ON_HOLD',
        user,
        date: new Date().toISOString(),
        note
      };

      return {
        ...req,
        status: newStatus,
        history: [newHistoryItem, ...req.history]
      };
    }));
  };

  const pendingCount = useMemo(() => approvals.filter(a => a.status === 'PENDING').length, [approvals]);
  const urgentCount = useMemo(() => approvals.filter(a => a.status === 'PENDING' && (a.priority === 'HIGH' || a.priority === 'CRITICAL')).length, [approvals]);

  return {
    approvals,
    pendingCount,
    urgentCount,
    processApproval
  };
};
