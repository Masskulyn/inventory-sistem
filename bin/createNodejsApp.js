#!/usr/bin/env node

const util = require("util");
const path = require("path");
const fs = require("fs");
const { exec, execSync } = require("child_process");

// Promisify exec
const runCmd = util.promisify(exec);

// Cek apakah user punya yarn
async function hasYarn() {
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Validasi argumen (nama folder project)
if (process.argv.length < 3) {
  console.log("❗ Harap tentukan nama folder project.");
  console.log("Contoh:");
  console.log("    npx create-nodejs-app my-app");
  process.exit(1);
}

// Setup path
const folderName = process.argv[2];
const ownPath = process.cwd();
const appPath = path.join(ownPath, folderName);
const repo = "https://github.com/zexoverz/inventory-system";

// Cek apakah folder sudah ada
if (fs.existsSync(appPath)) {
  console.error("❗ Folder sudah ada. Gunakan nama lain.");
  process.exit(1);
}

// Mulai setup
async function setup() {
  try {
    console.log(`🚀 Meng-clone project dari ${repo}`);
    await runCmd(`git clone --depth 1 ${repo} ${folderName}`);
    console.log("✅ Clone berhasil.\n");

    process.chdir(appPath);

    // Install dependencies
    const useYarn = await hasYarn();
    console.log("📦 Menginstall dependencies...");
    await runCmd(useYarn ? "yarn install" : "npm install");
    console.log("✅ Dependencies berhasil diinstall.\n");

    // Salin file .env.example ke .env jika ada
    const envExamplePath = path.join(appPath, ".env.example");
    const envPath = path.join(appPath, ".env");
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log("✅ File .env berhasil dibuat dari .env.example");
    }

    // Hapus .git untuk menghilangkan riwayat repo asal
    await runCmd("npx rimraf .git");

    // Hapus file tambahan yang tidak diperlukan di production
    const filesToDelete = [
      "CHANGELOG.md",
      "CODE_OF_CONDUCT.md",
      "CONTRIBUTING.md",
      path.join("bin", "createNodejsApp.js"),
    ];
    filesToDelete.forEach((file) => {
      const filePath = path.join(appPath, file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // Hapus folder bin
    const binPath = path.join(appPath, "bin");
    if (fs.existsSync(binPath)) fs.rmdirSync(binPath, { recursive: true });

    // Hapus yarn.lock jika tidak pakai yarn
    if (!useYarn) {
      const yarnLock = path.join(appPath, "yarn.lock");
      if (fs.existsSync(yarnLock)) fs.unlinkSync(yarnLock);
    }

    console.log("\n🎉 Setup selesai!");
    console.log("Kamu bisa mulai dengan perintah:");
    console.log(`    cd ${folderName}`);
    console.log(`    ${useYarn ? "yarn dev" : "npm run dev"}`);
    console.log("\n📘 Baca README.md untuk informasi lebih lanjut.");
  } catch (err) {
    console.error("❌ Terjadi error saat setup:");
    console.error(err.message || err);
  }
}

setup();
