import { Component } from 'react';

/**
 * Isola a experiência 3D: se o WebGL falhar (GPU bloqueada, driver antigo,
 * acesso remoto, contexto perdido), o site cai para a versão estática
 * em vez de derrubar a página inteira.
 */
export default class ErrorBoundary3D extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) {
    console.warn('[3D] experiência desativada, usando versão estática:', error?.message);
    this.props.onFail?.(error?.message || 'erro desconhecido');
  }
  render() { return this.state.failed ? null : this.props.children; }
}
