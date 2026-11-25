import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ContextoToast } from './ContextoToast.js';
import { ToastCarrinho } from './Toast.jsx';
import estilos from './Toast.module.css';

// Provedor global de toasts com fechamento automático em 5 s, pausa no hover/foco e fechamento ao mudar de rota.
export function ProvedorToast({ children }) {
  const localizacao = useLocation();
  const rotaAtual = `${localizacao.pathname}${localizacao.search}`;
  const [rotaAnterior, setRotaAnterior] = useState(rotaAtual);
  const [toastAtual, setToastAtual] = useState(null);
  const [pausado, setPausado] = useState(false);

  if (rotaAnterior !== rotaAtual) {
    setRotaAnterior(rotaAtual);
    if (toastAtual) setToastAtual(null);
    if (pausado) setPausado(false);
  }

  const fecharToast = useCallback(() => {
    setToastAtual(null);
    setPausado(false);
  }, []);

  const mostrarToast = useCallback((dados) => {
    setPausado(false);
    setToastAtual({ id: Date.now(), ...dados });
  }, []);

  useEffect(() => {
    if (!toastAtual || pausado) return undefined;
    const temporizador = window.setTimeout(() => {
      setToastAtual(null);
      setPausado(false);
    }, 5000);
    return () => window.clearTimeout(temporizador);
  }, [toastAtual, pausado]);

  return (
    <ContextoToast.Provider value={{ mostrarToast, fecharToast }}>
      {children}
      {toastAtual && (
        <div
          className={estilos.containerFixo}
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onFocus={() => setPausado(true)}
          onBlur={() => setPausado(false)}
        >
          <ToastCarrinho {...toastAtual} aoFechar={fecharToast} />
        </div>
      )}
    </ContextoToast.Provider>
  );
}
