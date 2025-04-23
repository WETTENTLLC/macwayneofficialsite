import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Critical dependencies for our features
const criticalDependencies = [
  'react',
  'react-dom',
  'react-router-dom',
  'firebase',
  'react-firebase-hooks',
  'react-datepicker',
  'tailwindcss'
];

console.log('🔍 Checking Red Lotus dependencies...\n');

// Check if package.json exists
const packageJsonPath = path.join(rootDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found! Please create one first.');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

// Check for critical dependencies
console.log('📋 Checking critical dependencies:');
let missingDeps = [];

criticalDependencies.forEach(dep => {
  if (dependencies[dep]) {
    console.log(`✅ ${dep}: ${dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep}: MISSING`);
    missingDeps.push(dep);
  }
});

// Check for outdated packages
console.log('\n📦 Checking for outdated packages...');
try {
  const outdated = execSync('npm outdated --json', { cwd: rootDir, stdio: ['pipe', 'pipe', 'pipe'] });
  const outdatedJson = JSON.parse(outdated.toString());
  
  if (Object.keys(outdatedJson).length > 0) {
    console.log('\n⚠️ Outdated packages:');
    Object.entries(outdatedJson).forEach(([pkg, info]) => {
      console.log(`  ${pkg}: ${info.current} → ${info.latest}`);
    });
    console.log('\nRun "npm update" to update to compatible versions, or "npm install [package]@latest" for specific packages.');
  } else {
    console.log('✅ All packages are up to date!');
  }
} catch (error) {
  if (error.stdout) {
    try {
      const outdatedJson = JSON.parse(error.stdout.toString());
      console.log('\n⚠️ Outdated packages:');
      Object.entries(outdatedJson).forEach(([pkg, info]) => {
        console.log(`  ${pkg}: ${info.current} → ${info.latest}`);
      });
    } catch {
      console.log('⚠️ Failed to parse outdated packages.');
    }
  } else {
    console.log('⚠️ Could not check for outdated packages. Make sure npm is installed.');
  }
}

// Check for compatibility issues
console.log('\n🔄 Checking for compatibility issues...');

// React and React DOM should be the same version
if (dependencies.react && dependencies['react-dom']) {
  const reactVersion = dependencies.react.replace(/[\^~]/g, '');
  const reactDomVersion = dependencies['react-dom'].replace(/[\^~]/g, '');
  
  if (reactVersion !== reactDomVersion) {
    console.log(`⚠️ React (${reactVersion}) and React DOM (${reactDomVersion}) versions should match.`);
  } else {
    console.log('✅ React and React DOM versions match.');
  }
}

// Check TypeScript vs @types versions
if (dependencies.typescript && dependencies['@types/react']) {
  console.log('✅ TypeScript and React type definitions are present.');
} else if (dependencies.typescript && !dependencies['@types/react']) {
  console.log('⚠️ TypeScript is installed but @types/react is missing.');
}

// If missing dependencies, provide install command
if (missingDeps.length > 0) {
  console.log(`\n❌ Missing ${missingDeps.length} critical dependencies. Install with:`);
  console.log(`\nnpm install ${missingDeps.join(' ')}\n`);
} else {
  console.log('\n✅ All critical dependencies are installed!');
}

// Print final status
console.log('\n✨ Dependency check completed.');
