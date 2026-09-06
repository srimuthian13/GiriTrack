import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Droplet, Lock, Camera, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Profile() {
  const { currentUser, updateUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    bloodType: currentUser?.bloodType || '',
    avatar: currentUser?.avatar || '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('Ukuran file terlalu besar. Maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    try {
      const updatePayload = {
        name: formData.name,
        phone: formData.phone,
        bloodType: formData.bloodType,
        avatar: formData.avatar,
      };
      if (formData.newPassword) {
        updatePayload.password = formData.newPassword;
      }

      updateUserProfile(updatePayload);
      setMessage('Profil berhasil diperbarui!');
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' })); // Reset passwords
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan profil.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3] mb-2 flex items-center gap-3">
          <User className="w-8 h-8 text-[#DA7F8F]" />
          Pengaturan Profil
        </h1>
        <p className="text-[#6B7C8C] dark:text-[#A7BBC7] text-sm">
          Kelola informasi data diri, kontak, dan pengaturan akun Anda.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1C2129] rounded-3xl shadow-sm border border-[#E1E5EA] dark:border-[#2C3440] overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-rose-800 dark:text-rose-400">{error}</p>
            </div>
          )}

          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-[#E1E5EA] dark:border-[#2C3440]">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#FAF3F3] dark:border-[#2C3440] shadow-md bg-gray-100 dark:bg-gray-800">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2.5 bg-[#DA7F8F] hover:bg-[#c96c7d] text-white rounded-full shadow-lg cursor-pointer transition-colors z-10 group-hover:scale-110">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-3">Upload foto (Maks. 2MB)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Info Dasar */}
            <div className="space-y-6">
              <h3 className="font-bold text-[#2B3542] dark:text-[#FAF3F3] border-b border-[#E1E5EA] dark:border-[#2C3440] pb-2">Informasi Dasar</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Nama Lengkap
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Alamat Email
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-gray-100 dark:bg-white/5 text-gray-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">Email terikat pada akun dan tidak dapat diubah.</p>
              </div>
            </div>

            {/* Kontak & Fisik */}
            <div className="space-y-6">
              <h3 className="font-bold text-[#2B3542] dark:text-[#FAF3F3] border-b border-[#E1E5EA] dark:border-[#2C3440] pb-2">Data Tambahan</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Nomor WhatsApp
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5" /> Golongan Darah
                </label>
                <select 
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                >
                  <option value="" disabled className="text-gray-900">Pilih Golongan Darah</option>
                  <option value="A" className="text-gray-900">A</option>
                  <option value="B" className="text-gray-900">B</option>
                  <option value="AB" className="text-gray-900">AB</option>
                  <option value="O" className="text-gray-900">O</option>
                </select>
              </div>
            </div>
          </div>

          {/* Keamanan */}
          <div className="mb-8 p-5 rounded-2xl bg-gray-50 dark:bg-[#14171C] border border-[#E1E5EA] dark:border-[#2C3440]">
            <h3 className="font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#DA7F8F]" />
              Ganti Kata Sandi (Opsional)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">Kata Sandi Baru</label>
                <input 
                  type="password" 
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Kosongkan jika tidak diubah"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">Konfirmasi Kata Sandi Baru</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ketik ulang kata sandi baru"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-white dark:bg-[#1C2129] focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-[#E1E5EA] dark:border-[#2C3440]">
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#452829] hover:bg-[#3A231C] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm"
            >
              Simpan Perubahan Profil
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
