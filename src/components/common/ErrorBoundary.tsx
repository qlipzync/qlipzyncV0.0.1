import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in QuickClick application:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('quickclick_user');
      localStorage.removeItem('qlipzync_user');
      localStorage.removeItem('quickclick_twitch_oauth_token');
    } catch {}
    window.location.href = window.location.origin;
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 text-center shadow-2xl space-y-5">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">Anwendungsfehler abgefangen</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                QuickClick hat einen Rendering-Fehler sicher isoliert. Deine Daten sind geschützt.
              </p>
            </div>
            {this.state.error && (
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-left overflow-auto max-h-32 text-[11px] font-mono text-rose-300">
                {this.state.error.toString()}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Neu laden</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Zur Startseite</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
