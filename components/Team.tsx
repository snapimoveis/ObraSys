import React, { useState } from 'react';
import { UserPlus, Search, Users, Clock, UserCheck } from 'lucide-react';
import { useTeam } from '../hooks/useTeam';
import TeamList from './team/TeamList';
import TeamMemberForm from './team/TeamMemberForm';
import { TeamMember } from '../types';

const StatCard = ({ label, value, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className="text-slate-400 p-3 bg-slate-50 rounded-lg">
      <Icon size={24} />
    </div>
  </div>
);

const Team: React.FC = () => {
  const { members, addMember, updateMember, removeMember, resendInvitation } = useTeam();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleSave = (data: Partial<TeamMember>) => {
    if (editingMember) {
      updateMember(editingMember.id, data);
    } else {
      addMember(data);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Colaboradores</h1>
          <p className="text-slate-500 text-sm mt-1">Gerir convites, funções e responsabilidades nas obras.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00609C] hover:bg-[#005082] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
        >
          <UserPlus size={16} />
          <span>Convidar Colaborador</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Colaboradores" value={members.length} icon={Users} />
        <StatCard label="Convites Pendentes" value={members.filter(m => m.status === 'INVITED').length} icon={Clock} />
        <StatCard label="Colaboradores Ativos" value={members.filter(m => m.status === 'ACTIVE').length} icon={UserCheck} />
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2.5 flex items-center shadow-sm">
           <Search size={18} className="text-slate-400 mr-2" />
           <input 
             type="text" 
             placeholder="Pesquisar por nome ou email..."
             className="flex-1 bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <select className="bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-600 outline-none shadow-sm min-w-[180px]">
          <option value="ALL">Todas as funções</option>
          <option value="ENGINEER">Engenheiros</option>
          <option value="FOREMAN">Encarregados</option>
        </select>
      </div>

      {/* List */}
      <TeamList 
        members={filteredMembers} 
        onEdit={handleEdit} 
        onRemove={removeMember}
        onResendInvite={resendInvitation}
      />

      {/* Modal */}
      <TeamMemberForm 
        isOpen={isModalOpen} 
        onClose={handleClose} 
        onSave={handleSave}
        initialData={editingMember}
      />
    </div>
  );
};

export default Team;
