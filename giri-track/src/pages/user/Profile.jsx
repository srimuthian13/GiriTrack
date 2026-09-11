import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, Mail, Phone, Droplet, Lock, Camera, CheckCircle2, ShieldAlert, ArrowLeft, Trash2 } from 'lucide-react';
import CameraCaptureModal from '../../components/CameraCaptureModal';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAuth();
  const { t } = useLanguage();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const isLoggedIn = currentUser?.isLoggedIn || !!currentUser?.email;

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

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-6 sm:p-8 border border-[#E1E5EA] dark:border-[#2C3440] shadow-xl text-center space-y-5 text-[#2B3542] dark:text-[#FAF3F3]">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">{t('authGate.title') || 'Akses Akun Pribadi Diperlukan'}</h2>
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1.5 leading-relaxed">
              Silakan masuk ke akun GiriTrack Anda untuk melihat dan mengelola data profil, kontak darurat, dan foto akun.
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                localStorage.setItem('giritrack_intended_path', '/profile');
                navigate('/login');
              }}
              className="w-full py-3 rounded-2xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold text-xs shadow-md transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t('authGate.loginBtn') || 'Masuk Akun Sekarang'}</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] font-semibold text-xs transition cursor-pointer"
            >
              {t('authGate.backHome') || 'Kembali ke Beranda'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const compressAndSaveAvatar = (dataUrl) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 300;
      const MAX_HEIGHT = 300;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
      setFormData(prev => ({ ...prev, avatar: compressedBase64 }));
      
      // Auto-save to context/localStorage
      try {
        updateUserProfile({ avatar: compressedBase64 });
        setMessage('Foto profil berhasil diperbarui & disimpan otomatis!');
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError('Gagal menyimpan foto: ' + err.message);
      }
    };
    img.src = dataUrl;
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit before compression
        setError('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        compressAndSaveAvatar(reader.result);
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 pb-16 text-[#2B3542] dark:text-[#FAF3F3]">
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F] transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('btn.back') || 'Kembali'}</span>
        </button>
      </div>

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
              
              {/* Camera Trigger */}
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="absolute bottom-0 right-0 p-2.5 bg-[#DA7F8F] hover:bg-[#c96c7d] text-white rounded-full shadow-lg cursor-pointer transition-colors z-10 group-hover:scale-110"
                title="Buka Kamera Langsung"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 cursor-pointer transition">
                <Camera className="w-3.5 h-3.5" />
                <span>Edit Gambar</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, avatar: '' }));
                  updateUserProfile({ avatar: '' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-500/20 cursor-pointer transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
            <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7] mt-1.5">Foto akan dikompresi dan disimpan secara otomatis</p>
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
              className="px-8 py-3.5 bg-[#452829] hover:bg-[#3A231C] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm cursor-pointer"
            >
              Simpan Perubahan Profil
            </button>
          </div>

        </form>
      </div>

      {/* Live Camera Modal for Avatar */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64) => {
          compressAndSaveAvatar(base64);
        }}
      />
    </div>
  );
}
