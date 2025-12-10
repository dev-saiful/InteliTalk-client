/**
 * Custom toast hook using sonner
 */

'use client';

import { toast } from 'sonner';

export function useToast() {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showInfo = (message: string) => {
    toast.info(message);
  };

  const showWarning = (message: string) => {
    toast.warning(message);
  };

  const showLoading = (message: string) => {
    return toast.loading(message);
  };

  const dismiss = (id?: string | number) => {
    toast.dismiss(id);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
  };
}
