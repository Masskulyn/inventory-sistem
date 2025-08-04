#!/usr/bin/env node

const util = require('util');
const path = require('path');
const fs = require('fs');
const { exec, execSync } = require('child_process');

// Promisify exec
const runCmd = util.promisify(exec);

// Cek apakah user punya yarn
async function hasYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Validasi argumen (nama folder project)
if (process.argv.length < 3) {
  console.log('❗ Harap tentukan nama folder project.');
  console.log('Contoh:');
  console.log('    npx create-nodejs-app my-app');
  process.exit(1);
}

// Setup path
const folderName = process.argv[2];
const ownPath = process.cwd();
const appPath = path.join(ownPath, folderName);
const repo = 'https://github.com/zexoverz/inventory-system';

// Cek apakah folder sudah ada
if (fs.existsSync(appPath)) {
  console.error('❗ Folder sudah ada. Gunakan nama lain.');
  process.exit(1);
}

// Mulai setup
async function setup() {
  try {
    console.log(`🚀 Meng-clone project dari ${repo}`);
    await runCmd(`git clone --depth 1 ${repo} ${folderName}`);
    console.log('✅ Clone berhasil.\n');

    process.chdir(appPath);

    // Install dependencies
    const useYarn = await hasYarn();
    console.log('📦 Menginstall dependencies...');
    await runCmd(useYarn ? 'yarn install' : 'npm install');
    console.log('✅ Dependencies berhasil diinstall.\n');

    // Salin file .env.example ke .env jika ada
    c
