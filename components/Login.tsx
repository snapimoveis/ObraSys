import React, { useState } from 'react';
import { Logo } from './Logo';
import { Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Introduza um endereço de e-mail válido.';
    }
    
    if (!formData.password) {
      newErrors.password = 'A palavra-passe é obrigatória.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onLogin();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-[450px] border border-slate-100">
        <div className="flex justify-center mb-6">
          <Logo className="h-14 w-auto text-[#00609C]" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#00609C]">Entrar na sua conta</h2>
          <p className="text-slate-500 text-sm mt-2">Aceda à sua conta para gerir as suas obras</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </span>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
                className={`w-full bg-white text-gray-900 border rounded-md p-3 pl-10 outline-none transition-all text-sm placeholder-gray-400 shadow-sm ${
                  errors.email 
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Palavra-passe</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="........"
                className={`w-full bg-white text-gray-900 border rounded-md p-3 pl-10 pr-10 outline-none transition-all text-sm placeholder-gray-400 shadow-sm ${
                  errors.password
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                }`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.password}
              </p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-[#00609C] hover:bg-[#004e80] text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm mt-6"
          >
            <span>Entrar</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <button className="text-sm text-[#00609C] hover:underline block w-full">
            Esqueceu a palavra-passe?
          </button>
          
          <p className="text-sm text-slate-500">
            Ainda não tem conta?{' '}
            <button onClick={onNavigateToRegister} className="text-[#00609C] font-medium hover:underline">
              Criar conta
            </button>
          </p>

          <button className="text-sm text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 w-full mt-6 transition-colors">
            <ArrowLeft size={16} />
            <span>Voltar ao início</span>
          </button>
        </div>
      </div>
    </div>
  );
};