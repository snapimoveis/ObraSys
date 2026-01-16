import React, { useState } from 'react';
import { Logo } from './Logo';
import { Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, Mail, Loader2, Database } from 'lucide-react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

interface LoginProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string, form?: string, isConfigError?: boolean }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrors({ form: 'Preencha todos os campos.' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // O App.tsx vai redirecionar automaticamente através do useSession()
      onLogin(); 
    } catch (error: any) {
      console.error("Login Error:", error);
      let msg = 'Erro ao entrar. Verifique os dados.';
      if (error.code === 'auth/invalid-credential') msg = 'Email ou palavra-passe incorretos.';
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-[450px] border border-slate-100">
        <div className="flex justify-center mb-6"><Logo className="h-14 w-auto text-[#00609C]" /></div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#00609C]">Entrar no Obra Sys</h2>
          <p className="text-slate-500 text-sm mt-2">Aceda à gestão inteligente das suas obras</p>
        </div>

        {errors.form && (
          <div className="p-4 rounded-lg text-sm mb-6 flex items-start gap-3 border bg-red-50 text-red-600 border-red-100">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p>{errors.form}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="exemplo@obra.pt" 
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 pl-10 outline-none focus:border-blue-600 text-sm shadow-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Palavra-passe</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••" 
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-600 text-sm shadow-sm" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#00609C] hover:bg-[#004e80] text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <><span>Entrar no Sistema</span><ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">Ainda não tem conta? <button onClick={onNavigateToRegister} className="text-[#00609C] font-bold hover:underline">Criar conta gratuita</button></p>
        </div>
      </div>
    </div>
  );
};