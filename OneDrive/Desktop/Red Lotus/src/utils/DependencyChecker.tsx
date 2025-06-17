import React, { useEffect, useState } from 'react';

// List of dependencies to check
const requiredDependencies = [
  { name: 'Firebase Core', check: () => import('firebase/app').then(() => true).catch(() => false) },
  { name: 'Firebase Firestore', check: () => import('firebase/firestore').then(() => true).catch(() => false) },
  { name: 'Firebase Storage', check: () => import('firebase/storage').then(() => true).catch(() => false) },
  { name: 'Firebase Auth', check: () => import('firebase/auth').then(() => true).catch(() => false) },
  { name: 'React Router', check: () => import('react-router-dom').then(() => true).catch(() => false) },
  { name: 'React Firebase Hooks', check: () => import('react-firebase-hooks/auth').then(() => true).catch(() => false) },
  { name: 'React DatePicker', check: () => import('react-datepicker').then(() => true).catch(() => false) },
];

interface DependencyStatus {
  name: string;
  loaded: boolean;
}

const DependencyChecker: React.FC = () => {
  const [dependencies, setDependencies] = useState<DependencyStatus[]>([]);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkDependencies = async () => {
      const results = await Promise.all(
        requiredDependencies.map(async (dep) => {
          const loaded = await dep.check();
          return { name: dep.name, loaded };
        })
      );
      
      setDependencies(results);
      setChecking(false);
    };
    
    checkDependencies();
  }, []);

  if (checking) {
    return <div>Checking dependencies...</div>;
  }

  const missingDependencies = dependencies.filter(dep => !dep.loaded);
  
  if (missingDependencies.length > 0) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="font-bold text-xl mb-2">Missing Dependencies</h2>
        <ul className="list-disc pl-5">
          {missingDependencies.map(dep => (
            <li key={dep.name}>{dep.name}</li>
          ))}
        </ul>
        <p className="mt-3">
          Please install the missing dependencies using:
          <code className="block p-2 mt-2 bg-gray-800 text-white rounded">
            npm install firebase react-router-dom react-firebase-hooks react-datepicker
          </code>
        </p>
      </div>
    );
  }

  return null; // Don't render anything if all dependencies are loaded
};

export default DependencyChecker;
