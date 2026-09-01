import { ShieldAlert, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RoleToggle({ className = '' }) {
  const { toggleRole, isAdmin } = useAuth();

  return (
    <button
      onClick={toggleRole}
      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
        isAdmin
          ? 'bg-amber-500/20 text-amber-800 border-amber-400 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700 hover:bg-amber-500 hover:text-white'
          : 'bg-emerald-500/20 text-emerald-900 border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white'
      } ${className}`}
      title="Klik untuk beralih antara Role User & Admin"
    >
      {isAdmin ? (
        <>
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Mode: Pengelola (Admin)</span>
        </>
      ) : (
        <>
          <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Mode: Pendaki (User)</span>
        </>
      )}
    </button>
  );
}
