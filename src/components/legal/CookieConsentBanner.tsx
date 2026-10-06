import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check } from 'lucide-react';

interface CookieConsentBannerProps {
  forceOpen?: boolean;
  onOpenPrivacy?: () => void;
  onClose?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  forceOpen,
  onOpenPrivacy,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setIsVisible(true);
      return;
    }
    const consent = localStorage.getItem('quickclick_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, [forceOpen]);

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    localStorage.setItem('quickclick_cookie_consent', 'all');
    setIsVisible(false);
    onClose?.();
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('quickclick_cookie_consent', 'essential');
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-xl mx-auto rounded-2xl border border-purple-500/40 bg-[#0c0822]/95 backdrop-blur-md p-4 shadow-2xl text-zinc-100 space-y-3">
      <div className="flex items-center gap-2">
        <Cookie className="h-5 w-5 text-amber-400" />
        <span className="text-xs font-bold text-white">Cookie- & Datenschutzeinstellungen</span>
      </div>
      <p className="text-[11px] text-zinc-400 leading-relaxed">
        Wir nutzen ausschließlich technisch notwendige Cookies und lokale Sitzungsdaten für OAuth-Authentifizierung und System-Telemetrie.
      </p>
      <div className="flex items-center justify-end gap-2 pt-1">
        {onOpenPrivacy && (
          <button type="button" onClick={onOpenPrivacy} className="text-[11px] text-zinc-400 hover:text-white mr-auto underline">
            Details
          </button>
        )}
        <button
          type="button"
          onClick={handleAcceptEssential}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold transition cursor-pointer"
        >
          Nur Essenziell
        </button>
        <button
          type="button"
          onClick={handleAcceptAll}
          className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
        >
          Alle Akzeptieren
        </button>
      </div>
    </div>
  );
};
