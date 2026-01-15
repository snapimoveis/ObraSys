import React from 'react';
import { RDOStatus } from '../../types';
import { getRDOStatusColor, getRDOStatusLabel } from '../../utils/rdoUtils';
import { FileText, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  status: RDOStatus;
  className?: string;
}

const RDOStatusBadge: React.FC<Props> = ({ status, className = '' }) => {
  const colorClass = getRDOStatusColor(status);
  const label = getRDOStatusLabel(status);

  const getIcon = () => {
    switch (status) {
      case 'DRAFT': return <FileText size={12} />;
      case 'SUBMITTED': return <Lock size={12} />;
      case 'VALIDATED': return <CheckCircle2 size={12} />;
      case 'RECTIFIED': return <AlertCircle size={12} />;
      default: return null;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${colorClass} ${className}`}>
      {getIcon()}
      {label}
    </span>
  );
};

export default RDOStatusBadge;
