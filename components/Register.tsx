import React, { useState } from 'react';
import { Logo } from './Logo';
import { Eye, EyeOff, ArrowLeft, UserPlus, AlertCircle } from 'lucide-react';

interface RegisterProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onNavigateToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    clientType: 'Empresa',
    nif: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
    
    if (!formData.email) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de e-mail inválido.';
    }

    if (!formData.phone) newErrors.phone = 'O telefone é obrigatório.';
    if (!formData.companyName) newErrors.companyName = 'O nome da empresa é obrigatório.';

    if (!formData.password) {
      newErrors.password = 'A palavra-passe é obrigatória.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'A palavra-passe deve ter no mínimo 8 caracteres.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'A confirmação da palavra-passe é obrigatória.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As palavras-passe não coincidem.';
    }

    if (!formData.terms) {
      newErrors.terms = 'Deve aceitar os Termos de Serviço e a Política de Privacidade.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onRegister();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans py-10">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl border border-slate-100">
        <div className="flex justify-center mb-6">
          <Logo className="h-14 w-auto text-[#00609C]" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#00609C]">Criar Conta</h2>
          <p className="text-slate-500 text-sm mt-2">Registe-se para começar a gerir as suas obras</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome e Apelido *</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="João Silva"
                className={`w-full border rounded-md p-2.5 outline-none transition-all text-sm ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-[#00609C] focus:border-transparent'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="snapimoveis@gmail.com"
                className={`w-full border rounded-md p-2.5 outline-none transition-all text-sm ${
                  errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-[#00609C] focus:border-transparent bg-blue-50/50'
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone *</label>
              <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+351 912 345 678"
                className={`w-full border rounded-md p-2.5 outline-none transition-all text-sm ${
                  errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-[#00609C] focus:border-transparent'
                }`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa *</label>
              <input 
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Construções Silva, Lda."
                className={`w-full border rounded-md p-2.5 outline-none transition-all text-sm ${
                  errors.companyName ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-[#00609C] focus:border-transparent'
                }`}
              />
              {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Cliente *</label>
            <select 
              name="clientType"
              value={formData.clientType}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-[#00609C] focus:border-transparent transition-all text-sm bg-white text-slate-700"
            >
              <option value="Empresa">Empresa</option>
              <option value="Particular">Particular</option>
              <option value="Subempreiteiro">Subempreiteiro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">NIF (opcional)</label>
            <input 
              type="text"
              name="nif"
              value={formData.nif}
              onChange={handleChange}
              placeholder="123456789"
              className="w-full border border-slate-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-[#00609C] focus:border-transparent transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Palavra-passe *</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="........"
                  className={`w-full border rounded-md p-2.5 pr-10 outline-none transition-all text-sm bg-blue-50/50 ${
                    errors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-[#00609C] focus:border-transparent'
                  }`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Palavra-passe *</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirme a senha"
                  className={`w-full border rounded-md p-2.5 pr-10 outline-none transition-all text-sm ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-[#00609C] focus:border-transparent'
                  }`}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-start gap-3 mt-4">
              <input 
                type="checkbox" 
                name="terms"
                id="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-[#00609C] border-slate-300 rounded focus:ring-[#00609C]"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                Aceito os <a href="#" className="text-[#00609C] hover:underline">Termos de Serviço</a> e a <a href="#" className="text-[#00609C] hover:underline">Política de Privacidade</a>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-red-500 mt-1 ml-7">{errors.terms}</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-[#00609C] hover:bg-[#004e80] text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm mt-6"
          >
            <UserPlus size={18} />
            <span>Criar Conta</span>
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-slate-500">
            Já tem uma conta?{' '}
            <button onClick={onNavigateToLogin} className="text-[#00609C] font-medium hover:underline">
              Entrar
            </button>
          </p>

          <button className="text-sm text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 w-full mt-2 transition-colors">
            <ArrowLeft size={16} />
            <span>Voltar ao início</span>
          </button>
        </div>
      </div>
    </div>
  );
};