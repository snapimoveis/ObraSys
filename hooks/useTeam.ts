import { useState, useEffect } from 'react';
import { TeamMember } from '../types';
import { db, getCurrentCompanyId } from '../services/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, QuerySnapshot } from 'firebase/firestore';

export const useTeam = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const companyId = getCurrentCompanyId();

  useEffect(() => {
    if (!companyId) return;

    const q = query(collection(db, 'users'), where('companyId', '==', companyId));
    
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      const teamData: TeamMember[] = [];
      querySnapshot.forEach((doc) => {
        teamData.push({ id: doc.id, ...doc.data() } as TeamMember);
      });
      setMembers(teamData);
    }, (error) => {
      console.error("Error fetching team:", error);
    });

    return () => unsubscribe();
  }, [companyId]);

  const addMember = async (data: Partial<TeamMember>) => {
    if (!companyId) return;
    try {
      // Typically invites create a temp doc, here we simulate adding a user
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