import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} color="#10b981" />,
  error:   <AlertCircle size={18} color="#ef4444" />,
  warning: <AlertTriangle size={18} color="#f59e0b" />,
  info:    <Info size={18} color="#3b82f6" />,
};

export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type} ${t.removing ? 'removing' : ''}`}>
          {icons[t.type]}
          <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--gray-800)' }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
