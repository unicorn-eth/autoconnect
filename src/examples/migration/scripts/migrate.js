#!/usr/bin/env node
// Migration script to help developers migrate from manual files to NPM package

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(text) {
  console.log('\n' + '='.repeat(60));
  log('magenta', text);
  console.log('='.repeat(60) + '\n');
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log('red', `❌ Found: ${description}`);
    log('yellow', `   Path: ${filePath}`);
    return true;
  }
  return false;
}

async function main() {
  header('🦄 Unicorn AutoConnect Migration Helper');

  log('blue', 'This script helps you migrate from manual file copying to the NPM package.\n');

  // Check for old files
  const filesToCheck = [
    { path: 'src/components/UnicornAutoConnect.jsx', desc: 'Manual UnicornAutoConnect component' },
    { path: 'src/hooks/useUniversalWallet.js', desc: 'Manual useUniversalWallet hook' },
    { path: 'src/utils/environment.js', desc: 'Manual environment utilities' },
  ];

  let foundOldFiles = false;
  
  log('blue', 'Step 1: Checking for old manual files...\n');
  
  for (const file of filesToCheck) {
    const fullPath = path.join(process.cwd(), file.path);
    if (checkFile(fullPath, file.desc)) {
      foundOldFiles = true;
    }
  }

  if (!foundOldFiles) {
    log('green', '✅ No old files found - you may have already migrated!\n');
  } else {
    console.log();
    log('yellow', '⚠️  Found manual files that should be removed after migration.\n');
  }

  // Check for package installation
  log('blue', 'Step 2: Checking for @unicorn.eth/autoconnect package...\n');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (deps['@unicorn.eth/autoconnect']) {
      log('green', `✅ Package installed: @unicorn.eth/autoconnect@${deps['@unicorn.eth/autoconnect']}\n`);
    } else {
      log('red', '❌ Package not installed\n');
      log('yellow', 'Run: npm install @unicorn.eth/autoconnect\n');
    }
  }

  // Check imports in files
  log('blue', 'Step 3: Checking for old imports in your code...\n');
  
  const filesToScan = [
    'src/App.jsx',
    'src/App.tsx',
    'src/main.jsx',
    'src/main.tsx',
  ];

  let foundOldImports = false;
  
  for (const file of filesToScan) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const oldImports = [
        "from './components/UnicornAutoConnect'",
        "from './hooks/useUniversalWallet'",
        "from './utils/environment'",
      ];
      
      for (const oldImport of oldImports) {
        if (content.includes(oldImport)) {
          log('red', `❌ Found old import in ${file}:`);
          log('yellow', `   ${oldImport}`);
          foundOldImports = true;
        }
      }
    }
  }

  if (!foundOldImports) {
    log('green', '✅ No old imports found!\n');
  } else {
    console.log();
    log('yellow', '⚠️  Replace old imports with:');
    log('green', "   import { UnicornAutoConnect, useUniversalWallet } from '@unicorn.eth/autoconnect';\n");
  }

  // Migration checklist
  header('📋 Migration Checklist');
  
  const steps = [
    { done: !foundOldImports, text: 'Update imports to use @unicorn.eth/autoconnect' },
    { done: !foundOldFiles, text: 'Remove old manual files' },
    { done: true, text: 'Test your app works correctly' },
    { done: true, text: 'Commit changes to version control' },
  ];

  for (const step of steps) {
    const icon = step.done ? '✅' : '⬜';
    const color = step.done ? 'green' : 'yellow';
    log(color, `${icon} ${step.text}`);
  }

  console.log();

  // Final instructions
  header('🚀 Next Steps');
  
  if (foundOldFiles || foundOldImports) {
    log('yellow', '1. Install the package:');
    log('blue', '   npm install @unicorn.eth/autoconnect\n');
    
    log('yellow', '2. Update all imports:');
    log('red', '   - import ... from \'./components/UnicornAutoConnect\'');
    log('green', '   + import { UnicornAutoConnect } from \'@unicorn.eth/autoconnect\'\n');
    
    log('yellow', '3. Remove old files:');
    for (const file of filesToCheck) {
      log('blue', `   rm ${file.path}`);
    }
    console.log();
    
    log('yellow', '4. Test your app:');
    log('blue', '   npm run dev\n');
    
    log('yellow', '5. Commit changes:');
    log('blue', '   git add .');
    log('blue', '   git commit -m "chore: migrate to @unicorn.eth/autoconnect package"\n');
  } else {
    log('green', '✅ Migration appears complete!');
    log('blue', '\nTest your app to make sure everything works:');
    log('blue', '   npm run dev\n');
  }

  header('📚 Resources');
  log('blue', 'Documentation: https://github.com/MyUnicornAccount/autoconnect');
  log('blue', 'Issues: https://github.com/MyUnicornAccount/autoconnect/issues');
  log('blue', 'Discord: https://discord.gg/unicorn\n');
}

main().catch(console.error);