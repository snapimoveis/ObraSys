import React, { useState } from 'react';
import { Logo } from './Logo';
import { Eye, EyeOff, ArrowLeft, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';

interface RegisterProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onNavigateToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', companyName: '', password: '', confirmPassword: '', terms: false
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.terms) { setError('Aceite os termos para continuar.'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Senhas não coincidem.'); return; }

    setLoading(true);
    setError(null);
    let authUser = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      authUser = userCredential.user;

      const companyRef = doc(collection(db, 'companies'));
      const companyId = companyRef.id;

      await setDoc(companyRef, {
        name: formData.companyName, createdAt: new Date().toISOString(), ownerId: authUser.uid, email: formData.email
      });

      await setDoc(doc(db, 'users', authUser.uid), {
        email: formData.email, name: formData.name, companyId, role: 'admin', createdAt: new Date().toISOString(), status: 'ACTIVE'
      });

      onRegister();
    } catch (err: any) {
      console.error(err);
      if (authUser) await deleteUser(authUser);
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl border border-slate-100">
        <div className="flex justify-center mb-6"><Logo className="h-14 w-auto text-[#00609C]" /></div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#00609C]">Criar Conta Obra Sys</h2>
        </div>

        {error && (
          <div className="p-4 rounded-lg text-sm mb-6 flex items-start gap-3 border bg-red-50 text-red-600 border-red-100">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nome Completo" className="border rounded-lg p-2.5 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" className="border rounded-lg p-2.5 text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <input type="text" placeholder="Nome da Empresa" className="w-full border rounded-lg p-2.5 text-sm" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="password" placeholder="Palavra-passe" className="border rounded-lg p-2.5 text-sm" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            <input type="password" placeholder="Confirmar" className="border rounded-lg p-2.5 text-sm" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-600">
            <input type="checkbox" checked={formData.terms} onChange={e => setFormData({...formData, terms: e.target.checked})} /> Aceito os Termos.
          </label>
          <button type="submit" disabled={loading} className="w-full bg-[#00609C] text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <><span>Criar Empresa</span></>}
          </button>
        </form>
        <button onClick={onNavigateToLogin} className="mt-8 text-sm text-slate-400 w-full flex items-center justify-center gap-2"><ArrowLeft size={16} />Voltar ao Login</button>
      </div>
    </div>
  );
};