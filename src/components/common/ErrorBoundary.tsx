import React from 'react';

interface State { hasError: boolean; }

class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  componentDidCatch(err: unknown) {
    
    console.error('💥 Uncaught error:', err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="mb-3 text-3xl font-bold">Something went wrong.</h1>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
