import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

/**
 * CustomAlert Component
 * Custom alert modal yang sesuai dengan desain website
 */
export default function CustomAlert({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', // 'info', 'success', 'warning', 'error'
  showCancel = false,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: 'mdi:check-circle', color: 'text-green-400', bgColor: 'bg-green-500/10' };
      case 'warning':
        return { icon: 'mdi:alert-circle', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' };
      case 'error':
        return { icon: 'mdi:close-circle', color: 'text-red-400', bgColor: 'bg-red-500/10' };
      default:
        return { icon: 'mdi:information', color: 'text-blue-400', bgColor: 'bg-blue-500/10' };
    }
  };

  const { icon, color, bgColor } = getIconAndColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-auto">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F45D16] to-[#0058BC] rounded-2xl blur opacity-20"></div>
        <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-6 border border-white/10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
              <Icon icon={icon} className={`w-6 h-6 ${color}`} />
            </div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
          </div>
          
          {/* Message */}
          <div className="mb-6">
            <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
          
          {/* Actions */}
          <div className={`flex gap-3 ${showCancel ? 'justify-end' : 'justify-center'}`}>
            {showCancel && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className="px-6 py-2 bg-gradient-to-r from-[#F45D16] to-[#FF6B35] hover:from-[#d74e0f] hover:to-[#F45D16] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
