import React, { useEffect, useState } from 'react';

interface DependencyStatus {
  name: string;
  loaded: boolean;
  version?: string;
}

const DependencyValidator: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'success' | 'warning' | 'error'>('checking');
  const [dependencies, setDependencies] = useState<DependencyStatus[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function checkDependencies() {
      const deps: DependencyStatus[] = [];
      
      try {
        // React
        const React = await import('react');
        deps.push({ name: 'React', loaded: true, version: React.version });
        
        // React DOM
        const ReactDOM = await import('react-dom');
        deps.push({ name: 'React DOM', loaded: true, version: ReactDOM.version });
        
        // React Router
        try {
          await import('react-router-dom');
          deps.push({ name: 'React Router', loaded: true });
        } catch (e) {
          deps.push({ name: 'React Router', loaded: false });
        }
        
        // Firebase
        try {
          const firebase = await import('firebase/app');
          deps.push({ name: 'Firebase', loaded: true, version: firebase.SDK_VERSION });
        } catch (e) {
          deps.push({ name: 'Firebase', loaded: false });
        }
        
        // Firebase Auth
        try {
          await import('firebase/auth');
          deps.push({ name: 'Firebase Auth', loaded: true });
        } catch (e) {
          deps.push({ name: 'Firebase Auth', loaded: false });
        }
        
        // Firebase Firestore
        try {
          await import('firebase/firestore');
          deps.push({ name: 'Firebase Firestore', loaded: true });
        } catch (e) {
          deps.push({ name: 'Firebase Firestore', loaded: false });
        }
        
        // Firebase Storage
        try {
          await import('firebase/storage');
          deps.push({ name: 'Firebase Storage', loaded: true });
        } catch (e) {
          deps.push({ name: 'Firebase Storage', loaded: false });
        }
        
        // React Firebase Hooks
        try {
          await import('react-firebase-hooks/auth');
          deps.push({ name: 'React Firebase Hooks', loaded: true });
        } catch (e) {
          deps.push({ name: 'React Firebase Hooks', loaded: false });
        }
        
        // React DatePicker
        try {
          await import('react-datepicker');
          deps.push({ name: 'React DatePicker', loaded: true });
        } catch (e) {
          deps.push({ name: 'React DatePicker', loaded: false });
        }
        
        setDependencies(deps);
        
        // Calculate overall status
        const failed = deps.filter(d => !d.loaded);
        if (failed.length === 0) {
          setStatus('success');
        } else if (failed.length <= 2) {
          setStatus('warning');
        } else {
          setStatus('error');
        }
        
      } catch (e) {
        console.error('Error checking dependencies:', e);
        setStatus('error');
      }
    }
    
    checkDependencies();
  }, []);

  if (status === 'checking') {
    return null;
  }
  
  if (status === 'success' && !showDetails) {
    return null;
  }

  const statusColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const missingDeps = dependencies.filter(d => !d.loaded);
  
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg border shadow-lg ${statusColors[status]} max-w-xs`}>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">
          {status === 'success' ? 'All dependencies loaded' : 
           status === 'warning' ? 'Some dependencies missing' : 
           'Critical dependencies missing'}
        </h3>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="ml-2 text-sm hover:underline"
        >
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-3">
          <ul className="text-sm space-y-1">
            {dependencies.map(dep => (
              <li key={dep.name} className="flex items-center">
                <span className={dep.loaded ? 'text-green-600' : 'text-red-600'}>
                  {dep.loaded ? '✓' : '✗'}
                </span>
                <span className="ml-2">{dep.name}</span>
                {dep.version && <span className="ml-1 text-xs opacity-70">v{dep.version}</span>}
              </li>
            ))}
          </ul>
          
          {missingDeps.length > 0 && (
            <div className="mt-3 pt-3 border-t border-current border-opacity-20 text-xs">
              <p>Missing dependencies may cause features to fail.</p>
              <p className="mt-1">Run <code className="bg-white bg-opacity-20 px-1 rounded">npm install</code> to resolve.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DependencyValidator;
