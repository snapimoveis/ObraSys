import { useState, useMemo, useEffect } from 'react';
import { ComplianceItem, ComplianceStatus, AuditLog } from '../types';
import { generateInitialCompliance } from '../utils/complianceRules';

export const useCompliance = (workId: string | undefined) => {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock initial load
  useEffect(() => {
    if (!workId) {
      setItems([]);
      return;
    }
    
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setItems(generateInitialCompliance(workId));
      setLoading(false);
    }, 600);
  }, [workId]);

  const updateStatus = (itemId: string, newStatus: ComplianceStatus, user: string, reason?: string, evidence?: string) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id !== itemId) return item;

      const log: AuditLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        user,
        action: 'UPDATE_STATUS',
        previousValue: item.status,
        newValue: newStatus,
        reason: reason || 'Atualização manual'
      };

      return {
        ...item,
        status: newStatus,
        evidence: evidence !== undefined ? evidence : item.evidence,
        lastUpdated: new Date().toISOString(),
        auditTrail: [log, ...item.auditTrail] // Append log
      };
    }));
  };

  const addEvidence = (itemId: string, note: string, user: string) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id !== itemId) return item;

      const log: AuditLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        user,
        action: 'ADD_EVIDENCE',
        newValue: note,
      };

      return {
        ...item,
        evidence: note,
        lastUpdated: new Date().toISOString(),
        auditTrail: [log, ...item.auditTrail]
      };
    }));
  };

  const stats = useMemo(() => {
    const total = items.length;
    const compliant = items.filter(i => i.status === 'COMPLIANT' || i.status === 'WAIVED').length;
    const pending = items.filter(i => i.status === 'PENDING').length;
    const criticalIssues = items.filter(i => i.critical && (i.status === 'NON_COMPLIANT' || i.status === 'PENDING')).length;
    const percentage = total > 0 ? (compliant / total) * 100 : 100;

    return { total, compliant, pending, criticalIssues, percentage };
  }, [items]);

  return {
    items,
    loading,
    stats,
    updateStatus,
    addEvidence
  };
};
