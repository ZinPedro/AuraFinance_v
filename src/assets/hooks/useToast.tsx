import { useState, useCallback } from "react";

type ToastType = "sucesso" | "erro" | "aviso" | "info";

interface Toast {
  id: number;
  mensagem: string;
  tipo: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const mostrarToast = useCallback((mensagem: string, tipo: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensagem, tipo }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removerToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, mostrarToast, removerToast };
}