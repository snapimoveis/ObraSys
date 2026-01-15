import React from 'react';
import { ComplianceStatus } from '../../types';
import { getStatusColor, getStatusLabel } from '../../utils/complianceRules';
import { CheckCircle2, AlertCircle, Clock, XCircle, MinusCircle } from 'lucide-react';

interface Props {
  status: ComplianceStatus;
  showIcon?: boolean;
  className?: string;
}

const ComplianceStatusBadge: React.FC<Props> = ({ status, showIcon = true, className = '' }) => {
  const colorClass = getStatusColor(status);
  const label = getStatusLabel(status);

  const getIcon = () => {
    switch (status) {
      case 'COMPLIANT': return <CheckCircle2 size={12} />;
      case 'NON_COMPLIANT': return <XCircle size={12} />;
      case 'IN_REVIEW': return <Clock size={12} />;
      case 'PENDING': return <AlertCircle size={12} />;
      case 'WAIVED': return <MinusCircle size={12} />;
      default: return null;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${colorClass} ${className}`}>
      {showIcon && getIcon()}
      {label}
    </span>
  );
};

export default ComplianceStatusBadge;
