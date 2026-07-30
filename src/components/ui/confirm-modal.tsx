'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border border-[#e3e2e2] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-full shrink-0 ${
            variant === 'danger' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}>
            <AlertTriangle className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-base font-semibold text-[#1b1c1c]">{title}</h3>
            <p className="text-xs text-[#5e5e5b] leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e3e2e2]">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === 'danger' ? 'primary' : 'primary'}
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' : ''}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
