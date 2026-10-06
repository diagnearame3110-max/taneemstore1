import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error Boundary catch:', error, errorInfo);
  }

  public handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  public handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            minHeight: '450px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
            background: 'var(--bg, #FAF8F4)',
            color: 'var(--text, #1B1420)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--blush-soft, #F5ECE8)',
              color: 'var(--pink-deep, #92400E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginBottom: '16px',
            }}
          >
            ✨
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '10px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            Bienvenue chez Taneem'Store
          </h2>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-soft, #6E6272)', marginBottom: '24px', maxWidth: '460px', lineHeight: 1.5 }}>
            Une légère interruption est survenue lors de l'initialisation. Cliquez ci-dessous pour afficher la boutique.
          </p>

          {this.state.error?.message && (
            <div
              style={{
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                color: '#991B1B',
                background: '#FEE2E2',
                padding: '8px 14px',
                borderRadius: '8px',
                marginBottom: '20px',
                maxWidth: '500px',
                wordBreak: 'break-word',
              }}
            >
              {this.state.error.message}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '12px 28px',
                borderRadius: '100px',
                background: 'var(--pink, #A99084)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(169, 144, 132, 0.3)',
              }}
            >
              Afficher la boutique
            </button>

            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 24px',
                borderRadius: '100px',
                background: 'transparent',
                color: 'var(--text-soft, #6E6272)',
                border: '1px solid var(--line, #E5E7EB)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Réinitialiser le cache & Recharger
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
