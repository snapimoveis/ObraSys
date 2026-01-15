import React from 'react';
import { TeamMember, Role, MemberStatus } from '../../types';
import { MoreVertical, Mail, Phone, Building, Trash2, Edit2, ShieldAlert } from 'lucide-react';

interface Props {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onRemove: (id: string) => void;
  onResendInvite: (id: string) => void;
}

const getRoleBadge = (role: Role) => {
  switch (role) {
    case 'ADMIN': return <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold border border-purple-200">Administrador</span>;
    case 'ENGINEER': return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200">Engenheiro</span>;
    case 'FOREMAN': return <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-bold border border-orange-200">Encarregado</span>;
    case 'SUBCONTRACTOR': return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">Subempreiteiro</span>;
    case 'CLIENT': return <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold border border-green-200">Cliente</span>;
    default: return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">{role}</span>;
  }
};

const getStatusIndicator = (status: MemberStatus) => {
  switch (status) {
    case 'ACTIVE': return <span className="w-2 h-2 rounded-full bg-green-500" title="Ativo"></span>;
    case 'INVITED': return <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" title="Pendente"></span>;
    case 'INACTIVE': return <span className="w-2 h-2 rounded-full bg-slate-300" title="Inativo"></span>;
  }
};

const TeamList: React.FC<Props> = ({ members, onEdit, onRemove, onResendInvite }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
          <tr>
            <th className="px-6 py-4">Colaborador</th>
            <th className="px-6 py-4">Função</th>
            <th className="px-6 py-4">Obras</th>
            <th className="px-6 py-4">Contactos</th>
            <th className="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 text-sm">
                      {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white rounded-full">
                      {getStatusIndicator(member.status)}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.status === 'INVITED' ? 'Convite enviado' : member.lastActive}</p>
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4">
                {getRoleBadge(member.role)}
              </td>

              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  {member.assignedWorks.length > 0 ? (
                    member.assignedWorks.map((workId, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Building size={12} className="text-slate-400" />
                        Obra #{workId.split('-')[1]}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Sem obras atribuídas</span>
                  )}
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail size={12} className="text-slate-400" /> {member.email}
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone size={12} className="text-slate-400" /> {member.phone}
                    </div>
                  )}
                </div>
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {member.status === 'INVITED' && (
                    <button 
                      onClick={() => onResendInvite(member.id)}
                      className="p-1.5 bg-white border border-slate-200 rounded hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-slate-500 transition-colors"
                      title="Reenviar Convite"
                    >
                      <Mail size={14} />
                    </button>
                  )}
                  <button 
                    onClick={() => onEdit(member)}
                    className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-500 transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => onRemove(member.id)}
                    className="p-1.5 bg-white border border-slate-200 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 transition-colors"
                    title="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamList;
