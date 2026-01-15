import { useState } from 'react';
import { TeamMember, Role } from '../types';

export const useTeam = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Carlos Mendes',
      email: 'carlos.mendes@obrasys.pt',
      role: 'ADMIN',
      status: 'ACTIVE',
      assignedWorks: ['WORK-123'],
      joinedAt: '2023-01-15',
      lastActive: 'Há 5 minutos',
      phone: '+351 912 345 678'
    },
    {
      id: '2',
      name: 'Ana Silva',
      email: 'ana.silva@obrasys.pt',
      role: 'ENGINEER',
      status: 'ACTIVE',
      assignedWorks: ['WORK-123'],
      joinedAt: '2023-02-10',
      lastActive: 'Há 2 horas',
      phone: '+351 934 567 890'
    },
    {
      id: '3',
      name: 'João Ferreira',
      email: 'joao.ferreira@sub.pt',
      role: 'SUBCONTRACTOR',
      status: 'ACTIVE',
      assignedWorks: ['WORK-123'],
      joinedAt: '2023-03-05',
      lastActive: 'Ontem',
      phone: '+351 961 234 567'
    },
    {
      id: '4',
      name: 'Pedro Santos',
      email: 'pedro.santos@obrasys.pt',
      role: 'FOREMAN',
      status: 'INVITED',
      assignedWorks: [],
      joinedAt: '2023-11-20'
    }
  ]);

  const addMember = (data: Partial<TeamMember>) => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: data.name || '',
      email: data.email || '',
      role: data.role || 'WORKER',
      status: 'INVITED',
      assignedWorks: data.assignedWorks || [],
      joinedAt: new Date().toISOString(),
      phone: data.phone
    };
    setMembers([newMember, ...members]);
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMember = (id: string) => {
    // Soft delete usually, but for demo remove from list
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const resendInvitation = (id: string) => {
    console.log(`Resending invite to ${id}`);
    alert("Convite reenviado com sucesso!");
  };

  return {
    members,
    addMember,
    updateMember,
    removeMember,
    resendInvitation
  };
};
