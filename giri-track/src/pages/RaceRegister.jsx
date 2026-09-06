import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { RaceContext } from '../context/RaceContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, Info, ArrowLeft, CheckCircle2 } from 'lucide-react';
import RacePaymentModal from '../components/RacePaymentModal';

export default function RaceRegister() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const { getRaceById, registerForRace } = useContext(RaceContext);
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const race = getRaceById(id);
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    nik: '',
    phone: '',
    gender: '',
    bloodType: '',
    jerseySize: 'M',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    agreedToTerms: false
  });
  const [gearChecked, setGearChecked] = useState({});
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (!race) {
      navigate('/races');
    }
  }, [race, navigate]);

  if (!race) return null;

  const category = race.categories.find(c => c.id === selectedCategory);

  const handleGearCheck = (item) => {
    setGearChecked(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const requiredGear = race.mandatoryGear.filter(item => item.required !== false);
  const allGearChecked = requiredGear.every(item => gearChecked[item.name]);
  
  const isFormValid = 
    selectedCategory && 
    formData.name && 
    formData.email && 
    formData.nik &&
    formData.phone && 
    formData.gender && 
    formData.bloodType && 
    formData.jerseySize &&
    formData.emergencyContactName && 
    formData.emergencyContactPhone && 
    formData.emergencyContactRelation && 
    formData.agreedToTerms && 
    allGearChecked;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setShowPayment(true);
    }
  };

  const handlePaymentConfirm = () => {
    setShowPayment(false);
    const regId = registerForRace(race.id, selectedCategory, formData);
    navigate(`/races/ticket/${regId}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button 
        onClick={() => navigate('/races')}
        className="flex items-center gap-2 text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#2B3542] dark:hover:text-white transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('registration.backToCatalog')}
      </button>

      <div className="bg-white dark:bg-[#1C2129] rounded-3xl shadow-md border border-[#E1E5EA] dark:border-[#2C3440] overflow-hidden">
        <div className="bg-[#452829] p-6 sm:p-8 text-white">
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{race.title}</h1>
          <p className="text-white/80 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {t('registration.pageTitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* Category Selection */}
          <section>
            <h2 className="text-lg font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-4">{t('registration.selectCategory')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {race.categories.map(cat => {
                const isSoldOut = cat.slotsTaken >= cat.quota;
                return (
                  <label 
                    key={cat.id} 
                    className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedCategory === cat.id ? 'border-[#452829] bg-[#FAF3F3] dark:bg-[#3A231C]/20' : 'border-[#E1E5EA] dark:border-[#2C3440] hover:border-[#6B7C8C]'} ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="category" 
                      value={cat.id} 
                      disabled={isSoldOut}
                      checked={selectedCategory === cat.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-[#2B3542] dark:text-[#FAF3F3]">{cat.name}</span>
                      {selectedCategory === cat.id && <CheckCircle2 className="w-5 h-5 text-[#452829] dark:text-[#DA7F8F]" />}
                    </div>
                    <div className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] space-y-1">
                      <p>Jarak: {cat.distance}</p>
                      <p>Elevasi: {cat.elevationGain}</p>
                      <p>COT: {cat.cot}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#E1E5EA] dark:border-[#2C3440] flex justify-between items-center">
                      <span className="font-black text-[#452829] dark:text-[#DA7F8F]">Rp {cat.price.toLocaleString('id-ID')}</span>
                      <span className="text-[10px] font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
                        {isSoldOut ? t('registration.soldOut') : `${t('registration.remainingSlot')} ${cat.quota - cat.slotsTaken} ${t('registration.slotUnit')}`}
                      </span>
                    </div>
                  </label>
                )
              })}
            </div>
          </section>

          {/* Personal Info */}
          <section>
            <h2 className="text-lg font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-4">{t('registration.personalData')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">{t('registration.fullName')}</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">{t('registration.nik')}</label>
                <input 
                  type="text" 
                  value={formData.nik}
                  onChange={e => setFormData({...formData, nik: e.target.value})}
                  placeholder={t('registration.nikPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">{t('registration.jerseySize')}</label>
                <select 
                  value={formData.jerseySize}
                  onChange={e => setFormData({...formData, jerseySize: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                  required
                >
                  <option value="S" className="text-gray-900">S (Small)</option>
                  <option value="M" className="text-gray-900">M (Medium)</option>
                  <option value="L" className="text-gray-900">L (Large)</option>
                  <option value="XL" className="text-gray-900">XL (Extra Large)</option>
                  <option value="XXL" className="text-gray-900">XXL (Double Extra Large)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">{t('registration.email')}</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">{t('registration.phone')}</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">{t('registration.gender')}</label>
                  <select 
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                    required
                  >
                    <option value="" disabled className="text-gray-900">{t('registration.genderPlaceholder')}</option>
                    <option value="L" className="text-gray-900">{t('registration.male')}</option>
                    <option value="P" className="text-gray-900">{t('registration.female')}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">{t('registration.bloodType')}</label>
                  <select 
                    value={formData.bloodType}
                    onChange={e => setFormData({...formData, bloodType: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                    required
                  >
                    <option value="" disabled className="text-gray-900">{t('registration.bloodTypePlaceholder')}</option>
                    <option value="A" className="text-gray-900">A</option>
                    <option value="B" className="text-gray-900">B</option>
                    <option value="AB" className="text-gray-900">AB</option>
                    <option value="O" className="text-gray-900">O</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section>
            <h2 className="text-lg font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-4">{t('registration.emergencyContact')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">{t('registration.emergencyName')}</label>
                <input 
                  type="text" 
                  value={formData.emergencyContactName}
                  onChange={e => setFormData({...formData, emergencyContactName: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">{t('registration.emergencyPhone')}</label>
                <input 
                  type="tel" 
                  value={formData.emergencyContactPhone}
                  onChange={e => setFormData({...formData, emergencyContactPhone: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7]">{t('registration.emergencyRelation')}</label>
                <input 
                  type="text" 
                  value={formData.emergencyContactRelation}
                  onChange={e => setFormData({...formData, emergencyContactRelation: e.target.value})}
                  placeholder={t('registration.emergencyRelationPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-transparent focus:outline-none focus:border-[#452829] dark:focus:border-[#DA7F8F] text-[#2B3542] dark:text-white"
                  required
                />
              </div>
            </div>
          </section>

          {/* Mandatory Gear */}
          <section>
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-400 text-sm mb-1">{t('registration.mandatoryGearTitle')}</h3>
                <p className="text-xs text-amber-800 dark:text-amber-500/80 leading-relaxed">
                  {t('registration.mandatoryGearDesc')}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {race.mandatoryGear.map((item, idx) => (
                <label key={idx} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  item.required === false
                    ? 'border-dashed border-[#E1E5EA] dark:border-[#2C3440] opacity-70'
                    : 'border-[#E1E5EA] dark:border-[#2C3440] hover:bg-gray-50 dark:hover:bg-white/5'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={gearChecked[item.name] || false}
                    onChange={() => handleGearCheck(item.name)}
                    className="w-4 h-4 rounded border-gray-300 text-[#452829] focus:ring-[#452829]"
                  />
                  <span className="text-sm font-medium text-[#2B3542] dark:text-[#FAF3F3]">
                    {item.name}
                    {item.required === false && <span className="ml-1 text-[10px] text-gray-400">{t('registration.optional')}</span>}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Terms */}
          <section className="pt-6 border-t border-[#E1E5EA] dark:border-[#2C3440]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.agreedToTerms}
                onChange={e => setFormData({...formData, agreedToTerms: e.target.checked})}
                className="w-5 h-5 rounded border-gray-300 text-[#452829] focus:ring-[#452829] mt-0.5"
              />
              <span className="text-sm text-[#6B7C8C] dark:text-[#A7BBC7] leading-relaxed">
                {t('registration.agreementText')}
              </span>
            </label>
          </section>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-all ${isFormValid ? 'bg-[#452829] hover:bg-[#3A231C] text-white active:scale-[0.98]' : 'bg-gray-200 dark:bg-[#2C3440] text-gray-400 cursor-not-allowed'}`}
            >
              {category ? `${t('registration.payBtn')} (Rp ${category.price.toLocaleString('id-ID')})` : t('registration.completeForm')}
            </button>
          </div>

        </form>
      </div>

      <RacePaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)}
        onConfirm={handlePaymentConfirm}
        amount={category?.price || 0}
      />
    </div>
  );
}
