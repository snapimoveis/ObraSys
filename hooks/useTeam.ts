
import { useState, useEffect } from 'react';
import { TeamMember } from '../types';
import { db } from '../services/firebase';
import { useSession } from '../contexts/SessionContext';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, QuerySnapshot } from 'firebase/firestore';

export const useTeam = () => {
  const { companyId } = useSession();
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (!companyId) return;

    const q = query(collection(db, 'users'), where('companyId', '==', companyId));
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      const teamData: TeamMember[] = [];
      querySnapshot.forEach((doc) => {
        teamData.push({ id: doc.id, ...doc.data() } as TeamMember);
      });
      setMembers(teamData);
    });

    return () => unsubscribe();
  }, [companyId]);

  const addMember = async (data: Partial<TeamMember>) => {
    if (!companyId) return;
    try {
      await addDoc(collection(db, 'users'), {
        ...data,
        companyId,
        status: 'INVITED',
        joinedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error adding member:", e);
    }
  };

  const updateMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      await updateDoc(doc(db, 'users', id), updates);
    } catch (e) {
      console.error("Error updating member:", e);
    }
  };

  const removeMember = async (id: string) => {
    if (confirm('Tem a certeza que deseja remover este membro?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
      } catch (e) {
        console.error("Error removing member:", e);
      }
    }
  };

  /**
   * Fix: Added resendInvitation function to meet the requirements of components/Team.tsx
   */
  const resendInvitation = async (id: string) => {
    try {
      await updateDoc(doc(db, 'users', id), {
        joinedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error resending invitation:", e);
    }
  };

  // Fix: Returned resendInvitation
  return { members, addMember, updateMember, removeMember, resendInvitation };
};
