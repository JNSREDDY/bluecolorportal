import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('WorkForce Connect Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center text-3xl font-bold border border-rose-500/30">
                        !
                    </div>
                    <h1 className="text-2xl font-bold">Something went wrong</h1>
                    <p className="text-sm text-slate-400 max-w-md">
                        {this.state.error?.message || 'An unexpected error occurred while rendering this page.'}
                    </p>
                    <div className="flex space-x-3 pt-2">
                        <button
                            onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
                            className="px-4 py-2 bg-amber-500 text-slate-900 font-bold rounded-xl text-sm hover:bg-amber-600 transition-all"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-slate-800 text-slate-200 font-semibold rounded-xl text-sm hover:bg-slate-700 transition-all"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
